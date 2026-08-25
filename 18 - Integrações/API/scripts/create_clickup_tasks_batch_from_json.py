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
DEFAULT_DESCRIPTION = "Registro rápido criado a partir do Viny Brain."
DEFAULT_RESPONSIBLE = "A definir"
DEFAULT_PRIORITY = "Média"
DEFAULT_STATUS = "Pendente"
DEFAULT_DUE_DATE = "A definir"
DEFAULT_TAGS = ["viny-brain", "captura-rapida"]
DEFAULT_CHECKLIST = ["Revisar", "Executar ajuste se necessário", "Marcar como concluído"]
DEFAULT_CONCLUSION = "Item revisado e marcado como concluído."
DEFAULT_ORIGIN = "Viny Brain"
DEFAULT_INTERNAL_NOTES = "Demanda simples capturada em lote."


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


def _status_payload_value(value: str, allowed_statuses: list[str]) -> str | None:
    normalized = value.casefold().strip()
    if not normalized or normalized in GENERIC_STATUSES:
        return None

    for status in allowed_statuses:
        if status.casefold().strip() == normalized:
            return status
    return None


def _parse_due_date(value: str) -> str | None:
    normalized = value.strip()
    if not normalized or normalized.casefold() == "a definir":
        return None
    try:
        parsed = dt.datetime.strptime(normalized, "%Y-%m-%d")
    except ValueError:
        return None
    return str(int(parsed.replace(tzinfo=dt.timezone.utc).timestamp() * 1000))


def _normalize_item(item: dict[str, Any]) -> dict[str, Any] | str:
    name = item.get("nome")
    if not isinstance(name, str) or not name.strip():
        return "nome"

    normalized = {
        "modo": "simples",
        "nome": name.strip(),
        "descricao": item.get("descricao") if isinstance(item.get("descricao"), str) and item.get("descricao").strip() else DEFAULT_DESCRIPTION,
        "responsavel": item.get("responsavel") if isinstance(item.get("responsavel"), str) and item.get("responsavel").strip() else DEFAULT_RESPONSIBLE,
        "prioridade": item.get("prioridade") if isinstance(item.get("prioridade"), str) and item.get("prioridade").strip() else DEFAULT_PRIORITY,
        "status_inicial": item.get("status_inicial") if isinstance(item.get("status_inicial"), str) and item.get("status_inicial").strip() else DEFAULT_STATUS,
        "prazo": item.get("prazo") if isinstance(item.get("prazo"), str) and item.get("prazo").strip() else DEFAULT_DUE_DATE,
        "tags": item.get("tags") if isinstance(item.get("tags"), list) and item.get("tags") else list(DEFAULT_TAGS),
        "checklist": item.get("checklist") if isinstance(item.get("checklist"), list) and item.get("checklist") else list(DEFAULT_CHECKLIST),
        "criterio_conclusao": item.get("criterio_conclusao") if isinstance(item.get("criterio_conclusao"), str) and item.get("criterio_conclusao").strip() else DEFAULT_CONCLUSION,
        "origem": item.get("origem") if isinstance(item.get("origem"), str) and item.get("origem").strip() else DEFAULT_ORIGIN,
        "observacoes_internas": item.get("observacoes_internas") if isinstance(item.get("observacoes_internas"), str) and item.get("observacoes_internas").strip() else DEFAULT_INTERNAL_NOTES,
    }
    return normalized


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


def _build_clickup_payload(task: dict[str, Any], allowed_statuses: list[str]) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "name": task["nome"],
        "description": task["descricao"],
        "priority": _priority_to_clickup(task["prioridade"]),
        "tags": task["tags"],
        "markdown_content": (
            "## Descricao\n\n"
            f"{task['descricao']}\n\n"
            "## Metadados\n\n"
            f"- Responsavel: {task['responsavel']}\n"
            f"- Prioridade: {task['prioridade']}\n"
            f"- Status inicial: {task['status_inicial']}\n"
            f"- Prazo: {task['prazo']}\n"
            f"- Origem: {task['origem']}\n"
            f"- Tags: {', '.join(str(item) for item in task['tags']) or 'Sem tags'}\n\n"
            "## Checklist\n\n"
            + "\n".join(f"- [ ] {item}" for item in task["checklist"])
            + "\n\n## Criterio de conclusao\n\n"
            + f"{task['criterio_conclusao']}\n\n## Observacoes internas\n\n{task['observacoes_internas']}\n"
        ),
        "notify_all": False,
    }
    status_value = _status_payload_value(task["status_inicial"], allowed_statuses)
    if status_value:
        payload["status"] = status_value
    due_date = _parse_due_date(task["prazo"])
    if due_date:
        payload["due_date"] = due_date
        payload["due_date_time"] = False
    return payload


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


def _list_current_tasks(token: str, list_id: str) -> list[dict[str, str]]:
    tasks_response = _clickup_get(token, f"https://api.clickup.com/api/v2/list/{list_id}/task")
    tasks = _items_from_response(tasks_response, "tasks")
    return [_normalize_task(task) for task in tasks]


def _validate_batch(payload: dict[str, Any]) -> list[dict[str, Any]] | str:
    tasks = payload.get("tarefas")
    if not isinstance(tasks, list) or not tasks:
        return "tarefas"

    normalized_tasks: list[dict[str, Any]] = []
    for index, item in enumerate(tasks):
        if not isinstance(item, dict):
            return f"tarefas[{index}]"
        normalized = _normalize_item(item)
        if isinstance(normalized, str):
            return f"tarefas[{index}].{normalized}"
        normalized_tasks.append(normalized)
    return normalized_tasks


def main() -> int:
    parser = argparse.ArgumentParser(description="Create multiple ClickUp tasks from JSON.")
    parser.add_argument("json_file", help="Arquivo JSON com o lote de demandas.")
    parser.add_argument("--apply", action="store_true", help="Criar as tarefas reais no ClickUp.")
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

    mode = payload.get("modo")
    if not isinstance(mode, str) or mode.strip().casefold() != "lote_simples":
        print("modo")
        return 1

    normalized = _validate_batch(payload)
    if isinstance(normalized, str):
        print(normalized)
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

    names = [task["nome"] for task in normalized]
    plan = {
        "system": "clickup",
        "mode": "apply" if args.apply else "dry-run",
        "capture_mode": "lote_simples",
        "target_space": TARGET_SPACE,
        "target_folder": TARGET_FOLDER,
        "target_list": list_name,
        "target_list_id": list_id,
        "allowed_statuses": allowed_statuses,
        "source_json": path.as_posix(),
        "count": len(normalized),
        "names": names,
        "tasks": [
            {
                "name": task["nome"],
                "priority": task["prioridade"],
                "status": task["status_inicial"],
                "due_date": task["prazo"],
                "responsible": task["responsavel"],
            }
            for task in normalized
        ],
    }
    print(safe_json({"ok": True, "plan": plan}))

    if not args.apply:
        print(safe_json({"ok": True, "message": "Nenhuma tarefa foi criada em dry-run."}))
        return 0

    created: list[dict[str, Any]] = []
    for task in normalized:
        task_payload = _build_clickup_payload(task, allowed_statuses)
        result = _clickup_post(token, f"https://api.clickup.com/api/v2/list/{list_id}/task", task_payload)
        response = result.get("response", {}) if isinstance(result, dict) else {}
        task_info = response if isinstance(response, dict) else {}
        task_url = task_info.get("url") if isinstance(task_info.get("url"), str) else task_info.get("link")
        task_id = task_info.get("id") if isinstance(task_info.get("id"), str) else None
        created_flag = 200 <= int(result["status"]) < 300
        status_message = _response_message(task_info) or _response_message(response)
        if not created_flag:
            created.append(
                {
                    "name": task["nome"],
                    "created": False,
                    "http_status": result["status"],
                    "error": status_message or "Falha ao criar tarefa.",
                }
            )
            print(
                safe_json(
                    {
                        "ok": False,
                        "message": "Uma tarefa falhou e o lote foi interrompido.",
                        "created_so_far": created,
                        "failed_task": task["nome"],
                        "http_status": result["status"],
                        "error": status_message or "Falha ao criar tarefa.",
                        "api_response": response,
                    }
                )
            )
            return 1

        created.append(
            {
                "name": task["nome"],
                "created": True,
                "http_status": result["status"],
                "id": task_id,
                "url": task_url,
            }
        )

    current_tasks = _list_current_tasks(token, list_id)
    print(
        safe_json(
            {
                "ok": True,
                "created": created,
                "tasks_after": current_tasks,
                "tasks_after_count": len(current_tasks),
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
