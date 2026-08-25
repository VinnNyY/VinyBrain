# Resolução de Verificação de Acesso via Cloudflare

## Metadados

- **Data:** 2026-05-29
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Diagnosticar a tela de verificação da Cloudflare, testar bypass do proxy e orientar o alinhamento de segurança com o cliente.

## Diagnóstico rápido

- Se o acesso abre challenge ou captcha, pense primeiro em Cloudflare e não em bloqueio do servidor.
- Se o site não responde quando o proxy está ativo, compare com teste direto no DNS de origem.
- Se houver `www`, DNS antigo ou regra conflitante, o bloqueio pode estar mascarando um problema de apontamento.
- Se a verificação some ao testar em aba anônima, avalie cache, cookies e política de segurança.

## Quando Usar

- Quando o site exibir challenge, captcha ou bloqueio da Cloudflare.
- Quando o cliente mencionar blacklist, mas a evidência for uma verificação do proxy.

## Pré-requisitos

- Acesso ao painel da Cloudflare.
- Print da tela de erro.
- Navegador em aba anônima.

## Causas comuns

- Nível de segurança agressivo na Cloudflare.
- Proxy laranja ativo para um host que deveria ser validado sem challenge.
- Registros DNS conflitantes ou antigos.
- Regras de firewall, bot protection ou captcha em excesso.
- Cache e cookies interferindo no teste do navegador.

## Passo a Passo Interno

1. Coletar a tela de erro e o print da zona DNS.
2. Conferir se o host afetado possui proxy, `www` ou apontamento antigo.
3. Desativar temporariamente o proxy na nuvem laranja do registro A, se fizer sentido.
4. Testar o acesso em aba anônima.
5. Se o acesso normalizar, revisar o nível de segurança e o perfil do site.

## Passo a passo seguro

1. Confirmar se o erro é challenge de Cloudflare ou erro da aplicação.
2. Validar DNS e o host realmente afetado.
3. Testar sem proxy e em aba anônima.
4. Revisar regra de segurança somente após reproduzir o sintoma.
5. Registrar se o problema era Cloudflare, DNS ou aplicação.

## Orientação Possível para Cliente

- Explicar que a Cloudflare está filtrando o acesso.
- Informar o impacto de manter o proxy desativado.

## O que NÃO fazer

- Não culpar blacklist sem verificar a tela.
- Não desligar proxy sem entender o impacto.
- Não tratar o teste de navegação como validação suficiente.
- Não confundir segurança da Cloudflare com indisponibilidade do site.

## Quando escalar

- Quando a verificação persistir mesmo com o teste limpo.
- Quando houver conflito entre proxy, DNS e aplicação e a origem não ficar clara.
- Quando a mudança de segurança tiver risco operacional alto.

## Pontos de Atenção

- Desativar o proxy remove proteção e CDN.
- Landing pages com tráfego pago podem sofrer mais sem proxy.

## Erros Comuns

- Tratar blacklist como problema de e-mail sem checar a tela.
- Testar apenas na mesma aba do navegador.
- Encerrar o atendimento sem explicar o impacto da mudança.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1__nRA3Xyoxvl5YmsuUpfuzCDHpArYwJrZUQozpxwIRo/edit?tab=t.0#heading=h.urvp5mequko2
- **Link complementar:** https://ajuda.staycloud.com.br/docs/como-limpar-o-cache-do-navegador/

## Materiais Complementares

- `Otimização de Cache na Cloudflare`.
- `Tela do Imunify360 Carregando antes de Abrir o Site ou Liberação de Domínio no WebShield`.
- `Como verificar propagação de DNS e apontamentos` via DNS Checker.

## Status do Conteúdo

- **Status na planilha:** Pendente
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O documento traz scripts de resposta prontos e reforça o teste em aba anônima.
- A orientação de segurança precisa ser preservada na revisão final.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Otimização de Cache na Cloudflare]]
- [[Tela do Imunify360 Carregando antes de Abrir o Site ou Liberação de Domínio no WebShield]]
- [[Apontamento Local via Arquivo hosts no Linux]]
- [[Conferência de Certificado SSL]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Domínio com Erro 403]]
