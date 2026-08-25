from __future__ import annotations

from _common import load_env_file, safe_json


def build_notion_plan() -> dict[str, object]:
    return {
        "root": "Viny Hub",
        "sections": [
            {
                "name": "Reunioes",
                "finalidade": "Registrar encontros com contexto, resumo e proximos passos.",
                "dados_entrada": [
                    "titulo",
                    "data",
                    "participantes",
                    "resumo executivo",
                    "decisoes",
                    "pendencias",
                    "proximos passos",
                ],
                "vem_do_viny_brain": [
                    "contexto consolidado",
                    "decisoes finais",
                    "links internos",
                    "riscos e pendencias",
                ],
                "nao_enviar": [
                    "anotacoes soltas sem validacao",
                    "segredos",
                    "tokens",
                    "dados sensiveis de cliente",
                ],
            },
            {
                "name": "Decisoes",
                "finalidade": "Centralizar decisoes claras e rastreaveis.",
                "dados_entrada": ["decisao", "data", "motivo", "impacto", "status"],
                "vem_do_viny_brain": [
                    "decisao consolidada",
                    "historico",
                    "contexto",
                    "observacoes de risco",
                ],
                "nao_enviar": [
                    "rascunhos internos",
                    "informacao incompleta sem dono",
                    "material sensivel sem necessidade",
                ],
            },
            {
                "name": "Projetos",
                "finalidade": "Mostrar visao geral e acompanhamento macro.",
                "dados_entrada": [
                    "nome do projeto",
                    "objetivo",
                    "escopo",
                    "status",
                    "responsavel",
                    "prazo",
                ],
                "vem_do_viny_brain": [
                    "visao estrategica",
                    "premissas",
                    "riscos",
                    "dependencias",
                ],
                "nao_enviar": [
                    "detalhes operacionais excessivos",
                    "segredos de acesso",
                    "dados sensiveis nao autorizados",
                ],
            },
            {
                "name": "Relatorios",
                "finalidade": "Guardar versoes compartilhaveis e consultaveis.",
                "dados_entrada": ["titulo", "periodo", "resumo", "conclusoes", "pendencias"],
                "vem_do_viny_brain": [
                    "versao final",
                    "contexto",
                    "decisoes de consolidacao",
                ],
                "nao_enviar": [
                    "versao interna bruta",
                    "segredos",
                    "informacao que nao precisa ser publica",
                ],
            },
            {
                "name": "Processos",
                "finalidade": "Registrar fluxos e padroes operacionais estaveis.",
                "dados_entrada": [
                    "nome do processo",
                    "objetivo",
                    "passos",
                    "responsavel",
                    "criterio de uso",
                ],
                "vem_do_viny_brain": [
                    "fluxo aprovado",
                    "regras de operacao",
                    "licoes consolidadas",
                ],
                "nao_enviar": [
                    "atalhos temporarios",
                    "segredos",
                    "dados sensiveis desnecessarios",
                ],
            },
            {
                "name": "Tutoriais",
                "finalidade": "Organizar guias e referencias.",
                "dados_entrada": [
                    "tema",
                    "passos",
                    "observacoes",
                    "links",
                    "status editorial",
                ],
                "vem_do_viny_brain": [
                    "conteudo consolidado",
                    "aprendizados",
                    "links de apoio",
                ],
                "nao_enviar": [
                    "rascunho nao validado",
                    "prints sensiveis",
                    "credenciais",
                ],
            },
            {
                "name": "Integracoes",
                "finalidade": "Documentar a camada operacional de integracoes e regras.",
                "dados_entrada": [
                    "fase",
                    "escopo",
                    "status",
                    "restricoes",
                    "proximo passo",
                ],
                "vem_do_viny_brain": [
                    "regras de seguranca",
                    "decisoes de fase",
                    "testes aprovados",
                ],
                "nao_enviar": [
                    "tokens",
                    "segredos",
                    "payloads com dados reais",
                ],
            },
        ],
    }


def build_clickup_plan() -> dict[str, object]:
    return {
        "space": "Viny Operacional",
        "folders": [
            {
                "name": "Demandas Internas",
                "finalidade": "Centralizar pedidos e solicitacoes internas.",
                "status_sugeridos": ["to do", "in progress", "review", "done"],
                "tags_sugeridas": ["interna", "prioridade", "bloqueio", "seguimento"],
                "campos_uteis": ["responsavel", "prazo", "origem", "prioridade", "tipo"],
                "exemplos_de_tarefas": [
                    "Ajustar checklist de fluxo",
                    "Validar regra de seguranca",
                ],
            },
            {
                "name": "Tutoriais StayCloud",
                "finalidade": "Acompanhar producao, revisao e publicacao de tutoriais.",
                "status_sugeridos": ["draft", "editing", "review", "ready", "published"],
                "tags_sugeridas": ["staycloud", "tutorial", "seo", "print"],
                "campos_uteis": ["url", "responsavel", "fase", "prazo", "seo_score"],
                "exemplos_de_tarefas": [
                    "Revisar tutorial de acesso ao painel",
                    "Capturar novas imagens de um passo",
                ],
            },
            {
                "name": "Base de Conhecimento",
                "finalidade": "Organizar curadoria e manutencao de playbooks.",
                "status_sugeridos": ["backlog", "curation", "validated", "published"],
                "tags_sugeridas": ["playbook", "referencia", "kb", "curadoria"],
                "campos_uteis": ["tema", "origem", "nivel", "responsavel", "validacao"],
                "exemplos_de_tarefas": [
                    "Importar playbook de hospedagem",
                    "Revisar conteudo antigo",
                ],
            },
            {
                "name": "Integracoes",
                "finalidade": "Acompanhar evolucao e testes das integracoes.",
                "status_sugeridos": ["test", "dry-run", "blocked", "ready", "apply-ready"],
                "tags_sugeridas": ["notion", "clickup", "api", "dry-run"],
                "campos_uteis": ["sistema", "fase", "risco", "evidencia", "responsavel"],
                "exemplos_de_tarefas": [
                    "Validar autenticacao do Notion",
                    "Revisar dry-run de bootstrap",
                ],
            },
            {
                "name": "Relatorios e Gestao",
                "finalidade": "Acompanhar relatorios, consolidacao e revisoes de gestao.",
                "status_sugeridos": ["draft", "review", "approved", "sent"],
                "tags_sugeridas": ["relatorio", "gestao", "consolidacao"],
                "campos_uteis": ["periodo", "destino", "responsavel", "prioridade"],
                "exemplos_de_tarefas": [
                    "Consolidar relatorio semanal",
                    "Validar checklist final",
                ],
            },
            {
                "name": "Backlog de Ideias",
                "finalidade": "Guardar ideias antes de entrarem em execucao.",
                "status_sugeridos": ["idea", "triage", "validated", "scheduled"],
                "tags_sugeridas": ["ideia", "backlog", "triagem"],
                "campos_uteis": ["impacto", "esforco", "origem", "prioridade"],
                "exemplos_de_tarefas": [
                    "Explorar nova automacao",
                    "Rever estrutura de navegacao",
                ],
            },
        ],
    }


def build_plan() -> dict[str, object]:
    return {
        "phase": "API segura / testes / dry-run / sem criação real",
        "notion": build_notion_plan(),
        "clickup": build_clickup_plan(),
        "notes": [
            "Dry-run conceitual sem escrita real.",
            "Nenhum --apply.",
            "Nenhum MCP.",
            "Nenhuma criacao de Space, Folder, List, Database ou Page real.",
        ],
    }


def main() -> int:
    try:
        load_env_file()
    except FileNotFoundError as exc:
        print(safe_json({"ok": False, "error": str(exc)}))
        return 1

    print(
        safe_json(
            {
                "ok": True,
                "mode": "dry-run",
                "destination": "bootstrap",
                "would_prepare": build_plan(),
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
