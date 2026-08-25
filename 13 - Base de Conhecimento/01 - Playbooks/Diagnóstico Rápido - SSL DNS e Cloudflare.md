# Diagnóstico Rápido - SSL DNS e Cloudflare

## Objetivo

Servir como mapa operacional para escolher o playbook certo quando o problema estiver entre SSL, DNS, Cloudflare, 403 ou 503.

## Quando usar

- Quando o cliente fala em SSL que não gera.
- Quando o acesso muda entre `www`, raiz, proxy ou teste direto.
- Quando há dúvida entre DNS, SSL, Cloudflare e aplicação.
- Quando o problema parece de um tema, mas pode vir de outro.

## Sintomas comuns

- SSL não emite.
- Cadeado não aparece.
- Challenge ou captcha da Cloudflare.
- `403 Forbidden`.
- `503 Service Unavailable`.
- Comportamento diferente entre `www` e domínio raiz.
- Site abre em um teste e falha em outro.

## Matriz de diagnóstico

| Sintoma | Provável causa | Primeiro teste | Playbook relacionado |
|---|---|---|---|
| SSL não gera | DNS antigo, conflito com `www` ou proxy Cloudflare | Conferir apontamento e registros ativos | [[Conferência de Certificado SSL]] |
| Challenge / captcha | Cloudflare filtrando acesso | Testar aba anônima e comparar com proxy ligado | [[Resolução de Verificação de Acesso via Cloudflare]] |
| `403 Forbidden` | `.htaccess`, permissão, plugin ou Cloudflare | Conferir aplicação e cache antes de mexer em DNS | [[Domínio com Erro 403]] |
| `503 Service Unavailable` | aplicação, recursos, cache ou sobrecarga | Verificar consumo e comportamento da aplicação | [[Domínio com Erro 503]] |
| DNS inconsistente | apontamento antigo, `www` ou host conflitante | Conferir zona DNS e propagações | [[Guia Interno Staycloud - Apontamentos DNS]] |

## Fluxo rápido

1. Conferir DNS.
2. Conferir proxy Cloudflare.
3. Conferir SSL.
4. Conferir aplicação.
5. Conferir logs ou erro real.

## O que NÃO fazer

- Não assumir que todo bloqueio é SSL.
- Não mexer em proxy sem confirmar a causa.
- Não tratar DNS como solução universal.
- Não misturar problema de aplicação com problema de apontamento.
- Não encerrar sem registrar qual camada foi mais provável.

## Quando escalar

- Quando não ficar claro se a falha é de DNS, Cloudflare, SSL ou aplicação.
- Quando houver risco de derrubar acesso ao alterar apontamento.
- Quando a causa exigir revisão mais profunda de infraestrutura.

## Links relacionados

- [[Conferência de Certificado SSL]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Domínio com Erro 403]]
- [[Domínio com Erro 503]]

## Próxima revisão

Precisa validar com casos reais de SSL que não gera, challenge de Cloudflare e erro 503.
