# Guia Operacional - JSON para Notion e ClickUp

## Objetivo

Documentar o fluxo operacional real controlado da Fase 3, em que o `Viny Flow` gera um JSON, o JSON é revisado e os scripts criam conteúdo real em `Notion` e `ClickUp` somente com `--apply`.

## Regras

- `dry-run` continua sendo o padrão.
- `--apply` continua exigindo confirmação explícita.
- Não salvar credenciais no vault.
- Não imprimir token.
- Não criar em local errado.
- Não recriar a estrutura base.
- Exemplo com prefixo `[TESTE]` é apenas para validação. Em uso real, evitar esse prefixo.

## Fluxo para reunião

1. Usar `/registrar-reuniao`.
2. Gerar o JSON de reunião.
3. Salvar o JSON em `18 - Integrações/API/payloads/`.
4. Rodar o dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_notion_meeting_from_json.py" "18 - Integrações/API/payloads/NOME_DO_ARQUIVO.json"
```

5. Revisar o payload e o plano mostrado no terminal.
6. Rodar com `--apply` apenas após confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_notion_meeting_from_json.py" "18 - Integrações/API/payloads/NOME_DO_ARQUIVO.json" --apply
```

## Fluxo para demanda

1. Usar `/processar-demanda`.
2. Gerar o JSON da demanda.
3. Salvar o JSON em `18 - Integrações/API/payloads/`.
4. Rodar o dry-run:

```bash
python3 "18 - Integrações/API/scripts/create_clickup_task_from_json.py" "18 - Integrações/API/payloads/NOME_DO_ARQUIVO.json"
```

5. Revisar o payload e o plano mostrado no terminal.
6. Rodar com `--apply` apenas após confirmação explícita:

```bash
python3 "18 - Integrações/API/scripts/create_clickup_task_from_json.py" "18 - Integrações/API/payloads/NOME_DO_ARQUIVO.json" --apply
```

## Adicionar ClickUp

Esse é o jeito mais curto de iniciar uma demanda para o ClickUp.

### Exemplos

```txt
Adicionar ClickUp
```

```txt
Adicionar ClickUp: revisar tutorial de faturas
```

```txt
Adicionar ClickUp:
- revisar tutorial de faturas
- conferir prints do cPanel
- ajustar checklist final
```

### Como o fluxo reage

- Se faltar informação crítica, o Codex pergunta antes de seguir.
- Se a entrada estiver completa e simples, o Codex gera uma tarefa simples.
- Se a entrada vier em lista, o Codex monta lote simples.
- Se o usuário autorizar criação real, o Codex segue para salvar JSON, rodar `dry-run` e aplicar com `--apply`.
- Se não houver autorização explícita, o Codex só prepara a demanda.
- Se o mesmo payload já tiver sido aplicado, o Codex cria um JSON novo em vez de reaplicar.

## Criação direta via Codex

### Quando usar

- quando o usuário autorizar explicitamente a criação real no ClickUp;
- quando a demanda já tiver sido revisada;
- quando fizer sentido sair do modo manual e executar a tarefa.

### Frases que autorizam

- `crie no ClickUp agora`
- `pode subir no ClickUp`
- `aplica no ClickUp`
- `pode rodar --apply`

### Diferença entre gerar payload e aplicar

- gerar payload: o Codex cria o JSON e prepara a tarefa;
- aplicar: o Codex salva o JSON, roda `dry-run`, valida o resultado e então roda `--apply`;
- se a frase não autorizar explicitamente, o fluxo permanece em JSON + dry-run/manual.

### Regra de aplicação

- sempre rodar `dry-run` antes de `--apply`;
- não repetir `--apply` para o mesmo payload já consumido;
- se houver novo lote ou nova demanda, gerar novo JSON;
- se o `dry-run` não estiver claro, parar antes do `--apply`.

### Exemplo apenas gerar

```txt
/processar-demanda
Só anota:
revisar tutorial de faturas
```

Resultado:

- gera JSON;
- não cria tarefa real.

### Exemplo criar real

```txt
/processar-demanda
Só anota no ClickUp, sem prazo, responsável Vinicius.
crie no ClickUp agora:
revisar tutorial de faturas
```

Resultado:

- gera JSON;
- salva payload;
- roda dry-run;
- roda `--apply`;
- confirma tarefa criada.

### Regra anti-duplicação

- Um payload aplicado não deve ser reaplicado.
- Se houver necessidade de nova execução, criar um novo arquivo JSON.
- Conferir a lista de destino após a criação real.

## Captura rápida em lote para ClickUp

### Exemplo de entrada

```txt
/processar-demanda
Só anota no ClickUp, sem prazo:
- revisar prints do tutorial de cPanel
- conferir tutorial de faturas
- ajustar checklist de publicação
- revisar base de e-mails
```

### Exemplo de saída

- uma tarefa simples para cada item;
- responsável `A definir` quando não informado;
- prazo `A definir` quando não informado;
- prioridade padrão `Média` quando não informada;
- tags padrão `viny-brain` e `captura-rapida`.

### Como salvar o JSON

- Salvar em `18 - Integrações/API/payloads/tasks.batch.example.json` ou em um nome descritivo equivalente.
- Não duplicar o mesmo lote com nomes diferentes.
- Revisar o conteúdo antes de salvar.

### Comando de dry-run

```bash
python3 "18 - Integrações/API/scripts/create_clickup_tasks_batch_from_json.py" "18 - Integrações/API/payloads/tasks.batch.example.json"
```

O dry-run deve mostrar:

- a lista `Demandas Internas` usada como destino;
- o ID da lista;
- a quantidade de tarefas do lote;
- o nome de cada tarefa;
- o aviso de que nenhuma tarefa foi criada.

### Comando com `--apply`

```bash
python3 "18 - Integrações/API/scripts/create_clickup_tasks_batch_from_json.py" "18 - Integrações/API/payloads/tasks.batch.example.json" --apply
```

### Regras

- Revisar antes de aplicar.
- Não duplicar tarefas no mesmo lote.
- Depois de aplicar um payload, não rodar `--apply` novamente para o mesmo arquivo.
- Se houver novo lote, gerar novo JSON com nomes revisados.
- Se o lote vier mal estruturado, abortar antes de escrever.
- `dry-run` sempre vem antes de `--apply`.
- Se o ClickUp rejeitar uma tarefa, a mensagem da API deve ficar visível no terminal.
- Quando o `--apply` concluir, o script em lote também deve mostrar as tarefas atuais da lista de destino para confirmar o estado final.

### Diagnóstico pós-lote

Se houver dúvida se o ClickUp recebeu o lote, usar:

```bash
python3 "18 - Integrações/API/scripts/list_clickup_demandas_internas.py"
```

Esse comando lista as tarefas atuais da `Demandas Internas` com nome, status e URL.

## Captura rápida para ClickUp

Use quando a ideia for só anotar uma demanda simples no ClickUp como lista de afazeres.

- Gerar tarefa curta.
- Evitar descrição longa.
- Manter prazo e responsável como `A definir` quando não forem informados.
- Se faltar informação crítica, perguntar antes de gerar o JSON final.
- Sempre rodar `dry-run` antes do `--apply`.
- Não mandar para Notion se for apenas anotação simples.

## Boas práticas

- Nomear o arquivo JSON de forma descritiva.
- Manter payloads pequenos e claros.
- Remover dados sensíveis antes de salvar.
- Usar o Viny Brain como fonte de raciocínio.
- Usar Notion para leitura compartilhável.
- Usar ClickUp para execução.
