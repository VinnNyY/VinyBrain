# Auditoria de Performance

Data: 2026-07-29

## Resultado geral

Status: pendente com bloqueador de dependências.

A página compila como conteúdo estático, não usa scripts de terceiros, usa `next/font`, `next/image` e motion leve. Lighthouse não foi executado porque o CLI não está instalado no ambiente. `npm audit --omit=dev` encontrou vulnerabilidades altas em dependências de produção transitivas do Next, classificadas como bloqueador para deploy.

## Itens auditados

| Item | Status | Resultado |
|---|---|---|
| Build de produção | aprovado | `npm run build` passou e gerou rotas estáticas. |
| Renderização local | aprovado | `next start -p 3001` respondeu `200`. |
| Scripts de terceiros | aprovado | Nenhum analytics, pixel ou script externo foi encontrado. |
| Imagens | aprovado | Logo renderiza via `next/image` com dimensões. |
| Logo otimizado | pendente | O logo vem de PNG extraído do PDF; falta export oficial otimizado para web. |
| Fontes | aprovado | Usa `next/font/google` com Geist e Geist Mono. |
| LCP | pendente | Não medido por Lighthouse. |
| CLS | aprovado | Sem overflow e imagens com dimensões; risco baixo. |
| INP | pendente | Não medido em campo; risco baixo por interações simples. |
| Lazy loading | aprovado | Não há imagens pesadas abaixo da dobra além do logo reutilizado. |
| Motion | aprovado | Animações usam `transform`/`opacity` e respeitam reduced motion. |
| Console | corrigido | Servidor local antigo gerava 500; restart limpo removeu erros. |
| Dependências de produção | bloqueador | 3 vulnerabilidades altas via `next`, `postcss` e `sharp`. |
| Dependências totais, incluindo desenvolvimento | bloqueador | 12 vulnerabilidades altas, incluindo cadeia de ESLint/minimatch. |
| Dependências extraneous locais | pendente | `npm ls --depth=0` ainda lista pacotes opcionais nativos como extraneous no `node_modules` local. |

## Auditoria de dependências

Resultado de `npm audit --omit=dev --json`:

- `next`: high, via `postcss` e `sharp`
- `postcss`: high, advisory GHSA-6g55-p6wh-862q e GHSA-r28c-9q8g-f849
- `sharp`: high, advisory GHSA-f88m-g3jw-g9cj

O `npm audit fix --dry-run --omit=dev` sugeriu `next@9.3.3` como correção, o que seria um downgrade major incompatível com a stack atual. A correção automática não foi aplicada.

Resultado de `npm audit --json`:

- 12 vulnerabilidades altas no total.
- Além dos itens de produção, há vulnerabilidades em dependências de desenvolvimento ligadas a `eslint`, `eslint-config-next`, `minimatch` e `brace-expansion`.
- As correções sugeridas também envolvem mudanças major ou versões incompatíveis com a stack atual.

## Pendências

- Executar Lighthouse em ambiente com CLI disponível.
- Medir Core Web Vitals em preview real antes de publicar.
- Confirmar estratégia de imagem OG em PNG/JPG.
- Resolver dependências vulneráveis via atualização segura quando disponível, override validado ou aceite formal de risco.
- Recriar instalação limpa em ambiente novo com `npm ci` para confirmar ausência de resíduos locais em `node_modules`.

## Decisão

Status: não aprovado para deploy.

Performance estrutural está adequada para revisão local, mas dependências vulneráveis e ausência de medição Lighthouse bloqueiam publicação.
