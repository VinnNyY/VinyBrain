# Domínio com Erro 403

## Metadados

- **Data:** 2026-05-03
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Procedimento para triagem e correção de erro 403, com foco em `.htaccess`, integridade do core do WordPress e revisão de plugins.

## Diagnóstico rápido

- Se o 403 aparecer junto com mudança visual de acesso, verifique se não é bloqueio da Cloudflare disfarçado.
- Se o site é WordPress, confira `.htaccess`, permissões e plugins antes de mexer em DNS.
- Se o erro surgiu após troca de domínio, SSL ou proxy, trate a origem como possível conflito de rota.
- Se o comportamento muda entre `www` e domínio raiz, valide apontamento e cache.

## Quando Usar

- Quando o cliente reportar acesso bloqueado por `403 Forbidden`.
- Quando houver suspeita de regra corrompida, permissão incorreta ou conflito de segurança no WordPress.

## Pré-requisitos

- Acesso ao WHMCS da conta.
- Acesso ao cPanel.
- Confirmação de que o site está em WordPress.

## Causas comuns

- `.htaccess` corrompido.
- Permissões incorretas.
- Plugin de segurança ou cache bloqueando.
- Conflito entre domínio raiz e `www`.
- Cloudflare ou proxy interferindo na rota.

## Passo a Passo Interno

1. Abrir o gerenciador de arquivos no cPanel e localizar o `.htaccess`.
2. Renomear o arquivo atual para backup e recriar o `.htaccess` padrão do WordPress.
3. Se o erro persistir, verificar a integridade do WordPress e reinstalar o core.
4. Se ainda houver bloqueio, desativar plugins por renomeação da pasta `wp-content/plugins`.
5. Testar primeiro com o Elementor ativo e reativar os demais plugins um a um.

## Passo a passo seguro

1. Confirmar se o 403 é da aplicação, do proxy ou do arquivo de configuração.
2. Fazer backup antes de alterar `.htaccess` ou plugins.
3. Testar a mudança em uma etapa por vez.
4. Validar se o erro desapareceu em `www` e no domínio raiz.
5. Só encerrar quando a causa mais provável estiver isolada.

## Orientação Possível para Cliente

- Informar que o erro costuma estar ligado a regra de acesso, arquivo de configuração ou plugin de segurança.
- Pedir um novo teste após a limpeza do `.htaccess` ou após a revisão dos plugins.

## O que NÃO fazer

- Não tratar o procedimento como solução universal para todo `403`.
- Não alterar sem backup.
- Não culpar DNS antes de conferir a aplicação.
- Não desativar plugins sem critério.

## Quando escalar

- Quando o erro persistir depois da revisão de `.htaccess` e plugins.
- Quando houver dúvida se a origem é Cloudflare, permissão ou aplicação.
- Quando o site tiver múltiplos pontos de falha ao mesmo tempo.

## Pontos de Atenção

- Não tratar o procedimento como solução universal para todo `403`.
- Plugins de segurança podem ser a origem do bloqueio.
- Evitar indicar remoção definitiva sem validar a causa.

## Erros Comuns

- Alterar arquivos sem backup.
- Confundir erro de permissão com falha de DNS.
- Ignorar a etapa de testes após cada ajuste.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/11Z61uGsumbwy4oACK3ch_AILeCMdc87BgcJtVueEaK4/edit?tab=t.0
- **Link complementar:** 

## Materiais Complementares

- Reset do core do WordPress.
- Verificação de plugins e permissões no WordPress.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- A fonte detalha a correção em três frentes: `.htaccess`, core do WordPress e plugins.
- A documentação local não deve substituir testes no ambiente do cliente.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Conferência de Certificado SSL]]
- [[Domínio com Erro 503]]
- [[Resolução de Erro de NameServer (NS) no Registro.br]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
