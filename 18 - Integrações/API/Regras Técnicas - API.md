# Regras Técnicas - API

## Objetivo

Manter a integração com `Notion` e `ClickUp` em uma fase segura, com autenticação, dry-run e bootstrap conceitual antes de qualquer escrita real.

## Regras

- Usar apenas scripts locais de teste e dry-run.
- Ler credenciais do arquivo externo `/home/vinicius-alves/.config/viny-integrations/.env`.
- Nunca salvar token no Obsidian.
- Nunca imprimir token no terminal.
- Nunca registrar segredo no histórico ou checkpoint.
- Nunca ativar MCP.
- Nunca criar automação externa nesta fase.
- `--apply` existe apenas como trava explícita para criação real e exige ação manual.
- Nunca transformar o dry-run em criação real sem confirmação explícita.
- O bootstrap real inicial já foi executado e a Fase 3 já foi validada como operação real controlada.
- A Fase 2 deve localizar `Reuniões` e `Demandas Internas` antes de criar qualquer item.
- Se a estrutura esperada não for encontrada, o script deve abortar sem tentar criar em local errado.
- A Fase 3 deve manter `dry-run` disponível, tratar JSON como ponte operacional e nunca salvar credenciais no vault.

## Notion

- Endpoint de teste seguro: `GET /v1/users/me`.
- Header de autenticação: `Authorization: Bearer <token>`.
- Header de versão: `Notion-Version: 2026-03-11`.

## ClickUp

- Endpoint de teste seguro: `GET /api/v2/team`.
- Header de autenticação: `Authorization: <personal_token>`.
- Tokens pessoais da ClickUp começam com `pk_`.

## Erros esperados

- Se faltar variável, mostrar apenas o nome da variável ausente.
- Se a autenticação falhar, mostrar status e mensagem segura.
- Se a resposta vier vazia ou inválida, tratar como falha de teste.
- Se o bootstrap dry-run detectar ausência de contexto, mostrar o plano como conceitual.

## Critério de avanço

- Autenticação aprovada.
- Dry-run aprovado.
- Revisão de segurança sem pendências.
- Confirmação explícita antes de qualquer criação real.
