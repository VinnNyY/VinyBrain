# Auditar Contexto

## 1. Objetivo

Evitar perda de direção, excesso de informação, duplicidade de arquivos, contexto antigo demais e confusão entre regra atual e regra antiga.

## 2. Quando usar

Use este workflow quando:

- uma tarefa nova estiver para começar;
- o contexto da sessão parecer grande ou misturado;
- houver dúvida sobre qual arquivo é fonte de verdade;
- existir risco de tocar em material sensível;
- for preciso confirmar se a sessão está pequena o suficiente para ser executada bem.

## 3. Quando não usar

Não use este workflow quando:

- a tarefa já estiver clara, curta e bem isolada;
- a sessão for apenas uma revisão simples sem risco de mistura;
- houver outro workflow mais específico para a entrega principal.

## 4. Entrada esperada

- objetivo atual da sessão;
- arquivos que serão lidos;
- arquivos que podem ser alterados;
- checkpoint atual;
- histórico do dia;
- instruções conflitantes, se existirem.

## 5. Agentes envolvidos

- **Agente Auditor**: confere consistência, risco e aderência ao fluxo.
- **Agente Segurança**: verifica exposição sensível e pontos de bloqueio.
- **Agente Memória/Checkpoint**: valida continuidade, retomada e fonte de verdade da sessão.

## 6. Etapas

### 1. Identificar a tarefa ativa

1. Definir a tarefa principal em uma frase.
2. Separar tarefa principal de tarefas secundárias.
3. Confirmar se a sessão precisa de novo recorte.

### 2. Identificar fontes de verdade

1. Listar os arquivos-base da tarefa.
2. Separar fontes de verdade de estudo e referência.
3. Evitar usar material antigo como regra atual sem validação.

### 3. Conferir checkpoint e histórico

1. Ler o checkpoint atual.
2. Ler o histórico do dia.
3. Confirmar se a retomada está coerente com o que foi feito.

### 4. Procurar conflitos

1. Verificar se existem instruções divergentes.
2. Verificar se há duplicidade de orientação.
3. Resolver o conflito antes de alterar qualquer coisa.

### 5. Medir risco e tamanho

1. Confirmar se a tarefa toca em material sensível.
2. Confirmar se o escopo cabe bem na sessão atual.
3. Reduzir o escopo se houver excesso de contexto.

### 6. Registrar decisão de execução

1. Dizer se a tarefa pode seguir.
2. Dizer se precisa de recorte.
3. Dizer se precisa de validação humana antes de alterar arquivos.

## 7. Critérios de aprovação

O contexto é aprovado quando:

- a tarefa ativa ficou clara;
- as fontes de verdade ficaram separadas;
- o checkpoint está coerente;
- o histórico está atualizado;
- não há conflito aberto;
- o risco de mexer em material sensível foi identificado;
- o tamanho da tarefa está adequado.

## 8. Critérios de reprovação

Reprovar quando houver:

- tarefa principal ambígua;
- fontes de verdade confusas;
- checkpoint incoerente;
- histórico desatualizado para a etapa atual;
- instruções conflitantes sem resolução;
- risco sensível ignorado;
- escopo grande demais para a sessão.

## 9. Checklist final

- [ ] Tarefa ativa definida
- [ ] Fontes de verdade separadas
- [ ] Referências marcadas como estudo
- [ ] Checkpoint conferido
- [ ] Histórico conferido
- [ ] Conflitos conferidos
- [ ] Risco sensível conferido
- [ ] Tarefa dimensionada
- [ ] Decisão de execução registrada

## 10. Prompt reutilizável

`Siga o workflow Auditar Contexto. Leia o checkpoint, o histórico e os arquivos-base da tarefa, separe fonte de verdade de referência, identifique conflitos e riscos, e diga se o escopo está pronto para execução sem mexer em nada ainda.`

