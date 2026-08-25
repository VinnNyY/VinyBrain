# Transformar Reunião em Demandas

## 1. Objetivo

Converter uma reunião em uma lista de demandas operacionais que possam ser acompanhadas no `ClickUp`.

## 2. Quando usar

Use este workflow quando:

- uma reunião gerar ações práticas;
- houver decisões que precisem virar tarefa;
- for necessário separar o que é informação do que é execução.

## 3. Quando não usar

Não use este workflow quando:

- a reunião não gerar ações claras;
- ainda houver dúvida sobre a decisão;
- o material conter risco sensível sem validação;
- a intenção for criar tarefas automáticas.

## 4. Entrada esperada

- ata final em `19 - Reuniões/02 - Reuniões Formatadas/` ou notas ainda em `19 - Reuniões/01 - Em Revisão/`;
- decisões;
- pendências;
- responsáveis sugeridos;
- prazos aproximados;
- contexto da reunião.

## 5. Saída esperada

- lista de demandas derivadas;
- prioridade sugerida;
- responsável sugerido;
- prazo sugerido ou pendente;
- indicação de envio manual ao ClickUp.

## 6. Agentes envolvidos

- **Agente Auditor**: separa ação de contexto.
- **Agente Redator**: resume e organiza.
- **Agente Segurança**: filtra dados sensíveis.

## 7. Etapas

1. Ler a reunião na nova área `19 - Reuniões/`, sem alterar a transcrição original.
2. Separar decisões, pendências e ações.
3. Converter cada ação em uma demanda clara.
4. Preservar responsável e prazo somente quando suportados pela reunião; usar `A definir` quando ausentes.
5. Marcar o que depende de validação humana.
6. Indicar que a criação no ClickUp é manual.

## 8. Campos obrigatórios

- título da demanda;
- descrição curta;
- responsável;
- prioridade;
- origem da reunião;
- prazo, se houver;
- dependências;
- status inicial.

## 9. Checklist final

- [ ] Reunião lida
- [ ] Ações separadas
- [ ] Demandas derivadas criadas em texto
- [ ] Responsáveis indicados
- [ ] Prioridades indicadas
- [ ] Dependências indicadas
- [ ] Nada sensível exposto
- [ ] Nenhuma demanda, responsável ou prazo foi inventado

## 10. Prompt reutilizável

`Siga o workflow Transformar Reunião em Demandas. Leia esta reunião, extraia ações concretas, transforme cada ação em demanda operacional e deixe tudo pronto para envio manual ao ClickUp, sem criar nada automaticamente.`
