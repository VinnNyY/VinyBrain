"""Cliente read-only para WHMCS API.

Somente os métodos GetTickets e GetTicket são permitidos. Qualquer ação de
escrita falha imediatamente.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import re


READ_ONLY_ACTIONS = {"GetTickets", "GetTicket", "GetClientsProducts"}
BLOCKED_ACTIONS = {
    "AddTicketReply",
    "UpdateTicket",
    "CloseTicket",
    "DeleteTicket",
    "AddTicketNote",
}


@dataclass
class WHMCSCredentials:
    url: str
    identifier: str
    secret: str
    access_key: Optional[str] = None


def _strip_comments(line: str) -> Optional[str]:
    stripped = line.strip()
    if not stripped or stripped.startswith("#"):
        return None
    return stripped


def load_env_file(env_path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    if not env_path.exists():
        return data
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = _strip_comments(raw_line)
        if not line or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key:
            data[key] = value
    return data


def load_credentials(env_path: Path, keys: Dict[str, str]) -> WHMCSCredentials:
    values = load_env_file(env_path)
    missing = [name for name in (keys["url_key"], keys["identifier_key"], keys["secret_key"]) if not values.get(name)]
    if missing:
        raise RuntimeError(
            "Variaveis obrigatorias ausentes no .env externo: " + ", ".join(missing)
        )
    access_key_name = keys.get("access_key_key", "WHMCS_API_ACCESS_KEY")
    return WHMCSCredentials(
        url=values[keys["url_key"]],
        identifier=values[keys["identifier_key"]],
        secret=values[keys["secret_key"]],
        access_key=values.get(access_key_name) or None,
    )


class WHMCSApiClient:
    def __init__(
        self,
        credentials: WHMCSCredentials,
        allowed_actions: Sequence[str] | None = None,
        timeout_seconds: int = 30,
    ) -> None:
        self.credentials = credentials
        self.allowed_actions = set(allowed_actions or READ_ONLY_ACTIONS)
        self.timeout_seconds = timeout_seconds

    def _ensure_allowed(self, action: str) -> None:
        if action in BLOCKED_ACTIONS:
            raise ValueError(f"Acoes de escrita bloqueadas: {action}")
        if action not in self.allowed_actions:
            raise ValueError(f"Acao nao permitida: {action}")

    def _request(self, action: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self._ensure_allowed(action)
        payload: Dict[str, Any] = {
            "identifier": self.credentials.identifier,
            "secret": self.credentials.secret,
            "action": action,
            "responsetype": "json",
        }
        if self.credentials.access_key:
            payload["accesskey"] = self.credentials.access_key
        if params:
            payload.update(params)
        encoded = urlencode(payload).encode("utf-8")
        request = Request(self.credentials.url, data=encoded, method="POST")
        request.add_header("User-Agent", "VinyBrain-WHMCS-ReadonlyScanner/1.0")
        request.add_header("Content-Type", "application/x-www-form-urlencoded")
        request.add_header("Accept", "application/json")
        with urlopen(request, timeout=self.timeout_seconds) as response:
            raw = response.read().decode("utf-8")
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise RuntimeError("Resposta inesperada do WHMCS.")
        return data

    def get_tickets(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        params: Dict[str, Any] = {}
        if limit is not None:
            params["limitnum"] = limit
        response = self._request("GetTickets", params=params or None)
        return _extract_ticket_list(response)

    def get_tickets_page(
        self,
        *,
        status: Optional[str] = None,
        limitstart: int = 0,
        limitnum: int = 50,
        subject: Optional[str] = None,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "limitstart": limitstart,
            "limitnum": limitnum,
        }
        if status:
            params["status"] = status
        if subject:
            params["subject"] = subject
        response = self._request("GetTickets", params=params)
        return {
            "response": response,
            "tickets": _extract_ticket_list(response),
            "totalresults": _extract_total_results(response),
            "params": params,
        }

    def probe_tickets(self, limit: int = 1) -> Dict[str, Any]:
        params: Dict[str, Any] = {"limitnum": limit}
        return self._request("GetTickets", params=params)

    def get_clients_products(
        self,
        *,
        clientid: Optional[str] = None,
        serviceid: Optional[str] = None,
        pid: Optional[str] = None,
        domain: Optional[str] = None,
        username2: Optional[str] = None,
        limitstart: int = 0,
        limitnum: int = 50,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "limitstart": limitstart,
            "limitnum": limitnum,
        }
        if clientid:
            params["clientid"] = clientid
        if serviceid:
            params["serviceid"] = serviceid
        if pid:
            params["pid"] = pid
        if domain:
            params["domain"] = domain
        if username2:
            params["username2"] = username2
        response = self._request("GetClientsProducts", params=params)
        return response

    def get_ticket(self, ticket_id: str) -> Dict[str, Any]:
        response = self._request("GetTicket", params={"ticketid": ticket_id})
        return _extract_ticket_detail(response, ticket_id)

    def get_ticket_by_reference(self, ticket_reference: str) -> Dict[str, Any]:
        reference = str(ticket_reference).strip()
        if not reference:
            raise RuntimeError("Referencia de ticket vazia.")
        params: Dict[str, Any]
        if re.fullmatch(r"\d+", reference):
            params = {"ticketid": reference}
        else:
            params = {"ticketnum": reference}
        response = self._request("GetTicket", params=params)
        return response


def _extract_ticket_list(response: Dict[str, Any]) -> List[Dict[str, Any]]:
    payload = response.get("tickets") or response.get("ticket") or response.get("results") or response
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        for key in ("ticket", "tickets", "result"):
            nested = payload.get(key)
            if isinstance(nested, list):
                return [item for item in nested if isinstance(item, dict)]
            if isinstance(nested, dict):
                return [nested]
        if any(isinstance(value, (str, int, float)) for value in payload.values()):
            return [payload]
    return []


def _extract_total_results(response: Dict[str, Any]) -> Optional[int]:
    for key in ("totalresults", "total_results", "total"):
        value = response.get(key)
        if value in (None, ""):
            continue
        try:
            return int(value)
        except (TypeError, ValueError):
            return None
    payload = response.get("tickets")
    if isinstance(payload, dict):
        for key in ("totalresults", "total_results", "total"):
            value = payload.get(key)
            if value in (None, ""):
                continue
            try:
                return int(value)
            except (TypeError, ValueError):
                return None
    return None


def _extract_ticket_detail(response: Dict[str, Any], ticket_id: str) -> Dict[str, Any]:
    result = response.get("result")
    candidates = response.get("ticket") or response.get("tickets")
    if candidates is None and isinstance(result, (dict, list)):
        candidates = result
    if candidates is None:
        candidates = response
    if isinstance(candidates, list):
        for item in candidates:
            if isinstance(item, dict):
                extracted_id = str(item.get("ticket_id") or item.get("id") or item.get("tid") or "")
                if not extracted_id or extracted_id == str(ticket_id):
                    return item
        return {"ticket_id": ticket_id}
    if isinstance(candidates, dict):
        if "ticket" in candidates and isinstance(candidates["ticket"], dict):
            return candidates["ticket"]
        return candidates
    return {"ticket_id": ticket_id}


def _extract_products_list(response: Dict[str, Any]) -> List[Dict[str, Any]]:
    payload = response.get("products") or response.get("product") or response.get("results") or response
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        for key in ("product", "products", "result"):
            nested = payload.get(key)
            if isinstance(nested, list):
                return [item for item in nested if isinstance(item, dict)]
            if isinstance(nested, dict):
                return [nested]
        if any(isinstance(value, (str, int, float)) for value in payload.values()):
            return [payload]
    return []


def extract_products_from_response(response: Dict[str, Any]) -> List[Dict[str, Any]]:
    return _extract_products_list(response)


def extract_ticket_detail_from_response(response: Dict[str, Any], ticket_reference: str) -> Dict[str, Any]:
    return _extract_ticket_detail(response, ticket_reference)
