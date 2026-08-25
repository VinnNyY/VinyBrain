# Plano de Prints

- Tutorial: Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud
- Data: 2026-07-28
- Status: capturado e sanitizado
- Fluxo validado: Painel Novo -> Hospedagem -> Gerenciar -> E-mails -> Resetar senha

## Regras aplicadas

- Usar somente conta descartável `tutorial-teste-*`.
- Não capturar senha legível.
- Não destacar exclusão, fatura, cobrança, DNS, plano, cPanel ou conta real.
- Cada print deve ter um alvo principal.
- Originais preservados em `apoio/originais-e-versoes-antigas/`.
- Sanitizados salvos em `prints-finais/`.

## PRINT 01 - Serviço correto

- Arquivo: `prints-finais/passo-01-gerenciar-servico.png`
- Objetivo: mostrar o serviço que deve ser gerenciado.
- Alvo principal: botão `Gerenciar` do serviço correto.
- Não marcou: `Ver detalhes`, fatura, banner, aviso financeiro, outro serviço.
- Status: aprovado localmente.

## PRINT 02 - Área de e-mails

- Arquivo: `prints-finais/passo-02-contas-email.png`
- Objetivo: mostrar onde acessar o gerenciamento das contas de e-mail.
- Alvo principal: aba `E-mails`.
- Dados censurados: domínio, IP e dados do serviço.
- Status: aprovado localmente.

## PRINT 03 - Conta de teste e ação de senha

- Arquivo: `prints-finais/passo-03-acao-alterar-senha.png`
- Objetivo: mostrar a conta descartável e a opção correta para alterar senha.
- Alvo principal: ação real `Resetar senha`.
- Dados censurados: endereço completo da conta, domínio e demais dados sensíveis.
- Não marcou: ação de exclusão.
- Status: aprovado localmente.

## PRINT 04 - Campo de nova senha

- Arquivo: `prints-finais/passo-04-nova-senha.png`
- Objetivo: mostrar onde definir a nova senha.
- Alvo principal: campo `Nova senha` no modal `Resetar senha`.
- Botão real da tela: `Atualizar senha`.
- Senha: não aparece legível.
- Status: aprovado localmente.

## Validação visual

| Passo | Texto | Alvo marcado | Resultado seguinte | Status |
|---|---|---|---|---|
| 1 | Clicar em `Gerenciar` | Botão `Gerenciar` | Abre tela do serviço | Validado |
| 2 | Abrir `E-mails` | Aba `E-mails` | Mostra caixas de e-mail | Validado |
| 3 | Usar `Resetar senha` | Ação `Resetar senha` | Abre modal de senha | Validado |
| 4 | Definir nova senha | Campo `Nova senha` | Permite atualizar senha | Validado |

Observação: o print 01 mostra a interface com dois controles visuais contendo o texto `Gerenciar`; o alvo marcado é o controle acionado no fluxo real.
