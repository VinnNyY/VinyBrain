"""Inventario read-only da tabela de plugins do WordPress.

O modulo apenas le o DOM de /wp-admin/plugins.php. Ele nao clica, nao envia
POST, nao executa acoes do WordPress e nao persiste HTML, cookies ou URLs.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Any


DEFAULT_ALIASES = {
    "Elementor": ["Elementor", "elementor", "elementor/elementor.php"],
    "Elementor Pro": ["Elementor Pro", "elementor-pro", "elementor-pro/elementor-pro.php"],
    "WP Rocket": ["WP Rocket", "wp-rocket", "wp-rocket/wp-rocket.php"],
    "Rank Math Pro": ["Rank Math SEO PRO", "Rank Math Pro", "seo-by-rank-math-pro"],
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


def _host(value: str) -> str:
    host = _text(value).lower().split("/", 1)[0].rstrip(".")
    return host[4:] if host.startswith("www.") else host


def normalize_aliases(alias_config: dict[str, Any] | None) -> dict[str, list[str]]:
    aliases: dict[str, list[str]] = {key: list(values) for key, values in DEFAULT_ALIASES.items()}
    if not isinstance(alias_config, dict):
        return aliases
    for name, payload in alias_config.items():
        if isinstance(payload, dict):
            values = payload.get("aliases") or []
        elif isinstance(payload, list):
            values = payload
        else:
            values = []
        safe_values = [_text(value) for value in values if _text(value)]
        if safe_values:
            aliases[_text(name)] = safe_values
    return aliases


def aliases_for_plugin(plugin_name: str, alias_config: dict[str, Any] | None) -> list[str]:
    aliases = normalize_aliases(alias_config)
    folded_requested = _fold(plugin_name)
    for canonical, values in aliases.items():
        candidates = [canonical, *values]
        if folded_requested in {_fold(value) for value in candidates}:
            return list(dict.fromkeys([canonical, *values, plugin_name]))
    return [plugin_name]


def _safe_inner_text(locator) -> str:
    try:
        return re.sub(r"\s+", " ", locator.inner_text(timeout=800)).strip()
    except Exception:
        return ""


def _safe_attr(locator, name: str) -> str:
    try:
        return _text(locator.get_attribute(name, timeout=800))
    except Exception:
        return ""


def _count(locator) -> int:
    try:
        return locator.count()
    except Exception:
        return 0


def _first_non_empty(*values: str) -> str:
    for value in values:
        if _text(value):
            return _text(value)
    return ""


def _parse_actions(row) -> list[str]:
    actions: list[str] = []
    try:
        action_links = row.locator(".row-actions a")
        count = _count(action_links)
        for index in range(count):
            label = _fold(_safe_inner_text(action_links.nth(index)))
            if label:
                actions.append(label)
    except Exception:
        pass
    return actions


def _available_action(actions: list[str]) -> str:
    joined = " | ".join(actions)
    if "network activate" in joined or "ativar na rede" in joined:
        return "network_activate"
    if "deactivate" in joined or "desativar" in joined:
        return "deactivate"
    if "activate" in joined or "ativar" in joined:
        return "activate"
    if "update" in joined or "atualizar" in joined:
        return "update"
    if "install" in joined or "instalar" in joined:
        return "install_required"
    return "unknown" if actions else "unavailable"


def _active_state(row_class: str, available_action: str) -> str:
    folded_class = _fold(row_class)
    active_signal = "active" in folded_class and "inactive" not in folded_class
    inactive_signal = "inactive" in folded_class
    action_active = available_action == "deactivate"
    action_inactive = available_action == "activate"

    if (active_signal or action_active) and not (inactive_signal or action_inactive):
        return "sim"
    if (inactive_signal or action_inactive) and not (active_signal or action_active):
        return "nao"
    if not active_signal and not inactive_signal and available_action in {"activate", "deactivate"}:
        return "sim" if available_action == "deactivate" else "nao"
    return "incerto"


def _version_from_text(text: str) -> str:
    patterns = [
        r"(?:vers[aã]o|version)\s*([0-9][0-9a-zA-Z._-]*)",
        r"(?:v\.?)\s*([0-9][0-9a-zA-Z._-]*)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip(" .;,")
    return ""


def _warning_text(row) -> str:
    warning_selectors = [
        ".plugin-update-tr",
        ".notice",
        ".update-message",
        ".requires",
        ".error",
        ".warning",
    ]
    warnings: list[str] = []
    for selector in warning_selectors:
        text = _safe_inner_text(row.locator(selector))
        if text:
            warnings.append(text[:180])
    row_text = _safe_inner_text(row)
    folded = _fold(row_text)
    if any(term in folded for term in ["requires", "requer", "incompativel", "incompatível", "depend"]):
        warnings.append(row_text[:180])
    return " | ".join(dict.fromkeys(warnings))


def _row_snapshot(row) -> dict[str, Any]:
    row_class = _safe_attr(row, "class")
    data_plugin = _safe_attr(row, "data-plugin")
    data_slug = _safe_attr(row, "data-slug")
    name = _first_non_empty(
        _safe_inner_text(row.locator(".plugin-title strong")),
        _safe_inner_text(row.locator("td.plugin-title strong")),
        _safe_inner_text(row.locator("th strong")),
        _safe_inner_text(row.locator("strong")),
        _safe_inner_text(row.locator("a strong")),
    )
    row_text = _safe_inner_text(row)
    version = _first_non_empty(
        _safe_inner_text(row.locator(".plugin-version-author-uri")),
        _safe_inner_text(row.locator(".plugin-version")),
        _version_from_text(row_text),
    )
    actions = _parse_actions(row)
    available_action = _available_action(actions)
    active = _active_state(row_class, available_action)
    return {
        "name": name,
        "data_plugin": data_plugin,
        "data_slug": data_slug,
        "row_class": row_class,
        "version": version,
        "actions": actions,
        "available_action": available_action,
        "active": active,
        "dependency_warning": _warning_text(row),
        "row_text": row_text,
    }


def _is_candidate_row(snapshot: dict[str, Any]) -> bool:
    return bool(snapshot["data_plugin"] or snapshot["data_slug"] or snapshot["name"])


def collect_plugin_table_rows(page) -> list[dict[str, Any]]:
    preferred = page.locator("#the-list tr[data-plugin]")
    rows = preferred if _count(preferred) else page.locator("#the-list tr")
    snapshots: list[dict[str, Any]] = []
    total = _count(rows)
    for index in range(total):
        snapshot = _row_snapshot(rows.nth(index))
        if _is_candidate_row(snapshot):
            snapshots.append(snapshot)
    return snapshots


def _debug_label(snapshot: dict[str, Any]) -> str:
    name = snapshot.get("name") or "vazio"
    data_plugin = snapshot.get("data_plugin") or "vazio"
    slug = snapshot.get("data_slug") or "vazio"
    active = snapshot.get("active") or "incerto"
    action = snapshot.get("available_action") or "unknown"
    version = snapshot.get("version") or "indisponivel"
    return (
        f"{name}\n"
        f"   data-plugin: {data_plugin}\n"
        f"   slug: {slug}\n"
        f"   ativo: {active}\n"
        f"   acao disponivel: {action}\n"
        f"   versao: {version}"
    )


def print_plugin_table_debug(snapshots: list[dict[str, Any]]) -> None:
    print(f"Plugins encontrados na tabela: {len(snapshots)}")
    for index, snapshot in enumerate(snapshots, start=1):
        print(f"{index}. {_debug_label(snapshot)}")


def _match_requested_plugin(snapshot: dict[str, Any], aliases: list[str]) -> tuple[bool, float]:
    alias_slugish = {_slugify(alias) for alias in aliases}
    alias_folded = {_fold(alias) for alias in aliases}
    data_plugin = _slugify(snapshot.get("data_plugin"))
    data_slug = _slugify(snapshot.get("data_slug"))
    name = _fold(snapshot.get("name"))

    if data_plugin and data_plugin in alias_slugish:
        return True, 1.0
    if data_slug and data_slug in alias_slugish:
        return True, 0.98
    if not data_plugin and name and name in alias_folded:
        return True, 0.92
    return False, 0.0


def _classify_result(result: dict[str, Any]) -> None:
    if not result["row_found"]:
        result["activation_readiness"] = "PLUGIN NÃO INSTALADO"
        result["next_action"] = "Revisar origem e autorização antes de qualquer instalação."
        return
    if result["active"] == "incerto":
        result["activation_readiness"] = "REVISAR INVENTÁRIO"
        result["next_action"] = "Revisar os sinais da linha antes de qualquer ação."
        return
    if result["active"] == "sim":
        result["activation_readiness"] = "JÁ ATIVO"
        result["next_action"] = "Nenhuma ativação necessária. Confirmar se o ticket pode ser concluído."
        return
    if result["active"] == "nao" and result["available_action"] == "activate":
        result["activation_readiness"] = "PRONTO PARA ATIVAÇÃO ASSISTIDA"
        result["next_action"] = "Aguardar aprovação explícita para executar ativação."
        return
    if result["dependency_warning"] or result["available_action"] in {"unavailable", "unknown", "update", "network_activate", "install_required"}:
        result["activation_readiness"] = "REVISAR DEPENDÊNCIA"
        result["next_action"] = "Revisar dependências, alertas ou permissões antes de qualquer ativação."
        return
    result["activation_readiness"] = "PLUGIN NÃO IDENTIFICADO"
    result["next_action"] = "Revisar manualmente o estado do plugin antes de qualquer ação."


def inspect_requested_plugins(
    page,
    requested_plugins: list[str],
    expected_host: str,
    alias_config: dict[str, Any] | None = None,
) -> dict[str, Any]:
    current_host = page.url.split("/", 3)[2].lower() if page.url.startswith("http") else ""
    if expected_host and current_host and _host(current_host) != _host(expected_host):
        return {
            "table_rows": [],
            "requested": [
                {
                    "plugin_name": plugin,
                    "plugin_slug": "",
                    "installed": False,
                    "active": "incerto",
                    "installed_version": "",
                    "available_action": "install_required",
                    "dependency_warning": "",
                    "row_found": False,
                    "inventory_confidence": 0.0,
                    "activation_readiness": "PLUGIN NÃO IDENTIFICADO",
                    "next_action": "Revisar domínio antes de qualquer ação.",
                }
                for plugin in requested_plugins
            ],
        }

    table_rows = collect_plugin_table_rows(page)
    requested_results: list[dict[str, Any]] = []
    for requested in requested_plugins:
        aliases = aliases_for_plugin(requested, alias_config)
        best_snapshot: dict[str, Any] | None = None
        best_confidence = 0.0
        for snapshot in table_rows:
            matches, confidence = _match_requested_plugin(snapshot, aliases)
            if matches and confidence > best_confidence:
                best_snapshot = snapshot
                best_confidence = confidence
        if not best_snapshot:
            requested_results.append(
                {
                    "plugin_name": requested,
                    "plugin_slug": "",
                    "installed": False,
                    "active": "incerto",
                    "installed_version": "",
                    "available_action": "install_required",
                    "dependency_warning": "",
                    "row_found": False,
                    "inventory_confidence": 0.0,
                    "activation_readiness": "PLUGIN NÃO INSTALADO",
                    "next_action": "Revisar origem e autorização antes de qualquer instalação.",
                }
            )
            continue

        result = {
            "plugin_name": best_snapshot.get("name") or requested,
            "plugin_slug": best_snapshot.get("data_plugin") or best_snapshot.get("data_slug") or "",
            "installed": True,
            "active": best_snapshot.get("active", "incerto"),
            "installed_version": best_snapshot.get("version", ""),
            "available_action": best_snapshot.get("available_action", "unknown"),
            "dependency_warning": best_snapshot.get("dependency_warning", ""),
            "row_found": True,
            "inventory_confidence": round(best_confidence, 2),
            "activation_readiness": "",
            "next_action": "",
        }
        _classify_result(result)
        requested_results.append(result)

    return {
        "table_rows": table_rows,
        "requested": requested_results,
    }
