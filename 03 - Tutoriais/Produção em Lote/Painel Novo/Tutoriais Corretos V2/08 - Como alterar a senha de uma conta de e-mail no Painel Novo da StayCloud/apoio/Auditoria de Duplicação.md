# Auditoria de Duplicação

- Data: 2026-07-28
- Tema: Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud
- Tipo: refatoração
- Status: publicado e validado como refatoração do artigo existente

## Fontes públicas auditadas

| Fonte | Resultado | Decisão |
|---|---|---|
| Categoria oficial Painel novo | A categoria contém artigos de e-mail relacionados, incluindo `Contas de Email`, `Criar E-mails painel Stay` e `Consumo do E-mail profissional`. | Não criar tutorial de criação de e-mail. |
| Base pública geral | Existe o artigo `Como alterar senha de e-mail pelo Painel do Cliente StayCloud: 3 Passos`. | Refatorar o artigo existente. |
| Base pública geral | Existe também `Como Alterar a Senha de E-mails na StayCloud`. | Tratar como sobreposição histórica; não criar slug concorrente. |
| Base pública geral | Existem artigos de Webmail e criação de e-mail. | Usar somente como links internos confirmados. |

## Artigo oficial a preservar

- Título: Como alterar senha de e-mail pelo Painel do Cliente StayCloud: 3 Passos
- BetterDocs ID público: 2099
- URL pública: https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/
- Slug: `alterar-senha-de-e-mail`
- Decisão: refatoração para fluxo atual do Painel Novo, preservando URL e slug.

## Sobreposição

- `Como criar uma conta de e-mail no StayPanel`: criação, não alteração de senha.
- `Como criar email no painel novo da StayCloud - 2026`: criação no Painel Novo, não deve ser duplicado.
- `Consultar uso de e-mail no Painel Novo da StayCloud`: consulta de uso/cota, não troca de senha.
- `Como acessar o Webmail`: acesso à caixa, não alteração de credencial.
- `Como Alterar a Senha de E-mails na StayCloud`: artigo histórico com sobreposição; não usar como nova URL.

## Auditoria BetterDocs pública

- Consulta por slug `alterar-senha-de-e-mail`: retornou o documento publicado ID 2099.
- Consulta por busca `alterar senha de e-mail`: retornou artigos relacionados, incluindo ID 2099 e o artigo histórico ID 1244.
- Não foi identificado documento público com slug concorrente `alterar-senha-de-e-mail-2` ou `alterar-senha-de-e-mail-3`.

## Decisão editorial

Classificação final: refatoração.

Não criar novo BetterDocs, não criar slug alternativo e não aceitar `alterar-senha-de-e-mail-2` ou `alterar-senha-de-e-mail-3`.

## Fluxo real validado

- Acesso ao Painel Novo realizado no ambiente autorizado.
- Serviço aberto pelo botão `Gerenciar`.
- Área real: aba `E-mails`.
- Ação real: `Resetar senha`.
- Modal real: `Resetar senha`.
- Botão de salvamento real: `Atualizar senha`.
- Conta usada: descartável `tutorial-teste-*`.
- Senha alterada: sim, sem registro do valor.

## Status

Refatoração publicada no BetterDocs ID 2099 em 2026-07-28, preservando URL e slug. Nenhum documento duplicado foi criado.
