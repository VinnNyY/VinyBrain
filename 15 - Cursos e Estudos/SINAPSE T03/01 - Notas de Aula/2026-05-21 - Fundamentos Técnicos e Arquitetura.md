# Fundamentos Técnicos e Arquitetura

## Módulo

SINAPSE | T03

## Fonte original

- Arquivo original: `15 - Cursos e Estudos/SINAPSE T03/00 - Fontes Brutas/Reunião iniciada às 2026_05_21 20_12 GMT-03_00 - Anotações do Gemini.pdf`
- Data de estudo: 2026-07-01

## Resumo objetivo

Aula de base técnica para nivelar o grupo em termos de terminal, Node.js, gerenciamento de pacotes, estrutura de projetos, segurança com `.env`, Git/GitHub e arquitetura de agentes. O foco principal foi dar vocabulário e critério para supervisionar projetos com IA sem depender de conhecimento profundo de programação.

## Conceitos principais

- Terminal como interface principal de trabalho.
- Node.js como requisito estrutural para ferramentas modernas de IA e web.
- NPM e PNPM como repositórios de dependências.
- Estrutura de projeto local com `src`, `public`, `node_modules`, `package.json`, `.env`, `.gitignore` e `README`.
- Arquivo `.env` como cofre de segredos.
- Importância de entender o mínimo técnico para avaliar segurança e qualidade.
- Arquitetura multiagente como superior ao agente único para tarefas complexas.
- Agentes, subagentes, skills, plugins, squads, workers, clones, orquestração e handoff.
- MCP como protocolo de integração de ferramentas externas.
- Tool Use como ação real, não só conversa.
- Settings como camada de configuração e permissões.
- Hooks e comandos de barra como gatilhos e atalhos.
- Git, GitHub, commits, push, pull, branches, merge e pull request.
- Infraestrutura de produção com GitHub e Vercel.
- Uso de Supabase para autenticação e banco.
- Cron jobs e variáveis de ambiente como base de automação segura.

## Prompts citados

- Não houve prompt textual reproduzido nesta aula.
- Houve referência genérica à necessidade de saber pedir corretamente para a IA.

## Comandos citados

- `cloud update`
- `git checkout`
- `push`
- `pull`
- `commit`
- `merge`
- `PR` / `Pull Request`
- `cloud`

## Skills citadas

- Skills como conceito geral dos agentes.
- `squad creator` como capacidade do Sinapse.

## Agentes ou subagentes citados

- Agente único
- Multiagentes
- Subagentes
- CEO/orquestrador
- Squads especializados
- Workers
- Clones

## O que foi ensinado para Claude Code

- O trabalho técnico deve ser organizado em terminal e por sessões.
- Não confiar só na interface de chat.
- Entender o fluxo Git completo antes de automatizar.
- Usar estruturas de projeto locais com arquivos de configuração bem definidos.
- Proteger segredos em `.env` e nunca versionar credenciais.
- Separar tarefas por especialidade para evitar perda de contexto.
- Usar hooks e automações para puxar contexto do segundo cérebro.

## Adaptação para Codex CLI

- Tratar o Codex como interface terminal-first, com sessões separadas por objetivo.
- Manter a mesma lógica de multiagentes: uma sessão para cada trilha de trabalho quando houver risco de mistura de contexto.
- Formalizar prompts e instruções no vault para reduzir dependência de memória de sessão.
- Usar histórico automático do Codex como equivalente operacional ao "segundo cérebro" citado na aula.
- Aplicar a mesma disciplina de Git, `.env`, branches e revisão antes de qualquer alteração crítica.
- Traduzir `hooks` de Claude para regras, prompts de inicialização e automações seguras no ambiente do Codex.

## Aplicações no Viny Brain

- Reforçar a pasta `08 - Codex` como camada de regras operacionais.
- Padronizar projetos com arquivos de contexto, regras e histórico.
- Criar templates para sessões técnicas, relatórios e revisões de segurança.
- Consolidar a Base de Conhecimento como memória persistente para uso com Codex.
- Criar checklist de segurança para segredos, repositórios e variáveis de ambiente.

## Melhorias possíveis

- Criar um guia curto de "fundamentos obrigatórios" para qualquer projeto com IA.
- Criar um template de estrutura mínima de projeto para tarefas do Viny Brain.
- Formalizar regras de divisão de sessões no Codex para projetos paralelos.
- Criar checklist de revisão de segurança antes de publicar ou sincronizar.

## Riscos e cuidados

- Expor tokens, chaves e senhas por falta de disciplina com `.env`.
- Misturar tarefas diferentes na mesma sessão e perder contexto.
- Confiar cegamente na IA sem noção mínima de estrutura e segurança.
- Automatizar sem revisar branches, PRs e ambiente de produção.

## Ações recomendadas

- [ ] Criar checklist de segurança para projetos com IA.
- [ ] Definir modelo de estrutura mínima de projeto no vault.
- [ ] Traduzir a lógica de hooks para rotinas operacionais do Codex.
- [ ] Padronizar uso de Git e versionamento no contexto do Viny Brain.

## O que pode ser implementado agora

- Template de checklist de segurança.
- Regra de separação por sessões/objetivos no Codex.
- Nota operacional sobre `.env`, Git e branches.

## O que precisa de confirmação antes de implementar

- Qualquer automação que altere produção.
- Qualquer configuração crítica de sistema.
- Qualquer integração externa que exija credenciais.
