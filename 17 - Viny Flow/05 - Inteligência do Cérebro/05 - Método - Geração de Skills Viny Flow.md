# Método - Geração de Skills Viny Flow

TL;DR: use este método quando um comportamento repetível merecer virar skill própria do `Viny Flow`.

## Objetivo

Decidir quando um padrão vira skill e qual escopo ele precisa ter.

## Quando usar

- Quando um fluxo se repete
- Quando o comportamento pede consistência
- Quando a mesma lógica aparece em mais de um lugar

## Entrada esperada

- Comportamento repetido
- Benefício esperado
- Risco operacional
- Dependências
- Sinais de manutenção

## Passo a passo

1. Descrever o comportamento
2. Identificar entradas e saídas
3. Definir limites
4. Verificar risco de duplicação
5. Decidir se vale skill, workflow ou comando

## Saída esperada

- Especificação curta da skill
- Escopo
- Não escopo
- Critérios de uso

## Checklist

- [ ] Comportamento repetido
- [ ] Escopo estreito
- [ ] Limites claros
- [ ] Valor prático alto
- [ ] Risco controlado

## Riscos

- Skill genérica demais
- Skill duplicando workflow
- Skill tentando fazer tudo
- Skill sem guardrails

## Prompt para usar no Codex

`Avalie se este comportamento repetido deve virar skill do Viny Flow, e devolva escopo, limites, ganhos e riscos antes de qualquer implementação.`

## Critérios de qualidade

- Resolve um problema real
- Tem fronteira clara
- Pode ser revisada rápido
- Não substitui um workflow inteiro sem motivo

