# Nome da skill

viny-ingest-source

## Problema que resolve

Transformar qualquer fonte externa em uma nota estudada, classificada por risco, utilidade, destino e próxima ação, sem copiar estrutura cegamente e sem tratar ruído como verdade.

## Quando usar

- Quando o Viny Brain precisar estudar uma fonte nova
- Quando a fonte puder virar método, skill, playbook ou backlog
- Quando a análise precisar separar bruto, risco e valor operacional

## Quando não usar

- Quando a fonte for apenas referência rápida sem intenção de síntese
- Quando a fonte estiver sensível e exigir revisão humana antes
- Quando o conteúdo já existir e só precisar de link

## Entradas esperadas

- título da fonte
- link ou origem
- tipo da fonte
- contexto da leitura
- sinais de confiabilidade
- sinais de risco
- relação com o que já existe no vault

## Saídas esperadas

- nota estudada em Markdown
- classificação da fonte
- resumo curto
- ideias principais
- riscos
- o que não copiar
- possível método derivado
- possível skill derivada
- próxima ação

## Riscos

- resumo errado
- classificação errada
- copiar fonte sem checagem
- gerar nota poluída
- automatizar ingestão sem revisão

## Arquivos necessários

- `17 - Viny Flow/05 - Inteligência do Cérebro/03 - Método - Ingestão Inteligente de Fonte.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/Templates/Template - Fonte Estudada.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/Templates/Template - Candidata a Skill.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/Fontes Estudadas/`

## Prompt base

`Use o Método de Ingestão Inteligente de Fonte para estudar esta fonte, classificar risco e utilidade, criar uma nota Markdown limpa e dizer se ela deve virar método, playbook ou skill candidata.`

## Critério para virar skill oficial

- o comportamento se repete
- a estrutura é segura
- o escopo é estreito
- a skill melhora entregas sem gerar ruído
- a análise piloto funciona em mais de uma fonte

## Status da análise

candidata

