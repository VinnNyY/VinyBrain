# Estado Atual - Notion e ClickUp

## Data do bootstrap

- 2026-07-03

## Estrutura criada no Notion

- `Viny Hub`
- `Reuniões`
- `Decisões`
- `Projetos`
- `Relatórios`
- `Processos`
- `Tutoriais`
- `Integrações`

## Estrutura criada no ClickUp

- Space: `Viny Operacional`
- `Demandas Internas`
- `Tutoriais StayCloud`
- `Base de Conhecimento`
- `Integrações`
- `Relatórios e Gestão`
- `Backlog de Ideias`

## Estado dos scripts

- Os scripts `bootstrap_notion_structure.py --apply` e `bootstrap_clickup_structure.py --apply` já foram executados com sucesso.
- Eles não devem ser executados novamente sem auditoria.
- Os próximos testes devem ser controlados e focados em página/tarefa isolada.
- Os scripts `create_test_notion_meeting.py` e `create_test_clickup_task.py` marcam o início da Fase 2.
- Eles devem localizar a estrutura existente antes de criar qualquer item.
- A Fase 2 foi executada com sucesso.
- A página de teste do Notion foi criada dentro de `Reuniões`.
- A tarefa de teste do ClickUp foi criada dentro de `Demandas Internas`.
- A integração foi validada para criação real controlada.
- Os scripts de bootstrap não devem ser repetidos.
- A Fase 3 foi validada como `Fluxo operacional real`.
- Os scripts `create_notion_meeting_from_json.py` e `create_clickup_task_from_json.py` marcam a Fase 3.
- O script `create_clickup_tasks_batch_from_json.py` marca a captura rápida em lote da Fase 3.
- O script `list_clickup_demandas_internas.py` marca a verificação pós-execução da lista `Demandas Internas`.
- Eles recebem JSON como ponte entre o `Viny Flow` e as integrações reais.
- O modo padrão continua sendo `dry-run`.
- A criação real continua dependente de `--apply` explícito.
- A Fase 3 foi testada com sucesso.
- O Notion recebeu a página de teste `"[TESTE] Reunião de validação da integração"` em `Reuniões`.
- O Notion recebeu a página operacional via JSON `"[TESTE] Reunião semanal de exemplo"` em `Reuniões`.
- O ClickUp recebeu a tarefa operacional em `Demandas Internas`.
- O ClickUp agora aceita fluxo conceitual `simples` e `detalhado` para demandas.
- O ClickUp agora aceita fluxo conceitual `lote_simples` para listas rápidas em massa.
- Existem duas páginas de teste no Notion e isso foi registrado como duplicidade esperada da validação.
- Próximos usos reais devem evitar o prefixo `[TESTE]` para não gerar novas páginas de teste.
- O payload `lote-tarefas-teste.json` foi aplicado com sucesso no modo `lote_simples`.
- O ClickUp recebeu as tarefas esperadas em `Viny Operacional > Demandas Internas`.
- A lista `Demandas Internas` passou a conter 5 tarefas, incluindo a tarefa de teste antiga e as 4 tarefas do lote.
- As tarefas do lote aplicado foram:
  - `Revisar prints do tutorial de acesso ao cPanel`
  - `Conferir tutorial de faturas no painel novo`
  - `Ajustar checklist final antes do WordPress`
  - `Revisar base de playbooks de e-mail`
- O modo lista em lote foi validado e não deve ser reaplicado para o mesmo arquivo.
- A regra anti-duplicação agora exige gerar novo JSON se houver novo lote.
- O fluxo correto passou a ser: gerar lista, revisar JSON, rodar `dry-run`, aplicar uma única vez, conferir no ClickUp e registrar resultado.
- O Viny Brain continua como origem do raciocínio.
- O ClickUp recebe tarefas simples ou detalhadas.
- O Notion não é usado para lista simples.

## Fonte de credenciais

- Os tokens continuam fora do vault.
- O arquivo externo continua sendo `/home/vinicius-alves/.config/viny-integrations/.env`.
- Nenhum token deve ser registrado neste arquivo.

## Observações

- Não registrar IDs técnicos aqui quando não forem necessários.
- Se precisar de referência técnica, usar os retornos locais e o `.env` externo fora do vault.
- Esta nota registra apenas o estado operacional atual, sem passo de escrita adicional.
- A Fase 3 deve continuar com `dry-run` disponível e revisão explícita para qualquer escrita real.
- A Fase 3 começou como operação real controlada sobre a estrutura já validada.
- A Fase 3 foi validada com criação real controlada e ponte JSON ativa.
