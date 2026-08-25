# Detector de Ativações Pendentes

## Resumo
- Total analisado: 17
- Alta confiança: 3
- Precisa revisar: 10
- Ignorados: 4

## Alta confiança
| Ticket ID | Status | Cliente | Domínio detectado | Plugin detectado | Tipo | Score | Motivo | Próxima ação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | Open | Cliente 1 | exemplo.com.br | Elementor Pro | ativacao_plugin | 100 | score alto com sinais consistentes de ativacao; plugin detectado: Elementor Pro | Enviar para fila de aprovacao humana. |
| 12346 | Answered | Cliente 2 | loja.exemplo.com.br | WP Rocket | ativacao_plugin | 100 | score alto com sinais consistentes de ativacao; plugin detectado: WP Rocket | Enviar para fila de aprovacao humana. |
| 12354 | Open | Cliente 10 | cliente10.com.br | Rank Math SEO Pro | ativacao_plugin | 100 | score alto com sinais consistentes de ativacao; plugin detectado: Rank Math SEO Pro | Enviar para fila de aprovacao humana. |

## Precisa revisar
| Ticket ID | Motivo | Informação faltante | Tipo | Score |
| --- | --- | --- | --- | --- |
| 12347 | fala de plugin, mas nao esta claro ou nao esta autorizado na whitelist | ['dominio nao informado', 'plugin nao identificado'] | pedido_generico_plugin | 65 |
| 12352 | pedido parece ser de instalacao e nao ativacao | ['plugin nao identificado'] | instalacao_plugin | 75 |
| 12353 | pedido parece ser de licenca | ['dominio nao informado', 'plugin nao identificado', 'dominio necessario para validar licenca'] | licenca_plugin | 65 |
| 12355 | pedido parece ser de instalacao e nao ativacao | [] | instalacao_plugin | 100 |
| 12356 | pedido parece ser de licenca | ['dominio nao informado', 'dominio necessario para validar licenca'] | licenca_plugin | 90 |
| 12357 | pedido parece ser de erro ou problema em plugin | [] | erro_plugin | 75 |
| 12358 | falta clareza para confirmar ativacao | ['dominio nao informado'] | ativacao_plugin | 90 |
| 12359 | falta clareza para confirmar ativacao | ['plugin nao identificado'] | pedido_generico_plugin | 75 |
| 12360 | falta clareza para confirmar ativacao | ['plugin nao identificado'] | pedido_generico_plugin | 75 |
| 12361 | fala de plugin, mas nao esta claro ou nao esta autorizado na whitelist | ['dominio nao informado', 'plugin nao identificado'] | pedido_generico_plugin | 55 |

## Ignorados
| Ticket ID | Status | Motivo |
| --- | --- | --- |
| 12348 | Open | tema nao relacionado a plugin WordPress |
| 12349 | Open | tema nao relacionado a plugin WordPress |
| 12350 | Closed | status fechado ou resolvido |
| 12351 | Resolved | status fechado ou resolvido |


## Alertas de segurança
- Nada foi ativado.
- Nenhuma API real foi chamada.
- Nenhum token foi usado.
- Nenhuma credencial foi salva.
- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.
