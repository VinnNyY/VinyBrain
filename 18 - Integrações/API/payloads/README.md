# Payloads de Integração

Esta pasta guarda exemplos de JSON usados como ponte entre o Viny Flow e as integrações reais de `Notion` e `ClickUp`.

## Regras

- Usar apenas dados fictícios.
- Nunca inserir token, chave, senha ou credencial.
- Nunca colocar dados reais de cliente ou operação.
- O JSON é apenas entrada estruturada para os scripts da Fase 3.

## Arquivos

- [`meeting.example.json`](./meeting.example.json)
- [`task.example.json`](./task.example.json)
- [`task.simple.example.json`](./task.simple.example.json)
- [`tasks.batch.example.json`](./tasks.batch.example.json)

## Uso

- `create_notion_meeting_from_json.py` consome o JSON de reunião.
- `create_clickup_task_from_json.py` consome o JSON de demanda.
- `create_clickup_tasks_batch_from_json.py` consome o JSON de lote simples.
- `list_clickup_demandas_internas.py` lista as tarefas atuais da lista alvo para diagnóstico.
- O modo padrão dos scripts continua sendo `dry-run`.
- A criação real exige `--apply` de forma explícita.
- O ClickUp suporta captura `simples` e `detalhado` via `modo` no JSON.
- O ClickUp suporta captura `lote_simples` via JSON em lote.
