# Sincronizar Decisões Operacionais

## 1. Objetivo

Manter coerência entre decisões registradas no `Viny Brain`, resumos no `Notion` e acompanhamento no `ClickUp`.

## 2. Quando usar

Use este workflow quando:

- uma decisão importante precisar ser refletida em mais de um lugar;
- houver risco de desencontro entre memória, documentação e execução;
- for necessário conferir se algo mudou de status.

## 3. Quando não usar

Não use este workflow quando:

- a decisão ainda estiver em aberto;
- não houver qualquer outra superfície envolvida;
- o objetivo for automatizar sincronização real.

## 4. Entrada esperada

- decisão consolidada no Viny Brain;
- registros relacionados no Notion;
- tarefas relacionadas no ClickUp;
- pendências e divergências conhecidas.

## 5. Saída esperada

- lista de alinhamentos necessários;
- divergências encontradas;
- versão correta da decisão;
- indicação do que deve ser atualizado manualmente.

## 6. Agentes envolvidos

- **Agente Memória/Checkpoint**: valida a decisão principal.
- **Agente Auditor**: encontra divergências.
- **Agente Segurança**: bloqueia dados sensíveis.
- **Agente Redator**: resume o alinhamento.

## 7. Etapas

1. Ler a decisão no Viny Brain.
2. Comparar com os registros auxiliares.
3. Identificar divergências de texto ou status.
4. Definir qual versão é a oficial.
5. Preparar a orientação manual de ajuste.
6. Registrar pendências de sincronização.

## 8. Campos obrigatórios

- decisão principal;
- data;
- origem;
- sistemas impactados;
- divergências encontradas;
- ação manual necessária;
- status de sincronização.

## 9. Checklist final

- [ ] Decisão principal conferida
- [ ] Divergências conferidas
- [ ] Sistema oficial definido
- [ ] Ação manual indicada
- [ ] Nada sensível exposto
- [ ] Fonte da verdade mantida

## 10. Prompt reutilizável

`Siga o workflow Sincronizar Decisões Operacionais. Leia a decisão principal no Viny Brain, compare com registros no Notion e no ClickUp, identifique divergências e deixe clara a versão oficial e o ajuste manual necessário, sem sincronização automática.`
