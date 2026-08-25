# Auditoria SEO

Data: 2026-07-29

## Resultado geral

Status: bloqueador.

A base técnica de SEO existe, mas a landing não deve ser publicada indexável ainda. O domínio é placeholder, a canonical usa `https://seudominio.com`, o meta robots está `noindex, nofollow`, não há sitemap e o canal de conversão ainda não existe.

## Itens auditados

| Item | Status | Resultado |
|---|---|---|
| H1 único | aprovado | Existe 1 H1: `Documentação técnica gerada a partir do seu código`. |
| Title | aprovado | `Legacy Doc | Documentação de código legado com IA`. |
| Meta description | aprovado | Explica IA, repositórios legados e documentação técnica estruturada. |
| Slug | aprovado | `/documentacao-codigo-legado`. |
| Canonical | bloqueador | Renderiza `https://seudominio.com/documentacao-codigo-legado`. |
| Robots | bloqueador | `noindex, nofollow` está correto para fase privada, mas impede publicação indexável. |
| Open Graph | pendente | Implementado com título, descrição e imagem, mas URL usa domínio placeholder e imagem é SVG. |
| Twitter Card | pendente | Implementado, mas usa domínio/imagem ainda não finais. |
| Schema `SoftwareApplication` | pendente | Implementado sem preço, rating ou review; URL usa domínio placeholder. |
| Schema `FAQPage` | aprovado | Perguntas públicas estão alinhadas à copy e sem claims indevidos. |
| Sitemap | pendente | Não existe `sitemap.xml`; depende de domínio real e aprovação de indexação. |
| Robots.txt | pendente | Não existe arquivo `robots.txt`; decisão depende da política de publicação. |
| Links internos | aprovado | Anchors internos válidos na auditoria automatizada. |
| Links externos | pendente | Não há links externos públicos definidos. |
| Alt texts | aprovado | Logo possui `alt="Logo Legacy Doc"`. |
| Idioma | aprovado | `html lang="pt-BR"`. |
| Conteúdo duplicado | pendente | `/` e `/documentacao-codigo-legado` renderizam o mesmo conteúdo; canonical final precisa resolver a rota preferencial. |

## Recomendações antes de publicar

- Definir domínio real e atualizar `site.pendingDomain`.
- Gerar `robots.txt` e `sitemap.xml` após a decisão de publicação.
- Trocar `robots` para `index, follow` somente quando a página estiver aprovada para publicação.
- Usar imagem Open Graph em PNG ou JPG `1200x630`, baseada no visual real da landing.
- Manter apenas um H1.
- Confirmar rota canônica: recomendada `/documentacao-codigo-legado`.

## Fontes consultadas

Acesso em: 2026-07-29.

- Google SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google SoftwareApplication structured data: `https://developers.google.com/search/docs/appearance/structured-data/software-app`
- Schema.org SoftwareApplication: `https://schema.org/SoftwareApplication`

## Decisão

Status: não aprovado para SEO público.

SEO técnico está preparado para revisão local, mas bloqueado para deploy indexável.
