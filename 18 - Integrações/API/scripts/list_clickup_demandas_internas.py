from __future__ import annotations

import json
from typing import Any

from _common import http_get, load_env_file, missing_keys, safe_json

CLICKUP_API_TOKEN_KEY = "CLICKUP_API_TOKEN"
CLICKUP_WORKSPACE_ID_KEY = "CLICKUP_WORKSPACE_ID"
TARGET_SPACE = "Viny Operacional"
TARGET_FOLDER = "Demandas Internas"
TARGET_LIST = "Demandas Internas"


def _items_from_response(response: object, key: str) -> list[dict[str, Any]]:
    if isinstance(response, dict):
        items = response.get(key, [])
        if isinstance(items, list):
            return [item for item in items if isinstance(item, dict)]
    if isinstance(response, list):
        return [item for item in response if isinstance(item, dict)]
    return []


def _match_name(items: list[dict[str, Any]], target_name: str) -> dict[str, Any] | None:
    target_norm = target_name.casefold().strip()
    for item in items:
        name = item.get("name")
        if isinstance(name, str) and name.casefold().strip() == target_norm:
            return item
    return None


def _clickup_get(token: str, url: str) -> dict[str, Any]:
    status, body = http_get(url, headers={"Authorization": token, "Accept": "application/json"})
    if not 200 <= status < 300:
        raise RuntimeError(f"Falha ao consultar ClickUp (status {status}).")
    return json.loads(body) if body else {}


def _resolve_list(token: str, workspace_id: str) -> tuple[str, str]:
    spaces_response = _clickup_get(token, f"https://api.clickup.com/api/v2/team/{workspace_id}/space")
    space = _match_name(_items_from_response(spaces_response, "spaces"), TARGET_SPACE)
    if not space:
        raise RuntimeError(f'Nao foi possivel localizar o Space "{TARGET_SPACE}".')
    space_id = str(space.get("id", "")).strip()
    if not space_id:
        raise RuntimeError("Nao foi possivel identificar o ID do Space Viny Operacional.")

    folders_response = _clickup_get(token, f"https://api.clickup.com/api/v2/space/{space_id}/folder")
    folder = _match_name(_items_from_response(folders_response, "folders"), TARGET_FOLDER)
    if not folder:
        raise RuntimeError(f'Nao foi possivel localizar a Folder "{TARGET_FOLDER}" dentro de "{TARGET_SPACE}".')
    folder_id = str(folder.get("id", "")).strip()
    if not folder_id:
        raise RuntimeError("Nao foi possivel identificar o ID da Folder Demandas Internas.")

    lists_response = _clickup_get(token, f"https://api.clickup.com/api/v2/folder/{folder_id}/list")
    target_list = _match_name(_items_from_response(lists_response, "lists"), TARGET_LIST)
    if not target_list:
        raise RuntimeError(f'Nao foi possivel localizar a List "{TARGET_LIST}" dentro de "{TARGET_FOLDER}".')
    list_id = str(target_list.get("id", "")).strip()
    if not list_id:
        raise RuntimeError("Nao foi possivel identificar o ID da List Demandas Internas.")
    return list_id, str(target_list.get("name", TARGET_LIST)).strip() or TARGET_LIST


def _normalize_task(task: dict[str, Any]) -> dict[str, str]:
    name = task.get("name") if isinstance(task.get("name"), str) else ""
    status = task.get("status", {})
    if isinstance(status, dict):
        status_name = status.get("status") or status.get("name")
    else:
        status_name = status
    url = task.get("url") or task.get("link")
    return {
        "name": name.strip(),
        "status": status_name.strip() if isinstance(status_name, str) else "",
        "url": url.strip() if isinstance(url, str) else "",
    }


def main() -> int:
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
        list_id, list_name = _resolve_list(token, workspace_id)
        tasks_response = _clickup_get(token, f"https://api.clickup.com/api/v2/list/{list_id}/task")
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    tasks = _items_from_response(tasks_response, "tasks")
    normalized = [_normalize_task(task) for task in tasks]
    print(
        safe_json(
            {
                "ok": True,
                "target_space": TARGET_SPACE,
                "target_folder": TARGET_FOLDER,
                "target_list": list_name,
                "target_list_id": list_id,
                "count": len(normalized),
                "tasks": normalized,
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
