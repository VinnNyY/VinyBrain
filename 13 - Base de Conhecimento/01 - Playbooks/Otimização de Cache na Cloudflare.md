# Otimização de Cache na Cloudflare

## Objetivo
Padronizar a configuração de cache na Cloudflare para melhorar a performance dos sites.

## Quando usar
- Ajuste de performance em sites que usam Cloudflare.
- Padronização de cache para páginas e arquivos estáticos.
- Validação de comportamento de cache antes de orientar o cliente.

## Passo a passo interno
- Definir `SSL/TLS` como `Completo`.
- Ativar os protocolos HTTP nas configurações de velocidade.
- Ajustar o TTL padrão do navegador para 8 horas.
- Manter `Always Online` ativado.
- Criar as page rules na ordem correta.
- `wp-admin*`: ignorar cache.
- `wp-content/*`: armazenar tudo em cache, com TTL de edge de 20 horas e TTL do navegador de 12 horas.
- `/*`: armazenar tudo em cache, com TTL de edge de 12 horas.
- Validar em aba anônima e conferir `cf-cache-status` como `HIT`.

## Orientação que pode ser enviada ao cliente
- Informar que a configuração de cache foi ajustada para melhorar a performance.
- Se necessário, orientar a limpar o cache do navegador e testar novamente o site.
- Evitar explicar regras internas de forma detalhada ao cliente.

## Cuidados
- A ordem das page rules é obrigatória.
- `wp-admin` não pode ser cacheado.
- Os domínios de exemplo servem apenas para ilustrar as regras.
- Confirmar a validação final pelo cabeçalho `cf-cache-status`.

## Links originais
- https://docs.google.com/document/d/1dLpXmveCA-96kXILRAhIduafanFOYwm2YST94oLzhh4/edit?tab=t.0

## Fonte
- `Conteudos - Base de conhecimento.xlsx` > aba `documentos`
- Título na planilha: `Otimização de Cache na Cloudflare`

## Status
- Postado

## Autor
- Vini

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Checklist Inicial - StayCloud]]
