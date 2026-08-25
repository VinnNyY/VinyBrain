"""Regras de detecção read-only para tickets WHMCS.

O engine não altera estado remoto. Ele apenas classifica tickets com base em
texto, status e whitelist local de plugins.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, asdict
from typing import Any, Dict, Iterable, List, Optional, Sequence


DOMAIN_PATTERN = re.compile(r"\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b", re.IGNORECASE)


@dataclass
class TicketAnalysis:
    ticket_id: str
    ticket_num: str
    status: str
    department: str
    subject: str
    subject_final: str
    message: str
    plugin: Optional[str]
    plugin_slug: Optional[str]
    plugins_detectados: List[str]
    domain: Optional[str]
    activation_requested: bool
    authorization_detected: bool
    completion_detected: bool
    wordpress_context: bool
    decision: str
    classification: str
    priority: str
    classification_reason: str
    score: int
    signals: List[str]
    blocked_actions: List[str]
    is_candidate: bool
    source: str
    fields_used: Dict[str, str]
    debug_fields: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _lower(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def _fold(value: Any) -> str:
    text = _lower(value)
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(char for char in normalized if not unicodedata.combining(char))


def _text_value(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _combined_text(ticket: Dict[str, Any]) -> str:
    parts = [
        _text_value(ticket.get("ticket_id")),
        _text_value(ticket.get("ticket_num")),
        _text_value(ticket.get("subject")),
        _text_value(ticket.get("subject_final")),
        _text_value(ticket.get("title")),
        _text_value(ticket.get("name")),
        _text_value(ticket.get("message_subject")),
        _text_value(ticket.get("message")),
        _text_value(ticket.get("status")),
        _text_value(ticket.get("department")),
        _text_value(ticket.get("clientname")),
        _text_value(ticket.get("firstname")),
        _text_value(ticket.get("lastname")),
    ]
    return _fold(" ".join(part for part in parts if part))


def _extract_domain(text: str) -> Optional[str]:
    matches = DOMAIN_PATTERN.findall(text)
    return matches[0].lower() if matches else None


def _match_keywords(text: str, keywords: Iterable[str]) -> List[str]:
    return [keyword for keyword in keywords if _fold(keyword) in text]


def _detect_plugins(text: str, whitelist: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    matches: List[Dict[str, Any]] = []
    seen: set[str] = set()
    for entry in whitelist:
        if not isinstance(entry, dict):
            continue
        if not entry.get("allowed", False):
            continue
        candidates = [entry.get("name", ""), entry.get("slug", "")]
        aliases = entry.get("aliases", [])
        if isinstance(aliases, list):
            candidates.extend(aliases)
        for candidate in candidates:
            candidate_text = _fold(candidate)
            if candidate_text and candidate_text in text:
                key = str(entry.get("slug") or entry.get("name") or candidate_text)
                if key not in seen:
                    seen.add(key)
                    matches.append(entry)
                break
    return matches


def _status_normalized(ticket: Dict[str, Any]) -> str:
    return _text_value(ticket.get("status") or ticket.get("ticketstatus") or ticket.get("state"))


def _status_is_pending(status: str, pending_statuses: Sequence[str]) -> bool:
    status_folded = _fold(status)
    configured = {_fold(item) for item in pending_statuses}
    configured.update({"aberto", "abertos", "open", "customer-reply", "in progress", "answered"})
    return status_folded in configured


def _status_is_ignored(status: str, ignore_statuses: Sequence[str]) -> bool:
    status_folded = _fold(status)
    configured = {_fold(item) for item in ignore_statuses}
    configured.update({"closed", "resolved", "fechado", "fechados", "resolvido", "resolvidos"})
    return status_folded in configured


def _has_wordpress_context(text: str, keywords: Sequence[str]) -> bool:
    return any(keyword in text for keyword in (_fold(item) for item in keywords))


def analyze_ticket(
    ticket: Dict[str, Any],
    whitelist: Sequence[Dict[str, Any]],
    rules: Dict[str, Any],
    *,
    source: str,
) -> TicketAnalysis:
    text = _combined_text(ticket)
    subject = _text_value(ticket.get("subject") or ticket.get("subject_final") or ticket.get("title"))
    subject_final = _text_value(ticket.get("subject_final") or subject)
    message = _text_value(ticket.get("message") or ticket.get("body") or ticket.get("description"))
    status = _status_normalized(ticket)
    department = _text_value(ticket.get("department") or ticket.get("deptname") or ticket.get("dept_name"))
    plugin_entries = _detect_plugins(text, whitelist)
    plugin_entry = plugin_entries[0] if plugin_entries else None
    domain = _extract_domain(text)

    activation_keywords = rules.get("activation_keywords", [])
    wordpress_keywords = rules.get("wordpress_keywords", [])
    authorization_keywords = rules.get("authorization_keywords", [])
    completion_keywords = rules.get("completion_keywords", [])
    non_related_topics = rules.get("non_related_topics", [])
    pending_statuses = rules.get("pending_statuses", [])
    ignore_statuses = rules.get("ignore_statuses", [])

    default_activation_keywords = [
        "ativar",
        "ativacao",
        "ativação",
        "solicitacao de ativacao",
        "solicitação de ativação",
        "liberar",
        "habilitar",
        "plugin",
        "plugin(s)",
    ]
    activation_hits = _match_keywords(text, list(activation_keywords) + default_activation_keywords)
    authorization_hits = _match_keywords(text, authorization_keywords)
    completion_hits = _match_keywords(text, completion_keywords)
    non_related_hits = _match_keywords(text, non_related_topics)
    wordpress_context = _has_wordpress_context(text, wordpress_keywords)
    pending_status = _status_is_pending(status, pending_statuses)
    ignored_status = _status_is_ignored(status, ignore_statuses)
    completion_detected = bool(completion_hits) or ignored_status
    activation_requested = bool(activation_hits) or bool(plugin_entries)
    authorization_detected = bool(authorization_hits)
    plugin_name = plugin_entry.get("name") if plugin_entry else None
    plugin_slug = plugin_entry.get("slug") if plugin_entry else None
    plugins_detectados = [_text_value(entry.get("name")) for entry in plugin_entries if entry.get("name")]

    signals: List[str] = []
    score = 0

    if activation_hits:
        score += 25
        signals.append("activation_keyword")
    if plugin_entries:
        score += 30
        signals.append("plugin_whitelist_match")
    if domain:
        score += 15
        signals.append("domain_detected")
    if authorization_detected:
        score += 15
        signals.append("authorization_detected")
    if wordpress_context:
        score += 10
        signals.append("wordpress_context")
    if pending_status:
        score += 10
        signals.append("pending_status")
    if completion_hits:
        score -= 50
        signals.extend(f"completion:{hit}" for hit in completion_hits)
    if ignored_status:
        score -= 50
        signals.append("ignored_status")
    if non_related_hits:
        score -= 30
        signals.extend(f"non_related:{hit}" for hit in non_related_hits)

    if "install" in text or "instalar" in text or "instalacao" in text:
        score -= 10
        signals.append("installation_language")
    if "licenc" in text:
        score -= 10
        signals.append("license_language")
    if "erro" in text or "falha" in text or "problema" in text:
        score -= 10
        signals.append("error_language")

    score = max(0, min(score, 100))

    has_blocking_language = any(signal in signals for signal in ["installation_language", "license_language", "error_language"])
    clear_activation_by_subject = (
        activation_requested
        and bool(plugin_entries)
        and not completion_detected
        and not ignored_status
        and not has_blocking_language
    )

    if completion_detected:
        decision = "ignored"
        classification = "IGNORAR"
        priority = "ignorar"
        classification_reason = "sinal de conclusao ou status fechado/resolvido"
    elif clear_activation_by_subject and pending_status:
        decision = "pending_activation"
        classification = "PRONTO PARA APROVAÇÃO"
        priority = "fila_ativacao"
        classification_reason = "pedido claro de ativação de plugin com plugin conhecido"
    elif score >= int(rules.get("candidate_threshold", 70)):
        if activation_requested and plugin_entries and not has_blocking_language and pending_status:
            decision = "pending_activation"
            classification = "PRONTO PARA APROVAÇÃO"
            priority = "fila_ativacao"
            classification_reason = "pedido claro de ativação de plugin com plugin conhecido"
        else:
            decision = "needs_review"
            classification = "REVISAR"
            priority = "revisar_manual"
            classification_reason = "sinais de plugin encontrados, mas faltam dados para aprovação direta"
    elif score >= int(rules.get("review_threshold", 40)):
        decision = "needs_review"
        classification = "REVISAR"
        priority = "revisar_manual"
        classification_reason = "sinais parciais de ativação ou plugin"
    else:
        decision = "ignored"
        classification = "IGNORAR"
        priority = "ignorar"
        classification_reason = "sem sinais suficientes de ativação de plugin"

    blocked_actions: List[str] = []
    if decision in {"pending_activation", "needs_review"}:
        blocked_actions.extend(
            [
                "AddTicketReply",
                "UpdateTicket",
                "CloseTicket",
                "DeleteTicket",
                "AddTicketNote",
            ]
        )

    is_candidate = decision in {"pending_activation", "needs_review"}

    debug_fields = dict(ticket.get("debug_fields") or {})
    debug_fields.update(
        {
            "keywords_encontradas": activation_hits,
            "plugins_encontrados": plugins_detectados,
            "motivo": classification_reason,
            "ignorado": decision == "ignored",
        }
    )

    return TicketAnalysis(
        ticket_id=_text_value(ticket.get("ticket_id") or ticket.get("id") or ticket.get("tid")),
        ticket_num=_text_value(ticket.get("ticket_num") or ticket.get("tid") or ticket.get("ticketnum")),
        status=status,
        department=department,
        subject=subject,
        subject_final=subject_final,
        message=message,
        plugin=plugin_name,
        plugin_slug=plugin_slug,
        plugins_detectados=plugins_detectados,
        domain=domain,
        activation_requested=activation_requested,
        authorization_detected=authorization_detected,
        completion_detected=completion_detected,
        wordpress_context=wordpress_context,
        decision=decision,
        classification=classification,
        priority=priority,
        classification_reason=classification_reason,
        score=score,
        signals=signals,
        blocked_actions=blocked_actions,
        is_candidate=is_candidate,
        source=source,
        fields_used=dict(ticket.get("fields_used") or {}),
        debug_fields=debug_fields,
    )
