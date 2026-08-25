# Arquitetura Frontend

Data: 2026-07-29

## Stack escolhida

- Next.js 16.2.12.
- React 19.2.4.
- TypeScript.
- Tailwind CSS 4.
- lucide-react como biblioteca unica de icones.
- App Router.

Motivo: nao havia codigo anterior do Legacy Doc a preservar. A stack segue o caminho oficial atual do Next.js para um app novo com TypeScript, Tailwind, ESLint, App Router e alias `@/*`.

## Estrutura

```text
landing-page/
├── public/
│   ├── assets/pdf-extracted/legacy-doc-001.png
│   └── og/legacy-doc.svg
├── src/
│   ├── app/
│   │   ├── documentacao-codigo-legado/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── faq-accordion.tsx
│   │   ├── header.tsx
│   │   ├── product-mockup.tsx
│   │   ├── product-tabs.tsx
│   │   └── ui.tsx
│   └── lib/
│       ├── landing-content.ts
│       └── schema.ts
```

## Renderizacao

- Conteudo principal renderizado como Server Components.
- Client Components usados apenas onde ha interacao:
  - menu mobile;
  - tabs do preview de produto;
  - FAQ accordion.

## SEO tecnico

- Metadata API no `layout.tsx`.
- Title e description aprovados.
- Open Graph e Twitter Card configurados.
- JSON-LD renderizado server-side no page component.
- `SoftwareApplication` sem preco, rating, review, offers ou compatibilidades nao confirmadas.
- `FAQPage` alinhado com perguntas visiveis.
- `noindex, nofollow` aplicado ate dominio, CTA e politica de privacidade serem confirmados.

## Performance

- Rota prerenderizada como estatica no build.
- Sem biblioteca pesada de motion.
- Motion via CSS usando `transform` e `opacity`.
- `prefers-reduced-motion` implementado.
- Fonte otimizada via `next/font`.
- Logo carregado com `next/image`.
- Sem tracking, analytics, formulario externo ou scripts de terceiros.

## Acessibilidade

- HTML semantico com `header`, `nav`, `main`, `section` e `footer`.
- Skip link.
- H1 unico.
- Foco visivel.
- Menu mobile com `aria-expanded` e `aria-controls`.
- FAQ com `button`, `aria-expanded` e `aria-controls`.
- Tabs com roles ARIA basicos.
- Blocos de codigo com `<pre><code>`.
- Status com texto e cor.
