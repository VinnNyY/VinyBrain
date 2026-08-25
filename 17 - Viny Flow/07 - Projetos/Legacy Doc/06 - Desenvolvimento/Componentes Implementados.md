# Componentes Implementados

Data: 2026-07-29

## Estruturais

- `Header`: navegacao sticky, logo real extraido do PDF, links ancora, CTA e menu mobile acessivel.
- `LandingPage`: composicao completa da landing no slug `/documentacao-codigo-legado`.
- `Footer`: fechamento tecnico com pendencias publicas explicitadas.

## UI

- `Container`: largura maxima e padding responsivo.
- `Section`: estrutura padronizada de secoes com eyebrow, H2 e descricao.
- `ButtonLink`: variantes primaria, secundaria e ghost.
- `Badge`: status textual com variacoes de tom.
- `IconShell`: wrapper padrao para icones lucide.

## Produto e prova visual

- `ProductMockup`: mockup HTML/CSS com arvore de arquivos, analise, funcoes, grafo simplificado e relatorio.
- `ProductTabs`: tabs interativas para `Analise`, `Modulos` e `Documentacao`.
- `ReportSection`: documento tecnico demonstrativo com indice, secoes e evidencia em codigo.

## Conteudo

- `TransformationSection`: antes/depois.
- `ProblemSection`: quatro dores principais.
- `WorkflowSection`: quatro etapas do fluxo.
- `InterfaceSection`: demonstracao do produto.
- `BenefitsSection`: beneficios qualitativos.
- `UseCasesSection`: cenarios de aplicacao.
- `DifferentiatorsSection`: diferenciais tecnicos sem claims de superioridade.
- `ResearchSection`: origem como pesquisa aplicada.
- `RoadmapSection`: proposta confirmada, em validacao e planejado.
- `TeamSection`: nomes da equipe com papeis publicos pendentes.
- `FAQAccordion`: perguntas frequentes acessiveis.
- `FinalCTA`: chamada final sem captura real de dados.

## Dados centralizados

- `src/lib/landing-content.ts`: copy, listas, nav, equipe, FAQ e icones.
- `src/lib/schema.ts`: JSON-LD de `SoftwareApplication` e `FAQPage`.
