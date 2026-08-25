# Score de Confianca

## Como o score funciona

O detector calcula um `score_original` de `0` a `100` combinando sinais positivos e negativos:

- +30 se o status estiver pendente ou aberto;
- +25 se encontrar palavra clara de acao;
- +25 se detectar plugin da whitelist;
- +10 se detectar dominio;
- +10 se detectar contexto WordPress, site ou dominio;
- -40 se encontrar sinal de conclusao;
- -50 se o status estiver fechado ou resolvido;
- -30 se o assunto parecer de SSL, e-mail, DNS, financeiro ou dominio sem relacao com plugin.

Depois disso, os `gates_aplicados` reduzem o `score_final` e podem bloquear a alta confiança.

## Gates críticos

- Se `tipo_solicitacao` não for `ativacao_plugin`, o score final fica travado e a classificação não pode ser alta confiança.
- Se o plugin não foi identificado, o score final fica limitado.
- Se o domínio não foi identificado, o score final fica limitado.
- Se o ticket estiver fechado, resolvido ou com sinal de conclusão, a classificação vira `IGNORAR`.
- Se o ticket for instalação, licença ou erro, ele nunca vira alta confiança.

## Como interpretar

- `75` ou mais: forte candidato a fila de aprovacao humana, mas apenas se os gates permitirem.
- `40` a `74`: caso duvidoso, revisar manualmente.
- abaixo de `40`: tende a ser ignorado.

## Quando confiar

Confianca maior faz sentido quando:

- o ticket esta pendente;
- existe contexto WordPress;
- o plugin foi reconhecido na whitelist;
- nao ha sinal de conclusao;
- existe dominio ou indicio suficiente para continuar a triagem.
- o tipo de solicitacao e `ativacao_plugin`.

## Quando revisar manualmente

Revisar sempre que:

- o plugin nao estiver claro;
- o dominio estiver ausente;
- o pedido parecer instalacao, licenca ou erro;
- o texto for generico;
- houver risco de falso positivo.
- o score original estiver alto, mas o score final tiver sido travado pelos gates.

## Como ajustar no futuro

- calibrar os pesos com tickets reais anonimizados;
- separar melhor instalacao, licenca, erro e ativacao;
- incluir sinonimos por plugin;
- aplicar score por campos diferentes do assunto e da mensagem;
- revisar os limites de corte conforme a taxa de falso positivo.
