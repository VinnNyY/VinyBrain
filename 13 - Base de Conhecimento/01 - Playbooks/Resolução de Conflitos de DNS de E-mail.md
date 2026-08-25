# Resolução de Conflitos de DNS de E-mail

## Metadados

- **Data:** 16/03
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Conteúdo ainda não foi extraído localmente. Pendente de revisão no documento original.

## Diagnóstico rápido

- Se o e-mail não chega, confirme primeiro se o problema é envio, recebimento ou acesso ao Webmail.
- Se o domínio usa DNS externo, confira MX e apontamentos antes de culpar o cPanel.
- Se o cliente usa Outlook ou Gmail, valide se o problema não está na configuração do cliente.
- Se o e-mail vai para spam ou não aparece, considere filtros, caixa cheia, SPF, DKIM e DMARC.

## Quando Usar

- Quando houver conflito de DNS que afete e-mail, MX, SPF, DKIM, DMARC ou entrega.
- Quando o problema puder estar em Cloudflare, provedor externo, filtros ou caixa cheia.

## Causas comuns

- MX apontando para destino errado.
- DNS de e-mail conflitando com Cloudflare ou registro antigo.
- SPF, DKIM ou DMARC ausentes ou incorretos.
- Filtros de e-mail movendo mensagens.
- Caixa cheia ou limite atingido.

## Pré-requisitos

- Validar o documento original no Google Docs antes de usar como procedimento final.
- Confirmar o domínio e a origem do problema.
- Saber se o cliente usa Webmail, Outlook, Gmail ou outro cliente.

## Passo a Passo Interno

1. Confirmar o tipo de falha: envio, recebimento ou acesso.
2. Checar se o problema acontece no Webmail antes de mexer no cliente local.
3. Validar MX, SPF, DKIM, DMARC e DNS do domínio.
4. Verificar filtros, caixa cheia e limites.
5. Se houver migração ou serviço externo, validar a origem e o destino.

## Passo a passo seguro

1. Confirmar se o problema é DNS, cliente de e-mail ou entrega.
2. Não mexer em registros sem saber qual serviço responde.
3. Testar no Webmail antes de alterar Outlook ou Gmail.
4. Revisar um registro por vez.
5. Registrar o que foi validado antes de encerrar.

## Resposta / Orientação Possível para Cliente

- Pendente de revisão. Não usar como texto final para cliente até validar a fonte.

## O que NÃO fazer

- Não culpar o cliente antes de validar o DNS.
- Não orientar troca de cliente de e-mail sem necessidade.
- Não dizer que o problema é entrega se o Webmail nem recebe.
- Não prometer que a StayCloud garante entrega em provedor externo mal configurado.

## Quando escalar

- Quando MX, SPF, DKIM, DMARC e filtros estiverem corretos e o e-mail ainda falhar.
- Quando houver blacklist, limite ou bloqueio de servidor.
- Quando a análise exigir validação técnica de entrega ou migração.

## Pontos de Atenção

- Não tratar este arquivo como versão final do procedimento.
- Revisar o Google Docs original antes de aplicar em atendimento.

## Erros Comuns

- Usar o resumo como se fosse o conteúdo completo.
- Ignorar o status de revisão pendente.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1eNTzCOoqpDMShXl0meRpFRYJmbjPoXT81YvoTSXcjvk/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

-

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da importação:** conteúdo não extraído neste turno
- **Pode ser usado como referência final?:** não, até revisar o original

## Observações de Validação

- Importação controlada registrada a partir da planilha índice.
- Conteúdo pendente de revisão manual no Google Docs original.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Como Renovar o Domínio]]
- [[Otimização de Cache na Cloudflare]]
- [[Procedimento de Acesso a Contas de E-mail via cPanel]]
- [[Migração de E-mails]]
- [[Gestão de Limite de Envios de E-mail (cPanel)]]
