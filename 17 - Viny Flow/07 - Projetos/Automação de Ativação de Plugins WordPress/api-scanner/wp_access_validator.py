"""Validacao read-only de link temporario WordPress.

Este modulo nunca persiste URL, query string, cookies ou HTML. A URL entra
apenas em memoria e a saida contem somente indicadores sanitizados.
"""

from __future__ import annotations

import http.cookiejar
import ipaddress
import ssl
from dataclasses import dataclass, asdict
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import (
    HTTPCookieProcessor,
    HTTPRedirectHandler,
    HTTPSHandler,
    Request,
    build_opener,
)


MAX_REDIRECTS = 3
USER_AGENT = "VinyBrain-WHMCS-ReadonlyScanner/1.0"
BLOCKED_SCHEMES = {"file", "ftp", "data", "javascript"}


@dataclass
class WPAccessValidationResult:
    executed: bool
    status: str
    reason: str
    wp_admin_accessible: bool
    plugins_page_accessible: bool
    final_host: str
    diagnostics: dict[str, Any]

    def to_dict(self) -> dict:
        return asdict(self)


def normalize_host(hostname: str) -> str:
    host = (hostname or "").strip().lower().rstrip(".")
    if host.startswith("www."):
        host = host[4:]
    return host


def same_domain(hostname: str, expected_domain: str) -> bool:
    return normalize_host(hostname) == normalize_host(expected_domain)


def validate_url_format(url: str, expected_domain: str) -> tuple[bool, str, str]:
    parsed = urlsplit(url)
    scheme = parsed.scheme.lower()
    hostname = normalize_host(parsed.hostname or "")
    if not scheme or scheme in BLOCKED_SCHEMES or scheme != "https":
        return False, hostname, "protocolo inválido ou sem HTTPS"
    if not hostname:
        return False, hostname, "hostname ausente"
    try:
        ip = ipaddress.ip_address(hostname)
    except ValueError:
        ip = None
    if ip and (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved):
        return False, hostname, "IP interno ou privado bloqueado"
    if hostname in {"localhost", "127.0.0.1"}:
        return False, hostname, "host interno bloqueado"
    if expected_domain and not same_domain(hostname, expected_domain):
        return False, hostname, "host diferente do domínio do ticket"
    return True, hostname, "formato válido"


class SameHostRedirectHandler(HTTPRedirectHandler):
    def __init__(self, expected_host: str) -> None:
        self.expected_host = normalize_host(expected_host)
        self.redirect_count = 0
        self.hosts_seen = [self.expected_host] if self.expected_host else []

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        self.redirect_count += 1
        if self.redirect_count > MAX_REDIRECTS:
            raise HTTPError(req.full_url, code, "limite de redirecionamentos excedido", headers, fp)
        target_host = normalize_host(urlsplit(newurl).hostname or "")
        if target_host and target_host not in self.hosts_seen:
            self.hosts_seen.append(target_host)
        if target_host != self.expected_host:
            raise HTTPError(req.full_url, code, "redirecionamento para outro domínio bloqueado", headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _request(url: str, opener, timeout_seconds: int):
    request = Request(url, method="GET")
    request.add_header("User-Agent", USER_AGENT)
    request.add_header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    return opener.open(request, timeout=timeout_seconds)


def _safe_path(url: str) -> str:
    path = urlsplit(url).path or "/"
    return path if path.startswith("/") else f"/{path}"


def _http_status(response) -> int:
    status = getattr(response, "status", None)
    if status:
        return int(status)
    getcode = getattr(response, "getcode", None)
    if callable(getcode):
        return int(getcode())
    return 0


def _wordpress_markers(html: str, final_url: str) -> list[str]:
    lower = html.lower()
    markers: list[str] = []
    if "/wp-admin/" in _safe_path(final_url):
        markers.append("path:/wp-admin/")
    if 'class="wp-admin' in lower or " wp-admin " in lower or "wp-admin" in lower:
        markers.append("wp-admin")
    if 'id="adminmenu"' in lower or "id='adminmenu'" in lower:
        markers.append("id:adminmenu")
    if 'id="wpadminbar"' in lower or "id='wpadminbar'" in lower:
        markers.append("id:wpadminbar")
    if "wpbody-content" in lower:
        markers.append("wpbody-content")
    if "wordpress" in lower:
        markers.append("wordpress")
    if "dashboard" in lower and ("wp-admin" in lower or "wpbody" in lower):
        markers.append("dashboard-structure")
    return sorted(set(markers))


def _authenticated_admin_markers(html: str, final_url: str, http_status: int) -> list[str]:
    if http_status != 200:
        return []
    path = _safe_path(final_url).lower()
    if not path.startswith("/wp-admin/") or _is_login_path(final_url):
        return []
    lower = html.lower()
    markers: list[str] = []
    if 'id="adminmenu"' in lower or "id='adminmenu'" in lower:
        markers.append("id:adminmenu")
    if 'id="wpadminbar"' in lower or "id='wpadminbar'" in lower:
        markers.append("id:wpadminbar")
    if 'class="wp-admin' in lower or " wp-admin " in lower:
        markers.append("body-class:wp-admin")
    if "wp-menu-name" in lower and "wpbody-content" in lower:
        markers.append("admin-menu")
    return sorted(set(markers))


def _looks_like_wordpress_admin(html: str, final_url: str) -> bool:
    return bool(_wordpress_markers(html, final_url))


def _plugins_markers(html: str, final_url: str) -> list[str]:
    lower = html.lower()
    markers: list[str] = []
    if "/wp-admin/plugins.php" in _safe_path(final_url):
        markers.append("path:/wp-admin/plugins.php")
    if "wp-list-table plugins" in lower:
        markers.append("wp-list-table:plugins")
    if "plugin-install.php" in lower:
        markers.append("plugin-install.php")
    if "plugins.php?action=activate" in lower or "plugins.php?action=deactivate" in lower:
        markers.append("plugin-actions")
    if 'id="the-list"' in lower and "plugin" in lower:
        markers.append("plugins-table")
    if "<h1" in lower and "plugin" in lower:
        markers.append("plugins-heading")
    return sorted(set(markers))


def _looks_like_plugins_page(html: str, final_url: str) -> bool:
    return bool(_plugins_markers(html, final_url))


def _plugins_page_accessible(html: str, final_url: str, http_status: int) -> bool:
    if http_status != 200 or _is_login_path(final_url):
        return False
    if _safe_path(final_url).lower() != "/wp-admin/plugins.php":
        return False
    markers = _plugins_markers(html, final_url)
    return any(marker != "path:/wp-admin/plugins.php" for marker in markers)


def _looks_expired(html: str, final_url: str) -> bool:
    lower = (html + " " + final_url).lower()
    return any(
        phrase in lower
        for phrase in [
            "expired",
            "expirado",
            "invalid token",
            "token inválido",
            "link expirado",
            "temporary login expired",
        ]
    )


def _looks_permission_denied(html: str) -> bool:
    lower = html.lower()
    return any(
        phrase in lower
        for phrase in [
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
    )


def _is_login_path(url: str) -> bool:
    return "/wp-login.php" in _safe_path(url).lower()


def _base_diagnostics(host: str) -> dict[str, Any]:
    return {
        "initial_http_status": "",
        "initial_final_path": "",
        "redirect_count": 0,
        "hosts_involved": [host] if host else [],
        "cookie_count": 0,
        "plugins_http_status": "",
        "plugins_final_path": "",
        "redirected_to_wp_login": False,
        "plugins_returned_403": False,
        "wordpress_markers_found": [],
        "plugins_markers_found": [],
        "technical_reason": "",
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


def validate_wp_access_link(url: str, expected_domain: str, timeout_seconds: int = 10) -> WPAccessValidationResult:
    valid, host, reason = validate_url_format(url, expected_domain)
    diagnostics = _base_diagnostics(host)
    if not valid:
        status = "OFF_DOMAIN" if "domínio" in reason else "INVALID"
        return _result(status, reason, False, False, host, diagnostics)

    cookies = http.cookiejar.CookieJar()
    context = ssl.create_default_context()
    redirect_handler = SameHostRedirectHandler(host)
    opener = build_opener(
        HTTPCookieProcessor(cookies),
        HTTPSHandler(context=context),
        redirect_handler,
    )

    try:
        with _request(url, opener, timeout_seconds) as response:
            final_url = response.geturl()
            final_host = normalize_host(urlsplit(final_url).hostname or "")
            if final_host != host:
                diagnostics["hosts_involved"] = sorted(set([*redirect_handler.hosts_seen, final_host]))
                return _result("OFF_DOMAIN", "redirecionou para outro domínio", False, False, final_host, diagnostics)
            diagnostics["initial_http_status"] = _http_status(response)
            diagnostics["initial_final_path"] = _safe_path(final_url)
            diagnostics["redirect_count"] = redirect_handler.redirect_count
            diagnostics["hosts_involved"] = sorted(set([*redirect_handler.hosts_seen, final_host]))
            html = response.read(300_000).decode("utf-8", errors="ignore")
            diagnostics["cookie_count"] = len(cookies)
    except HTTPError as exc:
        message = str(exc.reason).lower()
        if "outro domínio" in message:
            diagnostics["hosts_involved"] = sorted(set(redirect_handler.hosts_seen))
            return _result("OFF_DOMAIN", "redirecionamento para outro domínio", False, False, host, diagnostics)
        diagnostics["initial_http_status"] = exc.code
        diagnostics["redirect_count"] = redirect_handler.redirect_count
        diagnostics["hosts_involved"] = sorted(set(redirect_handler.hosts_seen))
        diagnostics["cookie_count"] = len(cookies)
        return _result("ERROR", f"HTTP {exc.code}", False, False, host, diagnostics)
    except (URLError, TimeoutError, OSError) as exc:
        diagnostics["redirect_count"] = redirect_handler.redirect_count
        diagnostics["hosts_involved"] = sorted(set(redirect_handler.hosts_seen))
        diagnostics["cookie_count"] = len(cookies)
        return _result("ERROR", exc.__class__.__name__, False, False, host, diagnostics)

    initial_markers = _wordpress_markers(html, final_url)
    diagnostics["wordpress_markers_found"] = initial_markers
    if _is_login_path(final_url):
        diagnostics["redirected_to_wp_login"] = True
        return _result("VALIDATION_INCOMPATIBLE", "cliente HTTP redirecionou para wp-login.php; validar com navegador", False, False, host, diagnostics)
    if _looks_expired(html, final_url):
        return _result("LOGIN_EXPIRED", "link expirado ou não autenticou", False, False, host, diagnostics)

    initial_admin_markers = _authenticated_admin_markers(
        html,
        final_url,
        int(diagnostics["initial_http_status"] or 0),
    )
    admin_accessible = bool(initial_admin_markers)
    if initial_admin_markers:
        diagnostics["wordpress_markers_found"] = sorted(set([*initial_markers, *initial_admin_markers]))
    plugins_url = urlunsplit(("https", host, "/wp-admin/plugins.php", "", ""))
    redirects_before_plugins = redirect_handler.redirect_count

    try:
        with _request(plugins_url, opener, timeout_seconds) as response:
            plugins_final_url = response.geturl()
            plugins_final_host = normalize_host(urlsplit(plugins_final_url).hostname or "")
            if plugins_final_host != host:
                diagnostics["hosts_involved"] = sorted(set([*redirect_handler.hosts_seen, plugins_final_host]))
                return _result("OFF_DOMAIN", "plugins.php redirecionou para outro domínio", admin_accessible, False, plugins_final_host, diagnostics)
            diagnostics["plugins_http_status"] = _http_status(response)
            diagnostics["plugins_final_path"] = _safe_path(plugins_final_url)
            diagnostics["redirect_count"] = redirect_handler.redirect_count
            diagnostics["hosts_involved"] = sorted(set([*redirect_handler.hosts_seen, plugins_final_host]))
            diagnostics["cookie_count"] = len(cookies)
            plugins_html = response.read(300_000).decode("utf-8", errors="ignore")
    except HTTPError as exc:
        body = exc.read(120_000).decode("utf-8", errors="ignore") if hasattr(exc, "read") else ""
        diagnostics["plugins_http_status"] = exc.code
        diagnostics["plugins_final_path"] = _safe_path(exc.url or plugins_url)
        diagnostics["redirect_count"] = redirect_handler.redirect_count
        diagnostics["hosts_involved"] = sorted(set(redirect_handler.hosts_seen))
        diagnostics["cookie_count"] = len(cookies)
        diagnostics["plugins_returned_403"] = exc.code == 403
        diagnostics["wordpress_markers_found"] = sorted(set([*initial_markers, *_wordpress_markers(body, exc.url or plugins_url)]))
        if admin_accessible and exc.code in {401, 403}:
            return _result("ACCESSIBLE_NO_PLUGIN_PERMISSION", "wp-admin acessível, mas plugins.php retornou bloqueio de permissão", True, False, host, diagnostics)
        if exc.code in {401, 403} and _wordpress_markers(body, exc.url or plugins_url):
            return _result("LOGIN_EXPIRED", "plugins.php bloqueado sem sessão administrativa autenticada", False, False, host, diagnostics)
        return _result("ERROR", f"HTTP {exc.code} em plugins.php", admin_accessible, False, host, diagnostics)
    except (URLError, TimeoutError, OSError) as exc:
        diagnostics["redirect_count"] = redirect_handler.redirect_count
        diagnostics["hosts_involved"] = sorted(set(redirect_handler.hosts_seen))
        diagnostics["cookie_count"] = len(cookies)
        return _result("ERROR", exc.__class__.__name__, admin_accessible, False, host, diagnostics)

    plugin_wordpress_markers = _wordpress_markers(plugins_html, plugins_final_url)
    plugin_page_markers = _plugins_markers(plugins_html, plugins_final_url)
    all_wordpress_markers = sorted(set([*initial_markers, *plugin_wordpress_markers]))
    diagnostics["wordpress_markers_found"] = all_wordpress_markers
    diagnostics["plugins_markers_found"] = plugin_page_markers
    diagnostics["redirected_to_wp_login"] = _is_login_path(plugins_final_url)
    diagnostics["plugins_returned_403"] = diagnostics["plugins_http_status"] == 403

    if _is_login_path(plugins_final_url):
        return _result("VALIDATION_INCOMPATIBLE", "plugins.php redirecionou para wp-login.php no cliente HTTP; validar com navegador", False, False, host, diagnostics)

    plugins_accessible = _plugins_page_accessible(
        plugins_html,
        plugins_final_url,
        int(diagnostics["plugins_http_status"] or 0),
    )
    wordpress_confirmed = admin_accessible or bool(all_wordpress_markers)
    if admin_accessible and plugins_accessible:
        return _result("ACCESSIBLE", "wp-admin e plugins.php acessíveis em modo leitura", True, True, host, diagnostics)
    if admin_accessible and _looks_permission_denied(plugins_html):
        return _result("ACCESSIBLE_NO_PLUGIN_PERMISSION", "WordPress confirmado, mas usuário temporário não aparenta ter permissão para plugins.php", True, False, host, diagnostics)
    if admin_accessible and _safe_path(plugins_final_url) != "/wp-admin/plugins.php" and redirect_handler.redirect_count > redirects_before_plugins:
        return _result("PLUGIN_PAGE_REDIRECTED", "plugins.php redirecionou para outra página interna do wp-admin", True, False, host, diagnostics)
    if wordpress_confirmed and not admin_accessible:
        return _result("VALIDATION_INCOMPATIBLE", "cliente HTTP não criou sessão administrativa autenticada; validar com navegador", False, False, host, diagnostics)
    if wordpress_confirmed:
        return _result("ACCESSIBLE_NO_PLUGIN_PERMISSION", "WordPress confirmado, mas listagem de plugins não foi reconhecida", True, False, host, diagnostics)
    return _result("NOT_WORDPRESS", "resposta não aparenta ser administração WordPress", False, plugins_accessible, host, diagnostics)
