# Viny Brain — Contexto Mestre para Claude Code

## Visão geral

Este diretório é o segundo cérebro operacional de Vinicius.

Caminho:

/home/vinicius-alves/Viny Brain

O Viny Brain concentra:

- suporte técnico;
- base de conhecimento;
- tutoriais;
- playbooks;
- gestão;
- reuniões;
- relatórios;
- decisões;
- demandas;
- estudos;
- ferramentas;
- agentes;
- workflows;
- integrações;
- histórico;
- projetos;
- automações.

Não tratar o vault apenas como uma coleção de Markdown.

Ele é um sistema operacional de conhecimento.

Antes de criar qualquer estrutura nova:

1. procure estrutura equivalente;
2. procure agente equivalente;
3. procure workflow equivalente;
4. procure comando equivalente;
5. procure MOC equivalente;
6. reutilize o que já existe.

Evite duplicação.

---

# Estrutura principal

Pastas reais na raiz (verificado em 2026-08-11):

- 00 - Inbox
- 00 - Mapas
- 01 - Daily
- 02 - Suporte
- 03 - Tutoriais
- 04 - Gestão
- 05 - Processo Seletivo
- 06 - Relatórios
- 07 - Prompts
- 08 - Codex
- 12 - Drive Importado
- 13 - Base de Conhecimento
- 14 - Histórico Codex
- 15 - Cursos e Estudos
- 16 - Estudos e Ferramentas
- 17 - Viny Flow
- 18 - Integrações
- 19 - Reuniões
- 99 - Templates

Não existem `09`, `10` e `11` na raiz.

Arquivos de raiz: `Home.md`, `jarvis.html`, `skills-lock.json`.

Skills locais ficam em `.agents/skills/` (writing-guidelines,
staycloud-tutorial-guidelines, web-design-guidelines e três skills Vercel/React).

Antes de assumir um caminho, confirme que ele existe.

---

# Viny Flow

O Viny Flow concentra os agentes e workflows operacionais.

Subpastas reais em `17 - Viny Flow/`:

- 00 - Orquestração
- 01 - Agentes
- 02 - Workflows
- 03 - Comandos
- 04 - Checklists
- 05 - Auditorias
- 05 - Inteligência do Cérebro
- 06 - Auditorias de Governança
- 07 - Projetos
- 99 - Decisões

## Agentes

Arquivos reais em `17 - Viny Flow/01 - Agentes/` (13 agentes + `Mapa de Agentes.md`):

- Agente Ata e Reuniões de Suporte
- Agente Auditor
- Agente Base de Conhecimento
- Agente Governança do Viny Brain
- Agente Memoria e Checkpoint
- Agente Redator
- Agente Relatorios
- Agente Segurança
- Agente SEO Rank Math
- Agente Tutorial StayCloud
- Agente UI UX Experience
- Agente Visual e Prints
- Agente WordPress

Não criar um novo agente se já existir um que cubra a função.

## Workflows

Arquivos reais em `17 - Viny Flow/02 - Workflows/` (21 workflows + `Mapa de Workflows.md`):

- Auditar Contexto
- Auditar Governança do Viny Brain
- Auditar Integrações
- Auditar Playbooks
- Auditar Skills, Agents e Workflows
- Criar Relatório
- Criar Tutorial StayCloud
- Enviar Demanda para ClickUp
- Extrair Aprendizados da Sessão
- Fechamento de Sessão
- Formatar Reunião de Suporte
- Importar Playbooks
- Publicar Tutorial StayCloud
- Quality Gate - Validar Entrega
- Registrar Reunião no Notion
- Revisar Texto
- Revisar Tutorial StayCloud
- Revisão de Segurança
- Sincronizar Decisões Operacionais
- Suporte para Conhecimento KCS
- Transformar Reunião em Demandas

## Comandos

ATENÇÃO: os comandos abaixo são **documentação em Markdown**, não slash commands
nativos do Claude Code. Não existe `.claude/commands/` no vault nem em `~/.claude/`.
Digitar `/checkpoint` no Claude Code não executa nada — é preciso abrir e seguir
o procedimento descrito em `17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md`.

Comandos documentados:

/auditar-contexto
/auditar-governanca
/auditar-tutoriais-staycloud
/auditar-viny-flow
/checkpoint
/criar-relatorio
/criar-tutorial-staycloud-unitario
/extrair-aprendizados
/formatar-reuniao-suporte
/kcs-suporte
/processar-demanda
/publicar-tutorial-staycloud
/quality-gate
/registrar-reuniao
/revisar-texto
/seguranca
/validar-uiux

Antes de executar ou recriar qualquer comando, leia sua definição real nesse arquivo.

---

# Regras de segurança do Viny Brain

Nunca salvar no vault:

- senha;
- token;
- cookie;
- PIN;
- credencial;
- chave privada;
- sessão autenticada;
- conteúdo sensível de .env.

Credenciais de integrações externas ficam fora do vault.

Local conhecido:

/home/vinicius-alves/.config/viny-integrations/.env

Pode utilizar somente quando o workflow autorizado exigir.

Nunca imprimir valores.

Nunca copiar seu conteúdo para Markdown, JSON de histórico, logs ou relatórios.

---

# Integrações

Existem integrações com:

## Notion

Viny Hub, incluindo áreas como:

- Reuniões
- Decisões
- Projetos
- Relatórios
- Processos
- Tutoriais
- Integrações

## ClickUp

Space:

Viny Operacional

Listas recorrentes:

- Demandas Internas
- Tutoriais StayCloud
- Base de Conhecimento
- Integrações
- Relatórios e Gestão
- Backlog de Ideias

Scripts existentes devem ser localizados antes de recriar.

Local real: `18 - Integrações/API/scripts/`

Scripts verificados:

_common.py
bootstrap_clickup_structure.py
bootstrap_notion_structure.py
create_clickup_task_from_json.py
create_clickup_tasks_batch_from_json.py
create_notion_meeting_from_json.py
create_test_clickup_task.py
create_test_notion_meeting.py
dry_run_bootstrap_structure.py
dry_run_clickup_task.py
dry_run_notion_page.py
list_clickup_demandas_internas.py
test_clickup_connection.py
test_notion_connection.py
upload_wordpress_media.py

Documentação de apoio na mesma área: `Guia Operacional - JSON para Notion e ClickUp.md`,
`Regras Técnicas - API.md`, `Estado Atual - Notion e ClickUp.md`, `env.example`.

Fluxo seguro:

1. gerar JSON;
2. validar;
3. dry-run;
4. mostrar resultado;
5. somente executar --apply com autorização.

---

# StayCloud

Vinicius atua operacionalmente na StayCloud.

Principais áreas técnicas recorrentes:

- hospedagem;
- cPanel;
- WHM;
- WordPress;
- DNS;
- SSL;
- e-mail;
- VPS;
- migração;
- Cloudflare;
- Deploy;
- backups;
- performance.

Não assumir que informações comerciais ou técnicas antigas continuam válidas.

Quando uma informação atual da StayCloud for necessária:

- conferir documentação interna;
- painel real;
- base pública;
- fonte atual.

Não inventar:

- planos;
- preços;
- limites;
- políticas;
- features;
- infraestrutura;
- métricas.

---

# Tutoriais StayCloud

Área crítica do Viny Brain.

Produção principal:

/home/vinicius-alves/Viny Brain/03 - Tutoriais/

Existe uma estrutura V2 utilizada para os tutoriais do Painel Novo.

Cada tutorial ativo deve, em geral, manter na raiz apenas:

- 01 - VISUALIZAR TUTORIAL.html
- 02 - COLAR NO WORDPRESS.txt
- 03 - SEO RANK MATH.txt
- 04 - VALIDAÇÃO FINAL.md
- prints-finais/
- apoio/

Arquivos técnicos ficam em:

apoio/

Não apagar versões anteriores permanentemente sem autorização.

## Fluxo dos tutoriais

Antes de criar:

1. auditar planilha;
2. auditar Central de Ajuda;
3. auditar Obsidian;
4. verificar duplicação;
5. validar painel real;
6. definir fluxo;
7. criar plano de prints;
8. capturar;
9. sanitizar;
10. redigir;
11. SEO;
12. preview;
13. quality gate;
14. aguardar aprovação.

Não publicar antes da autorização explícita:

APROVADO PARA PUBLICAR

## Screenshots

Regras:

- uma ação/alvo principal por print;
- texto do passo deve corresponder ao alvo;
- próximo print deve comprovar a ação;
- marcação não pode cobrir o elemento;
- evitar setas longas;
- sanitizar informações pessoais e sensíveis.

Originais devem permanecer em apoio.

Somente versões sanitizadas podem ir para WordPress.

## SEO

Rank Math:

- palavra-chave como chip/tag ativo;
- title;
- slug;
- meta description;
- excerpt;
- keyword no conteúdo;
- ALT;
- links internos úteis;
- social;
- score real mínimo 80.

Não criar links internos apenas para aumentar SEO.

## WordPress

BetterDocs.

Regras:

- título nativo;
- corpo HTML;
- não duplicar H1;
- categoria correta;
- slug sem -2/-3 acidental;
- validar URL pública;
- HTTP 200;
- validar imagens;
- atualizar registro-publicacao.md;
- atualizar Obsidian.

---

# Meta de tutoriais

A meta mensal de 12/12 foi concluída.

Tutoriais posteriores devem ser registrados como produção adicional/extra.

Não transformar automaticamente em 13/12.

---

# Reuniões

Fluxo existente:

OBS + WhisperX.

Configuração histórica:

- modelo large-v3;
- idioma pt;
- diarização;
- separação SPEAKER_00, SPEAKER_01 etc.

Não reinstalar o stack antes de verificar o ambiente atual.

Fluxo:

1. validar gravação;
2. verificar duplicação;
3. transcrever;
4. diarizar;
5. revisar;
6. extrair decisões;
7. extrair ações;
8. preparar relatório;
9. gerar DOCX;
10. gerar PDF;
11. revisar visualmente TODAS as páginas;
12. preparar JSON para Notion/ClickUp;
13. dry-run;
14. atualizar Obsidian;
15. quality gate;
16. checkpoint.

Nunca inventar:

- responsável;
- prazo;
- decisão.

Quando não existir:

Responsável: A definir
Prazo: Não definido

---

# Governança do grafo do Obsidian

O grafo já apresentou poluição excessiva.

Regra atual:

Não criar conexões apenas porque duas notas compartilham palavras.

Toda conexão precisa ter utilidade.

Links válidos:

- relação semântica forte;
- fonte;
- decisão;
- tarefa derivada;
- dependência;
- navegação intencional;
- rastreabilidade;
- workflow/agente diretamente relacionado.

Evitar:

- links globais genéricos;
- link para Home em todas as notas;
- ligação automática entre projetos;
- seções “Relacionados” genéricas;
- links recíprocos artificiais;
- transformar toda menção em WikiLink.

Projetos independentes devem permanecer separados.

---

# Projetos separados

## Legacy Doc

Projeto independente.

Não misturar com StayCloud ou Viny Watch.

Produto de tecnologia originado de TCC de Ciência da Computação.

Tema:

Uso de IA para analisar repositórios, especialmente código legado ou pouco documentado, e gerar documentação técnica automatizada.

O produto deve ser comunicado como tecnologia real em desenvolvimento.

O TCC é origem/contexto de validação, não deve diminuir o posicionamento do produto.

Não inventar:

- clientes;
- métricas;
- segurança;
- compatibilidade;
- preço;
- claims.

---

## Viny Watch

Projeto separado.

Código:

/home/vinicius-alves/Projetos/viny-watch

Objetivo:

monitorar grupos importantes do WhatsApp Web comercial e identificar atendimentos sem resposta.

Arquitetura atual inclui:

- Node.js;
- TypeScript;
- Playwright;
- SQLite;
- painel local;
- Chromium com perfil separado.

Destino dos alertas:

Alertas Viny Watch

Esse grupo:

- é somente destino;
- deve ser ignorado pelo scanner;
- nunca pode gerar alerta sobre ele próprio.

Monitoramento:

- aba Grupos;
- todos os grupos;
- sem abrir conversas de clientes;
- leitura da lista lateral;
- classificação OUTGOING / INTERNAL / INCOMING / INCOMING_PROBABLE / UNKNOWN.

Um alerta real já foi validado.

Houve um bug de backlog legado durante testes.

Antes de ampliar produção:

- verificar estado atual do kill switch;
- verificar productionBaselineAt;
- preservar histórico;
- impedir alertas antigos em massa.

Não assumir que o estado atual é o mesmo deste documento: auditar código, SQLite e documentação antes de modificar.

---

# Projetos de clientes / produção

Nunca utilizar projeto de cliente como ambiente de testes sem autorização explícita.

Preferir:

- projeto descartável;
- conta própria;
- ambiente de teste.

Antes de:

- DNS;
- domínio;
- deploy;
- exclusão;
- alteração de plano;
- cobrança;
- produção;

confirmar escopo.

---

# cPanel / WHM / root

Vinicius trabalha eventualmente com acesso root em servidores.

Tratar qualquer comando root como alto risco.

Antes de executar:

1. entender impacto;
2. conferir usuário/domínio;
3. preferir leitura;
4. gerar backup quando aplicável;
5. evitar mudanças globais;
6. não liberar IPs ou desativar proteções indiscriminadamente;
7. pedir autorização antes de alteração relevante.

---

# Forma de investigação técnica

Por padrão:

1. coletar evidências;
2. não alterar;
3. formular hipótese;
4. testar de forma segura;
5. modificar mínimo necessário;
6. validar;
7. registrar resultado.

Evitar sequência longa de comandos aleatórios.

Quando Vinicius estiver atendendo cliente e pedir apenas explicação/resposta:

não transformar automaticamente em procedimento invasivo.

---

# Checkpoints

Depois de trabalhos grandes, atualizar o checkpoint existente.

Registrar:

- o que mudou;
- evidências;
- decisão;
- resultado;
- pendências;
- próximo passo.

Não criar dezenas de backlinks no checkpoint.

---

# Regra fundamental

O Viny Brain deve ficar cada vez:

- mais útil;
- mais simples;
- mais conectado semanticamente;
- menos duplicado;
- menos poluído;
- mais seguro;
- mais fácil de navegar.

Não otimizar o sistema pela quantidade de arquivos, agentes, links ou automações.

O objetivo é utilidade operacional.
