# Relatório Final de QA

Data: 2026-07-29

## Resultado geral

Status: bloqueador.

A landing page do Legacy Doc foi auditada em produção local, sem deploy e sem publicação. A implementação está funcional, responsiva e sem violações automatizadas de acessibilidade após correções técnicas. A página ainda não está pronta para publicação porque depende de domínio real, política de indexação, canal real de CTA, política de privacidade e resolução/aceite técnico das vulnerabilidades de dependências.

## Escopo auditado

| Item | Status | Resultado |
|---|---|---|
| Desktop | aprovado | Chrome headless `1440x1800`, sem overflow horizontal e sem erro de console. |
| Notebook | aprovado | Chrome headless `1280x900`, sem overflow horizontal e sem erro de console. |
| Tablet | aprovado | Chrome headless `820x1180`, sem overflow horizontal e sem erro de console. |
| Mobile | corrigido | Chrome headless `390x1400`, sem overflow horizontal; alerta axe de região rolável foi corrigido com foco por teclado. |
| Navegação | aprovado | Anchors internos válidos e skip link presente. |
| Links | pendente | Links são internos; não existe canal externo real para lista de interesse. |
| CTAs | bloqueador | CTA principal leva para `#lista`, mas não há formulário, endpoint, e-mail aprovado ou ferramenta de waitlist. |
| Formulários | aprovado | Não há formulário, logo não há coleta indevida de dados. |
| Imagens | pendente | Logo real extraído do PDF renderiza, mas screenshots reais e relatório real ainda não foram fornecidos como assets separados. |
| Logo | pendente | Logo renderiza com `next/image`; export oficial otimizado para web ainda precisa ser confirmado. |
| Conteúdo | aprovado | Copy mantém produto real em desenvolvimento e não posiciona como trabalho acadêmico. |
| Ortografia | corrigido | Textos públicos foram ajustados para PT-BR com acentuação. |
| Claims | aprovado | Não foram encontrados clientes, preços, depoimentos, métricas, superioridade ou claims fortes no HTML público. |
| Funcionalidades apresentadas | aprovado | Funcionalidades aparecem como proposta, desenvolvimento, validação ou planejamento, sem prometer escopo não confirmado. |
| SEO | bloqueador | Canonical, Open Graph e JSON-LD usam `https://seudominio.com`; robots está `noindex, nofollow`. |
| Open Graph | pendente | Implementado, mas com domínio placeholder e imagem SVG. Recomendado gerar PNG/JPG final. |
| Schema | pendente | `SoftwareApplication` e `FAQPage` existem, mas URL usa domínio placeholder. |
| Sitemap | pendente | Não há `sitemap.xml`; depende do domínio real. |
| Robots | bloqueador | Meta robots está intencionalmente `noindex, nofollow`; correto para não publicar, bloqueador para deploy indexável. |
| Canonical | bloqueador | Canonical aponta para `https://seudominio.com/documentacao-codigo-legado`. |
| Acessibilidade | corrigido | Axe WCAG 2 A/AA sem violações após correção dos blocos roláveis. |
| Contraste | aprovado | Contraste de botões e textos passou na validação axe. |
| Teclado | corrigido | Tabs ganharam navegação por setas, Home e End; blocos roláveis receberam foco por teclado. |
| Reduced motion | aprovado | `prefers-reduced-motion` reduz animações e remove scan line. |
| Performance | pendente | Build estático aprovado, mas Lighthouse/Web Vitals não foram medidos porque Lighthouse CLI não está instalado. |
| LCP | pendente | Sem medição Lighthouse; risco baixo por página estática e sem scripts de terceiros. |
| CLS | aprovado | Imagens têm dimensões e validação visual não indicou layout shift. |
| INP | pendente | Sem medição real de campo; risco baixo por interações simples. |
| Console | corrigido | Erros 500 eram do servidor local antigo; após restart, console ficou limpo. |
| Build | aprovado | `npm run build` passou. |
| Dependências | bloqueador | `npm audit --omit=dev` encontrou 3 vulnerabilidades altas em produção; `npm audit` completo encontrou 12 altas incluindo devDependencies. |
| Dados sensíveis | aprovado | Scanner local não encontrou tokens, chaves, variáveis ou segredos expostos no código auditado. |
| Informações pessoais | pendente | Nomes da equipe aparecem conforme material inicial; papéis públicos seguem pendentes. |
| Compatibilidade entre navegadores | pendente | Validado em Chrome local; falta teste real em Safari/Firefox/Edge. |

## Correções executadas

| Correção | Status | Arquivos |
|---|---|---|
| Remoção de duplicidade de `lucide-react` no `package.json` | corrigido | `06 - Desenvolvimento/landing-page/package.json`, `package-lock.json` |
| Navegação por teclado nas tabs do produto | corrigido | `src/components/product-tabs.tsx` |
| Foco por teclado em regiões roláveis de código | corrigido | `src/app/documentacao-codigo-legado/page.tsx`, `src/components/product-tabs.tsx` |
| Acentuação e ortografia PT-BR na copy pública | corrigido | `src/lib/landing-content.ts`, `src/app/layout.tsx`, `src/lib/schema.ts`, componentes da página |
| Restart do servidor local para remover artefatos antigos | corrigido | Ambiente local apenas |

## Evidências

- `09 - Auditorias/Evidencias Landing/auditoria-browser-2026-07-29.json`
- `09 - Auditorias/Evidencias Landing/auditoria-desktop-2026-07-29.png`
- `09 - Auditorias/Evidencias Landing/auditoria-notebook-2026-07-29.png`
- `09 - Auditorias/Evidencias Landing/auditoria-tablet-2026-07-29.png`
- `09 - Auditorias/Evidencias Landing/auditoria-mobile-2026-07-29.png`

## Comandos executados

| Comando | Status |
|---|---|
| `npm run lint` | aprovado |
| `npm run typecheck` | aprovado |
| `npm run build` | aprovado |
| `npm run test` | pendente: script inexistente |
| `npm audit --omit=dev --json` | bloqueador |
| `npm audit --json` | bloqueador |
| Auditoria Puppeteer + axe em 4 viewports | aprovado após correção |
| Scanner de segredos com `rg` | aprovado |
| Scanner de claims proibidos com `rg` | aprovado para conteúdo público |

## Bloqueadores para deploy

- Substituir `https://seudominio.com` pelo domínio real.
- Definir política de indexação e trocar `noindex, nofollow` somente quando a publicação for aprovada.
- Criar canal real para o CTA de lista de interesse.
- Criar política de privacidade antes de qualquer captura de lead.
- Resolver ou aceitar formalmente o risco das vulnerabilidades altas reportadas por `npm audit --omit=dev`.
- Confirmar assets reais finais: screenshots, exemplo de relatório e logo otimizado.

## Decisão final

Status: não pronta para publicação.

A página está aprovada para revisão local e demonstração controlada. Não está aprovada para deploy público.
