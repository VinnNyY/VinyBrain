from __future__ import annotations

import argparse
import json
import unicodedata
from typing import Any

from _common import NOTION_VERSION, http_get, http_json, load_env_file, missing_keys, safe_json

NOTION_API_KEY_KEY = "NOTION_API_KEY"
NOTION_PARENT_PAGE_KEY = "NOTION_PARENT_PAGE_ID"
TEST_TITLE = "[TESTE] Reunião de validação da integração"
TARGET_SECTION = "Reuniões"


def _title_from_page(page: dict[str, Any]) -> str:
    title = page.get("title")
    if isinstance(title, str) and title.strip():
        return title.strip()

    properties = page.get("properties")
    if isinstance(properties, dict):
        for value in properties.values():
            if isinstance(value, dict) and value.get("type") == "title":
                title_items = value.get("title", [])
                if title_items:
                    parts: list[str] = []
                    for item in title_items:
                        if isinstance(item, dict):
                            text = item.get("plain_text")
                            if isinstance(text, str) and text.strip():
                                parts.append(text.strip())
                                continue
                            text = item.get("text", {}).get("content") if isinstance(item.get("text"), dict) else None
                            if isinstance(text, str) and text.strip():
                                parts.append(text.strip())
                    if parts:
                        return "".join(parts).strip()
    return ""


def _normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text)
    stripped = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return stripped.casefold().strip()


def _first_page_result(search_response: dict[str, Any], target_title: str) -> dict[str, Any] | None:
    results = search_response.get("results", [])
    if not isinstance(results, list):
        return None

    target_norm = _normalize(target_title)
    for item in results:
        if not isinstance(item, dict):
            continue
        if item.get("object") != "page":
            continue
        if _normalize(_title_from_page(item)) == target_norm:
            return item
    return None


def _notion_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Accept": "application/json",
    }


def search_page(token: str, query: str) -> dict[str, Any]:
    status, body = http_json(
        "POST",
        "https://api.notion.com/v1/search",
        headers=_notion_headers(token),
        payload={
            "query": query,
            "filter": {"property": "object", "value": "page"},
        },
    )
    if not 200 <= status < 300:
        raise RuntimeError(f"Falha ao buscar paginas no Notion (status {status}).")
    try:
        return json.loads(body) if body else {}
    except json.JSONDecodeError as exc:
        raise RuntimeError("Resposta invalida ao buscar paginas no Notion.") from exc


def create_test_page(token: str, parent_page_id: str) -> dict[str, Any]:
    payload = {
        "parent": {"page_id": parent_page_id},
        "properties": {
            "title": {
                "title": [
                    {
                        "type": "text",
                        "text": {"content": TEST_TITLE},
                    }
                ]
            }
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": (
                                    "Pagina controlada para validar a criacao real de paginas "
                                    "na estrutura existente de Reunioes."
                                )
                            },
                        }
                    ]
                },
            }
        ],
    }
    status, body = http_json(
        "POST",
        "https://api.notion.com/v1/pages",
        headers=_notion_headers(token),
        payload=payload,
    )
    result: dict[str, Any] = {"status": status}
    if body:
        try:
            result["response"] = json.loads(body)
        except json.JSONDecodeError:
            result["response"] = {"raw": body}
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a controlled Notion meeting page.")
    parser.add_argument("--apply", action="store_true", help="Create the test page for real.")
    args = parser.parse_args()

    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing = missing_keys(env, [NOTION_API_KEY_KEY, NOTION_PARENT_PAGE_KEY])
    if missing:
        print(safe_json({"ok": False, "missing": missing}))
        return 1

    token = env[NOTION_API_KEY_KEY]
    root_parent_id = env[NOTION_PARENT_PAGE_KEY]

    root_page = _first_page_result(search_page(token, "Viny Hub"), "Viny Hub")
    if not root_page:
        print(safe_json({"ok": False, "error": 'Nao foi possivel localizar a pagina "Viny Hub" no Notion.'}))
        return 1

    root_page_id = root_page.get("id")
    if not isinstance(root_page_id, str) or not root_page_id.strip():
        print(safe_json({"ok": False, "error": "Nao foi possivel identificar o ID da pagina Viny Hub."}))
        return 1

    try:
        search_response = search_page(token, TARGET_SECTION)
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    section_page = _first_page_result(search_response, TARGET_SECTION)
    if not section_page:
        print(
            safe_json(
                {
                    "ok": False,
                    "error": f'Nao foi possivel localizar a pagina "{TARGET_SECTION}" no Notion.',
                }
            )
        )
        return 1

    section_parent = section_page.get("parent", {})
    section_parent_id = section_parent.get("page_id") if isinstance(section_parent, dict) else None
    if section_parent_id != root_page_id:
        print(
            safe_json(
                {
                    "ok": False,
                    "error": f'A pagina "{TARGET_SECTION}" foi encontrada, mas nao esta abaixo de "Viny Hub".',
                }
            )
        )
        return 1

    section_page_id = section_page.get("id")
    if not isinstance(section_page_id, str) or not section_page_id.strip():
        print(safe_json({"ok": False, "error": "Nao foi possivel identificar o ID da pagina Reunioes."}))
        return 1

    plan = {
        "system": "notion",
        "mode": "apply" if args.apply else "dry-run",
        "target_section": TARGET_SECTION,
        "target_parent_page_id": section_page_id,
        "root_page_id": root_page_id,
        "warnings": (
            ["Viny Hub foi localizado e sera usado como base; a validacao do parent externo nao sera bloqueante."]
            if root_parent_id
            else []
        ),
        "create": {
            "title": TEST_TITLE,
            "children": [
                "Pagina de teste controlado para validar criacao real dentro de Reunioes.",
            ],
        },
    }
    print(safe_json({"ok": True, "plan": plan}))

    if not args.apply:
        return 0

    result = create_test_page(token, section_page_id)
    if not 200 <= int(result["status"]) < 300:
        print(safe_json({"ok": False, "created": result}))
        return 1

    print(safe_json({"ok": True, "created": result}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
