"""Provider browser-ui read-only para WHMCS.

Usa Playwright em navegador visível, com login manual, e apenas lê a fila e os
tickets. Nenhuma informacao sensivel e persistida.
"""

from __future__ import annotations

import fcntl
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Sequence
from urllib.parse import urljoin, urlparse


SUPPORT_TICKETS_URL = "https://painel.staycloud.com.br/gestor/supporttickets.php"
DEFAULT_TIMEOUT_MS = 300_000
DEFAULT_PROFILE_DIR = Path("/home/vinicius-alves/.config/viny-integrations/browser-profiles/whmcs-automation")
PROFILE_LOCK_NAME = ".whmcs-automation.lock"
CHROME_LOCK_FILES = {"SingletonLock", "SingletonCookie", "SingletonSocket", "SingletonSharedMemory", "lockfile"}
TICKET_NUMBER_PATTERN = re.compile(r"\b[A-Z]{2,5}-\d{6}\b")
TICKET_LINK_TEXT_PATTERN = re.compile(r"#?([A-Z]{3}-\d{6})")
STATUS_BLOCKLIST = {"closed", "resolved", "fechado", "resolvido"}
STATUS_SYNONYMS = {
    "awaiting reply": {"awaiting reply", "aguardando resposta", "aguardando retorno", "open", "aberto", "abertos", "pending", "pendente", "pendentes"},
    "open": {"open", "aberto", "abertos"},
    "answered": {"answered", "respondido", "respondidos"},
}
QUEUE_STATUS_ALIASES = {
    "awaiting reply": ["Aguardando Resposta", "Awaiting Reply", "Aguardando Resposta (N)"],
}
ACTIVATION_HINTS = [
    "ativar plugin",
    "ativacao de plugin",
    "ativação de plugin",
    "solicitação de ativação de plugin",
    "solicitacao de ativacao de plugin",
    "plugin(s)",
    "elementor",
    "wp rocket",
    "essential addons",
    "rank math",
]


def _text(value: Any) -> str:
    return "" if value is None else str(value).strip()


def _fold(value: Any) -> str:
    return _text(value).lower()


def _safe_join(base: str, href: str) -> str:
    if not href:
        return ""
    parsed = urlparse(href)
    if parsed.scheme and parsed.netloc:
        return href
    return urljoin(base, href)


def _extract_ticket_number(text: str) -> str:
    match = TICKET_NUMBER_PATTERN.search(_text(text))
    return match.group(0) if match else ""


def _extract_ticket_number_from_link_text(text: str) -> str:
    match = TICKET_LINK_TEXT_PATTERN.search(_text(text).replace("\n", " "))
    return match.group(1) if match else ""


def _strip_ticket_prefix(text: str, ticket_num: str) -> str:
    raw = _text(text)
    if not raw or not ticket_num:
        return raw.strip()
    pattern = re.compile(rf"^\s*#?\s*{re.escape(ticket_num)}\s*[-–—:]\s*", re.IGNORECASE)
    cleaned = pattern.sub("", raw, count=1)
    return re.sub(r"\s+", " ", cleaned).strip()


def _candidate_score(subject: str, department: str, status: str) -> int:
    score = 0
    subject_folded = _fold(subject)
    if any(hint in subject_folded for hint in ACTIVATION_HINTS):
        score += 70
    if "suporte técnico" in _fold(department) or "suporte tecnico" in _fold(department):
        score += 20
    if _fold(status) not in STATUS_BLOCKLIST:
        score += 10
    return score


def _status_matches(requested_status: str | None, current_status: str) -> bool:
    if not requested_status:
        return True
    requested = _fold(requested_status)
    current = _fold(current_status)
    for canonical, synonyms in STATUS_SYNONYMS.items():
        if requested == canonical or requested in synonyms:
            return any(synonym in current for synonym in synonyms)
    return requested in current or current in requested


def _normalize_header(header: str) -> str:
    text = _fold(header)
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return text


def _normalized_terms(status: str | None) -> List[str]:
    folded = _fold(status)
    if folded in QUEUE_STATUS_ALIASES:
        return QUEUE_STATUS_ALIASES[folded]
    if folded == "awaiting reply" or folded == "awaiting-reply" or folded == "aguardando resposta":
        return QUEUE_STATUS_ALIASES["awaiting reply"]
    if status:
        return [status]
    return QUEUE_STATUS_ALIASES["awaiting reply"]


def _safe_ticket_href(base_url: str, href: str) -> tuple[bool, str]:
    raw = _text(href)
    if not raw:
        return False, ""
    parsed = urlparse(raw)
    if parsed.scheme and parsed.scheme.lower() == "javascript":
        return False, ""
    if parsed.scheme and parsed.scheme.lower() not in {"http", "https"}:
        return False, ""
    if parsed.scheme and parsed.netloc:
        if "painel.staycloud.com.br" not in parsed.netloc.lower():
            return False, ""
        return True, raw
    return True, urljoin(base_url, raw)


def _is_valid_ticket_detail_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme.lower() != "https":
        return False
    if (parsed.hostname or "").lower() != "painel.staycloud.com.br":
        return False
    path = parsed.path or ""
    if not path.startswith("/gestor/"):
        return False
    if "supporttickets.php" not in path:
        return False
    return True


def _normalize_table_row(
    *,
    page_url: str,
    headers: Sequence[str],
    cells: Sequence[str],
    links: Sequence[Dict[str, Any]],
    requested_status: str | None,
) -> tuple[Dict[str, Any] | None, Dict[str, Any]]:
    normalized_headers = [_normalize_header(item) for item in headers]
    index_map = {name: idx for idx, name in enumerate(normalized_headers)}
    text_blob = " | ".join(cells)
    row_debug = {
        "ticket_num": "",
        "department_present": False,
        "subject_present": False,
        "status_present": False,
        "href_safe": False,
        "row_data_quality": "FULL",
        "reason": "",
    }

    ticket_num = ""
    subject = ""
    department = ""
    status_value = ""
    requester = ""
    last_reply = ""

    if "assunto" in index_map and index_map["assunto"] < len(cells):
        subject = _text(cells[index_map["assunto"]])
    if "departamento" in index_map and index_map["departamento"] < len(cells):
        department = _text(cells[index_map["departamento"]])
    if "status" in index_map and index_map["status"] < len(cells):
        status_value = _text(cells[index_map["status"]])
    if "solicitante" in index_map and index_map["solicitante"] < len(cells):
        requester = _text(cells[index_map["solicitante"]])
    if "ultima_resposta" in index_map and index_map["ultima_resposta"] < len(cells):
        last_reply = _text(cells[index_map["ultima_resposta"]])

    row_debug["department_present"] = bool(department)
    row_debug["subject_present"] = bool(subject)
    row_debug["status_present"] = bool(status_value)

    for link in links:
        href = _text(link.get("href"))
        link_text = _text(link.get("text"))
        ticket_num = ticket_num or _extract_ticket_number(text_blob) or _extract_ticket_number(subject)
        if not ticket_num:
            ticket_num = _extract_ticket_number_from_link_text(link_text)
        if ticket_num:
            break

    if not ticket_num:
        row_debug["reason"] = "TICKET_NUMBER_NOT_EXTRACTED"
        return None, row_debug

    if not subject:
        subject = _strip_ticket_prefix(text_blob, ticket_num) or _strip_ticket_prefix(_text(links[0].get("text")) if links else "", ticket_num)
    else:
        subject = _strip_ticket_prefix(subject, ticket_num) or subject
    if not subject:
        row_debug["ticket_num"] = ticket_num
        row_debug["reason"] = "SUBJECT_EMPTY"
        return None, row_debug

    if not status_value:
        status_value = "UNKNOWN"
        row_debug["row_data_quality"] = "PARTIAL"
    if not department:
        department = "UNKNOWN"
        row_debug["row_data_quality"] = "PARTIAL"

    ticket_url = ""
    href_safe = False
    for link in links:
        href = _text(link.get("href"))
        safe, sanitized_href = _safe_ticket_href(page_url, href)
        if safe:
            href_safe = True
            if sanitized_href:
                ticket_url = _safe_join(page_url, sanitized_href)
            break
    row_debug["href_safe"] = href_safe
    if not href_safe:
        row_debug["ticket_num"] = ticket_num
        row_debug["reason"] = "UNSAFE_TICKET_HREF"
        return None, row_debug

    candidate_score = _candidate_score(subject, department, status_value)
    if status_value != "UNKNOWN" and not _status_matches(requested_status, status_value):
        row_debug["ticket_num"] = ticket_num
        row_debug["reason"] = "STATUS_MISMATCH"
        return None, row_debug

    row = BrowserTicketRow(
        ticket_num=ticket_num,
        subject=subject,
        department=department,
        status=status_value,
        requester=requester,
        last_reply=last_reply,
        ticket_url=ticket_url,
        row_found=True,
        candidate_score=candidate_score,
    ).to_dict()
    if row_debug["row_data_quality"] == "PARTIAL" or department == "UNKNOWN" or status_value == "UNKNOWN":
        row["row_data_quality"] = "PARTIAL"
    row_debug["ticket_num"] = ticket_num
    return row, row_debug


@dataclass
class BrowserTicketRow:
    ticket_num: str
    subject: str
    department: str
    status: str
    requester: str
    last_reply: str
    ticket_url: str
    row_found: bool
    candidate_score: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "ticket_num": self.ticket_num,
            "subject": self.subject,
            "department": self.department,
            "status": self.status,
            "requester": self.requester,
            "last_reply": self.last_reply,
            "ticket_url": self.ticket_url,
            "row_found": self.row_found,
            "candidate_score": self.candidate_score,
            "row_data_quality": "FULL",
            "source": "browser-ui",
        }


class WHMCSBrowserUIProvider:
    def __init__(
        self,
        *,
        browser_session: str = "interactive",
        profile_dir: Path | None = None,
        login_timeout_seconds: int = 300,
        debug_browser_ui: bool = False,
    ) -> None:
        self.browser_session = browser_session
        self.profile_dir = Path(profile_dir or DEFAULT_PROFILE_DIR)
        self.login_timeout_seconds = login_timeout_seconds
        self.debug_browser_ui = debug_browser_ui
        self._playwright = None
        self._browser = None
        self._context = None
        self._page = None
        self._logged_in = False
        self._current_url = ""
        self._lock_handle = None
        self._bootstrap_prompted = False
        self._last_dom_debug: Dict[str, Any] = {}
        self._last_queue_status = ""
        self._last_queue_reason = ""
        self._last_row_rejection_stats: Dict[str, int] = {}
        self._last_row_rejection_samples: List[Dict[str, Any]] = []
        self._ticket_index: Dict[str, Dict[str, Any]] = {}
        self._ticket_index_order: List[str] = []
        self._ticket_index_status: str = ""
        self._ticket_index_source_url: str = ""
        self._ticket_index_limit: int = 0
        self._active_queue: str = ""
        self._queue_filter_applications: int = 0
        self._listings_executed: int = 0
        self._navigation_count: int = 0
        self._loop_detected: bool = False

    @property
    def page(self):
        if self._page is None:
            raise RuntimeError("Browser nao inicializado.")
        return self._page

    def _debug(self, message: str) -> None:
        if self.debug_browser_ui:
            print(message)

    def _ensure_profile_dir(self) -> None:
        self.profile_dir.mkdir(parents=True, exist_ok=True)
        try:
            os.chmod(self.profile_dir, 0o700)
        except OSError:
            pass

    def _acquire_profile_lock(self) -> None:
        self._ensure_profile_dir()
        for name in CHROME_LOCK_FILES:
            if (self.profile_dir / name).exists():
                raise RuntimeError("O perfil dedicado ja esta sendo usado por outra execucao.")
        lock_path = self.profile_dir / PROFILE_LOCK_NAME
        handle = lock_path.open("w", encoding="utf-8")
        try:
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            handle.close()
            raise RuntimeError("O perfil dedicado ja esta sendo usado por outra execucao.") from exc
        self._lock_handle = handle

    def _release_profile_lock(self) -> None:
        if self._lock_handle is None:
            return
        try:
            fcntl.flock(self._lock_handle.fileno(), fcntl.LOCK_UN)
        except Exception:
            pass
        try:
            self._lock_handle.close()
        except Exception:
            pass
        self._lock_handle = None

    def _ensure_browser(self) -> None:
        if self._page is not None:
            return
        try:
            from playwright.sync_api import sync_playwright
        except Exception as exc:  # pragma: no cover - depende do ambiente
            raise RuntimeError(
                "Playwright nao esta disponivel. Instale ou habilite a dependencia para usar --whmcs-provider browser-ui."
            ) from exc
        self._playwright = sync_playwright().start()
        if self.browser_session == "persistent":
            self._acquire_profile_lock()
            try:
                self._context = self._playwright.chromium.launch_persistent_context(
                    user_data_dir=str(self.profile_dir),
                    channel="chrome",
                    headless=False,
                    accept_downloads=False,
                )
            except Exception as exc:
                self._release_profile_lock()
                self._playwright.stop()
                self._playwright = None
                raise RuntimeError("Google Chrome instalado nao foi localizado para o modo persistente.") from exc
            self._page = self._context.pages[0] if self._context.pages else self._context.new_page()
        else:
            self._browser = self._playwright.chromium.launch(headless=False)
            self._context = self._browser.new_context(
                accept_downloads=False,
                record_video_dir=None,
                storage_state=None,
            )
            self._page = self._context.new_page()
        self._page.set_default_timeout(30_000)
        self._page.set_default_navigation_timeout(30_000)
        self._debug("navegador iniciado")

    def _pages(self) -> List[Any]:
        if self._context is None:
            return []
        try:
            return list(self._context.pages)
        except Exception:
            return [self._page] if self._page is not None else []

    def _focused_page(self):
        pages = self._pages()
        if not pages:
            return self.page
        for page in pages:
            try:
                state = self._screen_state(page)
            except Exception:
                state = "SESSION_EXPIRED"
            if state == "WHMCS_AUTHENTICATED":
                self._page = page
                return page
        for page in pages:
            try:
                if "/gestor/" in _fold(page.url):
                    self._page = page
                    return page
            except Exception:
                continue
        return self.page

    def close(self) -> None:
        for resource in (self._page, self._context, self._browser):
            try:
                if resource is not None:
                    resource.close()
            except Exception:
                pass
        self._page = None
        self._context = None
        self._browser = None
        if self._playwright is not None:
            try:
                self._playwright.stop()
            except Exception:
                pass
        self._playwright = None
        self._release_profile_lock()

    def _screen_state(self, page) -> str:
        url = _fold(page.url)
        try:
            title = _fold(page.title())
        except Exception:
            title = ""
        try:
            body = _fold(page.locator("body").inner_text(timeout=2_000))
        except Exception:
            body = ""
        combined = " ".join([url, title, body])
        if any(term in combined for term in ["cloudflare access", "verify you are human", "just a moment", "access denied"]):
            return "CLOUDFLARE_ACCESS_LOGIN"
        if "supporttickets.php" in url and self._has_ticket_table(page):
            return "WHMCS_AUTHENTICATED"
        if any(term in combined for term in ["login", "username", "password"]) and "supporttickets.php" not in url:
            return "WHMCS_LOGIN"
        if "gestor" in url and ("supporttickets.php" in url or self._has_admin_area(page)):
            return "WHMCS_AUTHENTICATED"
        return "SESSION_EXPIRED"

    def _ensure_authenticated(self, *, allow_manual_login: bool, timeout_seconds: int | None = None) -> None:
        self._ensure_browser()
        page = self._focused_page()
        try:
            page.goto(SUPPORT_TICKETS_URL, wait_until="domcontentloaded")
            self._navigation_count += 1
        except Exception:
            pass
        page.wait_for_timeout(1_500)
        deadline_ms = int((timeout_seconds or self.login_timeout_seconds) * 1000) if allow_manual_login else 10_000
        elapsed_ms = 0
        while elapsed_ms < deadline_ms:
            page = self._focused_page()
            self._current_url = page.url
            state = self._screen_state(page)
            if state == "WHMCS_AUTHENTICATED":
                if not self._logged_in:
                    self._debug("login detectado")
                self._logged_in = True
                return
            if state in {"CLOUDFLARE_ACCESS_LOGIN", "WHMCS_LOGIN"}:
                if not allow_manual_login:
                    raise RuntimeError("SESSION_EXPIRED: a sessao persistente nao esta autenticada.")
                self._debug("aguardando login manual")
                page.wait_for_timeout(2_000)
                elapsed_ms += 2_000
                continue
            if state == "SESSION_EXPIRED" and allow_manual_login:
                page.wait_for_timeout(2_000)
                elapsed_ms += 2_000
                continue
            page.wait_for_timeout(2_000)
            elapsed_ms += 2_000
        raise RuntimeError("SESSION_EXPIRED: login manual nao detectado dentro do timeout.")

    def _cache_ticket_rows(self, rows: Sequence[Dict[str, Any]], *, status: str, source_url: str, limit: int) -> None:
        ticket_index: Dict[str, Dict[str, Any]] = {}
        ticket_index_order: List[str] = []
        for row in rows:
            ticket_num = _text(row.get("ticket_num"))
            if not ticket_num:
                continue
            ticket_index[ticket_num] = dict(row)
            ticket_index_order.append(ticket_num)
        self._ticket_index = ticket_index
        self._ticket_index_order = ticket_index_order
        self._ticket_index_status = status
        self._ticket_index_source_url = source_url
        self._ticket_index_limit = limit
        self._active_queue = _fold(status)

    def _get_cached_ticket_row(self, ticket_reference: str) -> Dict[str, Any]:
        wanted = _fold(ticket_reference)
        if not wanted:
            return {}
        for key, row in self._ticket_index.items():
            if _fold(key) == wanted:
                return dict(row)
        return {}

    def _can_reuse_ticket_index(self, status: str | None, limit: int, subject: str | None) -> bool:
        if subject:
            return False
        if not self._ticket_index:
            return False
        requested = _fold(status or "Awaiting Reply")
        if self._ticket_index_status and _fold(self._ticket_index_status) != requested:
            return False
        if self._active_queue and self._active_queue != requested:
            return False
        return True

    def bootstrap_login(self, *, manual_confirm: bool = False, timeout_seconds: int | None = None) -> Dict[str, Any]:
        self._ensure_browser()
        page = self._focused_page()
        try:
            page.goto(SUPPORT_TICKETS_URL, wait_until="domcontentloaded")
        except Exception:
            pass
        page.wait_for_timeout(1_500)
        deadline = time.monotonic() + float(timeout_seconds or self.login_timeout_seconds)
        prompted = False
        while time.monotonic() < deadline:
            if manual_confirm and not prompted:
                self._debug("Conclua o login manualmente no navegador. Quando chegar a lista de tickets do WHMCS, volte ao terminal e pressione ENTER.")
                prompted = True
            if manual_confirm:
                input("Conclua o login manualmente no navegador. Quando chegar à lista de tickets do WHMCS, pressione ENTER para validar: ")
                try:
                    self._ensure_authenticated(allow_manual_login=False, timeout_seconds=10)
                    break
                except RuntimeError:
                    self._debug("login ainda nao validado; mantendo o navegador aberto para nova tentativa")
                    continue
            else:
                self._ensure_authenticated(allow_manual_login=True, timeout_seconds=timeout_seconds)
                break
        else:
            raise RuntimeError("SESSION_EXPIRED: tempo de autenticacao encerrado; a sessao parcial foi mantida no perfil dedicado.")
        return {
            "cloudflare_access_authenticated": True,
            "whmcs_authenticated": True,
            "profile_persistent_prepared": self.browser_session == "persistent",
            "state": "WHMCS_AUTHENTICATED",
            "browser_started": True,
        }

    def _page_state(self, page) -> Dict[str, Any]:
        state: Dict[str, Any] = {
            "url": "",
            "path": "",
            "title": "",
            "body": "",
        }
        try:
            state["url"] = page.url
            state["path"] = urlparse(page.url).path or "/"
        except Exception:
            pass
        try:
            state["title"] = page.title()
        except Exception:
            pass
        try:
            state["body"] = page.locator("body").inner_text(timeout=2_000)
        except Exception:
            pass
        return state

    def _inspect_ticket_tables(self, page) -> Dict[str, Any]:
        try:
            tables = page.evaluate(
                """() => Array.from(document.querySelectorAll('table')).map((table, index) => {
                    const visible = !!(table.offsetWidth || table.offsetHeight || table.getClientRects().length);
                    const headerCells = Array.from(table.querySelectorAll('thead th, tr:first-child th, tr:first-child td'))
                        .map(cell => (cell.innerText || '').trim())
                        .filter(Boolean);
                    const rows = Array.from(table.querySelectorAll('tbody tr'))
                        .filter(tr => !!(tr.offsetWidth || tr.offsetHeight || tr.getClientRects().length))
                        .map(tr => ({
                            cells: Array.from(tr.querySelectorAll('td')).map(td => (td.innerText || '').trim()).filter(Boolean),
                            links: Array.from(tr.querySelectorAll('a')).map(a => ({text: (a.innerText || '').trim(), href: a.href || ''}))
                        }));
                    return {index, visible, headers: headerCells, rows};
                })"""
            )
        except Exception:
            tables = []

        visible_tables = [table for table in tables or [] if table.get("visible")]
        candidate_tables: List[Dict[str, Any]] = []
        headers_found: List[List[str]] = []
        chosen_table: Dict[str, Any] | None = None
        for table in visible_tables:
            headers = [_normalize_header(item) for item in table.get("headers") or [] if item]
            if headers:
                headers_found.append(headers)
            header_text = " ".join(headers)
            if all(token in header_text for token in ["departamento", "assunto", "status"]):
                candidate_tables.append(table)
                if chosen_table is None:
                    chosen_table = table
        if chosen_table is None and visible_tables:
            chosen_table = visible_tables[0]
            if chosen_table not in candidate_tables:
                candidate_tables.append(chosen_table)

        rows = chosen_table.get("rows") if chosen_table else []
        try:
            ticket_link_count = page.locator("a").filter(has_text=re.compile(r"\b[A-Z]{2,5}-\d{6}\b")).count()
        except Exception:
            ticket_link_count = 0
        body_text = ""
        try:
            body_text = _fold(page.locator("body").inner_text(timeout=2_000))
        except Exception:
            body_text = ""
        page_title = ""
        try:
            page_title = page.title()
        except Exception:
            page_title = ""
        items_found_text = "Itens encontrados" if "itens encontrados" in body_text else ""
        return {
            "path": urlparse(page.url).path or "/",
            "title": page_title,
            "queue_filter_found": False,
            "awaiting_reply_option_found": False,
            "filter_applied": False,
            "items_found_text": items_found_text,
            "visible_tables": len(visible_tables),
            "candidate_tables": len(candidate_tables),
            "headers_found": headers_found,
            "chosen_table_rows": len(rows),
            "ticket_link_count": ticket_link_count,
            "normalized_ticket_count": 0,
            "failure_reason": "",
        }

    def _apply_queue_filter(self, page, status: str | None) -> Dict[str, Any]:
        terms = _normalized_terms(status)
        debug = {
            "queue_filter_found": False,
            "awaiting_reply_option_found": False,
            "filter_applied": False,
            "filter_reused": False,
            "failure_reason": "",
        }
        requested = _fold(status or "Awaiting Reply")
        if self._active_queue == requested and self._ticket_index:
            debug["queue_filter_found"] = True
            debug["awaiting_reply_option_found"] = True
            debug["filter_reused"] = True
            return debug
        try:
            page.goto(SUPPORT_TICKETS_URL, wait_until="domcontentloaded")
        except Exception:
            pass
        try:
            select_infos = page.evaluate(
                """(terms) => {
                    const fold = (value) => (value || '')
                        .normalize('NFKD')
                        .replace(/[\\u0300-\\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, ' ')
                        .trim();
                    return Array.from(document.querySelectorAll('select')).map((select, index) => {
                        const options = Array.from(select.options || []).map((option, optionIndex) => ({
                            index: optionIndex,
                            label: (option.textContent || '').trim(),
                            value: option.value || '',
                            foldedLabel: fold(option.textContent || ''),
                            foldedValue: fold(option.value || ''),
                        }));
                        const matched = options.find((option) => terms.some((term) => {
                            const foldedTerm = fold(term);
                            return (
                                option.foldedLabel === foldedTerm
                                || option.foldedLabel.includes(foldedTerm)
                                || foldedTerm.includes(option.foldedLabel)
                                || option.foldedValue === foldedTerm
                                || option.foldedValue.includes(foldedTerm)
                                || foldedTerm.includes(option.foldedValue)
                            );
                        }));
                        return {
                            index,
                            id: select.id || '',
                            name: select.name || '',
                            options,
                            matched: !!matched,
                            matchedIndex: matched ? matched.index : -1,
                            matchedLabel: matched ? matched.label : '',
                            matchedValue: matched ? matched.value : '',
                        };
                    });
                }""",
                terms,
            )
        except Exception:
            select_infos = []
        matched_select = next((item for item in select_infos if item.get("matched")), None)
        if matched_select is not None:
            debug["queue_filter_found"] = True
            debug["awaiting_reply_option_found"] = True
            select_locator = page.locator("select").nth(int(matched_select["index"]))
            try:
                select_locator.select_option(index=int(matched_select["matchedIndex"]))
                debug["filter_applied"] = True
            except Exception:
                debug["failure_reason"] = "QUEUE_FILTER_NOT_APPLIED"
                self._last_queue_status = "QUEUE_FILTER_NOT_APPLIED"
                self._last_queue_reason = "select_option_falhou"
                return debug
            applied = False
            try:
                form = select_locator.locator("xpath=ancestor::form[1]")
                for selector in ("input[type='submit']", "button[type='submit']"):
                    try:
                        form.locator(selector).first.click(timeout=2_000)
                        applied = True
                        break
                    except Exception:
                        continue
            except Exception:
                applied = False
            if not applied:
                for label in terms:
                    try:
                        page.get_by_text(label, exact=False).first.click(timeout=2_000)
                        applied = True
                        break
                    except Exception:
                        continue
            if applied:
                self._queue_filter_applications += 1
                try:
                    page.wait_for_load_state("domcontentloaded", timeout=10_000)
                except Exception:
                    pass
                self._active_queue = requested
            return debug
        for label in terms:
            try:
                candidate = page.get_by_text(label, exact=False).first
                candidate.click(timeout=2_000)
                debug["queue_filter_found"] = True
                debug["awaiting_reply_option_found"] = True
                debug["filter_applied"] = True
                try:
                    page.wait_for_load_state("domcontentloaded", timeout=10_000)
                except Exception:
                    pass
                return debug
            except Exception:
                continue
        debug["failure_reason"] = "QUEUE_FILTER_NOT_FOUND"
        self._last_queue_status = "QUEUE_FILTER_NOT_FOUND"
        self._last_queue_reason = "filtro de status nao encontrado"
        return debug

    def _wait_for_ticket_queue(self, page, status: str | None, timeout_seconds: int = 30) -> Dict[str, Any]:
        deadline = time.monotonic() + timeout_seconds
        last_debug: Dict[str, Any] = {}
        while time.monotonic() < deadline:
            state = self._page_state(page)
            table_debug = self._inspect_ticket_tables(page)
            last_debug = {
                **state,
                **table_debug,
                "queue_filter_found": table_debug.get("queue_filter_found", False),
                "awaiting_reply_option_found": table_debug.get("awaiting_reply_option_found", False),
                "filter_applied": table_debug.get("filter_applied", False),
            }
            if table_debug.get("visible_tables", 0) > 0 and (
                table_debug.get("chosen_table_rows", 0) > 0 or table_debug.get("ticket_link_count", 0) > 0
            ):
                last_debug["failure_reason"] = ""
                self._last_queue_status = "OK"
                self._last_queue_reason = ""
                self._last_dom_debug = last_debug
                return last_debug
            page.wait_for_timeout(1_000)
        if not last_debug:
            last_debug = self._page_state(page)
        if not last_debug.get("queue_filter_found"):
            reason = "QUEUE_FILTER_NOT_FOUND"
        elif not last_debug.get("filter_applied"):
            reason = "QUEUE_FILTER_NOT_APPLIED"
        elif not last_debug.get("visible_tables"):
            reason = "PAGE_NOT_FULLY_LOADED"
        elif not last_debug.get("chosen_table_rows") and not last_debug.get("ticket_link_count"):
            reason = "TABLE_FOUND_WITHOUT_ROWS"
        elif not last_debug.get("ticket_link_count"):
            reason = "TICKET_LINKS_NOT_FOUND"
        else:
            reason = "PAGE_NOT_FULLY_LOADED"
        last_debug["failure_reason"] = reason
        self._last_queue_status = "BROWSER_UI_READ_INCOMPLETE"
        self._last_queue_reason = reason
        self._last_dom_debug = last_debug
        return last_debug

    def _is_login_screen(self, page) -> bool:
        try:
            text = _fold(page.locator("body").inner_text(timeout=2_000))
        except Exception:
            text = ""
        if "login" in text and ("email" in text or "senha" in text or "password" in text):
            return True
        return "login" in _fold(page.url) and "supporttickets.php" not in _fold(page.url)

    def _has_admin_area(self, page) -> bool:
        try:
            body = _fold(page.locator("body").inner_text(timeout=2_000))
        except Exception:
            body = ""
        return "support tickets" in body or "tickets" in body or "supporttickets.php" in _fold(page.url)

    def _has_ticket_table(self, page) -> bool:
        try:
            tables = page.locator("table")
            return tables.count() > 0
        except Exception:
            return False

    def _extract_tables(self, page) -> List[Dict[str, Any]]:
        return page.evaluate(
            """() => Array.from(document.querySelectorAll('table')).map((table, index) => {
                const headers = Array.from(table.querySelectorAll('thead th')).map(th => (th.innerText || '').trim());
                const headerRow = headers.length ? headers : Array.from(table.querySelectorAll('tr')).slice(0, 1).map(tr => Array.from(tr.querySelectorAll('th,td')).map(cell => (cell.innerText || '').trim())).flat();
                const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => ({
                    cells: Array.from(tr.querySelectorAll('th,td')).map(td => (td.innerText || '').trim()),
                    links: Array.from(tr.querySelectorAll('a')).map(a => ({text: (a.innerText || '').trim(), href: a.getAttribute('href') || a.href || ''}))
                }));
                return {index, headers: headerRow, rows};
            })"""
        )

    def _parse_ticket_rows(self, page, status: str | None = None, limit: int = 20) -> List[Dict[str, Any]]:
        tables = self._extract_tables(page)
        target = None
        for table in tables:
            headers = [_normalize_header(item) for item in table.get("headers") or []]
            header_text = " ".join(headers)
            if all(token in header_text for token in ["departamento", "assunto", "status"]):
                target = table
                break
        if target is None and tables:
            target = tables[0]
        if target is None:
            return self._parse_ticket_links(page, status=status, limit=limit)

        headers = [str(item) for item in target.get("headers") or []]
        rows: List[Dict[str, Any]] = []
        rejection_stats: Dict[str, int] = {
            "TICKET_NUMBER_NOT_EXTRACTED": 0,
            "SUBJECT_EMPTY": 0,
            "ROW_COLUMN_COUNT_MISMATCH": 0,
            "DEPARTMENT_EMPTY": 0,
            "STATUS_EMPTY": 0,
            "UNSAFE_TICKET_HREF": 0,
            "DUPLICATE_TICKET": 0,
        }
        rejection_samples: List[Dict[str, Any]] = []
        seen_tickets: set[str] = set()
        for row in target.get("rows") or []:
            cells = row.get("cells") or []
            links = row.get("links") or []
            normalized_row, row_debug = _normalize_table_row(
                page_url=page.url,
                headers=headers,
                cells=cells,
                links=links,
                requested_status=status,
            )
            row_debug["column_count"] = len(cells)
            row_debug["header_count"] = len(headers)
            row_debug["subject_present"] = bool(row_debug.get("subject_present"))
            if len(cells) != len(headers):
                row_debug["reason"] = row_debug.get("reason") or "ROW_COLUMN_COUNT_MISMATCH"
                rejection_stats["ROW_COLUMN_COUNT_MISMATCH"] += 1
            if normalized_row is None:
                reason = row_debug.get("reason") or "ROW_COLUMN_COUNT_MISMATCH"
                rejection_stats[reason] = rejection_stats.get(reason, 0) + 1
                row_debug["ticket_num"] = row_debug.get("ticket_num") or ""
                if len(rejection_samples) < 5:
                    rejection_samples.append(row_debug)
                continue
            ticket_num = _text(normalized_row.get("ticket_num"))
            if ticket_num in seen_tickets:
                rejection_stats["DUPLICATE_TICKET"] += 1
                if len(rejection_samples) < 5:
                    duplicate_debug = dict(row_debug)
                    duplicate_debug["reason"] = "DUPLICATE_TICKET"
                    duplicate_debug["ticket_num"] = ticket_num
                    rejection_samples.append(duplicate_debug)
                continue
            seen_tickets.add(ticket_num)
            rows.append(normalized_row)
            if len(rows) >= limit:
                break
        self._last_row_rejection_stats = rejection_stats
        self._last_row_rejection_samples = rejection_samples
        if rows:
            return rows
        return self._parse_ticket_links(page, status=status, limit=limit)

    def _parse_ticket_links(self, page, status: str | None = None, limit: int = 20) -> List[Dict[str, Any]]:
        try:
            link_rows = page.evaluate(
                """(limit) => {
                    const regex = /#?([A-Z]{3}-\\d{6})/;
                    const dedupe = new Set();
                    const rows = [];
                    const links = Array.from(document.querySelectorAll('a')).filter(a => regex.test((a.innerText || '').trim()));
                    for (const link of links) {
                        const text = (link.innerText || '').trim().replace(/\\s+/g, ' ');
                        const match = text.match(regex);
                        const ticketNum = match ? match[1] : '';
                        if (!ticketNum || dedupe.has(ticketNum)) {
                            continue;
                        }
                        dedupe.add(ticketNum);
                        const row = link.closest('tr');
                        const cells = row ? Array.from(row.querySelectorAll('th,td')).map(td => (td.innerText || '').trim()).filter(Boolean) : [];
                        const subject = text.replace(new RegExp(`^\\s*#?\\s*${ticketNum}\\s*[-–—:]\\s*`, 'i'), '').trim();
                        rows.push({
                            ticket_num: ticketNum,
                            subject: subject || (cells[1] || text),
                            department: cells[0] || '',
                            status: cells[2] || '',
                            requester: cells[3] || '',
                            last_reply: cells[4] || '',
                            ticket_url: link.getAttribute('href') || link.href || '',
                            row_found: !!row,
                        });
                        if (rows.length >= limit) {
                            break;
                        }
                    }
                    return rows;
                }""",
                limit,
            )
        except Exception:
            link_rows = []
        rows: List[Dict[str, Any]] = []
        for row in link_rows or []:
            ticket_num = _text(row.get("ticket_num"))
            subject = _text(row.get("subject"))
            department = _text(row.get("department"))
            status_value = _text(row.get("status"))
            if not ticket_num:
                continue
            if status_value and status_value != "UNKNOWN" and not _status_matches(status, status_value):
                continue
            normalized_department = department or "UNKNOWN"
            normalized_status = status_value or "UNKNOWN"
            normalized = BrowserTicketRow(
                ticket_num=ticket_num,
                subject=subject,
                department=normalized_department,
                status=normalized_status,
                requester=_text(row.get("requester")),
                last_reply=_text(row.get("last_reply")),
                ticket_url=_text(row.get("ticket_url")),
                row_found=bool(row.get("row_found")),
                candidate_score=_candidate_score(subject, normalized_department, normalized_status),
            ).to_dict()
            if department == "" or status_value == "" or status_value == "UNKNOWN" or department == "UNKNOWN":
                normalized["row_data_quality"] = "PARTIAL"
            rows.append(
                normalized
            )
            if len(rows) >= limit:
                break
        return rows

    def _open_ticket_row(self, page, ticket_row: Dict[str, Any]) -> Dict[str, Any]:
        ticket_num = _text(ticket_row.get("ticket_num"))
        href = _text(ticket_row.get("ticket_url"))
        if not ticket_num:
            raise RuntimeError("TICKET_NOT_FOUND: referencia vazia.")
        if href and _is_valid_ticket_detail_url(urljoin(page.url, href)):
            try:
                page.goto(urljoin(page.url, href), wait_until="domcontentloaded")
                self._navigation_count += 1
                return {
                    "method": "goto",
                    "href_relative": not bool(urlparse(href).scheme),
                    "url_resolved_in_gestor": True,
                }
            except Exception:
                pass

        try:
            row_locator = page.locator("tr").filter(has_text=ticket_num).first
            if row_locator.count() > 0:
                link_locator = row_locator.locator("a").filter(has_text=re.compile(re.escape(ticket_num)))
                if link_locator.count() == 0:
                    link_locator = row_locator.locator("a").first
                if link_locator.count() > 0:
                    link_locator.first.click(timeout=2_000)
                    self._navigation_count += 1
                    return {
                        "method": "click",
                        "href_relative": True,
                        "url_resolved_in_gestor": True,
                    }
        except Exception:
            pass

        raise RuntimeError("UNSAFE_OR_INVALID_TICKET_URL: caminho administrativo invalido.")

    def _merge_ticket_rows(self, rows: Sequence[Dict[str, Any]], *, source_url: str | None = None) -> None:
        if not rows:
            return
        for row in rows:
            ticket_num = _text(row.get("ticket_num"))
            if not ticket_num:
                continue
            if ticket_num not in self._ticket_index:
                self._ticket_index_order.append(ticket_num)
            self._ticket_index[ticket_num] = dict(row)
        if source_url:
            self._ticket_index_source_url = source_url
        self._ticket_index_limit = max(self._ticket_index_limit, len(self._ticket_index_order))

    def _find_ticket_search_input(self, page) -> Dict[str, Any]:
        try:
            candidates = page.evaluate(
                """() => {
                    const fold = (value) => (value || '')
                        .normalize('NFKD')
                        .replace(/[\\u0300-\\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, ' ')
                        .trim();
                    return Array.from(document.querySelectorAll('input, textarea')).map((el, index) => ({
                        index,
                        tag: el.tagName || '',
                        type: el.type || '',
                        name: el.name || '',
                        id: el.id || '',
                        placeholder: el.placeholder || '',
                        title: el.title || '',
                        aria: el.getAttribute('aria-label') || '',
                        labels: Array.from(el.labels || []).map((label) => (label.innerText || label.textContent || '').trim()).filter(Boolean).join(' '),
                        value: el.value || '',
                        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
                        folded: fold([
                            el.name || '',
                            el.id || '',
                            el.placeholder || '',
                            el.title || '',
                            el.getAttribute('aria-label') || '',
                            Array.from(el.labels || []).map((label) => (label.innerText || label.textContent || '').trim()).join(' ')
                        ].join(' '))
                    })).filter((item) => item.visible);
                }"""
            )
        except Exception:
            candidates = []
        keywords = ("assunto", "mensagem", "subject", "message")
        for candidate in candidates or []:
            folded = _fold(candidate.get("folded"))
            if any(keyword in folded for keyword in keywords):
                return candidate
        return {}

    def _find_ticket_filter_button(self, page) -> Dict[str, Any]:
        try:
            candidates = page.evaluate(
                """() => {
                    const fold = (value) => (value || '')
                        .normalize('NFKD')
                        .replace(/[\\u0300-\\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, ' ')
                        .trim();
                    return Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a')).map((el, index) => ({
                        index,
                        tag: el.tagName || '',
                        type: el.type || '',
                        text: (el.innerText || el.textContent || el.value || '').trim(),
                        title: el.title || '',
                        aria: el.getAttribute('aria-label') || '',
                        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
                        folded: fold([
                            el.innerText || '',
                            el.textContent || '',
                            el.value || '',
                            el.title || '',
                            el.getAttribute('aria-label') || ''
                        ].join(' '))
                    })).filter((item) => item.visible);
                }"""
            )
        except Exception:
            candidates = []
        for candidate in candidates or []:
            folded = _fold(candidate.get("folded"))
            if "filtrar" in folded or "filter" in folded:
                return candidate
        return {}

    def _direct_search_ticket(self, page, ticket_reference: str) -> tuple[Dict[str, Any], Dict[str, Any]]:
        reference = _text(ticket_reference)
        debug = {
            "direct_search_needed": True,
            "direct_search_input_found": False,
            "direct_queue_filter_cleared": False,
            "direct_filter_applied": False,
            "direct_results_count": 0,
            "direct_exact_match": False,
            "direct_search_used": False,
            "search_origin": "direct_ui_search",
            "failure_reason": "",
        }
        try:
            page.goto(SUPPORT_TICKETS_URL, wait_until="domcontentloaded")
            self._navigation_count += 1
        except Exception:
            pass
        try:
            page.wait_for_load_state("domcontentloaded", timeout=5_000)
        except Exception:
            pass
        search_candidate = self._find_ticket_search_input(page)
        if not search_candidate:
            debug["failure_reason"] = "TICKET_SEARCH_FIELD_NOT_FOUND"
            return {}, debug

        try:
            queue_candidates = page.evaluate(
                """() => {
                    const fold = (value) => (value || '')
                        .normalize('NFKD')
                        .replace(/[\\u0300-\\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, ' ')
                        .trim();
                    const resetTerms = ['all', 'todos', 'todas', 'qualquer', 'any', 'all tickets', 'todos os tickets', 'todos os status'];
                    return Array.from(document.querySelectorAll('select')).map((select, index) => {
                        const options = Array.from(select.options || []).map((option, optionIndex) => ({
                            index: optionIndex,
                            label: (option.textContent || '').trim(),
                            value: option.value || '',
                            foldedLabel: fold(option.textContent || ''),
                            foldedValue: fold(option.value || ''),
                        }));
                        const awaiting = options.find((option) =>
                            option.foldedLabel.includes('aguardando resposta')
                            || option.foldedLabel.includes('awaiting reply')
                            || option.foldedValue.includes('aguardando resposta')
                            || option.foldedValue.includes('awaiting reply')
                        );
                        const reset = options.find((option) =>
                            !option.foldedLabel
                            || resetTerms.some((term) =>
                                option.foldedLabel === term
                                || option.foldedLabel.includes(term)
                                || option.foldedValue === term
                                || option.foldedValue.includes(term)
                            )
                        );
                        return {
                            index,
                            currentValue: select.value || '',
                            awaitingFound: !!awaiting,
                            awaitingIndex: awaiting ? awaiting.index : -1,
                            resetFound: !!reset,
                            resetIndex: reset ? reset.index : -1,
                            resetLabel: reset ? reset.label : '',
                        };
                    }).filter((item) => item.awaitingFound);
                }"""
            )
        except Exception:
            queue_candidates = []
        queue_candidate = queue_candidates[0] if queue_candidates else {}
        if queue_candidate and queue_candidate.get("resetFound") and queue_candidate.get("resetIndex", -1) >= 0:
            try:
                queue_locator = page.locator("select").nth(int(queue_candidate["index"]))
                queue_locator.select_option(index=int(queue_candidate["resetIndex"]))
                try:
                    form = queue_locator.locator("xpath=ancestor::form[1]")
                    for selector in ("input[type='submit']", "button[type='submit']"):
                        try:
                            form.locator(selector).first.click(timeout=2_000)
                            break
                        except Exception:
                            continue
                except Exception:
                    pass
                debug["direct_queue_filter_cleared"] = True
                try:
                    page.wait_for_load_state("domcontentloaded", timeout=10_000)
                except Exception:
                    pass
            except Exception:
                debug["direct_queue_filter_cleared"] = False

        debug["direct_search_input_found"] = True
        input_locator = page.locator("input, textarea").nth(int(search_candidate["index"]))
        try:
            input_locator.fill(reference)
        except Exception:
            try:
                input_locator.click(timeout=2_000)
                input_locator.press_sequentially(reference, delay=10)
            except Exception:
                debug["failure_reason"] = "TICKET_SEARCH_FIELD_NOT_FOUND"
                return {}, debug
        button_candidate = self._find_ticket_filter_button(page)
        applied = False
        if button_candidate:
            try:
                button_locator = page.locator("button, input[type='submit'], input[type='button'], a").nth(int(button_candidate["index"]))
                button_locator.click(timeout=2_000)
                applied = True
            except Exception:
                applied = False
        if not applied:
            try:
                input_locator.press("Enter")
                applied = True
            except Exception:
                debug["failure_reason"] = "TICKET_FILTER_NOT_APPLIED"
                return {}, debug
        debug["direct_filter_applied"] = applied
        debug["direct_search_used"] = True
        try:
            page.wait_for_load_state("domcontentloaded", timeout=10_000)
        except Exception:
            pass
        deadline = time.monotonic() + 20
        last_rows: List[Dict[str, Any]] = []
        while time.monotonic() < deadline:
            try:
                last_rows = self._parse_ticket_rows(page, status=None, limit=200)
            except Exception:
                last_rows = []
            debug["direct_results_count"] = len(last_rows)
            exact_rows = [row for row in last_rows if _fold(row.get("ticket_num")) == _fold(reference)]
            if exact_rows:
                debug["direct_exact_match"] = True
                self._merge_ticket_rows(exact_rows, source_url=page.url)
                return exact_rows[0], debug
            page.wait_for_timeout(1_000)
        debug["failure_reason"] = "TICKET_NOT_FOUND_IN_UI"
        return {}, debug

    def list_tickets(self, *, status: str | None = None, limit: int = 20, limitstart: int = 0, subject: str | None = None) -> List[Dict[str, Any]]:
        self._ensure_authenticated(allow_manual_login=False)
        if self._can_reuse_ticket_index(status, limit + limitstart, subject):
            rows = [dict(self._ticket_index[ticket_num]) for ticket_num in self._ticket_index_order]
            if limitstart:
                rows = rows[limitstart:]
            if subject:
                subject_folded = _fold(subject)
                rows = [row for row in rows if subject_folded in _fold(row.get("subject"))]
            self._last_dom_debug = {
                **self._last_dom_debug,
                "normalized_ticket_count": len(rows),
                "queue_requested": status or "Awaiting Reply",
                "reused_cache": True,
            }
            return rows[:limit]
        page = self._focused_page()
        requested_status = status or "Awaiting Reply"
        self._listings_executed += 1
        queue_debug = self._apply_queue_filter(page, requested_status)
        dom_debug = self._wait_for_ticket_queue(page, requested_status, timeout_seconds=30)
        self._current_url = page.url
        rows = self._parse_ticket_rows(page, status=requested_status, limit=limit + limitstart)
        self._cache_ticket_rows(rows, status=requested_status, source_url=page.url, limit=limit + limitstart)
        if limitstart:
            rows = rows[limitstart:]
        if subject:
            subject_folded = _fold(subject)
            rows = [row for row in rows if subject_folded in _fold(row.get("subject"))]
        self._last_dom_debug = {
            **dom_debug,
            **queue_debug,
            "queue_filter_found": queue_debug.get("queue_filter_found", dom_debug.get("queue_filter_found", False)),
            "awaiting_reply_option_found": queue_debug.get(
                "awaiting_reply_option_found", dom_debug.get("awaiting_reply_option_found", False)
            ),
            "filter_applied": queue_debug.get("filter_applied", dom_debug.get("filter_applied", False)),
            "failure_reason": dom_debug.get("failure_reason") or queue_debug.get("failure_reason", ""),
            "normalized_ticket_count": len(rows),
            "queue_requested": requested_status,
            "queue_filter_applications": self._queue_filter_applications,
            "listings_executed": self._listings_executed,
        }
        if not rows and self._last_queue_status not in {"OK", "BROWSER_UI_READ_INCOMPLETE"}:
            self._last_queue_status = "BROWSER_UI_READ_INCOMPLETE"
            self._last_queue_reason = self._last_queue_reason or self._last_dom_debug.get("failure_reason", "")
        return rows[:limit]

    def find_ticket_by_number(self, ticket_number: str) -> Dict[str, Any]:
        self._ensure_authenticated(allow_manual_login=False)
        cached = self._get_cached_ticket_row(ticket_number)
        if cached:
            return cached
        page = self._focused_page()
        direct_row, debug = self._direct_search_ticket(page, ticket_number)
        self._last_dom_debug = {**self._last_dom_debug, **debug}
        if direct_row:
            return direct_row
        return {}

    def _open_ticket_url(self, ticket_number: str) -> str:
        row = self._get_cached_ticket_row(ticket_number) or self.find_ticket_by_number(ticket_number)
        if row.get("ticket_url"):
            return row["ticket_url"]
        return ""

    def _extract_label_map(self, page) -> Dict[str, str]:
        labels: Dict[str, str] = {}
        try:
            pairs = page.evaluate(
                """() => {
                    const candidates = Array.from(document.querySelectorAll('tr, li, div, p, span'));
                    return candidates.map(node => (node.innerText || '').trim()).filter(text => text.includes(':')).slice(0, 400);
                }"""
            )
        except Exception:
            pairs = []
        for entry in pairs or []:
            if ":" not in entry:
                continue
            key, value = entry.split(":", 1)
            normalized_key = _normalize_header(key)
            labels.setdefault(normalized_key, value.strip())
        return labels

    def _extract_messages(self, page) -> List[Dict[str, Any]]:
        message_blocks: List[Dict[str, Any]] = []
        try:
            blocks = page.locator("div[class*='reply'], div[class*='message'], section[class*='reply'], section[class*='message'], article")
            count = blocks.count()
        except Exception:
            count = 0
            blocks = None
        for index in range(count):
            try:
                block = blocks.nth(index)
                text = block.inner_text(timeout=2_000).strip()
            except Exception:
                continue
            if len(text) < 20:
                continue
            folded = _fold(text)
            author = "cliente"
            if any(term in folded for term in ["admin", "staff", "suporte", "atendente", "whmcs"]):
                author = "suporte"
            message_blocks.append({"author_type": author, "message": text})
        return message_blocks

    def get_client_services(self, ticket_reference: str) -> List[Dict[str, Any]]:
        detail = self.get_ticket(ticket_reference)
        services: List[Dict[str, Any]] = []
        if detail.get("service"):
            services.append(
                {
                    "service": detail.get("service", ""),
                    "domain": detail.get("domain", ""),
                    "service_id": detail.get("serviceid", ""),
                    "status": detail.get("status", ""),
                }
            )
        return services

    def get_ticket(self, ticket_reference: str) -> Dict[str, Any]:
        self._ensure_authenticated(allow_manual_login=False)
        reference = _text(ticket_reference)
        row = self._get_cached_ticket_row(reference)
        search_debug: Dict[str, Any] = {}
        if not row:
            row = self.find_ticket_by_number(reference)
            search_debug = dict(self._last_dom_debug)
        if not row:
            raise RuntimeError(f"TICKET_NOT_FOUND_IN_UI: {reference}")
        page = self._focused_page()
        ticket_nav = self._open_ticket_row(page, row)
        if self._is_login_screen(page):
            raise RuntimeError("SESSION_EXPIRED: WHMCS redirecionou para login.")
        if not _is_valid_ticket_detail_url(page.url):
            raise RuntimeError("INVALID_ADMIN_PATH: caminho administrativo invalido.")
        same_context = self._context is not None and page in self._pages()
        if self._context is not None and not same_context:
            raise RuntimeError("SESSION_EXPIRED: contexto browser diferente.")

        body_text = ""
        try:
            body_text = page.locator("body").inner_text(timeout=3_000)
        except Exception:
            body_text = ""
        labels = self._extract_label_map(page)
        messages = self._extract_messages(page)

        title = ""
        for selector in ("h1", "h2", ".panel-title", ".ticket-title", "title"):
            try:
                text = page.locator(selector).first.inner_text(timeout=2_000).strip()
                if text:
                    title = text
                    break
            except Exception:
                continue

        subject = row.get("subject") or title
        ticket_num = row.get("ticket_num") or reference
        service = labels.get("produto_servico") or labels.get("produto_serviço") or labels.get("service") or labels.get("servico") or labels.get("serviço") or ""
        domain = labels.get("dominio") or labels.get("domínio") or labels.get("domain") or ""
        status = row.get("status") or labels.get("status") or ""
        department = row.get("department") or labels.get("departamento") or ""
        replies = messages[1:] if len(messages) > 1 else messages
        initial_message = messages[0]["message"] if messages else body_text
        detail = {
            "ticket_id": row.get("ticket_id") or "",
            "ticketid": row.get("ticket_id") or "",
            "tid": ticket_num,
            "ticket_num": ticket_num,
            "subject": subject,
            "title": title or subject,
            "status": status,
            "department": department,
            "service": service,
            "domain": domain,
            "message": initial_message,
            "body": body_text,
            "replies": replies,
            "notes": "",
            "name": "",
            "email": "",
            "serviceid": "",
            "source": "browser-ui",
        }
        self._last_dom_debug = {
            **self._last_dom_debug,
            **search_debug,
            "opened_ticket": ticket_num,
            "opened_candidate": True,
            "open_origin": search_debug.get("search_origin") or "queue_index",
            "returned_to_list": True,
            "open_method": ticket_nav.get("method", "goto"),
            "href_relative": ticket_nav.get("href_relative", False),
            "url_resolved_in_gestor": ticket_nav.get("url_resolved_in_gestor", False),
            "detail_detected": True,
            "login_real_detected": not self._is_login_screen(page),
            "opened_status": status,
            "opened_department": department,
            "technical_result": "OK",
        }
        return_to = self._ticket_index_source_url or SUPPORT_TICKETS_URL
        if return_to:
            try:
                page.goto(return_to, wait_until="domcontentloaded")
                self._navigation_count += 1
                self._current_url = return_to
            except Exception:
                self._current_url = page.url
        return detail

    def debug_snapshot(self, status: str | None = None, limit: int = 20) -> Dict[str, Any]:
        if self._ticket_index:
            rows = [dict(self._ticket_index[ticket_num]) for ticket_num in self._ticket_index_order]
        else:
            rows = []
        return {
            "browser_started": True,
            "logged_in": self._logged_in,
            "current_page": self._current_url or SUPPORT_TICKETS_URL,
            "current_path": urlparse(self._current_url or SUPPORT_TICKETS_URL).path or "/",
            "page_title": self._last_dom_debug.get("title", ""),
            "visible_tickets": len(rows),
            "candidates": [row.get("ticket_num") for row in rows if row.get("candidate_score", 0) >= 70],
            "persistent_profile_configured": self.browser_session == "persistent",
            "browser_ui_status": self._last_queue_status or ("OK" if rows else "BROWSER_UI_READ_INCOMPLETE"),
            "browser_ui_reason": self._last_queue_reason or self._last_dom_debug.get("failure_reason", ""),
            "queue_filter_found": self._last_dom_debug.get("queue_filter_found", False),
            "awaiting_reply_option_found": self._last_dom_debug.get("awaiting_reply_option_found", False),
            "filter_applied": self._last_dom_debug.get("filter_applied", False),
            "items_found_text": self._last_dom_debug.get("items_found_text", ""),
            "visible_tables": self._last_dom_debug.get("visible_tables", 0),
            "candidate_tables": self._last_dom_debug.get("candidate_tables", 0),
            "headers_found": self._last_dom_debug.get("headers_found", []),
            "chosen_table_rows": self._last_dom_debug.get("chosen_table_rows", 0),
            "ticket_link_count": self._last_dom_debug.get("ticket_link_count", 0),
            "normalized_ticket_count": self._last_dom_debug.get("normalized_ticket_count", len(rows)),
            "failure_reason": self._last_dom_debug.get("failure_reason", ""),
            "rows_analyzed": sum(self._last_row_rejection_stats.values()) + len(rows),
            "rows_accepted": len(rows),
            "rows_rejected": sum(self._last_row_rejection_stats.values()),
            "rejection_stats": dict(self._last_row_rejection_stats),
            "rejection_samples": self._last_row_rejection_samples[:5],
            "ticket_index_count": len(self._ticket_index),
            "queue_filter_applications": self._queue_filter_applications,
            "listings_executed": self._listings_executed,
            "navigation_count": self._navigation_count,
            "loop_detected": self._loop_detected,
            "direct_search_needed": self._last_dom_debug.get("direct_search_needed", False),
            "direct_search_input_found": self._last_dom_debug.get("direct_search_input_found", False),
            "direct_queue_filter_cleared": self._last_dom_debug.get("direct_queue_filter_cleared", False),
            "direct_filter_applied": self._last_dom_debug.get("direct_filter_applied", False),
            "direct_results_count": self._last_dom_debug.get("direct_results_count", 0),
            "direct_exact_match": self._last_dom_debug.get("direct_exact_match", False),
            "direct_search_used": self._last_dom_debug.get("direct_search_used", False),
            "search_origin": self._last_dom_debug.get("search_origin", ""),
            "opened_ticket": self._last_dom_debug.get("opened_ticket", ""),
            "open_origin": self._last_dom_debug.get("open_origin", ""),
            "detail_detected": self._last_dom_debug.get("detail_detected", False),
            "login_real_detected": self._last_dom_debug.get("login_real_detected", False),
            "technical_result": self._last_dom_debug.get("technical_result", ""),
        }
