# Checklist de Backup Local

## Quando usar

- Antes de mudanças grandes no vault.
- Antes de reorganizar pastas importantes.
- Antes de qualquer alteração que possa exigir rollback manual.

## Objetivo

Ter uma rotina manual simples para preservar o estado atual do vault sem criar automação obrigatória.

## O que salvar

- Arquivos que serão alterados.
- Notas em uso ativo.
- Checkpoints e regras que possam precisar de restauração.

## Onde salvar

- Em local previsível e separado do fluxo de edição.
- Em pasta separada do fluxo de edição.
- Com nome claro e data da cópia.

## O que evitar

- Nao duplicar segredos desnecessariamente.
- Nao criar backup automático sem confirmação.
- Nao espalhar cópias em múltiplos lugares sem necessidade.

## Passos manuais

1. Identificar o conjunto de arquivos que pode ser afetado.
2. Copiar a versão atual para o local de backup.
3. Conferir se a cópia abriu corretamente.
4. Só então fazer a mudança principal.

## Resultado esperado

- Risco menor de perda de contexto.
- Rollback manual mais simples.
