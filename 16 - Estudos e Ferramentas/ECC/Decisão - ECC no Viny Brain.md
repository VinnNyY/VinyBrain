# Decisão - ECC no Viny Brain

## Decisão

O ECC será usado apenas como referência de arquitetura, disciplina operacional e organização de conhecimento.

Não será instalado.
Não será reproduzido como plugin.
Não será copiado em massa.

## O que aproveitar

- separação clara entre agentes, workflows, skills e regras;
- contexto como recurso finito;
- checkpoint e retomada explícitos;
- segurança e verificação como etapas obrigatórias;
- pesquisa com evidência e distinção entre fato e inferência;
- voz de escrita baseada em material real;
- inventário periódico do que está vivo e do que ficou redundante.

## O que não aproveitar agora

- hooks automáticos;
- MCP pesado;
- install global;
- runtime próprio;
- suites de comando para múltiplos harnesses;
- release engine pública;
- automação de observação contínua.

## Justificativa

O Viny Brain já tem uma direção mais simples e controlável com o Viny Flow. O ECC é útil como benchmark de maturidade operacional, mas a complexidade dele só faria sentido se o objetivo fosse manter um ecossistema multi-harness e distribuído.

Como esse não é o objetivo, a escolha correta é pegar os padrões e rejeitar a infraestrutura pesada.

## Próximo passo

Implementar no Viny Flow apenas três melhorias de alta prioridade:

1. auditoria de contexto;
2. auditoria de skills, agentes e workflows;
3. extração de aprendizados da sessão.

## Resultado esperado

O Viny Brain fica mais disciplinado sem virar uma cópia do ECC.
O Viny Flow fica mais claro, mais auditável e mais fácil de retomar.
