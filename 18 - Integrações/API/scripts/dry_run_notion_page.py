from __future__ import annotations

from _common import load_env_file, missing_keys, safe_json


def build_payload(env: dict[str, str]) -> dict[str, object]:
    meeting_title = "Piloto 01 - Reuniao para Notion e ClickUp"
    payload: dict[str, object] = {
        "parent": {},
        "properties": {
            "Title": {
                "title": [
                    {
                        "text": {
                            "content": meeting_title,
                        }
                    }
                ]
            }
        },
        "children": [
            {"object": "block", "type": "heading_2", "heading_2": {"rich_text": [{"type": "text", "text": {"content": "Resumo executivo"}}]}},
            {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": "Reuniao manual para transformar anotacoes soltas em pagina pronta para consulta."}}]}},
            {"object": "block", "type": "heading_2", "heading_2": {"rich_text": [{"type": "text", "text": {"content": "Decisoes tomadas"}}]}},
            {"object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Separar decisoes, pendencias e proximos passos sem duplicar o Viny Brain."}}]}},
            {"object": "block", "type": "heading_2", "heading_2": {"rich_text": [{"type": "text", "text": {"content": "Pendencias"}}]}},
            {"object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Confirmar responsaveis e prazos antes de qualquer envio real."}}]}},
        ],
    }

    parent_page_id = env.get("NOTION_PARENT_PAGE_ID", "").strip()
    database_id = env.get("NOTION_DATABASE_ID", "").strip()
    if parent_page_id:
        payload["parent"] = {"page_id": parent_page_id}
    elif database_id:
        payload["parent"] = {"data_source_id": database_id}
    else:
        payload["parent"] = {"page_id": "<NOTION_PARENT_PAGE_ID_OR_NOTION_DATABASE_ID>"}
    return payload


def main() -> int:
    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing = missing_keys(env, ["NOTION_API_KEY"])
    if missing:
        print(safe_json({"ok": False, "missing": missing}))
        return 1

    payload = build_payload(env)
    print(
        safe_json(
            {
                "ok": True,
                "mode": "dry-run",
                "destination": "notion",
                "would_send": {
                    "method": "POST",
                    "endpoint": "https://api.notion.com/v1/pages",
                    "headers": {
                        "Authorization": "Bearer <NOTION_API_KEY>",
                        "Notion-Version": "2026-03-11",
                        "Accept": "application/json",
                    },
                    "payload": payload,
                },
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
