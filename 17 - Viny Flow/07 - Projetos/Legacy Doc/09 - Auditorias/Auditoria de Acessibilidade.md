# Auditoria de Acessibilidade

Data: 2026-07-29

## Resultado geral

Status: corrigido.

A landing passou na auditoria automatizada axe WCAG 2 A/AA em desktop, notebook, tablet e mobile após correções de teclado em tabs e regiões roláveis.

## Itens auditados

| Item | Status | Resultado |
|---|---|---|
| HTML semântico | aprovado | Uso de `header`, `main`, `section`, `article`, `nav`, `footer`, `button` e links reais. |
| Skip link | aprovado | Link `Ir para o conteúdo` aponta para `#conteudo`. |
| Hierarquia de headings | aprovado | H1 único e seções com headings claros. |
| Navegação por teclado | corrigido | Tabs agora suportam ArrowLeft, ArrowRight, Home e End. |
| Regiões roláveis | corrigido | Blocos `pre.code-scroll` receberam `tabIndex={0}`. |
| Foco visível | aprovado | Há foco visível por `:focus-visible`. |
| Contraste | aprovado | Axe não reportou violações de contraste. |
| Botões e links | aprovado | Links navegam; botões de FAQ/tabs são `button`. |
| Labels e nomes acessíveis | aprovado | Não há formulário; botões e imagens possuem nomes acessíveis. |
| Alt text | aprovado | Logo possui alt descritivo. |
| Ícones decorativos | aprovado | Ícones usam `aria-hidden` quando decorativos. |
| FAQ | aprovado | Usa `aria-expanded` e `aria-controls`. |
| Menu mobile | aprovado | Botão tem `aria-label`, `aria-expanded` e fecha ao navegar. |
| Reduced motion | aprovado | `prefers-reduced-motion` reduz animações. |
| Áreas de toque | aprovado | Botões principais têm altura mínima adequada. |

## Evidência automatizada

| Viewport | Axe | Overflow | Console |
|---|---|---|---|
| Desktop `1440x1800` | 0 violações | aprovado | aprovado |
| Notebook `1280x900` | 0 violações | aprovado | aprovado |
| Tablet `820x1180` | 0 violações | aprovado | aprovado |
| Mobile `390x1400` | 0 violações | aprovado | aprovado |

## Pendências

- Teste manual com leitor de tela ainda não executado.
- Teste real em Safari, Firefox e Edge ainda não executado.
- Caso um formulário de lista seja adicionado, será necessária nova auditoria de labels, erros, autocomplete, foco e privacidade.

## Decisão

Status: aprovado para revisão local.

Acessibilidade não bloqueia revisão local. Nova auditoria será necessária antes do deploy final quando CTA, domínio e assets finais forem adicionados.
