# Fluxo - Processamento de Material Bruto

## Objetivo

Transformar uma transcrição ou material bruto do SINAPSE T03 em notas reutilizáveis para o Viny Brain.

## Escopo

- Processar apenas material dentro de `15 - Cursos e Estudos/SINAPSE T03/00 - Fontes Brutas`.
- Nao processar materiais de outras pastas sem confirmação.
- Nao copiar a transcrição inteira.

## Passo a passo

1. Identificar a próxima fonte bruta ainda não processada.
2. Ler a transcrição completa.
3. Criar uma nota de aula usando `Template Nota de Aula.md`.
4. Extrair conceitos, prompts, comandos, skills, agentes e pontos específicos de Claude Code.
5. Traduzir tudo para Codex CLI quando houver adaptação possível.
6. Se surgir melhoria prática clara, criar plano de aplicação.
7. Se houver skill, prompt ou agente reaproveitável, criar o item correspondente.
8. Atualizar o checkpoint do dia com o que foi processado.

## Regras de saída

- Priorizar utilidade prática.
- Evitar reprodução bruta da fonte.
- Separar claramente o que é específico de Claude Code e o que é adaptável ao Codex.

## Critérios para criar extras

- Criar plano quando houver melhoria aplicável ao fluxo do Viny Brain.
- Criar skill ou prompt quando houver reutilização real.
- Deixar de fora o que for apenas repetição da aula.

## Resultado esperado

- Nota de aula estruturada.
- Eventual plano de aplicação.
- Eventual skill ou prompt adaptado.
