# Plano de Prints

Tutorial: Como alterar a cota de armazenamento de uma conta de e-mail no Painel Novo da StayCloud

Status: em produção — aguardando captura real.

## Regras visuais obrigatórias

- Cada print deve ter somente um alvo principal.
- Validar sempre: texto do passo -> alvo marcado -> resultado exibido no passo seguinte.
- Não destacar `Ver detalhes`, fatura, aviso de vencimento, banner, outro serviço, exclusão ou ação não usada.
- A marcação não pode cobrir o texto do botão, campo, título ou informação necessária.
- Censurar e-mails, domínio, nome, conta, IDs, dados do serviço, outras caixas postais, valores privados do plano, credenciais e notificações.
- Guardar originais em `apoio/originais-e-versoes-antigas/`.
- Usar no preview somente as versões sanitizadas de `prints-finais/`.

## PRINT 01 — Serviço correto

- Texto do passo: localize o serviço e clique em `Gerenciar`.
- Alvo único: botão `Gerenciar` do serviço correto.
- Resultado esperado: tela do serviço aberta.

## PRINT 02 — Área de contas de e-mail

- Texto do passo: abra a área de gerenciamento das contas de e-mail.
- Alvo único: aba ou opção `E-mails`, conforme o nome real exibido.
- Resultado esperado: lista de caixas de e-mail exibida.

## PRINT 03 — Conta de teste e opção de edição

- Texto do passo: localize a conta de teste e abra a ação usada para editar a cota.
- Alvo único: botão, ícone ou menu real usado para editar a conta.
- Resultado esperado: formulário/modal de edição da conta aberto.

## PRINT 04 — Cota de armazenamento

- Texto do passo: defina o novo limite de armazenamento.
- Alvo único: campo de cota, armazenamento ou limite individual da conta.
- Resultado esperado: campo de cota visível e senha/credenciais ausentes.

## PRINT 05 — Salvamento

Usar somente se o botão de salvamento ou a mensagem de sucesso ficar distante do campo de cota.

- Texto do passo: salve e confira a alteração.
- Alvo único: botão `Salvar`, `Atualizar`, ou mensagem real de sucesso.
- Resultado esperado: cota alterada e conta de teste preservada.
