# Detector de Ativações Pendentes

## Resumo
- Total analisado: 10
- Alta confiança: 3
- Precisa revisar: 3
- Ignorados: 4

## Alta confiança
| Ticket ID | Status | Cliente | Domínio detectado | Plugin detectado | Motivo | Próxima ação |
| --- | --- | --- | --- | --- | --- | --- |
| 12345 | Open | Cliente 1 | exemplo.com.br | Elementor Pro | pedido de ativacao com sinais claros; plugin detectado: Elementor Pro | Enviar para fila de aprovacao humana. |
| 12346 | Answered | Cliente 2 | loja.exemplo.com.br | WP Rocket | pedido de ativacao com sinais claros; plugin detectado: WP Rocket | Enviar para fila de aprovacao humana. |
| 12354 | Open | Cliente 10 | cliente10.com.br | Rank Math SEO Pro | pedido de ativacao com sinais claros; plugin detectado: Rank Math SEO Pro | Enviar para fila de aprovacao humana. |

## Precisa revisar
| Ticket ID | Motivo | Informação faltante |
| --- | --- | --- |
| 12347 | fala de plugin e WordPress, mas nao identifica plugin com clareza | ['dominio nao informado', 'plugin nao identificado'] |
| 12352 | fala de plugin e WordPress, mas nao identifica plugin com clareza | ['plugin nao identificado'] |
| 12353 | fala de plugin e WordPress, mas nao identifica plugin com clareza; dominio nao pode ser validado automaticamente | ['dominio nao informado', 'plugin nao identificado', 'dominio necessario para validar licenca'] |

## Ignorados
12348, 12349, 12350, 12351

## Alertas de segurança
- Nada foi ativado.
- Nenhuma API real foi chamada.
- Nenhum token foi usado.
- Nenhuma credencial foi salva.
- Nenhuma ação em WordPress/cPanel/WHMCS foi executada.
