# Conferência de Certificado SSL

## Metadados

- **Data:** 2026-03-30
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Validar emissão de SSL, forçar `HTTPS` e orientar sobre propagação quando o certificado ainda não aparece ativo.

## Diagnóstico rápido

- Se o SSL não gera, primeiro confirme se o DNS do domínio aponta para a origem correta.
- Se houver `www`, proxy ou registro antigo, trate isso como possível conflito de emissão.
- Se o erro parecer bloqueio ou challenge, valide se o problema não é de Cloudflare além de SSL.
- Se o certificado já foi emitido, mas o navegador ainda alerta, considere propagação, cache ou redirecionamento.

## Quando Usar

- Quando o domínio estiver sem SSL ou com cadeado vermelho.
- Quando o site precisar de `HTTPS` para funcionar corretamente.
- Quando erros visuais ou de editor indicarem problema de segurança.

## Pré-requisitos

- Acesso ao cPanel.
- DNS Checker para confirmar apontamento.

## Causas comuns

- DNS ainda apontando para registro antigo.
- Conflito entre subdomínio e `www`.
- Proxy Cloudflare ativo com comportamento diferente do esperado.
- AutoSSL ainda sem validação completa do domínio.
- Cache local ou do navegador mascarando a validação.

## Passo a Passo Interno

1. Verificar o status do SSL/TLS no cPanel.
2. Conferir o apontamento DNS e validar se não há conflito com `www` ou registro antigo.
3. Se necessário, rodar a emissão manual via Wizard / AutoSSL.
4. Revisar se Cloudflare está interferindo na validação.
5. Ativar o redirecionamento forçado para HTTPS somente depois de confirmar a emissão.
6. Orientar o cliente sobre tempo de propagação e teste em aba anônima.

## Passo a passo seguro

1. Confirmar o domínio exato afetado.
2. Checar DNS e apontamentos ativos.
3. Validar se há proxy Cloudflare ou cache interferindo.
4. Emitir SSL novamente.
5. Testar em aba anônima e em rede diferente.
6. Só então orientar a ativação final do HTTPS.

## Orientação Possível para Cliente

- Informar que o SSL foi emitido e pode ainda estar propagando.
- Pedir novo teste em aba anônima ou por rede móvel.

## O que NÃO fazer

- Não forçar HTTPS antes da emissão.
- Não insistir apenas no certificado se o DNS estiver errado.
- Não tratar qualquer alerta visual como falha exclusiva de SSL.
- Não remover registros sem confirmar qual entrada está conflitando.

## Quando escalar

- Quando o DNS está correto, o SSL não emite e a causa não fica clara.
- Quando houver dúvida se o bloqueio vem de Cloudflare, da aplicação ou do provedor de certificado.
- Quando a conta apresentar comportamento inconsistente entre subdomínios.

## Pontos de Atenção

- O SSL depende de DNS apontado corretamente.
- Não forçar HTTPS antes da propagação em casos críticos.

## Erros Comuns

- Ignorar o erro de DNS e insistir só no certificado.
- Não ativar o redirecionamento.
- Testar sem limpar cache.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/15Uw9FQkyMGBuOsWnxo_zQ8vrRS-1HaY4DNtcZ6SgR6I/edit?tab=t.0
- **Link complementar:** 

## Materiais Complementares

- `DNS Checker`.
- `Checklist Inicial - StayCloud`.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- A fonte cita AutoSSL / Let’s Encrypt e redirecionamento via cPanel.
- A orientação ao cliente sobre propagação foi mantida.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Configuração de Novo Domínio]]
- [[Otimização de Cache na Cloudflare]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Domínio com Erro 403]]
- [[Domínio com Erro 503]]
