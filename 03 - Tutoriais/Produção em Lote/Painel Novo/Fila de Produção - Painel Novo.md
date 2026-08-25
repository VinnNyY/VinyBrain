# Fila de Producao - Painel Novo

**Data da varredura:** 2026-07-15  
**Escopo desta atualizacao:** pesquisa e priorizacao. Nenhum tutorial, print, midia ou alteracao na base publica foi criado.

## Criterios usados

- A categoria publica `Painel novo` tem 18 artigos. Um assunto ja publicado nao entra como artigo novo.
- O proximo tema precisa preferir navegacao, consulta ou localizacao de informacoes no Painel Novo.
- Um fluxo que cria, altera, remove ou configura servico recebe risco tecnico maior e fica para depois.
- Todo item aprovado para producao ainda exige validacao do caminho real, telas limpas e dados sensiveis ocultos antes de redigir.
- `P0` = candidato ao proximo mini-lote; `P1` = fila de julho apos validacao; `P2` = manter em espera.

## 1. Novos tutoriais recomendados

## Fila Deploy — 2026-07-29

Meta atual após publicação do item 5: 12/12 tutoriais publicados e validados — CONCLUÍDA.

| Ordem | Tema | Objetivo | Tipo | Status | Risco |
|---|---|---|---|---|---|
| 1 | Como ativar o Deploy no Painel Novo da StayCloud | Localizar o produto, conferir status e iniciar a ativação pelo botão real `Começar grátis`. | novo tutorial | publicado e validado | Médio: clique final não foi executado; tutorial para antes da ativação real. |
| 2 | Como fazer o primeiro deploy na StayCloud | Publicar um projeto de teste seguindo o fluxo real após ativação. | novo tutorial complementar | publicado e validado | Médio/alto: criou aplicação pública descartável. |
| 3 | Como instalar e usar a CLI do Deploy StayCloud | Explicar a ferramenta `@staysdev/setup`, conectar o projeto com token temporário e publicar pelo terminal. | novo tutorial complementar | publicado e validado | Médio: envolve token temporário e projeto público descartável. |
| 4 | Como consultar os logs do Deploy StayCloud e acompanhar o status | Mostrar `Deploys` e `Logs` após projeto de teste, com limitação de runtime registrada. | novo tutorial complementar | publicado e validado | Baixo/médio: depende de deploy real e revisão de logs. |
| 5 | Como publicar uma nova versão pelo Deploy StayCloud | Alterar o projeto descartável já conectado, publicar novamente com `npx @staysdev/setup deploy` e confirmar a versão atualizada. | novo tutorial complementar | publicado e validado | Médio: deploy real em projeto descartável. |

Observação: os cinco tutoriais de Deploy foram publicados e validados. O ciclo mensal de 12 tutoriais está concluído.

Produção adicional em 2026-08-03: `Como configurar um domínio personalizado no Deploy StayCloud`, classificado como tutorial extra publicado e validado. Não altera a meta 12/12.

Publicação do item 1: https://ajuda.staycloud.com.br/docs/ativar-deploy-staycloud/ — BetterDocs ID 2885 — Rank Math 86/100.

Publicação do item 2: https://ajuda.staycloud.com.br/docs/primeiro-deploy-staycloud/ — BetterDocs ID 2896 — Rank Math 85/100 — 930 palavras — 6 prints — deploy real por `.zip` validado.

Publicação do item 3: https://ajuda.staycloud.com.br/docs/cli-deploy-staycloud/ — BetterDocs ID 2909 — Rank Math 85/100 — 992 palavras — 6 prints — CLI real `@staysdev/setup` validada. Meta atual: 10/12.

Publicação do item 4: https://ajuda.staycloud.com.br/docs/logs-do-deploy-staycloud/ — BetterDocs ID 2925 — Rank Math 80/100 — 997 palavras — 6 prints — status e logs de build validados. Meta atual: 11/12.

Publicação do item 5: https://ajuda.staycloud.com.br/docs/publicar-nova-versao-staycloud/ — BetterDocs ID 2937 — Rank Math 80/100 — 971 palavras — 7 prints — método real `npx @staysdev/setup deploy`. Meta atual: 12/12 — CONCLUÍDA.

Extra publicado: https://ajuda.staycloud.com.br/docs/dominio-personalizado-deploy-staycloud/ — BetterDocs ID 2962 — Rank Math 80/100 — 978 palavras no editor — 5 prints — fluxo real `Cloud > Domínios > Adicionar domínio`, registro `CNAME`. Não contado como 13/12.

Extra em preparação em 2026-08-10: `Como localizar os registros DNS no Painel Novo da StayCloud` — refatoração do rascunho pendente `Consultar DNS StayCloud em em 3 passos`, BetterDocs/Post ID 2999. Primeira fase local criada em V2/17, com auditoria de duplicação, SEO e preview. Publicação bloqueada até abrir o rascunho original, validar a aba `DNS` atual e substituir prints de apoio por capturas atuais. Não contado como 13/12.

## Meta restante de Vinicius — dois tutoriais publicados e validados

| Ordem | Tema | Prioridade | Status | Observação |
| --- | --- | --- | --- | --- |
| 1 | Como alterar a cota de armazenamento de uma conta de e-mail no Painel Novo | P0 | Recurso indisponível no Painel Novo validado | Não produzido. A validação completa exibiu Webmail, Resetar senha e Excluir, mas não exibiu ação de editar cota/armazenamento/limite. |
| 2 | Como excluir uma conta de e-mail no Painel Novo | P0 | Fila — não iniciado | Usar somente conta descartável. Exclusão final exige autorização explícita de Vinicius. |
| 3 | Como acessar o Webmail pelo Painel Novo | P1 | Publicado e validado | Fallback funcional executado em V2/10 após indisponibilidade real da cota no Painel Novo. BetterDocs ID 2877, Rank Math 88/100. |
| 4 | Como identificar o serviço correto antes de clicar em Gerenciar | P1 | Fila — não iniciado | Escopo de identificação e navegação. |
| 5 | Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo | P1 | Descartado — tema não aprovado | Vinicius não gostou do tema. Pasta preservada em `_Descartados`; não publicar e não reconstruir sem nova decisão explícita. |
| 6 | Como conferir qual domínio está vinculado a um serviço | P1 | Fila — não iniciado | Consulta somente; não alterar domínio. |

Nenhum item local conta na meta antes de publicação, URL pública validada, Rank Math mínimo 80 e revisão visual aprovada.

| Titulo sugerido | Tipo | Origem | URL antiga | URL parecida no Painel Novo | Prioridade | Complexidade | Risco de duplicacao | Risco tecnico | Usa cPanel? | 100% Painel Novo? | Prints necessarios | Marcacoes obrigatorias | Status | Motivo para aprovar ou descartar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Como identificar o servico certo antes de clicar em Gerenciar no Painel Novo da StayCloud | Duplicado | Lacuna ja coberta localmente | Nao se aplica | `como-encontrar-seus-servicos-ativos...` | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao produzir como URL nova | Nao produzir como URL nova | Duplicado em 2026-07-27 | O tutorial local de servicos ativos ja cobre servico correto, dominio, status e Gerenciar. |
| Como usar a busca geral do Painel Novo da StayCloud | Novo | Lacuna de navegacao pela busca superior geral | Nao se aplica | Nao encontrada duplicacao direta | P0 | Baixa | Baixo | Baixo | Nao | Sim | Barra de busca geral; resultados; resultado correto | Caixa na barra; caixa no primeiro resultado; dados da conta sanitizados | Publicado e validado em 2026-07-27 / Rank Math 85/100 / URL pública validada | Tema confirmado como novo: ensina a localizar sites, dominios, faturas ou chamados pela busca geral sem executar alteracoes. |
| Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | Novo | Lacuna de consulta, sem alterar cota | Nao se aplica | `como-criar-email-no-painel-novo` | P0 | Baixa | Baixo/medio: mesma area, objetivo diferente | Baixo | Nao | Sim | Servico; aba E-mails; linha da conta com uso/cota | Seta no servico; caixa na aba E-mails; retangulo na coluna de uso; blur do endereco | Aprovado visualmente / SEO completo / imagens sanitizadas / aguardando upload / HTML WordPress atualizado localmente | Dois prints com IP foram sanitizados em 2026-07-19. Nenhum artigo foi publicado. |
| Como localizar a Central de Ajuda pelo Painel Novo da StayCloud | Novo | Navegacao para autoatendimento | Nao se aplica | `como-localizar-area-suporte...` | P1 | Baixa | Medio: a Central de Ajuda aparece dentro de Suporte | Baixo | Nao | Sim | Menu Suporte; card/link Central de ajuda; pagina de destino | Seta no menu; caixa no card/link; destaque no campo de pesquisa | Pacote V2 criado / fluxo real validado / prints finais sanitizados / aguardando validação de Vinicius | Tema confirmado como jornada própria: abre a Central de ajuda e usa o campo de busca de tutoriais. Nenhum upload ou publicação foi executado. |
| Como usar a busca e os filtros da area de Dominios no Painel Novo da StayCloud | Novo | Lacuna de consulta em lista de dominios | Nao se aplica | `como-localizar-menu-dominios...` | P1 | Baixa | Medio: os controles aparecem no tutorial de menu | Baixo | Nao | Sim | Menu Dominios; campo de busca; filtro; resultado filtrado | Seta no menu; caixas no campo e filtro; destaque no resultado | Tutorial 03 criado em V2; imagens publicas vinculadas; aguardando validacao/publicacao | Tema confirmado como novo: objetivo proprio de busca, filtros e interpretacao de lista vazia/reduzida. Nenhuma acao de dominio executada. |
| Como conferir o dominio vinculado ao seu servico no Painel Novo da StayCloud | Duplicado/complementar | Conferencia ja coberta localmente | Nao se aplica | `como-encontrar-seus-servicos-ativos...` | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao produzir como URL nova | Nao produzir como URL nova | Duplicado em 2026-07-27 | O tutorial local de servicos ativos ja cobre dominio vinculado antes de gerenciar. Pode virar melhoria interna, nao artigo novo. |
| Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud | Novo | Lacuna de consulta de recursos no Painel Novo | Nao se aplica | `como-acessar-o-cpanel-painel-novo` | P1 | Baixa | Baixo | Baixo | Nao | Sim | Card do servico; botão Gerenciar; indicadores DISCO/CPU/MEMORIA | Um alvo principal por print; texto -> alvo -> tela seguinte validado | Publicado e validado em 2026-07-27 / Rank Math 81/100 / URL pública validada | Tema reconstruído do zero após reprovação do lote e publicado no BetterDocs ID 2865. |
| Como localizar a area de Deploy no Painel Novo da StayCloud | Novo | Lacuna de localizacao do Cloud/Deploy | Nao se aplica | `ferramentas-painel-staycloud` | P1 | Baixa | Baixo | Baixo | Nao | Sim | A reconstruir individualmente | Um alvo principal por print; não destacar botão de ativação | Reprovado — reconstrução individual necessária | Tema ainda pode ser útil, mas o pacote em lote foi retirado por marcações incorretas. |
| Como consultar o status de uma fatura no Painel Novo da StayCloud | Novo | Possivel recorte de consulta financeira | Nao se aplica | `consultar-faturas-staycloud` | P2 | Baixa | Alto: o artigo publicado ja cobre faturas e status | Baixo | Nao | Sim | Area Faturas; lista; badge de status | Seta em Faturas; caixa no status; blur de valores e identificadores | Descartar salvo lacuna comprovada | Nao produzir como novo. Manter somente para decidir se vira melhoria do artigo existente. |
| Como saber quando abrir chamado ou reportar um bug no Painel Novo da StayCloud | Novo | Duvida de navegacao de suporte | Nao se aplica | `abrir-ticket...` e `reportar-bug...` | P2 | Baixa | Alto: dois artigos publicados cobrem os destinos | Baixo | Nao | Sim | Area Suporte; card Abrir chamado; card Reportar bug | Numeracao nos dois caminhos; caixa no titulo de cada card | Descartar salvo lacuna comprovada | Tema util, mas tende a virar duplicacao ou artigo de orientacao editorial. |
| Como localizar as opcoes Registrar dominio e Transferir dominio no Painel Novo da StayCloud | Novo | Navegacao comercial de dominios | Nao se aplica | `como-acessar-area-adicionar-dominios...` e `comprar-dominio...` | P2 | Baixa | Alto | Baixo | Nao | Sim | Menu Dominios; topo da pagina; duas opcoes | Seta no menu; numeracao e caixas nas duas opcoes | Descartar | As opcoes ja aparecem no material local de Dominios e se sobrepoem ao artigo publicado de compra. |

## 2. Tutoriais antigos para refatorar para Painel Novo

| Titulo sugerido | Tipo | Origem | URL antiga | URL parecida no Painel Novo | Prioridade | Complexidade | Risco de duplicacao | Risco tecnico | Usa cPanel? | 100% Painel Novo? | Prints necessarios | Marcacoes obrigatorias | Status | Motivo para aprovar ou descartar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Como alterar a senha de e-mail no Painel Novo da StayCloud | Refatoracao | Como alterar senha de e-mail pelo Painel do Cliente StayCloud | https://ajuda.staycloud.com.br/docs/alterar-senha-de-e-mail/ | `como-criar-email-no-painel-novo` | P0 | Media | Baixo | Medio: altera uma credencial | Nao | Sim, fluxo validado no Painel Novo | Servico; aba E-mails; conta; tela de redefinicao | Seta no servico e aba; destaque em Resetar senha; blur total da senha | Publicado e validado em 2026-07-28 / Rank Math 87/100 / URL pública validada | Forte demanda recorrente. Refatoração publicada no BetterDocs ID 2099 preservando slug `alterar-senha-de-e-mail`. |
| Como encontrar dados do servidor no Painel Novo da StayCloud | Refatoracao | Como encontrar dados do servidor na StayCloud em 3 Passos | https://ajuda.staycloud.com.br/docs/dados-servidor-staycloud/ | `localizar-acessos-staycloud` e `encontrar-informacoes-de-seu-servidor` | P1 | Media | Medio: ha dois artigos proximos | Medio | Nao | Sim, se IP e nameservers estiverem no painel | Servico; Acessos; bloco de dados | Seta em Acessos; caixas em cada dado; blur de IP/usuario quando necessario | A validar no painel | Refatorar e consolidar, nao criar URL concorrente. Exige distinguir informacao de servidor de credenciais. |
| Como acessar o WordPress pelo Painel Novo da StayCloud | Refatoracao | Como acessar seu WordPress dentro da StayCloud - 2026 | https://ajuda.staycloud.com.br/docs/acessar-wordpress-staycloud-2026/ | `como-acessar-o-cpanel-painel-novo` | P1 | Media | Medio | Medio | Nao, se houver atalho nativo | Condicionado | Dashboard; servico; atalho WordPress; tela de destino | Caixa no servico; seta no atalho; blur do dominio | A validar no painel | Aprovar somente se houver acesso direto e estavel pelo Painel Novo; nao transformar em guia de cPanel. |
| Como escolher Upgrade ou Downgrade de hospedagem no Painel Novo da StayCloud | Refatoracao | Upgrade e Downgrade de Hospedagem - StayCloud 2025 | https://ajuda.staycloud.com.br/docs/upgrade-e-downgrade-staycloud/ | `staycloud-upgrade-plano` | P1 | Media | Alto: existem duas versoes antigas | Medio | Nao | Sim | Servico; acao Upgrade/Downgrade; lista de planos; aviso antes da confirmacao | Seta no botao; caixa no plano; aviso destacado sobre recursos e cobranca | A validar no painel | Atualizar uma unica pagina, sem prometer preco, prorata ou disponibilidade sem validacao atual. |
| Como criar um subdominio pelo Painel Novo da StayCloud | Refatoracao | Tutorial para Criar um Subdominio no StayPanel | https://ajuda.staycloud.com.br/docs/tutorial-para-criar-um-subdominio-no-staypanel/ | `como-adicionar-dominio-no-staypanel` | P1 | Media | Medio | Medio | Nao | Condicionado | Dominios; opcao de subdominio; formulario; confirmacao | Setas no caminho; caixas em cada campo; aviso de conferir escrita | A validar no painel | Pode ser simples se a acao estiver no painel; descartar se exigir cPanel ou DNS manual. |
| Como adicionar um dominio pelo Painel Novo da StayCloud | Refatoracao | Tutorial para Adicionar um Dominio no StayPanel | https://ajuda.staycloud.com.br/docs/tutorial-para-adicionar-um-dominio-no-staypanel/ | `como-adicionar-dominio-no-staypanel` e material local de Dominios | P1 | Media | Alto | Medio | Nao | Sim | Dominios; Registrar dominio; busca; revisao antes de concluir | Seta no menu; caixa no botao; destaque na revisao do nome | A validar no painel | Nao criar uma segunda URL. Consolidar o artigo publicado e separar claramente registrar de transferir. |
| Como acompanhar seus chamados no Painel Novo da StayCloud | Refatoracao | Como acompanhar os chamados pelo painel StayCloud | https://ajuda.staycloud.com.br/docs/acompanhar-chamados-staycloud/ | `abrir-ticket-no-painel-staycloud` | P0 | Baixa | Medio | Baixo | Nao | Sim | Suporte; Meus chamados; lista; detalhe/status | Seta no menu; caixa em Meus chamados; retangulo no status | Conteúdo reconstruído / imagens públicas validadas / HTML limpo / rascunho WordPress criado / prévia real validada / aguardando autorização para publicação | Preservar a URL pública existente. O rascunho 2817 foi validado, mas nenhum artigo foi publicado. |
| Como consultar faturas no Painel Novo da StayCloud | Refatoracao | Como consultar faturas no painel StayCloud | https://ajuda.staycloud.com.br/docs/consultar-faturas-staycloud/ | `adicionar-cartao-staycloud` | P1 | Baixa | Alto: pagina ja e do Painel Novo | Baixo | Nao | Sim | Faturas; lista; detalhe; status | Seta na area; caixas em status e vencimento; blur de valores/identificadores | A validar no painel | Refino editorial e visual de artigo existente, sem nova URL e sem acao de pagamento. |

## 3. Tutoriais ja existentes no Painel Novo, nao duplicar

| Titulo sugerido | Tipo | Origem | URL antiga | URL parecida no Painel Novo | Prioridade | Complexidade | Risco de duplicacao | Risco tecnico | Usa cPanel? | 100% Painel Novo? | Prints necessarios | Marcacoes obrigatorias | Status | Motivo para aprovar ou descartar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Como encontrar seus servicos ativos no Painel Novo da StayCloud | Existente | Referencia local aprovada | Nao se aplica | Local: Lote 02B - Piloto | P0 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Referencia de estrutura e tom. |
| Como localizar a area de Suporte no Painel Novo da StayCloud | Existente | Referencia local aprovada | Nao se aplica | Local: Unitarios/Suporte | P0 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Referencia de navegacao e marcacao. |
| Como acessar a area para adicionar dominios no Painel Novo da StayCloud | Existente | Referencia local aprovada | Nao se aplica | Local: Unitarios/Adicionar dominios | P0 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Referencia de fluxo de Dominios. |
| Upgrade/downgrade | Existente | Base publica | https://ajuda.staycloud.com.br/docs/upgrade-e-downgrade-staycloud/ | Mesma URL | P1 | Media | Alto | Medio | Nao | Parcial | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Ha tambem versao antiga em `staycloud-upgrade-plano`. |
| Contas de Email / Criar e-mails | Existente | Base publica | https://ajuda.staycloud.com.br/docs/como-criar-conta-de-email-no-staypanel/ | https://ajuda.staycloud.com.br/docs/como-criar-email-no-painel-novo/ | P1 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Criacao ja coberta; qualquer novo item deve ser somente consulta comprovadamente distinta. |
| Adicionar Dominios | Existente | Base publica | https://ajuda.staycloud.com.br/docs/como-adicionar-dominio-no-staypanel/ | https://ajuda.staycloud.com.br/docs/comprar-dominio-staycloud/ | P1 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Sobreposicao com registrar/comprar dominio e com referencia local. |
| Alterar nameservers | Existente | Base publica | https://ajuda.staycloud.com.br/docs/alterar-nameservers-staycloud/ | Mesma URL | P2 | Alta | Alto | Alto | Nao | Sim | Nao se aplica | Nao se aplica | Manter para depois | Tema de DNS sensivel. |
| Localizar arquivos | Existente | Base publica | https://ajuda.staycloud.com.br/docs/localizar-arquivos-staycloud/ | Mesma URL | P1 | Media | Alto | Medio | Pode envolver | Parcial | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Nao tratar como navegacao simples se abrir cPanel. |
| Reportar bug | Existente | Base publica | https://ajuda.staycloud.com.br/docs/reportar-bug-staycloud/ | Mesma URL | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Ja cobre o destino de suporte especifico. |
| Comprar dominio | Existente | Base publica | https://ajuda.staycloud.com.br/docs/comprar-dominio-staycloud/ | Mesma URL | P1 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Acao comercial; conferir antes de concluir. |
| Consultar faturas | Existente | Base publica | https://ajuda.staycloud.com.br/docs/consultar-faturas-staycloud/ | Mesma URL | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Candidato de melhoria visual. |
| Acompanhar chamados | Existente | Base publica | https://ajuda.staycloud.com.br/docs/acompanhar-chamados-staycloud/ | Mesma URL | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar, nao duplicar | Candidato de melhoria visual. |
| Adicionar cartao | Existente | Base publica | https://ajuda.staycloud.com.br/docs/adicionar-cartao-staycloud/ | Mesma URL | P2 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Evitar qualquer captura ou instrucao com dados de pagamento. |
| Adicionar colaborador | Existente | Base publica | https://ajuda.staycloud.com.br/docs/adicionar-colaborador-staycloud/ | Mesma URL | P2 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Envolve permissoes e acesso a conta. |
| Abrir ticket | Existente | Base publica | https://ajuda.staycloud.com.br/docs/abrir-ticket-no-painel-staycloud/ | Mesma URL | P1 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Ja cobre abertura de chamado. |
| Localizar acessos | Existente | Base publica | https://ajuda.staycloud.com.br/docs/localizar-acessos-staycloud/ | Mesma URL | P1 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar apenas se necessario | Exige tratamento visual de dados sensiveis. |
| Localizar ferramentas | Existente | Base publica | https://ajuda.staycloud.com.br/docs/ferramentas-painel-staycloud/ | Mesma URL | P2 | Baixa | Alto | Baixo | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Tema amplo; evitar fragmentar em varios artigos pequenos sem lacuna comprovada. |
| Solicitar plugin Premium | Existente | Base publica | https://ajuda.staycloud.com.br/docs/solicitar-plugin-premium-staycloud/ | Mesma URL | P2 | Media | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Nao duplicar | Fluxo condicionado a regras comerciais e autorizacao. |
| Encontrar o PIN | Existente | Base publica | https://ajuda.staycloud.com.br/docs/como-encontrar-o-pin-no-novo-painel/ | Mesma URL | P1 | Baixa | Alto | Medio | Nao | Sim | Nao se aplica | Nao se aplica | Refatorar apenas se necessario | Nao expor o PIN em imagens ou texto. |
| Acessar o cPanel | Existente | Base publica | https://ajuda.staycloud.com.br/docs/como-acessar-o-cpanel-painel-novo/ | Mesma URL | P2 | Media | Alto | Medio | Sim | Nao | Nao se aplica | Nao se aplica | Manter para depois | Fora do foco de jornada 100% Painel Novo. |

## 4. Temas tecnicos para deixar para depois

| Titulo sugerido | Tipo | Origem | URL antiga | URL parecida no Painel Novo | Prioridade | Complexidade | Risco de duplicacao | Risco tecnico | Usa cPanel? | 100% Painel Novo? | Prints necessarios | Marcacoes obrigatorias | Status | Motivo para aprovar ou descartar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Como alterar nameservers no Painel StayCloud | Refatoracao futura | Artigo publicado | https://ajuda.staycloud.com.br/docs/alterar-nameservers-staycloud/ | Mesma URL | P2 | Alta | Alto | Alto | Nao | Sim | Dominio; nameservers; confirmacao; propagacao | Aviso de risco; caixas nos campos; confirmacao destacada | Em espera | Pode interromper o site ou e-mail se houver erro. |
| Como apontar dominio para StayCloud | Refatoracao futura | Artigo de DNS | https://ajuda.staycloud.com.br/docs/como-apontar-dominio-para-staycloud/ | Nao ha equivalente 100% interno | P2 | Alta | Medio | Alto | Nao | Nao | Painel; registrador externo; DNS; validacao | Numeracao; avisos de propagacao; caixas nos registros | Em espera | Depende de sistema externo e alteracao real de DNS. |
| Como acessar e usar o cPanel | Refatoracao futura | Artigo publicado | https://ajuda.staycloud.com.br/docs/como-acessar-o-cpanel-painel-novo/ | Mesma URL | P2 | Media | Alto | Medio | Sim | Nao | Servico; atalho; cPanel | Seta no atalho; blur de dados | Em espera | Nao e 100% Painel Novo. |
| Como configurar filtros ou encaminhamentos de e-mail | Refatoracao futura | Artigos de e-Mail/cPanel | https://ajuda.staycloud.com.br/docs/como-configurar-encaminhadores-no-cpanel/ | Nao ha equivalente simples confirmado | P2 | Alta | Medio | Alto | Sim | Nao | Conta; regras; confirmacao | Aviso de efeito no recebimento; caixas nos campos | Em espera | Configuracao tecnica e com risco de perda ou desvio de mensagens. |
| Como gerar ou corrigir SSL | Refatoracao futura | Artigos cPanel/Cloudflare | https://ajuda.staycloud.com.br/docs/como-gerar-certificados-ssl-gratuitos/ | Nao ha equivalente simples confirmado | P2 | Alta | Medio | Alto | Geralmente | Nao | Dominio; certificado; status; avisos | Avisos de risco e status; caixas nos campos | Em espera | Fluxo tecnico, com dependencias de DNS e historico de reprovacao local. |

## 5. Temas descartados/reprovados

| Titulo sugerido | Tipo | Origem | URL antiga | URL parecida no Painel Novo | Prioridade | Complexidade | Risco de duplicacao | Risco tecnico | Usa cPanel? | 100% Painel Novo? | Prints necessarios | Marcacoes obrigatorias | Status | Motivo para aprovar ou descartar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Como localizar a area de Adicionar Dominios | Novo | Fila anterior | Nao se aplica | Referencia local de Adicionar Dominios | P2 | Baixa | Alto | Baixo | Nao | Sim | Nao produzir | Nao produzir | Descartado | Ja existe referencia local pronta com o mesmo fluxo. |
| Como localizar a area de Contas de E-mail | Novo | Fila anterior | Nao se aplica | `como-criar-email-no-painel-novo` | P2 | Baixa | Alto | Baixo | Nao | Sim | Nao produzir | Nao produzir | Descartado | A navegacao ja integra o artigo publicado de criacao de e-mail. |
| Como localizar Upgrade/Downgrade | Novo | Fila anterior | Nao se aplica | `upgrade-e-downgrade-staycloud` | P2 | Baixa | Alto | Medio | Nao | Sim | Nao produzir | Nao produzir | Descartado como novo | O tema tem artigo publicado; tratar apenas como refatoracao. |
| Como localizar o botao Gerenciar | Novo | Fila anterior | Nao se aplica | Referencia local de servicos ativos | P2 | Baixa | Alto | Baixo | Nao | Sim | Nao produzir isoladamente | Nao produzir isoladamente | Descartado como artigo isolado | So pode sobreviver como parte de um tema que resolva uma lacuna concreta. |
| Como alterar armazenamento de e-mails | Novo | Lote local reprovado | Nao se aplica | Nao ha fluxo simples confirmado | P2 | Alta | Medio | Alto | Pode envolver | Nao | Nao produzir | Nao produzir | Reprovado | O painel nao exibiu alteracao direta e o tema e tecnico. |
| Como criar filtros de e-mail | Novo | Lote local reprovado | Nao se aplica | Nao ha fluxo simples confirmado | P2 | Alta | Medio | Alto | Sim | Nao | Nao produzir | Nao produzir | Reprovado | Exige cPanel e configuracao sensivel. |
| Como gerar certificados SSL gratuitos | Novo | Lote local reprovado | Nao se aplica | Nao ha fluxo simples confirmado | P2 | Alta | Medio | Alto | Geralmente | Nao | Nao produzir | Nao produzir | Reprovado | Fluxo tecnico e fora da fase atual. |
| Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud | Novo | Lote reprovado em 2026-07-27 | Nao se aplica | `como-acessar-o-cpanel-painel-novo` | P1 | Baixa | Baixo | Baixo | Nao | Sim | Reconstrução individual concluída em V2/07 | Um alvo principal por print | Lote reprovado preservado para auditoria | Pasta preservada em `_Lotes Reprovados/Lote Reprovado - Marcações Incorretas - 2026-07-27-16-26/`; versão unitária publicada e validada. |
| Como localizar a area de Deploy no Painel Novo da StayCloud | Novo | Lote reprovado em 2026-07-27 | Nao se aplica | `ferramentas-painel-staycloud` | P1 | Baixa | Baixo | Baixo | Nao | Sim | Reconstruir individualmente | Um alvo principal por print | Reprovado — aguardando produção individual | Pasta preservada em `_Lotes Reprovados/Lote Reprovado - Marcações Incorretas - 2026-07-27-16-26/`. |
| Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo da StayCloud | Novo complementar tentado | Validação unitária de 2026-07-28 | Nao se aplica | Nao se aplica | P1 | Baixa | Baixo | Baixo | Nao | Sim | Nao publicar | Nao reconstruir sem nova decisão explícita | Descartado — tema não aprovado | Vinicius não gostou do tema. O pacote saiu da área ativa e foi preservado em `_Descartados`. |

## 6. Meta Julho - acompanhamento dos 12 tutoriais

| Indicador | Quantidade | Situacao |
| --- | ---: | --- |
| Meta de julho | 12 | Definida |
| Conteúdo local criado | 7/12 | Uso de e-mail; acompanhar chamados; busca e filtros em Dominios; Central de Ajuda; busca geral do Painel Novo; disco, CPU e RAM; alteração de senha de e-mail |
| Rascunhos validados no WordPress | 1/12 | Acompanhar chamados |
| Adicionados aos modelos aprovados | 2/12 | Uso de e-mail; acompanhar chamados |
| Tutoriais liberados para proxima validacao de fluxo | 2 | Consultar uso de e-mail; acompanhar chamados (refatoracao) |
| Refatoracoes prioritarias em espera | 8 | Dependem de escolha e validacao do caminho real |
| Temas tecnicos em espera | 5 | Fora da rodada inicial |
| Tutoriais publicados | 5/12 | Central de Ajuda; busca geral do Painel Novo; disco, CPU e RAM; alterar senha de e-mail; Webmail StayCloud pelo Painel Novo |
| Progresso da meta | 12/12 publicados e validados | Meta concluída somente com URLs públicas, SEO e pós-publicação registrados. Pacotes locais e reprovados não contam na meta. |
| Tutorial em validação individual | 0 | Nenhum tutorial ativo após o fechamento. |
| Meta restante publicada | 0 | Meta mensal concluída. |

### Ordem sugerida para preencher a meta

1. Produzir os dois itens do mini-lote apos aprovacao.
2. Validar os tres proximos itens P1 de consulta/navegacao sem acao sensivel.
3. Refatorar uma pagina existente por vez, sem criar URL concorrente.
4. Reavaliar o total somente apos cada tutorial passar pela revisao local.

## Evidencias da varredura

- Categoria publica Painel Novo: https://ajuda.staycloud.com.br/ajuda-category/painel-novo/
- Inventario local: [Painel Novo - Inventario de Tutoriais](/home/vinicius-alves/Viny%20Brain/03%20-%20Tutoriais/Produ%C3%A7%C3%A3o%20em%20Lote/Painel%20Novo%20-%20Invent%C3%A1rio%20de%20Tutoriais.md)
- Referencias aprovadas: [Tutorial Referencia - Painel Novo](/home/vinicius-alves/Viny%20Brain/03%20-%20Tutoriais/Estudos%20de%20Padr%C3%A3o%20StayCloud/Tutorial%20Refer%C3%AAncia%20-%20Painel%20Novo.md)
