# Regras do Codex

Sempre que o Codex trabalhar neste vault, ele deve seguir estas regras.

## Antes de executar

1. Ler este arquivo.
2. Ler o arquivo `Contexto do Trabalho.md`.
3. Ler, quando necessário, os arquivos da pasta `07 - Prompts`.
4. Ler `08 - Codex/Protocolo de Sessão.md` quando a tarefa envolver trabalho em varias etapas.
5. Ler `08 - Codex/Checklist de Segurança.md` quando houver risco de segredo, Git ou producao.
6. Ler `08 - Codex/Checklist de Validação de Base.md` quando a tarefa envolver sessao nova, material do curso ou arquivos-base.
7. Entender o objetivo antes de alterar qualquer arquivo.

## Como responder

O Codex deve entregar arquivos organizados, em Markdown, com títulos claros e texto pronto para uso.

## O que evitar

- Não apagar informações importantes sem necessidade.
- Não misturar assuntos diferentes no mesmo arquivo.
- Não gerar texto genérico.
- Não inventar dados.
- Não usar tom robótico.
- Não reproduzir fluxo de Claude Code sem traduzir para o Codex CLI.
- Não incluir Duda em relatórios atuais da equipe.

## Pessoas da equipe

- Rafael e Fael são a mesma pessoa.
- Gabryel faz parte do contexto atual.
- Duda não faz parte do contexto atual e não deve aparecer em novos relatórios, salvo contexto histórico.

## Quando criar relatórios

Usar estrutura objetiva:

1. Contexto
2. Atualizações principais
3. Demandas concluídas
4. Demandas em andamento
5. Pontos de atenção
6. Próximos passos

## Quando revisar textos

Corrigir português, melhorar clareza e manter o tom natural.

## Quando isolar tarefa

- Usar `08 - Codex/Regras de Isolamento de Tarefa.md` para separar fluxos que possam se misturar.
- Se a tarefa mudar de objetivo, encerrar a sessao atual e abrir outra.
- Se existir risco de sobrescrever contexto, pausar e reorganizar.

---

# Histórico de Sessão

Antes de iniciar uma tarefa, verificar também:

`14 - Histórico Codex/Regras de Histórico.md`

Durante o trabalho, manter um histórico organizado da sessão atual em:

`14 - Histórico Codex/Sessões/YYYY-MM-DD.md`

Atualizar esse histórico:

- A cada 10 mensagens enviadas pelo usuário.
- Quando o usuário escrever `Finalizaar`.
- Quando o usuário escrever `Finalizar`.
- Ao concluir uma etapa importante.
- Quando criar ou alterar regras, templates ou estruturas importantes.

O objetivo é permitir que no dia seguinte o trabalho continue de onde parou.
