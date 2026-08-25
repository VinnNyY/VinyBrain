# Quality Gate - Validar Entrega

## 1. Objetivo

Criar uma etapa final de validação antes de considerar qualquer tarefa concluída.

## 2. Quando usar

Use este workflow quando:

- uma entrega parecer pronta;
- houver mudança importante em arquivos, mapas, histórico ou checkpoint;
- for preciso diferenciar entrega final de entrega parcial;
- a tarefa envolver vários arquivos e risco de omissão.

## 3. Quando não usar

Não use este workflow quando:

- a tarefa ainda estiver em execução ativa;
- a validação final ainda depender de material que não existe;
- houver outro workflow específico de revisão mais apropriado para a frente principal.

## 4. Entrada esperada

- objetivo inicial da tarefa;
- arquivos criados e alterados;
- histórico do dia;
- checkpoint atual;
- índices ou mapas, quando aplicável;
- pendências listadas pela execução.

## 5. Agentes envolvidos

- **Agente Auditor**: confere consistência, cobertura e escopo.
- **Agente Segurança**: valida ausência de exposição sensível ou ação perigosa.
- **Agente Memória/Checkpoint**: confirma retomada, histórico e fechamento.
- **Agente Redator**: resume o status final em linguagem curta e clara.
- **Agente Visual e Prints**: reprova entrega com print sem marcação suficiente quando o tutorial depende de clique, campo ou área importante.

## 6. Etapas

### 1. Conferir objetivo inicial

1. Ler o objetivo original da tarefa.
2. Confirmar se a entrega resolveu esse objetivo.
3. Separar o que é final do que é apenas parcial.

### 2. Conferir arquivos alterados

1. Listar arquivos criados.
2. Listar arquivos alterados.
3. Confirmar se os arquivos pertencem ao escopo.

### 3. Conferir segurança

1. Verificar se nada sensível foi salvo.
2. Verificar se não houve alteração fora do vault.
3. Verificar se não houve exposição indevida de dados.

### 4. Conferir navegação e memória

1. Verificar se índices e mapas foram atualizados quando necessário.
2. Verificar se o histórico do dia foi atualizado.
3. Verificar se o checkpoint foi atualizado.

### 5. Conferir pendências

1. Listar pendências explícitas.
2. Separar pendência real de detalhe opcional.
3. Definir se a entrega é final ou parcial.

### 6. Conferir padrão visual do material

1. Verificar se os prints ajudam a desenhar o caminho do leitor.
2. Verificar se há marcação suficiente nos elementos importantes.
3. Verificar se o material ainda parece interno ou técnico demais.

## 7. Critérios de aprovação

A entrega é aprovada quando:

- o objetivo inicial foi cumprido;
- os arquivos certos foram criados ou alterados;
- não houve alteração fora do escopo;
- nada sensível foi salvo;
- índices e mapas foram atualizados quando necessário;
- histórico e checkpoint foram atualizados;
- pendências ficaram explícitas;
- o status final ficou claro.

## 8. Critérios de reprovação

Reprovar quando houver:

- objetivo inicial não atendido;
- arquivo fora do escopo alterado;
- dado sensível salvo;
- índice, mapa, histórico ou checkpoint esquecidos;
- pendência importante omitida;
- conclusão precoce sem validação suficiente.

## 9. Checklist final

- [ ] Objetivo inicial conferido
- [ ] Arquivos alterados conferidos
- [ ] Segurança conferida
- [ ] Índices e mapas conferidos
- [ ] Histórico conferido
- [ ] Checkpoint conferido
- [ ] Pendências conferidas
- [ ] Padrão visual conferido
- [ ] Status final definido
- [ ] Entrega classificada como final ou parcial

## 10. Prompt reutilizável

`Siga o workflow Quality Gate - Validar Entrega. Leia o objetivo inicial, revise os arquivos criados e alterados, confira segurança, histórico, checkpoint, índices, pendências e padrão visual dos prints, e diga se a entrega está finalizada ou apenas parcial.`
