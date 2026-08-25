# Pesquisa - IA para Suporte com Base de Conhecimento

## Princípio

IA de suporte só deve avançar depois que a base estiver limpa, validada e bem classificada.

## Critérios da base

- conteúdo validado
- status
- fonte
- última revisão
- interno vs cliente
- risco
- resposta permitida
- resposta proibida
- quando escalar para humano

## Resposta permitida

- orientar passo seguro
- resumir documentação validada
- apontar o artigo ou playbook relevante
- pedir informação faltante
- sugerir próxima etapa de triagem

## Resposta proibida

- inventar solução
- ocultar risco
- orientar execução destrutiva
- expor credenciais
- afirmar algo sem base validada
- tentar substituir humano em incidente crítico

## Quando escalar para humano

- risco de perda de dados
- site fora do ar
- segurança comprometida
- base sem resposta válida
- ticket com impacto alto ou dúvida grave

## Objetivo

Permitir que a IA ajude na resposta sem inventar, sem expor segredo e sem substituir revisão humana onde o risco for alto.

## Riscos

- base suja gera resposta errada
- resposta proibida vazando informação
- IA respondendo além do permitido
- escalonamento atrasado

## Aplicação no Viny Brain

- IA como assistente de triagem e redação
- base como fonte curada
- respostas com limites claros
- escalonamento sempre possível
