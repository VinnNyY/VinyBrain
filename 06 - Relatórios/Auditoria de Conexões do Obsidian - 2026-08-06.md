# Auditoria de conexões do Obsidian

Data da auditoria: 2026-08-06
Vault: `/home/vinicius-alves/Viny Brain`

## Resumo executivo

Status geral: **atenção**.

O grafo tem uma base operacional coerente, mas está visualmente e semanticamente pressionado por três fatores: hubs centrais muito amplos, links padronizados em playbooks/checkpoints/históricos e ausência de filtros/grupos no Graph View. A auditoria não aplicou limpeza: nenhum link foi removido, nenhum arquivo foi movido, nenhum frontmatter/tag/MOC/template foi alterado.

Foram acionados os agentes e workflows existentes do Viny Flow: `Agente Governança do Viny Brain`, `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Relatórios`, `/auditar-contexto`, `/auditar-governanca`, `/auditar-viny-flow`, `/checkpoint` e `/quality-gate`.

## Estado atual do grafo

A leitura principal foi feita em 774 notas Markdown fora de pastas técnicas. O inventário bruto encontrou 1804 arquivos Markdown no vault; a diferença vem principalmente de material técnico em `node_modules`, `.next`, backups de build e dependências. Para governança do Obsidian, a limpeza deve priorizar o escopo operacional e criar filtro/ignore visual para pastas técnicas.

## Métricas

| Métrica | Valor |
| --- | --- |
| Notas Markdown brutas no vault | 1804 |
| Notas Markdown auditadas fora de pastas técnicas | 774 |
| Links internos resolvidos entre notas | 710 |
| Links internos quebrados/não resolvidos | 91 |
| Links duplicados dentro da mesma nota | 105 |
| Self-links | 1 |
| Embeds wiki detectados | 0 |
| Links/embeds para anexos | 8 |
| Notas órfãs | 564 |
| Notas sem links de saída | 709 |
| Notas sem backlinks | 572 |
| Média de links de saída por nota | 0.92 |
| Mediana de links de saída por nota | 0.00 |
| Percentil 90 de links de saída | 0.0 |
| Percentil 95 de links de saída | 5.0 |
| Pares com links recíprocos | 127 |
| Conexões entre pastas raiz diferentes | 270 |
| Conexões entre projetos/contextos diferentes | 233 |

## Principais causas da poluição

- Há 1030 Markdown em pastas técnicas como `node_modules`, `.next`, `build` ou similares. Isso não explica os links internos auditados, mas pode afetar busca/visualização se o Obsidian não ignorar essas pastas.
- Existem hubs reais com muitos backlinks, principalmente: `13 - Base de Conhecimento/00 - Índice/Índice Geral.md` (40), `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md` (38), `17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md` (16), `13 - Base de Conhecimento/01 - Playbooks/Guia Interno Staycloud - Apontamentos DNS.md` (15), `13 - Base de Conhecimento/01 - Playbooks/Procedimento de Acesso a Contas de E-mail via cPanel.md` (14).
- Foram detectados 105 links duplicados dentro da mesma nota, principalmente em materiais importados, históricos e playbooks.
- Foram detectadas 233 conexões entre contextos/projetos diferentes; parte é navegação intencional, parte exige revisão manual.
- Tags existem no vault, mas o Graph View está com `showTags=false`; portanto tags não parecem ser a principal causa visual atual.

Classificação provável das causas:

| Causa | Peso | Evidência |
| --- | --- | --- |
| Poucos hubs gigantes | alto | 6 notas com grau total >= 40 |
| Links automáticos/padronizados em massa | alto | playbooks com `Índice Geral` e `Mapa por Temas`; checkpoints e históricos com listas de arquivos |
| Excesso de links entre projetos | médio | 233 links cruzam projetos/contextos |
| Links de contexto genérico | médio | 130 classificados como GENÉRICA |
| Tags globais | baixo visual atual | 151 tags distintas, mas `showTags=false` |
| Histórico e checkpoints | alto | checkpoint global e sessões acumulam referências para continuidade |
| MOCs mal delimitados | médio | MOCs centrais são intencionais, mas alguns apontam para muitas frentes |
| Templates antigos | médio | 210 arquivos/template/workflow/agente com padrões de links detectados |
| Duplicação de links | baixo a médio | 105 duplicados |
| Configuração visual do grafo | médio | sem filtro de busca e sem grupos por pasta/projeto |

## Super-hubs

| Caminho | Tipo | Saída | Backlinks | Grau | Status | Projetos/áreas conectadas |
| --- | --- | --- | --- | --- | --- | --- |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | MOC ou mapa | 106 | 38 | 144 | saudável | StayCloud:61; Viny Brain:2 |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | índice | 49 | 40 | 89 | saudável | StayCloud:52; Viny Brain:2 |
| 00 - Mapas/Painel Operacional - Viny Brain.md | MOC ou mapa | 70 | 5 | 75 | grande, mas intencional | Viny Flow:35; StayCloud:16; Viny Brain:2; Integrações:2; Ferramentas:2 |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | MOC ou mapa | 44 | 6 | 50 | saudável | StayCloud:20; Viny Flow:15; Viny Brain:2; Codex/Viny Brain:2 |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | relatório | 48 | 1 | 49 | artificial | StayCloud:14; Viny Flow:13; Viny Brain:2; Codex/Viny Brain:1 |
| 00 - Mapas/MOC - Viny Brain.md | MOC ou mapa | 45 | 3 | 48 | saudável | StayCloud:12; Viny Flow:9; Codex/Viny Brain:7; Integrações:5; Ferramentas:2 |
| Home.md | classificação incerta | 37 | 1 | 38 | artificial | Codex/Viny Brain:8; Viny Flow:6; StayCloud:4; Viny Brain:3; 02 - Suporte:3 |
| 13 - Base de Conhecimento/01 - Playbooks/Guia Interno Staycloud - Apontamentos DNS.md | processo | 9 | 15 | 24 | revisar | StayCloud:14 |
| 13 - Base de Conhecimento/01 - Playbooks/Procedimento de Acesso a Contas de E-mail via cPanel.md | processo | 7 | 14 | 21 | revisar | StayCloud:10 |
| 13 - Base de Conhecimento/01 - Playbooks/Resolução de Conflitos de DNS de E-mail.md | processo | 8 | 13 | 21 | revisar | StayCloud:11 |
| 13 - Base de Conhecimento/01 - Playbooks/Conferência de Certificado SSL.md | processo | 8 | 11 | 19 | revisar | StayCloud:11 |
| 13 - Base de Conhecimento/01 - Playbooks/Resolução de Verificação de Acesso via Cloudflare.md | processo | 8 | 11 | 19 | revisar | StayCloud:11 |
| 00 - Mapas/MOC - Codex.md | MOC ou mapa | 14 | 3 | 17 | saudável | Codex/Viny Brain:12; Viny Brain:2; Viny Flow:1; Home.md:1 |
| 13 - Base de Conhecimento/01 - Playbooks/Como Acessar o Painel de Controle (cPanel).md | tutorial | 5 | 12 | 17 | revisar | StayCloud:10 |
| 13 - Base de Conhecimento/01 - Playbooks/Migração de E-mails.md | processo | 7 | 9 | 16 | revisar | StayCloud:10 |
| 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | comando | 0 | 16 | 16 | revisar | StayCloud:2; Viny Brain:2; Home.md:1 |
| 13 - Base de Conhecimento/01 - Playbooks/Checklist Inicial - StayCloud.md | tutorial | 5 | 10 | 15 | revisar | StayCloud:6 |
| 13 - Base de Conhecimento/01 - Playbooks/Restauração do Core do WordPress (Automatico).md | tutorial | 7 | 8 | 15 | revisar | StayCloud:9 |
| 17 - Viny Flow/01 - Agentes/Mapa de Agentes.md | MOC ou mapa | 11 | 4 | 15 | saudável | Viny Flow:10; StayCloud:2; Viny Brain:2; Home.md:1 |
| 17 - Viny Flow/README.md | processo | 9 | 6 | 15 | revisar | Viny Flow:6; Viny Brain:3; StayCloud:3; Home.md:1 |

Hubs saudáveis ou grandes mas intencionais: **48**. Hubs artificiais prováveis: **2**.

## MOCs e índices

| Caminho | Saída | Backlinks | Grau | Classificação | Projetos conectados |
| --- | --- | --- | --- | --- | --- |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 106 | 38 | 144 | saudável | StayCloud:61; Viny Brain:2 |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | 49 | 40 | 89 | saudável | StayCloud:52; Viny Brain:2 |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 70 | 5 | 75 | grande, mas intencional | Viny Flow:35; StayCloud:16; Viny Brain:2; Integrações:2; Ferramentas:2; Codex/Viny Brain:2 |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 44 | 6 | 50 | grande, mas intencional | StayCloud:20; Viny Flow:15; Viny Brain:2; Codex/Viny Brain:2 |
| 00 - Mapas/MOC - Viny Brain.md | 45 | 3 | 48 | grande, mas intencional | StayCloud:12; Viny Flow:9; Codex/Viny Brain:7; Integrações:5; Ferramentas:2; 04 - Gestão:2 |
| 00 - Mapas/MOC - Codex.md | 14 | 3 | 17 | saudável | Codex/Viny Brain:12; Viny Brain:2; Viny Flow:1; Home.md:1 |
| 17 - Viny Flow/01 - Agentes/Mapa de Agentes.md | 11 | 4 | 15 | saudável | Viny Flow:10; StayCloud:2; Viny Brain:2; Home.md:1 |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | 10 | 4 | 14 | saudável | Viny Flow:8; StayCloud:3; Viny Brain:2; Home.md:1 |
| 19 - Reuniões/00 - Índice de Reuniões.md | 10 | 4 | 14 | saudável | Reuniões:9; Viny Brain:2; 04 - Gestão:1; Home.md:1 |
| 00 - Mapas/MOC - Base de Conhecimento.md | 4 | 0 | 4 | saudável | StayCloud:4 |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS.md | 0 | 4 | 4 | saudável | Viny Brain:2; StayCloud:2 |
| 13 - Base de Conhecimento/00 - Índice/Como usar a Base de Conhecimento.md | 0 | 3 | 3 | saudável | StayCloud:2 |
| 13 - Base de Conhecimento/00 - Índice/Plano de Importação.md | 0 | 1 | 1 | redundante | StayCloud:1 |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | 0 | 1 | 1 | redundante | Viny Brain:1 |
| .agents/skills/vercel-react-best-practices/rules/js-index-maps.md | 0 | 0 | 0 | redundante |  |
| 08 - Codex/Mapa de Uso do Vault.md | 0 | 0 | 0 | redundante |  |
| 13 - Base de Conhecimento/00 - Índice/Regras para BKPs.md | 0 | 0 | 0 | redundante |  |
| 13 - Base de Conhecimento/00 - Índice/Regras para Playbooks.md | 0 | 0 | 0 | redundante |  |
| 13 - Base de Conhecimento/00 - Índice/Regras para Tutoriais.md | 0 | 0 | 0 | redundante |  |

Recomendação: manter MOCs como hubs quando representam uma área clara. Evitar que notas operacionais apontem simultaneamente para vários mapas globais se um MOC local já resolve a navegação.

## Conexões entre projetos incompatíveis

Nenhuma conexão classificada automaticamente como INCORRETA com alta confiança. Ainda assim, links entre Legacy Doc, Viny Watch, StayCloud, reuniões e estudos devem passar por revisão manual na matriz.

Principais cruzamentos por projeto/contexto:

| Origem | Destino | Quantidade |
| --- | --- | --- |
| Viny Brain | Viny Flow | 49 |
| StayCloud | Viny Flow | 46 |
| Viny Brain | StayCloud | 33 |
| Viny Brain | Codex/Viny Brain | 21 |
| Viny Flow | StayCloud | 9 |
| Home.md | Codex/Viny Brain | 8 |
| Viny Brain | Integrações | 7 |
| Home.md | Viny Flow | 7 |
| Viny Brain | Ferramentas | 5 |
| StayCloud | Codex/Viny Brain | 4 |
| 04 - Gestão | Reuniões | 4 |
| StayCloud | Viny Brain | 4 |
| Home.md | StayCloud | 4 |
| Viny Brain | Reuniões | 3 |
| Home.md | Viny Brain | 3 |
| Home.md | 02 - Suporte | 3 |
| Viny Brain | Projetos acadêmicos/estudos | 2 |
| Viny Brain | 04 - Gestão | 2 |
| Codex/Viny Brain | Reuniões | 2 |
| Home.md | Reuniões | 2 |

## Links genéricos

| Origem | Destino | Contexto | Ação sugerida | Motivo |
| --- | --- | --- | --- | --- |
| 00 - Mapas/MOC - Viny Brain.md | Home.md | Entrada principal | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 18 - Integrações/README.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 18 - Integrações/Plano de Integração - Notion e ClickUp.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 18 - Integrações/Mapeamento de Dados.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 18 - Integrações/Regras de Segurança - Integrações.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 18 - Integrações/Decisões - Integrações.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 15 - Cursos e Estudos/SINAPSE T03/README.md | Estudos e Ferramentas | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 16 - Estudos e Ferramentas/Ruflo/Diagnóstico - Ruflo.md | Estudos e Ferramentas | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 16 - Estudos e Ferramentas/ECC/Diagnóstico - ECC.md | Estudos e Ferramentas | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 04 - Gestão/Equipe.md | Áreas de trabalho | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 04 - Gestão/Daily e Weekly.md | Áreas de trabalho | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 19 - Reuniões/00 - Índice de Reuniões.md | Áreas de trabalho | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 05 - Processo Seletivo/Mensagens candidatos.md | Áreas de trabalho | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/MOC - Viny Brain.md | 06 - Relatórios/Modelos coordenação.md | Áreas de trabalho | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 16 - Estudos e Ferramentas/ECC/Diagnóstico - ECC.md | Estado atual | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.md | Próxima ação recomendada | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 19 - Reuniões/00 - Índice de Reuniões.md | Atalhos principais | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 18 - Integrações/README.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 18 - Integrações/API/README.md | Integrações | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 15 - Cursos e Estudos/SINAPSE T03/README.md | Estudos e Ferramentas | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 16 - Estudos e Ferramentas/Ruflo/Diagnóstico - Ruflo.md | Estudos e Ferramentas | revisar manualmente | MOC/índice aponta para área distante; precisa validar escopo |
| 04 - Gestão/Daily e Weekly.md | 19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.md | Concluído | revisar manualmente | conexão entre áreas/projetos distintos (04 - Gestão -> Reuniões) |
| 04 - Gestão/Daily e Weekly.md | 19 - Reuniões/01 - Em Revisão/Weekly - Suporte - 2026-08-03 - 16-18 - Transcrição Revisada.md | Concluído | revisar manualmente | conexão entre áreas/projetos distintos (04 - Gestão -> Reuniões) |
| 04 - Gestão/Demandas - Suporte.md | 19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.md | 2026-08-03 — Weekly Suporte | revisar manualmente | conexão entre áreas/projetos distintos (04 - Gestão -> Reuniões) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Auditor.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Visual e Prints.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente UI UX Experience.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente SEO Rank Math.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente WordPress.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Segurança.md | Agentes encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/02 - Workflows/Auditar Contexto.md | Workflows encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/02 - Workflows/Auditar Governança do Viny Brain.md | Workflows encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/02 - Workflows/Auditar Skills, Agents e Workflows.md | Workflows encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/02 - Workflows/Quality Gate - Validar Entrega.md | Workflows encontrados | revisar manualmente | conexão entre áreas/projetos distintos (StayCloud -> Viny Flow) |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/MOC - Tutoriais StayCloud.md | Documentos auditados | substituir por link ao MOC | link para hub amplo fora de seção claramente navegacional |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/Painel Operacional - Viny Brain.md | Documentos auditados | substituir por link ao MOC | link para hub amplo fora de seção claramente navegacional |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/MOC - Viny Brain.md | Documentos auditados | substituir por link ao MOC | link para hub amplo fora de seção claramente navegacional |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS.md | Documentos auditados | substituir por link ao MOC | link para hub amplo fora de seção claramente navegacional |

## Links redundantes

| Origem | Destino | Contexto | Ação sugerida | Motivo |
| --- | --- | --- | --- | --- |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Comandos | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Viny Brain.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Viny Flow | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/MOC - Viny Brain.md | 00 - Mapas/MOC - Tutoriais StayCloud.md | Tutoriais StayCloud | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 17 - Viny Flow/README.md | Atalhos principais | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Atalhos principais | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | Atalhos principais | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | Inteligência do Cérebro | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | Base de Conhecimento | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | Base de Conhecimento | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 00 - Mapas/MOC - Tutoriais StayCloud.md | Tutoriais StayCloud | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud.md | Tutoriais StayCloud | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud.md | Tutoriais StayCloud | consolidar link duplicado | link duplicado dentro da mesma nota |
| 00 - Mapas/Painel Operacional - Viny Brain.md | 16 - Estudos e Ferramentas/ECC/Diagnóstico - ECC.md | Estudos e Ferramentas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Auditor.md | Agentes encontrados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Auditor.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Tutorial StayCloud.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Visual e Prints.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente UI UX Experience.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente SEO Rank Math.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Segurança.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Documentos auditados | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Visual e Prints.md | Duplicações | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 03 - Tutoriais/Checklist SEO Rank Math StayCloud.md | Duplicações | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 03 - Tutoriais/Checklist Final - Revisão antes do WordPress.md | Duplicações | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/MOC - Tutoriais StayCloud.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/Painel Operacional - Viny Brain.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 00 - Mapas/MOC - Viny Brain.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Auditor.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/01 - Agentes/Agente Visual e Prints.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | 14 - Histórico Codex/Checkpoint Atual.md | Correções aplicadas | consolidar link duplicado | link duplicado dentro da mesma nota |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 13 - Base de Conhecimento/01 - Playbooks/Como Acessar o Painel de Controle (cPanel).md | Hospedagem e aplicação | consolidar link duplicado | link duplicado dentro da mesma nota |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 13 - Base de Conhecimento/01 - Playbooks/Criação de Banco de Dados (cPanel).md | Hospedagem e aplicação | consolidar link duplicado | link duplicado dentro da mesma nota |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | 13 - Base de Conhecimento/01 - Playbooks/Ajustes de Limites  de Upload  no Cpanel.md | Hospedagem e aplicação | consolidar link duplicado | link duplicado dentro da mesma nota |

## Links incorretos

Sem amostra automática forte. Ver recomendações `revisar manualmente` na matriz CSV.

## Links obsoletos

Sem amostra automática forte. Materiais em `_backup`, `_Lotes Reprovados`, `_substituidos` e históricos antigos devem ser tratados na Onda 3/4.

## Links quebrados

| Origem | Alvo bruto | Tipo | Contexto | Motivo técnico |
| --- | --- | --- | --- | --- |
| 03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md | ../Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo/Lote%2002B%20-%20Piloto/markdown/como-encontrar-seus-servicos-ativos-no-painel-novo-da-staycloud.md | markdown | Referencias aprovadas | ambiguous |
| 03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md | ../../03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo/Unit%C3%A1rios/Como%20localizar%20a%20%C3%A1rea%20de%20Suporte%20no%20Painel%20Novo%20da%20StayCloud/markdown/como-localizar-area-suporte-painel-novo-staycloud.md | markdown | Referencias aprovadas | ambiguous |
| 03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md | ../../03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo/Unit%C3%A1rios/Como%20acessar%20a%20%C3%A1rea%20para%20adicionar%20dom%C3%ADnios%20no%20Painel%20Novo%20da%20StayCloud/markdown/como-acessar-area-adicionar-dominios-painel-novo-staycloud.md | markdown | Referencias aprovadas | ambiguous |
| 03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md | ../../03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo/Unit%C3%A1rios/Como%20consultar%20o%20uso%20atual%20de%20uma%20conta%20de%20e-mail%20no%20Painel%20Novo%20da%20StayCloud/markdown/como-consultar-uso-email-painel-novo-staycloud.md | markdown | Referencias aprovadas | ambiguous |
| 03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md | ../../03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo/Unit%C3%A1rios/Como%20acompanhar%20seus%20chamados%20no%20Painel%20Novo%20da%20StayCloud/markdown/como-acompanhar-chamados-painel-novo-staycloud.md | markdown | Referencias aprovadas | ambiguous |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md | /home/vinicius-alves/Viny%20Brain/03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo%20-%20Invent%C3%A1rio%20de%20Tutoriais.md | markdown | Evidencias da varredura | unresolved |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md | /home/vinicius-alves/Viny%20Brain/03%20-%20Tutoriais/Estudos%20de%20Padr%C3%A3o%20StayCloud/Tutorial%20Refer%C3%AAncia%20-%20Painel%20Novo.md | markdown | Evidencias da varredura | unresolved |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | Playbook: Resolução de Erro MySQL \#2006 (StayCare Technical Support) | wiki | cPanel / Hospedagem | unresolved |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | Resolução de Erro de NameServer (NS) no Registro.br | wiki | DNS e Domínios | unresolved |
| 13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md | Comparativo de Infraestrutura  Servidor Dedicado  vs. VPS | wiki | VPS / SSH / Linux | unresolved |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | Resolução de Erro de NameServer (NS) no Registro.br | wiki | Navegação Rápida | unresolved |
| 13 - Base de Conhecimento/00 - Índice/Índice Geral.md | Comparativo de Infraestrutura  Servidor Dedicado  vs. VPS | wiki | Navegação Rápida | unresolved |
| 13 - Base de Conhecimento/01 - Playbooks/Configuração de Novo Domínio.md | Resolução de Erro de NameServer (NS) no Registro.br | wiki | Conexões internas | unresolved |
| 13 - Base de Conhecimento/01 - Playbooks/Domínio com Erro 403.md | Resolução de Erro de NameServer (NS) no Registro.br | wiki | Conexões internas | unresolved |
| 13 - Base de Conhecimento/01 - Playbooks/Localização e Edição do Arquivo Hosts (Windows vs Server).md | Resolução de Erro de NameServer (NS) no Registro.br | wiki | Conexões internas | unresolved |
| 14 - Histórico Codex/Sessões/2026-07-02.md | </home/vinicius-alves/Viny%20Brain/16%20-%20Estudos%20e%20Ferramentas/Ruflo/Diagn%C3%B3stico%20-%20Ruflo.md> | markdown | Links internos relevantes | unresolved |
| 14 - Histórico Codex/Sessões/2026-07-02.md | </home/vinicius-alves/Viny%20Brain/16%20-%20Estudos%20e%20Ferramentas/Ruflo/Teste%20em%20Laborat%C3%B3rio.md> | markdown | Links internos relevantes | unresolved |
| 14 - Histórico Codex/Sessões/2026-07-02.md | </home/vinicius-alves/Viny%20Brain/16%20-%20Estudos%20e%20Ferramentas/Ruflo/Decis%C3%A3o%20-%20Ruflo%20no%20Viny%20Brain.md> | markdown | Links internos relevantes | unresolved |
| 14 - Histórico Codex/Sessões/2026-07-02.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/Plano%20de%20Adapta%C3%A7%C3%A3o%20-%20Viny%20Flow.md> | markdown | Links internos relevantes | unresolved |
| 17 - Viny Flow/01 - Agentes/Mapa de Agentes.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/01%20-%20Agentes/Agente%20Governan%C3%A7a%20do%20Viny%20Brain.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/01 - Agentes/Mapa de Agentes.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/01%20-%20Agentes/Agente%20Ata%20e%20Reuni%C3%B5es%20de%20Suporte.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Auditar%20Governan%C3%A7a%20do%20Viny%20Brain.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Extrair%20Aprendizados%20da%20Sess%C3%A3o.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Revis%C3%A3o%20de%20Seguran%C3%A7a.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Criar%20Relat%C3%B3rio.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Formatar%20Reuni%C3%A3o%20de%20Suporte.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Fechamento%20de%20Sess%C3%A3o.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Registrar%20Reuni%C3%A3o%20no%20Notion.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Transformar%20Reuni%C3%A3o%20em%20Demandas.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Sincronizar%20Decis%C3%B5es%20Operacionais.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/02 - Workflows/Mapa de Workflows.md | </home/vinicius-alves/Viny%20Brain/17%20-%20Viny%20Flow/02%20-%20Workflows/Auditar%20Integra%C3%A7%C3%B5es.md> | markdown | Primeira lista | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./03%20-%20M%C3%A9todo%20-%20Ingest%C3%A3o%20Inteligente%20de%20Fonte.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./04%20-%20M%C3%A9todo%20-%20Compila%C3%A7%C3%A3o%20LLM%20Wiki.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./05%20-%20M%C3%A9todo%20-%20Gera%C3%A7%C3%A3o%20de%20Skills%20Viny%20Flow.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./06%20-%20M%C3%A9todo%20-%20Auditoria%20de%20Conhecimento.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./07%20-%20M%C3%A9todo%20-%20Estudo%20para%20M%C3%A9todo%20Operacional.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./08%20-%20M%C3%A9todo%20-%20Autonomia%20Segura.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./09%20-%20M%C3%A9todo%20-%20Radar%20GitHub%20Reddit%20e%20Docs.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos.md | ./10%20-%20M%C3%A9todo%20-%20Seguran%C3%A7a%20para%20Skills%20e%20MCP.md | markdown | Visão geral | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/Agent Skills - Specification.md | ../05%20-%20M%C3%A9todo%20-%20Gera%C3%A7%C3%A3o%20de%20Skills%20Viny%20Flow.md | markdown | Possível método derivado | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/Agent Skills - Specification.md | ../03%20-%20M%C3%A9todo%20-%20Ingest%C3%A3o%20Inteligente%20de%20Fonte.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/Agent Skills - Specification.md | ../05%20-%20M%C3%A9todo%20-%20Gera%C3%A7%C3%A3o%20de%20Skills%20Viny%20Flow.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/Agent Skills - Specification.md | ../10%20-%20M%C3%A9todo%20-%20Seguran%C3%A7a%20para%20Skills%20e%20MCP.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/Agent Skills - Specification.md | ../06%20-%20M%C3%A9todo%20-%20Auditoria%20de%20Conhecimento.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/LLM Wiki - Karpathy.md | ../04%20-%20M%C3%A9todo%20-%20Compila%C3%A7%C3%A3o%20LLM%20Wiki.md | markdown | Possível método derivado | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/LLM Wiki - Karpathy.md | ../03%20-%20M%C3%A9todo%20-%20Ingest%C3%A3o%20Inteligente%20de%20Fonte.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/LLM Wiki - Karpathy.md | ../04%20-%20M%C3%A9todo%20-%20Compila%C3%A7%C3%A3o%20LLM%20Wiki.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/LLM Wiki - Karpathy.md | ../06%20-%20M%C3%A9todo%20-%20Auditoria%20de%20Conhecimento.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/LLM Wiki - Karpathy.md | ../07%20-%20M%C3%A9todo%20-%20Estudo%20para%20M%C3%A9todo%20Operacional.md | markdown | Relação com métodos existentes | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Implementações Operacionais/README.md | ./01%20-%20Radar%20de%20Implementa%C3%A7%C3%B5es%20Operacionais.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/Implementações Operacionais/README.md | ./08%20-%20Backlog%20de%20Implementa%C3%A7%C3%B5es%20no%20Viny%20Brain.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./01%20-%20Pesquisa%20Base%20-%20C%C3%A9rebro%20Aut%C3%B4nomo.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./02%20-%20Mapa%20de%20M%C3%A9todos.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./03%20-%20M%C3%A9todo%20-%20Ingest%C3%A3o%20Inteligente%20de%20Fonte.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./04%20-%20M%C3%A9todo%20-%20Compila%C3%A7%C3%A3o%20LLM%20Wiki.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./05%20-%20M%C3%A9todo%20-%20Gera%C3%A7%C3%A3o%20de%20Skills%20Viny%20Flow.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./06%20-%20M%C3%A9todo%20-%20Auditoria%20de%20Conhecimento.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./07%20-%20M%C3%A9todo%20-%20Estudo%20para%20M%C3%A9todo%20Operacional.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./08%20-%20M%C3%A9todo%20-%20Autonomia%20Segura.md | markdown | Arquivos | unresolved |
| 17 - Viny Flow/05 - Inteligência do Cérebro/README.md | ./09%20-%20M%C3%A9todo%20-%20Radar%20GitHub%20Reddit%20e%20Docs.md | markdown | Arquivos | unresolved |

## Notas órfãs

Total: **564**.

Amostra:

| Nota | Tipo | Área |
| --- | --- | --- |
| .agents/skills/staycloud-tutorial-guidelines/SKILL.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/AGENTS.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/README.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/SKILL.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/_sections.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/_template.md | template | .agents |
| .agents/skills/vercel-composition-patterns/rules/architecture-avoid-boolean-props.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/architecture-compound-components.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/patterns-children-over-render-props.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/patterns-explicit-variants.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/react19-no-forwardref.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/state-context-interface.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/state-decouple-implementation.md | agente | .agents |
| .agents/skills/vercel-composition-patterns/rules/state-lift-state.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/README.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/SKILL.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/_sections.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/_template.md | template | .agents |
| .agents/skills/vercel-react-best-practices/rules/advanced-effect-event-deps.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/advanced-event-handler-refs.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/advanced-init-once.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/advanced-use-latest.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/async-api-routes.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/async-dependencies.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/async-parallel.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-analyzable-paths.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-conditional.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-defer-third-party.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/bundle-preload.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/client-event-listeners.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/client-localstorage-schema.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/client-passive-event-listeners.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/client-swr-dedup.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-batch-dom-css.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-cache-function-results.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-cache-property-access.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-cache-storage.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-combine-iterations.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-early-exit.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-flatmap-filter.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-hoist-regexp.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-index-maps.md | índice | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-length-check-first.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-min-max-loop.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-request-idle-callback.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-set-map-lookups.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-activity.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-animate-svg-wrapper.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-conditional-render.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-content-visibility.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-hoist-jsx.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-hydration-suppress-warning.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-resource-hints.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-script-defer-async.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-svg-precision.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rendering-usetransition-loading.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-defer-reads.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-dependencies.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-derived-state.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-lazy-state-init.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-memo-with-default-value.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-memo.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-move-effect-to-event.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-simple-expression-in-memo.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-split-combined-hooks.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-transitions.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-use-deferred-value.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/rerender-use-ref-transient-values.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/server-after-nonblocking.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/server-auth-actions.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/server-cache-lru.md | agente | .agents |
| .agents/skills/vercel-react-best-practices/rules/server-cache-react.md | agente | .agents |

## Templates e agentes responsáveis

Arquivos com sinais de links padronizados, templates, regras ou automação:

| Arquivo | Evidência |
| --- | --- |
| .agents/skills/vercel-composition-patterns/README.md | L11: - `_template.md` - Template for creating new rules; L48: 1. Copy `rules/_template.md` to `rules/area-description.md` |
| .agents/skills/vercel-react-best-practices/AGENTS.md | L1029: const template = await fs.readFile('./template.html', 'utf-8'); L1031: return render(template, data, config); L1035: **Correct: hoists config and template to module level**; L1043: const templatePromise = fs.readFile('./template.html', 'utf-8') |
| .agents/skills/vercel-react-best-practices/README.md | L9: - `_template.md` - Template for creating new rules; L40: 1. Copy `rules/_template.md` to `rules/area-description.md`; L115: 2. Follow the `_template.md` structure |
| .agents/skills/vercel-react-best-practices/rules/server-hoist-static-io.md | L106: const template = await fs.readFile('./template.html', 'utf-8'); L108: return render(template, data, config); L112: **Correct (hoists config and template to module level):**; L120: const templatePromise = fs.readFile('./template.html', 'utf-8') |
| 00 - Mapas/MOC - Base de Conhecimento.md | L9: - [Indice geral da Base de Conhecimento](</home/vinicius-alves/Viny Brain/13 - Base de Conhecimento/00 - Índice/Índice Geral.md>); L10: - [Mapa por Temas](</home/vinicius-alves/Viny Brain/13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md>); L14: ## Conteudos relacionados |
| 00 - Mapas/MOC - Codex.md | L22: - [Checkpoint Atual](</home/vinicius-alves/Viny Brain/14 - Histórico Codex/Checkpoint Atual.md>); L37: 5. Conferir `Checkpoint Atual` antes de seguir em uma tarefa que ja vinha andando. |
| 00 - Mapas/MOC - Tutoriais StayCloud.md | L1: # MOC - Tutoriais StayCloud; L65: link para `14 - Histórico Codex/Checkpoint Atual` |
| 00 - Mapas/MOC - Viny Brain.md | L1: # MOC - Viny Brain; L15: link para `00 - Mapas/MOC - Tutoriais StayCloud`; L19: link para `14 - Histórico Codex/Checkpoint Atual`; L46: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral` |
| 00 - Mapas/Painel Operacional - Viny Brain.md | L7: link para `14 - Histórico Codex/Checkpoint Atual`; L10: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral`; L12: link para `00 - Mapas/MOC - Tutoriais StayCloud`; L38: link para `13 - Base de Conhecimento/00 - Índice/Índice Geral` |
| 03 - Tutoriais/Checklist Final - Revisão antes do WordPress.md | L75: - links internos quando fizer sentido; |
| 03 - Tutoriais/Checklist SEO Rank Math StayCloud.md | L29: - **Links internos usados quando aplicável:** [ ] Aprovado [ ] Revisar |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/04 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/markdown/como-consultar-uso-email-painel-novo-staycloud.md | L79: - **Links internos sugeridos:** Como criar uma conta de e-mail no Painel Novo — URL: confirmar antes da publicação; Como acompanhar seus chamados no Painel Novo — URL: confirmar an; L81: - **Checklist Rank Math:** palavra-chave no título, meta description, slug, primeiro parágrafo e subtítulo; ALT relevante; links internos; parágrafos curtos; título e meta descript; L82: - **Status estimado:** acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/04 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/05 - Como acompanhar seus chamados no Painel Novo da StayCloud/publicacao/03 - SEO Rank Math.md | L26: - Links internos sugeridos: tutorial de abertura de chamado e tutorial da área de Suporte, após confirmar as URLs canônicas no WordPress.; L38: - [ ] Confirmar links internos canônicos antes da publicação; L46: - Meta estimada: pontuação acima de 80 após preencher os campos e confirmar os links internos. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/05 - Como acompanhar seus chamados no Painel Novo da StayCloud/publicacao/06 - Validacao Rascunho WordPress.md | L50: - Os links internos sugeridos precisam ter suas URLs canônicas confirmadas antes da publicação. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/05 - Como acompanhar seus chamados no Painel Novo da StayCloud/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug preservado, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/_backup-incorreto-2026-07-23-09-29/_substituidos-no-reset/markdown/como-acompanhar-chamados-painel-novo-staycloud.md | L80: - **Links internos sugeridos:** Como abrir um chamado no Painel Novo — URL: confirmar antes da publicação; Como consultar o uso de e-mail no Painel Novo — URL: confirmar antes da p; L82: - **Checklist Rank Math:** palavra-chave no título, meta description, slug preservado, primeiro parágrafo e subtítulo; ALT relevante; links internos; parágrafos curtos; título e me; L83: - **Status estimado:** acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/_backup-incorreto-2026-07-23-09-29/_substituidos-no-reset/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug preservado, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/_backup-incorreto-2026-07-23-09-29/markdown/como-acompanhar-chamados-painel-novo-staycloud.md | L80: - **Links internos sugeridos:** Como abrir um chamado no Painel Novo — URL: confirmar antes da publicação; Como consultar o uso de e-mail no Painel Novo — URL: confirmar antes da p; L82: - **Checklist Rank Math:** palavra-chave no título, meta description, slug preservado, primeiro parágrafo e subtítulo; ALT relevante; links internos; parágrafos curtos; título e me; L83: - **Status estimado:** acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modelos Aprovados - StayCloud/Painel Novo/_backup-incorreto-2026-07-23-09-29/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug preservado, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Modo Tutorial StayCloud.md | L38: - Não copie credenciais para Obsidian, histórico, checklist, template ou diagnóstico. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - BACKLOG DE IDEIAS.md | L178: - 2026-07-27: tema `Como usar a busca geral do Painel Novo da StayCloud` classificado como novo. A base pública e o Viny Brain possuem tutoriais relacionados de busca em Domínios,  |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - README - PADRÃO OFICIAL.md | L98: - pelo menos dois links internos úteis e válidos; |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/01 - Como acompanhar seus chamados no Painel Novo da StayCloud/04 - VALIDAÇÃO FINAL.md | L47: - [x] Pelo menos dois links internos válidos: 2 links internos registrados localmente |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/04 - VALIDAÇÃO FINAL.md | L47: - [x] Pelo menos dois links internos válidos: 2 links internos registrados localmente |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/apoio/Auditoria de Duplicação.md | L6: - Artigos relacionados: criação de conta de e-mail e consumo do e-mail profissional. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/apoio/fontes-editoriais/fonte-editorial-antiga.md | L79: - **Links internos sugeridos:** Como criar uma conta de e-mail no Painel Novo — URL: confirmar antes da publicação; Como acompanhar seus chamados no Painel Novo — URL: confirmar an; L81: - **Checklist Rank Math:** palavra-chave no título, meta description, slug, primeiro parágrafo e subtítulo; ALT relevante; links internos; parágrafos curtos; título e meta descript; L82: - **Status estimado:** acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/03 - Como usar busca e filtros na área de Domínios no Painel Novo da StayCloud/04 - VALIDAÇÃO FINAL.md | L36: - [x] Dois links internos válidos |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/03 - Como usar busca e filtros na área de Domínios no Painel Novo da StayCloud/apoio/Auditoria de Duplicação.md | L6: - Artigos relacionados: adicionar domínio, comprar domínio e localizar menus de domínios. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud/04 - VALIDAÇÃO FINAL.md | L42: - [x] Dois links internos válidos; L98: - Links internos: 3 URLs validadas com HTTP 200 |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud/apoio/Fonte Editorial.md | L22: ## Links internos validados |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud/04 - VALIDAÇÃO FINAL.md | L20: - Modelos e materiais relacionados pesquisados: sim. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud/apoio/Auditoria de Duplicação.md | L19: Foram encontrados tutoriais relacionados, mas nenhum tutorial completo com o mesmo objetivo de ensinar a busca superior geral do Painel Novo: |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud/apoio/Fluxo Real Validado.md | L12: 4. Ao digitar "site", a busca exibe resultados relacionados, incluindo "Meus sites". |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/08 - Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud/apoio/Auditoria de Duplicação.md | L12: / Categoria oficial Painel novo / A categoria contém artigos de e-mail relacionados, incluindo `Contas de Email`, `Criar E-mails painel Stay` e `Consumo do E-mail profissional`. / ; L15: / Base pública geral / Existem artigos de Webmail e criação de e-mail. / Usar somente como links internos confirmados. /; L36: - Consulta por busca `alterar senha de e-mail`: retornou artigos relacionados, incluindo ID 2099 e o artigo histórico ID 1244. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/12 - Como fazer o primeiro deploy na StayCloud/apoio/Fonte Editorial.md | L19: ## Links Internos Confirmados |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/13 - Como instalar e usar a CLI do Deploy StayCloud/apoio/Auditoria de Duplicação.md | L9: Resultados relacionados:; L20: Buscas feitas na categoria `Painel novo` e na busca pública da Central de Ajuda por `CLI Deploy StayCloud`, `comando Deploy StayCloud` e termos relacionados. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/14 - Como consultar o status e os logs de um deploy na StayCloud/apoio/Auditoria de Duplicação.md | L19: Resultados relacionados:; L32: Resultados relacionados:; L44: Resultados locais relacionados: |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/14 - Como consultar o status e os logs de um deploy na StayCloud/apoio/Fonte Editorial.md | L13: ## Links Internos Validados |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/15 - Como publicar uma nova versão pelo Deploy StayCloud/apoio/Auditoria de Duplicação.md | L11: Resultados relacionados:; L25: Artigos relacionados confirmados: |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/15 - Como publicar uma nova versão pelo Deploy StayCloud/apoio/Fonte Editorial.md | L14: ## Links internos usados |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/16 - Como configurar um domínio personalizado no Deploy StayCloud/04 - VALIDAÇÃO FINAL.md | L69: - Links internos usados: primeiro deploy, logs do Deploy e publicar nova versão. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/16 - Como configurar um domínio personalizado no Deploy StayCloud/apoio/Auditoria de Duplicação.md | L24: - Há tutoriais relacionados a domínio, nameservers e domínio no StayPanel/cPanel, mas não com o objetivo de conectar um domínio ou subdomínio a uma aplicação publicada pelo novo De |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/16 - Como configurar um domínio personalizado no Deploy StayCloud/apoio/Plano de Prints.md | L45: Censurar: dados privados, IDs, hostnames privados, IPs e registros não relacionados. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/_MODELO OFICIAL/04 - VALIDAÇÃO FINAL.md | L52: - [ ] Pelo menos dois links internos válidos |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/_VALIDAÇÕES GERAIS/Auditoria de Tutoriais do Deploy.md | L18: ## Resultados Relacionados Na Planilha; L34: ## Resultados Relacionados Na Base Pública; L44: ## Resultados Relacionados No Obsidian |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/_VALIDAÇÕES GERAIS/RELATÓRIO GERAL V2.md | L25: - pelo menos dois links internos úteis;; L59: - Links internos foram selecionados a partir de registros locais de artigos publicados ou estudados na base StayCloud. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como acompanhar seus chamados no Painel Novo da StayCloud/publicacao/03 - SEO Rank Math.md | L26: - Links internos sugeridos: tutorial de abertura de chamado e tutorial da área de Suporte, após confirmar as URLs canônicas no WordPress.; L38: - [ ] Confirmar links internos canônicos antes da publicação; L46: - Meta estimada: pontuação acima de 80 após preencher os campos e confirmar os links internos. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como acompanhar seus chamados no Painel Novo da StayCloud/publicacao/06 - Validacao Rascunho WordPress.md | L50: - Os links internos sugeridos precisam ter suas URLs canônicas confirmadas antes da publicação. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como acompanhar seus chamados no Painel Novo da StayCloud/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug preservado, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/markdown/como-consultar-uso-email-painel-novo-staycloud.md | L79: - **Links internos sugeridos:** Como criar uma conta de e-mail no Painel Novo — URL: confirmar antes da publicação; Como acompanhar seus chamados no Painel Novo — URL: confirmar an; L81: - **Checklist Rank Math:** palavra-chave no título, meta description, slug, primeiro parágrafo e subtítulo; ALT relevante; links internos; parágrafos curtos; título e meta descript; L82: - **Status estimado:** acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/validacoes/validacao-local.md | L54: - Palavra-chave principal, título SEO, slug, meta description, excerpt, dados sociais, ALT e links internos sugeridos: definidos no Markdown mestre.; L57: - Pontuação SEO estimada: acima de 80 após confirmar links internos e preencher os campos no Rank Math. |
| 03 - Tutoriais/Produção em Lote/Painel Novo/_Descartados/Descartado - Tema nao aprovado - 2026-07-28 - Ver detalhes e Gerenciar/04 - VALIDAÇÃO FINAL.md | L54: ## Links internos validados |
| 04 - Gestão/Reuniões Suporte/00 - README/README.md | L19: - `05 - Templates/`: templates, guia e instrucoes de formalizacao; |
| 04 - Gestão/Reuniões Suporte/05 - Templates/Guia - Como Formalizar Reuniões de Suporte.md | L45: `Foi identificado um volume elevado de tickets relacionados a e-mail, principalmente envolvendo dúvidas sobre configuração de DNS.`; L88: 1. Preencher o template correspondente. |
| 06 - Relatórios/Auditoria Geral - Tutoriais StayCloud e Conexões do Obsidian - 2026-07-28.md | L71: referência ao MOC de Tutoriais StayCloud; L73: referência ao MOC do Viny Brain; L89: referência ao Checkpoint Atual; L146: criação do MOC de Tutoriais StayCloud. |
| 08 - Codex/Checklist de Validação de Base.md | L7: - Antes de criar ou alterar notas, templates ou painéis do curso.; L20: - `14 - Histórico Codex/Checkpoint Atual.md`; L22: - `15 - Cursos e Estudos/SINAPSE T03/01 - Notas de Aula/Template Nota de Aula.md`; L23: - `15 - Cursos e Estudos/SINAPSE T03/02 - Aplicações no Viny Brain/Template Plano de Aplicação.md` |
| 08 - Codex/Mapa de Uso do Vault.md | L34: ### `99 - Templates`; L35: Pasta de modelos. Serve para arquivos base que podem ser copiados e adaptados, como o template da Daily.; L107: ### `99 - Templates`; L145: 5. Se algo for recorrente, transformar em template, prompt ou documento de referência. |
| 08 - Codex/Regras de Isolamento de Tarefa.md | L34: - Outra sessao para criar templates. |
| 08 - Codex/Regras do Codex.md | L74: - Quando criar ou alterar regras, templates ou estruturas importantes. |

Responsáveis prováveis pela reincidência:

- `Agente Base de Conhecimento` e fluxo antigo de importação de playbooks: exige link para `Índice Geral` e `Mapa por Temas` em muitos playbooks.
- `Agente Memória/Checkpoint` e históricos de sessão: acumulam referências de rastreabilidade, úteis mas ruidosas no grafo global.
- `Agente Governança do Viny Brain`: regra antiga valorizava links centrais e índices; precisa adicionar critério anti-poluição sem remover governança.
- Templates de tutoriais e playbooks: podem reforçar seções de links relacionados e checklists com referências repetidas.

## Configuração do Graph View

| Configuração | Valor |
| --- | --- |
| search |  |
| showTags | False |
| showAttachments | False |
| hideUnresolved | False |
| showOrphans | False |
| colorGroups | [] |
| linkDistance | 213 |
| repelStrength | 7.74739583333333 |
| linkStrength | 0.477945963541667 |
| scale | 0.7303316681333325 |

Separação do problema:

- Conteúdo: há links duplicados, hubs globais, links genéricos e conexões cruzadas que precisam de revisão real.
- Visual: o Graph View está sem filtro, sem grupos por pasta e com links não resolvidos visíveis (`hideUnresolved=false`). Tags e anexos estão ocultos, então não são o fator visual dominante hoje.

Recomendação visual adicional: criar filtros salvos por projeto/pasta, usar grupos por área, esconder links não resolvidos no grafo global e trabalhar com grafos locais para Viny Watch, Legacy Doc, StayCloud, Viny Flow e Base de Conhecimento.

## Plano de limpeza

Resumo por ondas:

1. Onda 1: duplicados, self-links, quebrados com destino evidente e repetições na mesma seção.
2. Onda 2: rodapés automáticos, links globais genéricos, templates e links em massa para MOCs amplos.
3. Onda 3: semântica entre projetos, relações fracas, backlinks artificiais e notas superconectadas.
4. Onda 4: arquitetura de MOCs, consolidação de índices, regras de agentes/workflows e filtros visuais por contexto.

Detalhamento completo em `06 - Relatórios/Plano de Limpeza das Conexões do Obsidian - 2026-08-06.md`.

## Regras preventivas

- Não criar link por coincidência de termo.
- Não ligar toda nota a mapas globais.
- Não criar link recíproco sem função de navegação ou rastreabilidade.
- Não adicionar seção `Relacionados` genérica.
- Não transformar toda menção em WikiLink.
- Não conectar projetos separados sem relação operacional comprovada.
- Preferir MOC local a múltiplos links globais.
- Registrar mentalmente a razão do link: dependência, fonte, execução, navegação ou rastreabilidade.

## Riscos

- Remover links de checkpoints pode prejudicar retomada de sessão se feito sem critério.
- Remover links de MOCs saudáveis pode piorar a navegação mesmo reduzindo grau visual.
- Links de playbooks para `Índice Geral` e `Mapa por Temas` parecem intencionais no fluxo antigo; devem ser tratados como decisão arquitetural, não como limpeza mecânica.
- Pastas técnicas dentro do vault podem continuar inflando busca/visualização se não forem filtradas ou movidas em uma etapa aprovada.

## Próxima etapa

Vinicius deve revisar o relatório, o plano e a matriz CSV. Depois, autorizar explicitamente a execução da Onda 1 ou pedir ajustes nos critérios. **Nenhuma alteração de limpeza foi aplicada nesta execução.**
