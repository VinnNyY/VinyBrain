# Decisoes do Projeto

## 2026-08-04 - Projeto separado

O Viny Watch foi criado como projeto independente dentro de `17 - Viny Flow/07 - Projetos/Viny Watch`, sem misturar com Tutoriais StayCloud, Legacy Doc, transcricoes, WordPress ou Viny Flow existente.

## 2026-08-04 - Codigo fora do vault

Codigo-fonte em `/home/vinicius-alves/Projetos/viny-watch` para evitar salvar sessao, banco real, logs e perfil de navegador dentro do Viny Brain.

## 2026-08-04 - Whitelist por padrao inicial

Modo padrao `whitelist` por seguranca. Apenas grupos explicitamente cadastrados entram na deteccao.

## 2026-08-04 - Alteracao para todos os grupos

O grupo do Joao foi confirmado como piloto inicial. O modo padrao passou para `all_groups`, mantendo `whitelist` apenas como opcao. Todo grupo novo encontrado na aba `Grupos` nasce monitorado, exceto ignorados ou desativados manualmente.

## 2026-08-04 - UNKNOWN nao bloqueia varredura

Observacoes `UNKNOWN` aparecem como revisao necessaria no painel, mas nao impedem alertas de grupos classificados como `INCOMING` ou `INCOMING_PROBABLE`.

## 2026-08-04 - Provider WhatsApp Web manual

O `WhatsAppWebAlertProvider` foi implementado somente para teste manual controlado. O envio automatico continua desativado. A primeira tentativa real foi bloqueada porque a validacao exata do destino nao encontrou uma unica ocorrencia com o texto `🚨 Alertas Grupos 🚨`. Nenhuma mensagem foi enviada.

## 2026-08-04 - Destino renomeado para Alertas Viny Watch

Vinicius renomeou o destino autorizado para `Alertas Viny Watch`. A configuracao foi atualizada para aceitar somente esse nome como destino de envio. Os nomes antigos permanecem apenas como aliases ignorados para limpeza/migracao, sem permissao de envio.

A tentativa manual apos a mudanca foi bloqueada por `whatsapp_groups_filter_not_found`, antes de abrir o grupo ou enviar mensagem.

## 2026-08-04 - Producao controlada

O grupo `Teste Viny Watch` foi removido da configuracao ativa porque nao existe. `Alertas Viny Watch` ficou definido exclusivamente como destino e ignorado pelo scanner.

Foi ativado `delivery.mode = production_guarded` com `automaticEnabled = true`, limites por ciclo/hora/grupo e kill switch. A validacao enviou um unico alerta real para `Alertas Viny Watch`, selecionando automaticamente o grupo elegivel com maior tempo aguardando.

## 2026-08-04 - Resolucao e backlog legado

A resolucao automatica passa a usar a lista lateral: quando um grupo com entrega real `sent` apresenta atividade posterior sem contador de nao lidas, a observacao entregue pode ser marcada como resolvida e exibida como `OUTGOING`, sem abrir o grupo monitorado.

O backlog legado passou a considerar tambem o horario exibido na lista em relacao a `productionActivatedAt`, nao apenas `firstSeenAt`. Essa decisao evita que observacoes antigas recriadas por varreduras posteriores sejam tratadas como novas entregas elegiveis.

Depois de uma segunda entrega real para `Gubs` durante a estabilizacao, `deliveryKillSwitch` foi mantido ativo ate validacao manual.

## 2026-08-04 - Escopo de envio real

O envio real foi liberado somente para `Alertas Viny Watch` via `production_guarded`. Nenhum grupo monitorado pode ser aberto ou receber mensagem. Alertas de backlog e casos `UNKNOWN` continuam sem envio automatico.
