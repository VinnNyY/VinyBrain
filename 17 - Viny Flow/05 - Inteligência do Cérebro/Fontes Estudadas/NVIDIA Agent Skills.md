# NVIDIA Agent Skills

## O que é

É um catálogo de skills verificadas da NVIDIA para agentes de IA. O repositório funciona como catálogo e espelho diário de skills mantidas nos repositórios de produto.

## O que tem de interessante

Padrões e conceitos relevantes:

- `SKILL.md`
- `skill-card.md`
- `skill.oms.sig`
- certificado ou raiz de confiança
- dataset de avaliação
- `BENCHMARK.md`
- catálogo de skills
- compatibilidade com a Agent Skills specification
- suporte a agentes como Codex, Claude Code e Cursor, conforme a documentação pública

## O que podemos copiar como padrão

Não copiar a implementação da NVIDIA, mas sim o modelo de governança:

- toda skill precisa ter identidade
- toda skill precisa ter descrição clara
- toda skill precisa ter limite de atuação
- toda skill precisa ter critérios de qualidade
- toda skill precisa ter riscos
- toda skill precisa ter avaliação ou teste
- toda skill precisa passar por auditoria antes de virar oficial
- toda skill precisa ter versão e status

## Aplicação no Viny Flow

Propostas práticas:

- criar `Skill Card` para cada skill do Viny Flow
- criar status: candidata, em teste, aprovada, reprovada, arquivada
- criar checklist de validação
- criar benchmark simples
- criar relatório de auditoria
- criar padrão para `SKILL.md` interno
- criar regra de não instalar skill externa sem inspeção

## Riscos

- skills públicas podem não servir para nosso contexto
- algumas skills podem depender de stack NVIDIA
- instalar com `npx` sem auditoria pode alterar ambiente
- skills podem conter instruções perigosas
- skill externa não deve ter acesso a token, WordPress, Notion, ClickUp ou painel real sem revisão

## Recomendação

- boa referência de governança
- não instalar agora
- usar como inspiração para criar padrão próprio do Viny Flow

## Fontes

- https://github.com/NVIDIA/skills
- https://github.com/NVIDIA/skills/blob/main/README.md
- https://github.com/NVIDIA/skills/blob/main/docs/signing-agent-skills.mdx
- https://github.com/NVIDIA/skills/blob/main/docs/advanced-install.mdx
