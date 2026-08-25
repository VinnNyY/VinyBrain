# Inventário Aproveitável - ECC

## Critério de leitura

Este inventário separa conceitos que fazem sentido para o Viny Brain e para o Viny Flow, com foco em adaptação simples, não em cópia da estrutura do ECC.

## Conceitos úteis

| Conceito | O que faz no ECC | Faz sentido no Viny Brain? | Como adaptar de forma simples | O que não copiar | Risco se implementar errado | Prioridade |
| --- | --- | --- | --- | --- | --- | --- |
| `context-budget` | Audita consumo de contexto entre skills, agentes, regras e MCP. | Sim. | Criar uma checagem periódica de contexto antes de tarefas grandes. | Medição excessivamente detalhada por componente. | Perder contexto ou ficar preso em sessões pesadas. | Alta |
| `skill-stocktake` | Avalia qualidade e utilidade do portfólio de skills. | Sim. | Rodar uma revisão periódica das skills do Viny Brain. | Sistema de score complexo e volumoso. | Acumular skills redundantes e confusas. | Alta |
| `checkpoint` / `resume-session` | Cria e retoma sessões com estado explícito. | Sim. | Padronizar checkpoint curto e retomada clara no histórico do dia. | Logar estado em sistema paralelo pesado. | Perder continuidade entre sessões. | Alta |
| `verification-loop` | Executa build, lint, testes, segurança e diff review. | Parcialmente. | Criar uma versão documental de verificação por etapa. | Pressupor stack de código/testes em todo fluxo. | Acreditar que algo está pronto sem checagem. | Alta |
| `security-review` / `security-scan` | Audita segredos, validação, XSS, CSRF, permissões e superfície de risco. | Sim. | Usar como checklist de segurança para docs, fluxos e arquivos sensíveis. | Integrar scanner pesado ou automático sem necessidade. | Expor credenciais, links ou dados sensíveis. | Alta |
| `research-ops` / `deep-research` | Separa fato, inferência e recomendação com pesquisa fonte-centrada. | Sim. | Adotar o padrão de evidência e de separação entre fato e decisão. | MCPs de pesquisa e automação pesada. | Misturar suposição com fato. | Alta |
| `brand-voice` | Extrai e reaplica voz de escrita a partir de fontes reais. | Sim. | Criar um perfil de voz para tutoriais, playbooks e docs. | Imitação literal de estilo em massa. | Produzir texto genérico ou inconsistente. | Média |
| `content-engine` | Adapta um conteúdo-fonte para vários formatos e plataformas. | Sim. | Reaproveitar um conteúdo-base para variações internas e externas. | Pipeline social completo. | Diluir o conteúdo em versões repetidas demais. | Média |
| `article-writing` | Estrutura artigos e tutoriais longos com voz definida. | Sim. | Usar como referência para guias e notas longas do Viny Brain. | Regras de escrita engessadas. | Texto robótico ou inchado. | Média |
| `knowledge-ops` | Transforma conhecimento em contexto durável e consultável. | Sim. | Criar rotina de extração do aprendizado para o vault. | Sistema de ingestão automático pesado. | Perder aprendizados importantes da sessão. | Alta |
| `harness-audit` | Faz scorecard determinístico da saúde do harness. | Parcialmente. | Adaptar a ideia para auditar o próprio Viny Flow. | Dependência de métricas específicas do ECC. | Aplicar um score irrelevante ao contexto local. | Média |
| `update-docs` | Sincroniza documentação a partir da fonte de verdade. | Sim. | Usar o princípio de docs derivados do estado real da base. | Geração automática irrestrita. | Documentação que diverge do vault. | Média |

## Observação de compatibilidade

O inventário acima favorece conceitos que podem virar documentação operacional, checklists ou rotinas leves no Viny Brain.

O que não entra bem é tudo que depende de:

- hooks automáticos como centro do sistema;
- MCP como dependência estrutural;
- instalação global;
- distribuição multi-harness;
- runtime extra para tudo.
