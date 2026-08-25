# Backlog de ideias — Tutoriais Painel Novo

## Próximos tutoriais novos

## Deploy StayCloud — fila validada em 2026-07-29

Meta atual após publicação do item 5: 12/12 publicados e validados — CONCLUÍDA.

| Ordem | Tema | Objetivo | Tipo | Status | Risco |
|---|---|---|---|---|---|
| 1 | Como ativar o Deploy no Painel Novo da StayCloud | Localizar o produto, conferir o status `cloud ainda não ativo` e identificar `Começar grátis`. | novo tutorial | publicado e validado | Médio: ativação real não executada. |
| 2 | Como fazer o primeiro deploy na StayCloud | Publicar projeto de teste por `Upload de .zip`, acompanhar status e abrir URL pública. | novo tutorial complementar | publicado e validado | Médio/alto: aplicação pública descartável criada. |
| 3 | Como instalar e usar a CLI do Deploy StayCloud | Validar comando e fluxo CLI com `@staysdev/setup`. | novo tutorial complementar | publicado e validado | Médio: token temporário e deploy público descartável. |
| 4 | Como consultar os logs do Deploy StayCloud e acompanhar o status | Validar abas `Deploys` e `Logs`, status `pronto`, histórico e logs de build. | novo tutorial complementar | publicado e validado | Baixo/médio. |
| 5 | Como publicar uma nova versão pelo Deploy StayCloud | Alterar projeto descartável já conectado, executar `npx @staysdev/setup deploy`, acompanhar status e confirmar a nova versão. | novo tutorial complementar | publicado e validado | Médio: envolve deploy real em projeto descartável. |

Autorização extra recebida em 2026-08-03 para produzir somente `Como configurar um domínio personalizado no Deploy StayCloud`. O ciclo mensal segue concluído com 12/12 tutoriais publicados e validados.

Item 1 publicado em 2026-07-29: https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/ — Rank Math 86/100.

Item 2 publicado em 2026-07-29: https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ — BetterDocs ID 2896 — Rank Math 85/100 — 6 imagens públicas IDs 2890 a 2895. Meta atualizada para 9/12; restam três tutoriais para a meta.

Item 3 publicado em 2026-07-29: https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/ — BetterDocs ID 2909 — Rank Math 85/100 — 6 imagens públicas IDs 2903 a 2908. Meta atualizada para 10/12; restam dois tutoriais para a meta.

Item 4 publicado em 2026-07-30: https://ajuda.staycloud.com.br/docs/logs-do-deploy-staycloud/ — BetterDocs ID 2925 — Rank Math 80/100 — 6 imagens públicas IDs 2919 a 2924. Meta atualizada para 11/12; resta um tutorial para a meta.

Item 5 publicado em 2026-07-31: https://ajuda.staycloud.com.br/docs/publicar-nova-versao-staycloud/ — BetterDocs ID 2937 — Rank Math 80/100 — 7 imagens públicas IDs 2930 a 2936. Meta atualizada para 12/12 — CONCLUÍDA.

Item extra publicado em 2026-08-03: `Como configurar um domínio personalizado no Deploy StayCloud` — https://ajuda.staycloud.com.br/docs/dominio-personalizado-deploy-staycloud/ — BetterDocs ID 2962 — Rank Math 80/100 — 5 imagens públicas IDs 2957 a 2961. Cenário A confirmado: área `Domínios`, botão `Adicionar domínio`, campo `Domínio`, instrução `CNAME`, status `ATIVOS`, `PENDENTES` e `ERRO`. Não contado como 13/12.

## Meta — acompanhamento histórico

Meta restante de Vinicius: 6 tutoriais publicados e validados.

### 1. Alterar cota de armazenamento de e-mail

- Prioridade: P0
- Status: recurso indisponível no Painel Novo validado em 2026-07-28
- Ação autorizada: editar somente a conta descartável
- Resultado: não produzido como tutorial, porque a validação completa exibiu Webmail, Resetar senha e Excluir, mas não exibiu Editar cota/Armazenamento/Limite.
- Fallback executado: `Como acessar o Webmail pelo Painel Novo da StayCloud`, produzido em V2/10, publicado e validado em 2026-07-28.
- Não alterar contas reais.

### 2. Excluir uma conta de e-mail

- Prioridade: P0
- Status: fila — não iniciado
- Utilizar somente uma conta descartável
- Criar uma nova conta de teste para esse tutorial, caso necessário
- Não excluir conta real
- A exclusão final exige autorização explícita de Vinicius

### 3. Acessar o Webmail pelo Painel Novo

- Prioridade: P1
- Status: publicado e validado
- URL pública: https://ajuda.staycloud.com.br/docs/webmail-staycloud-painel-novo/
- BetterDocs ID: 2877
- Rank Math: 88/100
- Auditar possível sobreposição com artigos antigos de Webmail e cPanel

### 4. Identificar o serviço correto antes de Gerenciar

- Prioridade: P1
- Status: fila — não iniciado
- Escopo: identificação e navegação
- Não executar alteração no serviço

### 5. Diferença entre Ver detalhes e Gerenciar

- Prioridade: P1
- Status: descartado — tema não aprovado
- Objetivo: evitar acesso à área errada
- Classificação: descartado por decisão editorial
- Pasta preservada: `_Descartados/Descartado - Tema nao aprovado - 2026-07-28 - Ver detalhes e Gerenciar`
- Observação: no painel validado, o controle equivalente a `Ver detalhes` aparece como `Expandir detalhes`; o objetivo ficou fraco e as marcações foram reprovadas.

### 6. Conferir domínio vinculado ao serviço

- Prioridade: P1
- Status: fila — não iniciado
- Escopo: consulta
- Não adicionar, remover ou alterar domínio

## Ciclo prioritário de e-mails

1. Como alterar a senha de uma conta de e-mail no Painel Novo
   - Tipo: refatoração.
   - Prioridade: P0.
   - Status: publicado e validado.
   - URL a preservar: https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/
   - Slug a preservar: `alterar-senha-de-e-mail`.
   - Observação: artigo existente ID 2099 refatorado e publicado em 2026-07-28. Rank Math 87/100. Fluxo real validado com `Gerenciar`, aba `E-mails`, ação `Resetar senha` e modal `Resetar senha`.

2. Como excluir uma conta de e-mail no Painel Novo
   - Tipo: possível tutorial novo.
   - Prioridade: P0.
   - Status: próximo.
   - Observação: utilizar somente conta descartável criada pelo próprio Codex.
   - Confirmação obrigatória para exclusão final: `PODE APAGAR O E-MAIL DE TESTE`.

3. Como alterar a cota de armazenamento de uma conta de e-mail pelo Painel Novo
   - Tipo: candidato novo ou refatoração.
   - Prioridade: P1.
   - Status: aguardando auditoria do painel e da base.
   - Observação: não criar se o recurso existir somente no cPanel.

4. Como acessar o Webmail pelo Painel Novo
   - Tipo: possível refatoração.
   - Prioridade: P1.
   - Status: aguardando auditoria.
   - Observação: diferenciar de acesso por `/webmail` e do fluxo do cPanel.

1. Como usar a busca geral do Painel Novo da StayCloud
   - Prioridade: P0
   - Risco técnico: baixo
   - Status: publicado e validado

2. Como identificar o serviço correto antes de clicar em Gerenciar
   - Prioridade: P0
   - Risco técnico: baixo
   - Status: duplicado
   - Decisão 2026-07-27: não produzir como novo; objetivo já coberto pelo tutorial local de serviços ativos.

3. Como conferir qual domínio está vinculado a um serviço
   - Prioridade: P1
   - Risco técnico: baixo
   - Status: duplicado
   - Decisão 2026-07-27: não produzir como novo; assunto já aparece no fluxo de serviços ativos.

4. Como consultar disco, CPU e RAM do serviço no Painel Novo
   - Prioridade: P1
   - Risco técnico: baixo/médio
   - Status: publicado e validado
   - Observação: diferenciar dos tutoriais técnicos do cPanel.
   - Decisão 2026-07-27: tema novo. O pacote criado em lote foi reprovado por marcações incorretas e preservado em `_Lotes Reprovados`; o tutorial foi reconstruído do zero em produção unitária como V2/07 e publicado no BetterDocs ID 2865.

5. Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo
   - Prioridade: P1
   - Risco técnico: baixo
   - Status: descartado — tema não aprovado
   - Decisão 2026-07-28: descartar. O botão textual `Ver detalhes` não apareceu; o fluxo real usa `Expandir detalhes`, deixando o objetivo pouco claro. Vinicius não gostou do tema e pediu descarte.

6. Como localizar a área de Deploy no Painel Novo
   - Prioridade: P1
   - Risco técnico: baixo
   - Escopo: somente localizar, sem executar deploy.
   - Status: reprovado — reconstrução individual necessária
   - Decisão 2026-07-27: tema novo, mas o pacote criado em lote foi reprovado por marcações incorretas. Só pode voltar por produção unitária.

7. Como conferir o plano e o status do serviço contratado
   - Prioridade: P2
   - Risco técnico: baixo/médio
   - Status: complementar
   - Decisão 2026-07-27: não produzir URL nova; pode virar seção de melhoria no tutorial de serviços ativos.

## Refatorações candidatas

- Como acessar o WordPress pelo Painel Novo.
- Como encontrar dados do servidor.
- Upgrade e downgrade com o fluxo atual.
- Alterar senha de e-mail pelo fluxo atual.

## Auditoria antes de iniciar cada tema

Antes de iniciar cada tema:

- pesquisar na base pública;
- pesquisar no Viny Brain;
- pesquisar na fila;
- pesquisar em Tutoriais Corretos V2;
- pesquisar em Modelos Aprovados;
- evitar duplicação;
- decidir entre novo tutorial, refatoração ou descarte.

## Registro de auditoria

- 2026-07-27: tema `Como usar a busca geral do Painel Novo da StayCloud` classificado como novo. A base pública e o Viny Brain possuem tutoriais relacionados de busca em Domínios, faturas, chamados e cPanel, mas não um tutorial dedicado à busca superior geral do Painel Novo para localizar sites, domínios, faturas ou chamados.
- 2026-07-27: auditoria completa da categoria oficial Painel novo encontrou 23 artigos. Dos 6 candidatos novos, somente 2 foram aprovados como novos: `Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud` e `Como localizar a área de Deploy no Painel Novo da StayCloud`.
- 2026-07-27: `Como criar uma conta de e-mail` permanece bloqueado como duplicado por existir `Contas de Email` e `Criar E-mails painel Stay` na categoria oficial.
- 2026-07-27: os pacotes criados em lote para `Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud` e `Como localizar a área de Deploy no Painel Novo da StayCloud` foram reprovados e movidos para `_Lotes Reprovados`. A produção volta a ser unitária, com validação individual obrigatória.
- 2026-07-27: o tema `Como identificar o serviço correto antes de clicar em Gerenciar` foi auditado e classificado como duplicado do modelo aprovado de serviços ativos. Por isso, não foi criado. O próximo tema realmente novo foi `Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud`, reconstruído unitariamente.
- 2026-07-27: `Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud` foi publicado e validado publicamente. BetterDocs ID 2865, Rank Math 81/100, URL `https://ajuda.staycloud.com.br/docs/disco-cpu-ram-painel-novo-staycloud/`.
- 2026-07-28: ciclo prioritário de e-mails iniciado. O primeiro tema, `Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud`, foi classificado como refatoração do artigo `https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/`.
- 2026-07-28: bloqueio falso removido. O fluxo real foi validado no Painel Novo com credenciais locais autorizadas consumidas somente em memória; conta descartável `tutorial-teste-*` criada/reutilizada, senha alterada sem registro, prints sanitizados e tutorial local concluído. Nada foi publicado.
- 2026-07-28: `Como alterar a senha de uma conta de e-mail no Painel Novo da StayCloud` foi publicado como refatoração do BetterDocs ID 2099, preservando URL `https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/` e slug `alterar-senha-de-e-mail`. Rank Math final 87/100.
- 2026-07-28: `Como acessar o Webmail pelo Painel Novo da StayCloud` foi publicado e validado. BetterDocs ID 2877, URL `https://ajuda.staycloud.com.br/docs/webmail-staycloud-painel-novo/`, Rank Math final 88/100.
- 2026-07-28: `Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo da StayCloud` foi descartado por Vinicius. Motivos: tema não aprovado, objetivo pouco claro, botão textual `Ver detalhes` inexistente no painel atual e marcações incorretas/ambíguas. Pasta preservada em `_Descartados`; não publicar e não contar na meta.
