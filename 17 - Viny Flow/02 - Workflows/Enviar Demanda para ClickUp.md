# Enviar Demanda para ClickUp

## 1. Objetivo

Transformar uma demanda validada no `Viny Brain` em um registro operacional pronto para ser copiado manualmente para o `ClickUp`.

## 2. Quando usar

Use este workflow quando:

- a demanda já tiver contexto suficiente;
- houver um responsável ou direção clara;
- a tarefa precisar de acompanhamento operacional;
- o registro for ser levado ao ClickUp de forma manual.

## 3. Quando não usar

Não use este workflow quando:

- a demanda ainda estiver em estudo;
- não houver validação mínima;
- houver risco sensível sem revisão;
- a intenção for criar tarefa automática.

## 4. Entrada esperada

- título da demanda;
- contexto resumido;
- origem;
- prioridade;
- responsável sugerido;
- prazo, se existir;
- riscos e pendências.

## 4.1. Modos de captura

### Alias textual

- `Adicionar ClickUp`
- `Adicionar no ClickUp`
- `Adicionar tarefa ClickUp`
- `Criar tarefa no ClickUp`
- `Jogar no ClickUp`
- `Colocar no ClickUp`
- Essas frases iniciam o mesmo fluxo do `/processar-demanda`

### Modo entrevista rápida

- Usar quando a entrada vier só com `Adicionar ClickUp` ou com poucos dados.
- Fazer perguntas curtas para completar o mínimo antes de criar a tarefa.
- Fazer no máximo 3 perguntas por vez.
- Não inventar prazo.
- Não inventar responsável.
- Se o usuário disser `sou eu`, usar `Vinicius`.
- Se o usuário disser `sem prazo`, usar `A definir`.
- Se o usuário disser `só anota`, usar modo simples.
- Se o usuário disser `detalha`, usar modo detalhado.
- Se o usuário disser `criar no ClickUp agora`, seguir o fluxo de aplicação real.

### Modo simples

- Usar quando a ideia for só registrar algo no ClickUp como lista de afazeres.
- Evitar descrição longa.
- Manter prazo e responsável como `A definir` quando não forem informados.
- Não mandar para Notion se for apenas anotação simples.

### Modo lista em lote

- Usar quando a entrada vier como vários itens em lista.
- Cada item vira uma tarefa simples separada.
- Se o texto disser `sem prazo`, `sem responsável` ou `só anota`, não perguntar sobre cada item individualmente.
- Fazer no máximo 3 perguntas se faltar uma configuração geral importante.
- Não inventar prazo.
- Não inventar responsável.
- Não mandar para Notion se for apenas lista rápida.

### Modo detalhado

- Usar quando a demanda precisar virar tarefa completa.
- Incluir checklist, contexto, risco, bloqueio e dependência quando existirem.
- Se faltar informação crítica, perguntar antes de montar a tarefa final.

### Perguntas de esclarecimento

- Fazer no máximo 3 perguntas por vez.
- Se faltar prazo, perguntar o dia desejado.
- Se faltar responsável, perguntar quem assume.
- Se faltar prioridade, perguntar se é baixa, média, alta ou urgente.
- Se houver dúvida sobre o nível de detalhe, perguntar se é anotação simples ou tarefa detalhada.
- Se houver dúvida sobre dependência, perguntar se existe bloqueio ou dependência.

## 5. Saída esperada

- registro estruturado da demanda para copiar no ClickUp;
- campos obrigatórios conferidos;
- pendências explícitas;
- indicação de fonte da verdade.
- possibilidade de saída simples ou detalhada conforme a necessidade.
- possibilidade de saída em lote simples com uma tarefa por item.

## 6. Agentes envolvidos

- **Agente Auditor**: confere consistência e clareza.
- **Agente Segurança**: bloqueia exposição sensível.
- **Agente Redator**: deixa o texto curto e copiável.

## 7. Etapas

1. Ler a demanda no `Viny Brain`.
2. Conferir se a demanda está pronta para execução.
3. Separar contexto, ação e pendências.
4. Montar o texto com campos mínimos para o ClickUp.
5. Conferir se nada sensível entrou no conteúdo.
6. Sinalizar que a criação no ClickUp será manual.
7. Se a demanda estiver incompleta, perguntar primeiro e não inventar dados.
8. Se for lote, validar o conjunto antes de gerar tarefas individuais.

## 8. Campos obrigatórios

- título;
- resumo;
- responsável;
- prioridade;
- prazo, se houver;
- status inicial;
- checklist básico;
- observações de risco.
- Em modo simples, `responsável` e `prazo` podem ficar como `A definir`.
- Em modo lote, cada item pode herdar os padrões `A definir` e `Média` quando não houver informação.

## 9. Checklist final

- [ ] Demanda validada
- [ ] Contexto resumido
- [ ] Responsável definido
- [ ] Prioridade definida
- [ ] Prazo definido ou marcado como ausente
- [ ] Risco revisado
- [ ] Nada sensível exposto
- [ ] Registro pronto para cópia manual

## 10. Prompt reutilizável

`Siga o workflow Enviar Demanda para ClickUp. Leia esta demanda, valide se ela está pronta para execução, organize os campos mínimos para criação manual no ClickUp, preserve a fonte da verdade no Viny Brain e não crie nada automaticamente.`

## 11. Regras adicionais da Fase 3

- Nunca forçar tarefa mal preenchida.
- Nunca inventar prazo, responsável ou prioridade.
- Nunca mandar para Notion se a demanda for apenas uma anotação simples.
- Sempre permitir um modo lista simples para captura rápida.
- Sempre permitir um modo lista em lote para captura rápida.
- Sempre reconhecer o gatilho textual `Adicionar ClickUp` como entrada do mesmo fluxo.
- Se houver autorização explícita para criação real, o fluxo pode sair do modo manual e seguir para `dry-run` e `--apply`.
- Se não houver autorização explícita, manter apenas JSON + comando e não aplicar nada.

## 12. Fluxo com autorização explícita

1. Receber a demanda.
2. Verificar se é simples, detalhada ou lote.
3. Verificar se existe autorização explícita para criar real no ClickUp.
4. Se não houver autorização, gerar apenas JSON + comando.
5. Se houver autorização:
   - salvar o payload em `18 - Integrações/API/payloads/`;
   - rodar `dry-run`;
   - validar a saída;
   - rodar `--apply`;
   - confirmar o resultado com nome da tarefa, lista destino, status, URL, se houver, e arquivo JSON usado.

## 13. Quando faltar informação

- Se a demanda estiver incompleta, perguntar antes de criar a tarefa quando faltar algo crítico.
- Campos críticos:
  - nome da tarefa;
  - se é simples ou detalhada;
  - prazo, se parecer importante;
  - responsável, se não for óbvio;
  - prioridade, se houver urgência.
- Regras:
  - não inventar prazo;
  - não inventar responsável;
  - se o usuário disser `sem prazo`, usar `A definir`;
  - se o usuário disser `sou eu`, usar `Vinicius`;
  - se o usuário disser `só anota`, usar modo simples;
  - se o usuário autorizar criação real mas faltar prazo ou responsável, perguntar no máximo 3 coisas;
  - se for anotação simples e o usuário disser `sem prazo e sem responsável`, não perguntar.
