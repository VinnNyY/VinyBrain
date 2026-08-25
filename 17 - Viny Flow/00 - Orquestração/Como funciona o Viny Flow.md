# Como funciona o Viny Flow

Viny Flow organiza trabalho em camadas:

1. Identificar o tipo de tarefa.
2. Escolher o agente ou workflow adequado.
3. Ler os checklists e os arquivos de contexto.
4. Executar com o Codex CLI dentro do escopo aprovado.
5. Registrar o resultado no historico e no checkpoint.

## Regra central

Viny Flow e uma camada de orquestracao, nao um motor autonomo.

Isso significa:

- sem daemon;
- sem hooks agressivos;
- sem MCP como dependencia principal;
- sem instalacao global;
- sem automacao cega;
- sem alteracao fora do escopo.

## Onde ele vive

- no Obsidian;
- no historico do Codex;
- nos workflows;
- nos agentes;
- nos comandos reutilizaveis;
- nos checklists;
- nas auditorias;
- nas decisoes.

## Como ele conversa com o Codex

O Viny Flow define o processo.
O Codex executa o passo dentro desse processo.

## Como ele conversa com as skills locais

As skills locais entram como reforco especializado, nao como camada de controle.

Exemplo:

- skill de escrita;
- skill de UI;
- skill StayCloud;
- skill de revisao.
