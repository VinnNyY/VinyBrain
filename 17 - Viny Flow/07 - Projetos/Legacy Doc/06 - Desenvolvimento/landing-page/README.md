# Legacy Doc Landing Page

Landing page do Legacy Doc implementada como produto real de tecnologia em desenvolvimento.

## Stack

- Next.js 16.2.12
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- lucide-react
- App Router

## Rotas

- `/documentacao-codigo-legado`: rota principal aprovada para SEO.
- `/`: renderiza a mesma experiência como entrada local.

## Como executar

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000/documentacao-codigo-legado
```

Para validar em modo produção local:

```bash
npm run build
npm run start -- -p 3001
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
```

Não há script de testes automatizados neste scaffold.

## Regras de conteúdo

- Não publicar preços.
- Não publicar depoimentos, clientes, métricas ou comparações.
- Não afirmar compatibilidade, segurança, compliance ou suporte técnico sem validação.
- Manter o produto como tecnologia em desenvolvimento.
- Manter origem acadêmica apenas em seção secundária de pesquisa e desenvolvimento.
- Manter revisão humana explícita para a documentação gerada.

## SEO

A landing usa Metadata API do Next.js, Open Graph, Twitter Card e JSON-LD com:

- `SoftwareApplication`
- `FAQPage`

Como domínio, política de privacidade e CTA real ainda estão pendentes, a página está configurada com `noindex, nofollow`.

## Assets

- Logo real extraído do PDF disponível: `public/assets/pdf-extracted/legacy-doc-001.png`.
- Imagem OG estática criada em SVG: `public/og/legacy-doc.svg`.

Screenshots reais do produto e exemplo real de relatório ainda precisam ser fornecidos.
