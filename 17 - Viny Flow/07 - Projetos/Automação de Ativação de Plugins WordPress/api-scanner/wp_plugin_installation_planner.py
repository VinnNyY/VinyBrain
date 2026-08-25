"""Planejador read-only de instalacao/ativacao de plugins WordPress.

Este modulo apenas le o registro externo de pacotes e cruza com o inventario
read-only do WordPress. Ele nao envia ZIP, nao executa POST, nao clica em
nenhum botao e nao altera o WordPress.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Iterable

from local_plugin_package_inventory import scan_source as scan_local_packages


DEFAULT_PACKAGE_REGISTRY_PATH = Path("/home/vinicius-alves/.config/viny-integrations/plugin-packages.json")
DEFAULT_LOCAL_PACKAGES_SOURCE = Path("/home/vinicius-alves/Documentos")
REQUESTED_PLUGIN_SLUGS = {
    "Elementor Pro": ["elementor-pro"],
    "WP Rocket": ["wp-rocket"],
    "Essential Addons": ["essential-addons", "essential-addons-for-elementor-lite", "essential-addons-for-elementor"],
    "Rank Math Pro": ["seo-by-rank-math-pro"],
}


def _text(value: Any) -> str:
    return "" if value is None else str(value).strip()


def _fold(value: Any) -> str:
    return _text(value).lower()


def _slugify(value: Any) -> str:
    text = _fold(value)
    allowed = []
    last_dash = False
    for char in text:
        if char.isalnum() or char in {"/", ".", "-", "_"}:
            allowed.append(char)
            last_dash = False
        elif not last_dash:
            allowed.append("-")
            last_dash = True
    return "".join(allowed).strip("-")


def load_package_registry(path: Path = DEFAULT_PACKAGE_REGISTRY_PATH) -> dict[str, Any]:
    if not path.exists():
        return {"generated_at": "", "source": "", "packages": []}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError("Registro externo de pacotes invalido.")
    packages = data.get("packages") or []
    if not isinstance(packages, list):
        data["packages"] = []
    return data


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _expected_slugs(plugin_name: str) -> set[str]:
    aliases = REQUESTED_PLUGIN_SLUGS.get(plugin_name, [])
    return {_slugify(alias) for alias in aliases if _text(alias)}


def _plugin_inventory_lookup(plugin_inventory: Iterable[dict[str, Any]], plugin_name: str) -> dict[str, Any]:
    wanted = _fold(plugin_name)
    for item in plugin_inventory:
        current = _fold(item.get("plugin_name"))
        if current == wanted:
            return dict(item)
    return {
        "plugin_name": plugin_name,
        "plugin_slug": "",
        "installed": False,
        "active": "incerto",
        "installed_version": "",
        "available_action": "install_required",
        "dependency_warning": "",
        "row_found": False,
        "inventory_confidence": 0.0,
        "activation_readiness": "PLUGIN NÃO IDENTIFICADO",
        "next_action": "Revisar manualmente o estado do plugin antes de qualquer ação.",
    }


def _registry_candidates(registry: dict[str, Any], plugin_name: str) -> list[dict[str, Any]]:
    packages = registry.get("packages") or []
    expected_slugs = _expected_slugs(plugin_name)
    wanted_folded = _fold(plugin_name)
    candidates: list[dict[str, Any]] = []
    for package in packages:
        if not isinstance(package, dict):
            continue
        package_slug = _slugify(package.get("slug"))
        package_name = _fold(package.get("plugin_name"))
        if expected_slugs and package_slug in expected_slugs:
            candidates.append(package)
            continue
        if package_name == wanted_folded:
            candidates.append(package)
    return candidates


def _local_candidates(source: Path, plugin_name: str) -> list[dict[str, Any]]:
    try:
        inventory = scan_local_packages(source)
    except Exception:
        return []
    packages = inventory.get("packages") or []
    expected_slugs = _expected_slugs(plugin_name)
    wanted_folded = _fold(plugin_name)
    candidates: list[dict[str, Any]] = []
    for package in packages:
        if not isinstance(package, dict):
            continue
        package_slug = _slugify(package.get("slug"))
        package_name = _fold(package.get("plugin_name"))
        package_file = _fold(Path(_text(package.get("package_path"))).name)
        if expected_slugs and (
            package_slug in expected_slugs
            or package_name in {_fold(item) for item in [plugin_name, *expected_slugs]}
            or package_file in {_fold(item) for item in [plugin_name, *expected_slugs]}
        ):
            candidates.append(package)
            continue
        if package_name == wanted_folded:
            candidates.append(package)
    return candidates


def _package_debug_row(package: dict[str, Any] | None, status: str, reason: str) -> dict[str, Any]:
    if not package:
        return {
            "package_basename": "",
            "plugin_name": "",
            "slug": "",
            "version": "",
            "status": status,
            "reason": reason,
        }
    return {
        "package_basename": Path(_text(package.get("package_path"))).name or _text(package.get("file_name")),
        "plugin_name": _text(package.get("plugin_name")),
        "slug": _text(package.get("slug")),
        "version": _text(package.get("version")),
        "status": status,
        "reason": reason,
    }


def _pick_package_candidate(candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not candidates:
        return None
    for package in candidates:
        if package.get("selected_for_installation"):
            return package
    for package in candidates:
        if _fold(package.get("version_status")) == "latest_candidate":
            return package
    return candidates[0]


def _package_match_status(package: dict[str, Any] | None) -> tuple[str, str]:
    if not package:
        return "PREMIUM_PACKAGE_NOT_FOUND", "nenhum pacote aprovado encontrado"
    status = _text(package.get("status"))
    validation_status = _text(package.get("validation_status")) or status
    version_status = _text(package.get("version_status"))
    if _fold(status) != "valid_package" or _fold(validation_status) != "valid_package":
        return "PACKAGE_INVALID", "pacote local ou registro marcado como invalido"
    if _fold(version_status) not in {"latest_candidate", "duplicate_version"} and version_status:
        return "REVIEW_PACKAGE", "versao local nao selecionada com seguranca"
    if not version_status:
        return "REVIEW_PACKAGE", "status de versao ausente"
    return "PREMIUM_PACKAGE_RESOLVED", "plugin name/slugs correspondem ao pacote aprovado"


def _resolve_package_candidate(plugin_name: str, registry: dict[str, Any]) -> tuple[dict[str, Any] | None, dict[str, Any]]:
    registry_candidates = _registry_candidates(registry, plugin_name)
    local_inventory = scan_local_packages(DEFAULT_LOCAL_PACKAGES_SOURCE)
    local_candidates = _local_candidates(DEFAULT_LOCAL_PACKAGES_SOURCE, plugin_name)
    selected = _pick_package_candidate(registry_candidates) or _pick_package_candidate(local_candidates)
    if selected and selected in registry_candidates:
        match_status, reason = _package_match_status(selected)
    elif selected and selected in local_candidates:
        match_status, reason = _package_match_status(selected)
        if match_status == "PREMIUM_PACKAGE_RESOLVED":
            reason = "pacote local identificado e aprovado pelo inventario"
    else:
        match_status, reason = "PREMIUM_PACKAGE_NOT_FOUND", "nenhum pacote aprovado encontrado"

    debug = {
        "registry_candidates": [_package_debug_row(item, *_package_match_status(item)) for item in registry_candidates],
        "local_candidates": [_package_debug_row(item, *_package_match_status(item)) for item in local_candidates],
        "selected": _package_debug_row(selected, match_status, reason),
        "local_zip_count": local_inventory.get("zip_count", 0),
    }
    return selected, debug


def _registry_state(package: dict[str, Any]) -> tuple[bool, str, list[str]]:
    reasons: list[str] = []
    package_path = Path(_text(package.get("package_path")))
    if not package_path.exists():
        return False, "PACKAGE_NOT_FOUND", ["pacote nao encontrado no caminho registrado"]
    if package_path.suffix.lower() != ".zip":
        return False, "PACKAGE_INVALID", ["arquivo registrado nao e ZIP"]

    try:
        current_hash = _sha256(package_path)
    except OSError as exc:
        return False, "PACKAGE_INVALID", [f"falha ao ler pacote: {exc}"]

    recorded_hash = _text(package.get("sha256"))
    if recorded_hash and current_hash != recorded_hash:
        return False, "PACKAGE_HASH_CHANGED", ["hash SHA-256 divergente do registro"]

    status = _text(package.get("status"))
    validation_status = _text(package.get("validation_status")) or status
    version_status = _text(package.get("version_status"))
    if _fold(status) != "valid_package" or _fold(validation_status) != "valid_package":
        return False, "PACKAGE_INVALID", ["pacote marcado como invalido no registro"]
    if _fold(version_status) not in {"latest_candidate", "duplicate_version"} and version_status:
        reasons.append("versao nao selecionada com seguranca")
        return True, "REVIEW_VERSION", reasons
    if not version_status:
        reasons.append("status de versao ausente")
        return True, "REVIEW_VERSION", reasons
    if not _text(package.get("selected_for_installation")) and package.get("selected_for_installation") is not True:
        reasons.append("pacote nao marcado como selecionado")
        return True, "REVIEW_VERSION", reasons
    return True, "VALIDATED", []


def _wordpress_state(plugin_inventory_item: dict[str, Any]) -> str:
    if not plugin_inventory_item.get("row_found"):
        return "NÃO INSTALADO"
    if plugin_inventory_item.get("active") == "sim":
        return "ATIVO"
    if plugin_inventory_item.get("active") == "nao":
        return "INSTALADO_INATIVO"
    return "INCONCLUSIVO"


def _planned_action(current_state: str, package_ok: bool) -> str:
    if current_state == "ATIVO":
        return "NO_ACTION_REQUIRED"
    if current_state == "INSTALADO_INATIVO" and package_ok:
        return "ACTIVATION_ONLY"
    if current_state == "NÃO INSTALADO" and package_ok:
        return "INSTALL_AND_ACTIVATE"
    if current_state == "INCONCLUSIVO":
        return "REVIEW_DEPENDENCY"
    return "PACKAGE_INVALID"


def _approval_status(planned_action: str, blocking_reasons: list[str]) -> str:
    if blocking_reasons:
        if any(reason.startswith("pacote") or "hash" in reason or "caminho" in reason for reason in blocking_reasons):
            return "BLOCKED"
        return "REVIEW_REQUIRED"
    if planned_action == "NO_ACTION_REQUIRED":
        return "NO_ACTION_REQUIRED"
    if planned_action in {"INSTALL_AND_ACTIVATE", "ACTIVATION_ONLY"}:
        return "READY_FOR_HUMAN_APPROVAL"
    if planned_action == "ALREADY_ACTIVE":
        return "READY_FOR_HUMAN_APPROVAL"
    return "REVIEW_REQUIRED"


def build_installation_plan(preflight: dict[str, Any], registry_path: Path = DEFAULT_PACKAGE_REGISTRY_PATH) -> dict[str, Any]:
    registry = load_package_registry(registry_path)
    requested_plugins = list(preflight.get("requested_plugins") or preflight.get("plugins_detected") or [])
    inventory = list(preflight.get("plugin_inventory") or [])
    plans: list[dict[str, Any]] = []
    global_blocking: list[str] = []
    ticket_closed = _fold(preflight.get("status")) in {"closed", "resolved", "fechado", "resolvido"}

    ticket_ready = (
        not ticket_closed
        and
        _fold(preflight.get("customer_authorization")) == "sim"
        and bool(_text(preflight.get("domain_detected")))
        and bool(preflight.get("wp_access_validation_executed"))
        and _fold(preflight.get("wp_access_link_status")) == "accessible"
        and bool(preflight.get("wp_admin_accessible"))
        and bool(preflight.get("plugins_page_accessible"))
    )
    if not ticket_ready:
        global_blocking.append("pré-requisitos do ticket não atendidos")
    if ticket_closed:
        global_blocking.append("ticket fechado ou resolvido")

    for requested in requested_plugins:
        inventory_item = _plugin_inventory_lookup(inventory, requested)
        package, package_debug = _resolve_package_candidate(requested, registry)

        package_found = bool(package)
        package_basename = Path(_text(package.get("package_path"))).name if package else ""
        package_version = _text(package.get("version")) if package else ""
        package_slug = _text(package.get("slug")) if package else ""
        package_status = _text(package.get("status")) if package else "PACKAGE_NOT_FOUND"
        package_hash_valid = False
        package_match_status, package_match_reason = _package_match_status(package)
        blocking_reasons = list(global_blocking)

        package_ok = False
        if package:
            package_ok, package_state, package_reasons = _registry_state(package)
            package_hash_valid = bool(package_ok)
            package_status = package_state if package_state != "VALIDATED" else package_status
            if package_state != "VALIDATED":
                blocking_reasons.extend(package_reasons)
            else:
                if _fold(package.get("version_status")) != "latest_candidate":
                    blocking_reasons.append("versão local não é candidata final")
                    package_status = "REVIEW_VERSION"
                if not _text(package.get("selected_for_installation")) and package.get("selected_for_installation") is not True:
                    blocking_reasons.append("pacote não marcado como selecionado")
                    package_status = "REVIEW_VERSION"
                if not package_status:
                    package_status = "VALID_PACKAGE"
        else:
            package_status = "PACKAGE_NOT_FOUND"
            blocking_reasons.append("pacote não encontrado no registro externo")
            package_match_status = "PREMIUM_PACKAGE_NOT_FOUND"
            package_match_reason = "nenhum pacote aprovado encontrado"

        current_state = _wordpress_state(inventory_item)
        if _fold(inventory_item.get("available_action")) in {"unknown", "unavailable"}:
            blocking_reasons.append("ação do plugin no WordPress exige revisão")
        if _text(inventory_item.get("dependency_warning")):
            blocking_reasons.append("alerta ou dependência visível no WordPress")
        if current_state == "INCONCLUSIVO":
            blocking_reasons.append("estado atual do plugin no WordPress não conclusivo")

        if ticket_closed:
            planned_action = "NO_ACTION_REQUIRED"
            approval_status = "NO_ACTION_REQUIRED"
            package_hash_valid = bool(package and package_ok) if package else False
            installation_required = False
            activation_required = False
            execution_performed = False
            current_blocking = []
            final_result = "NO_ACTION_REQUIRED"
        else:
            planned_action = _planned_action(current_state, package_ok and package_hash_valid and package_status == "VALID_PACKAGE")
            if current_state == "ATIVO":
                planned_action = "NO_ACTION_REQUIRED"
            if package_status == "PACKAGE_NOT_FOUND":
                planned_action = "PACKAGE_NOT_FOUND"
            elif package_status == "PACKAGE_INVALID":
                planned_action = "PACKAGE_INVALID"
            elif package_status == "PACKAGE_HASH_CHANGED":
                planned_action = "PACKAGE_HASH_CHANGED"
            elif package_status == "REVIEW_VERSION":
                planned_action = "REVIEW_VERSION"
            elif planned_action == "REVIEW_DEPENDENCY":
                blocking_reasons.append("dependência ou alerta operacional")

            if current_state == "ATIVO":
                package_hash_valid = bool(package and package_ok)

            approval_status = _approval_status(planned_action, blocking_reasons)
            if current_state == "ATIVO":
                approval_status = "NO_ACTION_REQUIRED"
            if package_status in {"PACKAGE_NOT_FOUND", "PACKAGE_INVALID", "PACKAGE_HASH_CHANGED"}:
                approval_status = "BLOCKED"
            elif package_status == "REVIEW_VERSION":
                approval_status = "REVIEW_REQUIRED"
            elif current_state == "INCONCLUSIVO":
                approval_status = "REVIEW_REQUIRED"

            installation_required = current_state != "ATIVO" and planned_action == "INSTALL_AND_ACTIVATE"
            activation_required = current_state != "ATIVO" and planned_action in {"INSTALL_AND_ACTIVATE", "ACTIVATION_ONLY"}
            if package_found and package_status == "VALID_PACKAGE" and planned_action in {"INSTALL_AND_ACTIVATE", "ACTIVATION_ONLY", "ALREADY_ACTIVE", "NO_ACTION_REQUIRED"}:
                execution_performed = False
            else:
                execution_performed = False

            if current_state == "ATIVO":
                current_blocking = []
            elif package_status == "VALID_PACKAGE" and planned_action in {"INSTALL_AND_ACTIVATE", "ACTIVATION_ONLY"}:
                current_blocking = []
            else:
                current_blocking = [reason for reason in blocking_reasons if reason]

            final_result = "NO_ACTION_REQUIRED" if current_state == "ATIVO" else planned_action

        plans.append(
            {
                "plugin_name": requested,
                "package_found": package_found,
                "package_basename": package_basename,
                "package_version": package_version,
                "package_slug": package_slug,
                "package_match_status": package_match_status,
                "package_match_reason": package_match_reason,
                "package_match_debug": package_debug,
                "package_hash_valid": bool(package_hash_valid),
                "package_status": package_status,
                "current_wordpress_state": current_state,
                "planned_action": planned_action,
                "installation_required": installation_required,
                "activation_required": activation_required,
                "execution_performed": execution_performed,
                "approval_status": approval_status,
                "blocking_reasons": list(dict.fromkeys(current_blocking)),
                "final_result": final_result,
            }
        )

    if ticket_closed:
        overall = "BLOCKED_CLOSED_TICKET"
    elif any(plan["approval_status"] == "BLOCKED" for plan in plans):
        overall = "BLOCKED"
    elif any(plan["approval_status"] == "REVIEW_REQUIRED" for plan in plans):
        overall = "REVIEW_REQUIRED"
    else:
        overall = "READY_FOR_HUMAN_APPROVAL"

    return {
        "registry_path": str(registry_path),
        "overall_approval_status": overall,
        "plans": plans,
    }
