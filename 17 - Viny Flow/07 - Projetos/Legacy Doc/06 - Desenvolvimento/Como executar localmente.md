# Como executar localmente

Data: 2026-07-29

## Caminho

`17 - Viny Flow/07 - Projetos/Legacy Doc/06 - Desenvolvimento/landing-page`

## Requisitos

- Node.js 20.9 ou superior.
- npm.

Validado nesta execucao com:

- Node.js `v22.22.2`
- npm `10.9.7`

## Desenvolvimento

```bash
cd "/home/vinicius-alves/Viny Brain/17 - Viny Flow/07 - Projetos/Legacy Doc/06 - Desenvolvimento/landing-page"
npm install
npm run dev
```

Abrir:

`http://localhost:3000/documentacao-codigo-legado`

## Producao local

```bash
npm run build
npm run start -- -p 3001
```

Abrir:

`http://localhost:3001/documentacao-codigo-legado`

## Validacoes executadas

```bash
npm run lint
npm run typecheck
npm run build
```

Tambem foi executada validacao local com Chrome/Puppeteer para:

- H1 unico.
- Links internos.
- Console sem erros.
- Axe WCAG 2 A/AA.
- Overflow desktop.
- Overflow mobile em viewport `390px`.
