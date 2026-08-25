# Pesquisa - Triage de Tickets e Labels

## Objetivo

Criar uma triagem padronizada para saber o que o ticket é, qual o impacto e para onde ele deve seguir.

## Matriz inicial

| Prioridade | Tipo | Impacto | Informações obrigatórias | Destino | Resposta sugerida | Quando escalar |
|---|---|---|---|---|---|---|
| P1 | Falha crítica | Alto | domínio, site, horário, erro visível | incidente / runbook | resposta curta com contenção | se houver downtime, risco de perda ou segurança |
| P2 | Bloqueio operacional | Médio/alto | contexto, usuário afetado, etapa travada | suporte nível 2 | orientar teste seguro | se o primeiro teste não resolver |
| P3 | Dúvida ou ajuste | Médio/baixo | print, descrição, objetivo | base de conhecimento | responder com artigo ou passo a passo | se houver repetição ou ambiguidade |
| P4 | Pedido simples | Baixo | objetivo e contexto mínimo | atendimento rápido | responder com orientação direta | se o pedido virar escopo maior |

## Categorias mínimas

### WordPress
- editor, tema, plugin, publicação, erro de página

### Elementor
- layout, seção quebrada, widget, responsivo

### SSL
- certificado, renovação, mixed content, força HTTPS

### DNS
- apontamento, propagação, Cloudflare, registros

### E-mail
- envio, recebimento, SPF, DKIM, bloqueio

### cPanel
- conta, redirecionamento, cron, arquivos, backups

### Banco de dados
- conexão, corrupção, usuário, senha, phpMyAdmin

### Malware
- limpeza, detecção, isolamento, restauração

### Migração
- cópia, DNS, inconsistência, arquivo faltante

### Cobrança
- fatura, plano, pagamento, suspensão

### Performance
- lentidão, cache, CPU, query lenta

### VPS
- SSH, serviço parado, firewall, disco, memória

### Domínio
- renovação, registro, nameserver, DNS

### Plugin Premium
- licença, ativação, compatibilidade, atualização

## Matriz por categoria

| Categoria | O que observar | Informações obrigatórias | Resposta sugerida | Quando escalar |
|---|---|---|---|---|
| WordPress | erro, publicação, editor, login | URL, print, etapa, impacto | orientar teste seguro e checar plugin/tema | se houver indisponibilidade ou risco de perda |
| Elementor | layout, widget, responsivo, edição | página, seção, print, contexto | confirmar onde quebra e testar em rascunho | se impactar página crítica |
| SSL | certificado, HTTPS, mixed content | domínio, erro, status do certificado | orientar renovação/verificação de emissão | se expirar ou quebrar acesso |
| DNS | apontamento, propagação, nameserver | domínio, registro, provedor | checar rota e tempo de propagação | se estiver bloqueando acesso geral |
| E-mail | envio, recebimento, SPF, DKIM | remetente, destinatário, erro, horário | validar configuração e fila | se houver perda de comunicação |
| cPanel | conta, cron, arquivos, backups | conta, caminho, print, ação esperada | orientar navegação segura e teste | se envolver permissão ou backup |
| Banco de dados | conexão, erro, lenta, corrupção | site, erro, credencial, horário | validar conexão e saúde básica | se o site estiver fora do ar |
| Malware | detecção, limpeza, isolamento | arquivo, alerta, origem, impacto | isolar e evitar ação destrutiva | sempre que houver ameaça ativa |
| Migração | cópia, DNS, arquivo faltante | origem, destino, etapa travada | validar checklist de migração | se houver risco de perda de dados |
| Cobrança | fatura, plano, pagamento, suspensão | cliente, plano, data, fatura | responder com status e próximo passo | se impactar serviço ativo |
| Performance | lentidão, cache, CPU, query | URL, horário, métricas, print | orientar teste de cache e carga | se houver indisponibilidade parcial |
| VPS | SSH, serviço, firewall, disco | servidor, serviço, erro, impacto | checar serviço e recurso com segurança | se houver risco sistêmico |
| Domínio | renovação, registro, nameserver | domínio, vencimento, registrador | orientar renovação e DNS | se houver expiração próxima |
| Plugin Premium | licença, compatibilidade, update | plugin, versão, erro, impacto | validar licença e compatibilidade | se afetar produção ou segurança |

## Regras de triagem

- se houver risco de indisponibilidade, subir prioridade
- se faltar informação crítica, pedir o mínimo necessário antes de responder
- se o ticket for recorrente, registrar em KCS
- se o ticket for complexo, gerar pacote de escalonamento
- se houver sinal de incidente, abrir caminho de runbook e postmortem
