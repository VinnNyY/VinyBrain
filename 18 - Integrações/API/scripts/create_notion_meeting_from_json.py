from __future__ import annotations

import argparse
import json
import unicodedata
from pathlib import Path
from typing import Any

from _common import NOTION_VERSION, http_json, load_env_file, missing_keys, safe_json

NOTION_API_KEY_KEY = "NOTION_API_KEY"
TARGET_SECTION = "Reuniões"
TARGET_ROOT = "Viny Hub"


def _normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text)
    stripped = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return stripped.casefold().strip()


def _title_from_page(page: dict[str, Any]) -> str:
    properties = page.get("properties")
    if isinstance(properties, dict):
        for value in properties.values():
            if isinstance(value, dict) and value.get("type") == "title":
                title_items = value.get("title", [])
                if isinstance(title_items, list):
                    parts: list[str] = []
                    for item in title_items:
                        if isinstance(item, dict):
                            plain = item.get("plain_text")
                            if isinstance(plain, str) and plain.strip():
                                parts.append(plain.strip())
                    if parts:
                        return "".join(parts).strip()
    return ""


def _find_page(results: object, title: str) -> dict[str, Any] | None:
    if not isinstance(results, list):
        return None
    target = _normalize(title)
    for item in results:
        if not isinstance(item, dict) or item.get("object") != "page":
            continue
        if _normalize(_title_from_page(item)) == target:
            return item
    return None


def _notion_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Accept": "application/json",
    }


def _search_pages(token: str, query: str) -> dict[str, Any]:
    status, body = http_json(
        "POST",
        "https://api.notion.com/v1/search",
        headers=_notion_headers(token),
        payload={"query": query, "filter": {"property": "object", "value": "page"}},
    )
    if not 200 <= status < 300:
        raise RuntimeError(f"Falha ao consultar Notion (status {status}).")
    return json.loads(body) if body else {}


def _require_string(data: dict[str, Any], key: str) -> str | None:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        return key
    return None


def _require_list(data: dict[str, Any], key: str) -> str | None:
    value = data.get(key)
    if not isinstance(value, list):
        return key
    return None


def _validate_payload(data: dict[str, Any]) -> str | None:
    required_strings = ["titulo", "data", "contexto", "resumo_executivo", "status"]
    for key in required_strings:
        missing = _require_string(data, key)
        if missing:
            return missing

    required_lists = [
        "participantes",
        "pontos_discutidos",
        "decisoes",
        "pendencias",
        "proximos_passos",
        "links_relacionados",
    ]
    for key in required_lists:
        missing = _require_list(data, key)
        if missing:
            return missing

    pendencias = data.get("pendencias", [])
    if isinstance(pendencias, list):
        for index, item in enumerate(pendencias):
            if not isinstance(item, dict):
                return f"pendencias[{index}]"
            for nested_key in ("descricao", "responsavel", "prazo"):
                nested_value = item.get(nested_key)
                if not isinstance(nested_value, str) or not nested_value.strip():
                    return f"pendencias[{index}].{nested_key}"
    return None


def _rich_text(text: str) -> list[dict[str, Any]]:
    return [{"type": "text", "text": {"content": text}}]


def _bullets(items: list[str]) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    for item in items:
        blocks.append(
            {
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": _rich_text(item)},
            }
        )
    return blocks


def _children_from_payload(payload: dict[str, Any]) -> list[dict[str, Any]]:
    children: list[dict[str, Any]] = [
        {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Resumo executivo")}},
        {"object": "block", "type": "paragraph", "paragraph": {"rich_text": _rich_text(payload["resumo_executivo"])}},
        {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Data")}},
        {"object": "block", "type": "paragraph", "paragraph": {"rich_text": _rich_text(payload["data"])}},
        {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Contexto")}},
        {"object": "block", "type": "paragraph", "paragraph": {"rich_text": _rich_text(payload["contexto"])}},
        {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Participantes")}},
    ]
    children.extend(_bullets([str(item) for item in payload["participantes"]]))
    children.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Pontos discutidos")}})
    children.extend(_bullets([str(item) for item in payload["pontos_discutidos"]]))
    children.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Decisões")}})
    children.extend(_bullets([str(item) for item in payload["decisoes"]]))
    children.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Pendências")}})
    for item in payload["pendencias"]:
        if not isinstance(item, dict):
            continue
        children.append(
            {
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": _rich_text(
                        f"{item['descricao']} | Responsável: {item['responsavel']} | Prazo: {item['prazo']}"
                    )
                },
            }
        )
    children.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Próximos passos")}})
    children.extend(_bullets([str(item) for item in payload["proximos_passos"]]))
    children.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Links relacionados")}})
    links = [str(item) for item in payload["links_relacionados"]]
    if links:
        children.extend(_bullets(links))
    else:
        children.append(
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": _rich_text("Nenhum link relacionado informado.")},
            }
        )
    children.extend(
        [
            {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _rich_text("Status")}},
            {"object": "block", "type": "paragraph", "paragraph": {"rich_text": _rich_text(payload["status"])}},
        ]
    )
    return children


def _create_page(token: str, parent_page_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    notion_payload = {
        "parent": {"page_id": parent_page_id},
        "properties": {
            "title": {
                "title": [{"type": "text", "text": {"content": payload["titulo"]}}],
            }
        },
        "children": _children_from_payload(payload),
    }
    status, body = http_json(
        "POST",
        "https://api.notion.com/v1/pages",
        headers=_notion_headers(token),
        payload=notion_payload,
    )
    result: dict[str, Any] = {"status": status}
    if body:
        try:
            result["response"] = json.loads(body)
        except json.JSONDecodeError:
            result["response"] = {"raw": body}
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a Notion meeting page from JSON.")
    parser.add_argument("json_file", help="Arquivo JSON com os dados da reuniao.")
    parser.add_argument("--apply", action="store_true", help="Criar a pagina real no Notion.")
    args = parser.parse_args()

    path = Path(args.json_file)
    if not path.exists():
        print(path.as_posix())
        return 1

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print(path.as_posix())
        return 1

    if not isinstance(payload, dict):
        print(path.as_posix())
        return 1

    missing = _validate_payload(payload)
    if missing:
        print(missing)
        return 1

    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing_env = missing_keys(env, [NOTION_API_KEY_KEY])
    if missing_env:
        print(safe_json({"ok": False, "missing": missing_env}))
        return 1

    token = env[NOTION_API_KEY_KEY]
    try:
        root_results = _search_pages(token, TARGET_ROOT)
        root_page = _find_page(root_results.get("results", []), TARGET_ROOT)
        if not root_page:
            print(safe_json({"ok": False, "error": 'Nao foi possivel localizar a pagina "Viny Hub".'}))
            return 1

        section_results = _search_pages(token, TARGET_SECTION)
        section_page = _find_page(section_results.get("results", []), TARGET_SECTION)
        if not section_page:
            print(safe_json({"ok": False, "error": 'Nao foi possivel localizar a pagina "Reunioes".'}))
            return 1
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    root_page_id = root_page.get("id")
    section_page_id = section_page.get("id")
    section_parent = section_page.get("parent", {})
    if not isinstance(root_page_id, str) or not root_page_id.strip():
        print(safe_json({"ok": False, "error": 'Nao foi possivel identificar o ID da pagina "Viny Hub".'}))
        return 1
    if not isinstance(section_page_id, str) or not section_page_id.strip():
        print(safe_json({"ok": False, "error": 'Nao foi possivel identificar o ID da pagina "Reunioes".'}))
        return 1
    if not isinstance(section_parent, dict) or section_parent.get("page_id") != root_page_id:
        print(safe_json({"ok": False, "error": 'A pagina "Reunioes" nao esta abaixo de "Viny Hub".'}))
        return 1

    plan = {
        "system": "notion",
        "mode": "apply" if args.apply else "dry-run",
        "target_root": TARGET_ROOT,
        "target_section": TARGET_SECTION,
        "target_parent_page_id": section_page_id,
        "source_json": path.as_posix(),
        "page": {
            "title": payload["titulo"],
            "date": payload["data"],
            "participants": payload["participantes"],
            "status": payload["status"],
            "children": _children_from_payload(payload),
        },
    }
    print(safe_json({"ok": True, "plan": plan}))

    if not args.apply:
        return 0

    created = _create_page(token, section_page_id, payload)
    if not 200 <= int(created["status"]) < 300:
        print(safe_json({"ok": False, "created": created}))
        return 1

    print(safe_json({"ok": True, "created": created}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
