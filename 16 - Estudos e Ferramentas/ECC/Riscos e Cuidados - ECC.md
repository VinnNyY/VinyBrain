# Riscos e Cuidados - ECC

## Riscos principais

### 1. Copiar o ECC como monólito

O ECC funciona como ecossistema amplo. Levar essa forma inteira para o Viny Brain criaria peso desnecessário, difícil de auditar e de manter.

**Cuidado:** adaptar princípios, não replicar a pilha.

### 2. Transformar tudo em hook ou automação

O ECC usa hooks e automações em várias camadas. No Viny Brain, isso pode gerar fragilidade se a automação virar a primeira resposta para qualquer tarefa.

**Cuidado:** preferir documentação, checklists e workflows manuais auditáveis.

### 3. Importar MCP e runtime pesado

MCP aparece como parte importante do ECC, mas no Viny Brain isso só faz sentido quando houver necessidade real e controle claro.

**Cuidado:** não ativar MCP por entusiasmo arquitetural.

### 4. Misturar conteúdo, estudo e operação

O ECC separa bem habilidades, comandos, guias e auditorias. Se essa separação não existir no Viny Brain, o conhecimento vira ruído.

**Cuidado:** cada arquivo deve ter uma função.

### 5. Copiar voice systems sem curadoria

`brand-voice` é útil, mas voz sem fonte real vira estilo falso.

**Cuidado:** basear a voz em material real do Viny Brain e do trabalho local.

### 6. Exagerar na instrumentação

`context-budget`, `skill-stocktake` e `harness-audit` são úteis, mas podem virar burocracia se aplicados toda hora.

**Cuidado:** usar como verificação em pontos de decisão, não como ruído constante.

## O que observar sempre

- não salvar credenciais, tokens ou dados reais de cliente;
- não copiar comandos que dependem de Claude Code sem tradução para o Viny Brain;
- não criar dependência de scripts do ECC;
- não misturar análise com instalação;
- não abrir mão do checkpoint e do histórico curto.

## Sintoma de implementação errada

Se a adaptação começar a parecer um segundo ECC, o desenho já passou do ponto.

O objetivo é:

- menos superfície;
- mais clareza;
- mais auditabilidade;
- menos runtime;
- melhor retomada.
