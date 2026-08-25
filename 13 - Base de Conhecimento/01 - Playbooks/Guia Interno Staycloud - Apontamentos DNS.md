# Guia Interno Staycloud - Apontamentos DNS

## Metadados

- **Data:** 18/03
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Consolidar o diagnóstico de apontamentos DNS, propagação e conflitos de registro em um guia interno de referência.

## Diagnóstico rápido

- Se o domínio falha em abrir, confirme primeiro o apontamento ativo.
- Se o SSL não emite, valide se o DNS não está conflitando com `www`, proxy ou registro antigo.
- Se o e-mail falha, verifique os registros MX e conflitos de DNS de e-mail.
- Se o acesso parece inconsistente, trate cache, propagação e Cloudflare como hipóteses separadas.

## Quando Usar

- Quando houver dúvida sobre apontamento, propagação, `www`, subdomínio ou nameserver.
- Quando a operação precisar decidir se o problema é DNS, SSL, Cloudflare ou aplicação.

## Causas comuns

- Registro antigo ainda propagado.
- Host configurado em lugar errado.
- `www` e subdomínio apontando para destinos diferentes.
- Cloudflare mascarando origem.
- MX, A, CNAME ou NS incoerentes.

## Pré-requisitos

- Validar o documento original no Google Docs antes de usar como procedimento final.
- Confirmar o domínio, o host e o contexto do atendimento.

## Passo a Passo Interno

1. Confirmar o domínio e o registro que deveria responder.
2. Verificar A, CNAME, MX e NS relevantes.
3. Comparar host principal, `www` e subdomínios.
4. Conferir se Cloudflare ou proxy está interferindo.
5. Registrar o estado e decidir se o problema é DNS, SSL, e-mail ou aplicação.

## Passo a passo seguro

1. Validar a origem do apontamento antes de alterar.
2. Não trocar registros sem saber qual host é crítico.
3. Testar o efeito de cada ajuste antes de seguir.
4. Confirmar propagação em ferramenta adequada antes de encerrar.

## Resposta / Orientação Possível para Cliente

- Explicar que o domínio está sendo verificado para confirmar se o apontamento está correto.
- Evitar detalhar registros internos sem necessidade.

## Pontos de Atenção

- Não tratar este arquivo como versão final do procedimento.
- Revisar o Google Docs original antes de aplicar em atendimento.
- Não confundir DNS com SSL, aplicação ou proxy.
- Não usar este guia para orientar mudanças sem validação.

## Erros Comuns

- Usar o resumo como se fosse o conteúdo completo.
- Ignorar o status de revisão pendente.
- Alterar o host errado.
- Tratar `www` e domínio raiz como se sempre fossem equivalentes.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1FQaTt4ejtCaSvW4Lem9IKIlDK_UQFkyq1zU49c8f2-Y/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:**

## Materiais Complementares

-

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da importação:** conteúdo não extraído neste turno
- **Pode ser usado como referência final?:** precisa validar

## Observações de Validação

- Importação controlada registrada a partir da planilha índice.
- Conteúdo pendente de revisão manual no Google Docs original.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Como Renovar o Domínio]]
- [[Resolução de Conflitos de DNS de E-mail]]
- [[Otimização de Cache na Cloudflare]]
- [[Conferência de Certificado SSL]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Domínio com Erro 403]]
- [[Domínio com Erro 503]]
