# Pesquisa Base - Cérebro Autônomo

TL;DR: esta página reúne os conceitos que vão orientar a evolução do `Viny Brain` para uma wiki viva operacional, com memória em camadas, agentes e guardrails.

## Conceitos base

- **LLM Wiki**: estrutura viva em que o modelo consulta, sintetiza e atualiza conhecimento com rastreabilidade
- **Agent Skills**: habilidades pequenas e reutilizáveis que especializam o comportamento do agente
- **MCP**: camada de integração que conecta ferramentas e fontes externas, com risco operacional maior se entrar cedo demais
- **RAG vs wiki viva**: RAG recupera trechos; wiki viva organiza, compila e mantém contexto persistente
- **Memória Markdown-first**: o Markdown é a base principal de persistência, leitura e auditoria
- **Memória vetorial/grafo**: complementa a wiki quando a busca semântica e as relações entre conceitos começam a importar mais
- **Agentes especialistas**: agentes focados em um tipo de tarefa, com escopo estreito e qualidade previsível
- **Guardrails**: limites explícitos para impedir escrita, automação ou exposição indevida
- **Dry-run / apply**: primeiro simular, depois aplicar com autorização clara
- **Autonomia progressiva**: evoluir de leitura e estudo para sugestão, preparação e, só depois, execução controlada

## Hipótese de trabalho

O `Viny Brain` funciona melhor como wiki viva quando cada conceito tem método, regra, limite e destino claro.

## Perguntas de pesquisa

- O que deve ficar em Markdown puro
- O que vale virar método operacional
- O que deve virar skill ou checklist
- O que precisa de auditoria antes de entrar em produção

## Resultado esperado

- Conceitos mapeados
- Termos definidos
- Riscos registrados
- Próximos métodos derivados

