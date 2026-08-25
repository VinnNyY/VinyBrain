# Historico

## 2026-08-04

- Ambiente auditado.
- Projeto criado fora do vault.
- Documentacao criada dentro do Viny Brain.
- Implementada prova de conceito com Node.js, TypeScript, Playwright, SQLite e painel local.
- Criados testes unitarios para regras principais.
- Riscos registrados em `docs/RISCOS-E-LIMITACOES.md` no codigo-fonte.
- Modo padrao alterado de `whitelist` para `all_groups`.
- Painel atualizado para exibir todos os grupos encontrados, filtros e preferencias locais.
- Criado provider de alerta por console e interface para providers futuros, mantendo envio real desativado.
- Teste manual do canal `Alertas Viny Watch` concluido com uma unica mensagem.
- Modo piloto automatico implementado e testado; execucao com `Teste Viny Watch` bloqueada por pre-condicao nao atendida (`pilot_group_not_visible`).
- `Teste Viny Watch` removido da configuracao ativa por inexistencia.
- `production_guarded` ativado com um unico alerta real enviado para `Alertas Viny Watch`.
- Resolucao automatica validada para `Rafael | Stay Cloud`: nova atividade posterior ao alerta foi classificada como `OUTGOING` e a observacao original foi resolvida.
- Corrigido estado residual de erro do scanner: `currentError` passa a limpar apos varredura bem-sucedida, preservando historico tecnico em log.
- Regra de backlog legado endurecida usando tambem o horario exibido na lista. Uma segunda entrega real para `Gubs` ocorreu durante a estabilizacao antes dessa correcao; `deliveryKillSwitch` ficou ativo para impedir novas entregas ate revisao.
