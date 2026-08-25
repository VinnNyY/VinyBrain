# Migração de E-mails

## Metadados

- **Data:** 27/05
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Vini
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Conteúdo ainda não foi extraído localmente. Pendente de revisão no documento original.

## Diagnóstico rápido

- Use este playbook quando a migração for entre caixas IMAP com credenciais válidas.
- Se a origem for Outlook local, a migração pode não ser responsabilidade da StayCloud.
- Se houver erro de entrega, confirme antes se o problema é migração ou DNS/SMTP.
- Se o destino for externo e mal configurado, a falha pode não estar na migração.

## Quando Usar

- Quando for migrar caixas de e-mail entre origens e destinos compatíveis.
- Quando as credenciais e o acesso permitirem migração por IMAP.

## Causas comuns

- Credenciais inválidas.
- Origem inacessível.
- Limite ou caixa cheia.
- Conflito de DNS ou MX durante o processo.
- Diferença entre origem local e origem em servidor.

## Pré-requisitos

- Validar o documento original no Google Docs antes de usar como procedimento final.
- Confirmar origem, destino e acesso às caixas.
- Saber se existe migração por IMAP ou apenas orientação ao cliente.

## Passo a Passo Interno

1. Confirmar origem e destino da migração.
2. Validar credenciais e acesso às caixas.
3. Escolher método compatível com a origem.
4. Conferir DNS, MX e entregabilidade antes e depois.
5. Registrar o que foi migrado e o que ficou pendente.

## Passo a passo seguro

1. Confirmar que a migração é realmente responsabilidade da StayCloud.
2. Não prometer migração de Outlook local para hospedagem como se fosse automática.
3. Testar a origem antes de iniciar.
4. Verificar se a entrega mudou após o processo.
5. Encerrar só com confirmação mínima de funcionamento.

## Resposta / Orientação Possível para Cliente

- Pendente de revisão. Não usar como texto final para cliente até validar a fonte.

## O que NÃO fazer

- Não tratar qualquer importação como migração completa.
- Não assumir que IMAP cobre toda origem.
- Não prometer resultado se a origem ou o destino estiverem fora do nosso controle.

## Quando escalar

- Quando a origem não suportar migração por IMAP.
- Quando houver bloqueio, limitação ou falha de acesso.
- Quando a entrega continuar falhando depois do processo.

## Pontos de Atenção

- Não tratar este arquivo como versão final do procedimento.
- Revisar o Google Docs original antes de aplicar em atendimento.

## Erros Comuns

- Usar o resumo como se fosse o conteúdo completo.
- Ignorar o status de revisão pendente.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1WV3ZTn9FRIexopgUwNqZ6orgGvn3R6y-f5WggpRILpo/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

-

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da importação:** conteúdo não extraído neste turno
- **Pode ser usado como referência final?:** não, até revisar o original

## Observações de Validação

- Importação controlada registrada a partir da planilha índice.
- Conteúdo pendente de validação manual no Google Docs original.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Procedimento de Acesso a Contas de E-mail via cPanel]]
- [[Resolução de Conflitos de DNS de E-mail]]
- [[Rastreamento de E-mails via CLI (Exim Mainlog)]]
- [[Gestão de Limite de Envios de E-mail (cPanel)]]
- [[Limitação das Caixas de E-mails]]
