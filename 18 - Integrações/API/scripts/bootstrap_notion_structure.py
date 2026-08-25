from __future__ import annotations

import argparse
from typing import Any

from _common import NOTION_VERSION, http_json, load_env_file, missing_keys, safe_json

NOTION_PARENT_PAGE_KEY = "NOTION_PARENT_PAGE_ID"
NOTION_API_KEY_KEY = "NOTION_API_KEY"


def build_plan(parent_page_id: str) -> dict[str, Any]:
    sections = [
        "Reunioes",
        "Decisoes",
        "Projetos",
        "Relatorios",
        "Processos",
        "Tutoriais",
        "Integracoes",
    ]
    return {
        "system": "notion",
        "mode": "dry-run" if not parent_page_id else "prepared",
        "parent_page_id": parent_page_id,
        "pages": [
            {
                "title": "Viny Hub",
                "parent": {"page_id": parent_page_id},
                "children": [{"title": title, "parent": "Viny Hub"} for title in sections],
            }
        ],
    }


def notion_create_page(token: str, parent_page_id: str, title: str) -> dict[str, Any]:
    payload = {
        "parent": {"page_id": parent_page_id},
        "properties": {
            "title": {
                "title": [
                    {
                        "type": "text",
                        "text": {"content": title},
                    }
                ]
            }
        },
    }
    status, body = http_json(
        "POST",
        "https://api.notion.com/v1/pages",
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": NOTION_VERSION,
            "Accept": "application/json",
        },
        payload=payload,
    )
    result: dict[str, Any] = {"status": status}
    if body:
        result["raw"] = body
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Bootstrap Notion structure with dry-run by default.")
    parser.add_argument("--apply", action="store_true", help="Create the structure for real.")
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
    parent_page_id = env[NOTION_PARENT_PAGE_KEY]
    plan = build_plan(parent_page_id)
    print(
        safe_json(
            {
                "ok": True,
                "system": "notion",
                "mode": "apply" if args.apply else "dry-run",
                "plan": plan,
            }
        )
    )

    if not args.apply:
        return 0

    created: list[dict[str, Any]] = []
    root = notion_create_page(token, parent_page_id, "Viny Hub")
    created.append({"title": "Viny Hub", "parent_page_id": parent_page_id, **root})
    if not 200 <= root["status"] < 300:
        print(safe_json({"ok": False, "created": created}))
        return 1

    # The root page response should include the created page id.
    import json

    root_page_id = ""
    try:
        root_data = json.loads(root.get("raw", "{}"))
        root_page_id = root_data.get("id", "")
    except json.JSONDecodeError:
        root_page_id = ""

    if not root_page_id:
        print(safe_json({"ok": False, "created": created, "error": "Nao foi possivel obter o id da pagina raiz."}))
        return 1

    for title in ["Reunioes", "Decisoes", "Projetos", "Relatorios", "Processos", "Tutoriais", "Integracoes"]:
        response = notion_create_page(token, root_page_id, title)
        created.append({"title": title, "parent_page_id": root_page_id, **response})
        if not 200 <= response["status"] < 300:
            print(safe_json({"ok": False, "created": created}))
            return 1

    print(safe_json({"ok": True, "created": created}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
