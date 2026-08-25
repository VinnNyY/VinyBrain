# Sessão - Cota de E-mail Painel Novo - 2026-07-28

## Objetivo

Validar e produzir, se possível, o tutorial `Como alterar a cota de armazenamento de uma conta de e-mail no Painel Novo da StayCloud`, mantendo a produção unitária e sem publicar.

## Auditoria pública

- Categoria oficial Painel novo auditada em 2026-07-28: https://ajuda.staycloud.com.br/ajuda-category/painel-novo/
- Artigo relacionado encontrado: `Como Alterar o Armazenamento dos E-mails no cPanel`.
- Artigo relacionado de criação de e-mail no Painel Novo encontrado.
- Artigo relacionado de consulta de uso/cota no Painel Novo encontrado.
- Decisão inicial: o tema só poderia existir como novo/complementar se o Painel Novo tivesse fluxo próprio de alteração de cota.

## Validação do Painel Novo

- Acesso feito somente na conta própria autorizada.
- Sessão remota do Chrome em `127.0.0.1:9222`: indisponível.
- Busca por `.env`, `*.env` e `.env.*` com variáveis StayCloud esperadas: sem resultado.
- Fonte local autorizada usada em memória, sem registrar valores.
- Conta descartável criada porque nenhuma conta `tutorial-teste-*` estava visível.
- Endereço registrado apenas de forma mascarada: `tutorial-teste-****@dominio-censurado`.
- Ações exibidas na linha da conta: Webmail, Resetar senha e Excluir.
- Ação de editar cota/armazenamento: não encontrada.
- Campo de cota/limite: não encontrado.
- Prints finais aprovados: 0.
- Duas capturas parciais foram reprovadas por marcação incorreta no menu lateral e preservadas em `apoio/marcacoes-invalidas/`.

## Decisão

Não produzir tutorial falso.

Classificação final: recurso indisponível no Painel Novo validado.

## Arquivos atualizados

- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - BACKLOG DE IDEIAS.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/09 - Como alterar a cota de armazenamento de uma conta de e-mail no Painel Novo da StayCloud/`
- `14 - Histórico Codex/Checkpoint Atual.md`

## Pendências

- Vinicius decidir se o próximo item da fila será iniciado em nova execução.
- O tema de cota só deve voltar se a interface do Painel Novo passar a exibir ação real de edição de armazenamento/cota.

## Correção imediata posterior

- A validação completa do recurso de cota foi repetida.
- Foram verificados: serviço correto, aba `E-mails`, linha da conta descartável, hover, clique na linha, ações disponíveis e busca por modal/campo de cota, armazenamento ou limite.
- Resultado mantido: recurso de cota indisponível no Painel Novo validado.
- Fallback autorizado executado: `10 - Como acessar o Webmail pelo Painel Novo da StayCloud`.
- O tutorial de Webmail foi criado localmente com 725 palavras, 3 prints aprovados, SEO preparado e preview validado em headless.
- Após validação de Vinicius, o tutorial de Webmail foi publicado.
- BetterDocs ID: 2877.
- URL pública: https://ajuda.staycloud.com.br/docs/webmail-staycloud-painel-novo/
- Rank Math: 88/100.
- Mídias públicas: 2874, 2875, 2876.
- Nenhuma mensagem de e-mail foi acessada e nenhuma conta foi excluída.

## Segurança

- Nenhuma conta real foi alterada.
- Nenhuma conta foi excluída.
- Nenhuma senha foi exibida ou salva.
- Nenhuma mídia foi enviada ao WordPress.
- Nenhum BetterDocs foi criado.
- Nada foi publicado.
