from __future__ import annotations

import json

from _common import http_get, load_env_file, missing_keys, safe_json


def main() -> int:
    try:
        env = load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    missing = missing_keys(env, ["CLICKUP_API_TOKEN"])
    if missing:
        print(safe_json({"ok": False, "missing": missing}))
        return 1

    status, body = http_get(
        "https://api.clickup.com/api/v2/team",
        headers={
            "Authorization": env["CLICKUP_API_TOKEN"],
            "Accept": "application/json",
        },
    )

    payload = {"ok": 200 <= status < 300, "status": status}
    try:
        payload["response"] = json.loads(body) if body else {}
    except json.JSONDecodeError:
        payload["response"] = {"raw": body}

    print(safe_json(payload))
    return 0 if payload["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
