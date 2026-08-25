# Sessão - Ciclo Prioritário de E-mails - 2026-07-28

## Objetivo

Iniciar o ciclo prioritário de tutoriais de gerenciamento de contas de e-mail pelo Painel Novo, trabalhando somente no tutorial `Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud`.

## Auditoria

- A categoria oficial Painel novo foi auditada em `https://ajuda.staycloud.com.br/ajuda-category/painel-novo/`.
- A base pública contém artigos relacionados a criação de e-mail, Webmail, consumo de e-mail e alteração de senha.
- O artigo a preservar é `Como alterar senha de e-mail pelo Painel do Cliente StayCloud: 3 Passos`.
- BetterDocs ID público: 2099.
- URL a preservar: `https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/`.
- Slug a preservar: `alterar-senha-de-e-mail`.
- Decisão: refatoração, sem criar artigo novo.
- A consulta pública por slug retornou somente o documento ID 2099; não foi encontrado slug público com sufixo `-2` ou `-3`.

## Produção local inicial

- Pasta V2/08 criada.
- Auditoria de duplicação criada.
- Plano de prints criado.
- Fonte editorial criada.
- Registro de publicação criado.
- Controle de conta de teste criado.
- Arquivos oficiais iniciais foram criados com status `BLOQUEADO`, sem conteúdo publicável.

## Bloqueio

Não foi possível acessar o Painel Novo porque as variáveis `STAY_EMAIL` e `STAY_PASSWORD` não estavam no `.env` autorizado nem no ambiente do shell. A tentativa segura de abrir `https://beta.staycloud.com/dashboard` retornou a tela de login.

## Segurança

- Nenhuma credencial foi impressa.
- Nenhuma senha foi salva.
- Nenhum cookie, token ou sessão foi registrado.
- Nenhuma conta de e-mail foi criada.
- Nenhuma senha de e-mail foi alterada.
- Nenhuma conta real foi modificada.
- Nenhum tutorial foi publicado.
- O tutorial de exclusão não foi iniciado.

## Próxima ação

Disponibilizar `STAY_EMAIL` e `STAY_PASSWORD` no ambiente autorizado ou indicar o `.env` correto sem expor os valores no chat.

## Correção imediata

- Data: 2026-07-28.
- A versão `BLOQUEADO` foi preservada em `apoio/versao-bloqueada-anterior/`.
- Nenhum `.env`, `*.env` ou `.env.*` com chaves `STAY_*` foi encontrado nos caminhos priorizados.
- Foi usado o arquivo local autorizado `/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md`, consumindo somente em memória os rótulos `Login do painel do cliente` e `Senha do painel do cliente`.
- Sessão Chrome remota em `127.0.0.1:9222`: indisponível.
- Login novo realizado no Painel Novo.
- Fluxo real validado: `Gerenciar` -> `E-mails` -> `Resetar senha` -> modal `Resetar senha` -> `Atualizar senha`.
- Conta descartável `tutorial-teste-*` criada/reutilizada na conta autorizada.
- Senha alterada em conta descartável; o valor não foi exibido nem salvo.
- Prints reais capturados, sanitizados e salvos em `prints-finais/`.
- Tutorial final recriado nos quatro arquivos oficiais.
- Nada foi enviado ao WordPress, nenhum BetterDocs foi editado e nada foi publicado.
- O próximo tutorial de exclusão não foi iniciado.

## Publicação autorizada

- Gatilho recebido: `autorizado, pode postar`.
- BetterDocs editado: ID 2099.
- URL pública preservada: https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/
- Slug preservado: `alterar-senha-de-e-mail`.
- Categoria final: `Painel novo`.
- Mídias enviadas: 2868, 2869, 2870, 2871.
- Palavra-chave final no Rank Math: `alterar senha de e-mail`.
- Título SEO final: `Alterar senha de e-mail StayCloud em 4 passos`.
- Score Rank Math antes da correção final: 70/100.
- Score Rank Math final: 87/100.
- Validação pública: HTTP 200, canonical correto, 4 imagens carregando, sem Markdown e sem caminhos locais.
- Nenhum BetterDocs duplicado foi criado.
- O próximo tutorial de exclusão não foi iniciado.
