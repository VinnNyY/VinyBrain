# Detector de Ativações Pendentes

## Resumo
- Total analisado: 17
- Alta confiança: 3
- Precisa revisar: 9
- Ignorados: 5

## Alta confiança
| Ticket ID | Status | Cliente | Domínio detectado | Plugin detectado | Tipo | Score original | Score final | Gates | Prioridade | Motivo | Próxima ação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | Open | Cliente 1 | exemplo.com.br | Elementor Pro | ativacao_plugin | 100 | 100 | - | fila_ativacao | score alto com sinais consistentes de ativacao; plugin detectado: Elementor Pro | Enviar para fila de aprovacao humana. |
| 12346 | Answered | Cliente 2 | loja.exemplo.com.br | WP Rocket | ativacao_plugin | 100 | 100 | - | fila_ativacao | score alto com sinais consistentes de ativacao; plugin detectado: WP Rocket | Enviar para fila de aprovacao humana. |
| 12354 | Open | Cliente 10 | cliente10.com.br | Rank Math SEO Pro | ativacao_plugin | 100 | 100 | - | fila_ativacao | score alto com sinais consistentes de ativacao; plugin detectado: Rank Math SEO Pro | Enviar para fila de aprovacao humana. |

## Precisa revisar
| Ticket ID | Motivo | Informação faltante | Tipo | Score original | Score final | Gates | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 12347 | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | domínio não informado; plugin não identificado | pedido_generico_plugin | 65 | 59 | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado; domínio não informado | revisar_pedido_generico |
| 12352 | Não é ativação clara. Tipo detectado: instalacao_plugin. | plugin não identificado | instalacao_plugin | 75 | 59 | Não é ativação clara. Tipo detectado: instalacao_plugin.; instalação exige validação de origem/licença antes de qualquer ação; plugin não identificado | revisar_instalacao |
| 12353 | Não é ativação clara. Tipo detectado: licenca_plugin. | domínio não informado; plugin não identificado; domínio necessário para validar licença | licenca_plugin | 65 | 59 | Não é ativação clara. Tipo detectado: licenca_plugin.; pedido de licença não deve virar ativação automática; plugin não identificado; domínio não informado | revisar_licenca |
| 12355 | Não é ativação clara. Tipo detectado: instalacao_plugin. | - | instalacao_plugin | 100 | 69 | Não é ativação clara. Tipo detectado: instalacao_plugin.; instalação exige validação de origem/licença antes de qualquer ação | revisar_instalacao |
| 12356 | Não é ativação clara. Tipo detectado: licenca_plugin. | domínio não informado; domínio necessário para validar licença | licenca_plugin | 90 | 69 | Não é ativação clara. Tipo detectado: licenca_plugin.; pedido de licença não deve virar ativação automática; domínio não informado | revisar_licenca |
| 12357 | Não é ativação clara. Tipo detectado: erro_plugin. | - | erro_plugin | 75 | 69 | Não é ativação clara. Tipo detectado: erro_plugin.; pode ser incidente, conflito ou erro no site | revisar_erro_plugin |
| 12358 | score intermediario ou informacao incompleta | domínio não informado | ativacao_plugin | 90 | 69 | domínio não informado | revisar_pedido_generico |
| 12359 | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | plugin não identificado | pedido_generico_plugin | 75 | 59 | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado | revisar_pedido_generico |
| 12360 | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | plugin não identificado | pedido_generico_plugin | 75 | 59 | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado | revisar_pedido_generico |

## Ignorados
| Ticket ID | Status | Score original | Score final | Gates | Motivo |
| --- | --- | --- | --- | --- | --- |
| 12348 | Open | 20 | 20 | tema não relacionado; Não é ativação clara. Tipo detectado: erro_plugin.; pode ser incidente, conflito ou erro no site; plugin não identificado | tema não relacionado a plugin WordPress |
| 12349 | Open | 0 | 0 | tema não relacionado; Não é ativação clara. Tipo detectado: erro_plugin.; pode ser incidente, conflito ou erro no site; plugin não identificado; domínio não informado | tema não relacionado a plugin WordPress |
| 12350 | Closed | 0 | 0 | status fechado/resolvido; sinal de conclusão encontrado; Não é ativação clara. Tipo detectado: instalacao_plugin.; instalação exige validação de origem/licença antes de qualquer ação; domínio não informado | status fechado ou resolvido |
| 12351 | Resolved | 0 | 0 | status fechado/resolvido; sinal de conclusão encontrado; Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado; domínio não informado | status fechado ou resolvido |
| 12361 | Answered | 15 | 15 | sinal de conclusão encontrado; Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado; domínio não informado | sinal de conclusão encontrado |


## Alertas de segurança
- Nada foi ativado.
- Nenhuma API real foi chamada.
- Nenhum token foi usado.
- Nenhuma credencial foi salva.
- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.
