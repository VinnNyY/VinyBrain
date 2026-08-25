# Fila de Aprovacao de Plugins

## Resumo
- Total acionavel: 12
- Alta confiança: 3
- Precisa revisar: 9

## Alta confiança
| Ticket ID | Status | Customer Email | Subject | Domain Detected | Plugin Detected | Tipo de solicitação | Score original | Score final | Classification | Reason | Missing Info | Gates applied | Operational priority | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | Open | cliente@example.com | Ativacao de plugin | exemplo.com.br | Elementor Pro | ativacao_plugin | 100 | 100 | ALTA CONFIANCA | score alto com sinais consistentes de ativacao; plugin detectado: Elementor Pro | - | - | fila_ativacao | Enviar para fila de aprovacao humana. |
| 12346 | Answered | cliente2@example.com | Liberar WP Rocket | loja.exemplo.com.br | WP Rocket | ativacao_plugin | 100 | 100 | ALTA CONFIANCA | score alto com sinais consistentes de ativacao; plugin detectado: WP Rocket | - | - | fila_ativacao | Enviar para fila de aprovacao humana. |
| 12354 | Open | cliente10@example.com | Rank Math no dominio principal | cliente10.com.br | Rank Math SEO Pro | ativacao_plugin | 100 | 100 | ALTA CONFIANCA | score alto com sinais consistentes de ativacao; plugin detectado: Rank Math SEO Pro | - | - | fila_ativacao | Enviar para fila de aprovacao humana. |

## Precisa revisar
| Ticket ID | Status | Customer Email | Subject | Domain Detected | Plugin Detected | Tipo de solicitação | Score original | Score final | Classification | Reason | Missing Info | Gates applied | Operational priority | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12347 | Open | cliente3@example.com | Ativacao pendente | - | - | pedido_generico_plugin | 65 | 59 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | domínio não informado; plugin não identificado | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado; domínio não informado | revisar_pedido_generico | Confirmar plugin, domínio e autorização. |
| 12352 | Open | cliente8@example.com | Plugin não permitido | exemplo.com.br | - | instalacao_plugin | 75 | 59 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: instalacao_plugin. | plugin não identificado | Não é ativação clara. Tipo detectado: instalacao_plugin.; instalação exige validação de origem/licença antes de qualquer ação; plugin não identificado | revisar_instalacao | Revisar manualmente. Instalação exige validação de origem/licença antes de qualquer ação. |
| 12353 | Answered | cliente9@example.com | Licenca do plugin | - | - | licenca_plugin | 65 | 59 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: licenca_plugin. | domínio não informado; plugin não identificado; domínio necessário para validar licença | Não é ativação clara. Tipo detectado: licenca_plugin.; pedido de licença não deve virar ativação automática; plugin não identificado; domínio não informado | revisar_licenca | Revisar manualmente. Pedido de licença não deve virar ativação automática. |
| 12355 | Open | cliente11@example.com | Instalacao de plugin | cliente11.com.br | JetEngine | instalacao_plugin | 100 | 69 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: instalacao_plugin. | - | Não é ativação clara. Tipo detectado: instalacao_plugin.; instalação exige validação de origem/licença antes de qualquer ação | revisar_instalacao | Revisar manualmente. Instalação exige validação de origem/licença antes de qualquer ação. |
| 12356 | Answered | cliente12@example.com | Licenca do plugin | - | Elementor Pro | licenca_plugin | 90 | 69 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: licenca_plugin. | domínio não informado; domínio necessário para validar licença | Não é ativação clara. Tipo detectado: licenca_plugin.; pedido de licença não deve virar ativação automática; domínio não informado | revisar_licenca | Revisar manualmente. Pedido de licença não deve virar ativação automática. |
| 12357 | Open | cliente13@example.com | Erro no Elementor | loja12.com.br | Elementor Pro | erro_plugin | 75 | 69 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: erro_plugin. | - | Não é ativação clara. Tipo detectado: erro_plugin.; pode ser incidente, conflito ou erro no site | revisar_erro_plugin | Revisar manualmente. Pode ser incidente, conflito ou erro no site. |
| 12358 | Open | cliente14@example.com | Ativar plugin sem dominio | - | WP Rocket | ativacao_plugin | 90 | 69 | PRECISA REVISAR | score intermediario ou informacao incompleta | domínio não informado | domínio não informado | revisar_pedido_generico | Confirmar plugin, domínio e autorização. |
| 12359 | Open | cliente15@example.com | Plugin novo | cliente15.com.br | - | pedido_generico_plugin | 75 | 59 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | plugin não identificado | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado | revisar_pedido_generico | Confirmar plugin, domínio e autorização. |
| 12360 | Open | cliente16@example.com | Pode ativar? | cliente16.com.br | - | pedido_generico_plugin | 75 | 59 | PRECISA REVISAR | Não é ativação clara. Tipo detectado: pedido_generico_plugin. | plugin não identificado | Não é ativação clara. Tipo detectado: pedido_generico_plugin.; plugin não identificado | revisar_pedido_generico | Confirmar plugin, domínio e autorização. |


## Alertas de segurança
- Nada foi ativado.
- Nenhuma API real foi chamada.
- Nenhum token foi usado.
- Nenhuma credencial foi salva.
- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.
