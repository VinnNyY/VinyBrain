# Auditoria de Duplicação

Data: 2026-07-30

Tema avaliado: `Como consultar o status e os logs de um deploy na StayCloud`

## Tutorial Anterior

- Tutorial anterior: `Como instalar e usar a CLI do Deploy StayCloud`.
- Status: publicado e validado.
- URL: https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/
- BetterDocs ID: 2909.
- Meta real registrada após a publicação anterior: 10/12.

## Planilha

Planilha `Conteudos - Base de conhecimento`, aba `Tutoriais`, lida em modo somente leitura.

Resultados relacionados:

| Título | Link | Status | Autor | Objetivo aparente | Sobreposição |
|---|---|---|---|---|---|
| Como fazer o primeiro deploy na StayCloud | https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ | Postado | Vini | Publicar o primeiro projeto pelo Deploy. | Complementar; cita status e logs durante a criação, mas não ensina consulta posterior. |
| Acompanhar desempenho pelo painel StayCloud | sem link | sem status | Fael | Ideia genérica de desempenho/monitoramento. | Não duplicado automaticamente; não indica novo Deploy, build, histórico ou logs de publicação. |

Não foram encontrados títulos publicados na planilha com objetivo específico de consultar logs, status, histórico de build ou falha de publicação do novo Deploy StayCloud.

## Base Pública

Categoria pública `Painel novo` auditada.

Resultados relacionados:

| Artigo | URL | Objetivo | Sobreposição | Decisão |
|---|---|---|---|---|
| CLI DEPLOY STAYCLOUD | https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/ | Usar a CLI do Deploy. | Complementar; mostra comando e retorno da CLI, não consulta de logs no painel. | Não duplicado. |
| PRIMEIRO DEPLOY STAYCLOUD | https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ | Fazer primeira publicação. | Complementar; mostra processamento inicial e logs ao vivo, mas não consulta de status/logs posterior. | Não duplicado. |
| DEPLOY STAYCLOUD NO PAINEL NOVO | https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/ | Localizar/ativar o produto. | Complementar; não ensina logs nem histórico. | Não duplicado. |
| Como gerenciar sua VPS com Docker | https://ajuda.staycloud.com.br/docs/como-gerenciar-sua-vps-com-docker/ | Logs de Docker/VPS. | Tema técnico diferente. | Não duplicado. |
| Como Verificar o Status dos Servidores da StayCloud | encontrado como artigo relacionado na base | Status geral de servidores. | Não é status de deploy de aplicação. | Não duplicado. |

## Obsidian

Resultados locais relacionados:

- Nota `Deploy StayCloud.md`: registra abas `Deployments` e `Logs` e mantém o tema como fila — não iniciado.
- Tutorial V2/12: cita `Logs de build` durante o primeiro deploy, mas deixa logs detalhados para tutorial separado.
- Pacote reprovado antigo `Como localizar a área de Deploy`: cita abas `Deployments` e `Logs`, mas foi reprovado e não cobre o fluxo real.
- Playbooks de logs de cPanel, VPS, Docker ou terminal: fora do novo produto Deploy.

## Decisão

Classificação: novo tutorial complementar.

Justificativa: o objetivo específico é ensinar como acompanhar o processamento, conferir o resultado e consultar mensagens ou logs de uma aplicação publicada pelo novo Deploy StayCloud. Esse objetivo não é coberto pela ideia genérica de desempenho, por logs de cPanel/VPS/Docker, nem pelos tutoriais já publicados de ativação, primeiro deploy e CLI.

## Validação do Painel

Cenário encontrado: Cenário A — existem status e logs oficiais.

Título escolhido: `Como consultar o status e os logs de um deploy na StayCloud`.

Recursos confirmados:

- Lista de projetos no produto `Cloud`.
- Página do projeto com `Visão geral`.
- Área `IMPLANTAÇÃO DE PRODUÇÃO`.
- Campo `status`.
- Estado observado `pronto`.
- Campo `duração`.
- Campo `fase`.
- Link `ver todos os deploys`.
- Aba `Deploys`.
- Aba `Logs`.
- Filtros de logs por `Todos`, `Info · OK`, `Alertas` e `Erros · Fatal`.
- Botões `atualizar`, `pausar`, `baixar log` e `Abrir`.

Recurso inexistente ou limitado:

- A tela informa que mostra logs de build.
- A própria interface informa que logs de runtime do site no ar ainda não aparecem nessa visão.

Decisão final: novo tutorial complementar.
