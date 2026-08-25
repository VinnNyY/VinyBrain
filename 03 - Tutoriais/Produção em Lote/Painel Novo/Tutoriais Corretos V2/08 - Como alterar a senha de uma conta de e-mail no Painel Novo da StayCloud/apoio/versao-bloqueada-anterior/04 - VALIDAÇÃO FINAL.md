# Validação final

- Título: Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud
- Tipo: refatoração
- Status: Bloqueado aguardando acesso ao Painel Novo
- Data: 2026-07-28
- Modo de produção: unitário

## Auditoria de duplicação

- Artigo oficial existente encontrado: Como alterar senha de e-mail pelo Painel do Cliente StayCloud: 3 Passos
- BetterDocs ID público: 2099
- URL a preservar: https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/
- Slug a preservar: `alterar-senha-de-e-mail`
- Decisão: refatoração; não criar artigo novo.
- Duplicidade pública: não foi encontrado slug público `alterar-senha-de-e-mail-2` ou `alterar-senha-de-e-mail-3`.

## Fluxo real

- Status: não validado.
- Motivo: ausência de credenciais do Painel Novo nas configurações locais autorizadas.
- Tentativa segura: abertura de `https://beta.staycloud.com/dashboard` retornou tela de login.

## Conta de teste

- Status: não criada e não reutilizada.
- Nenhuma conta real foi alterada.
- Nenhuma senha foi gerada, exibida, salva ou registrada.

## Prints

| Print | Alvo principal | Status |
|---|---|---|
| 01 | Botão Gerenciar do serviço correto | Pendente |
| 02 | Área ou opção Contas de e-mail | Pendente |
| 03 | Opção real para alterar senha da conta descartável | Pendente |
| 04 | Campo ou botão de salvar nova senha | Pendente |

## SEO

- Palavra-chave: alterar senha de e-mail StayCloud
- Título SEO sugerido: Alterar senha de e-mail StayCloud pelo Painel Novo
- Slug: alterar-senha-de-e-mail
- Meta description sugerida: Aprenda a alterar a senha de e-mail StayCloud pelo Painel Novo, localizar a conta correta e definir uma nova senha com segurança.
- Score Rank Math: não aplicável nesta fase; nada foi atualizado no WordPress.

## Bloqueios respeitados

- Nenhum upload foi feito.
- Nenhum BetterDocs foi criado ou editado.
- Nada foi publicado.
- Nenhuma conta de e-mail foi criada.
- Nenhuma senha foi alterada.
- Nenhuma conta real foi acessada ou modificada.
- Nenhuma exclusão foi iniciada.
- Nenhum segundo tutorial foi iniciado.

## Pendência

Disponibilizar `STAY_EMAIL` e `STAY_PASSWORD` no ambiente autorizado ou indicar o `.env` correto, sem expor os valores no chat.
