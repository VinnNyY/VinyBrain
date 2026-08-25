# Fechamento de Sessão

## 1. Objetivo

Documentar o processo completo para encerrar uma sessão do Codex no `Viny Brain` sem perder contexto, sem registrar informação sensível e sem deixar a retomada ambígua.

## 2. Quando usar

Use este workflow quando:

- a sessão estiver perto do fim;
- uma etapa importante tiver sido concluída;
- houver mudança de foco e a sessão precisar ser fechada antes de abrir outra;
- for preciso garantir retomada segura no dia seguinte;
- existir risco de contexto misturado se o fechamento não for feito.

## 3. Agentes envolvidos

- **Agente Auditor**: confere o que foi feito, o que ficou pendente e se a entrega faz sentido.
- **Agente Segurança**: valida que nada sensível foi salvo ou exposto.
- **Agente Redator**: organiza o fechamento em texto claro, curto e legível.
- **Agente Memória/Checkpoint**: consolida checkpoint, histórico e próximo passo.

## 4. Arquivos obrigatórios de referência

- `17 - Viny Flow/README.md`
- `17 - Viny Flow/00 - Orquestração/Como funciona o Viny Flow.md`
- `17 - Viny Flow/00 - Orquestração/Regras de Orquestração.md`
- `17 - Viny Flow/02 - Workflows/Mapa de Workflows.md`
- `14 - Histórico Codex/Regras de Histórico.md`
- `14 - Histórico Codex/Checkpoint Atual.md`
- `08 - Codex/Protocolo de Sessão.md`
- `08 - Codex/Prompt de Inicialização.md`

## 5. Etapa 1: revisar o que foi feito

1. Ler o que foi alterado na sessão.
2. Ler os arquivos criados.
3. Ler as decisões registradas durante a execução.
4. Confirmar se a entrega corresponde ao objetivo inicial.

Saída esperada:

- resumo do que foi concluído;
- resumo do que ficou em andamento;
- resumo do que mudou no vault.

## 6. Etapa 2: validar arquivos criados e alterados

1. Listar os arquivos criados.
2. Listar os arquivos alterados.
3. Confirmar se cada arquivo pertence ao escopo da sessão.
4. Evitar registrar alterações antigas sem necessidade.

Regra:

- não reescrever histórico antigo sem motivo;
- não inflar a lista com arquivos irrelevantes.

## 7. Etapa 3: registrar decisões importantes

1. Anotar decisões de escopo.
2. Anotar decisões de processo.
3. Anotar decisões de segurança.
4. Anotar decisões de continuidade.

Essas decisões devem ser curtas e objetivas.

## 8. Etapa 4: registrar pendências

1. Listar o que ficou para depois.
2. Separar pendência técnica de pendência de revisão.
3. Indicar o que depende de validação humana.
4. Indicar o que depende de outro workflow.

## 9. Etapa 5: atualizar histórico do dia

1. Registrar o fechamento no `14 - Histórico Codex/Sessões/YYYY-MM-DD.md`.
2. Atualizar a linha do tempo da sessão atual.
3. Registrar arquivos criados e alterados quando isso ajudar na retomada.
4. Registrar próximos passos e problemas encontrados.

Regra:

- não registrar senhas, tokens, cookies ou credenciais;
- não apagar logs;
- não mexer em histórico antigo sem necessidade.

## 10. Etapa 6: atualizar Checkpoint Atual

1. Verificar se a sessão alterou o estado geral do trabalho.
2. Atualizar o checkpoint atual com o que mudou.
3. Indicar o próximo arquivo ou frente de trabalho.
4. Deixar claro se a próxima sessão pode continuar do ponto atual.

## 11. Etapa 7: registrar próximo passo recomendado

1. Definir uma única próxima ação.
2. Evitar listas longas demais.
3. Preferir uma retomada pequena e objetiva.
4. Indicar o workflow adequado para a próxima sessão.

## 12. Etapa 8: confirmar que nada sensível foi salvo

1. Revisar notas finais, rascunhos e histórico.
2. Confirmar que não há segredos, tokens, cookies, senhas ou credenciais.
3. Confirmar que não houve exposição de dados privados.
4. Confirmar que não existe configuração sensível registrada por engano.

## 13. Etapa 9: confirmar que o trabalho pode ser retomado amanhã

1. Verificar se o objetivo ficou claro.
2. Verificar se os arquivos de referência estão apontados.
3. Verificar se o próximo passo está explícito.
4. Verificar se a retomada não depende de memória implícita.

## 14. Checklist final de encerramento

- [ ] O que foi feito ficou resumido
- [ ] Os arquivos criados foram listados
- [ ] Os arquivos alterados foram listados
- [ ] As decisões importantes foram registradas
- [ ] As pendências foram registradas
- [ ] O histórico do dia foi atualizado
- [ ] O Checkpoint Atual foi revisado
- [ ] O próximo passo recomendado foi definido
- [ ] Nada sensível foi salvo
- [ ] O trabalho pode ser retomado amanhã

## 15. Prompt reutilizável para iniciar o fechamento

`Siga o workflow Fechamento de Sessão. Revise o que foi feito, valide os arquivos criados e alterados, registre decisões e pendências, atualize o histórico do dia e o Checkpoint Atual, e confirme que a sessão pode ser retomada amanhã sem perder contexto.`

## 16. Prompt reutilizável para retomar no dia seguinte

`Retome a sessão a partir do último histórico e do Checkpoint Atual. Leia os arquivos de referência, confirme o objetivo atual e continue apenas no escopo aprovado, sem reabrir o que já foi encerrado.`

