from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
from typing import Any

from _common import http_get, http_json, load_env_file, missing_keys, safe_json

CLICKUP_API_TOKEN_KEY = "CLICKUP_API_TOKEN"
CLICKUP_WORKSPACE_ID_KEY = "CLICKUP_WORKSPACE_ID"
TARGET_SPACE = "Viny Operacional"
TARGET_FOLDER = "Demandas Internas"
TARGET_LIST = "Demandas Internas"
GENERIC_STATUSES = {"pendente", "a fazer", "a definir"}


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
    required_strings = [
        "nome",
        "descricao",
        "responsavel",
        "prioridade",
        "status_inicial",
        "prazo",
        "criterio_conclusao",
        "origem",
        "observacoes_internas",
    ]
    for key in required_strings:
        missing = _require_string(data, key)
        if missing:
            return missing

    required_lists = ["tags", "checklist"]
    for key in required_lists:
        missing = _require_list(data, key)
        if missing:
            return missing

    return None


def _mode_from_payload(data: dict[str, Any]) -> str:
    value = data.get("modo")
    if isinstance(value, str) and value.strip():
        normalized = value.strip().casefold()
        if normalized in {"simples", "detalhado"}:
            return normalized
    return "detalhado"


def _status_payload_value(value: str, allowed_statuses: list[str]) -> str | None:
    normalized = value.casefold().strip()
    if not normalized or normalized in GENERIC_STATUSES:
        return None
    for status in allowed_statuses:
        if status.casefold().strip() == normalized:
            return status
    return None


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


def _extract_statuses(list_response: dict[str, Any]) -> list[str]:
    statuses = list_response.get("statuses", [])
    if not isinstance(statuses, list):
        return []
    names: list[str] = []
    for item in statuses:
        if not isinstance(item, dict):
            continue
        name = item.get("status") or item.get("name")
        if isinstance(name, str) and name.strip():
            names.append(name.strip())
    return names


def _clickup_get(token: str, url: str) -> dict[str, Any]:
    status, body = http_get(url, headers={"Authorization": token, "Accept": "application/json"})
    if not 200 <= status < 300:
        raise RuntimeError(f"Falha ao consultar ClickUp (status {status}).")
    return json.loads(body) if body else {}


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


def _priority_to_clickup(value: str) -> int:
    normalized = value.casefold().strip()
    mapping = {
        "urgente": 1,
        "alta": 2,
        "alto": 2,
        "média": 3,
        "media": 3,
        "normal": 3,
        "baixa": 4,
        "baixo": 4,
    }
    return mapping.get(normalized, 3)


def _parse_due_date(value: str) -> str | None:
    normalized = value.strip()
    if not normalized or normalized.casefold() == "a definir":
        return None
    try:
        parsed = dt.datetime.strptime(normalized, "%Y-%m-%d")
    except ValueError:
        return None
    return str(int(parsed.replace(tzinfo=dt.timezone.utc).timestamp() * 1000))


def _markdown_from_payload(payload: dict[str, Any]) -> str:
    checklist = "\n".join(f"- [ ] {item}" for item in payload["checklist"])
    tags = ", ".join(str(item) for item in payload["tags"]) or "Sem tags"
    return (
        "## Descricao\n\n"
        f"{payload['descricao']}\n\n"
        "## Metadados\n\n"
        f"- Responsavel: {payload['responsavel']}\n"
        f"- Prioridade: {payload['prioridade']}\n"
        f"- Status inicial: {payload['status_inicial']}\n"
        f"- Prazo: {payload['prazo']}\n"
        f"- Origem: {payload['origem']}\n"
        f"- Tags: {tags}\n\n"
        "## Checklist\n\n"
        f"{checklist}\n\n"
        "## Criterio de conclusao\n\n"
        f"{payload['criterio_conclusao']}\n\n"
        "## Observacoes internas\n\n"
        f"{payload['observacoes_internas']}\n"
    )


def _create_task(token: str, list_id: str, payload: dict[str, Any], allowed_statuses: list[str]) -> dict[str, Any]:
    task_payload: dict[str, Any] = {
        "name": payload["nome"],
        "description": payload["descricao"],
        "priority": _priority_to_clickup(payload["prioridade"]),
        "tags": payload["tags"],
        "markdown_content": _markdown_from_payload(payload),
        "notify_all": False,
    }
    status_value = _status_payload_value(payload["status_inicial"], allowed_statuses)
    if status_value:
        task_payload["status"] = status_value
    due_date = _parse_due_date(payload["prazo"])
    if due_date:
        task_payload["due_date"] = due_date
        task_payload["due_date_time"] = False
    return _clickup_post(token, f"https://api.clickup.com/api/v2/list/{list_id}/task", task_payload)


def _response_message(response: object) -> str | None:
    if not isinstance(response, dict):
        return None
    for key in ("err", "error", "message"):
        value = response.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    raw = response.get("raw")
    if isinstance(raw, str) and raw.strip():
        return raw.strip()
    return None


def _resolve_target_list(token: str, workspace_id: str) -> tuple[str, str, list[str]]:
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

    list_detail = _clickup_get(token, f"https://api.clickup.com/api/v2/list/{list_id}")
    list_name = str(list_detail.get("name", TARGET_LIST)).strip() or TARGET_LIST
    statuses = _extract_statuses(list_detail)
    return list_id, list_name, statuses


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a ClickUp task from JSON.")
    parser.add_argument("json_file", help="Arquivo JSON com os dados da demanda.")
    parser.add_argument("--apply", action="store_true", help="Criar a tarefa real no ClickUp.")
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

    capture_mode = _mode_from_payload(payload)
    missing = _validate_payload(payload)
    if missing:
        print(missing)
        return 1

    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing_env = missing_keys(env, [CLICKUP_API_TOKEN_KEY, CLICKUP_WORKSPACE_ID_KEY])
    if missing_env:
        print(safe_json({"ok": False, "missing": missing_env}))
        return 1

    token = env[CLICKUP_API_TOKEN_KEY]
    workspace_id = env[CLICKUP_WORKSPACE_ID_KEY]

    try:
        list_id, list_name, allowed_statuses = _resolve_target_list(token, workspace_id)
    except RuntimeError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    plan = {
        "system": "clickup",
        "mode": "apply" if args.apply else "dry-run",
        "capture_mode": capture_mode,
        "target_space": TARGET_SPACE,
        "target_folder": TARGET_FOLDER,
        "target_list": list_name,
        "target_list_id": list_id,
        "allowed_statuses": allowed_statuses,
        "source_json": path.as_posix(),
        "task": {
            "name": payload["nome"],
            "priority": payload["prioridade"],
            "status": payload["status_inicial"],
            "tags": payload["tags"],
            "due_date": payload["prazo"],
            "checklist": payload["checklist"],
        },
    }
    print(safe_json({"ok": True, "plan": plan}))

    if not args.apply:
        print(safe_json({"ok": True, "message": "Nenhuma tarefa foi criada em dry-run."}))
        return 0

    created = _create_task(token, list_id, payload, allowed_statuses)
    created_status = int(created["status"])
    response = created.get("response", {}) if isinstance(created, dict) else {}
    task_info = response if isinstance(response, dict) else {}
    task_url = task_info.get("url") if isinstance(task_info.get("url"), str) else task_info.get("link")
    task_id = task_info.get("id") if isinstance(task_info.get("id"), str) else None
    if not 200 <= created_status < 300:
        error_message = _response_message(task_info) or _response_message(response)
        print(
            safe_json(
                {
                    "ok": False,
                    "message": "Falha ao criar a tarefa no ClickUp.",
                    "http_status": created_status,
                    "error": error_message or "Resposta nao confirmada pela API.",
                    "api_response": response,
                }
            )
        )
        return 1

    print(
        safe_json(
            {
                "ok": True,
                "message": "Tarefa criada no ClickUp.",
                "http_status": created_status,
                "task": {
                    "name": payload["nome"],
                    "id": task_id,
                    "url": task_url,
                },
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
