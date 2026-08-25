# Diagnóstico - Ruflo

## Resumo executivo

O Ruflo é um harness de orquestração para Claude Code e Codex. A proposta é transformar um agente isolado em um sistema com memória, swarms, plugins, comandos, hooks e automações. Isso pode ajudar bastante em projetos grandes, mas o custo de integração, a superfície de risco e a dependência forte do ecossistema Claude Code tornam a adoção no `Viny Brain` algo que deve começar pelo uso mais leve possível.

Minha recomendação inicial é: estudar e testar em modo mínimo, sem hooks automáticos e sem daemon, antes de pensar em qualquer uso contínuo.

## 1. O que é o Ruflo

Ruflo é apresentado no próprio repositório como um “agent meta-harness” para Claude Code e Codex. Em termos práticos, ele tenta ser uma camada acima do modelo: não substitui o LLM, mas organiza execução, memória, agentes, plugins, coordenação e segurança ao redor dele.

O projeto promete:

- mais de 100 agentes especializados;
- coordenação em swarms;
- memória persistente e busca semântica;
- integração com MCP;
- hooks para automatizar decisões e roteamento;
- plugins para tarefas específicas;
- colaboração entre máquinas e, em tese, entre plataformas.

## 2. O que ele promete fazer

O discurso central do Ruflo é que o agente não deve “trabalhar sozinho”, mas colaborar por meio de uma camada de execução mais rica.

As promessas mais fortes são:

- coordenar swarms multiagente;
- armazenar e recuperar memória entre sessões;
- usar ferramentas MCP sem exigir que o usuário memorize tudo;
- automatizar o roteamento de tarefas via hooks;
- suportar workflows, workers em background e planejamento de metas;
- oferecer plugins para revisão, testes, segurança, documentação, browser automation e outras áreas;
- permitir colaboração federada entre máquinas com segurança.

## 3. Diferença entre plugin leve para Claude Code, instalação completa via CLI e uso com Codex

### Plugin leve para Claude Code

Esse modo é o mais contido. O usuário instala plugins específicos pelo marketplace do Claude Code, por exemplo `ruflo-core` ou `ruflo-swarm`.

O que entra:

- slash commands;
- algumas skills;
- definições de agentes por plugin.

O que não entra:

- MCP server completo do Ruflo;
- hooks automáticos;
- daemon;
- fluxo completo de memória e roteamento.

Esse modo é útil quando você quer experimentar partes pontuais sem transformar o projeto inteiro.

### Instalação completa via CLI

Esse é o modo pesado. O comando `npx ruflo init` ou `npx ruflo@latest init wizard` tende a gerar a integração completa do ambiente.

O que entra, segundo a documentação e relatos de instalação:

- `CLAUDE.md` no projeto;
- `.claude/` com settings e artefatos de suporte;
- `.claude-flow/` com config e memória;
- `.mcp.json` para registrar o servidor MCP;
- hooks;
- helpers;
- agentes, comandos e skills;
- possibilidade de daemon e workers em background.

Esse é o caminho mais próximo de “Ruflo como sistema operacional para Claude Code”, mas também é o mais invasivo.

### Uso com Codex

O repositório diz que Ruflo também conversa com Codex, mas o uso com Codex não deve ser copiado 1:1 do fluxo Claude Code.

Na prática, há três níveis aqui:

- uso conceitual: aproveitar a arquitetura de agentes, memória, checklists e workflows;
- uso integrado: usar os componentes que fazem sentido em fluxos paralelos com Codex;
- uso literal: tentar reproduzir hooks, marketplace e comandos pensados para Claude Code.

A terceira opção é a mais arriscada. Para o `Viny Brain`, o que faz sentido é adaptar a ideia de orquestração, não herdar a mecânica específica do Claude Code.

## 4. Quais arquivos e pastas ele pode criar no projeto

Pelo material do repositório e por relato de instalação estudado, o Ruflo pode criar ou alterar:

- `CLAUDE.md` no workspace;
- `.claude/`;
- `.claude/settings.json`;
- `.claude/helpers/`;
- `.claude/agents/`;
- `.claude/commands/`;
- `.claude/skills/`;
- `.claude-flow/`;
- `.swarm/`;
- `.mcp.json`;
- `~/.claude/CLAUDE.md` no escopo global do usuário;
- diretórios de plugin com `.claude-plugin/plugin.json`;
- estruturas de plugin como `src/`, `src/commands/`, `src/skills/`, `src/agents/`, `tests/`, `package.json` e `README.md`.

Para o `Viny Brain`, o ponto crítico não é só o que ele cria no projeto, mas também o que ele toca fora do projeto.

## 5. Quais comandos de instalação existem

Os comandos documentados ou observados no material estudado incluem:

- `curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash`
- `npx ruflo@latest init wizard`
- `npx ruflo@latest init`
- `npx ruflo init --wizard`
- `npm install -g ruflo@latest`
- `claude mcp add ruflo -- npx ruflo@latest mcp start`
- `/plugin marketplace add ruvnet/ruflo`
- `/plugin install ruflo-core@ruflo`
- `/plugin install ruflo-swarm@ruflo`
- `/plugin install ruflo-rag-memory@ruflo`
- `npx ruflo@latest plugins install <plugin>`
- `npx ruflo@latest plugins list`
- `npx ruflo@latest plugins enable <plugin>`
- `npx ruflo@latest plugins disable <plugin>`
- `npx ruflo@latest plugins uninstall <plugin>`
- `npx ruflo@latest plugins create <nome>`

Há também variações de documentação que confundem `init --wizard` com `init wizard`. Isso é um sinal de maturidade irregular da documentação e merece cautela.

## 6. Quais partes parecem úteis para o meu Viny Brain

As partes com melhor chance de uso real aqui são:

- ideia de memória persistente e consulta por contexto;
- organização por plugins e comandos por domínio;
- workflows reutilizáveis para tarefas recorrentes;
- agentes especializados por função;
- checklists para validar antes de agir;
- auditoria de custo e segurança;
- geração de documentação e testes quando isso estiver claramente delimitado;
- isolamento de tarefas por escopo, para evitar mistura de contexto.

No seu caso, o valor maior não está em “ter 100+ agentes”, mas em ter uma camada de organização que reduza retrabalho sem bagunçar o vault.

## 7. Quais partes parecem arriscadas ou exageradas

Os pontos mais agressivos são:

- promessa de “self-learning” como se fosse melhoria contínua confiável por padrão;
- swarm e autonomia com loop de background;
- federação entre máquinas;
- daemon sempre ativo;
- hooks automáticos mexendo em comportamento sem supervisão;
- claims de segurança empresarial amplos demais para depender só da ferramenta;
- números altos de agentes, comandos e MCP tools, que podem mais impressionar do que orientar uso real;
- uso de GPU, WASM, roteamento multi-provider e stacks adicionais quando o problema é só organizar trabalho no vault.

Para o `Viny Brain`, tudo isso precisa passar pelo filtro de utilidade real, não pelo marketing técnico.

## 8. Quais recursos dependem de Claude Code e não devem ser copiados literalmente

Não faz sentido copiar literalmente para o `Viny Brain`:

- o marketplace `/plugin ...`;
- a suposição de que `claude` vai carregar automaticamente tudo que o Ruflo escreve;
- a escrita automática em `~/.claude/CLAUDE.md`;
- o modelo de hooks específico do Claude Code;
- comandos `claude mcp add` como se fossem a camada principal;
- o fluxo de “just use Claude Code normally” com roteamento implícito;
- a ideia de que o workspace do Claude Code será sempre o sistema de verdade.

Esses pontos são acoplamentos do produto ao ecossistema Claude Code. O que interessa é o padrão de organização, não o comando exato.

## 9. Quais recursos podem ser adaptados para Codex

Estes elementos têm boa chance de adaptação:

- arquitetura de agentes especializados;
- memória por namespace ou por tarefa;
- workflows de feature / bugfix / review / security;
- planilhas mentais ou arquivos de checkpoint;
- checklists de segurança e validação;
- escopo explícito por sessão;
- uso de plugin como unidade de capacidade;
- separação entre coordenação e execução;
- auditoria de custo e risco;
- documentação viva do estado operacional.

A adaptação deve ocorrer no nível de processo e arquivo, não no nível de hook do Claude.

## 10. Quais agentes ou plugins parecem úteis

Para o seu contexto, os mais interessantes são:

- `ruflo-core`, pela base de CLI, MCP e descoberta;
- `ruflo-swarm`, pela coordenação de trabalho dividido;
- `ruflo-workflows`, pelos fluxos multi-etapas;
- `ruflo-rag-memory`, pela ideia de recuperação híbrida de conhecimento;
- `ruflo-agentdb`, pela memória vetorial;
- `ruflo-goals`, pela organização de metas longas;
- `ruflo-testgen`, se houver código com cobertura insuficiente;
- `ruflo-security-audit`, para revisar riscos antes de automatizar;
- `ruflo-cost-tracker`, para controlar custo e volume;
- `ruflo-docs`, se a documentação estiver ficando difícil de manter;
- `ruflo-plugin-creator`, como inspiração para empacotar capacidades próprias.

## 11. Quais não fazem sentido para o meu caso

Eu deixaria fora, por enquanto:

- `ruflo-neural-trader`;
- `ruflo-market-data`;
- `ruflo-iot-cognitum`;
- qualquer coisa ligada a trading, IoT ou domínios irrelevantes ao vault;
- automação de browser se não houver um caso concreto;
- loops autônomos de background;
- federation entre máquinas;
- integração cloud-managed de agentes;
- camadas de DDD e metodologias pesadas se a meta for só organizar o trabalho local;
- qualquer plugin com benefício teórico, mas sem uso claro para Codex, Obsidian ou StayCloud.

## 12. Riscos

### Hooks

Risco alto. Hooks podem disparar comportamento automático, difícil de auditar e fácil de quebrar o fluxo do vault.

### Daemon

Risco alto. Processo em background aumenta complexidade, consumo e dificuldade de diagnóstico.

### MCP

Risco médio a alto. MCP é útil, mas expande a superfície de ferramentas disponíveis ao agente. Se mal configurado, vira excesso de poder sem necessidade.

### Alteração automática de arquivos

Risco alto. É o ponto mais sensível para um vault com checkpoints e histórico operacional.

### Credenciais

Risco alto. O Ruflo pode envolver chaves de API, providers externos, instalação de plugins e possivelmente dados sensíveis em memória.

### Produção

Risco alto. As promessas de “pronto para produção” devem ser tratadas como reivindicação do projeto, não como garantia no seu ambiente.

### Instalação global

Risco alto. Modificar `~/.claude/CLAUDE.md` ou instalar globalmente aumenta o raio de impacto e dificulta reversão limpa.

## 13. Recomendação de instalação segura

A forma segura de avaliar o Ruflo no `Viny Brain` é:

1. Começar sem instalação global.
2. Evitar `curl | bash`.
3. Evitar `init` completo no vault principal.
4. Testar primeiro apenas o modo leve de plugins, em um workspace isolado de laboratório.
5. Se houver avanço, habilitar somente um subconjunto pequeno de plugins.
6. Não ativar hooks nem daemon no primeiro teste.
7. Validar o que foi escrito em arquivos antes de aceitar qualquer persistência.
8. Separar claramente o que é configuração local, o que é memória e o que é automação.
9. Só considerar integração com o `Viny Brain` após um teste de ida e volta: instalar, verificar arquivos criados, remover, e confirmar que o ambiente voltou ao estado anterior.

Minha recomendação prática é começar por um teste de leitura e listagem de plugins, depois um teste mínimo de plugin leve em ambiente descartável. Se isso passar sem contaminar o vault, aí sim vale pensar em adaptação de conceitos para Codex.

## Conclusão

Ruflo parece útil como referência de arquitetura e como toolkit potencial para orquestração avançada. Para o `Viny Brain`, porém, o melhor valor inicial está nas ideias que ele traz, não na instalação completa.

O que eu aproveitaria:

- memória;
- workflows;
- agentes especializados;
- checklists;
- auditoria;
- rastreabilidade.

O que eu evitaria no primeiro momento:

- hooks automáticos;
- daemon;
- instalação global;
- dependência forte do Claude Code;
- automação que escreva arquivos sem revisão.

## Fontes estudadas

- [Repositório Ruflo](https://github.com/ruvnet/ruflo)
- [Wiki de instalação](https://github.com/ruvnet/ruflo/wiki/Installation)
- [Wiki de plugins](https://github.com/ruvnet/ruflo/wiki/Plugins)
- [STATUS.md](https://github.com/ruvnet/ruflo/blob/main/docs/STATUS.md)
- [CLAUDE.md](https://github.com/ruvnet/ruflo/blob/main/CLAUDE.md)
- [Issue 1744, estudo de instalação](https://github.com/ruvnet/ruflo/issues/1744)
- [Issue 1497, uso real e fricções do fluxo](https://github.com/ruvnet/ruflo/issues/1497)
- [Issue 1557, cleanup e resíduos de instalação](https://github.com/ruvnet/ruflo/issues/1557)
