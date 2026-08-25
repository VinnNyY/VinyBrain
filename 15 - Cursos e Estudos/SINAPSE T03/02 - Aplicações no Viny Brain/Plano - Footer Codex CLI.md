# Plano - Footer Codex CLI

## Objetivo

Adaptar a ideia do footer do Claude Code para o fluxo `codex-viny`, priorizando informação útil em tempo real sobre sessão, modelo e uso, sem inventar métricas que o Codex CLI não exponha.

## O que o prompt original queria no Claude Code

- Mostrar o modelo ativo na sessão.
- Mostrar o `effort` usado na sessão.
- Mostrar a porcentagem de uso da janela de contexto com barra colorida.
- Mostrar o limite diário de tokens em tempo real.
- Mostrar o limite semanal de tokens em tempo real.
- Exibir tudo em caixa alta.
- Separar as informações com `|` para leitura rápida.

## O que é possível adaptar para Codex

- Exibir informações que o Codex CLI já conhece localmente, como modelo configurado e `model_reasoning_effort` quando disponíveis no arquivo de config.
- Exibir o contexto operacional da sessão em um status externo, se ele puder ser lido do histórico local.
- Exibir avisos de uso, estado da sessão e identificador do fluxo `codex-viny`.
- Exibir métricas reais de uso se elas puderem ser lidas do `codex doctor`, logs locais ou arquivos de sessão.

## O que precisa ser validado

- Se o Codex CLI tem algum recurso nativo de footer, status line ou TUI configurável.
- Se o Codex expõe `model`, `effort`, contexto e limites por meio de logs locais, `doctor`, sessão ativa ou API local.
- Se o Warp oferece integração prática para atualizar uma barra/status externo em tempo real.
- Se tmux ou um wrapper shell é a forma mais estável para o seu fluxo atual.

## Limitações prováveis

- Não apareceu, no help local do Codex, nenhuma opção explícita de personalização nativa de footer/status line.
- O arquivo `~/.codex/config.toml` mostra `model` e `model_reasoning_effort`, mas não mostra um campo de footer/status customizável.
- `codex doctor` mostra configuração e saúde do ambiente, mas não garante que tudo isso esteja disponível ao vivo dentro da TUI.
- Métricas como uso de tokens, contexto e limites podem existir internamente, mas não estarem expostas de modo estável para um footer próprio.
- Se o CLI não expuser essas métricas em runtime, qualquer barra “ao vivo” terá de ser aproximada por logs, estado local ou atualização periódica.

## Alternativas técnicas

### 1. Recurso nativo, se existir

- Validar se a versão atual do Codex suporta configuração de UI/status por `config.toml`, flags de inicialização ou feature flag.
- Se existir, usar esse recurso como primeira escolha.

### 2. Wrapper script

- Criar um comando `codex-viny` que inicializa o Codex e, em paralelo, atualiza um status textual no terminal.
- O wrapper pode ler `~/.codex/config.toml`, `codex doctor` e arquivos de sessão para compor uma linha de estado.

### 3. Status externo no terminal

- Manter um arquivo de status atualizado em intervalos curtos.
- Renderizar esse status em outro painel do Warp ou em um terminal auxiliar.

### 4. Integração com Warp

- Usar Warp como superfície visual principal e deixar o status do Codex em um bloco/painel auxiliar.
- Se houver shell integration suficiente, mostrar apenas um resumo compacto e estável.

### 5. `tmux` status bar

- Usar `tmux` se a prioridade for um footer realmente persistente e controlável.
- O `tmux` pode ler um arquivo de status e exibir modelo, esforço e estado do fluxo.

### 6. Arquivo de sessão atualizado em tempo real

- Escrever um `status.md` ou `status.txt` por sessão.
- Atualizar esse arquivo com informações de modelo, esforço, contexto e avisos disponíveis.

### 7. Script local que leia logs do Codex

- Ler eventos de sessão, `doctor` e logs locais para reconstruir um painel de estado.
- Esse caminho só vale se os dados realmente estiverem acessíveis de forma estável e sem adivinhação.

## Melhor solução recomendada

1. Primeiro validar se existe footer/status nativo no Codex CLI.
2. Se não existir, adotar um `wrapper script` como núcleo do fluxo `codex-viny`.
3. O wrapper deve:
   - ler `~/.codex/config.toml`
   - consultar `codex doctor`
   - ler o estado da sessão local, quando disponível
   - escrever um arquivo de status simples e legível
4. Exibir esse status no Warp ou via `tmux`, conforme o terminal que estiver em uso.

Essa opção é a mais compatível com o seu fluxo atual porque não depende de mudanças profundas no CLI e não inventa métricas.

## Arquivos que seriam criados/alterados

- `15 - Cursos e Estudos/SINAPSE T03/03 - Skills e Prompts/Prompt - Footer Codex CLI.md`
- `15 - Cursos e Estudos/SINAPSE T03/03 - Skills e Prompts/Regras - Status do Codex CLI.md`
- `15 - Cursos e Estudos/SINAPSE T03/03 - Skills e Prompts/Template - Status Codex CLI.md`
- `15 - Cursos e Estudos/SINAPSE T03/03 - Skills e Prompts/Script - Status Codex CLI.sh`
- `15 - Cursos e Estudos/SINAPSE T03/03 - Skills e Prompts/README - Fluxo codex-viny.md`
- possivelmente um alias ou wrapper local fora do vault, se aprovado

## Riscos

- Inventar métricas que o Codex não expõe.
- Criar uma solução visual que pareça precisa, mas esteja mostrando dados aproximados ou desatualizados.
- Acoplar demais o fluxo ao terminal atual e dificultar portabilidade.
- Expor dados de sessão ou de uso em local indevido.
- Criar uma camada de status que gere ruído em vez de clareza.

## Comandos necessários, se houver

- `codex doctor`
- `codex features list`
- `codex --help`
- `codex --no-alt-screen`
- `codex exec`
- `codex --config model="..."` para teste de configuração, se necessário

## Minha confirmação antes de implementar

- Confirmar se a abordagem deve priorizar `wrapper script`, `tmux`, `Warp` ou arquivo de status em tempo real.
- Confirmar se você quer um status compacto só com dados reais ou um painel mais completo com fallback quando faltarem métricas.
- Confirmar se posso criar os arquivos de suporte em `03 - Skills e Prompts` e, depois, ligar isso ao fluxo `codex-viny`.

## Validação técnica já feita

- O help local do Codex CLI não mostrou opção nativa explícita de footer/status line.
- O `config.toml` local mostra `model` e `model_reasoning_effort`, mas não um recurso nativo de footer customizável.
- O `codex doctor` confirma o estado do ambiente e o modelo atual, mas não prova uma API de footer ao vivo.
- A customização, portanto, deve começar como solução externa e segura, não como alteração interna do CLI.
