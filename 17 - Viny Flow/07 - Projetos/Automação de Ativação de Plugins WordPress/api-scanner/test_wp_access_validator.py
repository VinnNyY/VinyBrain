#!/usr/bin/env python3
"""Testes locais do validador de acesso WordPress.

Nao usa rede externa e nao contem tokens reais.
"""

from __future__ import annotations

import types
from io import BytesIO
from urllib.error import HTTPError

import wp_access_validator as validator


class FakeResponse:
    def __init__(self, url: str, html: str, status: int = 200) -> None:
        self._url = url
        self._html = html
        self.status = status

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def geturl(self) -> str:
        return self._url

    def read(self, limit: int = -1) -> bytes:
        return self._html.encode("utf-8")


def make_url(host: str, path: str) -> str:
    return "https://" + host + path


def run_case(name: str, fn) -> None:
    fn()
    print(name + ": ok")


def test_format_valid() -> None:
    ok, host, _ = validator.validate_url_format(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert ok
    assert host == "cliente.test"


def test_without_https() -> None:
    ok, _, reason = validator.validate_url_format("http://cliente.test/wp-admin/", "cliente.test")
    assert not ok
    assert "HTTPS" in reason


def test_off_domain() -> None:
    ok, _, reason = validator.validate_url_format(make_url("externo.test", "/wp-admin/"), "cliente.test")
    assert not ok
    assert "domínio" in reason


def test_two_links_detection_shape() -> None:
    links = [
        make_url("cliente.test", "/wp-admin/"),
        make_url("cliente.test", "/wp-login.php"),
    ]
    assert len(links) == 2


def test_expired(monkeypatch_module) -> None:
    def fake_request(url, opener, timeout_seconds):
        return FakeResponse(url, "temporary login expired")

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "LOGIN_EXPIRED"


def test_external_redirect(monkeypatch_module) -> None:
    def fake_request(url, opener, timeout_seconds):
        raise HTTPError(url, 302, "redirecionamento para outro domínio bloqueado", {}, None)

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "OFF_DOMAIN"


def test_admin_without_plugins(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/wp-admin/"), 'id="adminmenu" wpbody-content wordpress')
        return FakeResponse(make_url("cliente.test", "/wp-admin/plugins.php"), "sem lista de plugins")

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "ACCESSIBLE_NO_PLUGIN_PERMISSION"
    assert result.wp_admin_accessible
    assert not result.plugins_page_accessible
    assert result.diagnostics["cookie_count"] == 0


def test_public_home_is_not_authenticated_admin(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/"), "WordPress wp-admin login link")
        return FakeResponse(make_url("cliente.test", "/wp-login.php"), "login")

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "VALIDATION_INCOMPATIBLE"
    assert not result.wp_admin_accessible
    assert not result.plugins_page_accessible


def test_plugins_permission_403(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/wp-admin/"), 'id="adminmenu" wp-admin')
        body = BytesIO(b"sorry, you are not allowed wp-admin")
        raise HTTPError(url, 403, "Forbidden", {}, body)

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "ACCESSIBLE_NO_PLUGIN_PERMISSION"
    assert result.wp_admin_accessible
    assert result.diagnostics["plugins_returned_403"]


def test_login_expired_on_plugins(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/wp-admin/"), 'id="wpadminbar" wp-admin')
        return FakeResponse(make_url("cliente.test", "/wp-login.php"), "login")

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "VALIDATION_INCOMPATIBLE"
    assert result.diagnostics["redirected_to_wp_login"]


def test_plugins_page_redirected(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/wp-admin/"), 'id="wpadminbar" wp-admin')
        opener.redirect_handler.redirect_count += 1
        return FakeResponse(make_url("cliente.test", "/wp-admin/index.php"), "wp-admin dashboard")

    class FakeRedirectHandler:
        def __init__(self, host: str) -> None:
            self.redirect_count = 0
            self.hosts_seen = [host]

    class FakeOpener:
        def __init__(self, redirect_handler) -> None:
            self.redirect_handler = redirect_handler

    def fake_build_opener(*handlers):
        redirect_handler = next(handler for handler in handlers if hasattr(handler, "redirect_count"))
        return FakeOpener(redirect_handler)

    original_build_opener = monkeypatch_module.build_opener
    original_handler = monkeypatch_module.SameHostRedirectHandler
    monkeypatch_module._request = fake_request
    monkeypatch_module.build_opener = fake_build_opener
    monkeypatch_module.SameHostRedirectHandler = FakeRedirectHandler
    try:
        result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    finally:
        monkeypatch_module.build_opener = original_build_opener
        monkeypatch_module.SameHostRedirectHandler = original_handler
    assert result.status == "PLUGIN_PAGE_REDIRECTED"
    assert result.wp_admin_accessible


def test_full_plugins_access(monkeypatch_module) -> None:
    calls = {"count": 0}

    def fake_request(url, opener, timeout_seconds):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(make_url("cliente.test", "/wp-admin/"), 'id="adminmenu" wpbody-content wordpress')
        return FakeResponse(make_url("cliente.test", "/wp-admin/plugins.php"), "wp-list-table plugins plugins.php")

    monkeypatch_module._request = fake_request
    result = monkeypatch_module.validate_wp_access_link(make_url("cliente.test", "/wp-admin/"), "cliente.test")
    assert result.status == "ACCESSIBLE"
    assert result.wp_admin_accessible
    assert result.plugins_page_accessible


def main() -> int:
    original_request = validator._request
    try:
        run_case("link temporario valido no dominio correto", test_format_valid)
        run_case("link sem HTTPS", test_without_https)
        run_case("link para outro dominio", test_off_domain)
        run_case("dois links diferentes", test_two_links_detection_shape)
        run_case("link expirado", lambda: test_expired(validator))
        run_case("redirecionamento externo", lambda: test_external_redirect(validator))
        run_case("wp-admin sem plugins.php", lambda: test_admin_without_plugins(validator))
        run_case("home publica nao autentica wp-admin", lambda: test_public_home_is_not_authenticated_admin(validator))
        run_case("plugins.php com 403 de permissao", lambda: test_plugins_permission_403(validator))
        run_case("plugins.php redireciona para login", lambda: test_login_expired_on_plugins(validator))
        run_case("plugins.php redireciona dentro do wp-admin", lambda: test_plugins_page_redirected(validator))
        run_case("acesso completo a plugins.php", lambda: test_full_plugins_access(validator))
    finally:
        validator._request = original_request
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
