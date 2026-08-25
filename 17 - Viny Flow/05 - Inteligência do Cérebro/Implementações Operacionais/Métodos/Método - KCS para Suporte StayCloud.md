# Método - KCS para Suporte StayCloud

TL;DR: use este método para transformar atendimentos, tickets e problemas recorrentes em conhecimento reutilizável sem bagunçar o vault e sem publicar nada automaticamente.

## Objetivo

Transformar atendimento real em conhecimento operacional útil para o `Viny Brain`, para o `Viny Flow` e para a operação de suporte da `StayCloud`.

## Quando usar

- quando resolver um problema técnico
- quando repetir uma resposta mais de uma vez
- quando encontrar causa de erro
- quando identificar dúvida recorrente
- quando criar orientação para cliente
- quando corrigir playbook antigo
- quando descobrir risco operacional
- quando perceber oportunidade de tutorial

## Quando NÃO usar

- quando for assunto pontual sem aprendizado
- quando envolver dados sensíveis do cliente
- quando envolver credenciais
- quando ainda não tiver solução validada
- quando for hipótese não confirmada
- quando puder gerar orientação perigosa para cliente

## Fluxo KCS StayCloud

### Etapa 1 - Capturar o caso

Registrar o caso com contexto mínimo: sintoma, origem, impacto e data.

### Etapa 2 - Classificar o tipo do caso

Definir se é dúvida simples, falha técnica, incidente, ajuste, orientação ou recorrência.

### Etapa 3 - Verificar se já existe playbook/tutorial/resposta

Buscar no `Viny Brain` e na base de conhecimento se o tema já existe.

### Etapa 4 - Usar conhecimento existente, se houver

Se já existir algo útil, responder com a fonte certa e atualizar só o que estiver faltando.

### Etapa 5 - Atualizar conhecimento, se estiver incompleto

Se a solução existir, mas estiver fraca ou velha, revisar e completar.

### Etapa 6 - Criar novo conhecimento, se não existir

Se não houver base, criar uma nota estudada, resposta pronta, playbook, tutorial ou runbook.

### Etapa 7 - Definir destino

Escolher um destino claro:

- resposta pronta
- playbook interno
- tutorial para cliente
- checklist
- runbook
- postmortem
- backlog
- descartar

### Etapa 8 - Marcar status do conhecimento

Marcar o estado do item:

- rascunho
- validado
- precisa revisar
- cliente
- interno
- risco alto

### Etapa 9 - Linkar com índice/mapa

Conectar a nota ao índice da base, ao mapa temático e ao método relacionado.

### Etapa 10 - Registrar próximo passo

Fechar com uma ação clara: validar, publicar internamente, virar tutorial, revisar ou escalar.

## Matriz de destino

| Caso encontrado | Destino recomendado | Exemplo |
|---|---|---|
| Cliente pergunta como configurar e-mail no Outlook | tutorial cliente / resposta pronta | passo a passo para configuração |
| Erro 500 Elementor resolvido | playbook interno + possível artigo | registrar causa e correção |
| SSL não gera por DNS errado | playbook interno + resposta pronta | orientar correção de DNS |
| Malware recorrente | runbook + checklist de segurança | resposta de contenção e limpeza |
| Queda geral no servidor | incidente + postmortem | documentar resposta e impacto |
| Dúvida de cobrança simples | resposta pronta | resposta curta e objetiva |
| Processo repetitivo de suporte | checklist ou comando do Viny Flow | automatizar a organização, não a escrita real |

## Padrão de nota gerada pelo KCS

- título
- origem do aprendizado
- tipo
- status
- interno ou cliente
- problema
- causa
- solução validada
- passo a passo
- riscos
- o que não fazer
- resposta pronta
- links relacionados
- próxima revisão

## Checklist de qualidade KCS

- [ ] tem problema claro?
- [ ] tem causa provável?
- [ ] tem solução validada?
- [ ] tem risco?
- [ ] separa interno/cliente?
- [ ] remove dados sensíveis?
- [ ] tem resposta pronta?
- [ ] tem links relacionados?
- [ ] precisa virar tutorial?
- [ ] precisa virar playbook?
- [ ] precisa virar runbook?
- [ ] precisa escalar?
- [ ] precisa revisar depois?

## Riscos

- conhecimento virar lixo acumulado
- artigo sem revisão virar verdade errada
- suporte responder sem fonte
- conhecimento útil ficar enterrado
- IA aprender a partir de base suja
- misturar dado sensível com aprendizado reaproveitável

## O que NÃO fazer

- não publicar automaticamente
- não salvar credencial ou segredo
- não copiar solução sem validação
- não tratar hipótese como verdade
- não misturar bruto com conclusão
- não transformar todo caso em tutorial
- não criar conhecimento sem destino

## Prompt para usar no Codex

`Siga o método KCS para suporte StayCloud. Leia este caso, verifique se a solução foi validada, classifique o destino do conhecimento e gere uma nota Markdown limpa para o Viny Brain sem salvar dados sensíveis.`

## Critérios de qualidade

- o caso fica claro
- a solução fica validada
- o destino fica explícito
- o risco fica visível
- a nota pode ser revisada rápido
- a resposta pronta pode ser reutilizada sem improviso

