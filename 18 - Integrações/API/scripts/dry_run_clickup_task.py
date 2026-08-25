from __future__ import annotations

from _common import load_env_file, missing_keys, safe_json


def build_payload(env: dict[str, str]) -> dict[str, object]:
    task_name = "Piloto 02 - Demand to ClickUp dry-run"
    return {
        "list_id": env.get("CLICKUP_LIST_ID", "<CLICKUP_LIST_ID>"),
        "workspace_id": env.get("CLICKUP_WORKSPACE_ID", "<CLICKUP_WORKSPACE_ID>"),
        "task": {
            "name": task_name,
            "description": (
                "Demanda piloto convertida em tarefa manual para ClickUp. "
                "Baseado no fluxo do Piloto 02, sem envio real."
            ),
            "status": "to do",
            "priority": 3,
            "tags": ["viny-brain", "dry-run", "piloto-02"],
            "checklist": [
                "Entender a demanda",
                "Validar contexto",
                "Executar a acao",
                "Testar ou validar",
                "Registrar evidencia se necessario",
                "Comunicar conclusao",
                "Atualizar status",
            ],
            "origin": "Piloto 02 - Demanda para ClickUp",
        },
    }


def main() -> int:
    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing = missing_keys(env, ["CLICKUP_API_TOKEN", "CLICKUP_LIST_ID"])
    if missing:
        print(safe_json({"ok": False, "missing": missing}))
        return 1

    payload = build_payload(env)
    print(
        safe_json(
            {
                "ok": True,
                "mode": "dry-run",
                "destination": "clickup",
                "would_send": {
                    "method": "POST",
                    "endpoint": f"https://api.clickup.com/api/v2/list/{env['CLICKUP_LIST_ID']}/task",
                    "headers": {
                        "Authorization": "<CLICKUP_API_TOKEN>",
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
