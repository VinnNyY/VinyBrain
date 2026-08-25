from __future__ import annotations

import argparse
import json
from typing import Any

from _common import http_json, load_env_file, missing_keys, safe_json

CLICKUP_API_TOKEN_KEY = "CLICKUP_API_TOKEN"
CLICKUP_WORKSPACE_ID_KEY = "CLICKUP_WORKSPACE_ID"


def feature_payload() -> dict[str, Any]:
    return {
        "due_dates": {
            "enabled": True,
            "start_date": True,
            "remap_due_dates": True,
            "remap_closed_due_date": True,
            "check_unresolved": True,
        }
    }


def build_plan() -> dict[str, Any]:
    names = [
        "Demandas Internas",
        "Tutoriais StayCloud",
        "Base de Conhecimento",
        "Integrações",
        "Relatórios e Gestão",
        "Backlog de Ideias",
    ]
    return {
        "system": "clickup",
        "space": "Viny Operacional",
        "folders": [
            {
                "folder": name,
                "lists": [name],
            }
            for name in names
        ],
    }


def clickup_post(token: str, url: str, payload: dict[str, Any]) -> dict[str, Any]:
    status, body = http_json(
        "POST",
        url,
        headers={
            "Authorization": token,
            "Accept": "application/json",
        },
        payload=payload,
    )
    result: dict[str, Any] = {"status": status}
    if body:
        result["raw"] = body
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Bootstrap ClickUp structure with dry-run by default.")
    parser.add_argument("--apply", action="store_true", help="Create the structure for real.")
    args = parser.parse_args()

    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing = missing_keys(env, [CLICKUP_API_TOKEN_KEY, CLICKUP_WORKSPACE_ID_KEY])
    if missing:
        print(safe_json({"ok": False, "missing": missing}))
        return 1

    token = env[CLICKUP_API_TOKEN_KEY]
    team_id = env[CLICKUP_WORKSPACE_ID_KEY]
    plan = build_plan()
    print(
        safe_json(
            {
                "ok": True,
                "system": "clickup",
                "mode": "apply" if args.apply else "dry-run",
                "plan": plan,
            }
        )
    )

    if not args.apply:
        return 0

    created: list[dict[str, Any]] = []
    space_response = clickup_post(
        token,
        f"https://api.clickup.com/api/v2/team/{team_id}/space",
        payload={
            "name": "Viny Operacional",
            "multiple_assignees": True,
            "features": feature_payload(),
        },
    )
    created.append({"type": "space", "name": "Viny Operacional", "workspace_id": team_id, **space_response})
    if not 200 <= space_response["status"] < 300:
        print(safe_json({"ok": False, "created": created}))
        return 1

    try:
        space_data = json.loads(space_response.get("raw", "{}"))
        space_id = str(space_data.get("id", ""))
    except json.JSONDecodeError:
        space_id = ""

    if not space_id:
        print(safe_json({"ok": False, "created": created, "error": "Nao foi possivel obter o id do Space."}))
        return 1

    folders = [
        "Demandas Internas",
        "Tutoriais StayCloud",
        "Base de Conhecimento",
        "Integracoes",
        "Relatorios e Gestao",
        "Backlog de Ideias",
    ]
    for folder_name in folders:
        folder_response = clickup_post(
            token,
            f"https://api.clickup.com/api/v2/space/{space_id}/folder",
            payload={"name": folder_name},
        )
        created.append({"type": "folder", "name": folder_name, "space_id": space_id, **folder_response})
        if not 200 <= folder_response["status"] < 300:
            print(safe_json({"ok": False, "created": created}))
            return 1

        try:
            folder_data = json.loads(folder_response.get("raw", "{}"))
            folder_id = str(folder_data.get("id", ""))
        except json.JSONDecodeError:
            folder_id = ""

        if not folder_id:
            print(safe_json({"ok": False, "created": created, "error": f"Nao foi possivel obter o id da Folder {folder_name}."}))
            return 1

        list_response = clickup_post(
            token,
            f"https://api.clickup.com/api/v2/folder/{folder_id}/list",
            payload={
                "name": folder_name,
                "markdown_content": (
                    f"Lista base para {folder_name}.\n\n"
                    "Dry-run preparado para estrutura inicial do Viny Brain."
                ),
            },
        )
        created.append({"type": "list", "name": folder_name, "folder_id": folder_id, **list_response})
        if not 200 <= list_response["status"] < 300:
            print(safe_json({"ok": False, "created": created}))
            return 1

    print(safe_json({"ok": True, "created": created}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
