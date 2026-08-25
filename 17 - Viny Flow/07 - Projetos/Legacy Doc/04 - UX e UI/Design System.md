# Design System

Data: 2026-07-29

## Principios

- Dark-first.
- Tecnico, preciso e confiavel.
- Componentes densos, mas legiveis.
- Bordas e contraste antes de sombras pesadas.
- Azul oficial para acao, foco e progresso.
- Sem cards aninhados.
- Sem decoracao generica.

## Tokens de cor

```css
:root {
  --color-bg: #0b0f19;
  --color-surface: #111827;
  --color-surface-muted: #0f172a;
  --color-surface-raised: #151f32;
  --color-code: #090d15;
  --color-border: #263244;
  --color-border-soft: rgba(148, 163, 184, 0.16);
  --color-border-strong: rgba(148, 163, 184, 0.28);
  --color-text: #ffffff;
  --color-text-secondary: #94a3b8;
  --color-primary: #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-primary-active: #2563eb;
  --color-primary-soft: rgba(59, 130, 246, 0.12);
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #38bdf8;
}

[data-theme="light"] {
  --color-bg: #ffffff;
  --color-surface: #f1f5f9;
  --color-border: #d1d5db;
  --color-text: #000000;
  --color-text-secondary: #475569;
  --color-primary: #2563eb;
  --color-primary-hover: #3b82f6;
  --color-primary-active: #1d4ed8;
}
```

## Tipografia

Recomendacao:

- UI: `Inter`, `Geist`, `IBM Plex Sans` ou system sans.
- Codigo: `JetBrains Mono`, `IBM Plex Mono`, `Geist Mono` ou `SFMono-Regular`.

Escala:

```css
--font-xs: 12px;
--font-sm: 14px;
--font-md: 16px;
--font-lg: 18px;
--font-xl: 24px;
--font-2xl: 32px;
--font-3xl: 44px;
--font-4xl: 56px;
```

Uso:

- Hero H1: `48px` a `56px`, weight `650-750`, line-height `1.02`.
- H2: `32px` a `40px`, weight `650`, line-height `1.1`.
- H3/card title: `18px` a `22px`, weight `600`.
- Body: `16px`, line-height `1.65`.
- Metadata tecnica: `12px` a `13px`, line-height `1.4`.
- Codigo: `13px` a `14px`, line-height `1.6`.

Nao usar fonte escalada por viewport sem limites. Nao usar letter-spacing negativo.

## Grid e containers

Breakpoints:

```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

Containers:

```css
--container-sm: 720px;
--container-md: 960px;
--container-lg: 1120px;
--container-xl: 1280px;
```

Grid:

- Desktop grande: 12 colunas, gutter `24px`.
- Notebook: 12 colunas, gutter `24px`, conteudo mais compacto.
- Tablet: 8 colunas, gutter `20px`.
- Mobile: 4 colunas, gutter `16px`.

Secoes:

- Desktop: padding vertical `80px` a `120px`.
- Tablet: `56px` a `72px`.
- Mobile: `40px` a `56px`.

## Espacamento

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

## Raios

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

Uso:

- Botoes: `8px`.
- Inputs: `8px`.
- Cards: `8px`.
- Painel grande/navegador simulado: `12px`.
- Badges pequenos: `999px`.

## Bordas e sombras

Bordas:

- Default: `1px solid var(--color-border)`.
- Internas: `1px solid var(--color-border-soft)`.
- Ativas: `1px solid var(--color-border-strong)`.

Sombras:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-md: 0 12px 32px rgba(0, 0, 0, 0.28);
--shadow-lg: 0 24px 64px rgba(0, 0, 0, 0.36);
--shadow-primary: 0 0 0 1px rgba(59, 130, 246, 0.28), 0 16px 40px rgba(59, 130, 246, 0.12);
```

Regra: elevar por contraste de superficie + borda. Usar sombra grande somente em mockups principais.

## Superficies

- Page: `--color-bg`.
- Section band: `--color-bg` ou `--color-surface-muted`.
- Card/panel: `--color-surface`.
- Raised panel: `--color-surface-raised`.
- Code/browser: `--color-code`.

Overlay permitido:

```css
background:
  linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)),
  var(--color-surface);
```

## Botoes

Primario:

- Background: `--color-primary`.
- Text: `#ffffff`.
- Hover: `--color-primary-hover`.
- Active: `--color-primary-active`.
- Height: `40px`; hero `48px`.
- Padding: `0 16px`; hero `0 20px`.
- Radius: `8px`.

Secundario:

- Background: `rgba(255, 255, 255, 0.04)`.
- Border: `--color-border`.
- Text: `--color-text`.
- Hover: `--color-surface-raised`.

Ghost:

- Background transparente.
- Hover: `rgba(148, 163, 184, 0.10)`.

Disabled:

- Opacidade `0.45`.
- Sem sombra.
- Cursor `not-allowed`.

## Links

- Default: `#93c5fd`.
- Hover: `#bfdbfe`.
- Underline em hover ou em texto editorial longo.
- Links externos com icone discreto e label acessivel.

## Inputs

```css
--input-bg: #0f172a;
--input-border: #263244;
--input-placeholder: #64748b;
```

Estados:

- Default: fundo escuro, borda sutil.
- Hover: borda `rgba(148, 163, 184, 0.36)`.
- Focus: `0 0 0 3px rgba(59, 130, 246, 0.28)`.
- Error: borda `#ef4444`, mensagem `#fca5a5`.
- Disabled: opacidade `0.5`.

Alturas:

- Compacto: `36px`.
- Default: `40px`.
- Grande: `48px`.

## Badges

Default:

- Background: `rgba(59, 130, 246, 0.12)`.
- Border: `rgba(59, 130, 246, 0.28)`.
- Text: `#bfdbfe`.
- Height: `24px` a `28px`.
- Radius: `999px`.

Variações:

- Success: verde suave.
- Warning: amber suave.
- Neutral: slate suave.
- Danger: vermelho suave.

## Cards

Estilo base:

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
}
```

Hover:

- Surface para `--color-surface-raised`.
- Borda levemente mais clara.
- `transform: translateY(-2px)`.

Regra: card precisa carregar informacao ou acao. Evitar card decorativo.

## Navegador simulado

Uso: preview de produto.

- Fundo: `#090d15`.
- Barra superior: `36px` a `44px`.
- Tres dots pequenos a esquerda.
- URL/pill central com path tecnico: `/legacy-doc/report`.
- Border: `#263244`.
- Radius: `12px`.
- Conteudo interno em grid.
- Tabs opcionais: `Overview`, `Code Map`, `Risks`, `Report`.

## Blocos de codigo

```css
.code-block {
  background: #090d15;
  border: 1px solid #263244;
  border-radius: 8px;
  padding: 16px;
  color: #e5e7eb;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
```

Syntax:

- Keyword: `#93c5fd`
- String: `#86efac`
- Number: `#fbbf24`
- Comment: `#64748b`
- Diff remove: `#fca5a5`
- Diff add: `#86efac`

## Componentes de relatorio

- `ReportSummary`
- `RiskMatrix`
- `DependencyMap`
- `CodeEvidence`
- `MigrationChecklist`
- `FindingItem`
- `SeverityBadge`
- `ExportPanel`
- `TimelineStep`

Severidade:

- Critical: `#ef4444`
- High: `#f97316`
- Medium: `#f59e0b`
- Low: `#22c55e`
- Info: `#38bdf8`

Layout: findings em lista densa, nao cards gigantes.

## Loading, erro e vazio

Loading:

- Skeleton `rgba(148, 163, 184, 0.10)`.
- Shimmer sutil.
- Progress steps para analise longa:
  - `Scanning repository`
  - `Mapping dependencies`
  - `Generating report`
  - `Preparing review`

Erro:

- Fundo `rgba(239, 68, 68, 0.10)`.
- Borda `rgba(239, 68, 68, 0.32)`.
- Texto `#fecaca`.
- Mensagem curta + acao clara.

Vazio:

- Icone simples.
- Titulo objetivo.
- Uma acao principal.

## Navegacao

Navbar:

- Desktop: `72px`.
- Mobile: `64px`.
- Fundo: `rgba(11, 15, 25, 0.78)`.
- Blur leve permitido, sem excesso.
- Borda inferior `rgba(148, 163, 184, 0.12)`.
- Sticky recomendado.

Mobile:

- Menu compacto.
- Botao com `aria-expanded`.
- CTA principal dentro do menu.

## Footer

- Fundo igual ao body ou levemente elevado.
- Borda superior sutil.
- Colunas: Produto, Recursos, Legal, Status.
- Texto `14px`.
- Links em `#94a3b8`, hover `#ffffff`.

## Foco, hover e disabled

Focus:

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.32);
}
```

Hover:

- Botoes: cor/borda mais clara.
- Cards: borda + surface elevada.
- Links: cor mais clara.
- Inputs: borda mais clara.

Disabled:

```css
[disabled],
[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
```

## Motion tokens

```css
--motion-duration-instant: 80ms;
--motion-duration-fast: 140ms;
--motion-duration-base: 220ms;
--motion-duration-slow: 420ms;
--motion-duration-process: 900ms;
--motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
--motion-ease-enter: cubic-bezier(0, 0, 0.2, 1);
--motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);
--motion-ease-technical: cubic-bezier(0.16, 1, 0.3, 1);
--motion-distance-xs: 4px;
--motion-distance-sm: 8px;
--motion-distance-md: 16px;
--motion-distance-lg: 24px;
--motion-scale-subtle: 1.015;
--motion-scale-active: 0.985;
```
