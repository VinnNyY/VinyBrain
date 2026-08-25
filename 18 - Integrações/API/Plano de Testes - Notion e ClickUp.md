# Plano de Testes - Notion e ClickUp

## Objetivo

Validar autenticação, montagem de payload e bootstrap em modo seguro, sem criar páginas ou tarefas reais.

## Pré-requisitos

- Arquivo externo disponível em `/home/vinicius-alves/.config/viny-integrations/.env`.
- Nenhum token no vault.
- Nenhuma automação externa ativa.

## Testes de autenticação

### Notion

Comando:

```bash
python3 "18 - Integrações/API/scripts/test_notion_connection.py"
```

Resultado esperado:

- status 200;
- identificação segura do usuário conectado;
- nenhum token impresso.

### ClickUp

Comando:

```bash
python3 "18 - Integrações/API/scripts/test_clickup_connection.py"
```

Resultado esperado:

- status 200;
- lista segura de workspaces autorizados;
- nenhum token impresso.

## Dry-run

### Notion

Comando:

```bash
python3 "18 - Integrações/API/scripts/dry_run_notion_page.py"
```

Resultado esperado:

- payload de página de reunião montado;
- nenhum envio para Notion;
- nenhum dado sensível no output.

### ClickUp

Comando:

```bash
python3 "18 - Integrações/API/scripts/dry_run_clickup_task.py"
```

Resultado esperado:

- payload de tarefa montado;
- nenhum envio para ClickUp;
- nenhum dado sensível no output.

## Dry-run de bootstrap

### Estrutura inicial

Comando:

```bash
python3 "18 - Integrações/API/scripts/dry_run_bootstrap_structure.py"
```

Resultado esperado:

- estrutura inicial conceitual para `Notion` e `ClickUp`;
- nenhum envio para API;
- nenhum segredo impresso;
- nenhuma criação real.

## Bootstrap real com trava

### Notion

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/bootstrap_notion_structure.py"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/bootstrap_notion_structure.py" --apply
```

### ClickUp

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/bootstrap_clickup_structure.py"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/bootstrap_clickup_structure.py" --apply
```

## Testes controlados - Fase 2

### Notion

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_test_notion_meeting.py"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_test_notion_meeting.py" --apply
```

### ClickUp

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_test_clickup_task.py"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_test_clickup_task.py" --apply
```

## Critérios de aprovação

- As variáveis obrigatórias existem.
- Os testes de autenticação retornam resposta válida.
- Os dry-runs mostram apenas o payload que seria enviado.
- O bootstrap dry-run mostra a estrutura planejada sem escrever nada.
- Os scripts de bootstrap real exigem `--apply`.
- Os scripts de Fase 2 localizam a estrutura existente antes de criar qualquer item.
- Nenhuma escrita real acontece.
- Nenhum segredo aparece no terminal.

## Fase 3 - Fluxo operacional real

### Objetivo

- Transformar saídas dos comandos manuais em criação real controlada.
- `/registrar-reuniao` deve gerar página real no Notion dentro de `Reuniões`.
- `/processar-demanda` deve gerar tarefa real no ClickUp dentro de `Demandas Internas`.
- Os comandos devem gerar também um JSON compatível com os scripts operacionais da Fase 3.
- Manter opção de dry-run.
- Manter trava de segurança.
- Nunca salvar credenciais no vault.

### Ponte JSON

- `create_notion_meeting_from_json.py` deve consumir um JSON de reunião com dados fictícios ou aprovados.
- `create_clickup_task_from_json.py` deve consumir um JSON de demanda com dados fictícios ou aprovados.
- O JSON é a ponte entre a saída do `Viny Flow` e a criação real controlada.
- O conteúdo do JSON continua sem tokens, sem credenciais e sem dados sensíveis.
- O guia operacional descreve a ordem recomendada de geração, revisão, dry-run e `--apply`.

### Comandos da Fase 3

#### Notion

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_notion_meeting_from_json.py" "18 - Integrações/API/payloads/meeting.example.json"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_notion_meeting_from_json.py" "18 - Integrações/API/payloads/meeting.example.json" --apply
```

#### ClickUp

Comando em dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_clickup_task_from_json.py" "18 - Integrações/API/payloads/task.example.json"
```

Comando com criação real, somente com confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_clickup_task_from_json.py" "18 - Integrações/API/payloads/task.example.json" --apply
```

### Direção operacional

- A Fase 3 usa a estrutura já validada.
- A criação real continua dependente de confirmação explícita.
- O dry-run segue como forma de validação antes de qualquer escrita.
- A rotina diária deve usar os testes apenas quando houver dúvida de segurança ou de payload.
- Os payloads de Fase 3 devem seguir os exemplos em `payloads/` antes de qualquer escrita.
- O prefixo `[TESTE]` deve ficar restrito às validações.

### Diagnóstico do lote ClickUp

Comando:

```bash
python3 "18 - Integrações/API/scripts/create_clickup_tasks_batch_from_json.py" "18 - Integrações/API/payloads/tasks.batch.example.json"
```

Resultado esperado em `dry-run`:

- modo e lista de destino visíveis;
- ID da lista visível;
- quantidade de tarefas visível;
- nomes das tarefas visíveis;
- aviso explícito de que nada foi criado.

Comando para verificar o estado atual da lista:

```bash
python3 "18 - Integrações/API/scripts/list_clickup_demandas_internas.py"
```

Resultado esperado:

- tarefas atuais da lista `Demandas Internas`;
- nome, status e URL de cada tarefa;
- nenhum token impresso.

### Validação do lote simples

- O payload `18 - Integrações/API/payloads/lote-tarefas-teste.json` foi aplicado com sucesso.
- A lista `Demandas Internas` agora contém as quatro tarefas esperadas do lote e a tarefa de teste antiga.
- O mesmo arquivo não deve receber `--apply` novamente.
- Se houver um novo lote, gerar um novo JSON e repetir o ciclo de revisão, `dry-run` e `apply` único.

## Critérios de reprovação

- Token impresso.
- Variável faltante sem explicação.
- Escrita real tentada.
- MCP ativado.
- `--apply` usado antes da fase correta.
