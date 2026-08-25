# Auditoria de Duplicação

Data: 2026-07-29

## Planilha

A aba `Tutoriais` foi lida em modo somente leitura. Foram encontrados 34 registros preenchidos.

Resultados relacionados:

| Título | Link | Status | Autor | Objetivo | Sobreposição |
|---|---|---|---|---|---|
| Como ativar o Deploy no Painel Novo da StayCloud | https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/ | Postado | Vini | Localizar/ativar o produto Deploy | Complementar; não ensina CLI. |
| Como fazer o primeiro deploy na StayCloud | https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ | Postado | Vini | Publicar por upload de `.zip` | Complementar; cita CLI como fora do escopo. |

Não foi encontrado tutorial publicado ou planejado na planilha com o mesmo objetivo de instalar/usar a CLI do Deploy StayCloud.

## Base pública

Buscas feitas na categoria `Painel novo` e na busca pública da Central de Ajuda por `CLI Deploy StayCloud`, `comando Deploy StayCloud` e termos relacionados.

Resultados relevantes:

| Artigo | URL | Objetivo | Sobreposição | Decisão |
|---|---|---|---|---|
| Como fazer o primeiro deploy na StayCloud | https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ | Primeiro deploy por upload `.zip` | Complementar; não cobre CLI | manter novo tutorial |
| Como ativar o Deploy no Painel Novo da StayCloud em 4 passos | https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/ | Ativação/localização do Deploy | Complementar | manter novo tutorial |
| Artigos de Docker, Coolify, SSH e EasyPanel | URLs diversas | Terminal/VPS genéricos | Fluxos diferentes do novo Deploy | não duplicam |

## Obsidian

Resultados locais relevantes:

- Nota `Deploy StayCloud.md`: registrava `npx @staysdev/setup init` como ponto pendente de validação.
- Auditoria geral de Deploy: classificava o tema de CLI como pendente de validação do produto.
- Tutorial V2/12: citava `Deploy via CLI` como fora do escopo.

## Decisão

Classificação: novo tutorial complementar.

O tema não duplica ativação nem primeiro deploy por `.zip`. O tutorial atual ensina o fluxo próprio de terminal usando o pacote oficial `@staysdev/setup`, comando gerado no painel e deploy validado por CLI.
