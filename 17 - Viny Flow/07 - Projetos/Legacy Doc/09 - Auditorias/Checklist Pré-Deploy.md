# Checklist Pré-Deploy

Data: 2026-07-29

## Decisão

Status geral: bloqueador.

Não publicar e não fazer deploy até os itens bloqueadores serem resolvidos.

## Checklist

| Item | Status | Observação |
|---|---|---|
| Build de produção passa | aprovado | `npm run build` passou. |
| Lint passa | aprovado | `npm run lint` passou. |
| Typecheck passa | aprovado | `npm run typecheck` passou. |
| Testes automatizados | pendente | Não existe script `test`. |
| Desktop validado | aprovado | Sem overflow, console limpo, axe 0. |
| Notebook validado | aprovado | Sem overflow, console limpo, axe 0. |
| Tablet validado | aprovado | Sem overflow, console limpo, axe 0. |
| Mobile validado | corrigido | Região rolável sem foco foi corrigida; revalidação axe 0. |
| Links internos | aprovado | Anchors válidos. |
| CTA real | bloqueador | Canal de captura não definido. |
| Formulário | aprovado | Não existe formulário nem coleta indevida. |
| Política de privacidade | bloqueador | Pendente antes de qualquer captura de leads. |
| Domínio real | bloqueador | `https://seudominio.com` ainda está no código. |
| Canonical final | bloqueador | Depende do domínio real. |
| Robots para publicação | bloqueador | `noindex, nofollow` está ativo. |
| Sitemap | pendente | Criar após domínio real. |
| Robots.txt | pendente | Criar após decisão de indexação. |
| Open Graph final | pendente | Trocar SVG por imagem PNG/JPG final. |
| Dados estruturados | pendente | Atualizar URL após domínio real. |
| Claims proibidos | aprovado | Não encontrados no conteúdo público. |
| Preços | aprovado | Não publicados. |
| Depoimentos | aprovado | Não publicados. |
| Clientes | aprovado | Não publicados. |
| Métricas | aprovado | Não publicadas. |
| Segurança/compliance | aprovado | Não prometidos como recursos confirmados. |
| Assets reais | bloqueador | Screenshots reais e exemplo real de relatório ainda faltam como arquivos separados. |
| Logo oficial web | pendente | Logo extraído do PDF funciona, mas export oficial otimizado precisa ser confirmado. |
| Dependências | bloqueador | `npm audit --omit=dev` reporta 3 vulnerabilidades altas; `npm audit` completo reporta 12 altas. |
| Segredos | aprovado | Scanner não encontrou tokens ou credenciais. |
| Browser cross-compat | pendente | Falta Safari, Firefox e Edge reais. |
| Lighthouse | pendente | CLI indisponível no ambiente. |
| Deploy | bloqueador | Não autorizado pelo usuário. |

## Ações obrigatórias antes de deploy

1. Definir domínio real.
2. Definir CTA real e política de privacidade.
3. Confirmar assets finais.
4. Resolver ou aceitar formalmente vulnerabilidades de dependências.
5. Reavaliar robots e criar sitemap/robots.txt.
6. Rodar Lighthouse e testes em navegadores adicionais.
7. Executar nova auditoria final.
