# Resultado da limpeza de conexões — Onda 1

## Resumo

Limpeza conservadora executada em 2026-08-06 usando o `Agente Governança do Viny Brain`, com critérios de `/auditar-governanca`, `/auditar-contexto`, `/quality-gate` e `/checkpoint`.

A matriz anterior não tinha linhas que cumprissem simultaneamente `confidence >= 0.95`, `risk = baixo` e `requires_manual_review = false`. Por isso, a limpeza automática foi limitada a casos revalidados localmente como inequívocos: self-link confirmado, wikilinks quebrados criados pelo relatório anterior e regras preventivas de alta segurança.

Nenhuma nota foi excluída. Nenhuma fonte, decisão, reunião, rastreabilidade, MOC saudável, agente ou workflow operacional foi removido.

## Linha de base

- Controle Git: não disponível no vault (`fatal: not a git repository`).
- Backup externo: `/home/vinicius-alves/viny-brain-backups/Conexoes Obsidian/Onda 1 - 2026-08-06`.
- Métricas salvas em `/home/vinicius-alves/viny-brain-backups/Conexoes Obsidian/Onda 1 - 2026-08-06/baseline-metrics.json`.

| Métrica | Antes | Depois |
| --- | --- | --- |
| Notas Markdown operacionais | 777 | 778 |
| Links internos | 798 | 799 |
| Média de links por nota | 1.03 | 1.03 |
| Mediana de links por nota | 0 | 0.0 |
| Links duplicados | 107 | 107 |
| Self-links | 1 | 0 |
| Links quebrados | 31 | 19 |
| Notas órfãs | 524 | 524 |
| Links genéricos | 130 da matriz anterior | 130 preservados/revisão manual |
| Links redundantes | 106 da matriz anterior | 105 preservados + 1 aplicado |
| Links obsoletos | 0 da matriz anterior | 0 |
| Conexões entre projetos distintos | 233 da matriz anterior | 233 preservadas/revisão manual |

Observação: o número de links internos considera também novos registros de rastreabilidade criados nesta execução. A limpeza real removeu 1 self-link e neutralizou 12 links quebrados no relatório anterior.

## Alterações aplicadas

- Removido 1 self-link em `18 - Integrações/README.md`.
- Neutralizados 12 wikilinks quebrados no relatório de auditoria anterior, convertendo exemplos para texto/caminho em código.
- Atualizadas regras preventivas em 4 arquivos de agente/workflow/regras.
- Criada matriz pós-limpeza com status por linha da matriz original.
- Criado este relatório de resultado.

## Links duplicados removidos

Nenhum link duplicado foi removido automaticamente. Os duplicados da matriz aparecem majoritariamente em MOCs, índices, relatórios históricos ou seções editoriais diferentes. Como a matriz marcava esses itens com `requires_manual_review = sim`, eles foram preservados nesta onda.

## Self-links removidos

| Arquivo | Antes | Depois | Motivo |
| --- | --- | --- | --- |
| 18 - Integrações/README.md | link para a própria nota com alias `README` | `Esta nota: visão geral das integrações.` | self-link confirmado, sem função técnica |

## Links quebrados corrigidos

Não houve correção de destino com substituto de conteúdo externo. Foram neutralizados 12 wikilinks quebrados que estavam dentro do relatório de auditoria anterior por erro de formatação de tabela. O conteúdo foi preservado como texto contextual, sem criar conexões artificiais.

## Links obsoletos tratados

Nenhum. A matriz anterior não indicou obsoletos com alta confiança automática.

## Links globais reduzidos

Nenhum link global de MOC/hub foi removido nesta execução. Os candidatos exigiam avaliação semântica e foram mantidos para revisão manual.

## Agentes e templates ajustados

| Arquivo | Ajuste |
| --- | --- |
| 17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md | adicionado critério anti-poluição para links e conexões |
| 17 - Viny Flow/01 - Agentes/Agente Base de Conhecimento.md | adicionadas regras contra link por palavra-chave, hubs artificiais e duplicação sem função |
| 17 - Viny Flow/02 - Workflows/Importar Playbooks.md | limitada criação automática de links globais e duplicados |
| 13 - Base de Conhecimento/00 - Índice/Regras para Playbooks.md | reforçadas regras de conexão contextual e contra listas genéricas |

## Métricas antes e depois

Top hubs antes:

| Nota | Saída | Backlinks | Grau |
| --- | --- | --- | --- |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 105 | 39 | 144 |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | 49 | 41 | 90 |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 70 | 5 | 75 |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 44 | 6 | 50 |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 48 | 1 | 49 |
| 00 - Mapas/MOC - Viny Brain.md | 45 | 3 | 48 |
| Home.md | 37 | 1 | 38 |
| 17 - Viny Flow/README.md | 19 | 6 | 25 |
| 13 - Base de Conhecimento/01 - Playbooks/Guia Interno Staycloud - Apontamentos DNS.md | 9 | 15 | 24 |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | 20 | 4 | 24 |

Top hubs depois:

| Nota | Saída | Backlinks | Grau |
| --- | --- | --- | --- |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 105 | 39 | 144 |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | 49 | 41 | 90 |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 70 | 5 | 75 |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 44 | 6 | 50 |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 48 | 1 | 49 |
| 00 - Mapas/MOC - Viny Brain.md | 45 | 3 | 48 |
| Home.md | 37 | 1 | 38 |
| 17 - Viny Flow/README.md | 19 | 6 | 25 |
| 13 - Base de Conhecimento/01 - Playbooks/Guia Interno Staycloud - Apontamentos DNS.md | 9 | 15 | 24 |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | 20 | 4 | 24 |

## Arquivos alterados

| Arquivo | Linhas adicionadas | Linhas removidas |
| --- | --- | --- |
| 18 - Integrações/README.md | 1 | 1 |
| 06 - Relatórios/Auditoria de Conexões do Obsidian - 2026-08-06.md | 4 | 4 |
| 17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md | 9 | 0 |
| 17 - Viny Flow/01 - Agentes/Agente Base de Conhecimento.md | 4 | 1 |
| 17 - Viny Flow/02 - Workflows/Importar Playbooks.md | 3 | 1 |
| 13 - Base de Conhecimento/00 - Índice/Regras para Playbooks.md | 3 | 1 |
| 14 - Histórico Codex/Checkpoint Atual.md | 19 | 0 |
| 14 - Histórico Codex/Sessões/2026-08-06.md | 11 | 0 |

Arquivos novos:

- `06 - Relatórios/Resultado da Limpeza de Conexões - Onda 1 - 2026-08-06.md`
- `06 - Relatórios/Matriz de Conexões - Resultado Onda 1 - 2026-08-06.csv`

## Conexões preservadas

- Links semânticos fortes preservados: 138 da matriz original.
- Links de navegação preservados: 289 da matriz original.
- Links de histórico/rastreabilidade preservados: 9 da matriz original.
- MOCs saudáveis preservados: `Mapa por Temas`, `Índice Geral`, `Painel Operacional`, `MOC - Tutoriais StayCloud`, `MOC - Viny Brain`.
- Relações entre agentes, workflows e comandos preservadas.
- Links de reuniões, decisões e demandas preservados.

## Itens que exigem revisão manual

| Status na matriz pós-limpeza | Quantidade |
| --- | --- |
| needs_review | 417 |
| preserved | 292 |
| applied | 1 |

Principais grupos preservados para revisão:

- Duplicados em MOCs/índices que podem ter função editorial por tema.
- Links globais em Home, Painel Operacional e MOC do Viny Brain.
- Links entre StayCloud e Viny Flow em relatórios históricos.
- Links de playbooks para `Índice Geral` e `Mapa por Temas`, que são intencionais no fluxo antigo.

## Riscos

- A limpeza de duplicados em MOCs pode prejudicar navegação temática se feita mecanicamente.
- Remover links de relatórios históricos pode perder rastreabilidade de auditoria.
- A próxima redução visual relevante depende de revisão semântica dos hubs globais, não de remoção por volume.
- O backup está fora do vault para não criar nova poluição no grafo; precisa ser mantido enquanto a revisão estiver aberta.

## Próxima onda

Recomendação: executar uma Onda 1 complementar somente após Vinicius revisar os itens `needs_review` da matriz pós-limpeza. A Onda 2 completa não foi iniciada. Para o Graph View, recomenda-se aplicar um perfil visual separado antes de mexer em mais conteúdo:

- grafo global com `hideUnresolved=true`;
- filtros excluindo `node_modules`, `.next`, backups, históricos técnicos granulares e arquivos de apoio;
- grupos por `00 - Mapas`, `03 - Tutoriais`, `13 - Base de Conhecimento`, `17 - Viny Flow`, `17 - Viny Flow/07 - Projetos/Viny Watch`, `17 - Viny Flow/07 - Projetos/Legacy Doc`, `19 - Reuniões`;
- grafos locais por projeto para StayCloud, Tutoriais, Viny Watch, Legacy Doc, Viny Flow, Reuniões e Estudos.

## Diff resumido

```diff
--- backup/18 - Integrações/README.md
+++ 18 - Integrações/README.md
@@ -15,5 +15,5 @@
 ## Papel das ferramentas
 
-- [[18 - Integrações/README|README]]
+- Esta nota: visão geral das integrações.
 - [[18 - Integrações/Plano de Integração - Notion e ClickUp|Plano de Integração - Notion e ClickUp]]
 - [[18 - Integrações/Mapeamento de Dados|Mapeamento de Dados]]
--- backup/06 - Relatórios/Auditoria de Conexões do Obsidian - 2026-08-06.md
+++ 06 - Relatórios/Auditoria de Conexões do Obsidian - 2026-08-06.md
@@ -408,7 +408,7 @@
 | 00 - Mapas/MOC - Base de Conhecimento.md | L9: - [Indice geral da Base de Conhecimento](</home/vinicius-alves/Viny Brain/13 - Base de Conhecimento/00 - Índice/Índice Geral.md>); L10: - [Mapa por Temas](</home/vinicius-alves/Viny Brain/13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md>); L14: ## Conteudos relacionados |
 | 00 - Mapas/MOC - Codex.md | L22: - [Checkpoint Atual](</home/vinicius-alves/Viny Brain/14 - Histórico Codex/Checkpoint Atual.md>); L37: 5. Conferir `Checkpoint Atual` antes de seguir em uma tarefa que ja vinha andando. |
-| 00 - Mapas/MOC - Tutoriais StayCloud.md | L1: # MOC - Tutoriais StayCloud; L65: - [[14 - Histórico Codex/Checkpoint Atual/Checkpoint Atual]] |
-| 00 - Mapas/MOC - Viny Brain.md | L1: # MOC - Viny Brain; L15: - [[00 - Mapas/MOC - Tutoriais StayCloud/MOC - Tutoriais StayCloud]]; L19: - [[14 - Histórico Codex/Checkpoint Atual/Checkpoint Atual]]; L46: - [[13 - Base de Conhecimento/00 - Índice/Índice Geral/Índice Geral]] |
-| 00 - Mapas/Painel Operacional - Viny Brain.md | L7: - [[14 - Histórico Codex/Checkpoint Atual/Checkpoint Atual]]; L10: - [[13 - Base de Conhecimento/00 - Índice/Índice Geral/Base de Conhecimento]]; L12: - [[00 - Mapas/MOC - Tutoriais StayCloud/MOC - Tutoriais StayCloud]]; L38: - [[13 - Base de Conhecimento/00 - Índice/Índice Geral/Índice Geral]] |
+| 00 - Mapas/MOC - Tutoriais StayCloud.md | L1: # MOC - Tutoriais StayCloud; L65: link para `14 - Histórico Codex/Checkpoint Atual` |
+| 00 - Mapas/MOC - Viny Brain.md | L1: # MOC - Viny Brain; L15: link para `00 - Mapas/MOC - Tutoriais StayCloud`; L19: link para `14 - Histórico Codex/Checkpoint Atual`; L46: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral` |
+| 00 - Mapas/Painel Operacional - Viny Brain.md | L7: link para `14 - Histórico Codex/Checkpoint Atual`; L10: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral`; L12: link para `00 - Mapas/MOC - Tutoriais StayCloud`; L38: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral` |
 | 03 - Tutoriais/Checklist Final - Revisão antes do WordPress.md | L75: - links internos quando fizer sentido; |
 | 03 - Tutoriais/Checklist SEO Rank Math StayCloud.md | L29: - **Links internos usados quando aplicável:** [ ] Aprovado [ ] Revisar |
@@ -457,5 +457,5 @@
 | 04 - Gestão/Reuniões Suporte/00 - README/README.md | L19: - `05 - Templates/`: templates, guia e instrucoes de formalizacao; |
 | 04 - Gestão/Reuniões Suporte/05 - Templates/Guia - Como Formalizar Reuniões de Suporte.md | L45: `Foi identificado um volume elevado de tickets relacionados a e-mail, principalmente envolvendo dúvidas sobre configuração de DNS.`; L88: 1. Preencher o template correspondente. |
-| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | L71: / [[00 - Mapas/MOC - Tutoriais StayCloud/MOC - Tutoriais StayCloud]] / Sim / Sim / Sim / Sim / 0 / corrigido /; L73: / [[00 - Mapas/MOC - Viny Brain/MOC - Viny Brain]] / Sim / Sim / Sim / Sim / 0 / corrigido /; L89: / [[14 - Histórico Codex/Checkpoint Atual/Checkpoint Atual]] / Sim / Sim / Sim / Sim / 0 / corrigido /; L146: - Criado [[00 - Mapas/MOC - Tutoriais StayCloud/MOC - Tutoriais StayCloud]]. |
+| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | L71: referência ao MOC de Tutoriais StayCloud; L73: referência ao MOC do Viny Brain; L89: referência ao Checkpoint Atual; L146: criação do MOC de Tutoriais StayCloud. |
 | 08 - Codex/Checklist de Validação de Base.md | L7: - Antes de criar ou alterar notas, templates ou painéis do curso.; L20: - `14 - Histórico Codex/Checkpoint Atual.md`; L22: - `15 - Cursos e Estudos/SINAPSE T03/01 - Notas de Aula/Template Nota de Aula.md`; L23: - `15 - Cursos e Estudos/SINAPSE T03/02 - Aplicações no Viny Brain/Template Plano de Aplicação.md` |
 | 08 - Codex/Mapa de Uso do Vault.md | L34: ### `99 - Templates`; L35: Pasta de modelos. Serve para arquivos base que podem ser copiados e adaptados, como o template da Daily.; L107: ### `99 - Templates`; L145: 5. Se algo for recorrente, transformar em template, prompt ou documento de referência. |
--- backup/17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md
+++ 17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md
@@ -52,4 +52,13 @@
 - workflows sem ligação com comandos;
 - agentes sem ligação com workflows.
+
+Critério anti-poluição:
+
+- não criar link apenas por coincidência de palavra ou tema genérico;
+- não ligar toda nota ao MOC global quando já existir MOC local suficiente;
+- não criar link recíproco por padrão;
+- não adicionar seção `Relacionados` sem explicar a relação;
+- preservar fonte, decisão, origem, rastreabilidade e navegação intencional;
+- preferir poucos links contextualizados a muitos links globais.
 
 ### C. Padrão dos arquivos
--- backup/17 - Viny Flow/01 - Agentes/Agente Base de Conhecimento.md
+++ 17 - Viny Flow/01 - Agentes/Agente Base de Conhecimento.md
@@ -55,4 +55,8 @@
 - Não criar conexões artificiais.
 - Não misturar conteúdo interno e conteúdo para cliente.
+- Não criar link apenas por palavra-chave parecida.
+- Não transformar todo playbook em hub.
+- Não repetir o mesmo link em várias seções da mesma nota sem função editorial clara.
+- Preferir relação contextual direta a links genéricos para mapas globais.
 
 ## 10. Checklist de atuação
@@ -70,3 +74,2 @@
 
 `Atue como Agente Base de Conhecimento. Leia o Índice Geral, o Mapa por Temas e o modelo de playbook, e organize este lote preservando metadados, origem e separação interno/cliente.`
-
--- backup/17 - Viny Flow/02 - Workflows/Importar Playbooks.md
+++ 17 - Viny Flow/02 - Workflows/Importar Playbooks.md
@@ -98,4 +98,7 @@
 - no máximo 3 links relacionados;
 - sem links artificiais.
+- não adicionar outros mapas globais por padrão;
+- não repetir o mesmo link na mesma nota sem função editorial diferente;
+- links relacionados precisam indicar relação operacional, fonte, continuidade ou navegação real.
 
 ## 7. Critérios de aprovação
@@ -151,3 +154,2 @@
 
 `Siga o workflow Auditar Playbooks. Revise o lote importado, confira metadados, links, status, separação interno/cliente, conexões e segurança, sem alterar os playbooks originais.`
-
--- backup/13 - Base de Conhecimento/00 - Índice/Regras para Playbooks.md
+++ 13 - Base de Conhecimento/00 - Índice/Regras para Playbooks.md
@@ -78,4 +78,7 @@
 - só criar conexão quando houver relação temática real
 - se não houver relação clara, não adicionar link
+- não repetir o mesmo link em seções diferentes apenas para reforçar o grafo
+- não ligar o playbook a mapas globais fora da Base de Conhecimento sem necessidade operacional
+- quando um link for necessário, preferir uma frase contextual a uma lista genérica de relacionados
 
 Exemplos de relação temática válida:
@@ -88,3 +91,2 @@
 - Backups com JetBackup, restauração ou retenção
 - Zendesk com chat, bot, status page ou atendimento
-
--- backup/14 - Histórico Codex/Checkpoint Atual.md
+++ 14 - Histórico Codex/Checkpoint Atual.md
@@ -436,2 +436,21 @@
 - Nenhuma limpeza foi aplicada: nenhum link removido, nenhuma nota excluída, nenhuma pasta movida, nenhum template alterado, nenhum frontmatter/tag/MOC modificado.
 - Status: aguardando autorização de Vinicius para executar a Onda 1.
+
+## Atualização de 2026-08-06 - Início da Limpeza Onda 1
+
+- Limpeza conservadora iniciada com o `Agente Governança do Viny Brain`.
+- Backup dos arquivos elegíveis criado fora do vault em `/home/vinicius-alves/viny-brain-backups/Conexoes Obsidian/Onda 1 - 2026-08-06`.
+- Git não disponível neste vault: `fatal: not a git repository`.
+- Escopo autorizado: Onda 1 e ajustes preventivos mínimos de alta confiança.
+- Regra de execução: preservar links fortes, fontes, decisões, rastreabilidade, MOCs saudáveis, agentes e workflows.
+
+
+## Atualização de 2026-08-06 - Resultado da Limpeza Onda 1
+
+- Limpeza Onda 1 concluída de forma conservadora.
+- Aplicado: 1 self-link removido e 12 wikilinks quebrados do relatório anterior neutralizados como texto contextual.
+- Regras preventivas atualizadas em agentes/workflows de governança e base de conhecimento.
+- Nenhuma nota foi excluída, nenhuma fonte foi removida e nenhuma decisão perdeu rastreabilidade.
+- Relatório criado: [[06 - Relatórios/Resultado da Limpeza de Conexões - Onda 1 - 2026-08-06|Resultado da Limpeza de Conexões - Onda 1]].
+- Matriz pós-limpeza criada em `06 - Relatórios/Matriz de Conexões - Resultado Onda 1 - 2026-08-06.csv`.
+- Status: aguardar validação de Vinicius antes de qualquer Onda 2 completa.
--- backup/14 - Histórico Codex/Sessões/2026-08-06.md
+++ 14 - Histórico Codex/Sessões/2026-08-06.md
@@ -55,2 +55,13 @@
 - Relatórios e matriz criados.
 - Aguardando validação de Vinicius.
+
+
+## Resultado da limpeza de conexões - Onda 1
+
+- Aplicada limpeza conservadora com base na auditoria anterior.
+- Backup externo: `/home/vinicius-alves/viny-brain-backups/Conexoes Obsidian/Onda 1 - 2026-08-06`.
+- Git não disponível no vault.
+- Alterações reais: self-link removido, wikilinks quebrados do relatório anterior convertidos em texto, regras preventivas reforçadas.
+- Nenhuma nota, fonte, decisão, MOC saudável ou relação forte foi removida.
+- Relatório: [[06 - Relatórios/Resultado da Limpeza de Conexões - Onda 1 - 2026-08-06|Resultado da Limpeza de Conexões - Onda 1]].
+- Próximo passo: Vinicius revisar o relatório e decidir se autoriza Onda 1 complementar ou Onda 2 controlada.
```
