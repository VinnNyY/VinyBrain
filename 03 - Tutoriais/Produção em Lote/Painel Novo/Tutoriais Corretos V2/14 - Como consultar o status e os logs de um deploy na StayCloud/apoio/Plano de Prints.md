# Plano de Prints

Data: 2026-07-30

Tutorial em validação: `Como consultar o status e os logs de um deploy na StayCloud`

## Premissa

O plano abaixo depende da validação do painel real. Se o produto não exibir logs oficiais, o título e os prints serão adaptados para status, histórico ou resultado pelo terminal.

## PRINT 01 — Aplicação correta

Objetivo: mostrar onde localizar e abrir o projeto ou aplicação de teste.

Alvo único: card, nome ou botão usado para abrir `tutorial-deploy-cli-teste` ou outro projeto descartável validado.

Cuidados: censurar outros projetos, dados de conta, e-mail, domínios reais e IDs.

## PRINT 02 — Status do deploy

Objetivo: mostrar onde aparece o estado atual da publicação.

Alvo único: status real exibido pelo painel.

Estados permitidos: somente os estados observados durante a validação real.

## PRINT 03 — Histórico ou execução

Objetivo: mostrar onde abrir uma execução, publicação, build ou registro específico.

Alvo único: registro, card ou linha da execução selecionada.

Criar somente se a área existir.

## PRINT 04 — Logs

Objetivo: mostrar onde consultar os logs.

Alvo único: botão, aba ou área `Logs`.

Criar somente se o produto possuir logs oficiais.

## PRINT 05 — Conteúdo dos logs

Objetivo: mostrar quais informações ajudam a identificar sucesso ou falha.

Alvo único: linha ou seção segura que confirme o resultado.

Cuidados: revisar o conteúdo inteiro antes de usar; censurar token, URL administrativa, ID, caminho sensível, variável, e-mail e dado de conta.

## PRINT 06 — Aplicação disponível

Objetivo: mostrar como abrir a aplicação depois da conclusão.

Alvo único: URL pública ou botão real de acesso.

Criar somente quando fizer parte do fluxo real.

## Quality Gate Visual

- Um alvo principal por print.
- O alvo deve corresponder ao texto do passo.
- A marcação não pode cobrir status, mensagem, botão, aba, linha do log ou URL.
- Para logs, usar caixa fina e recorte legível.
- Somente prints sanitizados em `prints-finais/` podem entrar no preview e no WordPress.
