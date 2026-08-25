# Deploy StayCloud

Data da validação: 2026-07-29

## O Que É

Produto do Painel Novo exibido como `Deploy` no menu principal e `Cloud` na área interna. A proposta apresentada na interface é colocar sites, páginas ou sistemas no ar a partir de projetos criados com IA, GitHub, arquivo `.zip` ou comando no terminal.

## Onde Aparece

- Menu lateral principal: `Deploy`.
- URL validada: `https://beta.staycloud.com/dashboard/cloud`.
- Tela: `Cloud`.
- Subtítulo: `deploy de git`.

## Pré-Requisitos Observados

- Conta autenticada no Painel Novo.
- Deploy/Cloud ativo para o fluxo de primeiro deploy.
- Projeto de teste sem dados sensíveis.
- Arquivo `.zip` com build estático pronto.
- Nome do projeto em padrão `lowercase, kebab, 3-32 chars`.

## Fluxos Observados

- Localizar a área Deploy.
- Conferir status do Cloud.
- Iniciar ativação pelo botão `Começar grátis`.
- Criar projeto por `Novo projeto`.
- Publicar por `Upload de .zip`.
- Preencher `NOME DO PROJETO`.
- Acionar `criar e implantar`.
- Acompanhar tela `Implantando`.
- Conferir status `publicando`.
- Confirmar projeto como `pronto` e `No ar`.
- Usar o comando exibido `npx @staysdev/setup init` somente após validação própria da CLI.
- Acompanhar recursos pelas abas `Deployments`, `Logs`, `Domínios`, `Integrações` e `Plano`.

## Termos Oficiais Confirmados

- Deploy
- Cloud
- deploy de git
- Visão geral
- Deployments
- Logs
- Domínios
- Integrações
- Plano
- Começar grátis
- Falar com vendas
- Novo projeto
- Upload de .zip
- selecionar arquivo .zip
- NOME DO PROJETO
- criar e implantar
- Implantando
- publicando
- pronto
- No ar

## Tutoriais Planejados

| Ordem | Tema | Status |
|---|---|---|
| 1 | Como ativar o Deploy no Painel Novo da StayCloud | publicado e validado |
| 2 | Como fazer o primeiro deploy na StayCloud | publicado e validado |
| 3 | Como instalar e usar a CLI do Deploy StayCloud | publicado e validado |
| 4 | Como consultar os logs do Deploy StayCloud e acompanhar o status | publicado e validado |
| 5 | Como publicar uma nova versão pelo Deploy StayCloud | publicado e validado |

## Tutoriais Publicados

- DEPLOY STAYCLOUD NO PAINEL NOVO / H1 `Como ativar o Deploy no Painel Novo da StayCloud em 4 passos`: https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/
- PRIMEIRO DEPLOY STAYCLOUD / H1 `Como fazer o primeiro deploy na StayCloud`: https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/
- CLI DEPLOY STAYCLOUD / H1 `Como instalar e usar a CLI Deploy StayCloud`: https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/
- LOGS DO DEPLOY STAYCLOUD / H1 `Como consultar os logs do Deploy StayCloud e acompanhar o status`: https://ajuda.staycloud.com.br/docs/logs-do-deploy-staycloud/
- PUBLICAR NOVA VERSÃO STAYCLOUD / H1 `Como publicar nova versão StayCloud pelo Deploy em 5 passos`: https://ajuda.staycloud.com.br/docs/publicar-nova-versao-staycloud/
- DOMÍNIO PERSONALIZADO DEPLOY STAYCLOUD / H1 `Como configurar um domínio personalizado no Deploy StayCloud`: https://ajuda.staycloud.com.br/docs/dominio-personalizado-deploy-staycloud/

## Tutoriais Extras

- Conteúdo extra publicado e validado: `Como configurar um domínio personalizado no Deploy StayCloud`.
- BetterDocs ID: 2962.
- URL: https://ajuda.staycloud.com.br/docs/dominio-personalizado-deploy-staycloud/
- Rank Math: 80/100.
- Meta mensal permanece 12/12 — CONCLUÍDA.

## Dúvidas Pendentes

- Como funcionam variáveis e integrações.
- Domínios: área real confirmada em 2026-08-03, com instrução de CNAME e status `ATIVOS`, `PENDENTES` e `ERRO`; validação final por domínio real não executada porque não houve autorização para alterar DNS externo.
- Se os logs de runtime do site no ar serão incorporados à tela `Logs` em versão futura.

## Validação de Domínio Personalizado

- Cenário: A — recurso de domínio confirmado.
- Área oficial: `Domínios`.
- Botão observado: `Adicionar domínio`.
- Campo observado: `Domínio`.
- Orientação do campo: informar domínio sem protocolo e sem path.
- Registro DNS solicitado: `CNAME`.
- Status observados: `ATIVOS`, `PENDENTES` e `ERRO`.
- SSL observado: `SSL automático via CDN global`.
- Projeto descartável usado: `tutorial-deploy-cli-teste`.
- Não houve alteração de DNS externo, salvamento de domínio, alteração de nameservers, remoção de domínio ou ação em cliente.
- Tutorial local: `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/16 - Como configurar um domínio personalizado no Deploy StayCloud`.
- Classificação: conteúdo extra após meta 12/12 concluída.
- Tutorial publicado no BetterDocs em 2026-08-03.
- BetterDocs ID: 2962.
- URL pública do tutorial: https://ajuda.staycloud.com.br/docs/dominio-personalizado-deploy-staycloud/
- Rank Math: 80/100.
- Mídias públicas: IDs 2957 a 2961.

## Validação de Nova Versão

- Cenário: C — projeto já conectado é atualizado pelo terminal.
- Termo do painel: `novo deploy`.
- Texto observado: `Para atualizar produção, faça um novo deploy.`
- Método validado: `npx @staysdev/setup deploy`.
- Comando descartado neste contexto: `npx @staysdev/setup deploy --new`, porque retornou escopo insuficiente para projeto já conectado.
- Projeto descartável: `tutorial-deploy-cli-teste`.
- Alteração validada: texto simples no `index.html`, sem formulário, banco de dados, token, variável de ambiente ou integração externa.
- Resultado: URL pública descartável continuou acessível e exibiu a nova versão.
- Status observado pela CLI: `live`.
- Status observado no painel: `pronto`.
- Tutorial local: `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/15 - Como publicar uma nova versão pelo Deploy StayCloud`.
- Tutorial publicado no BetterDocs em 2026-07-31.
- BetterDocs ID: 2937.
- URL pública do tutorial: https://ajuda.staycloud.com.br/docs/publicar-nova-versao-staycloud/
- Rank Math: 80/100.
- Mídias públicas: IDs 2930 a 2936.
- Meta após publicação e validação: 12/12 — CONCLUÍDA.

## Validação de Status e Logs

- Cenário: A — existem status e logs oficiais.
- Projeto descartável: `tutorial-deploy-cli-teste`.
- Área principal: `Cloud`.
- Abas usadas: `Visão geral`, `Deploys` e `Logs`.
- Status observado: `pronto`.
- Estado do projeto: `online`.
- Fase observada: `live`.
- Histórico observado: `Deploys`, com filtros e registro de publicação.
- Logs observados: logs de build do último deploy.
- Filtros de log observados: `Todos`, `Info · OK`, `Alertas` e `Erros · Fatal`.
- Limitação observada: logs de runtime do site no ar ainda não aparecem na visão `Logs`.
- Tutorial publicado no BetterDocs em 2026-07-30.
- BetterDocs ID: 2925.
- URL pública do tutorial: https://ajuda.staycloud.com.br/docs/logs-do-deploy-staycloud/
- Rank Math: 80/100.
- Mídias públicas: IDs 2919 a 2924.
- Meta após publicação e validação: 11/12.

## Validação da CLI

- Cenário: A — existe ferramenta real de CLI.
- Pacote: `@staysdev/setup`.
- Versão validada: `0.1.3`.
- Comando gerado no painel: `npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API`.
- Método de autenticação: token temporário gerado no painel.
- Projeto descartável: `tutorial-deploy-cli-teste`.
- URL pública descartável: `https://tutorial-deploy-cli-teste.stayai.space/`.
- Validação HTTP: 200.
- Status no painel: `pronto`.
- Tutorial publicado no BetterDocs em 2026-07-29.
- BetterDocs ID: 2909.
- URL pública do tutorial: https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/
- Rank Math: 85/100.
- Nenhum token real foi registrado no Obsidian.

## Validação do Primeiro Deploy

- Projeto: `tutorial-deploy-teste`.
- Forma usada: `Upload de .zip`.
- URL pública descartável: `https://tutorial-deploy-teste.stayai.space`.
- Validação HTTP: 200.
- O painel exibiu logs de build em tempo real.
- A aplicação publicada abriu sem credenciais.
- Tutorial publicado no BetterDocs em 2026-07-29.
- BetterDocs ID: 2896.
- URL pública do tutorial: https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/
- Rank Math: 85/100.

## Fontes

- Vídeo de referência: https://www.youtube.com/watch?v=V-P2VggjmzU&t=5s
- Painel Novo validado em conta autorizada de Vinicius.

## Segurança

Nenhum token, senha, variável de ambiente, domínio real, URL interna ou dado financeiro foi registrado.

## Padrão Visual Ajustado

Em 2026-07-30, os três tutoriais publicados de Deploy tiveram o título nativo do BetterDocs ajustado para não repetir a mesma frase do H1 interno. O título nativo fica curto e categórico; o H1 do conteúdo mantém a promessa específica do tutorial.
