# Auditoria de Tutoriais do Deploy

Data: 2026-07-29

Escopo: auditoria da aba `Tutoriais`, categoria pública `Painel novo`, base pública completa da Central de Ajuda e Obsidian local antes de iniciar a documentação do novo sistema de Deploy/Cloud no Painel Novo.

| Tema candidato | Planilha | Base pública | Obsidian | Sobreposição | Decisão | Justificativa |
|---|---|---|---|---|---|---|
| Como ativar o Deploy no Painel Novo da StayCloud | Não há título direto. Há temas de Painel Novo, domínio, cPanel, arquivos, faturas e serviços. | Não há artigo direto na categoria Painel Novo. Há artigos que usam "deploy" em contexto cPanel/VPS/EasyPanel/Coolify. | Há pacote reprovado `Como localizar a área de Deploy...`, sem publicação. | Parcial com artigo amplo `ferramentas-painel-staycloud` e com pacote local reprovado de localização. | novo tutorial | A interface atual confirma produto próprio `Deploy`/`Cloud`, status `cloud ainda não ativo` e botão `Começar grátis`. O objetivo é ativação/preparação, não só localização. |
| Como fazer o primeiro deploy na StayCloud | Não encontrado como tutorial de Painel Novo. | Existe `Como hospedar um site de desenvolvimento próprio na StayCloud`, mas é fluxo cPanel/arquivos/DNS, não Cloud. | Vídeo e tela citam `Como fazer seu primeiro deploy`; ainda sem tutorial local aprovado. | Média: intenção de publicar projeto, mas produto e fluxo são diferentes. | novo tutorial | Aprovar apenas após validar criação de projeto sem afetar produção. Não iniciado nesta execução. |
| Como instalar e usar a CLI do Deploy StayCloud | Não encontrado. | Base pública cita CLI/terminal em VPS e Docker, mas não CLI StayCloud. | Tela real mostra comando `npx @staysdev/setup init`; ainda sem nota técnica completa. | Baixa/média com artigos técnicos de VPS. | pendente de validação do produto | CLI existe visualmente na tela, mas uso, comandos e limites precisam validação antes de tutorial. |
| Como configurar um domínio em um projeto do Deploy | Planilha tem vários temas de domínio/nameserver. | Há artigos de domínio, DNS, cPanel e Cloudflare. | Painel mostra aba `Domínios`, mas conta ainda não ativa. | Alta com conteúdo de domínio existente, embora produto seja diferente. | pendente de validação do produto | Só aprovar se a aba `Domínios` do Cloud tiver fluxo próprio e distinto de DNS/cPanel. |
| Como configurar variáveis de ambiente no Deploy | Não encontrado. | Base pública tem EasyPanel com variáveis de ambiente, não Cloud StayCloud. | Não validado no painel porque Cloud não foi ativado. | Média com EasyPanel. | pendente de validação do produto | Recurso não confirmado na interface atual antes da ativação. |
| Como consultar logs e status de um deploy | Não encontrado. | Há artigos de logs/VPS/Docker, sem Cloud StayCloud. | Aba `Logs` confirmada, mas sem deploy ativo. | Média com VPS/Docker. | pendente de validação do produto | Aba existe; conteúdo real precisa de projeto/deploy de teste validado. |
| Como atualizar ou refazer o deploy de uma aplicação | Não encontrado. | Base pública tem deploy genérico em VPS/cPanel. | Não validado. | Média com artigos de publicação/manutenção. | pendente de validação do produto | Só aprovar se houver ação de redeploy/atualização no Cloud. |
| Como excluir ou desativar um projeto do Deploy | Não encontrado. | Não há artigo direto. | Não validado. | Baixa. | descartar | Ação destrutiva; deixar para última fase e apenas com projeto descartável. |

## Resultados Relacionados Na Planilha

- Total lido na aba `Tutoriais`: 32 linhas preenchidas de tutorial/ideia, além do cabeçalho e uma linha em branco.
- Resultado direto para `Deploy`: nenhum.
- Resultados por sobreposição semântica:
  - `Como acessar o cPanel no painel novo da StayCloud`: pode tangenciar publicação via cPanel, mas não cobre Cloud/Deploy.
  - `como comprar dominio no painel novo da StayCloud`: tangencia domínio.
  - `como alterar os nameservers no painel novo da StayCloud`: tangencia DNS/domínio.
  - `como localizar os arquivos no novo painel da StayCloud`: tangencia publicação por arquivos.
  - `Como encontrar seus serviços ativos no Painel Novo da StayCloud`: tangencia localização de produtos no painel.
  - `Como adicionar um domínio no StayPanel`: tangencia domínio.
  - `Como fazer upgrade/downgrade no StayPanel`: tangencia plano/contratação.
  - `Busca e Filtros de dominios`: tangencia domínio.
  - `Consultar DNS pelo painel StayCloud`: ideia pendente relacionada a DNS.
  - `Acompanhar desempenho pelo painel StayCloud`: tangencia métricas/status.

## Resultados Relacionados Na Base Pública

- Categoria `Painel novo`: não há artigo direto de Deploy/Cloud na listagem pública.
- Base completa:
  - `Como hospedar um site de desenvolvimento próprio na StayCloud`: fala em deploy, mas usa cPanel, `public_html`, upload ZIP, MySQL e DNS. Decisão: complementar/sem duplicação direta.
  - `O que é EasyPanel? O Guia Completo para sua VPS`: fala em deploy automático, GitHub, Docker e variáveis. Decisão: complementar; produto diferente.
  - `Como acessar o Coolify`: fala em deploy via GitHub/GitLab/Docker Compose. Decisão: complementar; produto diferente.
  - `Como acessar Easypanel`: fala em deploy de projetos com containers. Decisão: complementar; produto diferente.
  - `Como gerenciar sua VPS com Docker`: fala em deploy, containers e logs. Decisão: complementar; produto diferente.

## Resultados Relacionados No Obsidian

- `03 - Tutoriais/Produção em Lote/Painel Novo/_Lotes Reprovados/.../08 - Como localizar a área de Deploy no Painel Novo da StayCloud`: pacote reprovado por marcações incorretas; não publicado.
- `03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md`: registra `Como localizar a área de Deploy...` como tema novo, aguardando reconstrução individual.
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - BACKLOG DE IDEIAS.md`: registra Deploy como tema novo reprovado em lote e pendente de produção unitária.
- Não foi encontrado conteúdo local aprovado/publicado que concorra com a ativação do Cloud/Deploy.
