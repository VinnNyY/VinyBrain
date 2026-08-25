# Auditar Skills, Agents e Workflows

## 1. Objetivo

Fazer uma revisão periódica da estrutura do Viny Flow para evitar excesso, duplicidade, workflows inúteis e agents pouco claros.

## 2. Quando usar

Use este workflow quando:

- houver sensação de crescimento desordenado;
- uma nova frente estiver sendo criada e precisar encaixe correto;
- for necessário revisar agentes, workflows e skills instaladas;
- houver suspeita de duplicidade ou obsolescência;
- o mapa precisar ficar mais limpo e mais fácil de manter.

## 3. Quando não usar

Não use este workflow quando:

- a tarefa for apenas executar um workflow específico;
- a revisão estrutural não trouxer ganho real naquele momento;
- houver urgência operacional maior do que a auditoria da estrutura.

## 4. Entrada esperada

- `Mapa de Agentes`;
- `Mapa de Workflows`;
- `Skills instaladas`;
- lista de arquivos recentes do Viny Flow;
- observações de duplicidade, lacuna ou confusão.

## 5. Agentes envolvidos

- **Agente Auditor**: verifica consistência, duplicidade e utilidade.
- **Agente Segurança**: aponta riscos de exposição, automação ou acoplamento indevido.
- **Agente Redator**: organiza o resultado da auditoria com clareza.

## 6. Etapas

### 1. Ler os mapas

1. Ler o `Mapa de Agentes`.
2. Ler o `Mapa de Workflows`.
3. Ler a lista de skills instaladas.

### 2. Conferir duplicidades

1. Identificar agentes com escopo parecido.
2. Identificar workflows com função muito próxima.
3. Identificar skills que não estão sendo usadas.

### 3. Conferir obsolescência

1. Marcar itens antigos que não ajudam mais.
2. Marcar itens que só repetem outro arquivo.
3. Marcar itens que podem ser fundidos.

### 4. Conferir relação entre itens

1. Verificar se cada workflow cita agentes que existem.
2. Verificar se cada agente aparece em pelo menos um workflow.
3. Verificar se a skill instalada tem uso real no fluxo.

### 5. Registrar recomendações

1. Sugerir fusão quando houver sobreposição.
2. Sugerir melhoria de documentação quando faltar clareza.
3. Sugerir remoção conceitual quando algo estiver obsoleto.

## 7. Critérios de aprovação

A auditoria é aprovada quando:

- a lista de agentes está clara;
- a lista de workflows está clara;
- as skills instaladas estão documentadas;
- não há duplicidade desnecessária;
- não há workflow citando agente inexistente;
- não há agente sem uso aparente;
- as recomendações estão objetivas.

## 8. Critérios de reprovação

Reprovar quando houver:

- agente duplicado sem motivo;
- workflow redundante sem justificativa;
- skill sem função conhecida;
- workflow citando agente inexistente;
- agente sem qualquer relação com os workflows;
- documentação confusa ou excessiva;
- risco de acoplamento desnecessário.

## 9. Checklist final

- [ ] Mapa de Agentes lido
- [ ] Mapa de Workflows lido
- [ ] Skills instaladas lidas
- [ ] Duplicidades conferidas
- [ ] Itens obsoletos conferidos
- [ ] Itens a fundir conferidos
- [ ] Relação entre agentes e workflows conferida
- [ ] Lacunas registradas
- [ ] Recomendação final registrada

## 10. Prompt reutilizável

`Siga o workflow Auditar Skills, Agents e Workflows. Leia os mapas e a lista de skills instaladas, identifique duplicidades, lacunas, itens obsoletos e relações incoerentes, e devolva uma recomendação curta e objetiva sem alterar os arquivos originais.`

