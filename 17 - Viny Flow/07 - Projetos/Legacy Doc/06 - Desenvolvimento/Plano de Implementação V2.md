# Plano de Implementação V2

Data: 2026-07-29

## Estratégia de preservação

Não existe repositório Git local no app. Para preservar a V1, criar uma cópia segura dos arquivos principais antes de editar:

- `src/app/documentacao-codigo-legado/page.tsx`
- `src/app/globals.css`
- `src/lib/landing-content.ts`
- componentes impactados

A cópia deve ficar em `06 - Desenvolvimento/landing-page/_backup-v1-2026-07-29/`.

## Escopo de implementação

- Reestruturar `landing-content.ts` com dados V2.
- Reescrever a página principal com seções V2.
- Reaproveitar `Header`, `FAQAccordion`, `ProductTabs` quando fizer sentido.
- Criar ou expandir componentes visuais para demo, screenshots e planos.
- Atualizar CSS global com tokens e classes específicas da V2.
- Usar assets oficiais exportados do PDF.

## Componentes previstos

- `HeroDemo`
- `TransformationPanel`
- `Pipeline`
- `ProductShowcaseTabs`
- `ReportShowcase`
- `PlansSection`
- `BenefitsUseCases`
- `ResearchRoadmap`
- `TeamSection`
- `FAQAccordion`

## Validação

Executar:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- auditoria Puppeteer em `1440`, `1280`, `1024`, `768`, `430`, `390`, `360`
- axe WCAG 2 A/AA
- console e requests
- screenshots desktop e mobile
- scan de claims e segredos

## Critérios de aceite da V2

- Landing visualmente menos repetitiva.
- Hero com demonstração forte.
- Relatório com alto destaque.
- Planos oficiais implementados sem extrapolação.
- Mobile com scroll-snap manual nos planos.
- Sem deploy.
- Sem alteração remota.
- Sem mistura com StayCloud.
