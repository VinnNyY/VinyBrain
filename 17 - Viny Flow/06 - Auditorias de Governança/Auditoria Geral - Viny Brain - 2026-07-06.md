# Auditoria Geral - Viny Brain - 2026-07-06

## Status geral

**Atenção**

O vault está funcional e bem segmentado por áreas, mas a primeira auditoria geral mostrou pontos de manutenção estrutural em índices, MOCs, notas órfãs e normalização de links. Não houve indício de segredo exposto em texto puro no escopo verificado.

## Escopo auditado

- estrutura de pastas
- links internos do Obsidian
- MOCs
- índices
- tutoriais StayCloud
- playbooks
- agentes
- workflows
- comandos manuais
- integrações
- estudos
- histórico / checkpoint
- riscos de segurança

## Método usado

- varredura local de arquivos Markdown
- inspeção dos mapas centrais do vault
- leitura dos arquivos-base de Viny Flow, Base de Conhecimento e tutoriais StayCloud
- checagem de padrões de link, inbound links e sinais de segurança

## Problemas P0

Nenhum problema P0 confirmado na varredura atual.

## Problemas P1

### 1. Índice de temas com referência que não existe

- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md:98`
- O índice aponta para `Transferência de Domínios (Nacionais e Internacionais)`, mas não foi encontrado arquivo correspondente em `13 - Base de Conhecimento/01 - Playbooks/`.
- Impacto: o mapa promete um conteúdo que não está presente no vault indexado.

### 2. Link frágil por causa de `#` no título

- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md:39`
- O item `Playbook: Resolução de Erro MySQL #2006 (StayCare Technical Support)` existe como nota, mas o caractere `#` no nome deixa o wikilink frágil e sujeito a quebra em resolutores e edições futuras.
- Impacto: manutenção ruim e alto risco de link inválido ao editar ou migrar.

### 3. README de área de estudo com links para pastas

- `17 - Viny Flow/05 - Inteligência do Cérebro/README.md`
- O arquivo aponta para `Templates/` e `Implementações Operacionais/` como pastas, em vez de apontar para uma nota de entrada explícita dessas subáreas.
- Impacto: a navegação fica menos previsível e a auditoria de estrutura perde precisão.

## Problemas P2

### 1. Muitas notas importantes estão sem links de entrada

Há um volume alto de notas com zero inbound links. Isso não é necessariamente erro, porque o vault tem área de estudo, templates e históricos soltos. Ainda assim, alguns itens importantes deveriam estar conectados a mapas ou índices:

- `03 - Tutoriais/Diagnóstico - Fluxo de Tutoriais StayCloud.md`
- `03 - Tutoriais/Template Pedido de Tutorial StayCloud.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo - Inventário de Tutoriais.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/11 - Backlog de Melhorias do Cérebro.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/Skills Candidatas/viny-ingest-source.md`

### 2. Normalização de links ainda está irregular

- Alguns mapas usam caminhos absolutos longos.
- Outros usam links para pastas, o que deixa a manutenção menos uniforme.
- Isso não quebra o vault agora, mas complica revisão, migração e auditoria futura.

### 3. Áreas de trabalho novas ainda sem um ponto de entrada explícito

- `03 - Tutoriais/Produção em Lote/Painel Novo/Lote 02B - Piloto` está organizado localmente, mas ainda é uma área de trabalho operacional e pode ganhar um índice próprio mais adiante.
- Impacto: descoberta manual e rastreabilidade ficam piores do que poderiam.

## Links quebrados

### Confirmados

- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md:98` -> `Transferência de Domínios (Nacionais e Internacionais)` não foi encontrado como nota do vault.

### Fragilidade estrutural

- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md:39` -> o título com `#2006` torna o link frágil e merece normalização.

## Notas órfãs

O vault tem muitas notas sem inbound links. A maioria parece pertencer a estudo, histórico, template ou backlog, então não é problema automático. As mais relevantes para conexão futura são:

- `03 - Tutoriais/Diagnóstico - Fluxo de Tutoriais StayCloud.md`
- `03 - Tutoriais/Template Pedido de Tutorial StayCloud.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo - Inventário de Tutoriais.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/11 - Backlog de Melhorias do Cérebro.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/Skills Candidatas/viny-ingest-source.md`

## Arquivos fora do lugar

Nenhum arquivo crítico fora do lugar foi confirmado nesta auditoria.

Os lotes reprovados de tutoriais StayCloud parecem estar corretamente arquivados em `03 - Tutoriais/Produção em Lote/Painel Novo/_Lotes Reprovados/`.

## Índices / MOCs desatualizados

### 1. `Mapa por Temas`

- precisa de correção do item de `Transferência de Domínios (Nacionais e Internacionais)`
- precisa de normalização do item de MySQL com `#2006`

### 2. `Inteligência do Cérebro`

- o `README.md` deveria apontar para notas de entrada explícitas das subáreas, não apenas para pastas

### 3. Cobertura de áreas novas

- os mapas principais já incluem `Agente Governança do Viny Brain`, `Auditar Governança do Viny Brain` e `Auditorias de Governança`
- ainda assim, algumas áreas de trabalho novas e notas de apoio continuam sem entrada direta

## Riscos de segurança

### Confirmados

- Nenhum segredo real em texto puro foi identificado na varredura local do vault.

### Atenção

- O vault referencia com frequência o arquivo externo de ambiente em `/home/vinicius-alves/.config/viny-integrations/.env`.
- Isso é esperado para a arquitetura atual, mas deve continuar fora do vault e sem qualquer conteúdo sensível copiado para o Obsidian.
- Há muitos arquivos de integração com menção a `--apply`; isso não é risco por si só, mas exige disciplina operacional para não transformar dry-run em execução real sem aprovação.

## Recomendações

### P0

- Nenhuma correção P0 imediata confirmada.

### P1

- corrigir o item ausente de `Transferência de Domínios (Nacionais e Internacionais)` no `Mapa por Temas`
- normalizar o link do playbook com `#2006`
- transformar os links de pasta do `README` de `Inteligência do Cérebro` em entradas explícitas

### P2

- conectar as notas órfãs mais importantes aos mapas corretos
- criar um índice de entrada para `03 - Tutoriais/Produção em Lote` quando o fluxo estabilizar
- reduzir links absolutos longos quando houver alternativa local estável
- manter o padrão de nomes mais previsível para novos conteúdos

## Plano de correção sugerido

1. Atualizar `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md` para remover o item faltante e revisar o link de MySQL com `#2006`.
2. Revisar `17 - Viny Flow/05 - Inteligência do Cérebro/README.md` para trocar links de pastas por notas de entrada.
3. Ligar as notas órfãs mais úteis aos MOCs e índices corretos.
4. Definir se `03 - Tutoriais/Produção em Lote` vai ganhar um README ou mapa próprio.
5. Repetir a auditoria depois das correções para comparar avanço.

## O que depende da sua aprovação

- corrigir o `Mapa por Temas`
- normalizar o `README` de `Inteligência do Cérebro`
- criar ou ajustar mapas de entrada para notas órfãs relevantes
- definir se a área `03 - Tutoriais/Produção em Lote` deve ganhar índice próprio
- decidir se a próxima auditoria será geral ou apenas sobre `17 - Viny Flow` e `13 - Base de Conhecimento`

## Resumo executivo

O vault está em condição boa de operação, mas ainda não está totalmente governado. O principal ganho agora está em corrigir alguns pontos de indexação e transformar notas importantes em entradas navegáveis. Não há sinal de vazamento de segredo no texto auditado.
