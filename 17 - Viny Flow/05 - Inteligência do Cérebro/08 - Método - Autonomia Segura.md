# Método - Autonomia Segura

TL;DR: use este método para decidir o que o cérebro pode fazer sozinho e o que ainda exige confirmação.

## Objetivo

Subir autonomia sem perder rastreabilidade, reversão ou revisão humana.

## Quando usar

- Quando uma rotina já estiver estável
- Quando a automação parecer útil, mas arriscada
- Quando existir dúvida sobre o limite entre ajuda e execução

## Entrada esperada

- Processo candidato
- Impacto
- Risco
- Dependências
- Critério de reversão

## Passo a passo

1. Listar o que seria automático
2. Listar o que ainda precisa de confirmação
3. Definir o ponto de parada
4. Registrar dry-run e apply
5. Validar revisão humana

## Saída esperada

- Grau de autonomia
- Guardrails
- Ponto de confirmação
- Plano de reversão

## Checklist

- [ ] Benefício claro
- [ ] Risco mapeado
- [ ] Reversão possível
- [ ] Revisão humana definida
- [ ] Limite escrito

## Riscos

- Autonomia cedo demais
- Processo sem reversão
- Execução opaca
- Dado sensível exposto

## Prompt para usar no Codex

`Avalie este processo e diga qual parte pode ser autônoma, qual parte exige confirmação e qual é o limite seguro de execução.`

## Critérios de qualidade

- Autonomia cresce por etapas
- O limite é explícito
- O risco é visível
- A revisão humana continua possível

