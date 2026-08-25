# Método - Segurança para Skills e MCP

TL;DR: use este método para revisar risco antes de criar skill, conectar MCP ou ampliar autonomia.

## Objetivo

Garantir que skill e MCP só entrem quando o risco estiver explícito e controlado.

## Quando usar

- Antes de criar ou alterar skill
- Antes de estudar MCP com integração real
- Quando o comportamento tocar credencial, rede ou automação externa

## Auditoria de skills externas com referência no SkillSpector

- toda skill externa precisa ser estudada antes
- toda skill externa precisa ter origem, objetivo, riscos e arquivos revisados
- preferir análise estática e local
- nunca instalar direto com `npx`, `pip` ou `uv` sem aprovação
- nunca rodar skill que peça token sem auditoria
- se futuramente o SkillSpector for instalado, usar primeiro em sandbox
- nenhum resultado automático substitui aprovação humana

## Entrada esperada

- Ideia da skill
- Superfície afetada
- Dados sensíveis possíveis
- Dependências
- Reversibilidade

## Passo a passo

1. Mapear acesso necessário
2. Listar dados sensíveis
3. Separar leitura de escrita
4. Definir guardrails
5. Decidir se o estudo continua ou para

## Saída esperada

- Risco resumido
- Guardrails obrigatórios
- Limite de escopo
- Próxima ação

## Checklist

- [ ] Risco de credencial avaliado
- [ ] Risco de escrita avaliado
- [ ] Guardrails definidos
- [ ] Reversão possível
- [ ] Sem automação cega

## Riscos

- Expor segredos
- Conectar ferramenta antes da hora
- Automatizar algo irreversível
- Criar skill sem limite

## Prompt para usar no Codex

`Revise este plano de skill ou MCP e devolva riscos, guardrails, limites e a decisão segura antes de qualquer implementação.`

## Critérios de qualidade

- O risco aparece antes da execução
- O limite é explícito
- O estudo não vira instalação automática
- A decisão é reversível
