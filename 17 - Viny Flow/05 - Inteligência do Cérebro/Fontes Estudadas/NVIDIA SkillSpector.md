# NVIDIA SkillSpector

## O que é

SkillSpector é um scanner de segurança para AI Agent Skills. Ele foi projetado para avaliar skills antes da instalação e apontar riscos de segurança, padrões maliciosos e vulnerabilidades prováveis.

## Para que serve

- Avaliar skills antes de instalar
- Detectar vulnerabilidades e padrões suspeitos
- Reduzir risco de instalar uma skill maliciosa ou mal configurada
- Apoiar uma decisão de segurança antes de habilitar automação

## O que ele analisa

Os materiais públicos da NVIDIA indicam cobertura para:

- prompt injection
- exfiltração de dados
- privilege escalation
- supply chain
- agency excessiva
- vazamento de system prompt
- memory poisoning
- tool misuse
- MCP/tool poisoning
- código perigoso
- padrões maliciosos

Também há menção a análise estática com apoio opcional de LLM, além de verificações de vulnerabilidade e de integridade de pipeline.

## Entradas aceitas

O projeto indica suporte para análise de:

- repositório Git
- URL
- zip
- diretório
- arquivo único
- `SKILL.md`

## Saídas úteis

Saídas documentadas nas fontes:

- score de risco
- severidade
- recomendação
- `safe_to_install`
- findings
- relatório em terminal
- JSON
- Markdown
- SARIF

## Como poderia entrar no Viny Flow

Uso futuro sugerido para o Viny Flow:

- etapa obrigatória antes de instalar skill externa
- ferramenta de auditoria para skills candidatas
- gate de segurança antes de MCP ou automação
- relatório anexado em auditorias de skill
- reforço do Agente Segurança

## Riscos

- a ferramenta ainda precisa ser auditada antes de instalar
- não substitui revisão humana
- análise estática pode gerar falso positivo ou falso negativo
- análise com LLM pode exigir chave ou API
- não deve rodar com tokens expostos
- não deve virar automação sem controle

## Recomendação

- útil
- prioridade média/alta para segurança
- não instalar agora
- estudar primeiro
- testar depois em sandbox com uma skill fictícia

## Fontes

- https://github.com/NVIDIA/skillspector
- https://github.com/NVIDIA/skillspector/blob/main/docs/DEVELOPMENT.md
