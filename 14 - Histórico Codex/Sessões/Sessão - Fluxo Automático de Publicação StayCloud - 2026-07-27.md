# Sessão - Fluxo Automático de Publicação StayCloud - 2026-07-27

## Problemas encontrados

- O tutorial publicado anteriormente precisou de correção no Rank Math porque a palavra-chave de foco não ficou registrada como chip ativo.
- O snippet do Rank Math precisa ser confirmado visualmente antes de qualquer publicação.
- O botão `Publicar` não pode ser usado antes do score real recalcular.
- Na captura do novo tutorial, a primeira versão do script marcou o alvo errado porque a busca geral é um botão com `aria-label`.
- A sanitização inicial manteve um nome de teste e precisou ser refeita antes de aprovar os prints finais.

## Correções aplicadas

- O workflow de publicação passou a exigir Gate Rank Math antes de publicar.
- A palavra-chave precisa ser digitada, confirmada com Enter quando necessário e transformada em chip ativo.
- O snippet precisa salvar título SEO, slug e meta description.
- O score real mínimo antes de publicar ficou definido como 80/100.
- O fluxo oficial foi registrado no Obsidian, incluindo criação, validação, prints, upload, BetterDocs, Rank Math, publicação, validação pública e atualização da meta.
- O novo tutorial foi criado localmente e bloqueado antes do WordPress.

## Decisões

- Categoria padrão para os tutoriais do Painel Novo: `Painel novo`.
- O tutorial só conta para a meta quando estiver publicado e validado publicamente.
- Antes de iniciar tema novo, auditar base pública, Viny Brain, fila, Tutoriais Corretos V2 e Modelos Aprovados.
- Não criar artigo duplicado nem aceitar slug com sufixo `-2` ou `-3` sem investigação.
- Não registrar credenciais, cookies, tokens ou dados de sessão no Viny Brain.

## Fluxo final

1. Criar BetterDocs.
2. Preencher título.
3. Colar HTML.
4. Salvar como rascunho.
5. Confirmar imagens.
6. Abrir Rank Math.
7. Preencher palavra-chave e pressionar Enter.
8. Confirmar chip ativo.
9. Preencher snippet.
10. Preencher resumo.
11. Preencher social.
12. Selecionar categoria.
13. Salvar rascunho.
14. Aguardar score recalcular.
15. Corrigir até no mínimo 80.
16. Abrir prévia.
17. Executar revisão final.
18. Somente então publicar.
19. Validar a página pública.

## Arquivos atualizados

- `03 - Tutoriais/Fluxo Oficial - Criação e Publicação de Tutorial StayCloud.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - BACKLOG DE IDEIAS.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - README - PADRÃO OFICIAL.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/_MODELO OFICIAL/apoio/registro-publicacao.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS.md`
- `17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Publicar Tutorial StayCloud.md`
- `17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md`
- `14 - Histórico Codex/Checkpoint Atual.md`

## Tutorial criado nesta sessão

- Título: Como usar a busca geral do Painel Novo da StayCloud
- Caminho: `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud/`
- Palavra-chave: busca do Painel Novo StayCloud
- Quantidade de palavras: 796
- Quantidade de prints: 3
- ID BetterDocs: 2852
- URL pública: https://ajuda.staycloud.com.br/docs/busca-do-painel-novo-staycloud/
- Score Rank Math: 85/100
- Status: publicado e validado

## Pendências

- Próximo tutorial P0: Como identificar o serviço correto antes de clicar em Gerenciar.
- Manter o Gate Rank Math obrigatório em todas as próximas publicações.

## Próximo tutorial escolhido

Como usar a busca geral do Painel Novo da StayCloud.
