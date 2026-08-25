# Painel Operacional - Viny Brain

Painel central para leitura rápida do estado atual do `Viny Brain`.

## Estado atual

- [[14 - Histórico Codex/Checkpoint Atual|Checkpoint Atual]]
- [[14 - Histórico Codex/Sessões/2026-07-02|Histórico do dia]]
- [[17 - Viny Flow/README|Viny Flow]]
- [[13 - Base de Conhecimento/00 - Índice/Índice Geral|Base de Conhecimento]]
- [[03 - Tutoriais/Modo Tutorial StayCloud|Tutoriais StayCloud]]
- [[00 - Mapas/MOC - Tutoriais StayCloud|MOC - Tutoriais StayCloud]]
- [[16 - Estudos e Ferramentas/ECC/Diagnóstico - ECC|Estudos e Ferramentas]]
- [[17 - Viny Flow/05 - Inteligência do Cérebro/README|Inteligência do Cérebro]]
- [[17 - Viny Flow/06 - Auditorias de Governança/README|Auditorias de Governança]]

## Próxima ação recomendada

- Tarefa atual: Weekly Suporte de 03/08/2026 processada e registrada.
- Próximo passo: Vinicius validar apresentador principal, Fael/Rafael, KPIs e prazo de início obrigatório do novo fluxo.
- Pendências: conferir pontos incertos da transcrição e decidir se os payloads locais devem ser enviados manualmente para Notion/ClickUp em outra sessão.
- Relatório: [[19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18|Weekly - Suporte - 2026-08-03 - 16-18]].
- PDF: [[19 - Reuniões/03 - PDFs/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.pdf|PDF final da Weekly]].
- Risco / atenção: WHMCS Finder foi apenas registrado como ferramenta/projeto citado; nenhum projeto foi iniciado.
- Última decisão tomada: manter Notion e ClickUp apenas com payloads locais, sem envio real e sem `--apply`.

## Atalhos principais

- [[00 - Mapas/MOC - Codex|MOC - Codex]]
- [[17 - Viny Flow/README|README do Viny Flow]]
- [[17 - Viny Flow/01 - Agentes/Mapa de Agentes|Mapa de Agentes]]
- [[17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain|Agente Governança do Viny Brain]]
- [[17 - Viny Flow/02 - Workflows/Mapa de Workflows|Mapa de Workflows]]
- [[17 - Viny Flow/02 - Workflows/Auditar Governança do Viny Brain|Auditar Governança do Viny Brain]]
- [[17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis|Comandos Reutilizáveis]]
- [[17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis|/auditar-governanca]]
- [[19 - Reuniões/00 - Índice de Reuniões|Índice de Reuniões]]
- [[13 - Base de Conhecimento/00 - Índice/Índice Geral|Índice Geral]]
- [[13 - Base de Conhecimento/00 - Índice/Mapa por Temas|Mapa por Temas]]

## Viny Flow

### Workflows principais

- [[17 - Viny Flow/02 - Workflows/Formatar Reunião de Suporte|Formatar Reunião de Suporte]]
- [[17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud|Criar Tutorial StayCloud]]
- [[17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud|Revisar Tutorial StayCloud]]
- [[17 - Viny Flow/02 - Workflows/Importar Playbooks|Importar Playbooks]]
- [[17 - Viny Flow/02 - Workflows/Auditar Playbooks|Auditar Playbooks]]
- [[17 - Viny Flow/02 - Workflows/Criar Relatório|Criar Relatório]]
- [[17 - Viny Flow/02 - Workflows/Revisar Texto|Revisar Texto]]
- [[17 - Viny Flow/02 - Workflows/Fechamento de Sessão|Fechamento de Sessão]]
- [[17 - Viny Flow/02 - Workflows/Auditar Contexto|Auditar Contexto]]
- [[17 - Viny Flow/02 - Workflows/Quality Gate - Validar Entrega|Quality Gate - Validar Entrega]]
- [[17 - Viny Flow/02 - Workflows/Revisão de Segurança|Revisão de Segurança]]
- [[17 - Viny Flow/02 - Workflows/Extrair Aprendizados da Sessão|Extrair Aprendizados da Sessão]]
- [[17 - Viny Flow/02 - Workflows/Auditar Skills, Agents e Workflows|Auditar Skills, Agents e Workflows]]

### Inteligência do Cérebro

- [[17 - Viny Flow/05 - Inteligência do Cérebro/README|README]]
- [[17 - Viny Flow/05 - Inteligência do Cérebro/02 - Mapa de Métodos|Mapa de Métodos]]
- [[17 - Viny Flow/05 - Inteligência do Cérebro/11 - Backlog de Melhorias do Cérebro|Backlog de Melhorias do Cérebro]]

### Integrações

- [[18 - Integrações/README|Integrações]]
- [[18 - Integrações/API/README|API segura]]
- [[17 - Viny Flow/02 - Workflows/Enviar Demanda para ClickUp|Enviar Demanda para ClickUp]]
- [[17 - Viny Flow/02 - Workflows/Registrar Reunião no Notion|Registrar Reunião no Notion]]
- [[17 - Viny Flow/02 - Workflows/Transformar Reunião em Demandas|Transformar Reunião em Demandas]]
- [[17 - Viny Flow/02 - Workflows/Sincronizar Decisões Operacionais|Sincronizar Decisões Operacionais]]
- [[17 - Viny Flow/02 - Workflows/Auditar Integrações|Auditar Integrações]]

### Integrações API

- Fase atual: `API segura / testes / dry-run / sem criação real`.
- Fase técnica segura em modo de autenticação e dry-run.
- Credenciais reais ficam fora do vault em `/home/vinicius-alves/.config/viny-integrations/.env`.
- Scripts locais: `test_notion_connection.py`, `test_clickup_connection.py`, `dry_run_notion_page.py`, `dry_run_clickup_task.py`, `dry_run_bootstrap_structure.py`.
- Não existe `--apply`.
- Não há criação real de `Page`, `Task`, `Database`, `List`, `Space` ou `Folder`.

### Agentes ativos

- [[17 - Viny Flow/01 - Agentes/Agente Base de Conhecimento|Agente Base de Conhecimento]]
- [[17 - Viny Flow/01 - Agentes/Agente Auditor|Agente Auditor]]
- [[17 - Viny Flow/01 - Agentes/Agente Segurança|Agente Segurança]]
- [[17 - Viny Flow/01 - Agentes/Agente Redator|Agente Redator]]
- [[17 - Viny Flow/01 - Agentes/Agente Memoria e Checkpoint|Agente Memória/Checkpoint]]
- [[17 - Viny Flow/01 - Agentes/Agente Tutorial StayCloud|Agente Tutorial StayCloud]]
- [[17 - Viny Flow/01 - Agentes/Agente SEO Rank Math|Agente SEO Rank Math]]
- [[17 - Viny Flow/01 - Agentes/Agente Visual e Prints|Agente Visual e Prints]]
- [[17 - Viny Flow/01 - Agentes/Agente UI UX Experience|Agente UI/UX Experience]]
- [[17 - Viny Flow/01 - Agentes/Agente WordPress|Agente WordPress]]
- [[17 - Viny Flow/01 - Agentes/Agente Relatorios|Agente Relatórios]]

## Base de Conhecimento

- Status geral: em crescimento controlado, com importações temáticas e auditorias manuais.
- Categorias principais: `VPS / SSH / Linux`, `cPanel / Hospedagem`, `Hospedagem e aplicação`, `E-mail e entrega`, `Domínio e DNS`, `Backups / JetBackup / Restauração`, `Playbook interno`.
- Índice rápido: [[13 - Base de Conhecimento/00 - Índice/Índice Geral|Índice Geral]]
- Mapa rápido: [[13 - Base de Conhecimento/00 - Índice/Mapa por Temas|Mapa por Temas]]
- Pendências conhecidas: playbooks ainda marcados como pendentes na origem e validações futuras por tema.
- Próximo lote ou auditoria: revisar os pendentes mais úteis de `Hospedagem e aplicação` e `Domínio e DNS`, sem forçar quantidade.

## Tutoriais StayCloud

- MOC central: [[00 - Mapas/MOC - Tutoriais StayCloud|MOC - Tutoriais StayCloud]]
- Fluxo de criação: [[17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud|Criar Tutorial StayCloud]]
- Fluxo de revisão: [[17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud|Revisar Tutorial StayCloud]]
- Fluxo de publicação: [[17 - Viny Flow/02 - Workflows/Publicar Tutorial StayCloud|Publicar Tutorial StayCloud]]
- Checklist SEO: [[03 - Tutoriais/Checklist SEO Rank Math StayCloud|Checklist SEO Rank Math StayCloud]]
- Checklist UI/UX: [[03 - Tutoriais/Checklist UI UX - Tutorial StayCloud|Checklist UI UX - Tutorial StayCloud]]
- Checklist final: [[03 - Tutoriais/Checklist Final - Revisão antes do WordPress|Checklist Final - Revisão antes do WordPress]]
- Padrão de prints: [[03 - Tutoriais/Padrão de Prints StayCloud|Padrão de Prints StayCloud]]
- Fila: [[03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo|Fila de Produção - Painel Novo]]
- Índice V2: [[03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS|Índice dos Tutoriais V2]]
- Regra operacional: WordPress só deve ser alterado com confirmação explícita. Produção ativa é unitária, sem lote.
- Estado da meta em 2026-07-31: 12/12 publicados e validados — CONCLUÍDA.
- Estado da produção adicional em 2026-08-03: 1 tutorial extra publicado e validado, não contado na meta.

## Estudos e Ferramentas

- [[15 - Cursos e Estudos/SINAPSE T03/README|SINAPSE T03]]
- [[16 - Estudos e Ferramentas/Ruflo/Diagnóstico - Ruflo|Ruflo]]
- [[16 - Estudos e Ferramentas/ECC/Diagnóstico - ECC|ECC]]

## Comandos rápidos

### /auditar-contexto

```text
Siga o workflow Auditar Contexto. Leia o checkpoint, o histórico e os arquivos-base da tarefa, separe fonte de verdade de referência, identifique conflitos e riscos, e diga se o escopo está pronto para execução sem mexer em nada ainda.
```

### /quality-gate

```text
Siga o workflow Quality Gate - Validar Entrega. Leia o objetivo inicial, revise os arquivos criados e alterados, confira segurança, histórico, checkpoint, índices e pendências, e diga se a entrega está finalizada ou apenas parcial.
```

### /seguranca

```text
Siga o workflow Revisão de Segurança. Revise estes arquivos e identifique credenciais, tokens, senhas, dados de cliente, IPs, domínios sensíveis, comandos perigosos, alterações fora do vault e riscos no histórico ou checkpoint, sem alterar os arquivos originais.
```

### /learn

```text
Siga o workflow Extrair Aprendizados da Sessão. Leia o fechamento da sessão, identifique decisões, padrões, correções e próximos passos, atualize o histórico e o checkpoint, e não registre credenciais nem dados sensíveis.
```

### /checkpoint

```text
Atue como Agente Memória/Checkpoint. Consolide a sessão em checkpoint curto, atualize o histórico do dia e deixe explícitos pendências e próximo passo, sem registrar dados sensíveis.
```

### /auditar-viny-flow

```text
Siga o workflow Auditar Skills, Agents e Workflows. Leia os mapas e a lista de skills instaladas, identifique duplicidades, lacunas, itens obsoletos e relações incoerentes, e devolva uma recomendação curta e objetiva sem alterar os arquivos originais.
```

### /validar-uiux

```text
Atue como Agente UI/UX Experience. Revise este tutorial, pagina ou jornada do cliente e diga se a clareza, o fluxo, os prints e a experiencia estao aprovados, aprovados com ajustes ou reprovados, sem publicar e sem alterar o painel real.
```

## Pendências abertas

- 

## Decisões recentes

- 
