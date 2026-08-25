from __future__ import annotations

import argparse
import json
from typing import Any

from _common import http_get, http_json, load_env_file, missing_keys, safe_json

CLICKUP_API_TOKEN_KEY = "CLICKUP_API_TOKEN"
CLICKUP_WORKSPACE_ID_KEY = "CLICKUP_WORKSPACE_ID"
TEST_TASK_NAME = "[TESTE] Validar integração Viny Brain → ClickUp"
TARGET_SPACE = "Viny Operacional"
TARGET_FOLDER = "Demandas Internas"
TARGET_LIST = "Demandas Internas"


def _items_from_response(response: dict[str, Any], key: str) -> list[dict[str, Any]]:
    items = response.get(key, [])
    if isinstance(items, list):
        return [item for item in items if isinstance(item, dict)]
    if isinstance(response, list):
        return [item for item in response if isinstance(item, dict)]
    return []


def _match_name(items: list[dict[str, Any]], target_name: str) -> dict[str, Any] | None:
    target_norm = target_name.casefold()
    for item in items:
        name = item.get("name")
        if isinstance(name, str) and name.strip().casefold() == target_norm:
            return item
    return None


def _clickup_get(token: str, url: str) -> dict[str, Any]:
    status, body = http_get(url, headers={"Authorization": token, "Accept": "application/json"})
    if not 200 <= status < 300:
        raise RuntimeError(f"Falha ao consultar ClickUp (status {status}).")
    try:
        return json.loads(body) if body else {}
    except json.JSONDecodeError as exc:
        raise RuntimeError("Resposta invalida ao consultar ClickUp.") from exc


def _clickup_post(token: str, url: str, payload: dict[str, Any]) -> dict[str, Any]:
    status, body = http_json(
        "POST",
        url,
        headers={"Authorization": token, "Accept": "application/json"},
        payload=payload,
    )
    result: dict[str, Any] = {"status": status}
    if body:
        try:
            result["response"] = json.loads(body)
        except json.JSONDecodeError:
            result["response"] = {"raw": body}
    return result


def create_test_task(token: str, list_id: str) -> dict[str, Any]:
    payload = {
        "name": TEST_TASK_NAME,
        "description": (
            "Tarefa controlada para validar criacao real dentro de Demandas Internas "
            "sem recriar estrutura base."
        ),
        "markdown_content": (
            "## Teste controlado\n\n"
            "- Objetivo: validar a criacao real na estrutura existente.\n"
            "- Origem: Fase 2 da integracao Notion + ClickUp.\n"
            "- Status: teste isolado."
        ),
        "notify_all": False,
    }
    return _clickup_post(token, f"https://api.clickup.com/api/v2/list/{list_id}/task", payload)


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a controlled ClickUp task.")
    parser.add_argument("--apply", action="store_true", help="Create the test task for real.")
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
    workspace_id = env[CLICKUP_WORKSPACE_ID_KEY]

    try:
        spaces_response = _clickup_get(token, f"https://api.clickup.com/api/v2/team/{workspace_id}/space")
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    space = _match_name(_items_from_response(spaces_response, "spaces"), TARGET_SPACE)
    if not space:
        print(safe_json({"ok": False, "error": f'Nao foi possivel localizar o Space "{TARGET_SPACE}".'}))
        return 1

    space_id = str(space.get("id", "")).strip()
    if not space_id:
        print(safe_json({"ok": False, "error": "Nao foi possivel identificar o ID do Space Viny Operacional."}))
        return 1

    try:
        folders_response = _clickup_get(token, f"https://api.clickup.com/api/v2/space/{space_id}/folder")
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    folder = _match_name(_items_from_response(folders_response, "folders"), TARGET_FOLDER)
    if not folder:
        print(
            safe_json(
                {
                    "ok": False,
                    "error": f'Nao foi possivel localizar a Folder "{TARGET_FOLDER}" dentro de "{TARGET_SPACE}".',
                }
            )
        )
        return 1

    folder_id = str(folder.get("id", "")).strip()
    if not folder_id:
        print(safe_json({"ok": False, "error": "Nao foi possivel identificar o ID da Folder Demandas Internas."}))
        return 1

    try:
        lists_response = _clickup_get(token, f"https://api.clickup.com/api/v2/folder/{folder_id}/list")
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    target_list = _match_name(_items_from_response(lists_response, "lists"), TARGET_LIST)
    if not target_list:
        print(
            safe_json(
                {
                    "ok": False,
                    "error": f'Nao foi possivel localizar a List "{TARGET_LIST}" dentro de "{TARGET_FOLDER}".',
                }
            )
        )
        return 1

    list_id = str(target_list.get("id", "")).strip()
    if not list_id:
        print(safe_json({"ok": False, "error": "Nao foi possivel identificar o ID da List Demandas Internas."}))
        return 1

    plan = {
        "system": "clickup",
        "mode": "apply" if args.apply else "dry-run",
        "target_space": TARGET_SPACE,
        "target_folder": TARGET_FOLDER,
        "target_list": TARGET_LIST,
        "create": {
            "name": TEST_TASK_NAME,
            "description": "Tarefa de teste controlado para validar criacao real dentro de Demandas Internas.",
        },
    }
    print(safe_json({"ok": True, "plan": plan}))

    if not args.apply:
        return 0

    result = create_test_task(token, list_id)
    if not 200 <= int(result["status"]) < 300:
        print(safe_json({"ok": False, "created": result}))
        return 1

    print(safe_json({"ok": True, "created": result}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
