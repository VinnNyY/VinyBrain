# Fluxo Desejado da Automacao

## Fluxo ideal da fase atual

1. Carregar um JSON local com tickets ficticios ou exportados manualmente.
2. Identificar se o ticket parece ser sobre ativacao de plugin WordPress.
3. Extrair sinais basicos:
   - ticket;
   - status;
   - cliente;
   - e-mail;
   - dominio;
   - plugin citado;
   - indicios de autorizacao;
   - indicios de conclusao.
4. Classificar em alta confianca, precisa revisar ou ignorar.
5. Gerar resumo local e relatorio Markdown.
6. Enviar casos elegiveis para fila de aprovacao humana.
7. Manter execucao real fora do escopo desta etapa.

## Comportamento esperado por etapa

- Se o ticket estiver fechado ou resolvido, ele deve ser ignorado.
- Se houver sinal de conclusao, ele deve ser ignorado.
- Se houver plugin conhecido e contexto WordPress, o caso pode subir em alta confianca.
- Se o assunto for generico, incompleto ou ambíguo, o caso deve ir para revisao.
- Se o tema for SSL, DNS, e-mail, financeiro ou outro suporte, o ticket deve ser ignorado.

## Saidas do fluxo

- relatorio de validacao;
- payload local estruturado;
- fila de aprovacao humana;
- resposta sugerida para o ticket;
- registro de intervencao humana quando necessario.
