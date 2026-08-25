# Status Operacional do Codex

## Objetivo

Registrar um status operacional simples para o fluxo `codex-viny`, sem mexer no Codex CLI internamente.

## O que entra no status

- VAULT
- DATA
- SESSÃO
- LOG BRUTO
- CHECKPOINT
- MODELO
- EFFORT
- CONTEXTO
- LIMITE DIÁRIO
- LIMITE SEMANAL

## O que é real

- `MODELO` e `EFFORT` podem vir de `~/.codex/config.toml`.
- `LOG BRUTO` aponta para o arquivo bruto do dia.
- `CHECKPOINT` aponta para o checkpoint atual.

## O que pode ficar como N/D

- `CONTEXTO`
- `LIMITE DIÁRIO`
- `LIMITE SEMANAL`

## Como usar

1. Abrir o terminal e iniciar o fluxo com `codex-viny`.
2. Ler a linha de status exibida no início da sessão.
3. Conferir o arquivo `14 - Histórico Codex/Status Operacional.md`.
4. Se precisar, ajustar valores por variáveis de ambiente no wrapper.

## Variáveis manuais

- `CODEX_STATUS_MODEL`
- `CODEX_STATUS_EFFORT`
- `CODEX_STATUS_SESSION`
- `CODEX_STATUS_CONTEXT`
- `CODEX_STATUS_DAILY`
- `CODEX_STATUS_WEEKLY`
- `CODEX_STATUS_CHECKPOINT`
- `CODEX_STATUS_LOG_STATE`

## Regra de segurança

- Não inventar métricas.
- Não tocar em credenciais.
- Não alterar configuração crítica do Codex.
