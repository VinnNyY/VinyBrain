#!/usr/bin/env python3
"""Scanner WHMCS API read-only.

Le tickets via GetTickets, abre candidatos com GetTicket e gera relatórios
locais sem qualquer ação de escrita no WHMCS.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import re
import unicodedata
from dataclasses import asdict
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Dict, Iterable, List, Sequence
from urllib.parse import parse_qsl, urlparse

from detection_engine import TicketAnalysis, analyze_ticket
from whmcs_api_client import WHMCSApiClient, extract_products_from_response, extract_ticket_detail_from_response, load_credentials, load_env_file
from wp_plugin_installation_executor import build_execution_preparation, print_execution_preparation, validate_apply_gate
from wp_plugin_installation_planner import build_installation_plan
from wp_browser_access_validator import validate_wp_access_link_with_browser
from wp_access_validator import same_domain, validate_url_format, validate_wp_access_link
from whmcs_browser_ui_provider import DEFAULT_PROFILE_DIR, WHMCSBrowserUIProvider

from urllib.error import HTTPError, URLError
from urllib.request import urlopen


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DEFAULT_CONFIG_PATH = BASE_DIR / "config.example.json"
DEFAULT_ENV_PATH = Path("/home/vinicius-alves/.config/viny-integrations/.env")
DEFAULT_PLUGIN_ALIASES_PATH = BASE_DIR / "plugin_aliases.example.json"
EMAIL_PATTERN = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
DOMAIN_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:/[^\s]*)?", re.IGNORECASE)
IPIFY_URL = "https://api.ipify.org?format=json"
FORBIDDEN_NEXT_STEPS = [
    "Confirmar se os IPs foram adicionados em Setup/Configuration > General Settings > Security > API IP Access Restriction.",
    "Confirmar se o IP nao esta em Banned IPs.",
    "Confirmar se a credencial API esta vinculada a uma role com GetTickets e GetTicket.",
    "Confirmar se existe API Access Key no configuration.php e se ela precisa ser enviada.",
    "Confirmar se firewall/WAF permite POST para /includes/api.php.",
    "Confirmar se o endpoint esta correto.",
]
SUBJECT_FIELD_CANDIDATES = ["subject", "title", "message_subject", "name"]
TICKET_NUM_FIELD_CANDIDATES = ["tid", "ticketnum", "ticket_number", "ticket_num"]
TICKET_ID_FIELD_CANDIDATES = ["ticket_id", "id", "ticketid"]
QUEUE_STATUS_MAP = {
    "awaiting-reply": "Awaiting Reply",
}
HISTORICAL_STATUSES = {"closed", "resolved", "fechado", "fechados", "resolvido", "resolvidos"}
IGNORED_DOMAINS = {"painel.staycloud.com.br"}
CLIENT_AUTHORIZATION_PHRASES = [
    "pode ativar",
    "pode fazer",
    "autorizo",
    "pode seguir",
    "favor ativar",
    "solicito a ativacao",
    "solicito a ativação",
    "preciso que ative",
    "ativar para mim",
    "gostaria da ativacao",
    "gostaria da ativação",
    "quero ativar",
    "preciso ativar",
]
NON_AUTHORIZATION_PHRASES = [
    "voces tem esse plugin",
    "vocês têm esse plugin",
    "qual o valor",
    "como funciona",
    "esta incluso",
    "está incluso",
    "plugin esta dando erro",
    "plugin está dando erro",
    "nao consigo ativar",
    "não consigo ativar",
    "licenca nao funciona",
    "licença não funciona",
]
SUPPORT_COMPLETION_PHRASES = [
    "plugin ativado",
    "plugins ativados",
    "ativado com sucesso",
    "ativacao concluida",
    "ativação concluída",
    "ja esta ativo",
    "já está ativo",
    "procedimento concluido",
    "procedimento concluído",
    "solicitacao atendida",
    "solicitação atendida",
]
REVIEW_TYPE_TERMS = ["instalacao", "instalação", "instalar", "licenca", "licença", "erro", "conflito", "atualizacao", "atualização"]
URL_PATTERN = re.compile(r"https?://[^\s<>'\")]+", re.IGNORECASE)
EMPTY_WP_ACCESS_DIAGNOSTICS = {
    "initial_http_status": "",
    "initial_final_path": "",
    "redirect_count": 0,
    "hosts_involved": [],
    "cookie_count": 0,
    "plugins_http_status": "",
    "plugins_final_path": "",
    "redirected_to_wp_login": False,
    "plugins_returned_403": False,
    "wordpress_markers_found": [],
    "plugins_markers_found": [],
    "technical_reason": "",
    "browser_started": False,
    "dependency_install_command": "",
}
VALIDATED_WP_STATUS_CLASSIFICATION = {
    "ACCESSIBLE": (
        "ACESSO WORDPRESS VALIDADO",
        "Validar cliente, serviço ativo, conta cPanel e instalação WordPress antes de qualquer ativação.",
    ),
    "ACCESSIBLE_NO_PLUGIN_PERMISSION": (
        "REVISAR PERMISSÃO DO USUÁRIO TEMPORÁRIO",
        "Revisar permissão do usuário temporário para acessar a tela de plugins.",
    ),
    "LOGIN_EXPIRED": (
        "LINK TEMPORÁRIO EXPIRADO",
        "Solicitar novo link temporário ao cliente e não abri-lo manualmente antes da validação automática.",
    ),
    "VALIDATION_INCOMPATIBLE": (
        "REVISAR VALIDAÇÃO DO ACESSO",
        "Validar com navegador isolado; o cliente HTTP simples não reproduziu o acesso.",
    ),
    "BROWSER_VALIDATION_FAILED": (
        "REVISAR VALIDAÇÃO DO ACESSO",
        "Revisar o motivo técnico da validação com navegador antes de concluir o acesso.",
    ),
    "PLUGIN_PAGE_REDIRECTED": (
        "REVISAR ACESSO À TELA DE PLUGINS",
        "Revisar por que plugins.php redirecionou dentro do wp-admin.",
    ),
    "NOT_WORDPRESS": (
        "ACESSO NÃO RECONHECIDO COMO WORDPRESS",
        "Revisar o link temporário; o acesso não foi reconhecido como painel WordPress.",
    ),
    "ERROR": (
        "ERRO NA VALIDAÇÃO DO ACESSO",
        "Revisar o erro técnico da validação antes de pedir novo link ao cliente.",
    ),
}


def load_json(path: Path, fallback: Any) -> Any:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return fallback


def load_config(path: Path) -> Dict[str, Any]:
    data = load_json(path, {})
    if not isinstance(data, dict):
        raise RuntimeError("config.example.json invalido.")
    return data


def normalize_ticket_id(ticket: Dict[str, Any]) -> str:
    for key in ("ticket_id", "id", "ticketid", "tid"):
        value = ticket.get(key)
        if value not in (None, ""):
            return str(value)
    return ""


def _text_value(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _fold_text(value: Any) -> str:
    text = _text_value(value).lower()
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(char for char in normalized if not unicodedata.combining(char))


def is_historical_status(status: Any) -> bool:
    return _fold_text(status) in HISTORICAL_STATUSES


def resolve_requested_status(args: argparse.Namespace) -> str:
    if args.status:
        return args.status
    if args.queue:
        queue_status = QUEUE_STATUS_MAP.get(args.queue)
        if not queue_status:
            raise RuntimeError(f"Fila nao suportada: {args.queue}")
        return queue_status
    return "Awaiting Reply"


def first_present(raw_ticket: Dict[str, Any], keys: Sequence[str]) -> tuple[str, str]:
    for key in keys:
        value = _text_value(raw_ticket.get(key))
        if value:
            return value, key
    return "", ""


def mask_email(value: Any) -> str:
    masked = mask_email_addresses(value)
    return masked if masked != str(value) else masked


def mask_name(value: Any) -> str:
    text = _text_value(value)
    if not text:
        return ""
    parts = text.split()
    if not parts:
        return ""
    if len(parts) == 1:
        return parts[0][0] + "***"
    return f"{parts[0]} {parts[-1][0]}."


def normalize_domain(value: str) -> str:
    domain = _text_value(value).lower()
    domain = re.sub(r"^https?://", "", domain)
    domain = re.sub(r"^www\.", "", domain)
    domain = domain.split("/", 1)[0]
    domain = domain.strip(" \t\r\n.,;:!?)]}>\"'")
    return domain


def domains_match_safe(left: str, right: str) -> bool:
    left_domain = normalize_domain(left)
    right_domain = normalize_domain(right)
    if not left_domain or not right_domain:
        return False
    if left_domain == right_domain:
        return True
    return left_domain.endswith(f".{right_domain}") or right_domain.endswith(f".{left_domain}")


def extract_domains_from_text(text: str) -> List[str]:
    cleaned = EMAIL_PATTERN.sub(" ", _text_value(text))
    domains: List[str] = []
    seen: set[str] = set()
    for match in DOMAIN_PATTERN.findall(cleaned):
        domain = normalize_domain(match)
        if not domain or domain in IGNORED_DOMAINS:
            continue
        if domain.endswith(".staycloud.com.br"):
            continue
        if domain not in seen:
            seen.add(domain)
            domains.append(domain)
    return domains


def classify_wp_access_link(url: str) -> str:
    folded = _fold_text(url)
    if "temp-login" in folded or "temporary-login" in folded or "temporary_login" in folded:
        return "temporary_login"
    path = urlparse(url).path.lower()
    if "/wp-login.php" in path:
        return "wp_login"
    if "/wp-admin" in path:
        return "wp_admin"
    return "unknown"


def is_probable_wp_access_url(url: str) -> bool:
    folded = _fold_text(url)
    path = urlparse(url).path.lower()
    return (
        "/wp-admin" in path
        or "/wp-login.php" in path
        or "temp-login" in folded
        or "temporary-login" in folded
        or "temporary_login" in folded
    )


def normalize_message_for_url_extraction(message: str) -> tuple[str, bool]:
    raw = _text_value(message)
    decoded = unescape(raw)
    decoded_changed = decoded != raw
    urls_inside_tags = URL_PATTERN.findall(decoded)
    decoded = re.sub(r"</?(?:a|p|br|span|div|strong|em|code|pre|blockquote|li|ul|ol|td|tr|table|tbody|thead|font|small|b|i)(?:\s+[^>]*)?>", " ", decoded, flags=re.IGNORECASE)
    decoded = re.sub(r"\s+", " ", decoded)
    combined = " ".join([decoded.strip(), *urls_inside_tags]).strip()
    return combined, decoded_changed


def clean_extracted_url(raw_url: str) -> str:
    url = _text_value(raw_url)
    return url.strip(" \t\r\n<>()[]{}\"'.,;")


def safe_url_diagnostics(url: str, decoded: bool) -> Dict[str, Any]:
    parsed = urlparse(url)
    param_names = sorted({name for name, _ in parse_qsl(parsed.query, keep_blank_values=True)})
    return {
        "url_html_decoded": decoded,
        "url_scheme": parsed.scheme.lower(),
        "url_hostname": (parsed.hostname or "").lower(),
        "url_path": parsed.path or "/",
        "url_param_count": len(param_names),
        "url_param_names": param_names,
    }


def extract_wp_access_links_from_client_messages(client_messages: Sequence[str], expected_domain: str) -> List[Dict[str, Any]]:
    candidates: List[Dict[str, Any]] = []
    seen: set[str] = set()
    for message in client_messages:
        normalized_message, decoded = normalize_message_for_url_extraction(message)
        for raw_match in URL_PATTERN.findall(normalized_message):
            raw_url = clean_extracted_url(raw_match)
            parsed = urlparse(raw_url)
            scheme = parsed.scheme.lower()
            if scheme != "https":
                link_type = classify_wp_access_link(raw_url)
            else:
                link_type = classify_wp_access_link(raw_url)
            if not is_probable_wp_access_url(raw_url):
                continue
            host = (parsed.hostname or "").lower()
            sanitized_key = f"{scheme}://{host}{parsed.path}"
            if sanitized_key in seen:
                continue
            seen.add(sanitized_key)
            format_valid, normalized_host, reason = validate_url_format(raw_url, expected_domain)
            if format_valid:
                matches_domain: bool | str = True
                status = "NOT_TESTED"
                validation_reason = "validação não executada"
            else:
                matches_domain = False if normalized_host and expected_domain and not same_domain(normalized_host, expected_domain) else "incerto"
                status = "OFF_DOMAIN" if "domínio" in reason else "INVALID"
                validation_reason = reason
            candidates.append(
                {
                    "url": raw_url,
                    "type": link_type,
                    "host": normalized_host or host,
                    "matches_domain": matches_domain,
                    "status": status,
                    "validation_reason": validation_reason,
                    "url_diagnostics": safe_url_diagnostics(raw_url, decoded),
                }
            )
    return candidates


def safe_wp_link_result(candidates: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    if not candidates:
        return {
            "wp_access_link_present": False,
            "wp_access_link_type": "",
            "wp_access_link_host": "",
            "wp_access_link_matches_domain": "incerto",
            "wp_access_validation_executed": False,
            "wp_access_link_status": "NOT_TESTED",
            "wp_admin_accessible": False,
            "plugins_page_accessible": False,
            "wp_access_validation_reason": "link de acesso não encontrado",
            "wp_access_link_count": 0,
            "wp_access_diagnostics": dict(EMPTY_WP_ACCESS_DIAGNOSTICS),
            "wp_access_url_diagnostics": {},
            "wp_access_validator": "",
            "plugin_inventory": [],
        }
    if len(candidates) > 1:
        hosts = sorted({candidate.get("host", "") for candidate in candidates if candidate.get("host")})
        return {
            "wp_access_link_present": True,
            "wp_access_link_type": "unknown",
            "wp_access_link_host": ", ".join(hosts),
            "wp_access_link_matches_domain": "incerto",
            "wp_access_validation_executed": False,
            "wp_access_link_status": "NOT_TESTED",
            "wp_admin_accessible": False,
            "plugins_page_accessible": False,
            "wp_access_validation_reason": "mais de um link de acesso encontrado",
            "wp_access_link_count": len(candidates),
            "wp_access_diagnostics": dict(EMPTY_WP_ACCESS_DIAGNOSTICS),
            "wp_access_url_diagnostics": {},
            "wp_access_validator": "",
            "plugin_inventory": [],
        }
    candidate = candidates[0]
    return {
        "wp_access_link_present": True,
        "wp_access_link_type": candidate.get("type", "unknown"),
        "wp_access_link_host": candidate.get("host", ""),
        "wp_access_link_matches_domain": candidate.get("matches_domain", "incerto"),
        "wp_access_validation_executed": False,
        "wp_access_link_status": candidate.get("status", "NOT_TESTED"),
        "wp_admin_accessible": False,
        "plugins_page_accessible": False,
        "wp_access_validation_reason": candidate.get("validation_reason", "validação não executada"),
        "wp_access_link_count": 1,
        "wp_access_diagnostics": dict(EMPTY_WP_ACCESS_DIAGNOSTICS),
        "wp_access_url_diagnostics": candidate.get("url_diagnostics", {}),
        "wp_access_validator": "",
        "plugin_inventory": [],
    }


def short_indicator(text: str, phrase: str) -> str:
    folded = _fold_text(text)
    folded_phrase = _fold_text(phrase)
    index = folded.find(folded_phrase)
    if index == -1:
        return phrase
    raw = _text_value(text)
    start = max(0, index - 20)
    end = min(len(raw), index + len(phrase) + 20)
    return raw[start:end].strip()


def extract_reply_items(raw_ticket: Dict[str, Any]) -> List[Dict[str, Any]]:
    replies = raw_ticket.get("replies") or raw_ticket.get("reply") or []
    if isinstance(replies, dict):
        replies = replies.get("reply") or replies.get("replies") or []
    if isinstance(replies, dict):
        replies = [replies]
    if isinstance(replies, list):
        return [reply for reply in replies if isinstance(reply, dict)]
    return []


def reply_author_type(reply: Dict[str, Any]) -> str:
    admin = _text_value(reply.get("admin"))
    if admin:
        return "suporte"
    if _text_value(reply.get("type")).lower() in {"admin", "staff", "operator"}:
        return "suporte"
    return "cliente"


def reply_message(reply: Dict[str, Any]) -> str:
    return _text_value(reply.get("message") or reply.get("body") or reply.get("description"))


def detect_customer_authorization(client_messages: Sequence[str], subject: str) -> tuple[str, List[str]]:
    combined = " ".join([subject, *client_messages])
    folded = _fold_text(combined)
    if any(_fold_text(phrase) in folded for phrase in NON_AUTHORIZATION_PHRASES):
        return "nao", []
    hits = [phrase for phrase in CLIENT_AUTHORIZATION_PHRASES if _fold_text(phrase) in folded]
    if hits:
        return "sim", hits
    subject_folded = _fold_text(subject)
    has_subject_request = "ativacao de plugin" in subject_folded or "ativar" in subject_folded
    has_client_context = any("plugin" in _fold_text(message) or "ativ" in _fold_text(message) for message in client_messages)
    if has_subject_request and has_client_context:
        return "sim", ["pedido explícito no assunto e mensagem inicial do cliente"]
    return "incerto", []


def detect_support_completion(support_messages: Sequence[str]) -> tuple[bool, List[str]]:
    combined = " ".join(support_messages)
    folded = _fold_text(combined)
    hits = [phrase for phrase in SUPPORT_COMPLETION_PHRASES if _fold_text(phrase) in folded]
    return bool(hits), hits


def normalize_whmcs_ticket_detail(
    raw_ticket: Dict[str, Any],
    summary: Dict[str, Any],
    whitelist: Sequence[Dict[str, Any]],
    rules: Dict[str, Any],
    *,
    whmcs_client: WHMCSApiClient | None = None,
    validate_wp_access: bool = False,
    wp_validator: str = "browser",
    inspect_requested_plugins: bool = False,
    debug_plugin_table: bool = False,
    debug_package_match: bool = False,
    debug_service_resolution: bool = False,
    prepare_missing_data_reply: bool = False,
    plugin_aliases: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    normalized = merge_normalized_ticket(summary, normalize_whmcs_ticket_summary(raw_ticket))
    initial_message = _text_value(raw_ticket.get("message") or raw_ticket.get("body") or normalized.get("message"))
    replies_raw = extract_reply_items(raw_ticket)
    replies = [
        {
            "author_type": reply_author_type(reply),
            "message": reply_message(reply),
        }
        for reply in replies_raw
    ]
    client_messages = [initial_message] + [reply["message"] for reply in replies if reply["author_type"] == "cliente"]
    support_messages = [reply["message"] for reply in replies if reply["author_type"] == "suporte"]
    all_messages = [message for message in [initial_message, *[reply["message"] for reply in replies]] if message]
    ticket_service_hint = _text_value(raw_ticket.get("service") or raw_ticket.get("service_name") or raw_ticket.get("product") or raw_ticket.get("product_name"))
    ticket_domain_hint = normalize_domain(
        _text_value(raw_ticket.get("domain") or raw_ticket.get("service_domain"))
    )

    domains: List[str] = []
    for message in all_messages:
        for domain in extract_domains_from_text(message):
            if domain not in domains:
                domains.append(domain)

    combined_for_plugins = dict(normalized)
    combined_for_plugins["message"] = " ".join([normalized.get("subject_final", ""), *all_messages])
    plugin_analysis = analyze_ticket(combined_for_plugins, whitelist, rules, source="detail")
    authorization, authorization_hits = detect_customer_authorization(client_messages, normalized.get("subject_final", ""))
    completion_signal, completion_hits = detect_support_completion(support_messages)
    domain_detected = domains[0] if len(domains) == 1 else ""
    if not domain_detected and ticket_domain_hint:
        domain_detected = ticket_domain_hint

    service_resolution = {
        "service_resolution_executed": False,
        "service_resolution_clientid_present": False,
        "service_resolution_serviceid_present": False,
        "service_resolution_total_products": 0,
        "service_resolution_active_products": 0,
        "service_resolution_domain": "",
        "service_resolution_status": "NOT_EXECUTED",
        "service_resolution_reason": "",
        "service_resolution_candidates": [],
    }
    wp_candidates = extract_wp_access_links_from_client_messages(client_messages, domain_detected)
    wp_access = safe_wp_link_result(wp_candidates)

    if validate_wp_access and len(wp_candidates) == 1 and wp_access["wp_access_link_matches_domain"] is True:
        if wp_validator == "http":
            validation = validate_wp_access_link(wp_candidates[0]["url"], domain_detected)
        else:
            validation = validate_wp_access_link_with_browser(
                wp_candidates[0]["url"],
                domain_detected,
                requested_plugins=plugin_analysis.plugins_detectados,
                alias_config=plugin_aliases,
                inspect_plugins=inspect_requested_plugins,
                debug_plugin_table=debug_plugin_table,
            )
        wp_access.update(
            {
                "wp_access_validation_executed": validation.executed,
                "wp_access_link_status": validation.status,
                "wp_admin_accessible": validation.wp_admin_accessible,
                "plugins_page_accessible": validation.plugins_page_accessible,
                "wp_access_validation_reason": validation.reason,
                "wp_access_diagnostics": validation.diagnostics,
                "wp_access_validator": wp_validator,
                "plugin_inventory": validation.diagnostics.get("requested_plugin_inventory", []),
            }
        )

    if whmcs_client is not None:
        service_resolution = resolve_service_domain_from_ticket(
            whmcs_client,
            raw_ticket,
            wp_access_candidates=wp_candidates,
            debug_service_resolution=debug_service_resolution,
        )
        if not domain_detected and service_resolution.get("service_resolution_domain"):
            domain_detected = service_resolution["service_resolution_domain"]
    elif ticket_domain_hint and not domain_detected:
        domain_detected = ticket_domain_hint

    missing_information: List[str] = []
    if not domains and not domain_detected:
        missing_information.append("domínio não encontrado")
    elif len(domains) > 1:
        missing_information.append("mais de um domínio encontrado")
    if authorization != "sim":
        missing_information.append("autorização não confirmada")
    if not plugin_analysis.plugins_detectados:
        missing_information.append("plugin não identificado")
    if not wp_access["wp_access_link_present"]:
        missing_information.append("link de acesso WordPress não encontrado")
    elif wp_access["wp_access_link_count"] > 1:
        missing_information.append("mais de um link de acesso WordPress encontrado")
    elif wp_access["wp_access_link_matches_domain"] is not True:
        missing_information.append("link de acesso fora do domínio")

    folded_text = _fold_text(" ".join([normalized.get("subject_final", ""), *all_messages]))
    review_type = any(_fold_text(term) in folded_text for term in REVIEW_TYPE_TERMS)
    if completion_signal:
        preflight_classification = "IGNORAR_CONCLUIDO"
        next_action = "Não incluir na fila de ativação."
    elif wp_access["wp_access_validation_executed"] and wp_access["wp_access_link_status"] in VALIDATED_WP_STATUS_CLASSIFICATION:
        preflight_classification, next_action = VALIDATED_WP_STATUS_CLASSIFICATION[wp_access["wp_access_link_status"]]
    elif wp_access["wp_access_link_count"] > 1 or wp_access["wp_access_link_status"] in {"INVALID", "OFF_DOMAIN"} or wp_access["wp_access_link_type"] == "unknown":
        preflight_classification = "REVISAR LINK"
        next_action = "Revisar o link temporário antes de qualquer validação."
    elif wp_access["wp_access_link_status"] == "EXPIRED":
        preflight_classification = "LINK EXPIRADO"
        next_action = "Solicitar novo link temporário ao cliente."
    elif wp_access["wp_access_link_status"] == "ACCESSIBLE":
        preflight_classification = "ACESSO WORDPRESS VALIDADO"
        next_action = "Validar cliente, serviço ativo, conta cPanel e instalação WordPress antes de qualquer ativação."
    elif review_type:
        preflight_classification = "REVISAR TIPO DE SOLICITAÇÃO"
        next_action = "Revisar o tipo de solicitação antes de qualquer ação."
    elif not wp_access["wp_access_link_present"] and not domain_detected:
        missing_information = [
            "link temporário de acesso ao WordPress",
            "domínio correto não identificado",
        ]
        preflight_classification = "BLOCKED_MISSING_ACCESS_DATA"
        next_action = "Solicitar link temporário de acesso ao WordPress."
    elif missing_information:
        preflight_classification = "FALTAM DADOS"
        if not wp_access["wp_access_link_present"]:
            next_action = "Solicitar link temporário de acesso ao WordPress."
        else:
            next_action = "Revisar o ticket ou solicitar as informações faltantes."
    elif plugin_analysis.decision == "pending_activation":
        preflight_classification = "PRONTO PARA VALIDAÇÃO DA CONTA"
        next_action = "Validar cliente, serviço ativo, conta cPanel e instalação WordPress antes de qualquer ativação."
    else:
        preflight_classification = "IGNORAR"
        next_action = "Não incluir na fila de ativação."

    if prepare_missing_data_reply and not wp_access["wp_access_link_present"]:
        normalized["suggested_missing_data_reply"] = (
            "Olá! Para realizarmos a ativação, envie um link temporário de acesso ao WordPress com permissão para acessar a área de plugins. "
            "Como existem mais de um serviço ativo em sua conta, o link também será usado para identificarmos com segurança o domínio correto."
        )

    if _fold_text(normalized.get("status")) in {"closed", "resolved", "fechado", "resolvido"}:
        preflight_classification = "BLOCKED_CLOSED_TICKET"
        next_action = "nenhuma ação automática; revisar apenas se o ticket for reaberto"

    author_types = sorted({reply["author_type"] for reply in replies} | ({"cliente"} if initial_message else set()))
    preflight = {
        "ticket_id": normalized.get("ticket_id", ""),
        "ticket_num": normalized.get("ticket_num", ""),
        "subject": normalized.get("subject_final") or normalized.get("subject", ""),
        "status": normalized.get("status", ""),
        "department": normalized.get("department", ""),
        "customer_name_masked": mask_name(raw_ticket.get("name") or raw_ticket.get("clientname")),
        "customer_email_masked": mask_email(raw_ticket.get("email") or raw_ticket.get("client_email") or raw_ticket.get("customer_email")),
        "initial_message": "",
        "replies": [
            {"author_type": reply["author_type"], "indicator": "mensagem analisada"}
            for reply in replies
        ],
        "plugins_detected": plugin_analysis.plugins_detectados,
        "requested_plugins": plugin_analysis.plugins_detectados,
        "domain_detected": domain_detected,
        "domains_found": domains,
        "customer_authorization": authorization,
        "authorization_indicators": authorization_hits,
        "completion_signal": completion_signal,
        "completion_indicators": completion_hits,
        "missing_information": missing_information,
        "classification": preflight_classification,
        "overall_status": preflight_classification,
        "next_action": next_action,
        "message_count": len(all_messages),
        "author_types_found": author_types,
        "debug_package_match": bool(debug_package_match),
        "service_resolution_debug": bool(debug_service_resolution),
        "service_resolution": service_resolution,
        "service_detected": ticket_service_hint,
        "suggested_missing_data_reply": normalized.get("suggested_missing_data_reply", ""),
        **wp_access,
    }
    normalized["message"] = " ".join(all_messages)
    normalized["preflight"] = preflight
    return normalized


def normalize_whmcs_ticket_summary(raw_ticket: Dict[str, Any]) -> Dict[str, Any]:
    ticket_id, ticket_id_field = first_present(raw_ticket, TICKET_ID_FIELD_CANDIDATES)
    ticket_num, ticket_num_field = first_present(raw_ticket, TICKET_NUM_FIELD_CANDIDATES)
    subject, subject_field = first_present(raw_ticket, SUBJECT_FIELD_CANDIDATES)
    department, department_field = first_present(raw_ticket, ["department", "deptname", "dept_name"])
    status, status_field = first_present(raw_ticket, ["status"])
    email, email_field = first_present(raw_ticket, ["email", "client_email", "customer_email"])
    last_reply_by, last_reply_by_field = first_present(raw_ticket, ["last_reply_by", "lastreplyby", "last_reply"])
    created_at, created_at_field = first_present(raw_ticket, ["created_at", "date", "datecreated"])
    message, message_field = first_present(raw_ticket, ["message", "body", "description"])
    service, service_field = first_present(raw_ticket, ["service", "service_name", "product", "product_name"])
    domain_hint, domain_field = first_present(raw_ticket, ["domain", "service_domain"])

    subject_final = subject
    if ticket_num and subject:
        subject_final = f"#{ticket_num} - {subject}"

    raw_subject_fields = {}
    for key in SUBJECT_FIELD_CANDIDATES:
        value = _text_value(raw_ticket.get(key))
        if not value:
            continue
        raw_subject_fields[key] = mask_name(value) if key == "name" else value
    fields_used = {
        "ticket_id": ticket_id_field,
        "ticket_num": ticket_num_field,
        "subject": subject_field,
        "department": department_field,
        "status": status_field,
        "customer_email": email_field,
        "last_reply_by": last_reply_by_field,
        "created_at": created_at_field,
        "message": message_field,
        "service": service_field,
        "domain": domain_field,
    }
    fields_used = {key: value for key, value in fields_used.items() if value}

    return {
        "ticket_id": ticket_id,
        "ticket_num": ticket_num,
        "status": status,
        "department": department,
        "subject": subject,
        "subject_final": subject_final,
        "message": message,
        "raw_subject_fields": raw_subject_fields,
        "customer_email_masked": mask_email(email),
        "last_reply_by": last_reply_by,
        "created_at": created_at,
        "service": service,
        "domain": domain_hint,
        "fields_used": fields_used,
        "debug_fields": {
            "campos_encontrados_no_resumo": sorted(str(key) for key in raw_ticket.keys()),
            "raw_subject_fields": raw_subject_fields,
            "campo_subject_escolhido": subject_field or "nenhum",
        },
    }


def normalize_whmcs_tickets(raw_tickets: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [normalize_whmcs_ticket_summary(ticket) for ticket in raw_tickets if isinstance(ticket, dict)]


def load_whitelist() -> List[Dict[str, Any]]:
    whitelist_path = PROJECT_DIR / "config" / "plugins_whitelist.example.json"
    data = load_json(whitelist_path, [])
    return data if isinstance(data, list) else []


def load_rules(config: Dict[str, Any]) -> Dict[str, Any]:
    detection = config.get("detection", {})
    return detection if isinstance(detection, dict) else {}


def load_plugin_aliases(config: Dict[str, Any]) -> Dict[str, Any]:
    path = Path(config.get("plugin_aliases_path") or DEFAULT_PLUGIN_ALIASES_PATH)
    data = load_json(path, {})
    return data if isinstance(data, dict) else {}


def ensure_report_dir(report_dir: Path) -> None:
    report_dir.mkdir(parents=True, exist_ok=True)


def read_mock_tickets(mock_path: Path) -> List[Dict[str, Any]]:
    data = load_json(mock_path, [])
    whmcs_title_fixture = {
        "id": "999",
        "tid": "QEY-565588",
        "title": "Solicitação de ativação de plugin(s): Elementor PRO, WP Rocket",
        "status": "Abertos",
        "deptname": "Suporte Técnico",
    }
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)] + [whmcs_title_fixture]
    if isinstance(data, dict):
        tickets = data.get("tickets") or data.get("ticket") or []
        if isinstance(tickets, list):
            return [item for item in tickets if isinstance(item, dict)] + [whmcs_title_fixture]
    return [whmcs_title_fixture]


def mask_email_addresses(value: Any) -> str:
    if value is None:
        return ""
    return EMAIL_PATTERN.sub("[email]", str(value))


def sanitize_analysis_for_report(item: TicketAnalysis, redact_emails: bool) -> TicketAnalysis:
    if not redact_emails:
        return item
    payload = item.to_dict()
    payload["subject"] = mask_email_addresses(payload.get("subject"))
    payload["subject_final"] = mask_email_addresses(payload.get("subject_final"))
    payload["message"] = mask_email_addresses(payload.get("message"))
    payload["domain"] = mask_email_addresses(payload.get("domain"))
    return TicketAnalysis(**payload)


def fetch_public_ip() -> str:
    with urlopen(IPIFY_URL, timeout=5) as response:
        data = json.loads(response.read().decode("utf-8"))
    if isinstance(data, dict) and data.get("ip"):
        return str(data["ip"])
    return ""


def configured_label(value: Any) -> str:
    return "configurado" if value else "nao configurado"


def print_forbidden_next_steps() -> None:
    print("Proximos passos para HTTP 403:")
    for step in FORBIDDEN_NEXT_STEPS:
        print(f"- {step}")


def print_debug_request(params: Dict[str, Any], totalresults: int | None) -> None:
    print("Debug seguro da chamada GetTickets")
    print("action: GetTickets")
    print(f"status enviado: {_text_value(params.get('status')) or 'vazio'}")
    print(f"limitstart: {_text_value(params.get('limitstart')) or '0'}")
    print(f"limitnum: {_text_value(params.get('limitnum')) or 'vazio'}")
    print(f"subject: {_text_value(params.get('subject')) or 'vazio'}")
    print(f"totalresults retornado: {totalresults if totalresults is not None else 'indisponivel'}")


def print_queue_tickets(tickets: Sequence[Dict[str, Any]]) -> None:
    print("Tickets retornados pela fila")
    for ticket in tickets:
        print(
            "tid: {tid} | subject: {subject} | status: {status} | departamento: {department}".format(
                tid=_text_value(ticket.get("ticket_num")) or "vazio",
                subject=_text_value(ticket.get("subject")) or _text_value(ticket.get("subject_final")) or "vazio",
                status=_text_value(ticket.get("status")) or "vazio",
                department=_text_value(ticket.get("department")) or "vazio",
            )
        )


def print_debug_ticket_fetch(debug: Dict[str, Any]) -> None:
    print("Debug seguro de fetch do ticket")
    print(f"referencia recebida: {debug.get('reference') or 'vazio'}")
    print(f"parametro usado: {debug.get('param_name') or 'vazio'}")
    print(f"API result: {debug.get('api_result') or 'error'}")
    print(f"ticketid retornado: {debug.get('ticketid') or 'vazio'}")
    print(f"tid retornado: {debug.get('tid') or 'vazio'}")
    print(f"subject presente: {'sim' if debug.get('subject_present') else 'nao'}")
    print(f"status: {debug.get('status') or 'vazio'}")
    print(f"respostas encontradas: {debug.get('replies_count', 0)}")
    print(f"servico associado presente: {'sim' if debug.get('service_present') else 'nao'}")
    if "fallback_used" in debug:
        print(f"fallback fila utilizado: {'sim' if debug.get('fallback_used') else 'nao'}")


def print_debug_browser_ui(debug: Dict[str, Any], preflight_by_key: Dict[str, Dict[str, Any]] | None = None) -> None:
    print("Debug seguro do provider browser-ui")
    print(f"navegador iniciado: {'sim' if debug.get('browser_started') else 'nao'}")
    print(f"login detectado: {'sim' if debug.get('logged_in') else 'nao'}")
    print(f"pagina atual: {debug.get('current_page') or 'vazio'}")
    print(f"quantidade de tickets visiveis: {debug.get('visible_tickets', 0)}")
    print(f"tickets candidatos: {', '.join(debug.get('candidates') or []) or 'nenhum'}")
    print(f"perfil persistente configurado: {'sim' if debug.get('persistent_profile_configured') else 'nao'}")
    if preflight_by_key:
        first = next(iter(preflight_by_key.values()))
        print(f"ticket aberto: {first.get('ticket_num') or 'vazio'}")
        print(f"assunto: {first.get('subject') or 'vazio'}")
        print(f"status: {first.get('status') or 'vazio'}")
        print(f"departamento: {first.get('department') or 'vazio'}")
        print(f"servico associado presente: {'sim' if first.get('service_detected') else 'nao'}")
        print(f"dominio detectado: {first.get('domain_detected') or 'nenhum'}")
        print(f"link WordPress presente: {'sim' if first.get('wp_access_link_present') else 'nao'}")
        print(f"quantidade de mensagens analisadas: {first.get('message_count', 0)}")
        print(f"classificacao: {first.get('classification') or 'vazio'}")


def print_debug_browser_dom(debug: Dict[str, Any]) -> None:
    print("Debug seguro do DOM browser-ui")
    print(f"path atual: {debug.get('current_path') or debug.get('path') or 'vazio'}")
    print(f"titulo da pagina: {debug.get('page_title') or debug.get('title') or 'vazio'}")
    print(f"filtro de status encontrado: {'sim' if debug.get('queue_filter_found') else 'nao'}")
    print(f"opcao Aguardando Resposta encontrada: {'sim' if debug.get('awaiting_reply_option_found') else 'nao'}")
    print(f"filtro aplicado: {'sim' if debug.get('filter_applied') else 'nao'}")
    print(f"texto de itens encontrados: {debug.get('items_found_text') or 'vazio'}")
    print(f"quantidade de tabelas visiveis: {debug.get('visible_tables', 0)}")
    print(f"quantidade de tabelas candidatas: {debug.get('candidate_tables', 0)}")
    headers_found = debug.get('headers_found') or []
    if headers_found:
        formatted_headers = [" / ".join(headers) if isinstance(headers, list) else str(headers) for headers in headers_found]
        print(f"cabecalhos encontrados: {'; '.join(formatted_headers)}")
    else:
        print("cabecalhos encontrados: nenhum")
    print(f"quantidade de linhas na tabela escolhida: {debug.get('chosen_table_rows', 0)}")
    print(f"quantidade de links com numero de ticket: {debug.get('ticket_link_count', 0)}")
    print(f"quantidade final de tickets normalizados: {debug.get('normalized_ticket_count', 0)}")
    print(f"linhas analisadas: {debug.get('rows_analyzed', 0)}")
    print(f"linhas aceitas: {debug.get('rows_accepted', 0)}")
    print(f"linhas rejeitadas: {debug.get('rows_rejected', 0)}")
    rejection_stats = debug.get("rejection_stats") or {}
    if rejection_stats:
        parts = [f"{key}={value}" for key, value in rejection_stats.items() if value]
        print(f"motivos de rejeicao: {'; '.join(parts) if parts else 'nenhum'}")
    samples = debug.get("rejection_samples") or []
    for index, sample in enumerate(samples[:5], start=1):
        print(
            "rejeitada {idx}: ticketnum={ticket}; departamento presente={dept}; assunto presente={subj}; status presente={status}; href seguro={href}; motivo={reason}".format(
                idx=index,
                ticket=sample.get("ticket_num") or "vazio",
                dept="sim" if sample.get("department_present") else "nao",
                subj="sim" if sample.get("subject_present") else "nao",
                status="sim" if sample.get("status_present") else "nao",
                href="sim" if sample.get("href_safe") else "nao",
                reason=sample.get("reason") or "vazio",
            )
        )
    if debug.get("browser_ui_status") and debug.get("browser_ui_status") != "OK":
        print(f"status tecnico: {debug.get('browser_ui_status')}")
    if debug.get("failure_reason"):
        print(f"motivo exato: {debug.get('failure_reason')}")


def print_debug_browser_flow(debug: Dict[str, Any]) -> None:
    print("Debug seguro do fluxo browser-ui")
    print(f"autenticacao validada: {'sim' if debug.get('logged_in') else 'nao'}")
    print(f"fila aberta: {'sim' if debug.get('current_path') else 'nao'}")
    print(f"filtro aplicado ou reutilizado: {'sim' if debug.get('queue_filter_found') else 'nao'}")
    print(f"listagem executada: {debug.get('listings_executed', 0)}")
    print(f"tickets indexados: {debug.get('ticket_index_count', 0)}")
    print(f"ticket solicitado: {debug.get('requested_ticket') or 'vazio'}")
    print(f"encontrado no indice: {'sim' if debug.get('requested_ticket_found_in_index') else 'nao'}")
    print(f"busca direta necessaria: {'sim' if debug.get('direct_search_needed') else 'nao'}")
    print(f"campo Assunto/Mensagem encontrado: {'sim' if debug.get('direct_search_input_found') else 'nao'}")
    print(f"filtro de fila removido: {'sim' if debug.get('direct_queue_filter_cleared') else 'nao'}")
    print(f"filtro direto aplicado: {'sim' if debug.get('direct_filter_applied') else 'nao'}")
    print(f"resultados encontrados: {debug.get('direct_results_count', 0)}")
    print(f"correspondencia exata encontrada: {'sim' if debug.get('direct_exact_match') else 'nao'}")
    print(f"ticket sendo aberto: {debug.get('opened_ticket') or 'vazio'}")
    print(f"href relativo: {'sim' if debug.get('href_relative') else 'nao'}")
    print(f"URL resolvida dentro de /gestor/: {'sim' if debug.get('url_resolved_in_gestor') else 'nao'}")
    print(f"metodo usado: {debug.get('open_method') or 'vazio'}")
    print(f"candidato sendo aberto: {'sim' if debug.get('opened_candidate') else 'nao'}")
    print(f"origem da abertura: {debug.get('open_origin') or 'vazio'}")
    print(f"retorno à lista: {'sim' if debug.get('returned_to_list') else 'nao'}")
    print(f"quantidade de aplicacoes do filtro: {debug.get('queue_filter_applications', 0)}")
    print(f"página de detalhe detectada: {'sim' if debug.get('detail_detected') else 'nao'}")
    print(f"login real detectado: {'sim' if debug.get('login_real_detected') else 'nao'}")
    print(f"status lido no detalhe: {debug.get('opened_status') or 'vazio'}")
    print(f"resultado tecnico: {debug.get('technical_result') or 'vazio'}")
    print(f"loop detectado: {'sim' if debug.get('loop_detected') else 'nao'}")


class _HTMLTicketListParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_row = False
        self.in_cell = False
        self.current_cells: List[str] = []
        self.current_text: List[str] = []
        self.rows: List[List[str]] = []
        self.headers: List[str] = []
        self.in_header = False

    def handle_starttag(self, tag: str, attrs: List[tuple[str, str | None]]) -> None:
        if tag == "tr":
            self.in_row = True
            self.current_cells = []
        elif tag in {"td", "th"} and self.in_row:
            self.in_cell = True
            self.current_text = []
            self.in_header = tag == "th"

    def handle_data(self, data: str) -> None:
        if self.in_cell:
            self.current_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag in {"td", "th"} and self.in_cell:
            text = unescape(" ".join(self.current_text)).strip()
            self.current_cells.append(re.sub(r"\s+", " ", text))
            self.in_cell = False
            self.current_text = []
        elif tag == "tr" and self.in_row:
            row = [cell for cell in self.current_cells if cell]
            if row:
                if self.in_header and not self.headers:
                    self.headers = row
                else:
                    self.rows.append(row)
            self.in_row = False
            self.current_cells = []
            self.in_header = False


def _row_to_ticket(row: List[str], headers: List[str]) -> Dict[str, Any]:
    ticket: Dict[str, Any] = {}
    normalized_headers = [re.sub(r"[^a-z0-9]+", "_", header.strip().lower()).strip("_") for header in headers]
    aliases = {
        "id": "ticket_id",
        "ticket_id": "ticket_id",
        "ticketid": "ticket_id",
        "ticket": "ticket_id",
        "status": "status",
        "subject": "subject",
        "assunto": "subject",
        "message": "message",
        "body": "message",
        "description": "message",
        "department": "department",
        "customer_email": "customer_email",
        "customer": "customer",
        "name": "customer",
    }
    if normalized_headers:
        for index, value in enumerate(row):
            header = normalized_headers[index] if index < len(normalized_headers) else f"col_{index}"
            header = aliases.get(header, header)
            ticket[header] = value
    else:
        if row:
            ticket["ticket_id"] = row[0]
        if len(row) > 1:
            ticket["status"] = row[1]
        if len(row) > 2:
            ticket["subject"] = row[2]
        if len(row) > 3:
            ticket["message"] = " | ".join(row[3:])
    return ticket


def read_html_tickets(html_path: Path) -> List[Dict[str, Any]]:
    html_text = html_path.read_text(encoding="utf-8", errors="ignore")
    parser = _HTMLTicketListParser()
    parser.feed(html_text)
    tickets = [_row_to_ticket(row, parser.headers) for row in parser.rows]
    tickets = [ticket for ticket in tickets if normalize_ticket_id(ticket) or ticket.get("subject") or ticket.get("message")]
    if tickets:
        return tickets

    plain_text = re.sub(r"<[^>]+>", " ", html_text)
    plain_text = re.sub(r"\s+", " ", unescape(plain_text)).strip()
    if not plain_text:
        return []
    return [
        {
            "ticket_id": "",
            "status": "",
            "subject": plain_text[:120],
            "message": plain_text,
        }
    ]


def load_cached_ticket_from_reports(ticket_num: str, report_dir: Path) -> tuple[Dict[str, Any], Dict[str, Any]] | None:
    wanted = _fold_text(ticket_num)
    candidates: list[tuple[tuple[int, ...], Path, Dict[str, Any], Dict[str, Any]]] = []
    for path in sorted(report_dir.glob("whmcs-api-readonly-scanner-*.json"), reverse=True):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for item in data.get("tickets") or []:
            if not isinstance(item, dict):
                continue
            value_candidates = {
                _fold_text(item.get("ticket_num")),
                _fold_text(item.get("ticket_id")),
                _fold_text(item.get("subject_final")),
                _fold_text(item.get("subject")),
            }
            if wanted not in value_candidates and wanted not in " ".join(sorted(value_candidates)):
                continue
            ticket = {
                "ticket_id": item.get("ticket_id", ""),
                "ticket_num": item.get("ticket_num", ""),
                "subject": item.get("subject", ""),
                "subject_final": item.get("subject_final", ""),
                "status": item.get("status", ""),
                "department": item.get("department", ""),
                "message": item.get("subject_final", "") or item.get("subject", ""),
                "plugin_inventory": item.get("plugin_inventory", []),
                "plugins_detected": item.get("plugins_detectados", []),
            }
            preflight = {
                "ticket_id": item.get("ticket_id", ""),
                "ticket_num": item.get("ticket_num", ""),
                "subject": item.get("subject_final", "") or item.get("subject", ""),
                "status": item.get("status", ""),
                "department": item.get("department", ""),
                "plugins_detected": item.get("plugins_detectados", []),
                "requested_plugins": item.get("requested_plugins", []),
                "plugin_inventory": item.get("plugin_inventory", []),
                "domain_detected": item.get("domain_detected", ""),
                "customer_authorization": item.get("customer_authorization", ""),
                "completion_signal": item.get("completion_signal", False),
                "missing_information": item.get("missing_information", []),
                "classification": item.get("preflight_classification", ""),
                "next_action": item.get("next_action", ""),
                "wp_access_link_present": item.get("wp_access_link_present", False),
                "wp_access_link_type": item.get("wp_access_link_type", ""),
                "wp_access_link_host": item.get("wp_access_link_host", ""),
                "wp_access_link_matches_domain": item.get("wp_access_link_matches_domain", "incerto"),
                "wp_access_validation_executed": item.get("wp_access_validation_executed", False),
                "wp_access_link_status": item.get("wp_access_link_status", "NOT_TESTED"),
                "wp_admin_accessible": item.get("wp_admin_accessible", False),
                "plugins_page_accessible": item.get("plugins_page_accessible", False),
                "wp_access_validation_reason": item.get("wp_access_validation_reason", ""),
                "wp_access_diagnostics": item.get("wp_access_diagnostics", {}),
                "wp_access_validator": item.get("wp_access_validator", ""),
                "message_count": 0,
                "author_types_found": [],
                "missing_information": item.get("missing_information", []),
                "completion_signal": item.get("completion_signal", False),
            }
            rank = (
                1 if preflight.get("classification") == "ACESSO WORDPRESS VALIDADO" else 0,
                1 if _text_value(preflight.get("domain_detected")) else 0,
                1 if preflight.get("customer_authorization") == "sim" else 0,
                1 if preflight.get("wp_access_link_status") == "ACCESSIBLE" else 0,
                1 if preflight.get("wp_admin_accessible") else 0,
                1 if preflight.get("plugins_page_accessible") else 0,
                1 if preflight.get("wp_access_validation_executed") else 0,
                1 if preflight.get("plugin_inventory") else 0,
                1 if preflight.get("requested_plugins") else 0,
                1 if preflight.get("plugins_detected") else 0,
            )
            candidates.append((rank, path, ticket, preflight))
    if not candidates:
        return None
    candidates.sort(key=lambda item: (item[0], item[1].name), reverse=True)
    _, _, ticket, preflight = candidates[0]
    return ticket, preflight


def _ticket_client_id(ticket: Dict[str, Any]) -> str:
    client_id, _ = first_present(ticket, ["userid", "clientid", "client_id"])
    if client_id:
        return client_id
    contact_id, _ = first_present(ticket, ["contactid", "contact_id"])
    return contact_id


def _product_field_value(product: Dict[str, Any], keys: Sequence[str]) -> str:
    value, _ = first_present(product, keys)
    return value


def _normalize_client_product(product: Dict[str, Any]) -> Dict[str, Any]:
    service_id = _product_field_value(product, ["serviceid", "service_id", "id"])
    domain = normalize_domain(_product_field_value(product, ["domain", "domainname", "service_domain"]))
    status = _text_value(product.get("status") or product.get("productstatus") or product.get("state"))
    name = _text_value(product.get("name") or product.get("productname") or product.get("product"))
    return {
        "service_id": service_id,
        "domain": domain,
        "status": status,
        "name": name,
        "pid": _product_field_value(product, ["pid", "productid", "product_id"]),
    }


def resolve_service_domain_from_ticket(
    client: WHMCSApiClient,
    ticket: Dict[str, Any],
    *,
    wp_access_candidates: Sequence[Dict[str, Any]] | None = None,
    debug_service_resolution: bool = False,
) -> Dict[str, Any]:
    ticket_client_id = _ticket_client_id(ticket)
    ticket_service_id = _product_field_value(ticket, ["serviceid", "service_id"])
    resolution = {
        "service_resolution_executed": False,
        "service_resolution_clientid_present": bool(ticket_client_id),
        "service_resolution_serviceid_present": bool(ticket_service_id),
        "service_resolution_total_products": 0,
        "service_resolution_active_products": 0,
        "service_resolution_domain": "",
        "service_resolution_status": "NOT_EXECUTED",
        "service_resolution_reason": "",
        "service_resolution_candidates": [],
        "service_resolution_wp_hosts": [],
    }
    if not ticket_client_id and not ticket_service_id:
        resolution["service_resolution_reason"] = "clientid/serviceid ausentes no ticket"
        return resolution

    try:
        response = client.get_clients_products(
            clientid=ticket_client_id or None,
            serviceid=ticket_service_id or None,
            limitstart=0,
            limitnum=1000,
        )
    except Exception as exc:
        resolution["service_resolution_executed"] = True
        resolution["service_resolution_status"] = "ERROR"
        resolution["service_resolution_reason"] = f"falha ao consultar GetClientsProducts: {exc.__class__.__name__}"
        return resolution

    products = [_normalize_client_product(item) for item in extract_products_from_response(response)]
    active_products = [item for item in products if _fold_text(item.get("status")) == "active"]
    active_domain_candidates = [item for item in active_products if item.get("domain")]
    resolution["service_resolution_executed"] = True
    resolution["service_resolution_total_products"] = len(products)
    resolution["service_resolution_active_products"] = len(active_products)
    resolution["service_resolution_candidates"] = [
        {
            "service_id": item.get("service_id", ""),
            "domain": item.get("domain", ""),
            "status": item.get("status", ""),
        }
        for item in active_products
    ]

    selected_domain = ""
    wp_hosts: list[str] = []
    for candidate in wp_access_candidates or []:
        host = normalize_domain(candidate.get("host", ""))
        if host and host not in wp_hosts:
            wp_hosts.append(host)
    resolution["service_resolution_wp_hosts"] = wp_hosts

    if wp_hosts:
        if len(wp_hosts) > 1:
            resolution["service_resolution_status"] = "AMBIGUOUS_SERVICE"
            resolution["service_resolution_reason"] = "mais de um host WP encontrado"
            return resolution
        wp_host = wp_hosts[0]
        matching_active_domains = [
            item for item in active_products if item.get("domain") and domains_match_safe(item.get("domain", ""), wp_host)
        ]
        if len(matching_active_domains) == 1:
            selected_domain = matching_active_domains[0].get("domain", "")
            resolution["service_resolution_status"] = "RESOLVED_BY_WP_HOST"
            resolution["service_resolution_reason"] = "dominio do servico resolvido pelo hostname do link WordPress"
            resolution["service_resolution_domain"] = selected_domain
            return resolution
        if not matching_active_domains:
            resolution["service_resolution_status"] = "DOMAIN_SERVICE_MISMATCH"
            resolution["service_resolution_reason"] = "hostname do link WordPress nao corresponde a nenhum servico ativo"
            return resolution
        resolution["service_resolution_status"] = "AMBIGUOUS_SERVICE"
        resolution["service_resolution_reason"] = "mais de um servico corresponde ao hostname do link WordPress"
        return resolution

    if ticket_service_id:
        matched = [item for item in products if _fold_text(item.get("service_id")) == _fold_text(ticket_service_id)]
        if matched:
            matched_domain = matched[0].get("domain", "")
            if matched_domain and _fold_text(matched[0].get("status")) == "active":
                selected_domain = matched_domain
                resolution["service_resolution_status"] = "RESOLVED_BY_SERVICEID"
                resolution["service_resolution_reason"] = "domínio resolvido pelo serviceid do ticket"
            else:
                resolution["service_resolution_status"] = "SERVICEID_MATCH_WITHOUT_DOMAIN"
                resolution["service_resolution_reason"] = "serviceid encontrado sem domínio ativo"
    if not selected_domain:
        unique_active_domains = []
        seen_domains: set[str] = set()
        for item in active_domain_candidates:
            domain = _fold_text(item.get("domain"))
            if domain and domain not in seen_domains:
                seen_domains.add(domain)
                unique_active_domains.append(item.get("domain", ""))
        if len(unique_active_domains) == 1:
            selected_domain = unique_active_domains[0]
            resolution["service_resolution_status"] = "RESOLVED"
            resolution["service_resolution_reason"] = "domínio único encontrado entre serviços ativos"
        elif len(active_products) == 1:
            selected_domain = active_products[0].get("domain", "")
            if selected_domain:
                resolution["service_resolution_status"] = "RESOLVED"
                resolution["service_resolution_reason"] = "exatamente um serviço ativo encontrado"
            else:
                resolution["service_resolution_status"] = "NO_DOMAIN"
                resolution["service_resolution_reason"] = "um serviço ativo encontrado sem domínio visível"
        elif len(active_domain_candidates) > 1:
            resolution["service_resolution_status"] = "AMBIGUOUS_SERVICE"
            resolution["service_resolution_reason"] = "mais de um serviço ativo com domínio encontrado"
        elif len(active_products) > 1:
            resolution["service_resolution_status"] = "AMBIGUOUS_SERVICE"
            resolution["service_resolution_reason"] = "mais de um serviço ativo encontrado"
        else:
            resolution["service_resolution_status"] = "NOT_FOUND"
            resolution["service_resolution_reason"] = "nenhum serviço ativo encontrado"

    resolution["service_resolution_domain"] = selected_domain
    return resolution


def print_debug_service_resolution(debug: Dict[str, Any]) -> None:
    print("Debug seguro de resolucao de servico")
    print(f"clientid presente: {'sim' if debug.get('service_resolution_clientid_present') else 'nao'}")
    print(f"serviceid presente: {'sim' if debug.get('service_resolution_serviceid_present') else 'nao'}")
    print(f"total de produtos: {debug.get('service_resolution_total_products', 0)}")
    print(f"produtos ativos: {debug.get('service_resolution_active_products', 0)}")
    print(f"status da resolucao: {debug.get('service_resolution_status') or 'NOT_EXECUTED'}")
    print(f"dominio resolvido: {debug.get('service_resolution_domain') or 'nenhum'}")
    print(f"motivo: {debug.get('service_resolution_reason') or 'vazio'}")


def _ticket_fetch_param_name(ticket_reference: str) -> str:
    return "ticketid" if re.fullmatch(r"\d+", _text_value(ticket_reference)) else "ticketnum"


def _ticket_field_present(ticket: Dict[str, Any], keys: Sequence[str]) -> bool:
    return bool(first_present(ticket, keys)[0])


def _ticket_fetch_debug(response: Dict[str, Any], detail: Dict[str, Any], reference: str, param_name: str) -> Dict[str, Any]:
    result = _text_value(response.get("result")).lower() if isinstance(response, dict) else ""
    replies = extract_reply_items(detail if isinstance(detail, dict) else response if isinstance(response, dict) else {})
    service_present = _ticket_field_present(detail if isinstance(detail, dict) else {}, ["service", "serviceid", "service_id"])
    return {
        "reference": _text_value(reference),
        "param_name": param_name,
        "api_result": result or "error",
        "ticketid": _text_value(detail.get("ticketid") or detail.get("ticket_id") or detail.get("id")) if isinstance(detail, dict) else "",
        "tid": _text_value(detail.get("tid") or detail.get("ticketnum") or detail.get("ticket_num")) if isinstance(detail, dict) else "",
        "subject_present": _ticket_field_present(detail if isinstance(detail, dict) else {}, ["subject", "title", "message_subject", "name"]),
        "status": _text_value(detail.get("status")) if isinstance(detail, dict) else "",
        "replies_count": len(replies),
        "service_present": service_present,
    }


def resolve_and_fetch_ticket(
    client: WHMCSApiClient,
    ticket_reference: str,
    *,
    requested_status: str = "Awaiting Reply",
    debug_ticket_fetch: bool = False,
) -> tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    reference = _text_value(ticket_reference)
    if not reference:
        raise RuntimeError("Referencia de ticket vazia.")

    param_name = _ticket_fetch_param_name(reference)
    try:
        response = client.get_ticket_by_reference(reference)
    except Exception as primary_exc:
        response = {"result": "error", "error": str(primary_exc)}

    detail = extract_ticket_detail_from_response(response if isinstance(response, dict) else {}, reference)
    detail_valid = all(
        _ticket_field_present(detail, keys)
        for keys in (["ticketid", "ticket_id", "id"], ["tid", "ticketnum", "ticket_num"], ["subject", "title", "message_subject", "name"], ["status"])
    )
    api_result = _text_value(response.get("result")).lower() if isinstance(response, dict) else "error"

    fallback_used = False
    if api_result != "success" or not detail_valid:
        page = client.get_tickets_page(status=requested_status, limitstart=0, limitnum=1000)
        candidates = page.get("tickets") or []
        matched_ticket: Dict[str, Any] | None = None
        reference_folded = _fold_text(reference)
        for ticket in candidates:
            if not isinstance(ticket, dict):
                continue
            ticket_values = {
                _fold_text(ticket.get("tid")),
                _fold_text(ticket.get("ticketnum")),
                _fold_text(ticket.get("ticket_num")),
            }
            if reference_folded in ticket_values:
                matched_ticket = ticket
                break
        if matched_ticket:
            numeric_ticket_id = _text_value(matched_ticket.get("ticket_id") or matched_ticket.get("id") or matched_ticket.get("ticketid"))
            if numeric_ticket_id:
                response = client.get_ticket(numeric_ticket_id)
                detail = extract_ticket_detail_from_response(response if isinstance(response, dict) else {}, numeric_ticket_id)
                api_result = _text_value(response.get("result")).lower() if isinstance(response, dict) else "error"
                fallback_used = True
                detail_valid = all(
                    _ticket_field_present(detail, keys)
                    for keys in (["ticketid", "ticket_id", "id"], ["tid", "ticketnum", "ticket_num"], ["subject", "title", "message_subject", "name"], ["status"])
                )

    if api_result != "success" or not detail_valid:
        raise RuntimeError("Nao foi possivel resolver o ticket com os dados atuais.")

    detail = dict(detail)
    if not _text_value(detail.get("ticketid") or detail.get("ticket_id") or detail.get("id")) and _text_value(response.get("ticketid")):
        detail["ticketid"] = response.get("ticketid")
    if not _text_value(detail.get("tid") or detail.get("ticketnum") or detail.get("ticket_num")) and _text_value(response.get("tid")):
        detail["tid"] = response.get("tid")
    if debug_ticket_fetch:
        debug = _ticket_fetch_debug(response if isinstance(response, dict) else {}, detail, reference, param_name)
        debug["fallback_used"] = fallback_used
    else:
        debug = {
            "reference": reference,
            "param_name": param_name,
            "api_result": api_result,
            "ticketid": _text_value(detail.get("ticketid") or detail.get("ticket_id") or detail.get("id")),
            "tid": _text_value(detail.get("tid") or detail.get("ticketnum") or detail.get("ticket_num")),
            "subject_present": _ticket_field_present(detail, ["subject", "title", "message_subject", "name"]),
            "status": _text_value(detail.get("status")),
            "replies_count": len(extract_reply_items(detail)),
            "service_present": _ticket_field_present(detail, ["service", "serviceid", "service_id"]),
            "fallback_used": fallback_used,
        }
    return detail, debug, {"fallback_used": fallback_used}


def _preflight_quality_rank(preflight: Dict[str, Any]) -> tuple[int, ...]:
    return (
        1 if preflight.get("classification") == "ACESSO WORDPRESS VALIDADO" else 0,
        1 if _text_value(preflight.get("domain_detected")) else 0,
        1 if preflight.get("customer_authorization") == "sim" else 0,
        1 if preflight.get("wp_access_link_status") == "ACCESSIBLE" else 0,
        1 if preflight.get("wp_admin_accessible") else 0,
        1 if preflight.get("plugins_page_accessible") else 0,
        1 if preflight.get("wp_access_validation_executed") else 0,
        1 if preflight.get("plugin_inventory") else 0,
        1 if preflight.get("requested_plugins") else 0,
        1 if preflight.get("plugins_detected") else 0,
    )


def select_candidates(tickets: Sequence[Dict[str, Any]], whitelist: Sequence[Dict[str, Any]], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    selected: List[Dict[str, Any]] = []
    for ticket in tickets:
        analysis = analyze_ticket(ticket, whitelist, rules, source="summary")
        if analysis.decision in {"pending_activation", "needs_review"}:
            selected.append(ticket)
    return selected


def ticket_key(ticket: Dict[str, Any]) -> str:
    return _text_value(ticket.get("ticket_id") or ticket.get("ticket_num") or ticket.get("tid") or ticket.get("id"))


def has_deep_lookup_signal(ticket: Dict[str, Any], analysis: TicketAnalysis) -> bool:
    text = _fold_text(" ".join([
        _text_value(ticket.get("subject")),
        _text_value(ticket.get("subject_final")),
        _text_value(ticket.get("message")),
        _text_value(ticket.get("department")),
    ]))
    return (
        analysis.activation_requested
        or bool(analysis.plugins_detectados)
        or any(term in text for term in ["plugin", "ativ", "liberar", "elementor", "wp rocket", "rank math"])
    )


def merge_normalized_ticket(summary: Dict[str, Any], detail: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(summary)
    for key, value in detail.items():
        if value not in (None, "", [], {}):
            merged[key] = value
    merged_fields = dict(summary.get("fields_used") or {})
    merged_fields.update(detail.get("fields_used") or {})
    merged["fields_used"] = merged_fields
    merged_debug = dict(summary.get("debug_fields") or {})
    merged_debug.update(detail.get("debug_fields") or {})
    merged["debug_fields"] = merged_debug
    return merged


def analyze_tickets(
    tickets: Sequence[Dict[str, Any]],
    details_lookup: Dict[str, Dict[str, Any]],
    whitelist: Sequence[Dict[str, Any]],
    rules: Dict[str, Any],
) -> List[TicketAnalysis]:
    analyses: List[TicketAnalysis] = []
    for ticket in tickets:
        ticket_id = normalize_ticket_id(ticket)
        detail = details_lookup.get(ticket_id, ticket)
        source = "detail" if ticket_id in details_lookup else "summary"
        analyses.append(analyze_ticket(detail, whitelist, rules, source=source))
    return analyses


def filter_analyses_for_output(analyses: Sequence[TicketAnalysis], show_ignored: bool) -> List[TicketAnalysis]:
    if show_ignored:
        return list(analyses)
    return [item for item in analyses if item.decision != "ignored" and not is_historical_status(item.status)]


def filter_tickets_by_tid(tickets: Sequence[Dict[str, Any]], ticket_num: str | None) -> List[Dict[str, Any]]:
    if not ticket_num:
        return list(tickets)
    wanted = _fold_text(ticket_num)
    return [ticket for ticket in tickets if _fold_text(ticket.get("ticket_num")) == wanted or _fold_text(ticket.get("ticket_id")) == wanted]


def print_debug_titles(
    summaries: Sequence[Dict[str, Any]],
    analyses: Sequence[TicketAnalysis],
    getticket_called: Dict[str, bool],
) -> None:
    analysis_by_key = {ticket_key(item.to_dict()): item for item in analyses}
    print("Debug seguro de titulos WHMCS")
    for index, ticket in enumerate(summaries, start=1):
        key = ticket_key(ticket)
        analysis = analysis_by_key.get(key)
        raw_subject_fields = ticket.get("raw_subject_fields") or {}
        fields_used = ticket.get("fields_used") or {}
        print(f"Ticket {index}")
        print(f"id: {_text_value(ticket.get('ticket_id')) or 'vazio'}")
        print(f"tid: {_text_value(ticket.get('ticket_num')) or 'vazio'}")
        print(f"ticketnum: {_text_value(ticket.get('ticketnum') or ticket.get('ticket_num')) or 'vazio'}")
        print(f"status: {_text_value(ticket.get('status')) or 'vazio'}")
        print(f"departamento: {_text_value(ticket.get('department')) or 'vazio'}")
        print(f"title: {_text_value(raw_subject_fields.get('title')) or 'vazio'}")
        print(f"subject: {_text_value(raw_subject_fields.get('subject')) or 'vazio'}")
        print(f"assunto_final: {_text_value(ticket.get('subject_final')) or 'vazio'}")
        print(f"campo_assunto_usado: {_text_value(fields_used.get('subject')) or 'nenhum'}")
        print(f"GetTicket chamado: {'sim' if getticket_called.get(key) else 'nao'}")
        if analysis:
            print(f"classificacao: {analysis.classification}")
            print(f"motivo: {analysis.classification_reason}")
            print(f"plugins_detectados: {', '.join(analysis.plugins_detectados) or 'nenhum'}")
        else:
            print("classificacao: nao analisado")
            print("motivo: sem analise")
            print("plugins_detectados: nenhum")


def ticket_report_payload(item: TicketAnalysis, preflight: Dict[str, Any]) -> Dict[str, Any]:
    execution_preparation = preflight.get("execution_preparation") or {}
    execution_plugins = execution_preparation.get("plugins") or []
    execution_first_plugin = execution_plugins[0] if execution_plugins else {}
    return {
        "ticket_id": item.ticket_id,
        "ticket_num": item.ticket_num,
        "subject": item.subject,
        "subject_final": item.subject_final,
        "status": item.status,
        "department": item.department,
        "plugins_detectados": preflight.get("plugins_detected") or item.plugins_detectados,
        "requested_plugins": preflight.get("requested_plugins") or item.plugins_detectados,
        "plugin_inventory": preflight.get("plugin_inventory", []),
        "installation_plan": preflight.get("installation_plan", []),
        "installation_plan_status": preflight.get("installation_plan_status", ""),
        "execution_preparation": preflight.get("execution_preparation", {}),
        "execution_preparation_status": preflight.get("execution_preparation_status", ""),
        "domain_detected": preflight.get("domain_detected", ""),
        "service_resolution_status": (preflight.get("service_resolution") or {}).get("service_resolution_status", ""),
        "service_resolution_reason": (preflight.get("service_resolution") or {}).get("service_resolution_reason", ""),
        "customer_authorization": preflight.get("customer_authorization", ""),
        "completion_signal": preflight.get("completion_signal", False),
        "missing_information": preflight.get("missing_information", []),
        "preflight_classification": preflight.get("classification", ""),
        "overall_status": preflight.get("overall_status", preflight.get("classification", "")),
        "next_action": preflight.get("next_action", ""),
        "suggested_missing_data_reply": preflight.get("suggested_missing_data_reply", ""),
        "wp_access_link_present": preflight.get("wp_access_link_present", False),
        "wp_access_link_type": preflight.get("wp_access_link_type", ""),
        "wp_access_link_host": preflight.get("wp_access_link_host", ""),
        "wp_access_link_matches_domain": preflight.get("wp_access_link_matches_domain", "incerto"),
        "wp_access_validation_executed": preflight.get("wp_access_validation_executed", False),
        "wp_access_link_status": preflight.get("wp_access_link_status", "NOT_TESTED"),
        "wp_admin_accessible": preflight.get("wp_admin_accessible", False),
        "plugins_page_accessible": preflight.get("plugins_page_accessible", False),
        "wp_access_validation_reason": preflight.get("wp_access_validation_reason", ""),
        "wp_access_diagnostics": preflight.get("wp_access_diagnostics", {}),
        "wp_access_validator": preflight.get("wp_access_validator", ""),
        "execution_state_before": execution_first_plugin.get("state_before", ""),
        "installation_executed": execution_preparation.get("installation_executed", False),
        "activation_executed": execution_preparation.get("activation_executed", False),
        "state_after": execution_first_plugin.get("state_after", ""),
        "health_checks": execution_first_plugin.get("health_checks", []),
        "rollback_needed": execution_preparation.get("rollback_needed", False),
        "final_result": execution_preparation.get("final_result", ""),
        "execution_next_action": execution_preparation.get("next_action", ""),
        "plugin": item.plugin,
        "plugin_slug": item.plugin_slug,
        "domain": item.domain,
        "activation_requested": item.activation_requested,
        "authorization_detected": item.authorization_detected,
        "completion_detected": item.completion_detected,
        "wordpress_context": item.wordpress_context,
        "decision": item.decision,
        "classification": item.classification,
        "priority": item.priority,
        "classification_reason": item.classification_reason,
        "score": item.score,
        "signals": item.signals,
        "fields_used": item.fields_used,
        "blocked_actions": item.blocked_actions,
        "is_candidate": item.is_candidate,
        "source": item.source,
        "debug_fields": item.debug_fields,
    }


def print_debug_preflight(preflight_by_key: Dict[str, Dict[str, Any]]) -> None:
    print("Debug seguro de pre-validacao")
    for preflight in preflight_by_key.values():
        print(f"tid: {preflight.get('ticket_num') or 'vazio'}")
        print(f"assunto: {preflight.get('subject') or 'vazio'}")
        print(f"plugins detectados: {', '.join(preflight.get('plugins_detected') or []) or 'nenhum'}")
        print(f"dominio detectado: {preflight.get('domain_detected') or 'nenhum'}")
        print(f"autorizacao: {preflight.get('customer_authorization') or 'incerto'}")
        service_resolution = preflight.get("service_resolution") or {}
        if preflight.get("service_resolution_debug") and service_resolution:
            print("resolucao de servico:")
            print(f"  clientid presente: {'sim' if service_resolution.get('service_resolution_clientid_present') else 'nao'}")
            print(f"  serviceid presente: {'sim' if service_resolution.get('service_resolution_serviceid_present') else 'nao'}")
            print(f"  total de produtos: {service_resolution.get('service_resolution_total_products', 0)}")
            print(f"  produtos ativos: {service_resolution.get('service_resolution_active_products', 0)}")
            print(f"  status: {service_resolution.get('service_resolution_status') or 'NOT_EXECUTED'}")
            print(f"  dominio resolvido: {service_resolution.get('service_resolution_domain') or 'nenhum'}")
            print(f"  motivo: {service_resolution.get('service_resolution_reason') or 'vazio'}")
        print(f"link presente: {'sim' if preflight.get('wp_access_link_present') else 'nao'}")
        print(f"tipo do link: {preflight.get('wp_access_link_type') or 'vazio'}")
        print(f"hostname: {preflight.get('wp_access_link_host') or 'vazio'}")
        url_diagnostics = preflight.get("wp_access_url_diagnostics") or {}
        if url_diagnostics:
            print(f"URL HTML-decodificada: {'sim' if url_diagnostics.get('url_html_decoded') else 'nao'}")
            print(f"protocolo: {url_diagnostics.get('url_scheme') or 'vazio'}")
            print(f"path inicial sem query string: {url_diagnostics.get('url_path') or 'vazio'}")
            print(f"quantidade de parametros: {url_diagnostics.get('url_param_count', 0)}")
            print(f"nomes dos parametros: {', '.join(url_diagnostics.get('url_param_names') or []) or 'nenhum'}")
        match_value = preflight.get("wp_access_link_matches_domain")
        match_label = "sim" if match_value is True else "nao" if match_value is False else "incerto"
        print(f"corresponde ao dominio: {match_label}")
        print(f"validacao executada: {'sim' if preflight.get('wp_access_validation_executed') else 'nao'}")
        print(f"status da validacao: {preflight.get('wp_access_link_status') or 'vazio'}")
        print(f"acesso ao wp-admin: {'sim' if preflight.get('wp_admin_accessible') else 'nao'}")
        print(f"acesso a tela de plugins: {'sim' if preflight.get('plugins_page_accessible') else 'nao'}")
        diagnostics = preflight.get("wp_access_diagnostics") or {}
        if preflight.get("wp_access_validation_executed"):
            print(f"validador usado: {preflight.get('wp_access_validator') or 'vazio'}")
            print(f"navegador iniciado: {'sim' if diagnostics.get('browser_started') else 'nao'}")
            print(f"status HTTP inicial: {diagnostics.get('initial_http_status') or 'vazio'}")
            print(f"caminho final inicial: {diagnostics.get('initial_final_path') or 'vazio'}")
            print(f"quantidade de redirecionamentos: {diagnostics.get('redirect_count', 0)}")
            print(f"hosts envolvidos: {', '.join(diagnostics.get('hosts_involved') or []) or 'nenhum'}")
            print(f"quantidade de cookies em memoria: {diagnostics.get('cookie_count', 0)}")
            print(f"status HTTP plugins.php: {diagnostics.get('plugins_http_status') or 'vazio'}")
            print(f"caminho final plugins.php: {diagnostics.get('plugins_final_path') or 'vazio'}")
            print(f"redirecionou para wp-login.php: {'sim' if diagnostics.get('redirected_to_wp_login') else 'nao'}")
            print(f"plugins.php retornou 403: {'sim' if diagnostics.get('plugins_returned_403') else 'nao'}")
            if "wordpress_authenticated" in diagnostics:
                print(f"WordPress autenticado: {'sim' if diagnostics.get('wordpress_authenticated') else 'nao'}")
            print(f"marcadores WordPress: {', '.join(diagnostics.get('wordpress_markers_found') or []) or 'nenhum'}")
            print(f"marcadores plugins.php: {', '.join(diagnostics.get('plugins_markers_found') or []) or 'nenhum'}")
            print(f"motivo tecnico final: {diagnostics.get('technical_reason') or 'vazio'}")
            if diagnostics.get("dependency_install_command"):
                print(f"dependencia necessaria: {diagnostics.get('dependency_install_command')}")
        print(f"conclusao: {'sim' if preflight.get('completion_signal') else 'nao'}")
        inventory = preflight.get("plugin_inventory") or []
        if inventory:
            print("inventario dos plugins solicitados:")
            for plugin in inventory:
                print(f"- plugin: {plugin.get('plugin_name') or 'vazio'}")
                print(f"  encontrado: {'sim' if plugin.get('row_found') else 'nao'}")
                print(f"  instalado: {'sim' if plugin.get('installed') else 'nao'}")
                print(f"  ativo: {plugin.get('active') or 'incerto'}")
                print(f"  versao: {plugin.get('installed_version') or 'indisponivel'}")
                print(f"  acao disponivel: {plugin.get('available_action') or 'unknown'}")
                print(f"  alertas visiveis: {plugin.get('dependency_warning') or 'nenhum'}")
                print(f"  classificacao operacional: {plugin.get('activation_readiness') or 'vazio'}")
                print(f"  proxima acao: {plugin.get('next_action') or 'vazio'}")
        installation_plan = preflight.get("installation_plan") or []
        if installation_plan and preflight.get("debug_package_match"):
            print("plano de instalacao e ativacao:")
            for plan in installation_plan:
                print(f"- plugin: {plan.get('plugin_name') or 'vazio'}")
                print(f"  arquivo do pacote: {plan.get('package_basename') or 'vazio'}")
                print(f"  versao do pacote: {plan.get('package_version') or 'vazio'}")
                print(f"  slug do pacote: {plan.get('package_slug') or 'vazio'}")
                print(f"  pacote encontrado: {'sim' if plan.get('package_found') else 'nao'}")
                print(f"  hash validado: {'sim' if plan.get('package_hash_valid') else 'nao'}")
                print(f"  estado atual no WordPress: {plan.get('current_wordpress_state') or 'vazio'}")
                print(f"  acao planejada: {plan.get('planned_action') or 'vazio'}")
                print(f"  execucao realizada: {'sim' if plan.get('execution_performed') else 'nao'}")
                print(f"  aprovacao: {plan.get('approval_status') or 'vazio'}")
                print(f"  bloqueios: {', '.join(plan.get('blocking_reasons') or []) or 'nenhum'}")
                package_debug = plan.get("package_match_debug") or {}
                selected_debug = package_debug.get("selected") or {}
                if package_debug:
                    print("  debug de pacote:")
                    print(f"    basename: {selected_debug.get('package_basename') or 'vazio'}")
                    print(f"    Plugin Name: {selected_debug.get('plugin_name') or 'vazio'}")
                    print(f"    slug: {selected_debug.get('slug') or 'vazio'}")
                    print(f"    versao: {selected_debug.get('version') or 'vazio'}")
                    print(f"    status: {selected_debug.get('status') or 'vazio'}")
                    print(f"    motivo: {selected_debug.get('reason') or 'vazio'}")
            print(f"status geral do plano: {preflight.get('installation_plan_status') or 'vazio'}")
        execution_preparation = preflight.get("execution_preparation") or {}
        if execution_preparation:
            print("preparacao de execucao:")
            print(f"estado geral: {execution_preparation.get('overall_execution_state') or 'BLOCKED'}")
            print(f"instalacao executada: {'sim' if execution_preparation.get('installation_executed') else 'nao'}")
            print(f"ativacao executada: {'sim' if execution_preparation.get('activation_executed') else 'nao'}")
            print(f"rollback necessario: {'sim' if execution_preparation.get('rollback_needed') else 'nao'}")
            print(f"resultado final: {execution_preparation.get('final_result') or 'BLOCKED'}")
            print(f"proxima acao: {execution_preparation.get('next_action') or 'Bloquear e revisar validacoes'}")
            print(f"bloqueios: {', '.join(execution_preparation.get('blocking_reasons') or []) or 'nenhum'}")
            for plugin in execution_preparation.get("plugins") or []:
                print(f"- plugin: {plugin.get('plugin_name') or 'vazio'}")
                print(f"  pacote: {plugin.get('package_name') or 'vazio'}")
                print(f"  versao: {plugin.get('package_version') or 'vazio'}")
                print(f"  estado antes: {plugin.get('state_before') or 'BLOCKED'}")
                print(f"  instalacao executada: {'sim' if plugin.get('installation_executed') else 'nao'}")
                print(f"  ativacao executada: {'sim' if plugin.get('activation_executed') else 'nao'}")
                print(f"  estado depois: {plugin.get('state_after') or 'BLOCKED'}")
                print(f"  health checks: {', '.join(plugin.get('health_checks') or []) or 'nenhum'}")
                print(f"  rollback necessario: {'sim' if plugin.get('rollback_needed') else 'nao'}")
                print(f"  resultado final: {plugin.get('final_result') or 'BLOCKED'}")
                print(f"  proxima acao: {plugin.get('next_action') or 'Bloquear e revisar validacoes'}")
                print(f"  bloqueios: {', '.join(plugin.get('blocking_reasons') or []) or 'nenhum'}")
        print(f"informacoes faltantes: {', '.join(preflight.get('missing_information') or []) or 'nenhuma'}")
        if preflight.get("suggested_missing_data_reply"):
            print(f"resposta sugerida: {preflight.get('suggested_missing_data_reply')}")
        print(f"status geral: {preflight.get('overall_status') or preflight.get('classification') or 'vazio'}")
        print(f"classificacao final: {preflight.get('classification') or 'vazio'}")
        print(f"proxima acao: {preflight.get('next_action') or 'vazio'}")
        print(f"quantidade de mensagens analisadas: {preflight.get('message_count', 0)}")
        print(f"tipos de autor encontrados: {', '.join(preflight.get('author_types_found') or []) or 'nenhum'}")


def attach_installation_plans(preflight_by_key: Dict[str, Dict[str, Any]]) -> None:
    for preflight in preflight_by_key.values():
        plan = build_installation_plan(preflight)
        preflight["installation_plan"] = plan.get("plans", [])
        preflight["installation_plan_status"] = plan.get("overall_approval_status", "")
        plan_by_name = {_fold_text(item.get("plugin_name")): item for item in preflight["installation_plan"]}
        for plugin in preflight.get("plugin_inventory") or []:
            matched = plan_by_name.get(_fold_text(plugin.get("plugin_name")))
            if matched:
                plugin.update(matched)


def attach_execution_preparation(preflight_by_key: Dict[str, Dict[str, Any]]) -> None:
    for preflight in preflight_by_key.values():
        preparation = build_execution_preparation(preflight, preflight.get("installation_plan") or [])
        preflight["execution_preparation"] = preparation
        preflight["execution_preparation_status"] = preparation.get("overall_execution_state", "BLOCKED")


def build_markdown_report(
    analyses: Sequence[TicketAnalysis],
    summary: Dict[str, Any],
    metadata: Dict[str, Any],
    preflight_by_key: Dict[str, Dict[str, Any]] | None = None,
) -> str:
    preflight_by_key = preflight_by_key or {}
    lines: List[str] = []
    lines.append("# Relatorio Scanner WHMCS API Read-Only")
    lines.append("")
    lines.append(f"- Gerado em: {metadata['generated_at']}")
    lines.append(f"- Modo: {metadata['mode']}")
    lines.append(f"- Tickets retornados pela fila: {summary['returned']}")
    lines.append(f"- Tickets ativos analisados: {summary['active_analyzed']}")
    lines.append(f"- Candidatos abertos: {summary['opened']}")
    lines.append(f"- Ativacoes pendentes: {summary['pending_activation']}")
    lines.append(f"- Revisar manualmente: {summary['needs_review']}")
    lines.append(f"- Ignorados: {summary['ignored']}")
    lines.append(f"- Historicos fechados encontrados por engano: {summary['historical_returned']}")
    lines.append(f"- Acoes bloqueadas na API: {', '.join(metadata['blocked_actions'])}")
    lines.append("")
    sections = [
        ("## Prontos para pré-validação", "PRONTO PARA VALIDAÇÃO DA CONTA"),
        ("## Acesso WordPress validado", "ACESSO WORDPRESS VALIDADO"),
        ("## Revisar permissão do usuário temporário", "REVISAR PERMISSÃO DO USUÁRIO TEMPORÁRIO"),
        ("## Link temporário expirado", "LINK TEMPORÁRIO EXPIRADO"),
        ("## Revisar acesso à tela de plugins", "REVISAR ACESSO À TELA DE PLUGINS"),
        ("## Revisar validação do acesso", "REVISAR VALIDAÇÃO DO ACESSO"),
        ("## Acesso não reconhecido como WordPress", "ACESSO NÃO RECONHECIDO COMO WORDPRESS"),
        ("## Erro na validação do acesso", "ERRO NA VALIDAÇÃO DO ACESSO"),
        ("## Faltam dados", "FALTAM DADOS"),
        ("## Revisar link", "REVISAR LINK"),
        ("## Link expirado", "LINK EXPIRADO"),
        ("## Revisar tipo de solicitação", "REVISAR TIPO DE SOLICITAÇÃO"),
        ("## Concluídos ignorados", "IGNORAR_CONCLUIDO"),
    ]
    for section_title, classification in sections:
        rows = [
            item
            for item in analyses
            if preflight_by_key.get(ticket_key(item.to_dict()), {}).get("classification") == classification
        ]
        lines.append(section_title)
        lines.append("")
        if not rows:
            lines.append("- Nenhum ticket.")
            lines.append("")
            continue
        lines.append("| Ticket | Status | Departamento | Plugins | Dominio | Link | Tipo | Host | Status link | Faltantes | Proxima acao |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for item in rows:
            preflight = preflight_by_key.get(ticket_key(item.to_dict()), {})
            lines.append(
                "| {ticket} | {status} | {department} | {plugins} | {domain} | {link_present} | {link_type} | {link_host} | {link_status} | {missing} | {next_action} |".format(
                    ticket=item.ticket_num or item.ticket_id or "-",
                    status=item.status or "-",
                    department=item.department or "-",
                    plugins=", ".join(preflight.get("plugins_detected") or item.plugins_detectados) or "-",
                    domain=preflight.get("domain_detected") or "-",
                    link_present="sim" if preflight.get("wp_access_link_present") else "nao",
                    link_type=preflight.get("wp_access_link_type") or "-",
                    link_host=preflight.get("wp_access_link_host") or "-",
                    link_status=preflight.get("wp_access_link_status") or "-",
                    missing=", ".join(preflight.get("missing_information") or []) or "-",
                    next_action=preflight.get("next_action") or "-",
                )
            )
        lines.append("")

    inventory_rows: List[tuple[TicketAnalysis, Dict[str, Any]]] = []
    for item in analyses:
        preflight = preflight_by_key.get(ticket_key(item.to_dict()), {})
        for plugin in preflight.get("plugin_inventory") or []:
            inventory_rows.append((item, plugin))
    lines.append("## Inventário read-only dos plugins solicitados")
    lines.append("")
    if not inventory_rows:
        lines.append("- Nenhum inventário executado.")
        lines.append("")
    else:
        lines.append("| Ticket | Plugin | Slug | Instalado | Ativo | Versão | Ação disponível | Alerta | Classificação operacional | Próxima ação |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for item, plugin in inventory_rows:
            lines.append(
                "| {ticket} | {plugin} | {slug} | {installed} | {active} | {version} | {action} | {warning} | {readiness} | {next_action} |".format(
                    ticket=item.ticket_num or item.ticket_id or "-",
                    plugin=plugin.get("plugin_name") or "-",
                    slug=plugin.get("plugin_slug") or "-",
                    installed="sim" if plugin.get("installed") else "nao",
                    active=plugin.get("active") or "incerto",
                    version=plugin.get("installed_version") or "-",
                    action=plugin.get("available_action") or "unknown",
                    warning=plugin.get("dependency_warning") or "-",
                    readiness=plugin.get("activation_readiness") or "-",
                    next_action=plugin.get("next_action") or "-",
                )
            )
        lines.append("")

    plan_rows: List[tuple[TicketAnalysis, Dict[str, Any]]] = []
    for item in analyses:
        preflight = preflight_by_key.get(ticket_key(item.to_dict()), {})
        for plan in preflight.get("installation_plan") or []:
            plan_rows.append((item, plan))
    lines.append("## Plano de instalacao e ativacao")
    lines.append("")
    if not plan_rows:
        lines.append("- Nenhum plano preparado.")
        lines.append("")
    else:
        lines.append("| Ticket | Plugin | Pacote | Versao | Hash valido | Estado WP | Acao planejada | Aprovacao | Bloqueios | Execucao |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for item, plan in plan_rows:
            lines.append(
                "| {ticket} | {plugin} | {package} | {version} | {hash_valid} | {wp_state} | {action} | {approval} | {blocking} | {executed} |".format(
                    ticket=item.ticket_num or item.ticket_id or "-",
                    plugin=plan.get("plugin_name") or "-",
                    package=plan.get("package_basename") or "-",
                    version=plan.get("package_version") or "-",
                    hash_valid="sim" if plan.get("package_hash_valid") else "nao",
                    wp_state=plan.get("current_wordpress_state") or "-",
                    action=plan.get("planned_action") or "-",
                    approval=plan.get("approval_status") or "-",
                    blocking=", ".join(plan.get("blocking_reasons") or []) or "-",
                    executed="sim" if plan.get("execution_performed") else "nao",
                )
            )
        lines.append("")

    exec_rows: List[tuple[TicketAnalysis, Dict[str, Any]]] = []
    for item in analyses:
        preflight = preflight_by_key.get(ticket_key(item.to_dict()), {})
        preparation = preflight.get("execution_preparation") or {}
        for plugin in preparation.get("plugins") or []:
            exec_rows.append((item, plugin))
    lines.append("## Preparacao de execucao")
    lines.append("")
    if not exec_rows:
        lines.append("- Nenhuma preparacao de execucao.")
        lines.append("")
    else:
        lines.append("| Ticket | Plugin | Pacote | Estado antes | Instalada | Ativada | Estado depois | Health checks | Rollback | Resultado | Proxima acao |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for item, plugin in exec_rows:
            lines.append(
                "| {ticket} | {plugin_name} | {package} | {before} | {installed} | {activated} | {after} | {health} | {rollback} | {result} | {next_action} |".format(
                    ticket=item.ticket_num or item.ticket_id or "-",
                    plugin_name=plugin.get("plugin_name") or "-",
                    package=plugin.get("package_name") or "-",
                    before=plugin.get("state_before") or "-",
                    installed="sim" if plugin.get("installation_executed") else "nao",
                    activated="sim" if plugin.get("activation_executed") else "nao",
                    after=plugin.get("state_after") or "-",
                    health=", ".join(plugin.get("health_checks") or []) or "-",
                    rollback="sim" if plugin.get("rollback_needed") else "nao",
                    result=plugin.get("final_result") or "-",
                    next_action=plugin.get("next_action") or "-",
                )
            )
        lines.append("")

    lines.append("## Tickets")
    lines.append("")
    lines.append("| Ticket | Numero | Status | Departamento | Assunto | Plugins | Decisao | Prioridade | Motivo | Fonte |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
    for item in analyses:
        lines.append(
            "| {ticket} | {ticket_num} | {status} | {department} | {subject} | {plugins} | {decision} | {priority} | {reason} | {source} |".format(
                ticket=item.ticket_id or "-",
                ticket_num=item.ticket_num or "-",
                status=item.status or "-",
                department=item.department or "-",
                subject=item.subject_final or item.subject or "-",
                plugins=", ".join(item.plugins_detectados) or "-",
                decision=item.classification,
                priority=item.priority,
                reason=item.classification_reason,
                source=item.source,
            )
        )
    lines.append("")
    lines.append("## Garantias")
    lines.append("")
    lines.append("- Nenhuma acao de escrita foi executada no WHMCS.")
    lines.append("- Apenas GetTickets e GetTicket foram permitidos.")
    lines.append("- Nenhum token ou segredo foi impresso.")
    return "\n".join(lines) + "\n"


def write_reports(report_dir: Path, stamp: str, analyses: Sequence[TicketAnalysis], summary: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Path]:
    ensure_report_dir(report_dir)
    base_name = f"whmcs-api-readonly-scanner-{stamp}"
    md_path = report_dir / f"{base_name}.md"
    json_path = report_dir / f"{base_name}.json"
    csv_path = report_dir / f"{base_name}.csv"
    redact_emails = bool(metadata.get("redact_emails"))
    output_analyses = [sanitize_analysis_for_report(item, redact_emails) for item in analyses]

    preflight_by_key = metadata.get("preflight_by_key") or {}
    md_path.write_text(build_markdown_report(output_analyses, summary, metadata, preflight_by_key), encoding="utf-8")

    json_payload = {
        "metadata": {key: value for key, value in metadata.items() if key != "preflight_by_key"},
        "summary": summary,
        "tickets": [ticket_report_payload(item, preflight_by_key.get(ticket_key(item.to_dict()), {})) for item in output_analyses],
    }
    json_path.write_text(json.dumps(json_payload, ensure_ascii=False, indent=2), encoding="utf-8")

    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "ticket_id",
                "ticket_num",
                "status",
                "department",
                "subject",
                "subject_final",
                "plugin",
                "plugin_slug",
                "plugins_detectados",
                "requested_plugins",
                "plugin_inventory",
                "installation_plan",
                "installation_plan_status",
                "execution_preparation",
                "execution_preparation_status",
                "domain_detected",
                "service_resolution_status",
                "service_resolution_reason",
                "customer_authorization",
                "completion_signal",
                "missing_information",
                "preflight_classification",
                "overall_status",
                "next_action",
                "suggested_missing_data_reply",
                "wp_access_link_present",
                "wp_access_link_type",
                "wp_access_link_host",
                "wp_access_link_matches_domain",
                "wp_access_validation_executed",
                "wp_access_link_status",
                "wp_admin_accessible",
                "plugins_page_accessible",
                "wp_access_validation_reason",
                "wp_access_diagnostics",
                "wp_access_validator",
                "domain",
                "activation_requested",
                "authorization_detected",
                "completion_detected",
                "wordpress_context",
                "decision",
                "classification",
                "priority",
                "classification_reason",
                "score",
                "signals",
                "fields_used",
                "blocked_actions",
                "is_candidate",
                "source",
                "debug_fields",
            ],
            extrasaction="ignore",
        )
        writer.writeheader()
        for item in output_analyses:
            preflight = preflight_by_key.get(ticket_key(item.to_dict()), {})
            row = ticket_report_payload(item, preflight)
            row["signals"] = " | ".join(item.signals)
            row["plugins_detectados"] = " | ".join(row.get("plugins_detectados") or [])
            row["requested_plugins"] = " | ".join(row.get("requested_plugins") or [])
            row["plugin_inventory"] = json.dumps(row.get("plugin_inventory") or [], ensure_ascii=False, sort_keys=True)
            row["installation_plan"] = json.dumps(row.get("installation_plan") or [], ensure_ascii=False, sort_keys=True)
            row["installation_plan_status"] = row.get("installation_plan_status") or ""
            row["execution_preparation"] = json.dumps(row.get("execution_preparation") or {}, ensure_ascii=False, sort_keys=True)
            row["execution_preparation_status"] = row.get("execution_preparation_status") or ""
            row["missing_information"] = " | ".join(row.get("missing_information") or [])
            row["wp_access_diagnostics"] = json.dumps(row.get("wp_access_diagnostics") or {}, ensure_ascii=False, sort_keys=True)
            row["fields_used"] = json.dumps(item.fields_used, ensure_ascii=False, sort_keys=True)
            row["debug_fields"] = json.dumps(item.debug_fields, ensure_ascii=False, sort_keys=True)
            row["blocked_actions"] = " | ".join(item.blocked_actions)
            writer.writerow(row)

    return {"markdown": md_path, "json": json_path, "csv": csv_path}


def write_failure_reports(
    report_dir: Path,
    stamp: str,
    metadata: Dict[str, Any],
    error_message: str,
) -> Dict[str, Path]:
    ensure_report_dir(report_dir)
    base_name = f"whmcs-api-readonly-scanner-{stamp}"
    md_path = report_dir / f"{base_name}.md"
    json_path = report_dir / f"{base_name}.json"
    csv_path = report_dir / f"{base_name}.csv"

    md_lines = [
        "# Relatorio Scanner WHMCS API Read-Only",
        "",
        f"- Gerado em: {metadata['generated_at']}",
        f"- Modo: {metadata['mode']}",
        f"- Erro: {error_message}",
        "",
        "## Garantias",
        "",
        "- Nenhuma acao de escrita foi executada no WHMCS.",
        "- Nenhum token ou segredo foi impresso.",
    ]
    md_path.write_text("\n".join(md_lines) + "\n", encoding="utf-8")

    json_payload = {
        "metadata": metadata,
        "summary": {
            "listed": 0,
            "returned": 0,
            "active_analyzed": 0,
            "opened": 0,
            "pending_activation": 0,
            "needs_review": 0,
            "ignored": 0,
            "historical_returned": 0,
        },
        "error": error_message,
        "tickets": [],
    }
    json_path.write_text(json.dumps(json_payload, ensure_ascii=False, indent=2), encoding="utf-8")

    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "ticket_id",
                "ticket_num",
                "status",
                "department",
                "subject",
                "subject_final",
                "plugin",
                "plugin_slug",
                "plugins_detectados",
                "requested_plugins",
                "plugin_inventory",
                "domain_detected",
                "customer_authorization",
                "completion_signal",
                "missing_information",
                "preflight_classification",
                "next_action",
                "wp_access_link_present",
                "wp_access_link_type",
                "wp_access_link_host",
                "wp_access_link_matches_domain",
                "wp_access_validation_executed",
                "wp_access_link_status",
                "wp_admin_accessible",
                "plugins_page_accessible",
                "wp_access_validation_reason",
                "domain",
                "activation_requested",
                "authorization_detected",
                "completion_detected",
                "wordpress_context",
                "decision",
                "classification",
                "priority",
                "classification_reason",
                "score",
                "signals",
                "fields_used",
                "blocked_actions",
                "is_candidate",
                "source",
                "debug_fields",
            ],
            extrasaction="ignore",
        )
        writer.writeheader()

    return {"markdown": md_path, "json": json_path, "csv": csv_path}


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scanner WHMCS API read-only.")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG_PATH), help="Caminho para o config.example.json.")
    parser.add_argument("--env-path", default=None, help="Caminho para o .env externo.")
    parser.add_argument("--whmcs-provider", choices=["browser-ui", "remote-api", "mock"], default="browser-ui", help="Fonte de dados WHMCS. Padrao: browser-ui.")
    parser.add_argument("--browser-session", choices=["interactive", "persistent"], default="interactive", help="Modo de sessao do provider browser-ui.")
    parser.add_argument("--browser-login-timeout", type=int, default=300, help="Timeout em segundos para login manual no browser-ui.")
    parser.add_argument("--browser-bootstrap-timeout", type=int, default=900, help="Timeout em segundos para o bootstrap manual persistente.")
    parser.add_argument("--browser-bootstrap-login", action="store_true", help="Abre o navegador e aguarda login manual para preparar o perfil persistente.")
    parser.add_argument("--browser-bootstrap-manual-confirm", action="store_true", help="Pausa no terminal ate o operador confirmar com ENTER que concluiu o login manual.")
    parser.add_argument("--mock", action="store_true", help="Usa payload local de mock em vez da API.")
    parser.add_argument("--dry-run", action="store_true", help="Executa leitura real em modo somente leitura.")
    parser.add_argument("--diagnose", action="store_true", help="Executa validacao segura da API sem alterar nada.")
    parser.add_argument("--from-html", dest="from_html", default=None, help="Ler candidatos a partir de um HTML salvo localmente.")
    parser.add_argument("--queue", choices=sorted(QUEUE_STATUS_MAP.keys()), default=None, help="Fila operacional WHMCS a consultar.")
    parser.add_argument("--status", default=None, help="Status WHMCS explicito para GetTickets.")
    parser.add_argument("--subject", default=None, help="Filtro opcional de assunto para GetTickets.")
    parser.add_argument("--ticket", default=None, help="Restringe processamento/validacao a um TID especifico.")
    parser.add_argument("--limitstart", type=int, default=0, help="Offset inicial para GetTickets.")
    parser.add_argument("--debug-titles", action="store_true", help="Mostra campos seguros de titulo retornados pelo WHMCS.")
    parser.add_argument("--debug-safe", action="store_true", help="Alias seguro para --debug-titles.")
    parser.add_argument("--debug-request", action="store_true", help="Mostra parametros seguros enviados ao GetTickets.")
    parser.add_argument("--debug-ticket-fetch", action="store_true", help="Mostra metadados seguros da consulta GetTicket.")
    parser.add_argument("--debug-service-resolution", action="store_true", help="Mostra a resolucao segura de servico/domino via GetClientsProducts.")
    parser.add_argument("--debug-preflight", action="store_true", help="Mostra indicadores seguros da pre-validacao.")
    parser.add_argument("--debug-package-match", action="store_true", help="Mostra correspondencia segura dos pacotes locais/registrados.")
    parser.add_argument("--debug-browser-ui", action="store_true", help="Mostra indicadores seguros da leitura via interface do WHMCS.")
    parser.add_argument("--debug-browser-dom", action="store_true", help="Mostra indicadores seguros do DOM da fila WHMCS no provider browser-ui.")
    parser.add_argument("--debug-browser-flow", action="store_true", help="Mostra o fluxo seguro de leitura e abertura no provider browser-ui.")
    parser.add_argument("--validate-wp-access", action="store_true", help="Valida explicitamente link temporario WordPress em modo leitura.")
    parser.add_argument("--wp-validator", choices=["browser", "http"], default="browser", help="Motor de validacao WordPress. Padrao: browser.")
    parser.add_argument("--inspect-requested-plugins", action="store_true", help="Inventaria plugins solicitados na tela plugins.php sem executar acoes.")
    parser.add_argument("--prepare-installation-plan", action="store_true", help="Monta um plano read-only de instalacao/ativacao para aprovacao humana.")
    parser.add_argument("--prepare-execution", action="store_true", help="Refaz validacoes e prepara o envelope de execucao sem instalar nada.")
    parser.add_argument("--prepare-missing-data-reply", action="store_true", help="Gera uma resposta sugerida localmente para solicitar dados faltantes.")
    parser.add_argument("--execute-installation-plan", action="store_true", help="Habilita o caminho de execucao controlada futura.")
    parser.add_argument("--apply", action="store_true", help="Confirma que uma execucao controlada pode ser aplicada.")
    parser.add_argument("--confirm", default="", help="Confirmacao exata exigida para aplicar uma execucao.")
    parser.add_argument("--debug-plugin-table", action="store_true", help="Mostra linhas seguras da tabela de plugins.")
    parser.add_argument("--show-ignored", action="store_true", help="Inclui tickets ignorados no relatorio e resumo.")
    parser.add_argument("--limit", type=int, default=30, help="Limite de tickets candidatos para abrir com GetTicket.")
    parser.add_argument("--save-report", action="store_true", help="Salva relatórios em Markdown, JSON e CSV.")
    return parser


def _as_summary(analyses: Sequence[TicketAnalysis]) -> Dict[str, Any]:
    return {
        "listed": len(analyses),
        "returned": len(analyses),
        "active_analyzed": sum(1 for item in analyses if not is_historical_status(item.status)),
        "opened": sum(1 for item in analyses if item.source == "detail"),
        "pending_activation": sum(1 for item in analyses if item.decision == "pending_activation"),
        "needs_review": sum(1 for item in analyses if item.decision == "needs_review"),
        "ignored": sum(1 for item in analyses if item.decision == "ignored"),
        "historical_returned": sum(1 for item in analyses if is_historical_status(item.status)),
    }


def _print_summary(summary: Dict[str, Any], metadata: Dict[str, Any], report_paths: Dict[str, Path] | None) -> None:
    print(f"Modo: {metadata['mode']}")
    print(f"Provider WHMCS: {metadata.get('whmcs_provider') or 'whmcs_api'}")
    if metadata.get("whmcs_provider") == "browser-ui":
        print("API WHMCS chamada: nao")
        print("Interface modificada: nao")
        print("Tickets alterados: nenhum")
        if metadata.get("browser_ui_status"):
            print(f"Status tecnico browser-ui: {metadata.get('browser_ui_status')}")
        if metadata.get("browser_ui_reason"):
            print(f"Motivo browser-ui: {metadata.get('browser_ui_reason')}")
    else:
        print("Acoes permitidas: GetTickets, GetTicket, GetClientsProducts")
        print("Acoes bloqueadas: AddTicketReply, UpdateTicket, CloseTicket, DeleteTicket, AddTicketNote")
        print("Credenciais: validacao executada sem imprimir valores")
        print("Alteracoes remotas: nenhuma")
        print("Plugins ativados: nenhum")
    print(f"Tickets retornados pela fila: {summary['returned']}")
    print(f"Tickets ativos analisados: {summary['active_analyzed']}")
    print(f"Candidatos abertos: {summary['opened']}")
    print(f"Ativacoes pendentes: {summary['pending_activation']}")
    print(f"Revisar manualmente: {summary['needs_review']}")
    print(f"Ignorados: {summary['ignored']}")
    print(f"Historicos fechados encontrados por engano: {summary['historical_returned']}")
    if report_paths:
        print(f"Relatorio Markdown: {report_paths['markdown']}")
        print(f"Relatorio JSON: {report_paths['json']}")
        print(f"Relatorio CSV: {report_paths['csv']}")


def run_diagnose(config: Dict[str, Any], api_config: Dict[str, Any], env_path: Path) -> int:
    print("Diagnostico WHMCS API read-only")
    print(f".env externo encontrado: {'sim' if env_path.exists() else 'nao'}")

    if not env_path.exists():
        print("Falha: o .env externo nao existe.")
        return 2

    url_key = api_config.get("url_key", "WHMCS_API_URL")
    identifier_key = api_config.get("identifier_key", "WHMCS_API_IDENTIFIER")
    secret_key = api_config.get("secret_key", "WHMCS_API_SECRET")
    access_key_key = api_config.get("access_key_key", "WHMCS_API_ACCESS_KEY")
    env_values = load_env_file(env_path)

    print(f"WHMCS_API_URL: {configured_label(env_values.get(url_key))}")
    print(f"WHMCS_API_IDENTIFIER: {configured_label(env_values.get(identifier_key))}")
    print(f"WHMCS_API_SECRET: {configured_label(env_values.get(secret_key))}")
    print(f"WHMCS_API_ACCESS_KEY: {configured_label(env_values.get(access_key_key))}")

    try:
        values = load_credentials(
            env_path,
            {
                "url_key": url_key,
                "identifier_key": identifier_key,
                "secret_key": secret_key,
                "access_key_key": access_key_key,
            },
        )
    except Exception as exc:
        print(f"Falha na validacao do .env: {exc}")
        return 2

    parsed_endpoint = urlparse(values.url)
    print(f"Endpoint host: {parsed_endpoint.netloc or 'nao configurado'}")
    print("Metodo usado: POST")
    print("Headers seguros aplicados: sim")

    allowed_actions = list(api_config.get("allowed_actions", ["GetTickets", "GetTicket", "GetClientsProducts"]))
    if "GetClientsProducts" not in allowed_actions:
        allowed_actions.append("GetClientsProducts")
    blocked_actions = list(api_config.get("blocked_actions", [
        "AddTicketReply",
        "UpdateTicket",
        "CloseTicket",
        "DeleteTicket",
        "AddTicketNote",
    ]))
    print("Acoes permitidas: " + ", ".join(allowed_actions))
    print("Acoes bloqueadas: " + ", ".join(blocked_actions))

    try:
        public_ip = fetch_public_ip()
        if public_ip:
            print(f"IP publico atual: {public_ip}")
        else:
            print("IP publico atual: indisponivel")
    except Exception:
        print("IP publico atual: indisponivel")

    client = WHMCSApiClient(
        credentials=values,
        allowed_actions=allowed_actions,
        timeout_seconds=int(api_config.get("timeout_seconds", 30)),
    )

    try:
        client.probe_tickets(limit=1)
        print("Teste GetTickets limitnum=1: sucesso")
        return 0
    except HTTPError as exc:
        if exc.code == 403:
            print("Teste GetTickets limitnum=1: HTTP 403 Forbidden")
            print_forbidden_next_steps()
            return 2
        print(f"Teste GetTickets limitnum=1: HTTP {exc.code}")
        return 2
    except URLError as exc:
        print(f"Teste GetTickets limitnum=1: erro de rede - {exc.reason}")
        return 2
    except Exception as exc:
        print(f"Teste GetTickets limitnum=1: falha - {exc.__class__.__name__}")
        return 2


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_argument_parser()
    args = parser.parse_args(argv)
    if args.inspect_requested_plugins:
        if not args.ticket:
            parser.error("--inspect-requested-plugins exige --ticket")
    if args.debug_plugin_table and not args.inspect_requested_plugins:
        parser.error("--debug-plugin-table exige --inspect-requested-plugins")
    if args.browser_bootstrap_login:
        if args.whmcs_provider != "browser-ui":
            parser.error("--browser-bootstrap-login exige --whmcs-provider browser-ui")
        if args.browser_session != "persistent":
            parser.error("--browser-bootstrap-login exige --browser-session persistent")
    if args.prepare_installation_plan:
        if not args.dry_run:
            parser.error("--prepare-installation-plan exige --dry-run")
        if not args.ticket:
            parser.error("--prepare-installation-plan exige --ticket")
    if args.prepare_execution:
        if not args.dry_run:
            parser.error("--prepare-execution exige --dry-run")
        if not args.ticket:
            parser.error("--prepare-execution exige --ticket")
    if args.prepare_missing_data_reply and not args.ticket:
        parser.error("--prepare-missing-data-reply exige --ticket")
    if args.execute_installation_plan:
        if not args.apply:
            parser.error("--execute-installation-plan exige --apply")
        if not args.ticket:
            parser.error("--execute-installation-plan exige --ticket")
        expected_confirm = f"EXECUTAR {args.ticket}"
        if args.confirm != expected_confirm:
            parser.error(f"--execute-installation-plan exige --confirm \"{expected_confirm}\"")

    config = load_config(Path(args.config))
    rules = load_rules(config)
    whitelist = load_whitelist()
    plugin_aliases = load_plugin_aliases(config)
    env_path = Path(args.env_path or config.get("env_path") or DEFAULT_ENV_PATH)

    api_config = config.get("api", {})
    if not isinstance(api_config, dict):
        raise RuntimeError("Configuracao da API invalida.")

    if args.diagnose:
        return run_diagnose(config, api_config, env_path)

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    report_dir = BASE_DIR / (config.get("report_dir") or "reports")
    mock_path = (BASE_DIR / config.get("mock_payload")).resolve() if config.get("mock_payload") else (PROJECT_DIR / "payloads" / "whmcs_tickets_sample.json")
    mode = "mock" if args.mock else "dry-run" if args.dry_run else "read-only"
    metadata = {
        "generated_at": stamp,
        "mode": mode,
        "api_actions": ["GetTickets", "GetTicket", "GetClientsProducts"],
        "whmcs_provider": args.whmcs_provider,
        "blocked_actions": [
            "AddTicketReply",
            "UpdateTicket",
            "CloseTicket",
            "DeleteTicket",
            "AddTicketNote",
        ],
        "source": "mock" if args.mock else "browser-ui" if args.whmcs_provider == "browser-ui" else "whmcs_api",
        "redact_emails": bool(args.from_html),
        "wp_validator": args.wp_validator,
        "inspect_requested_plugins": bool(args.inspect_requested_plugins),
        "debug_plugin_table": bool(args.debug_plugin_table),
        "browser_session": args.browser_session,
        "browser_bootstrap_timeout": int(args.browser_bootstrap_timeout),
        "browser_bootstrap_manual_confirm": bool(args.browser_bootstrap_manual_confirm),
        "browser_bootstrap_login": bool(args.browser_bootstrap_login),
        "prepare_installation_plan": bool(args.prepare_installation_plan),
        "prepare_execution": bool(args.prepare_execution),
        "execute_installation_plan": bool(args.execute_installation_plan),
        "apply": bool(args.apply),
    }

    debug_titles = bool(args.debug_titles or args.debug_safe)
    getticket_called: Dict[str, bool] = {}
    request_debug: Dict[str, Any] = {}
    preflight_by_key: Dict[str, Dict[str, Any]] = {}
    ticket_fetch_debug: Dict[str, Any] = {}
    browser_ui_read_incomplete = False

    if args.mock:
        raw_source_tickets = read_mock_tickets(mock_path)
        source_tickets = normalize_whmcs_tickets(raw_source_tickets)
        source_tickets = filter_tickets_by_tid(source_tickets, args.ticket)
        details_lookup = {}
        for ticket in source_tickets:
            key = ticket_key(ticket)
            if not key:
                continue
            detail = normalize_whmcs_ticket_detail(
                ticket,
                ticket,
                whitelist,
                rules,
                whmcs_client=None,
                validate_wp_access=False,
                wp_validator=args.wp_validator,
                inspect_requested_plugins=args.inspect_requested_plugins,
                debug_plugin_table=args.debug_plugin_table,
                debug_package_match=args.debug_package_match,
                debug_service_resolution=args.debug_service_resolution,
                prepare_missing_data_reply=args.prepare_missing_data_reply,
                plugin_aliases=plugin_aliases,
            )
            details_lookup[key] = detail
            if detail.get("preflight"):
                preflight_by_key[key] = detail["preflight"]
    elif args.whmcs_provider == "browser-ui":
        requested_status = resolve_requested_status(args)
        browser_provider = WHMCSBrowserUIProvider(
            browser_session=args.browser_session,
            profile_dir=Path(config.get("browser_profile_dir") or str(DEFAULT_PROFILE_DIR)),
            login_timeout_seconds=int(args.browser_login_timeout),
            debug_browser_ui=bool(args.debug_browser_ui),
        )
        try:
            if args.browser_bootstrap_login:
                try:
                    bootstrap_result = browser_provider.bootstrap_login(
                        manual_confirm=bool(args.browser_bootstrap_manual_confirm),
                        timeout_seconds=int(args.browser_bootstrap_timeout),
                    )
                except RuntimeError as exc:
                    message = str(exc)
                    if "SESSION_EXPIRED" in message:
                        print("Tempo de autenticacao encerrado. A sessao parcial foi mantida no perfil dedicado.")
                        return 2
                    raise
                metadata["browser_ui_debug"] = {
                    "browser_started": True,
                    "logged_in": bootstrap_result.get("whmcs_authenticated", False),
                    "current_page": "https://painel.staycloud.com.br/gestor/supporttickets.php",
                    "visible_tickets": 0,
                    "candidates": [],
                    "persistent_profile_configured": True,
                }
                print("Bootstrap concluido.")
                print(f"Cloudflare Access autenticado: {'sim' if bootstrap_result.get('cloudflare_access_authenticated') else 'nao'}")
                print(f"WHMCS autenticado: {'sim' if bootstrap_result.get('whmcs_authenticated') else 'nao'}")
                print(f"Perfil persistente preparado: {'sim' if bootstrap_result.get('profile_persistent_prepared') else 'nao'}")
                return 0
            raw_source_tickets = browser_provider.list_tickets(
                status=requested_status,
                limit=max(1, args.limit),
                limitstart=max(0, args.limitstart),
                subject=args.subject,
            )
            source_tickets = normalize_whmcs_tickets(raw_source_tickets)
            source_tickets = filter_tickets_by_tid(source_tickets, args.ticket)
            details_lookup = {}
            for ticket in source_tickets:
                key = ticket_key(ticket)
                if not key:
                    continue
                raw_detail = browser_provider.get_ticket(key)
                detail = normalize_whmcs_ticket_detail(
                    raw_detail,
                    ticket,
                    whitelist,
                    rules,
                    whmcs_client=None,
                    validate_wp_access=args.validate_wp_access,
                    wp_validator=args.wp_validator,
                    inspect_requested_plugins=args.inspect_requested_plugins,
                    debug_plugin_table=args.debug_plugin_table,
                    debug_package_match=args.debug_package_match,
                    debug_service_resolution=args.debug_service_resolution,
                    prepare_missing_data_reply=args.prepare_missing_data_reply,
                    plugin_aliases=plugin_aliases,
                )
                details_lookup[key] = detail
                if detail.get("preflight"):
                    preflight_by_key[key] = detail["preflight"]
            requested_ticket_found_in_index = False
            if args.ticket:
                requested_key = _text_value(args.ticket)
                requested_ticket_found_in_index = any(ticket_key(ticket) == requested_key for ticket in source_tickets)
                if not requested_ticket_found_in_index:
                    try:
                        resolved_detail = browser_provider.get_ticket(args.ticket)
                    except RuntimeError as exc:
                        if "TICKET_NOT_FOUND_IN_UI" in str(exc):
                            print(f"Ticket {args.ticket} nao foi encontrado pela interface atual.")
                            source_tickets = []
                            details_lookup = {}
                            browser_ui_read_incomplete = True
                        else:
                            raise
                    else:
                        requested_summary = normalize_whmcs_ticket_summary(resolved_detail)
                        if not requested_summary.get("ticket_num") and args.ticket:
                            requested_summary["ticket_num"] = args.ticket
                        if not requested_summary.get("ticket_id") and args.ticket:
                            requested_summary["ticket_id"] = _text_value(
                                resolved_detail.get("ticketid")
                                or resolved_detail.get("ticket_id")
                                or requested_summary.get("ticket_id")
                                or args.ticket
                            )
                        live_detail = normalize_whmcs_ticket_detail(
                            resolved_detail,
                            requested_summary,
                            whitelist,
                            rules,
                            whmcs_client=None,
                            validate_wp_access=args.validate_wp_access,
                            wp_validator=args.wp_validator,
                            inspect_requested_plugins=args.inspect_requested_plugins,
                            debug_plugin_table=args.debug_plugin_table,
                            debug_package_match=args.debug_package_match,
                            debug_service_resolution=args.debug_service_resolution,
                            prepare_missing_data_reply=args.prepare_missing_data_reply,
                            plugin_aliases=plugin_aliases,
                        )
                        source_tickets = [requested_summary]
                        requested_key = ticket_key(requested_summary)
                        if requested_key:
                            details_lookup[requested_key] = live_detail
                            if live_detail.get("preflight"):
                                preflight_by_key[requested_key] = live_detail["preflight"]
                            getticket_called[requested_key] = True
            request_debug = {
                "provider": "browser-ui",
                "status": requested_status,
                "limitstart": max(0, args.limitstart),
                "limitnum": max(1, args.limit),
                "totalresults": len(raw_source_tickets),
            }
            metadata["gettickets_request"] = request_debug
            metadata["browser_ui_debug"] = browser_provider.debug_snapshot(status=requested_status, limit=max(1, args.limit))
            metadata["browser_ui_debug"]["persistent_profile_configured"] = args.browser_session == "persistent"
            metadata["browser_ui_debug"]["requested_ticket"] = _text_value(args.ticket)
            metadata["browser_ui_debug"]["requested_ticket_found_in_index"] = requested_ticket_found_in_index if args.ticket else False
            metadata["browser_ui_status"] = metadata["browser_ui_debug"].get("browser_ui_status", "")
            metadata["browser_ui_reason"] = metadata["browser_ui_debug"].get("browser_ui_reason", "")
            metadata["browser_ui_debug"]["loop_detected"] = browser_provider._loop_detected
            metadata["browser_ui_debug"].setdefault("opened_candidate", bool(source_tickets))
            metadata["browser_ui_debug"].setdefault("open_origin", "cache/href" if source_tickets else "vazio")
            metadata["browser_ui_debug"].setdefault("returned_to_list", bool(source_tickets))
            browser_ui_read_incomplete = not source_tickets and not details_lookup
        finally:
            browser_provider.close()
    elif args.from_html:
        html_path = Path(args.from_html)
        if not html_path.exists():
            print(f"Falha: arquivo HTML nao encontrado: {html_path}")
            return 2
        raw_source_tickets = read_html_tickets(html_path)
        source_tickets = normalize_whmcs_tickets(raw_source_tickets)
        source_tickets = filter_tickets_by_tid(source_tickets, args.ticket)
        details_lookup = {}
        for ticket in source_tickets:
            key = ticket_key(ticket)
            if not key:
                continue
            detail = normalize_whmcs_ticket_detail(
                ticket,
                ticket,
                whitelist,
                rules,
                whmcs_client=None,
                validate_wp_access=False,
                wp_validator=args.wp_validator,
                inspect_requested_plugins=args.inspect_requested_plugins,
                debug_plugin_table=args.debug_plugin_table,
                debug_package_match=args.debug_package_match,
                debug_service_resolution=args.debug_service_resolution,
                prepare_missing_data_reply=args.prepare_missing_data_reply,
                plugin_aliases=plugin_aliases,
            )
            details_lookup[key] = detail
            if detail.get("preflight"):
                preflight_by_key[key] = detail["preflight"]
        metadata["source"] = "html"
        mode = "html"
    else:
        try:
            credentials = load_credentials(
                env_path,
                {
                    "url_key": api_config.get("url_key", "WHMCS_API_URL"),
                    "identifier_key": api_config.get("identifier_key", "WHMCS_API_IDENTIFIER"),
                    "secret_key": api_config.get("secret_key", "WHMCS_API_SECRET"),
                    "access_key_key": api_config.get("access_key_key", "WHMCS_API_ACCESS_KEY"),
                },
            )
            allowed_actions = list(api_config.get("allowed_actions", ["GetTickets", "GetTicket", "GetClientsProducts"]))
            if "GetClientsProducts" not in allowed_actions:
                allowed_actions.append("GetClientsProducts")
            client = WHMCSApiClient(
                credentials=credentials,
                allowed_actions=allowed_actions,
                timeout_seconds=int(api_config.get("timeout_seconds", 30)),
            )
            requested_status = resolve_requested_status(args)
            page = client.get_tickets_page(
                status=requested_status,
                limitstart=max(0, args.limitstart),
                limitnum=max(1, args.limit),
                subject=args.subject,
            )
            raw_source_tickets = page["tickets"]
            request_debug = {
                "params": page["params"],
                "totalresults": page["totalresults"],
            }
            metadata["gettickets_request"] = request_debug
            source_tickets = normalize_whmcs_tickets(raw_source_tickets)
            source_tickets = filter_tickets_by_tid(source_tickets, args.ticket)
            details_lookup = {}
            if args.prepare_execution and args.ticket:
                resolved_detail, ticket_fetch_debug, _resolution_meta = resolve_and_fetch_ticket(
                    client,
                    args.ticket,
                    requested_status=requested_status,
                    debug_ticket_fetch=args.debug_ticket_fetch,
                )
                requested_summary = normalize_whmcs_ticket_summary(resolved_detail)
                if not requested_summary.get("ticket_num") and args.ticket:
                    requested_summary["ticket_num"] = args.ticket
                if not requested_summary.get("ticket_id") and args.ticket:
                    requested_summary["ticket_id"] = _text_value(resolved_detail.get("ticketid") or resolved_detail.get("ticket_id") or requested_summary.get("ticket_id") or args.ticket)
                live_detail = normalize_whmcs_ticket_detail(
                    resolved_detail,
                    requested_summary,
                    whitelist,
                    rules,
                    whmcs_client=client,
                    validate_wp_access=args.validate_wp_access,
                    wp_validator=args.wp_validator,
                    inspect_requested_plugins=args.inspect_requested_plugins,
                    debug_plugin_table=args.debug_plugin_table,
                    debug_package_match=args.debug_package_match,
                    debug_service_resolution=args.debug_service_resolution,
                    prepare_missing_data_reply=args.prepare_missing_data_reply,
                    plugin_aliases=plugin_aliases,
                )
                source_tickets = [requested_summary]
                requested_key = ticket_key(requested_summary)
                if requested_key:
                    details_lookup[requested_key] = live_detail
                    if live_detail.get("preflight"):
                        preflight_by_key[requested_key] = live_detail["preflight"]
                    getticket_called[requested_key] = True
            elif args.ticket and (
                not source_tickets
                or args.debug_ticket_fetch
                or args.debug_service_resolution
                or args.debug_preflight
                or args.inspect_requested_plugins
                or args.validate_wp_access
                or args.prepare_installation_plan
            ):
                resolved_detail, ticket_fetch_debug, _resolution_meta = resolve_and_fetch_ticket(
                    client,
                    args.ticket,
                    requested_status=requested_status,
                    debug_ticket_fetch=args.debug_ticket_fetch,
                )
                requested_summary = normalize_whmcs_ticket_summary(resolved_detail)
                if not requested_summary.get("ticket_num") and args.ticket:
                    requested_summary["ticket_num"] = args.ticket
                if not requested_summary.get("ticket_id") and args.ticket:
                    requested_summary["ticket_id"] = _text_value(resolved_detail.get("ticketid") or resolved_detail.get("ticket_id") or requested_summary.get("ticket_id") or args.ticket)
                live_detail = normalize_whmcs_ticket_detail(
                    resolved_detail,
                    requested_summary,
                    whitelist,
                    rules,
                    whmcs_client=client,
                    validate_wp_access=args.validate_wp_access,
                    wp_validator=args.wp_validator,
                    inspect_requested_plugins=args.inspect_requested_plugins,
                    debug_plugin_table=args.debug_plugin_table,
                    debug_package_match=args.debug_package_match,
                    debug_service_resolution=args.debug_service_resolution,
                    prepare_missing_data_reply=args.prepare_missing_data_reply,
                    plugin_aliases=plugin_aliases,
                )
                source_tickets = [requested_summary]
                requested_key = ticket_key(requested_summary)
                if requested_key:
                    details_lookup[requested_key] = live_detail
                    if live_detail.get("preflight"):
                        preflight_by_key[requested_key] = live_detail["preflight"]
                    getticket_called[requested_key] = True
            if args.debug_request:
                print_debug_request(page["params"], page["totalresults"])
                print_queue_tickets(source_tickets)
            if args.debug_ticket_fetch and ticket_fetch_debug:
                print_debug_ticket_fetch(ticket_fetch_debug)
            summary_analyses = analyze_tickets(source_tickets, {}, whitelist, rules)
            deep_candidates = [
                ticket
                for ticket, analysis in zip(source_tickets, summary_analyses)
                if has_deep_lookup_signal(ticket, analysis) and not is_historical_status(ticket.get("status"))
            ]
            for ticket in deep_candidates:
                ticket_id = normalize_ticket_id(ticket)
                key = ticket_key(ticket)
                if ticket_id:
                    if key in details_lookup:
                        continue
                    getticket_called[key] = True
                    raw_detail = client.get_ticket(ticket_id)
                    detail = normalize_whmcs_ticket_detail(
                        raw_detail,
                        ticket,
                        whitelist,
                        rules,
                        whmcs_client=client,
                        validate_wp_access=args.validate_wp_access,
                        wp_validator=args.wp_validator,
                        inspect_requested_plugins=args.inspect_requested_plugins,
                        debug_plugin_table=args.debug_plugin_table,
                        debug_package_match=args.debug_package_match,
                        debug_service_resolution=args.debug_service_resolution,
                        prepare_missing_data_reply=args.prepare_missing_data_reply,
                        plugin_aliases=plugin_aliases,
                    )
                    details_lookup[key] = detail
                    if detail.get("preflight"):
                        preflight_by_key[key] = detail["preflight"]
        except Exception as exc:
            error_message = f"{exc.__class__.__name__}: {exc}"
            report_paths = None
            if args.save_report:
                report_paths = write_failure_reports(report_dir, stamp, metadata, error_message)
            print(f"Falha ao ler a API WHMCS em modo read-only: {error_message}")
            print("Acoes permitidas: GetTickets, GetTicket, GetClientsProducts")
            print("Acoes bloqueadas: AddTicketReply, UpdateTicket, CloseTicket, DeleteTicket, AddTicketNote")
            print("Alteracoes remotas: nenhuma")
            if isinstance(exc, HTTPError) and exc.code == 403:
                print_forbidden_next_steps()
            if report_paths:
                print(f"Relatorio Markdown: {report_paths['markdown']}")
                print(f"Relatorio JSON: {report_paths['json']}")
                print(f"Relatorio CSV: {report_paths['csv']}")
            return 2

    analyses_all = analyze_tickets(source_tickets, details_lookup, whitelist, rules)
    analyses = filter_analyses_for_output(analyses_all, args.show_ignored)
    summary = _as_summary(analyses_all)
    if debug_titles:
        print_debug_titles(source_tickets, analyses_all, getticket_called)
    if args.debug_browser_ui and metadata.get("browser_ui_debug"):
        print_debug_browser_ui(metadata["browser_ui_debug"], preflight_by_key)
    if args.debug_browser_dom and metadata.get("browser_ui_debug"):
        print_debug_browser_dom(metadata["browser_ui_debug"])
    if args.debug_browser_flow and metadata.get("browser_ui_debug"):
        print_debug_browser_flow(metadata["browser_ui_debug"])
    if args.prepare_installation_plan:
        attach_installation_plans(preflight_by_key)
    if args.prepare_execution:
        attach_execution_preparation(preflight_by_key)
    elif args.execute_installation_plan:
        attach_execution_preparation(preflight_by_key)
    if args.debug_preflight:
        print_debug_preflight(preflight_by_key)

    report_paths = None
    if args.save_report:
        metadata["preflight_by_key"] = preflight_by_key
        report_paths = write_reports(report_dir, stamp, analyses, summary, metadata)

    _print_summary(summary, metadata, report_paths)
    if browser_ui_read_incomplete:
        return 2
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Execucao interrompida pelo usuario. Nenhuma alteracao foi realizada.")
        raise SystemExit(130)
    except Exception as exc:
        message = str(exc).lower()
        if "target closed" in message or "browser has been closed" in message or "has been closed" in message:
            print("Execucao interrompida pelo usuario. Nenhuma alteracao foi realizada.")
            raise SystemExit(130)
        raise
