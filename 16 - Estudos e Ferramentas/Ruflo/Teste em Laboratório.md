# Teste em Laboratório - Ruflo

## Contexto

Ambiente isolado criado em `/home/vinicius-alves/ruflo-lab` para leitura e avaliação do Ruflo sem tocar no Viny Brain principal.

## Comandos executados

- `mkdir -p /home/vinicius-alves/ruflo-lab`
- `node -v`
- `npm -v`
- `npx -v`
- `pwd`
- `npx ruflo@latest --help`
- `npx ruflo@latest init --help`
- `npx ruflo@latest init wizard --help`
- `npx ruflo@latest check --help`
- `npx ruflo@latest skills --help`
- `npx ruflo@latest upgrade --help`
- `npx ruflo@latest plugins --help`
- `npx ruflo@latest agents --help`

## Saídas relevantes

- `node -v` retornou `v22.22.2`.
- `npm -v` retornou `10.9.7`.
- `npx -v` retornou `10.9.7`.
- `pwd` confirmou o diretório `'/home/vinicius-alves/ruflo-lab'`.
- `npx ruflo@latest init --help` mostrou a superfície principal do comando `init`.
- `npx ruflo@latest init wizard --help` falhou com `npm error code ENOTEMPTY` ao tentar limpar cache temporário em `~/.npm/_npx/...`.
- `npx ruflo@latest --help` ficou preso em download/instalação transitória e foi interrompido; o pacote tentou resolver dependências fora do laboratório.
- `npx ruflo@latest check --help` terminou com `[ERROR] Unknown command: check` e sugeriu `eject`, `benchmark` e `task`.
- `npx ruflo@latest skills --help` terminou com `[ERROR] Unknown command: skills` e sugeriu `status`.
- `npx ruflo@latest upgrade --help` terminou com `[ERROR] Unknown command: upgrade` e sugeriu `migrate`, `update` e `appliance`.
- `npx ruflo@latest plugins --help` funcionou e mostrou `plugins` como gerenciador com registry IPFS.
- `npx ruflo@latest agents --help` não devolveu ajuda útil e foi interrompido com `SIGINT`.

## O que a ajuda do Ruflo mostrou

### Subcomandos de `init`

- `wizard` - setup interativo.
- `status` parece ser o subcomando equivalente de checagem na versão atual.
- `update` e `migrate` aparecem como nomes atuais para manutenção e transição.
- `hooks` existe como superfície de inicialização específica, mas não foi executado.
- `plugins` existe como gerenciador separado.

### Subcomando `plugins`

- `list`
- `search`
- `install`
- `uninstall`
- `upgrade`
- `toggle`
- `info`
- `create`
- `rate`

Essa ajuda descreveu o registry como baseado em IPFS, o que aumenta a superfície de risco e a dependência de rede.

### Opções de `init`

- `--force`
- `--minimal`
- `--full`
- `--cloud-mcp`
- `--skip-claude`
- `--only-claude`
- `--no-global`
- `--start-all`
- `--start-daemon`
- `--with-embeddings`
- `--embedding-model`
- `--codex`
- `--dual`
- `--all-agents`
- `--skip-claude` e `--only-claude` continuam sendo as opções mais importantes para controlar escopo.

### Exemplos mostrados pela ajuda

- `claude-flow init`
- `claude-flow init --start-all`
- `claude-flow init --start-daemon`
- `claude-flow init --minimal`
- `claude-flow init --full`
- `claude-flow init --force`
- `claude-flow init --only-claude`
- `claude-flow init --skip-claude`
- `claude-flow init wizard`
- `claude-flow init --with-embeddings`
- `claude-flow init skills --all`
- `claude-flow init hooks --minimal`
- `claude-flow init upgrade`
- `claude-flow init --codex`
- `claude-flow init --dual`
- `claude-flow init --all-agents`

## Opções que parecem seguras

- `--no-global`
- `--skip-claude`
- `--only-claude` se o objetivo for observar apenas estrutura local mínima
- `--minimal` com muita cautela
- `status`, `update`, `migrate`, `task` e `benchmark` apenas como leitura futura, se houver ajuda clara
- `plugins --help` para mapear capacidades sem instalar nada

## Opções que parecem arriscadas

- `--start-all`
- `--start-daemon`
- `--full`
- `--cloud-mcp`
- `--with-embeddings`
- `--dual`
- `--codex`
- `--all-agents`
- `hooks`
- `plugins install`
- `plugins create`
- qualquer registry baseado em IPFS ou rede sem revisão
- qualquer fluxo que escreva em `~/.claude/CLAUDE.md`
- qualquer fluxo que registre MCP server ou daemon automaticamente

## Observações de risco

- O `npx` baixou o pacote de forma transitória fora do laboratório, em `~/.npm/_npx/...`.
- Houve avisos de dependências deprecadas e extrações incompletas durante a preparação do pacote.
- A ajuda confirma que o Ruflo é mais do que um plugin simples: ele tem inicialização, hooks, daemon, embeddings, integração Codex e modos de instalação distintos.

## Recomendação de próximo passo

Se o teste continuar, o próximo passo mais seguro é:

1. criar uma cópia descartável ainda mais isolada, se necessário;
2. continuar só com `--help` de subcomandos reais da versão atual, começando por `status`, `update`, `migrate`, `task` e `benchmark`;
3. evitar qualquer `plugins install` ou `plugins create`;
4. antes de qualquer `init`, revisar se o modo mínimo realmente evita hooks, MCP e escrita global;
5. só então considerar um `init` controlado em laboratório, com `--minimal`, `--skip-claude` e `--no-global`, se isso ainda fizer sentido.

## Estado atual

- laboratório criado;
- README descartável criado;
- leitura de versões concluída;
- leitura da ajuda principal do Ruflo parcialmente concluída;
- a versão atual da CLI não expôs `check`, `skills` nem `upgrade` como comandos válidos;
- `plugins` existe e é um surface separado, mas usa registry IPFS;
- `init` ainda não foi executado.
