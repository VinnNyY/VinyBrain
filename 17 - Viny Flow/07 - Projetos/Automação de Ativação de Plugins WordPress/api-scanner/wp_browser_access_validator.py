"""Validacao read-only de acesso WordPress via navegador isolado.

Este modulo nunca persiste URL, query string, cookies, storage state,
screenshot, video, trace ou HTML. A URL completa existe apenas em memoria.
"""

from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlsplit, urlunsplit

from wp_access_validator import WPAccessValidationResult, normalize_host, validate_url_format
from wp_plugin_inventory import inspect_requested_plugins, print_plugin_table_debug


INSTALL_COMMAND = "python3 -m pip install playwright && python3 -m playwright install chromium"
BROWSER_TIMEOUT_MS = 20_000


def _safe_path(url: str) -> str:
    path = urlsplit(url).path or "/"
    return path if path.startswith("/") else f"/{path}"


def _is_login_path(url: str) -> bool:
    return "/wp-login.php" in _safe_path(url).lower()


def _diagnostics(host: str) -> dict[str, Any]:
    return {
        "browser_started": False,
        "initial_final_path": "",
        "plugins_final_path": "",
        "hosts_involved": [host] if host else [],
        "redirected_to_wp_login": False,
        "wordpress_authenticated": False,
        "plugins_page_accessible": False,
        "wordpress_markers_found": [],
        "plugins_markers_found": [],
        "requested_plugin_inventory": [],
        "technical_reason": "",
        "dependency_install_command": "",
    }


def _result(
    status: str,
    reason: str,
    admin_accessible: bool,
    plugins_accessible: bool,
    final_host: str,
    diagnostics: dict[str, Any],
) -> WPAccessValidationResult:
    diagnostics["technical_reason"] = reason
    return WPAccessValidationResult(True, status, reason, admin_accessible, plugins_accessible, final_host, diagnostics)


def _same_host(url: str, host: str) -> bool:
    return normalize_host(urlsplit(url).hostname or "") == normalize_host(host)


def _host_from_url(url: str) -> str:
    return normalize_host(urlsplit(url).hostname or "")


def _safe_hosts(hosts: list[str], *urls: str) -> list[str]:
    seen = {normalize_host(host) for host in hosts if host}
    for url in urls:
        host = _host_from_url(url)
        if host:
            seen.add(host)
    return sorted(seen)


def _has_admin_body_class(page) -> bool:
    try:
        return bool(page.locator("body.wp-admin").count())
    except Exception:
        return False


def _marker_count(page, selector: str) -> bool:
    try:
        return bool(page.locator(selector).count())
    except Exception:
        return False


def _authenticated_admin_markers(page) -> list[str]:
    markers: list[str] = []
    if _marker_count(page, "#adminmenu"):
        markers.append("id:adminmenu")
    if _marker_count(page, "#wpadminbar"):
        markers.append("id:wpadminbar")
    if _has_admin_body_class(page):
        markers.append("body-class:wp-admin")
    if _marker_count(page, "#adminmenu .wp-menu-name"):
        markers.append("admin-menu")
    if _marker_count(page, "#menu-plugins, #adminmenu a[href*='plugins.php']"):
        markers.append("menu-plugins")
    return sorted(set(markers))


def _plugins_page_markers(page) -> list[str]:
    markers: list[str] = []
    if _marker_count(page, "body.plugins-php"):
        markers.append("body-class:plugins-php")
    if _marker_count(page, ".wp-list-table.plugins, table.plugins"):
        markers.append("plugins-table")
    if _marker_count(page, "#the-list"):
        markers.append("id:the-list")
    if _marker_count(page, "a[href*='plugin-install.php']"):
        markers.append("plugin-install.php")
    try:
        if page.locator("h1").filter(has_text=re.compile(r"plugins?", re.I)).count():
            markers.append("heading:plugins")
    except Exception:
        pass
    return sorted(set(markers))


def _permission_denied(page) -> bool:
    phrases = [
        "you do not have sufficient permissions",
        "you are not allowed to access this page",
        "sorry, you are not allowed",
        "sem permissão",
        "sem permissao",
        "não tem permissão",
        "nao tem permissao",
        "acesso negado",
        "forbidden",
    ]
    for phrase in phrases:
        try:
            if page.get_by_text(re.compile(re.escape(phrase), re.I)).count():
                return True
        except Exception:
            continue
    return False


def validate_wp_access_link_with_browser(
    url: str,
    expected_domain: str,
    timeout_ms: int = BROWSER_TIMEOUT_MS,
    requested_plugins: list[str] | None = None,
    alias_config: dict[str, Any] | None = None,
    inspect_plugins: bool = False,
    debug_plugin_table: bool = False,
) -> WPAccessValidationResult:
    valid, host, reason = validate_url_format(url, expected_domain)
    diagnostics = _diagnostics(host)
    if not valid:
        status = "OFF_DOMAIN" if "domínio" in reason else "INVALID"
        return _result(status, reason, False, False, host, diagnostics)

    try:
        from playwright.sync_api import Error as PlaywrightError
        from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
        from playwright.sync_api import sync_playwright
    except ModuleNotFoundError:
        diagnostics["dependency_install_command"] = INSTALL_COMMAND
        return _result(
            "BROWSER_VALIDATION_FAILED",
            "Playwright indisponivel; instalar com: " + INSTALL_COMMAND,
            False,
            False,
            host,
            diagnostics,
        )

    browser = None
    context = None
    page = None
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            diagnostics["browser_started"] = True
            context = browser.new_context(
                accept_downloads=False,
                ignore_https_errors=False,
            )
            page = context.new_page()
            page.set_default_timeout(timeout_ms)
            page.set_default_navigation_timeout(timeout_ms)

            def route_guard(route):
                request_host = _host_from_url(route.request.url)
                if request_host and request_host != host:
                    route.abort()
                    return
                route.continue_()

            context.route("**/*", route_guard)
            page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
            page.wait_for_timeout(800)

            initial_url = page.url
            diagnostics["initial_final_path"] = _safe_path(initial_url)
            diagnostics["hosts_involved"] = _safe_hosts([host], initial_url)
            if not _same_host(initial_url, host):
                return _result("OFF_DOMAIN", "navegador redirecionou para outro domínio", False, False, _host_from_url(initial_url), diagnostics)

            initial_admin_markers = _authenticated_admin_markers(page)
            initial_is_admin = (
                _safe_path(initial_url).lower().startswith("/wp-admin/")
                and not _is_login_path(initial_url)
                and bool(initial_admin_markers)
            )
            diagnostics["wordpress_authenticated"] = initial_is_admin
            diagnostics["wordpress_markers_found"] = initial_admin_markers

            plugins_url = urlunsplit(("https", host, "/wp-admin/plugins.php", "", ""))
            page.goto(plugins_url, wait_until="domcontentloaded", timeout=timeout_ms)
            page.wait_for_timeout(800)
            plugins_final_url = page.url
            plugins_final_path = _safe_path(plugins_final_url)
            diagnostics["plugins_final_path"] = plugins_final_path
            diagnostics["hosts_involved"] = _safe_hosts(diagnostics["hosts_involved"], plugins_final_url)
            diagnostics["redirected_to_wp_login"] = _is_login_path(plugins_final_url)

            if not _same_host(plugins_final_url, host):
                return _result("OFF_DOMAIN", "plugins.php redirecionou para outro domínio", initial_is_admin, False, _host_from_url(plugins_final_url), diagnostics)

            plugins_admin_markers = _authenticated_admin_markers(page)
            plugins_markers = _plugins_page_markers(page)
            diagnostics["wordpress_markers_found"] = sorted(set([*initial_admin_markers, *plugins_admin_markers]))
            diagnostics["plugins_markers_found"] = plugins_markers
            plugins_accessible = (
                plugins_final_path.lower() == "/wp-admin/plugins.php"
                and not diagnostics["redirected_to_wp_login"]
                and bool(plugins_admin_markers)
                and bool(plugins_markers)
            )
            diagnostics["plugins_page_accessible"] = plugins_accessible
            diagnostics["plugin_inventory"] = []
            if inspect_plugins and plugins_accessible:
                inventory = inspect_requested_plugins(
                    page,
                    requested_plugins or [],
                    host,
                    alias_config,
                )
                diagnostics["requested_plugin_inventory"] = inventory.get("requested", [])
                diagnostics["plugin_inventory"] = inventory.get("requested", [])
                if debug_plugin_table:
                    print_plugin_table_debug(inventory.get("table_rows", []))

            if initial_is_admin and plugins_accessible:
                return _result("ACCESSIBLE", "navegador validou wp-admin e plugins.php em modo leitura", True, True, host, diagnostics)
            if initial_is_admin and _permission_denied(page):
                return _result("ACCESSIBLE_NO_PLUGIN_PERMISSION", "painel autenticado, mas plugins.php bloqueado por permissão", True, False, host, diagnostics)
            if diagnostics["redirected_to_wp_login"]:
                return _result("BROWSER_VALIDATION_FAILED", "navegador redirecionou plugins.php para login sem evidência de expiração", initial_is_admin, False, host, diagnostics)
            if initial_is_admin:
                return _result("BROWSER_VALIDATION_FAILED", "painel autenticado, mas plugins.php não foi confirmado", True, False, host, diagnostics)
            if diagnostics["wordpress_markers_found"] or plugins_final_path.startswith("/wp-admin/"):
                return _result("BROWSER_VALIDATION_FAILED", "navegador não confirmou sessão administrativa autenticada", False, False, host, diagnostics)
            return _result("NOT_WORDPRESS", "navegador não encontrou sinais de painel WordPress", False, False, host, diagnostics)
    except (PlaywrightTimeoutError, PlaywrightError, OSError) as exc:
        return _result("BROWSER_VALIDATION_FAILED", exc.__class__.__name__, False, False, host, diagnostics)
    finally:
        for resource in (page, context, browser):
            if resource is None:
                continue
            try:
                resource.close()
            except Exception:
                pass
