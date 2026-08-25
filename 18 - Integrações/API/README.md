# API

Camada técnica segura para validar `Notion` e `ClickUp` com autenticação, dry-run, bootstrap e testes controlados.

## Estado atual

- Apenas autenticação, dry-run e operação real controlada.
- O bootstrap real inicial já foi executado.
- Os testes controlados da Fase 2 foram concluídos com sucesso.
- A Fase 3 foi validada com sucesso e passou a operar como fluxo operacional real controlado.
- A ponte principal agora é `JSON` entre `Viny Flow` e `Notion` / `ClickUp`.
- O guia operacional de JSON documenta o fluxo recomendado.
- O ClickUp agora reconhece captura `simples` e `detalhado` como comportamento esperado da Fase 3.
- O ClickUp também reconhece captura `lote_simples` para listas rápidas em massa.
- Nenhuma automação externa.
- Nenhum token no vault.
- `--apply` existe apenas como trava explícita para criação real.
- Nenhum MCP.
- Nenhuma recriação de `Space`, `Folder`, `List`, `Database` ou `Page` base.

## Estrutura

- [`env.example`](./env.example)
- [`Regras Técnicas - API.md`](./Regras%20Técnicas%20-%20API.md)
- [`Plano de Testes - Notion e ClickUp.md`](./Plano%20de%20Testes%20-%20Notion%20e%20ClickUp.md)
- [`Plano de Bootstrap - Notion e ClickUp.md`](./Plano%20de%20Bootstrap%20-%20Notion%20e%20ClickUp.md)
- [`scripts/test_notion_connection.py`](./scripts/test_notion_connection.py)
- [`scripts/test_clickup_connection.py`](./scripts/test_clickup_connection.py)
- [`scripts/dry_run_notion_page.py`](./scripts/dry_run_notion_page.py)
- [`scripts/dry_run_clickup_task.py`](./scripts/dry_run_clickup_task.py)
- [`scripts/dry_run_bootstrap_structure.py`](./scripts/dry_run_bootstrap_structure.py)
- [`scripts/bootstrap_notion_structure.py`](./scripts/bootstrap_notion_structure.py)
- [`scripts/bootstrap_clickup_structure.py`](./scripts/bootstrap_clickup_structure.py)
- [`scripts/create_test_notion_meeting.py`](./scripts/create_test_notion_meeting.py)
- [`scripts/create_test_clickup_task.py`](./scripts/create_test_clickup_task.py)
- [`scripts/create_notion_meeting_from_json.py`](./scripts/create_notion_meeting_from_json.py)
- [`scripts/create_clickup_task_from_json.py`](./scripts/create_clickup_task_from_json.py)
- [`scripts/create_clickup_tasks_batch_from_json.py`](./scripts/create_clickup_tasks_batch_from_json.py)
- [`scripts/list_clickup_demandas_internas.py`](./scripts/list_clickup_demandas_internas.py)
- [`Estado Atual - Notion e ClickUp.md`](./Estado%20Atual%20-%20Notion%20e%20ClickUp.md)
- [`Guia Operacional - JSON para Notion e ClickUp.md`](./Guia%20Operacional%20-%20JSON%20para%20Notion%20e%20ClickUp.md)
- [`payloads/`](./payloads/)

## Fonte de credenciais

- O arquivo real de ambiente fica fora do vault em `/home/vinicius-alves/.config/viny-integrations/.env`.
- O `env.example` no vault existe só como referência de campos.
- Nunca registrar token real no Obsidian, no histórico ou no checkpoint.

## Fluxo seguro

1. Confirmar que o arquivo externo existe.
2. Testar autenticação do `Notion`.
3. Testar autenticação do `ClickUp`.
4. Rodar os dry-runs de `Notion`, `ClickUp` e bootstrap.
5. Usar `--apply` apenas quando houver confirmação explícita e revisão humana.
6. O bootstrap real inicial já foi executado.
7. Os testes controlados da Fase 2 já foram concluídos com sucesso.
8. A Fase 3 usa `JSON` como ponte operacional entre o `Viny Flow` e as integrações.
9. Os scripts de Fase 3 devem consumir saídas operacionais e criar apenas quando houver confirmação explícita.
10. O guia operacional descreve o fluxo recomendado para reunião e demanda.
11. O fluxo em lote do ClickUp deve mostrar a lista usada, o ID da lista, o resultado por tarefa e a resposta da API quando houver falha.
12. O script `list_clickup_demandas_internas.py` serve como verificação pós-execução para listar as tarefas atuais da lista alvo.

## Regra

- Se houver dúvida, parar no dry-run.
- Se houver erro de autenticação, corrigir sem tentar criar nada.
- Se houver risco de exposição, abrir `Revisão de Segurança` antes de continuar.
