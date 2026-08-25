# Suporte para Conhecimento KCS

## Objetivo

Transformar um atendimento real em conhecimento útil no `Viny Brain` usando KCS.

## Entrada esperada

- caso
- origem
- impacto
- solução validada
- público
- risco
- link ou referência

## Perguntas que o Codex deve fazer

- Qual foi o caso?
- A solução foi validada?
- É interno ou cliente?
- Houve risco ou dado sensível?
- Já existe playbook, tutorial ou resposta parecida?
- Isso deve virar resposta pronta, playbook, tutorial, runbook ou backlog?

## Decisão de destino

- resposta pronta
- playbook interno
- tutorial para cliente
- checklist
- runbook
- postmortem
- backlog
- descartar

## Saída esperada

- nota Markdown limpa
- classificação do conhecimento
- destino recomendado
- riscos
- próximo passo

## Checklist

- [ ] caso capturado
- [ ] solução validada
- [ ] risco revisado
- [ ] interno/cliente definido
- [ ] destino definido
- [ ] nota gerada
- [ ] linkada com o índice

## Riscos

- dado sensível
- solução não validada
- resposta perigosa ao cliente
- duplicidade
- conhecimento sem revisão

## Prompt de exemplo

`Siga o workflow Suporte para Conhecimento KCS. Leia este caso, valide a solução, classifique o destino e gere uma nota de conhecimento reutilizável para o Viny Brain sem publicar nada automaticamente.`

