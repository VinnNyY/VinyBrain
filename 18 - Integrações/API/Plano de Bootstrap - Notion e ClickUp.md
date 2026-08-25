# Plano de Bootstrap - Notion e ClickUp

## Objetivo

Descrever a estrutura profissional inicial que seria criada em `Notion` e `ClickUp`, mas somente em modo de dry-run.

## Princípios

- Nenhuma criação real nova sem auditoria.
- O bootstrap real inicial já foi executado.
- Nenhum MCP.
- Nenhum token no vault.
- Nenhuma automação externa.
- Se faltar contexto, o plano fica em nível conceitual.

## Estrutura proposta

### Notion

- `Viny Hub`
- Subpáginas sugeridas:
  - `Reuniões`
  - `Decisões`
  - `Projetos`
  - `Relatórios`
  - `Processos`
  - `Tutoriais`
  - `Integrações`

### Notion detalhado

- `Reuniões`
  - Finalidade: registrar encontros com contexto, resumo e próximos passos.
  - Dados que entram: título, data, participantes, resumo executivo, decisões, pendências, próximos passos.
  - O que vem do Viny Brain: contexto consolidado, decisões finais, links internos, riscos e pendências.
  - O que não deve ser enviado: anotações soltas sem validação, segredos, tokens, dados sensíveis de cliente.

- `Decisões`
  - Finalidade: centralizar decisões claras e rastreáveis.
  - Dados que entram: decisão, data, motivo, impacto, status.
  - O que vem do Viny Brain: decisão consolidada, histórico, contexto, observações de risco.
  - O que não deve ser enviado: rascunhos internos, informação incompleta sem dono, material sensível sem necessidade.

- `Projetos`
  - Finalidade: mostrar visão geral e acompanhamento macro.
  - Dados que entram: nome do projeto, objetivo, escopo, status, responsável, prazo.
  - O que vem do Viny Brain: visão estratégica, premissas, riscos, dependências.
  - O que não deve ser enviado: detalhes operacionais excessivos, segredos de acesso, dados sensíveis não autorizados.

- `Relatórios`
  - Finalidade: guardar versões compartilháveis e consultáveis.
  - Dados que entram: título, período, resumo, conclusões, pendências.
  - O que vem do Viny Brain: versão final, contexto, decisões de consolidação.
  - O que não deve ser enviado: versão interna bruta, segredos, informação que não precisa ser pública.

- `Processos`
  - Finalidade: registrar fluxos e padrões operacionais estáveis.
  - Dados que entram: nome do processo, objetivo, passos, responsável, critério de uso.
  - O que vem do Viny Brain: fluxo aprovado, regras de operação, lições consolidadas.
  - O que não deve ser enviado: atalhos temporários, segredos, dados sensíveis desnecessários.

- `Tutoriais`
  - Finalidade: organizar guias e referências.
  - Dados que entram: tema, passos, observações, links, status editorial.
  - O que vem do Viny Brain: conteúdo consolidado, aprendizados, links de apoio.
  - O que não deve ser enviado: rascunho não validado, prints sensíveis, credenciais.

- `Integrações`
  - Finalidade: documentar a camada operacional de integrações e regras.
  - Dados que entram: fase, escopo, status, restrições, próximo passo.
  - O que vem do Viny Brain: regras de segurança, decisões de fase, testes aprovados.
  - O que não deve ser enviado: tokens, segredos, payloads com dados reais.

### ClickUp

- Space sugerido: `Viny Operacional`
- Folders/Listas sugeridas:
  - `Demandas Internas`
  - `Tutoriais StayCloud`
  - `Base de Conhecimento`
  - `Integrações`
  - `Relatórios e Gestão`
  - `Backlog de Ideias`

### ClickUp detalhado

- `Demandas Internas`
  - Finalidade: centralizar pedidos e solicitações internas.
  - Status sugeridos: `to do`, `in progress`, `review`, `done`.
  - Tags sugeridas: `interna`, `prioridade`, `bloqueio`, `seguimento`.
  - Campos úteis: responsável, prazo, origem, prioridade, tipo.
  - Exemplos de tarefas: ajustar checklist de fluxo, validar regra de segurança.

- `Tutoriais StayCloud`
  - Finalidade: acompanhar produção, revisão e publicação de tutoriais.
  - Status sugeridos: `draft`, `editing`, `review`, `ready`, `published`.
  - Tags sugeridas: `staycloud`, `tutorial`, `seo`, `print`.
  - Campos úteis: URL, responsável, fase, prazo, `seo_score`.
  - Exemplos de tarefas: revisar tutorial de acesso ao painel, capturar novas imagens de um passo.

- `Base de Conhecimento`
  - Finalidade: organizar curadoria e manutenção de playbooks.
  - Status sugeridos: `backlog`, `curation`, `validated`, `published`.
  - Tags sugeridas: `playbook`, `referencia`, `kb`, `curadoria`.
  - Campos úteis: tema, origem, nível, responsável, validação.
  - Exemplos de tarefas: importar playbook de hospedagem, revisar conteúdo antigo.

- `Integrações`
  - Finalidade: acompanhar evolução e testes das integrações.
  - Status sugeridos: `test`, `dry-run`, `blocked`, `ready`, `apply-ready`.
  - Tags sugeridas: `notion`, `clickup`, `api`, `dry-run`.
  - Campos úteis: sistema, fase, risco, evidência, responsável.
  - Exemplos de tarefas: validar autenticação do Notion, revisar dry-run de bootstrap.

- `Relatórios e Gestão`
  - Finalidade: acompanhar relatórios, consolidação e revisões de gestão.
  - Status sugeridos: `draft`, `review`, `approved`, `sent`.
  - Tags sugeridas: `relatorio`, `gestao`, `consolidacao`.
  - Campos úteis: período, destino, responsável, prioridade.
  - Exemplos de tarefas: consolidar relatório semanal, validar checklist final.

- `Backlog de Ideias`
  - Finalidade: guardar ideias antes de entrarem em execução.
  - Status sugeridos: `idea`, `triage`, `validated`, `scheduled`.
  - Tags sugeridas: `ideia`, `backlog`, `triagem`.
  - Campos úteis: impacto, esforço, origem, prioridade.
  - Exemplos de tarefas: explorar nova automação, rever estrutura de navegação.

## Ordem sugerida

1. Validar autenticação.
2. Validar o dry-run da página inicial do Notion.
3. Validar o dry-run da tarefa inicial do ClickUp.
4. Validar o dry-run de bootstrap da estrutura.
5. Quando houver liberação explícita, rodar `bootstrap_notion_structure.py --apply`.
6. Quando houver liberação explícita, rodar `bootstrap_clickup_structure.py --apply`.
7. Registrar pendências e confirmar o que foi criado.

## Fase 2 - Testes controlados

### Objetivo

- Criar uma página controlada no Notion dentro de `Reuniões`.
- Criar uma tarefa controlada no ClickUp dentro de `Demandas Internas`.
- Validar o payload.
- Validar segurança.
- Decidir se os scripts podem virar fluxo operacional.

### Direção

- A próxima etapa não cria novas estruturas base.
- A próxima etapa trabalha sobre a estrutura existente.
- O foco passa a ser teste isolado, segurança e confirmação de aderência.
- Os scripts desta fase devem localizar `Reuniões` e `Demandas Internas` antes de qualquer criação.

## Resultado esperado

- Um mapa inicial claro.
- Nenhuma escrita real.
- Nenhum dado sensível exposto.
- Um ponto de partida para a próxima fase, se e somente se houver liberação explícita.
