import unittest
from types import SimpleNamespace

from whmcs_browser_ui_provider import (
    _extract_ticket_number_from_link_text,
    _normalize_table_row,
    _strip_ticket_prefix,
    _safe_ticket_href,
    _is_valid_ticket_detail_url,
    WHMCSBrowserUIProvider,
)


class TestWhmcsBrowserUiProvider(unittest.TestCase):
    def test_extract_ticket_number_from_link_text(self):
        self.assertEqual(
            _extract_ticket_number_from_link_text("#WYD-862830 - Solicitação de ativação de plugin(s): Elementor PRO"),
            "WYD-862830",
        )
        self.assertEqual(
            _extract_ticket_number_from_link_text("#PMN-083938 - Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons"),
            "PMN-083938",
        )
        self.assertEqual(
            _extract_ticket_number_from_link_text("QME-127927 - Solicitação de ativação de plugin(s): WP Rocket"),
            "QME-127927",
        )

    def test_strip_ticket_prefix(self):
        self.assertEqual(
            _strip_ticket_prefix("#WYD-862830 - Solicitação de ativação de plugin(s): Elementor PRO", "WYD-862830"),
            "Solicitação de ativação de plugin(s): Elementor PRO",
        )
        self.assertEqual(
            _strip_ticket_prefix("#PMN-083938\n- Solicitação de ativação de plugin(s): Elementor PRO...", "PMN-083938"),
            "Solicitação de ativação de plugin(s): Elementor PRO...",
        )

    def test_safe_ticket_href(self):
        self.assertTrue(_safe_ticket_href("https://painel.staycloud.com.br/gestor/supporttickets.php", "/gestor/supporttickets.php?tid=1")[0])
        self.assertTrue(_safe_ticket_href("https://painel.staycloud.com.br/gestor/supporttickets.php", "https://painel.staycloud.com.br/gestor/supporttickets.php?tid=1")[0])
        self.assertFalse(_safe_ticket_href("https://painel.staycloud.com.br/gestor/supporttickets.php", "javascript:alert(1)")[0])

    def test_normalize_table_row_with_offset_columns(self):
        headers = ["", "", "Departamento", "Assunto", "Status", "Última Resposta"]
        cells = ["", "■", "Suporte Técnico", "#PMN-083938 - Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons", "Aguardando Resposta", "hoje"]
        links = [{"text": "#PMN-083938 - Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons", "href": "/gestor/supporttickets.php?action=view&id=15745"}]
        row, debug = _normalize_table_row(
            page_url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            headers=headers,
            cells=cells,
            links=links,
            requested_status="Awaiting Reply",
        )
        self.assertIsNotNone(row)
        self.assertEqual(row["ticket_num"], "PMN-083938")
        self.assertEqual(row["subject"], "Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons")
        self.assertEqual(row["department"], "Suporte Técnico")
        self.assertEqual(row["status"], "Aguardando Resposta")
        self.assertTrue(debug["href_safe"])

    def test_normalize_table_row_keeps_partial_row_with_unknown_status(self):
        headers = ["Departamento", "Assunto", "Status", "Última Resposta"]
        cells = ["Suporte Técnico", "#PMN-083938 - Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons", "", "hoje"]
        links = [{"text": "#PMN-083938 - Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons", "href": "/gestor/supporttickets.php?action=view&id=15745"}]
        row, debug = _normalize_table_row(
            page_url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            headers=headers,
            cells=cells,
            links=links,
            requested_status="Awaiting Reply",
        )
        self.assertIsNotNone(row)
        self.assertEqual(row["ticket_num"], "PMN-083938")
        self.assertEqual(row["status"], "UNKNOWN")
        self.assertEqual(row["row_data_quality"], "PARTIAL")
        self.assertTrue(debug["href_safe"])

    def test_list_tickets_populates_cache_once(self):
        provider = WHMCSBrowserUIProvider()
        provider._ensure_authenticated = lambda allow_manual_login=False, timeout_seconds=None: None
        provider._focused_page = lambda: SimpleNamespace(url="https://painel.staycloud.com.br/gestor/supporttickets.php")
        calls = {"apply": 0, "wait": 0, "parse": 0}

        def apply_filter(page, status):
            calls["apply"] += 1
            return {"queue_filter_found": True, "awaiting_reply_option_found": True, "filter_applied": True, "failure_reason": ""}

        def wait_queue(page, status, timeout_seconds=30):
            calls["wait"] += 1
            return {
                "path": "/gestor/supporttickets.php",
                "title": "WHMCS - Tickets de Suporte",
                "queue_filter_found": True,
                "awaiting_reply_option_found": True,
                "filter_applied": True,
                "items_found_text": "Itens encontrados",
                "visible_tables": 1,
                "candidate_tables": 1,
                "headers_found": [["departamento", "assunto", "status"]],
                "chosen_table_rows": 14,
                "ticket_link_count": 14,
                "normalized_ticket_count": 0,
                "failure_reason": "",
            }

        def parse_rows(page, status=None, limit=20):
            calls["parse"] += 1
            return [
                {
                    "ticket_num": "PMN-083938",
                    "subject": "Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons",
                    "department": "Suporte Técnico",
                    "status": "Aguardando Resposta",
                    "ticket_url": "/gestor/supporttickets.php?action=view&id=15745",
                    "candidate_score": 100,
                }
            ]

        provider._apply_queue_filter = apply_filter
        provider._wait_for_ticket_queue = wait_queue
        provider._parse_ticket_rows = parse_rows

        first = provider.list_tickets(status="Awaiting Reply", limit=20)
        second = provider.list_tickets(status="Awaiting Reply", limit=20)

        self.assertEqual(len(first), 1)
        self.assertEqual(len(second), 1)
        self.assertEqual(calls["apply"], 1)
        self.assertEqual(calls["wait"], 1)
        self.assertEqual(calls["parse"], 1)
        self.assertEqual(len(provider._ticket_index), 1)

    def test_get_ticket_uses_cached_href_without_relisting(self):
        provider = WHMCSBrowserUIProvider()
        provider._ensure_authenticated = lambda allow_manual_login=False, timeout_seconds=None: None
        opened_urls = []
        provider._focused_page = lambda: SimpleNamespace(
            url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            goto=lambda url, wait_until="domcontentloaded": opened_urls.append(url),
            locator=lambda selector: SimpleNamespace(
                inner_text=lambda timeout=3000: "Ticket body",
                first=SimpleNamespace(inner_text=lambda timeout=2000: "WHMCS Ticket"),
            ),
            title=lambda: "WHMCS Ticket",
        )
        provider._ticket_index = {
            "PMN-083938": {
                "ticket_num": "PMN-083938",
                "subject": "Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons",
                "department": "Suporte Técnico",
                "status": "Aguardando Resposta",
                "ticket_url": "/gestor/supporttickets.php?action=view&id=15745",
                "candidate_score": 100,
            }
        }
        provider._ticket_index_order = ["PMN-083938"]
        provider._ticket_index_status = "Awaiting Reply"
        provider._active_queue = "awaiting reply"
        provider._last_dom_debug = {"queue_requested": "Awaiting Reply"}
        provider._parse_ticket_rows = lambda *args, **kwargs: self.fail("nao deve relistar")
        provider.list_tickets = lambda *args, **kwargs: self.fail("nao deve chamar list_tickets")

        detail = provider.get_ticket("PMN-083938")

        self.assertEqual(detail["ticket_num"], "PMN-083938")
        self.assertIn("https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15745", opened_urls)
        self.assertTrue(opened_urls[-1].endswith("/gestor/supporttickets.php"))

    def test_get_ticket_not_found_without_loop(self):
        provider = WHMCSBrowserUIProvider()
        provider._ensure_authenticated = lambda allow_manual_login=False, timeout_seconds=None: None
        provider._focused_page = lambda: SimpleNamespace(
            url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            goto=lambda url, wait_until="domcontentloaded": None,
            locator=lambda selector: SimpleNamespace(
                inner_text=lambda timeout=3000: "Ticket body",
                first=SimpleNamespace(inner_text=lambda timeout=2000: "WHMCS Ticket"),
            ),
            title=lambda: "WHMCS Ticket",
        )
        provider._ticket_index = {}
        provider._direct_search_ticket = lambda page, ref: ({}, {"failure_reason": "TICKET_NOT_FOUND_IN_UI", "direct_search_used": True, "search_origin": "direct_ui_search"})
        with self.assertRaisesRegex(RuntimeError, "TICKET_NOT_FOUND_IN_UI"):
            provider.get_ticket("PMN-083938")

    def test_get_ticket_uses_direct_ui_search_when_missing_from_index(self):
        provider = WHMCSBrowserUIProvider()
        provider._ensure_authenticated = lambda allow_manual_login=False, timeout_seconds=None: None
        opened_urls = []
        provider._focused_page = lambda: SimpleNamespace(
            url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            goto=lambda url, wait_until="domcontentloaded": opened_urls.append(url),
            locator=lambda selector: SimpleNamespace(
                inner_text=lambda timeout=3000: "Ticket body",
                first=SimpleNamespace(inner_text=lambda timeout=2000: "WHMCS Ticket"),
            ),
            title=lambda: "WHMCS Ticket",
        )
        provider._ticket_index = {}
        provider._direct_search_ticket = lambda page, ref: (
            {
                "ticket_num": "PMN-083938",
                "subject": "Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons",
                "department": "Suporte Técnico",
                "status": "Open",
                "ticket_url": "/gestor/supporttickets.php?action=view&id=15745",
                "candidate_score": 100,
            },
            {
                "failure_reason": "",
                "direct_search_needed": True,
                "direct_search_input_found": True,
                "direct_filter_applied": True,
                "direct_results_count": 1,
                "direct_exact_match": True,
                "direct_search_used": True,
                "search_origin": "direct_ui_search",
            },
        )

        detail = provider.get_ticket("PMN-083938")

        self.assertEqual(detail["ticket_num"], "PMN-083938")
        self.assertTrue(opened_urls)
        self.assertIn("https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15745", opened_urls)
        self.assertEqual(provider._last_dom_debug.get("open_origin"), "direct_ui_search")

    def test_multiple_cached_candidates_do_not_relist(self):
        provider = WHMCSBrowserUIProvider()
        provider._ensure_authenticated = lambda allow_manual_login=False, timeout_seconds=None: None
        provider._focused_page = lambda: SimpleNamespace(
            url="https://painel.staycloud.com.br/gestor/supporttickets.php",
            goto=lambda url, wait_until="domcontentloaded": setattr(provider, "_opened_url", url),
            locator=lambda selector: SimpleNamespace(
                inner_text=lambda timeout=3000: "Ticket body",
                first=SimpleNamespace(inner_text=lambda timeout=2000: "WHMCS Ticket"),
            ),
            title=lambda: "WHMCS Ticket",
        )
        provider._ticket_index = {
            "WYD-862830": {
                "ticket_num": "WYD-862830",
                "subject": "Solicitação de ativação de plugin(s): Elementor PRO",
                "department": "Suporte Técnico",
                "status": "Aguardando Resposta",
                "ticket_url": "/gestor/supporttickets.php?action=view&id=1",
                "candidate_score": 100,
            },
            "PMN-083938": {
                "ticket_num": "PMN-083938",
                "subject": "Solicitação de ativação de plugin(s): Elementor PRO, Essentials Addons",
                "department": "Suporte Técnico",
                "status": "Aguardando Resposta",
                "ticket_url": "/gestor/supporttickets.php?action=view&id=2",
                "candidate_score": 100,
            },
            "QME-127927": {
                "ticket_num": "QME-127927",
                "subject": "Solicitação de ativação de plugin(s): WP Rocket",
                "department": "Suporte Técnico",
                "status": "Aguardando Resposta",
                "ticket_url": "/gestor/supporttickets.php?action=view&id=3",
                "candidate_score": 100,
            },
        }
        provider._ticket_index_order = ["WYD-862830", "PMN-083938", "QME-127927"]
        provider._ticket_index_status = "Awaiting Reply"
        provider._active_queue = "awaiting reply"
        provider._last_dom_debug = {"queue_requested": "Awaiting Reply"}
        provider.list_tickets = lambda *args, **kwargs: self.fail("nao deve relistar")

        first = provider.get_ticket("WYD-862830")
        second = provider.get_ticket("PMN-083938")
        third = provider.get_ticket("QME-127927")

        self.assertEqual(first["ticket_num"], "WYD-862830")
        self.assertEqual(second["ticket_num"], "PMN-083938")
        self.assertEqual(third["ticket_num"], "QME-127927")

    def test_ticket_url_validation_variants(self):
        base = "https://painel.staycloud.com.br/gestor/supporttickets.php"
        self.assertTrue(_is_valid_ticket_detail_url("https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15754"))
        self.assertTrue(_is_valid_ticket_detail_url("https://painel.staycloud.com.br/gestor/supporttickets.php?tid=1"))
        self.assertFalse(_is_valid_ticket_detail_url("https://painel.staycloud.com.br/supporttickets.php?action=view&id=15754"))
        self.assertFalse(_is_valid_ticket_detail_url("javascript:alert(1)"))
        self.assertEqual(_safe_ticket_href(base, "supporttickets.php?action=view&id=15754")[1], "https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15754")
        self.assertEqual(_safe_ticket_href(base, "?action=view&id=15754")[1], "https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15754")
        self.assertEqual(_safe_ticket_href(base, "/gestor/supporttickets.php?action=view&id=15754")[1], "https://painel.staycloud.com.br/gestor/supporttickets.php?action=view&id=15754")


if __name__ == "__main__":
    unittest.main()
