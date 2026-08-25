# Auditoria Visual da V1

Data: 2026-07-29

## Status

Status: reprovado visualmente para landing premium.

A V1 está tecnicamente funcional, mas a composição não comunica um produto SaaS premium com força suficiente. A página se comporta mais como documentação institucional do produto: muitas seções, muitos cards similares, pouca mudança de ritmo e demonstrações pequenas.

## Evidências

- Baseline desktop: `09 - Auditorias/Evidencias V2/v1-desktop-baseline-2026-07-29.png`
- Baseline mobile: `09 - Auditorias/Evidencias V2/v1-mobile-baseline-2026-07-29.png`
- Auditoria anterior: `09 - Auditorias/Relatório Final de QA.md`

## Diagnóstico

| Área | Status | Achado |
|---|---|---|
| Narrativa | bloqueador | A página conta tudo como blocos informativos, não como demonstração de produto. |
| Ritmo visual | bloqueador | Hero, problema, workflow, benefícios, cenários, diferenciais, roadmap e equipe repetem o padrão título + texto + cards. |
| Prova visual | bloqueador | O mockup existe, mas é pequeno e raso; não demonstra claramente URL do repositório, análise, funções, parâmetros, retornos e relatório. |
| Relatório | bloqueador | A seção do relatório ainda parece um painel pequeno, não o principal entregável do produto. |
| Planos | bloqueador | A V1 não possui seção de planos, embora o material oficial agora tenha sido autorizado para a V2. |
| Largura útil | pendente | O container existe, mas a composição prende texto e conteúdo em blocos pouco expressivos. |
| Tipografia | pendente | Código e labels técnicos usam escala pequena demais para prova visual. |
| Mobile | pendente | Mobile vira uma coluna longa e repetitiva, sem cortes narrativos fortes. |
| Confiança | pendente | Textos públicos de pendência diminuem percepção de maturidade. Pendências devem ficar em docs internos ou microcopy discreta. |
| Claims | aprovado | A V1 evita clientes, métricas, depoimentos, preços e promessas não confirmadas. |
| Acessibilidade base | aprovado | H1 único, foco visível, reduced motion e axe sem violações após correções anteriores. |

## Causa raiz

O problema não é falta de gradiente, ícone ou aumento pontual de fonte. O problema é o modelo composicional. A V1 transforma cada argumento em card e deixa a interface real em segundo plano.

## Decisão para V2

- Redesenhar a landing como uma sequência de momentos visuais.
- Reduzir repetição de cards.
- Usar demo de produto como primeira prova.
- Usar o relatório em seção clara de alto impacto.
- Incluir planos oficiais autorizados sem inventar recursos.
- Manter claims conservadores e revisão humana explícita.
- Preservar acessibilidade, build estático e performance.

## Recomendações prioritárias

1. Criar hero com demo grande e legível.
2. Transformar “como funciona” em pipeline visual.
3. Trocar grids repetidos por layouts variados.
4. Criar demonstração navegável com screenshots reais extraídos do PDF.
5. Criar seção de relatório em fundo claro.
6. Criar planos com trilha horizontal no desktop e scroll-snap no mobile.
7. Remover exposição pública excessiva de pendências.
