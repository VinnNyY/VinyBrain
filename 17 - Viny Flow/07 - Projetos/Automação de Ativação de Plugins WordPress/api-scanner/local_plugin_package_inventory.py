#!/usr/bin/env python3
"""Inventario read-only de pacotes locais de plugins WordPress.

Este script apenas inspeciona arquivos ZIP. Ele nao extrai pacotes, nao
executa PHP, nao copia arquivos, nao altera ZIPs e nao salva credenciais.
"""

from __future__ import annotations

import argparse
import dataclasses
import hashlib
import json
import os
import re
import shutil
import stat
import sys
import tempfile
import unicodedata
import zipfile
from collections import defaultdict
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


SOURCE_DEFAULT = Path("/home/vinicius-alves/Documentos")
REGISTRY_DEFAULT = Path("/home/vinicius-alves/.config/viny-integrations/plugin-packages.json")
IGNORED_DIR_NAMES = {
    "__MACOSX",
    ".git",
    ".svn",
    ".hg",
    "node_modules",
    "dist",
    "build",
    "tmp",
    "temp",
    "cache",
    ".cache",
    ".Trash",
}
COMMON_TOP_LEVEL_FILES = {
    "readme.txt",
    "readme.md",
    "license.txt",
    "license.md",
    "changelog.txt",
    "changelog.md",
    "composer.json",
    "package.json",
    "plugin.json",
}
DEFAULT_ALIAS_GROUPS = {
    "Elementor Pro": ["Elementor Pro", "elementor-pro", "elementor-pro/elementor-pro.php"],
    "WP Rocket": ["WP Rocket", "wp-rocket", "wp-rocket/wp-rocket.php"],
    "Rank Math Pro": ["Rank Math SEO PRO", "Rank Math Pro", "seo-by-rank-math-pro"],
    "Essential Addons": [
        "Essential Addons",
        "Essentials Addons",
        "essential-addons",
        "essential-addons/essential-addons.php",
        "essential-addons-for-elementor",
        "essential-addons-for-elementor-lite",
    ],
}


def _text(value: Any) -> str:
    return "" if value is None else str(value).strip()


def _fold(value: Any) -> str:
    normalized = unicodedata.normalize("NFKD", _text(value).lower())
    return "".join(char for char in normalized if not unicodedata.combining(char))


def _slugify(value: Any) -> str:
    folded = _fold(value)
    folded = re.sub(r"[^a-z0-9/._-]+", "-", folded)
    folded = re.sub(r"-+", "-", folded)
    return folded.strip("-")


def _humanize_slug(value: str) -> str:
    text = _text(value).replace("_", "-").strip("/ ")
    text = Path(text).stem if "/" in text or text.endswith(".php") else text
    text = re.sub(r"[-_]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.title() if text else ""


def _safe_name(path: Path) -> str:
    return path.name.lower()


def _is_hidden(path: Path) -> bool:
    return any(part.startswith(".") for part in path.parts)


def _is_ignored_dirname(name: str) -> bool:
    return name.startswith(".") or name in IGNORED_DIR_NAMES


def _is_zip_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() == ".zip" and not _is_hidden(path)


def _version_key(version: str) -> tuple:
    if not version:
        return ()
    tokens = re.findall(r"\d+|[A-Za-z]+", version)
    key: list[tuple[int, Any]] = []
    for token in tokens:
        if token.isdigit():
            key.append((0, int(token)))
        else:
            key.append((1, token.lower()))
    return tuple(key)


def compare_versions(left: str, right: str) -> int:
    left_key = _version_key(left)
    right_key = _version_key(right)
    if left_key == right_key:
        return 0
    return 1 if left_key > right_key else -1


def canonical_aliases(alias_groups: dict[str, Any] | None = None) -> dict[str, list[str]]:
    aliases: dict[str, list[str]] = {key: list(values) for key, values in DEFAULT_ALIAS_GROUPS.items()}
    if not isinstance(alias_groups, dict):
        return aliases
    for key, value in alias_groups.items():
        if isinstance(value, dict):
            values = value.get("aliases") or []
        elif isinstance(value, list):
            values = value
        else:
            values = []
        safe_values = [_text(item) for item in values if _text(item)]
        if safe_values:
            aliases[_text(key)] = safe_values
    return aliases


def _alias_match(value: str, alias_groups: dict[str, list[str]]) -> str:
    folded_value = _fold(value)
    slugified_value = _slugify(value)
    for canonical, aliases in alias_groups.items():
        pool = [canonical, *aliases]
        if folded_value and folded_value in {_fold(item) for item in pool}:
            return canonical
        if slugified_value and slugified_value in {_slugify(item) for item in pool}:
            return canonical
    return ""


def _family_label(name: str, slug: str, main_php: str, alias_groups: dict[str, list[str]]) -> str:
    for candidate in (name, slug, main_php):
        matched = _alias_match(candidate, alias_groups)
        if matched:
            return matched
    folded_name = _fold(name)
    if folded_name.startswith("jet") or "crocoblock" in folded_name:
        return name or _humanize_slug(slug) or _humanize_slug(main_php)
    return name or _humanize_slug(slug) or _humanize_slug(main_php)


def _should_skip_file(name: str) -> bool:
    basename = _safe_name(Path(name))
    if basename.startswith("."):
        return True
    if basename in {"thumbs.db", "desktop.ini"}:
        return True
    return False


def _discover_zip_paths(source_root: Path) -> list[Path]:
    zip_paths: list[Path] = []
    for current_root, dirs, files in os.walk(source_root):
        root_path = Path(current_root)
        dirs[:] = [item for item in dirs if not _is_ignored_dirname(item) and not item.startswith(".")]
        if _is_hidden(root_path) and root_path != source_root:
            continue
        for filename in files:
            if _should_skip_file(filename):
                continue
            if filename.lower().endswith(".zip"):
                zip_paths.append(root_path / filename)
    return sorted(zip_paths)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _parse_wp_headers(content: bytes) -> dict[str, str]:
    text = content.decode("utf-8", errors="ignore")
    headers = {}
    patterns = {
        "plugin_name": r"Plugin Name:\s*(.+)",
        "version": r"Version:\s*(.+)",
        "description": r"Description:\s*(.+)",
        "text_domain": r"Text Domain:\s*(.+)",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            headers[key] = match.group(1).strip()
    return headers


def _expected_main_name(main_php: str) -> str:
    main_file = Path(main_php).name
    return _slugify(main_file)


def _collect_zip_details(path: Path) -> dict[str, Any]:
    stat_result = path.stat()
    data = {
        "file_name": path.name,
        "package_path": str(path.resolve()),
        "size_bytes": stat_result.st_size,
        "modified_at": datetime.fromtimestamp(stat_result.st_mtime, timezone.utc).isoformat(),
        "sha256": _sha256(path),
        "zip_integrity": False,
        "zip_error": "",
        "root_dirs": [],
        "multiple_root_dirs": False,
        "file_count": 0,
        "php_file_count": 0,
        "unexpected_files": [],
        "main_php": "",
        "plugin_name": "",
        "slug": "",
        "version": "",
        "description": "",
        "text_domain": "",
        "validation_status": "INVALID_PACKAGE",
        "version_status": "",
        "status": "INVALID_PACKAGE",
        "selected_for_installation": False,
        "notes": "",
        "family": "",
    }

    try:
        with zipfile.ZipFile(path) as archive:
            bad_member = archive.testzip()
            if bad_member is not None:
                data["zip_error"] = f"arquivo corrompido: {bad_member}"
                return data
            data["zip_integrity"] = True
            names = [info.filename for info in archive.infolist() if not info.is_dir()]
            data["file_count"] = len(names)

            top_levels: list[str] = []
            for member in names:
                normalized = member.lstrip("./")
                parts = Path(normalized).parts
                if not parts:
                    continue
                top = parts[0]
                if top and not _is_ignored_dirname(top) and top not in top_levels:
                    top_levels.append(top)
            data["root_dirs"] = top_levels
            data["multiple_root_dirs"] = len(top_levels) > 1

            php_members = [name for name in names if name.lower().endswith(".php")]
            data["php_file_count"] = len(php_members)
            unexpected = []
            for member in names:
                parts = Path(member).parts
                if not parts:
                    continue
                root = parts[0]
                if root in top_levels:
                    continue
                if len(parts) == 1 and _safe_name(Path(member)) not in COMMON_TOP_LEVEL_FILES and not member.lower().endswith(".php"):
                    unexpected.append(member)
            data["unexpected_files"] = unexpected[:10]

            best_score = -1
            best_main = ""
            best_headers: dict[str, str] = {}
            for member in php_members:
                try:
                    info = archive.getinfo(member)
                    with archive.open(info) as handle:
                        content = handle.read(16384)
                except Exception:
                    continue

                headers = _parse_wp_headers(content)
                score = 0
                if headers.get("plugin_name"):
                    score += 100
                if headers.get("version"):
                    score += 20
                if headers.get("text_domain"):
                    score += 10
                if headers.get("description"):
                    score += 5
                if len(Path(member).parts) <= 2:
                    score += 10
                if top_levels:
                    first = Path(member).parts[0]
                    if first in top_levels:
                        score += 5
                if _expected_main_name(member) in _slugify(headers.get("plugin_name", "")):
                    score += 5
                if score > best_score:
                    best_score = score
                    best_main = member
                    best_headers = headers

            if best_main:
                data["main_php"] = best_main
                data["plugin_name"] = best_headers.get("plugin_name", "")
                data["version"] = best_headers.get("version", "")
                data["description"] = best_headers.get("description", "")
                data["text_domain"] = best_headers.get("text_domain", "")

            if not data["plugin_name"]:
                if len(top_levels) == 1:
                    data["plugin_name"] = _humanize_slug(top_levels[0])
                elif best_main:
                    data["plugin_name"] = _humanize_slug(Path(best_main).stem)

            if not data["slug"]:
                if best_main:
                    parts = Path(best_main).parts
                    if len(parts) > 1:
                        data["slug"] = parts[0]
                    else:
                        data["slug"] = Path(best_main).stem
                elif len(top_levels) == 1:
                    data["slug"] = top_levels[0]

            if not data["main_php"] and php_members:
                data["main_php"] = php_members[0]
                if not data["slug"]:
                    data["slug"] = Path(php_members[0]).stem

            has_structure = bool(data["main_php"]) or bool(php_members)
            plugin_like = bool(data["plugin_name"] or data["slug"] or data["main_php"])

            if not has_structure:
                data["validation_status"] = "INVALID_PACKAGE"
                data["notes"] = "arquivo ZIP sem arquivos PHP identificaveis"
            elif data["zip_integrity"] and data["main_php"] and data["plugin_name"]:
                if data["multiple_root_dirs"]:
                    data["validation_status"] = "REVIEW_PACKAGE"
                    data["notes"] = "estrutura ambigua com multiplas pastas raiz"
                elif not data["version"]:
                    data["validation_status"] = "REVIEW_PACKAGE"
                    data["notes"] = "cabecalho WordPress encontrado, mas versao ausente"
                else:
                    data["validation_status"] = "VALID_PACKAGE"
                    data["notes"] = "estrutura WordPress reconhecida"
            elif data["zip_integrity"] and has_structure and plugin_like:
                data["validation_status"] = "REVIEW_PACKAGE"
                if not data["plugin_name"]:
                    data["notes"] = "possivel plugin, mas nome do cabecalho nao encontrado"
                elif not data["main_php"]:
                    data["notes"] = "nome identificado, mas arquivo principal nao confirmado"
                else:
                    data["notes"] = "estrutura possivelmente valida, mas ambigua"
            else:
                data["validation_status"] = "INVALID_PACKAGE"
                data["notes"] = "nao foi possivel reconhecer estrutura WordPress"
            data["status"] = data["validation_status"]
    except zipfile.BadZipFile as exc:
        data["zip_error"] = f"ZIP corrompido: {exc}"
        data["validation_status"] = "INVALID_PACKAGE"
        data["status"] = "INVALID_PACKAGE"
    except OSError as exc:
        data["zip_error"] = f"erro ao ler ZIP: {exc}"
        data["validation_status"] = "INVALID_PACKAGE"
        data["status"] = "INVALID_PACKAGE"

    data["family"] = _family_label(data["plugin_name"], data["slug"], data["main_php"], canonical_aliases())
    return data


def _prepare_packages(records: list[dict[str, Any]]) -> None:
    families: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        families[record["family"]].append(record)

    for family, family_records in families.items():
        if len(family_records) == 1:
            record = family_records[0]
            if record["validation_status"] == "VALID_PACKAGE":
                record["version_status"] = "LATEST_CANDIDATE"
                record["selected_for_installation"] = True
            continue

        version_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for record in family_records:
            version_groups[_text(record["version"])].append(record)

        if len(version_groups) == 1:
            version, duplicate_records = next(iter(version_groups.items()))
            if version:
                for record in duplicate_records:
                    record["version_status"] = "DUPLICATE_VERSION"
                    record["notes"] = (record["notes"] + "; " if record["notes"] else "") + "duplicado localmente"
            continue

        valid_records = [record for record in family_records if record["version"]]
        if not valid_records:
            continue
        latest = max(valid_records, key=lambda item: _version_key(item["version"]))
        for record in family_records:
            if not record["version"]:
                continue
            if record is latest:
                record["version_status"] = "LATEST_CANDIDATE"
                if record["validation_status"] == "VALID_PACKAGE":
                    record["selected_for_installation"] = True
            else:
                record["version_status"] = "OLDER_VERSION"
                record["notes"] = (record["notes"] + "; " if record["notes"] else "") + "versao mais antiga que o candidato local"

    for record in records:
        if record["validation_status"] == "VALID_PACKAGE" and not record["version_status"]:
            record["version_status"] = "LATEST_CANDIDATE"
            record["selected_for_installation"] = True


def scan_source(source: Path) -> dict[str, Any]:
    zip_paths = _discover_zip_paths(source)
    records = [_collect_zip_details(path) for path in zip_paths]
    _prepare_packages(records)
    families: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        families[record["family"]].append(record)
    return {
        "source": str(source.resolve()),
        "zip_count": len(zip_paths),
        "packages": records,
        "families": families,
    }


def _count_status(records: Iterable[dict[str, Any]], status: str) -> int:
    return sum(1 for item in records if item["validation_status"] == status)


def _count_version_status(records: Iterable[dict[str, Any]], status: str) -> int:
    return sum(1 for item in records if item["version_status"] == status)


def _pick_family_candidate(records: list[dict[str, Any]], family_name: str) -> dict[str, Any] | None:
    aliases = canonical_aliases()
    candidates = [record for record in records if _family_label(record["plugin_name"], record["slug"], record["main_php"], aliases) == family_name]
    selected = [record for record in candidates if record["selected_for_installation"]]
    if selected:
        return selected[0]
    if candidates:
        return max(candidates, key=lambda item: _version_key(item["version"]))
    return None


def _print_package_summary(result: dict[str, Any]) -> None:
    packages = result["packages"]
    families = result["families"]
    valid = _count_status(packages, "VALID_PACKAGE")
    review = _count_status(packages, "REVIEW_PACKAGE")
    invalid = _count_status(packages, "INVALID_PACKAGE")
    duplicates = _count_version_status(packages, "DUPLICATE_VERSION")
    older = _count_version_status(packages, "OLDER_VERSION")
    latest = _count_version_status(packages, "LATEST_CANDIDATE")

    print("Inventario local de pacotes WordPress")
    print(f"Diretorio analisado: {result['source']}")
    print(f"ZIPs encontrados: {result['zip_count']}")
    print(f"Pacotes WordPress validos: {valid}")
    print(f"Pacotes para revisao: {review}")
    print(f"Pacotes invalidos: {invalid}")
    print(f"Duplicados: {duplicates}")
    print(f"Versoes antigas: {older}")
    print(f"Candidatos locais mais recentes: {latest}")

    targets = ["Elementor Pro", "WP Rocket"]
    for target in targets:
        candidate = _pick_family_candidate(packages, target)
        print("")
        print(f"{target}:")
        if not candidate:
            print("- arquivo encontrado: nao")
            print("- versao: indisponivel")
            print("- slug: indisponivel")
            print("- status: PLUGIN NÃO INSTALADO")
            print("- candidato selecionavel: nao")
            continue
        print("- arquivo encontrado: sim")
        print(f"- arquivo: {candidate['file_name']}")
        print(f"- versao: {candidate['version'] or 'indisponivel'}")
        print(f"- slug: {candidate['slug'] or 'indisponivel'}")
        status_text = candidate["status"]
        if candidate["version_status"]:
            status_text = f"{status_text} / {candidate['version_status']}"
        print(f"- status: {status_text}")
        print(f"- candidato selecionavel: {'sim' if candidate['selected_for_installation'] else 'nao'}")

    other_packages = [
        record
        for record in packages
        if record["validation_status"] in {"VALID_PACKAGE", "REVIEW_PACKAGE"}
        and _family_label(record["plugin_name"], record["slug"], record["main_php"], canonical_aliases()) not in {"Elementor Pro", "WP Rocket"}
    ]
    print("")
    print(f"Outros plugins WordPress catalogados: {len(other_packages)}")


def _write_registry(result: dict[str, Any], registry_path: Path) -> Path:
    registry_path.parent.mkdir(parents=True, exist_ok=True)
    if registry_path.exists():
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        backup_path = registry_path.with_name(f"{registry_path.stem}.bak-{stamp}{registry_path.suffix}")
        shutil.copy2(registry_path, backup_path)
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": result["source"],
        "packages": [
            {
                "plugin_name": record["plugin_name"],
                "slug": record["slug"],
                "version": record["version"],
                "package_path": record["package_path"],
                "sha256": record["sha256"],
                "status": record["status"],
                "validation_status": record["validation_status"],
                "version_status": record["version_status"],
                "selected_for_installation": record["selected_for_installation"],
                "notes": record["notes"],
            }
            for record in result["packages"]
        ],
    }
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False, dir=str(registry_path.parent), prefix=registry_path.stem + "-", suffix=".tmp") as handle:
        temp_path = Path(handle.name)
        json.dump(payload, handle, ensure_ascii=False, indent=2)
    os.replace(temp_path, registry_path)
    registry_path.chmod(0o600)
    return registry_path


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Inventario local read-only de pacotes WordPress.")
    parser.add_argument("--source", default=str(SOURCE_DEFAULT), help="Diretorio raiz para buscar ZIPs.")
    parser.add_argument("--dry-run", action="store_true", help="Mostra o inventario sem escrever o registro.")
    parser.add_argument("--write-registry", action="store_true", help="Escreve ou atualiza o registro externo aprovado.")
    parser.add_argument("--registry-path", default=str(REGISTRY_DEFAULT), help="Caminho do registro externo.")
    parser.add_argument("--aliases", default=None, help="Arquivo JSON opcional com aliases adicionais.")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_argument_parser()
    args = parser.parse_args(argv)

    source = Path(args.source)
    if not source.exists():
        print(f"Falha: diretorio nao encontrado: {source}")
        return 2
    if not source.is_dir():
        print(f"Falha: source nao e um diretorio: {source}")
        return 2

    alias_groups = {}
    if args.aliases:
        alias_path = Path(args.aliases)
        if alias_path.exists():
            alias_groups = json.loads(alias_path.read_text(encoding="utf-8"))

    global DEFAULT_ALIAS_GROUPS
    if alias_groups:
        DEFAULT_ALIAS_GROUPS = canonical_aliases(alias_groups)

    result = scan_source(source)
    _print_package_summary(result)

    if args.write_registry:
        registry_path = Path(args.registry_path)
        written = _write_registry(result, registry_path)
        print("")
        print(f"Registro externo atualizado: {written}")
        print("Permissao aplicada: chmod 600")

    print("")
    print("Garantias")
    print("- nenhum ZIP foi alterado")
    print("- nenhum ZIP foi movido")
    print("- nenhum ZIP foi copiado para o vault")
    print("- nenhum PHP foi executado")
    print("- nenhum plugin foi instalado")
    print("- nenhuma licenca foi impressa")
    print("- nenhum segredo foi salvo")
    print("- somente inspeção read-only foi realizada")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
