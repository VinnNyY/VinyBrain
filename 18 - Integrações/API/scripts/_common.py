from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, Iterable, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ENV_PATH = Path("/home/vinicius-alves/.config/viny-integrations/.env")
NOTION_VERSION = "2026-03-11"


def load_env_file(path: Path = ENV_PATH) -> Dict[str, str]:
    data: Dict[str, str] = {}
    if not path.exists():
        raise FileNotFoundError(f"Arquivo de ambiente nao encontrado: {path}")

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        data[key] = value
        if value:
            os.environ[key] = value
    return data


def missing_keys(env: Dict[str, str], keys: Iterable[str]) -> list[str]:
    return [key for key in keys if not env.get(key)]


def safe_json(data: object) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True)


def http_get(url: str, headers: Dict[str, str]) -> Tuple[int, str]:
    request = Request(url, headers=headers, method="GET")
    try:
        with urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8", errors="replace")
            return response.status, body
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        return exc.code, body
    except URLError as exc:
        raise RuntimeError(f"Falha de rede: {exc.reason}") from exc


def http_json(method: str, url: str, headers: Dict[str, str], payload: object) -> Tuple[int, str]:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = Request(
        url,
        data=data,
        headers={**headers, "Content-Type": "application/json"},
        method=method.upper(),
    )
    try:
        with urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8", errors="replace")
            return response.status, body
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        return exc.code, body
    except URLError as exc:
        raise RuntimeError(f"Falha de rede: {exc.reason}") from exc
