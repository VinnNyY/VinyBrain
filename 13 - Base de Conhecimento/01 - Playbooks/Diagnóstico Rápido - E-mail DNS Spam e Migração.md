# Diagnóstico Rápido - E-mail DNS Spam e Migração

## Objetivo

Servir como mapa operacional para escolher o playbook certo quando o problema envolver e-mail, DNS, spam, filtros, entrega, Webmail ou migração.

## Quando usar

- Quando o e-mail não chega.
- Quando a mensagem cai em spam.
- Quando o e-mail não aparece no Webmail.
- Quando há dúvida entre DNS, cliente de e-mail, filtro, caixa cheia ou migração.
- Quando Outlook, Gmail ou Webmail apresentam comportamentos diferentes.

## Sintomas comuns

- E-mail enviado, mas não recebido.
- E-mail indo para spam.
- E-mail não aparece no Webmail.
- Falha no Outlook ou Gmail.
- MX apontando estranho.
- SPF, DKIM ou DMARC ausentes.
- Migração falhando.

## Matriz de diagnóstico

| Sintoma | Provável causa | Primeiro teste | Playbook relacionado |
|---|---|---|---|
| E-mail não chega | DNS/MX, SPF, DKIM, DMARC ou bloqueio | testar no Webmail e revisar DNS | [[Resolução de Conflitos de DNS de E-mail]] |
| Cai em spam | reputação, SPF/DKIM/DMARC ou filtro | testar envio básico e revisar autenticação | [[Resolução de Conflitos de DNS de E-mail]] |
| Não aparece no Webmail | caixa cheia, filtro ou entrega inexistente | conferir a caixa e os filtros | [[Procedimento de Acesso a Contas de E-mail via cPanel]] |
| Outlook/Gmail falhando | configuração IMAP/SMTP incorreta | validar com Webmail antes do cliente local | [[Procedimento de Acesso a Contas de E-mail via cPanel]] |
| Migração falhando | origem inacessível ou credencial inválida | confirmar origem e destino | [[Migração de E-mails]] |

## Fluxo rápido

1. Confirmar se o problema é envio, recebimento ou acesso.
2. Testar Webmail antes de Outlook/Gmail.
3. Conferir DNS/MX/SPF/DKIM/DMARC.
4. Conferir filtros, spam e caixa cheia.
5. Conferir configuração IMAP/SMTP.
6. Conferir se existe migração envolvida.
7. Decidir se é orientação, ajuste interno ou escalonamento.

## O que NÃO fazer

- Não culpar o cliente antes de validar DNS e Webmail.
- Não mexer em Outlook/Gmail sem saber se o Webmail funciona.
- Não prometer entrega se o domínio externo estiver mal configurado.
- Não tratar migração de Outlook local como obrigação automática da StayCloud.
- Não encerrar sem confirmar a camada afetada.

## Quando escalar

- Quando DNS, filtros e caixa estiverem corretos e a falha persistir.
- Quando houver bloqueio, blacklist, limite ou falha de servidor.
- Quando o problema depender de validação técnica mais profunda.

## Links relacionados

- [[Resolução de Conflitos de DNS de E-mail]]
- [[Procedimento de Acesso a Contas de E-mail via cPanel]]
- [[Migração de E-mails]]
- [[Gestão de Limite de Envios de E-mail (cPanel)]]
- [[Limitação das Caixas de E-mails]]

## Próxima revisão

Precisa validar com casos reais de não entrega, spam, Webmail vazio e migração IMAP.
