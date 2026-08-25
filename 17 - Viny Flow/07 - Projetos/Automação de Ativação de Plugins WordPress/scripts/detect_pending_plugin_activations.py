#!/usr/bin/env python3
"""Detecta tickets com possível pendência de ativação de plugin WordPress.

O script opera apenas sobre JSON local. Ele classifica tickets, calcula score,
monta uma fila de aprovação humana e gera saídas em Markdown, JSON e CSV.
Nenhuma chamada externa é feita.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


BASE_DIR = Path(__file__).resolve().parents[1]
CONFIG_DIR = BASE_DIR / "config"
REPORTS_DIR = BASE_DIR / "reports"
TEMPLATES_DIR = BASE_DIR / "templates"


DEFAULT_RULES = {
    "action_keywords": [
        "ativar",
        "ativacao",
        "ativação",
        "liberar",
        "habilitar",
        "instalar",
        "instalacao",
        "instalação",
        "licenca",
        "licença",
        "plugin",
    ],
    "pending_statuses": ["Open", "Customer-Reply", "In Progress", "Answered"],
    "ignore_statuses": ["Closed", "Resolved"],
    "wordpress_keywords": ["wordpress", "wp", "site", "dominio", "domínio"],
    "high_confidence_keywords": [
        "elementor pro",
        "wp rocket",
        "rank math",
        "crocoblock",
        "jetengine",
        "jetformbuilder",
        "premium addons",
        "essential addons",
        "happy addons",
    ],
    "done_keywords": [
        "ativado com sucesso",
        "plugin ativado",
        "ja esta ativo",
        "já está ativo",
        "ja ativamos",
        "já ativamos",
        "considerar resolvido",
        "resolvido",
        "concluido",
        "concluído",
    ],
}

NON_RELATED_TOPICS = [
    "ssl",
    "dns",
    "email",
    "e-mail",
    "financeiro",
    "fatura",
    "boleto",
]

ACTION_TERMS = ["ativar", "ativação", "ativacao", "liberar", "habilitar"]
INSTALL_TERMS = ["instalar", "instalação", "instalacao"]
LICENSE_TERMS = ["licença", "licenca"]
ERROR_TERMS = ["erro", "falha", "problema", "nao funciona", "não funciona", "quebrado"]


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def lower(value: Any) -> str:
    return normalize_text(value).lower()


def load_json(path: Path, fallback: Any) -> Any:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return fallback


def load_rules() -> Dict[str, Any]:
    data = load_json(CONFIG_DIR / "detection_rules.example.json", DEFAULT_RULES)
    if not isinstance(data, dict):
        return DEFAULT_RULES
    merged = dict(DEFAULT_RULES)
    merged.update(data)
    return merged


def load_whitelist() -> List[Dict[str, Any]]:
    data = load_json(CONFIG_DIR / "plugins_whitelist.example.json", [])
    return data if isinstance(data, list) else []


def ensure_dirs() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)


def combined_text(ticket: Dict[str, Any]) -> str:
    parts = [
        normalize_text(ticket.get("subject")),
        normalize_text(ticket.get("message")),
        normalize_text(ticket.get("department")),
        normalize_text(ticket.get("status")),
    ]
    return " ".join(parts).lower()


def extract_domain(text: str) -> Optional[str]:
    pattern = re.compile(r"\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b", re.IGNORECASE)
    matches = pattern.findall(text)
    return matches[0] if matches else None


def detect_plugin(text: str, whitelist: Sequence[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    for item in whitelist:
        if not item.get("allowed", False):
            continue
        candidates = [item.get("name", ""), item.get("slug", "")]
        candidates.extend(item.get("aliases", []))
        for candidate in candidates:
            candidate_text = lower(candidate)
            if candidate_text and candidate_text in text:
                return item
    return None


def match_keywords(text: str, keywords: Iterable[str]) -> List[str]:
    return [keyword for keyword in keywords if lower(keyword) in text]


def has_non_related_topic(text: str) -> bool:
    return any(term in text for term in NON_RELATED_TOPICS)


def detect_type(text: str, plugin: Optional[Dict[str, Any]], has_action: bool, has_license: bool, has_error: bool) -> str:
    if has_license:
        return "licenca_plugin"
    if has_error:
        return "erro_plugin"
    if any(term in text for term in INSTALL_TERMS):
        return "instalacao_plugin"
    if has_action and plugin:
        return "ativacao_plugin"
    if has_action or plugin or "plugin" in text:
        return "pedido_generico_plugin"
    return "nao_relacionado"


def plugin_is_allowed(plugin: Optional[Dict[str, Any]]) -> bool:
    return bool(plugin and plugin.get("allowed", False))


def determine_priority(tipo_solicitacao: str, classification: str) -> str:
    if tipo_solicitacao == "ativacao_plugin" and classification == "ALTA CONFIANCA":
        return "fila_ativacao"
    if tipo_solicitacao == "instalacao_plugin":
        return "revisar_instalacao"
    if tipo_solicitacao == "licenca_plugin":
        return "revisar_licenca"
    if tipo_solicitacao == "erro_plugin":
        return "revisar_erro_plugin"
    if tipo_solicitacao == "pedido_generico_plugin":
        return "revisar_pedido_generico"
    if tipo_solicitacao == "ativacao_plugin":
        return "revisar_pedido_generico"
    return "ignorar"


def apply_critical_gates(
    score_original: int,
    tipo_solicitacao: str,
    plugin: Optional[Dict[str, Any]],
    domain: Optional[str],
    pending_status: bool,
    has_done_signal: bool,
    ignored_status: bool,
    non_related: bool,
) -> Tuple[int, List[str], bool]:
    score_final = score_original
    gates_aplicados: List[str] = []
    forced_ignore = False

    if ignored_status:
        score_final = min(score_final, 20)
        gates_aplicados.append("status fechado/resolvido")
        forced_ignore = True

    if has_done_signal:
        score_final = min(score_final, 20)
        gates_aplicados.append("sinal de conclusão encontrado")
        forced_ignore = True

    if non_related:
        score_final = min(score_final, 20)
        gates_aplicados.append("tema não relacionado")
        forced_ignore = True

    if tipo_solicitacao != "ativacao_plugin":
        score_final = min(score_final, 69)
        gates_aplicados.append(f"Não é ativação clara. Tipo detectado: {tipo_solicitacao}.")
        if tipo_solicitacao == "instalacao_plugin":
            gates_aplicados.append("instalação exige validação de origem/licença antes de qualquer ação")
        elif tipo_solicitacao == "licenca_plugin":
            gates_aplicados.append("pedido de licença não deve virar ativação automática")
        elif tipo_solicitacao == "erro_plugin":
            gates_aplicados.append("pode ser incidente, conflito ou erro no site")
    else:
        if not pending_status:
            gates_aplicados.append("status não está pendente/aberto")

    if not plugin:
        score_final = min(score_final, 59)
        gates_aplicados.append("plugin não identificado")

    if not domain:
        score_final = min(score_final, 69)
        gates_aplicados.append("domínio não informado")

    if plugin and not plugin.get("allowed", False):
        score_final = min(score_final, 69)
        gates_aplicados.append("plugin fora da whitelist")

    return max(0, min(100, score_final)), gates_aplicados, forced_ignore


def classify_ticket(
    ticket: Dict[str, Any],
    rules: Dict[str, Any],
    whitelist: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    text = combined_text(ticket)
    subject = normalize_text(ticket.get("subject"))
    status = normalize_text(ticket.get("status"))
    status_lower = status.lower()

    action_hits = match_keywords(text, rules.get("action_keywords", []))
    wordpress_hits = match_keywords(text, rules.get("wordpress_keywords", []))
    done_hits = match_keywords(text, rules.get("done_keywords", []))
    high_hits = match_keywords(text, rules.get("high_confidence_keywords", []))

    plugin = detect_plugin(text, whitelist)
    plugin_name = normalize_text(plugin.get("name")) if plugin else ""
    domain = extract_domain(text)

    has_action = bool(action_hits) or any(term in text for term in ACTION_TERMS)
    has_license = any(term in text for term in LICENSE_TERMS) or "licença" in text or "licenca" in text
    has_error = any(term in text for term in ERROR_TERMS)
    pending_status = status in rules.get("pending_statuses", [])
    ignored_status = status in rules.get("ignore_statuses", [])
    has_done_signal = bool(done_hits)
    non_related = has_non_related_topic(text)
    mention_plugin = "plugin" in text or plugin is not None
    mention_wordpress = bool(wordpress_hits) or "wordpress" in text or "wp" in text or "site" in text
    subject_generic = lower(subject) in {"", "plugin", "ativacao de plugin", "instalacao de plugin", "licenca do plugin"}
    customer_email = normalize_text(ticket.get("customer_email"))

    tipo_solicitacao = detect_type(text, plugin, has_action, has_license, has_error)

    score_original = 0
    score_parts: List[str] = []

    if pending_status:
        score_original += 30
        score_parts.append("+30 status pendente")
    if has_action:
        score_original += 25
        score_parts.append("+25 palavra de acao")
    if plugin_is_allowed(plugin):
        score_original += 25
        score_parts.append("+25 plugin na whitelist")
    if domain:
        score_original += 10
        score_parts.append("+10 dominio detectado")
    if mention_wordpress:
        score_original += 10
        score_parts.append("+10 contexto WordPress")
    if has_done_signal:
        score_original -= 40
        score_parts.append("-40 sinal de conclusao")
    if ignored_status:
        score_original -= 50
        score_parts.append("-50 status fechado/resolvido")
    if non_related:
        score_original -= 30
        score_parts.append("-30 tema nao relacionado")

    score_original = max(0, min(100, score_original))
    score_final, gates_aplicados, forced_ignore = apply_critical_gates(
        score_original,
        tipo_solicitacao,
        plugin,
        domain,
        pending_status,
        has_done_signal,
        ignored_status,
        non_related,
    )

    classification = "PRECISA REVISAR"
    reason_parts: List[str] = []
    missing_info: List[str] = []
    next_action = "Revisar manualmente."

    if forced_ignore:
        classification = "IGNORAR"
        if ignored_status:
            reason_parts.append("status fechado ou resolvido")
        elif has_done_signal:
            reason_parts.append("sinal de conclusão encontrado")
        elif non_related:
            reason_parts.append("tema não relacionado a plugin WordPress")
        next_action = "Nenhuma acao."
    elif score_final < 40:
        classification = "IGNORAR"
        reason_parts.append("score final abaixo do limite")
        next_action = "Nenhuma acao."
    elif (
        score_final >= 75
        and pending_status
        and plugin_is_allowed(plugin)
        and domain
        and not has_done_signal
        and tipo_solicitacao == "ativacao_plugin"
    ):
        classification = "ALTA CONFIANCA"
        reason_parts.append("score alto com sinais consistentes de ativacao")
        if plugin_name:
            reason_parts.append(f"plugin detectado: {plugin_name}")
        next_action = "Enviar para fila de aprovacao humana."
    else:
        classification = "PRECISA REVISAR"
        if tipo_solicitacao == "instalacao_plugin":
            reason_parts.append(f"Não é ativação clara. Tipo detectado: {tipo_solicitacao}.")
        elif tipo_solicitacao == "licenca_plugin":
            reason_parts.append(f"Não é ativação clara. Tipo detectado: {tipo_solicitacao}.")
        elif tipo_solicitacao == "erro_plugin":
            reason_parts.append(f"Não é ativação clara. Tipo detectado: {tipo_solicitacao}.")
        elif tipo_solicitacao == "pedido_generico_plugin":
            reason_parts.append(f"Não é ativação clara. Tipo detectado: {tipo_solicitacao}.")
        elif mention_plugin and not plugin_is_allowed(plugin):
            reason_parts.append("fala de plugin, mas nao esta claro ou nao esta autorizado na whitelist")
        elif subject_generic:
            reason_parts.append("assunto generico ou insuficiente")
        else:
            reason_parts.append("score intermediario ou informacao incompleta")
        if tipo_solicitacao == "instalacao_plugin":
            next_action = "Revisar manualmente. Instalação exige validação de origem/licença antes de qualquer ação."
        elif tipo_solicitacao == "licenca_plugin":
            next_action = "Revisar manualmente. Pedido de licença não deve virar ativação automática."
        elif tipo_solicitacao == "erro_plugin":
            next_action = "Revisar manualmente. Pode ser incidente, conflito ou erro no site."
        elif tipo_solicitacao == "pedido_generico_plugin":
            next_action = "Confirmar plugin, domínio e autorização."
        elif mention_plugin or mention_wordpress or has_action:
            next_action = "Confirmar plugin, domínio e autorização."
        else:
            next_action = "Revisar manualmente."

    if classification in {"ALTA CONFIANCA", "PRECISA REVISAR"}:
        if not domain and "domínio não informado" not in missing_info:
            missing_info.append("domínio não informado")
        if not plugin and "plugin não identificado" not in missing_info and (mention_plugin or mention_wordpress or has_action or tipo_solicitacao != "nao_relacionado"):
            missing_info.append("plugin não identificado")
        if tipo_solicitacao == "licenca_plugin" and "domínio necessário para validar licença" not in missing_info:
            if not domain or has_license:
                missing_info.append("domínio necessário para validar licença")
        if plugin and not plugin_is_allowed(plugin) and "plugin fora da whitelist" not in missing_info:
            missing_info.append("plugin fora da whitelist")

    if classification == "PRECISA REVISAR" and tipo_solicitacao == "ativacao_plugin" and not plugin:
        reason_parts.append("falta clareza para confirmar ativacao")
        if not domain and "domínio não informado" not in missing_info:
            missing_info.append("domínio não informado")

    if classification == "IGNORAR" and not reason_parts:
        reason_parts.append("sem sinais relevantes")

    return {
        "ticket_id": normalize_text(ticket.get("ticket_id")),
        "status": status,
        "customer": normalize_text(ticket.get("customer")) or normalize_text(ticket.get("client")) or "",
        "customer_email": customer_email,
        "subject": subject,
        "message": normalize_text(ticket.get("message")),
        "domain_detected": domain or "",
        "plugin_detected": plugin_name,
        "tipo_solicitacao": tipo_solicitacao,
        "confidence_score": score_final,
        "score_original": score_original,
        "score_final": score_final,
        "classification": classification,
        "reason": "; ".join(dict.fromkeys(reason_parts)) or "sem motivo adicional",
        "missing_info": missing_info,
        "next_action": next_action,
        "score_breakdown": score_parts,
        "gates_aplicados": gates_aplicados,
        "prioridade_operacional": determine_priority(tipo_solicitacao, classification),
        "created_at": normalize_text(ticket.get("created_at")),
        "last_reply_by": normalize_text(ticket.get("last_reply_by")),
    }


def build_queue(results: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    queue = []
    for row in results:
        if row["classification"] not in {"ALTA CONFIANCA", "PRECISA REVISAR"}:
            continue
        queue.append(
            {
                "ticket_id": row["ticket_id"],
                "status": row["status"],
                "customer_email": row["customer_email"],
                "subject": row["subject"],
                "domain_detected": row["domain_detected"],
                "plugin_detected": row["plugin_detected"],
                "tipo_solicitacao": row["tipo_solicitacao"],
                "score_original": row["score_original"],
                "score_final": row["score_final"],
                "classification": row["classification"],
                "reason": row["reason"],
                "missing_info": row["missing_info"],
                "gates_aplicados": row["gates_aplicados"],
                "prioridade_operacional": row["prioridade_operacional"],
                "next_action": row["next_action"],
            }
        )
    return queue


def write_markdown_table(rows: Sequence[Dict[str, Any]], columns: Sequence[Tuple[str, str]]) -> str:
    if not rows:
        return "_Sem itens._\n"
    header = "| " + " | ".join(label for label, _ in columns) + " |\n"
    separator = "| " + " | ".join("---" for _ in columns) + " |\n"
    body = ""
    for row in rows:
        values = []
        for _, key in columns:
            value = row.get(key, "")
            if isinstance(value, list):
                value = "; ".join(str(item) for item in value)
            values.append(str(value) or "-")
        body += "| " + " | ".join(values) + " |\n"
    return header + separator + body


def render_general_report(results: Sequence[Dict[str, Any]], path: Path) -> None:
    high = [r for r in results if r["classification"] == "ALTA CONFIANCA"]
    review = [r for r in results if r["classification"] == "PRECISA REVISAR"]
    ignored = [r for r in results if r["classification"] == "IGNORAR"]

    lines = [
        "# Detector de Ativações Pendentes",
        "",
        "## Resumo",
        f"- Total analisado: {len(results)}",
        f"- Alta confiança: {len(high)}",
        f"- Precisa revisar: {len(review)}",
        f"- Ignorados: {len(ignored)}",
        "",
        "## Alta confiança",
        write_markdown_table(
            high,
            [
                ("Ticket ID", "ticket_id"),
                ("Status", "status"),
                ("Cliente", "customer"),
                ("Domínio detectado", "domain_detected"),
                ("Plugin detectado", "plugin_detected"),
                ("Tipo", "tipo_solicitacao"),
                ("Score original", "score_original"),
                ("Score final", "score_final"),
                ("Gates", "gates_aplicados"),
                ("Prioridade", "prioridade_operacional"),
                ("Motivo", "reason"),
                ("Próxima ação", "next_action"),
            ],
        ),
        "## Precisa revisar",
        write_markdown_table(
            review,
            [
                ("Ticket ID", "ticket_id"),
                ("Motivo", "reason"),
                ("Informação faltante", "missing_info"),
                ("Tipo", "tipo_solicitacao"),
                ("Score original", "score_original"),
                ("Score final", "score_final"),
                ("Gates", "gates_aplicados"),
                ("Prioridade", "prioridade_operacional"),
            ],
        ),
        "## Ignorados",
        write_markdown_table(
            ignored,
            [
                ("Ticket ID", "ticket_id"),
                ("Status", "status"),
                ("Score original", "score_original"),
                ("Score final", "score_final"),
                ("Gates", "gates_aplicados"),
                ("Motivo", "reason"),
            ],
        ),
        "",
        "## Alertas de segurança",
        "- Nada foi ativado.",
        "- Nenhuma API real foi chamada.",
        "- Nenhum token foi usado.",
        "- Nenhuma credencial foi salva.",
        "- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


def render_queue_markdown(queue: Sequence[Dict[str, Any]], path: Path) -> None:
    high = [r for r in queue if r["classification"] == "ALTA CONFIANCA"]
    review = [r for r in queue if r["classification"] == "PRECISA REVISAR"]

    lines = [
        "# Fila de Aprovacao de Plugins",
        "",
        "## Resumo",
        f"- Total acionavel: {len(queue)}",
        f"- Alta confiança: {len(high)}",
        f"- Precisa revisar: {len(review)}",
        "",
        "## Alta confiança",
        write_markdown_table(
            high,
            [
                ("Ticket ID", "ticket_id"),
                ("Status", "status"),
                ("Customer Email", "customer_email"),
                ("Subject", "subject"),
                ("Domain Detected", "domain_detected"),
                ("Plugin Detected", "plugin_detected"),
                ("Tipo de solicitação", "tipo_solicitacao"),
                ("Score original", "score_original"),
                ("Score final", "score_final"),
                ("Classification", "classification"),
                ("Reason", "reason"),
                ("Missing Info", "missing_info"),
                ("Gates applied", "gates_aplicados"),
                ("Operational priority", "prioridade_operacional"),
                ("Next Action", "next_action"),
            ],
        ),
        "## Precisa revisar",
        write_markdown_table(
            review,
            [
                ("Ticket ID", "ticket_id"),
                ("Status", "status"),
                ("Customer Email", "customer_email"),
                ("Subject", "subject"),
                ("Domain Detected", "domain_detected"),
                ("Plugin Detected", "plugin_detected"),
                ("Tipo de solicitação", "tipo_solicitacao"),
                ("Score original", "score_original"),
                ("Score final", "score_final"),
                ("Classification", "classification"),
                ("Reason", "reason"),
                ("Missing Info", "missing_info"),
                ("Gates applied", "gates_aplicados"),
                ("Operational priority", "prioridade_operacional"),
                ("Next Action", "next_action"),
            ],
        ),
        "",
        "## Alertas de segurança",
        "- Nada foi ativado.",
        "- Nenhuma API real foi chamada.",
        "- Nenhum token foi usado.",
        "- Nenhuma credencial foi salva.",
        "- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


def render_queue_json(queue: Sequence[Dict[str, Any]], path: Path) -> None:
    path.write_text(json.dumps(list(queue), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_queue_csv(queue: Sequence[Dict[str, Any]], path: Path) -> None:
    fields = [
        "ticket_id",
        "status",
        "customer_email",
        "subject",
        "domain_detected",
        "plugin_detected",
        "tipo_solicitacao",
        "score_original",
        "score_final",
        "classification",
        "reason",
        "missing_info",
        "gates_aplicados",
        "prioridade_operacional",
        "next_action",
    ]
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in queue:
            export_row = dict(row)
            export_row["missing_info"] = "; ".join(row.get("missing_info", []))
            export_row["gates_aplicados"] = "; ".join(row.get("gates_aplicados", []))
            writer.writerow({field: export_row.get(field, "") for field in fields})


def print_terminal_summary(results: Sequence[Dict[str, Any]], queue_paths: Dict[str, Path], only_queue: bool) -> None:
    counts = Counter(row["classification"] for row in results)
    print("Resumo:")
    print(f"- Total analisado: {len(results)}")
    print(f"- Alta confiança: {counts.get('ALTA CONFIANCA', 0)}")
    print(f"- Precisa revisar: {counts.get('PRECISA REVISAR', 0)}")
    print(f"- Ignorados: {counts.get('IGNORAR', 0)}")
    print(f"- Arquivo Markdown: {queue_paths['markdown']}")
    print(f"- Arquivo JSON: {queue_paths['json']}")
    print(f"- Arquivo CSV: {queue_paths['csv']}")
    print("")
    rows = [row for row in results if row["classification"] in {"ALTA CONFIANCA", "PRECISA REVISAR"}]
    for row in rows:
        print(
            f"Ticket {row['ticket_id']}: {row['classification']} | "
            f"score_original={row['score_original']} | score_final={row['score_final']} | "
            f"tipo={row['tipo_solicitacao']} | prioridade={row['prioridade_operacional']}"
        )
        print(f"  Motivo: {row['reason']}")
        if row["plugin_detected"]:
            print(f"  Plugin detectado: {row['plugin_detected']}")
        if row["domain_detected"]:
            print(f"  Dominio detectado: {row['domain_detected']}")
        if row["missing_info"]:
            print(f"  Informacao faltante: {', '.join(row['missing_info'])}")
        if row["gates_aplicados"]:
            print(f"  Gates aplicados: {', '.join(row['gates_aplicados'])}")
        print(f"  Proxima acao: {row['next_action']}")
        print("")
    if not only_queue:
        ignored_rows = [row for row in results if row["classification"] == "IGNORAR"]
        if ignored_rows:
            print("Ignorados:")
            for row in ignored_rows:
                print(f"- Ticket {row['ticket_id']} | motivo: {row['reason']}")
            print("")


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("tickets_json", help="Caminho para o JSON local com tickets")
    parser.add_argument("--only-queue", action="store_true", help="Mostra somente a fila acionavel no terminal")
    return parser.parse_args(argv[1:])


def main(argv: Sequence[str]) -> int:
    ensure_dirs()
    args = parse_args(argv)

    input_path = Path(args.tickets_json).expanduser().resolve()
    if not input_path.exists():
        print(f"Arquivo nao encontrado: {input_path}", file=sys.stderr)
        return 1

    payload = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        print("O JSON de entrada precisa ser uma lista de tickets.", file=sys.stderr)
        return 1

    rules = load_rules()
    whitelist = load_whitelist()
    results = [classify_ticket(ticket, rules, whitelist) for ticket in payload]
    queue = build_queue(results)

    timestamp = datetime.now().strftime("%Y-%m-%d-%H%M")
    general_report_path = REPORTS_DIR / f"detector-ativacoes-pendentes-{timestamp}.md"
    queue_md_path = REPORTS_DIR / f"fila-aprovacao-plugin-{timestamp}.md"
    queue_json_path = REPORTS_DIR / f"fila-aprovacao-plugin-{timestamp}.json"
    queue_csv_path = REPORTS_DIR / f"fila-aprovacao-plugin-{timestamp}.csv"

    render_general_report(results, general_report_path)
    render_queue_markdown(queue, queue_md_path)
    render_queue_json(queue, queue_json_path)
    render_queue_csv(queue, queue_csv_path)

    print_terminal_summary(
        results,
        {
            "markdown": queue_md_path,
            "json": queue_json_path,
            "csv": queue_csv_path,
        },
        only_queue=args.only_queue,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
