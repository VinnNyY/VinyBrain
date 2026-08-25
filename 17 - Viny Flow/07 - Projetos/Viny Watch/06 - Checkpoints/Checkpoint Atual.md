# Checkpoint Atual

Data: 2026-08-04

## Status

Fase 1 expandida para monitoramento automatico de todos os grupos encontrados na aba `Grupos`.

## Validado por testes

- Classificacao `OUTGOING`.
- Classificacao `INCOMING`.
- Classificacao `INTERNAL`.
- Classificacao `UNKNOWN`.
- Calculo de tempo `HH:MM`.
- Tratamento de `Ontem`.
- Tratamento de datas antigas.
- Grupos ignorados.
- Horario comercial.
- Prevencao de duplicidade.
- Janela de repeticao de alerta.
- Resolucao de observacoes.
- Modo `all_groups`.
- Descoberta automatica de grupo novo.
- `INCOMING_PROBABLE`.
- `UNKNOWN` sem bloquear outros grupos.
- Preferencias persistentes por grupo.
- Deduplicacao em multiplos grupos.
- Ordenacao por maior tempo aguardando.

## Pendente de validacao manual

- Revisar casos `UNKNOWN` no painel.
- Confirmacao visual de que nenhuma conversa foi aberta.

## Primeira execucao real

- WhatsApp Web carregado.
- Filtro `Grupos` selecionado.
- Modo atual: `all_groups`.
- Grupos identificados na varredura expandida: 26 persistidos no painel apos limpeza.
- Grupos monitorados: 25.
- Grupos ignorados: 1.
- `OUTGOING`: 0.
- `INTERNAL`: 0.
- `INCOMING`: 0.
- `INCOMING_PROBABLE`: 7.
- `UNKNOWN`: 19, incluindo o grupo de alertas ignorado; revisao manual efetiva: 18.
- Grupos aguardando resposta: 7.
- Alertas simulados acumulados: 7.
- Alertas simulados novos na ultima execucao limpa: 2.
- Grupo `Joao Emanuel <> StayCloud` segue monitorado automaticamente, mas esta em `UNKNOWN`.
- Monitor pausado ao final; painel e Chromium permanecem abertos.

## Observacao operacional

Durante a transicao para `all_groups`, um processo antigo do Viny Watch permaneceu ouvindo a porta `3847` e foi encerrado. Tambem foram removidos registros invalidos gerados por uma versao anterior do parser, que havia interpretado contadores de mensagens e valores com aparencia de telefone como nomes de grupo. O parser agora prioriza `span[title]`, descarta contadores, descarta valores com aparencia de telefone e nao registra telefone em logs.

## Teste manual de entrega - concluido

Data: 2026-08-04

- Provider configurado: `whatsapp_web`.
- Envio automatico: `false`.
- Teste manual: `true`.
- Destino autorizado atual: `Alertas Viny Watch`.
- Mensagem autorizada: teste fixo do Viny Watch, sem dados de clientes.
- Resultado atual: enviado.
- Registro SQLite atual: `manual_test_2026-08-04_retry_11`, status `sent`.
- Horario de conclusao: `2026-08-04 14:29:21`.
- Registro anterior preservado: `manual_test_2026-08-04`, status `failed_destination_validation`.
- Confirmacao visual: 1.
- Mensagens enviadas: 1.
- Segundo envio: bloqueado por `manual_test_already_sent_today`.
- Provider desacoplado do filtro `Grupos`; envio feito via pesquisa por `Alertas Viny Watch`.

Screenshots:

- `/home/vinicius-alves/Projetos/viny-watch/data/manual-test/01-search-result.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/manual-test/02-destination-validated.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/manual-test/03-message-ready.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/manual-test/04-message-sent.png`

Varredura posterior:

- Executada manualmente depois do envio.
- `Alertas Viny Watch` permaneceu em estado `Ignorado`.
- Observacoes do grupo de alerta foram removidas e o scanner foi corrigido para nao registrar observacoes de grupos ignorados.
- Alertas simulados gerados pela varredura de validacao foram limpos; alertas reais enviados: 0.

## Teste piloto automatico

Data: 2026-08-04

- Grupo piloto configurado: `Teste Viny Watch`.
- Destino configurado: `Alertas Viny Watch`.
- `automaticEnabled`: `false`.
- `monitorActive`: `false`.
- `pilotWaitingMinutes`: 2.
- Resultado: nao enviado.
- Motivo: `pilot_group_not_visible`.
- Registro SQLite preservado: `pilot_2026-08-04`, status atualizado para `failed_invalid_pilot_configuration`.
- `pilotEnabled`: `false` apos desarme.
- Screenshot criado: `/home/vinicius-alves/Projetos/viny-watch/data/pilot-test/01-pilot-detected.png`.

Evidencia: a busca lateral por `Teste Viny Watch` retornou uma mensagem dentro de `Alertas Viny Watch`, nao o grupo piloto como conversa/grupo exato. Por isso a pre-condicao falhou e nenhum alerta real foi enviado.
Correcao posterior: `Teste Viny Watch` nao existe e nao faz parte da configuracao ativa.

## Producao controlada

Data: 2026-08-04

- Grupo piloto inexistente removido da configuracao ativa.
- `Alertas Viny Watch` definido somente como destino.
- `delivery.mode`: `production_guarded`.
- `automaticEnabled`: `true`.
- `deliveryKillSwitch`: `false`.
- `pilotEnabled`: `false`.
- `productionActivatedAt`: `2026-08-04T15:07:57.237Z`.
- Grupo selecionado para validacao: `Rafael | Stay Cloud`.
- Classificacao: `INCOMING_PROBABLE`.
- Tempo aguardando: 236 minutos.
- Destino: `Alertas Viny Watch`.
- Status da entrega real: `sent`.
- Registro SQLite: `production_deliveries.id = 1`.
- Horario da entrega: `2026-08-04 15:09:37`.
- Alertas reais enviados nesta validacao: 1.
- Outros pendentes antigos: nao enviados como entrega real.
- Monitor ativo apos validacao: sim.

Screenshots:

- `/home/vinicius-alves/Projetos/viny-watch/data/production-validation/01-source-selected-dashboard.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/production-validation/02-destination-validated.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/production-validation/03-message-ready.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/production-validation/04-message-sent.png`
- `/home/vinicius-alves/Projetos/viny-watch/data/production-validation/05-monitor-active.png`

Configuracao atual:

- `allowedDestinationGroup`: `Alertas Viny Watch`.
- `ignoredGroups`: `Alertas Viny Watch`, `🚨 Alertas Grupos 🚨`, `🚨 Alertas Grupos🚨`.
- Os aliases antigos sao apenas para limpeza/migracao e nao autorizam envio.

## Confirmacoes de seguranca

- Nenhuma sessao foi salva no vault.
- Nenhuma credencial foi acessada.
- Nenhum canal externo foi configurado.
- Foi enviada uma unica mensagem real controlada para `Alertas Viny Watch`.
- Nenhuma mensagem foi enviada para grupos de clientes.
- Nenhum grupo de cliente foi aberto.

## Estabilizacao pos-alerta

Data: 2026-08-04

- Grupo resolvido: `Rafael | Stay Cloud`.
- Atividade anterior: `08:12`, `INCOMING_PROBABLE`.
- Atividade posterior detectada pela lista lateral: `12:31`.
- Classificacao atual: `OUTGOING`.
- Estado atual: `Respondido`.
- `resolvedAt`: `2026-08-04 15:49:49`.
- Entrega original preservada: `production_deliveries.id = 1`, status `sent`.
- Repeticao da entrega original: bloqueada por entrega `sent` e observacao resolvida.
- `currentError`: nenhum apos varredura bem-sucedida.
- Fallback do scanner: quando o filtro `Grupos` nao e clicavel, a lista atual e lida e registrada como `groups_filter_unavailable_using_current_list`.
- Backlog legado: regra corrigida para considerar tambem horario exibido anterior a `productionActivatedAt`.
- Ocorrencia operacional: uma segunda entrega real foi enviada para `Gubs` durante a estabilizacao antes da correcao de backlog legado.
- Estado de protecao: `deliveryKillSwitch = true` para impedir novas entregas ate validacao manual.
- Testes: 56 aprovados.
