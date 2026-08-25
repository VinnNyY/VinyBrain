# Plano de Limpeza das Conexões do Obsidian - 2026-08-06

## Objetivo

Limpar o grafo do Obsidian sem destruir navegação útil, rastreabilidade ou governança do Viny Brain.

## Arquivos de referência

- Relatório principal: `06 - Relatórios/Auditoria de Conexões do Obsidian - 2026-08-06.md`
- Matriz de revisão: `06 - Relatórios/Matriz de Conexões para Revisão - 2026-08-06.csv`
- Agente responsável: `17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md`
- Workflows usados: `/auditar-contexto`, `/auditar-governanca`, `/auditar-viny-flow`, `/quality-gate`, `/checkpoint`

## Princípios

- Cada link precisa justificar dependência, fonte, execução, navegação ou rastreabilidade.
- MOC saudável é preservado.
- Projeto independente não recebe link por semelhança de tema ou tecnologia.
- Histórico e checkpoint devem continuar úteis, mas sem virar hub universal.
- Redução de links é consequência, não objetivo isolado.

## Onda 1 - Risco baixo

Escopo:

- Consolidar links duplicados dentro da mesma nota.
- Remover self-links óbvios.
- Corrigir links quebrados quando o destino correto for evidente.
- Consolidar links repetidos na mesma seção.
- Corrigir links para arquivos inexistentes claramente substituídos.

Critério de aprovação:

- A matriz deve indicar `consolidar link duplicado`, `remover link` para self-link ou `corrigir destino` com confiança alta.
- Nenhum link semântico deve ser removido por volume.
- Executar primeiro em lote pequeno e validar no Obsidian.

## Onda 2 - Poluição estrutural

Escopo:

- Revisar rodapés automáticos e seções `Links relacionados` sem função clara.
- Revisar links globais para `MOC - Viny Brain`, `MOC - Tutoriais StayCloud`, `Checkpoint Atual`, `Índice Geral` e `Mapa por Temas` quando aparecem fora de contexto.
- Revisar templates que estimulam links genéricos.
- Criar regra para preferir MOC local a múltiplos hubs globais.

Critério de aprovação:

- Manter links globais em MOCs, painéis, agentes, workflows e notas onde a navegação é real.
- Substituir links globais por MOC local quando a nota pertence claramente a um projeto/área específica.

## Onda 3 - Semântica

Escopo:

- Revisar relações classificadas como `GENÉRICA`, `INCORRETA`, `OBSOLETA` e `INCERTA` na matriz.
- Separar Legacy Doc, Viny Watch, StayCloud, Viny Flow, reuniões, estudos e ferramentas.
- Revisar backlinks artificiais e vínculos recíprocos sem função.
- Tratar notas superconectadas que não são MOC, índice, agente ou workflow.

Critério de aprovação:

- Só remover quando não houver relação direta, fonte, dependência, processo, navegação ou rastreabilidade.
- Links entre projetos ficam apenas quando há reunião, decisão, demanda, risco, arquitetura ou integração diretamente relacionada.

## Onda 4 - Arquitetura

Escopo:

- Dividir MOCs superconectados que tentam representar múltiplas áreas.
- Consolidar índices redundantes.
- Criar MOCs locais por projeto quando necessário.
- Atualizar regras do `Agente Governança do Viny Brain`, `Agente Base de Conhecimento`, templates e workflows para prevenir novas conexões artificiais.
- Criar filtros visuais do Graph View por projeto/pasta.

Critério de aprovação:

- Antes de alterar MOCs ou agentes, aprovar uma proposta textual.
- Depois de alterar, rodar nova auditoria comparativa e quality gate.

## Regras preventivas para agentes

Antes de criar qualquer link, responder:

1. Qual é a relação entre as notas?
2. A relação é direta?
3. O link melhora navegação ou rastreabilidade?
4. Já existe um MOC que representa essa relação?
5. O link mistura projetos independentes?
6. O link será útil depois de seis meses?
7. A nota de destino é realmente a melhor fonte?
8. A conexão está sendo criada apenas por palavra-chave?

Padrão novo:

- Não criar links automaticamente por coincidência de termos.
- Não ligar uma nota a todos os mapas globais.
- Não criar link recíproco sem necessidade.
- Não adicionar seção `Relacionados` genérica.
- Não transformar toda menção em WikiLink.
- Não conectar projetos separados sem relação operacional comprovada.

## Quality gate antes de executar limpeza

- Confirmar backup ou controle de versão do vault.
- Confirmar onda autorizada por Vinicius.
- Exportar lista exata de arquivos que serão alterados.
- Executar no máximo uma onda por vez.
- Gerar diff revisável antes de fechar.
- Atualizar checkpoint e histórico sem criar links excessivos.

## Próximo passo recomendado

Autorizar apenas a **Onda 1** após revisar a matriz CSV. Ela tem o menor risco e deve gerar ganho imediato sem mexer na arquitetura do vault.
