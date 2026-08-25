"""Executor controlado de instalacao/ativacao de plugins WordPress.

Esta versao prepara e audita a execucao sem executar nenhuma acao real.
O caminho de aplicacao real permanece bloqueado ate uma etapa futura.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any, Dict, List


@dataclass
class ExecutionPluginPlan:
    plugin_name: str
    package_name: str
    package_version: str
    package_hash_valid: bool
    state_before: str
    installation_executed: bool
    activation_executed: bool
    state_after: str
    health_checks: List[str]
    rollback_needed: bool
    final_result: str
    next_action: str
    blocking_reasons: List[str]


def validate_apply_gate(apply_requested: bool, ticket: str, confirm: str, expected_confirm: str) -> tuple[bool, List[str]]:
    reasons: List[str] = []
    if not apply_requested:
        reasons.append("aplicacao nao solicitada")
    if not ticket:
        reasons.append("ticket ausente")
    if confirm != expected_confirm:
        reasons.append("confirmacao exata ausente")
    return not reasons, reasons


def _collect_health_checks(preflight: Dict[str, Any]) -> List[str]:
    checks: List[str] = []
    if preflight.get("wp_access_validation_executed"):
        checks.append(f"wp_access:{preflight.get('wp_access_link_status') or 'NOT_TESTED'}")
    else:
        checks.append("wp_access:not_validated")
    if preflight.get("wp_admin_accessible"):
        checks.append("wp_admin:accessible")
    else:
        checks.append("wp_admin:blocked")
    if preflight.get("plugins_page_accessible"):
        checks.append("plugins_page:accessible")
    else:
        checks.append("plugins_page:blocked")
    return checks


def build_execution_preparation(preflight: Dict[str, Any], installation_plan: List[Dict[str, Any]]) -> Dict[str, Any]:
    execution_plans: List[ExecutionPluginPlan] = []
    blocking: List[str] = []
    missing_access_data = str(preflight.get("classification") or "").strip().upper() == "BLOCKED_MISSING_ACCESS_DATA"
    ticket_closed = str(preflight.get("status") or "").strip().lower() in {"closed", "resolved", "fechado", "resolvido"}
    ticket_ready = (
        not ticket_closed
        and
        preflight.get("classification") == "ACESSO WORDPRESS VALIDADO"
        and preflight.get("customer_authorization") == "sim"
        and bool(preflight.get("domain_detected"))
        and preflight.get("wp_access_link_status") == "ACCESSIBLE"
        and bool(preflight.get("wp_admin_accessible"))
        and bool(preflight.get("plugins_page_accessible"))
    )
    if not ticket_ready:
        blocking.append("pré-condições do ticket não atendidas")
    if ticket_closed:
        blocking.append("ticket fechado ou resolvido")
    if missing_access_data:
        blocking.append("dados de acesso WordPress ausentes")

    for item in installation_plan:
        package_status = str(item.get("package_status") or "")
        approval_status = str(item.get("approval_status") or "")
        state_before = str(item.get("current_wordpress_state") or "BLOCKED")
        health_checks = _collect_health_checks(preflight)
        if ticket_closed:
            plugin_blocking = []
            state_after = "ALREADY_ACTIVE" if state_before == "ATIVO" else "NO_ACTION_REQUIRED"
            final_result = "NO_ACTION_REQUIRED"
            next_action = "Nenhuma ação automática; ticket fechado ou resolvido."
            allowed = False
        elif state_before == "ATIVO":
            plugin_blocking: List[str] = []
            allowed = False
            state_after = "ALREADY_ACTIVE"
            final_result = "NO_ACTION_REQUIRED"
            next_action = "Nenhuma ativacao necessaria. O plugin ja esta ativo."
        else:
            plugin_blocking = list(blocking)
            if package_status != "VALID_PACKAGE":
                plugin_blocking.append(f"pacote {package_status.lower() or 'invalido'}")
            if approval_status not in {"READY_FOR_HUMAN_APPROVAL", "NO_ACTION_REQUIRED"}:
                plugin_blocking.append(f"aprovacao {approval_status or 'indisponivel'}")
            allowed = not plugin_blocking
            state_after = "NOT_EXECUTED" if allowed else "BLOCKED"
            final_result = "PREPARE_ONLY" if allowed else "BLOCKED"
            next_action = "Aguardando confirmacao humana" if allowed else "Revisar bloqueios antes de aplicar"
        execution_plans.append(
            ExecutionPluginPlan(
                plugin_name=str(item.get("plugin_name") or ""),
                package_name=str(item.get("package_basename") or ""),
                package_version=str(item.get("package_version") or ""),
                package_hash_valid=bool(item.get("package_hash_valid")),
                state_before=state_before,
                installation_executed=False,
                activation_executed=False,
                state_after=state_after,
                health_checks=health_checks,
                rollback_needed=False,
                final_result=final_result,
                next_action=next_action,
                blocking_reasons=plugin_blocking,
            )
        )

    if ticket_closed:
        overall = "BLOCKED_CLOSED_TICKET"
        execution_allowed = False
        execution_result = "NOT_EXECUTED"
        blocking_reason = "ticket fechado ou resolvido"
        next_action = "nenhuma ação automática; revisar apenas se o ticket for reaberto"
        final_result = "NO_ACTION_REQUIRED" if execution_plans and all(plan.final_result == "NO_ACTION_REQUIRED" for plan in execution_plans) else "BLOCKED"
    else:
        overall = "READY_FOR_HUMAN_APPROVAL" if execution_plans and all(plan.final_result in {"PREPARE_ONLY", "NO_ACTION_REQUIRED"} for plan in execution_plans) else "BLOCKED"
        execution_allowed = overall == "READY_FOR_HUMAN_APPROVAL"
        execution_result = "NOT_EXECUTED"
        blocking_reason = "pré-condições do ticket não atendidas" if overall != "READY_FOR_HUMAN_APPROVAL" else ""
        if missing_access_data:
            next_action = "Solicitar link temporário de acesso ao WordPress."
        else:
            next_action = "Nao executar sem --apply e --confirm" if overall == "READY_FOR_HUMAN_APPROVAL" else "Bloquear e revisar validacoes"
        final_result = "PREPARE_ONLY" if overall == "READY_FOR_HUMAN_APPROVAL" else "BLOCKED"
    return {
        "overall_execution_state": overall,
        "execution_allowed": execution_allowed,
        "execution_result": execution_result,
        "blocking_reason": blocking_reason,
        "blocking_reasons": blocking,
        "plugins": [asdict(plan) for plan in execution_plans],
        "installation_executed": False,
        "activation_executed": False,
        "rollback_needed": False,
        "final_result": final_result,
        "next_action": next_action,
    }


def print_execution_preparation(preparation: Dict[str, Any]) -> None:
    print("Preparacao da execucao")
    print(f"estado geral: {preparation.get('overall_execution_state') or 'BLOCKED'}")
    if "execution_allowed" in preparation:
        print(f"execucao permitida: {'sim' if preparation.get('execution_allowed') else 'nao'}")
    if preparation.get("execution_result"):
        print(f"resultado da execucao: {preparation.get('execution_result')}")
    print(f"instalacao executada: {'sim' if preparation.get('installation_executed') else 'nao'}")
    print(f"ativacao executada: {'sim' if preparation.get('activation_executed') else 'nao'}")
    print(f"rollback necessario: {'sim' if preparation.get('rollback_needed') else 'nao'}")
    print(f"resultado final: {preparation.get('final_result') or 'BLOCKED'}")
    if preparation.get("blocking_reason"):
        print(f"bloqueio global: {preparation.get('blocking_reason')}")
    print(f"proxima acao: {preparation.get('next_action') or 'Bloquear e revisar validacoes'}")
    if preparation.get("blocking_reasons"):
        print(f"bloqueios: {', '.join(preparation.get('blocking_reasons') or [])}")
    for plugin in preparation.get("plugins") or []:
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
