#!/usr/bin/env python3
"""Upload idempotente de mídia sanitizada para a API REST do WordPress."""
import argparse
import json
import mimetypes
import os
import sys
from pathlib import Path

import requests

ENV_PATH = Path("/home/vinicius-alves/.config/viny-integrations/.env")
REQUIRED_ENV = ("STAYCLOUD_WP_URL", "STAYCLOUD_WP_USER", "STAYCLOUD_WP_APP_PASSWORD")


def load_env(path: Path) -> dict:
    values = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def fail(status: str, detail: str) -> None:
    print(json.dumps({"status": status, "detail": detail}, ensure_ascii=False))
    raise SystemExit(1)


def parse_media(items):
    parsed = []
    for item in items:
        path, title, alt, *caption = item
        parsed.append({"path": Path(path).resolve(), "title": title, "alt": alt, "caption": caption[0] if caption else ""})
    return parsed


def main() -> None:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true")
    mode.add_argument("--apply", action="store_true")
    parser.add_argument("--media", nargs="+", action="append", metavar=("PATH", "TITLE", "ALT", "CAPTION"), required=True)
    args = parser.parse_args()

    env = load_env(ENV_PATH)
    missing = [key for key in REQUIRED_ENV if not env.get(key)]
    if missing:
        fail("invalid_config", "required environment variable missing")
    base_url = env["STAYCLOUD_WP_URL"].rstrip("/")
    auth = (env["STAYCLOUD_WP_USER"], env["STAYCLOUD_WP_APP_PASSWORD"])
    records = parse_media(args.media)

    for record in records:
        path = record["path"]
        if "prints/finais" not in str(path) or "_originais-sensiveis" in str(path):
            fail("invalid_file", "only files from prints/finais are allowed")
        if not path.is_file() or "sanitizado" not in path.name:
            fail("invalid_file", "file is missing or not marked sanitizado")
        mime, _ = mimetypes.guess_type(path.name)
        if mime not in {"image/png", "image/jpeg", "image/webp"}:
            fail("invalid_file", "unsupported image MIME type")
        record["mime"] = mime
        record["size"] = path.stat().st_size

    if args.dry_run:
        for record in records:
            print(json.dumps({"filename": record["path"].name, "mime_type": record["mime"], "size_bytes": record["size"], "title": record["title"], "alt_text": record["alt"], "status": "dry_run_validated"}, ensure_ascii=False))
        return

    for record in records:
        filename = record["path"].name
        search = requests.get(f"{base_url}/wp-json/wp/v2/media", params={"search": filename, "per_page": 100, "context": "edit"}, auth=auth, timeout=30)
        if search.status_code in {401, 403}:
            fail("authentication_or_permission_error", f"HTTP {search.status_code}")
        if not search.ok:
            fail("media_search_error", f"HTTP {search.status_code}")
        matches = [item for item in search.json() if item.get("source_url", "").rsplit("/", 1)[-1] == filename]
        if len(matches) > 1:
            fail("media_conflict", "more than one existing media item has the same filename")
        if matches:
            item = matches[0]
            print(json.dumps({"id": item["id"], "url": item["source_url"], "filename": filename, "status": "reused"}, ensure_ascii=False))
            continue
        with record["path"].open("rb") as upload:
            response = requests.post(f"{base_url}/wp-json/wp/v2/media", auth=auth, headers={"Content-Disposition": f'attachment; filename="{filename}"'}, files={"file": (filename, upload, record["mime"])}, data={"title": record["title"], "alt_text": record["alt"], "caption": record["caption"]}, timeout=90)
        if response.status_code in {401, 403}:
            fail("authentication_or_permission_error", f"HTTP {response.status_code}")
        if response.status_code != 201:
            fail("upload_error", f"HTTP {response.status_code}")
        item = response.json()
        url_check = requests.get(item["source_url"], timeout=30)
        if not url_check.ok:
            fail("public_url_check_error", f"HTTP {url_check.status_code}")
        print(json.dumps({"id": item["id"], "url": item["source_url"], "filename": filename, "status": "uploaded"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
