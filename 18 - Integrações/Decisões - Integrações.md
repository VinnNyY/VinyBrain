# Decisões - Integrações

## Decisões registradas

- `Viny Brain` será a fonte de verdade de memória, decisão e contexto.
- `Notion` será usado como camada de documentação compartilhável e visual.
- `ClickUp` será usado como camada de execução e acompanhamento.
- A primeira fase será manual, sem API e sem automação.
- O piloto 01 deve separar claramente a saída para Notion, a saída para ClickUp, as decisões do Viny Brain e as pendências e follow-ups.
- O piloto 02 deve separar análise da demanda, saída para ClickUp, registro mínimo no Viny Brain e regra clara para usar Notion apenas quando necessário.
- Qualquer fase técnica futura exigirá revisão de segurança antes da implementação.
- A fase técnica real começou com scripts locais em Python padrão, credenciais fora do vault e dry-run antes de qualquer escrita.
- Nenhuma criação real é permitida antes de autenticação validada, dry-run validado e confirmação explícita.
- `--apply` fica proibido nesta fase inicial.
- A fase atual foi consolidada como `API segura / testes / dry-run / sem criação real`.
- O bootstrap profissional inicial deve existir apenas como plano conceitual enquanto não houver liberação explícita para criação real.
- Os scripts de bootstrap real devem nascer com `--apply` como trava explícita, mas rodar em dry-run por padrão.
- O bootstrap real de `Notion` e `ClickUp` foi realizado com sucesso.
- O `Viny Brain` continua como fonte de raciocínio e memória.
- `Notion` passa a operar como camada visual/documental.
- `ClickUp` passa a operar como camada operacional de tarefas.
- A próxima fase passa a ser `Fase 2 - Testes controlados`.
- Os próximos testes devem criar apenas uma página controlada no Notion e uma tarefa controlada no ClickUp.
- A Fase 2 deve localizar a estrutura existente antes de criar qualquer item.
- Não recriar `Viny Hub` nem `Viny Operacional`.
- A integração `Notion + ClickUp` passou nos testes controlados.
- Podemos avançar para fluxos operacionais reais.
- Criações reais continuam exigindo confirmação explícita ou uso consciente de `--apply`.
- `Viny Brain` segue como cérebro e fonte de raciocínio.
- `Notion` segue como camada documental.
- `ClickUp` segue como camada operacional.
- A próxima fase passa a ser `Fase 3 - Fluxo operacional real`.
- A Fase 3 começou com scripts operacionais que recebem JSON como ponte entre `Viny Flow`, `Notion` e `ClickUp`.
- O `dry-run` continua como padrão.
- `--apply` continua exigindo ação manual explícita.
- A estrutura base não deve ser recriada.
- A integração operacional via JSON foi validada.
- O fluxo recomendado agora é: gerar JSON pelo `Viny Flow`, revisar payload, rodar `dry-run` e aplicar com `--apply` somente após confirmação.
- O `Viny Brain` continua gerando o raciocínio.
- `Notion` e `ClickUp` recebem apenas saídas revisadas.
- O prefixo `[TESTE]` é restrito à validação e deve ser evitado em usos reais.
- O modo lista em lote do ClickUp foi validado com sucesso.
- O payload `lote-tarefas-teste.json` passa a ser tratado como consumido e não deve ser reaplicado.
- Qualquer novo lote deve nascer de novo JSON, com revisão e `dry-run` antes de qualquer `--apply`.
- Lista simples continua indo apenas para o ClickUp, sem acionar o Notion.
- O Viny Brain permanece como origem do raciocínio para lotes, tarefas simples e tarefas detalhadas.

## Pendências

- Definir o primeiro fluxo piloto.
- Definir quais campos mínimos entram em cada ferramenta.
- Definir um modelo visual de reunião e um modelo simples de demanda.
- Rever se a estrutura profissional inicial precisa de campos adicionais antes de qualquer escrita real.
- Confirmar a ordem final de criação em `Notion` e `ClickUp` antes do primeiro `--apply`.
- Definir os payloads de teste controlado para página de reunião e tarefa de demanda.
- Validar o comportamento dos scripts de Fase 2 em dry-run antes de qualquer escrita real.
- Definir a ordem operacional entre `/registrar-reuniao` e `/processar-demanda` na Fase 3.

## Próximas decisões esperadas

- Se a fase manual funcionar, decidir se vale passar para integração assistida.
- Se houver duplicidade excessiva, simplificar antes de conectar qualquer coisa.
- Validar os testes de autenticação e os dry-runs antes de decidir qualquer escrita real.
