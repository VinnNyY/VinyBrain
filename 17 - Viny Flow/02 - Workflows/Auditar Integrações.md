# Auditar Integrações

## 1. Objetivo

Revisar a arquitetura documental entre `Viny Brain`, `Notion` e `ClickUp` para evitar duplicidade, risco e uso inadequado.

## 2. Quando usar

Use este workflow quando:

- a documentação da integração crescer;
- houver dúvida sobre fonte da verdade;
- quiser validar se a divisão entre ferramentas continua saudável;
- for preciso revisar segurança antes de avançar para fase técnica.

## 3. Quando não usar

Não use este workflow quando:

- a integração ainda estiver no rascunho inicial;
- a tarefa for apenas editar um documento isolado;
- o objetivo for conectar API ou automatizar algo real.

## 4. Entrada esperada

- documentos de integração;
- mapa de dados;
- regras de segurança;
- decisões registradas;
- workflows manuais relacionados.

## 5. Saída esperada

- diagnóstico de duplicidade;
- risco de exposição;
- avaliação da fonte da verdade;
- recomendações de simplificação;
- lista do que pode esperar.

## 6. Agentes envolvidos

- **Agente Auditor**: avalia consistência estrutural.
- **Agente Segurança**: revisa risco e exposição.
- **Agente Memória/Checkpoint**: confirma coerência das decisões.
- **Agente Redator**: escreve o parecer final.

## 7. Etapas

1. Ler o plano e o mapa de dados.
2. Conferir se cada ferramenta tem função clara.
3. Procurar duplicidade entre ferramentas.
4. Procurar risco de registro sensível.
5. Verificar se os workflows manuais continuam coerentes.
6. Registrar o que precisa ser simplificado.

## 8. Campos obrigatórios

- ferramenta;
- função;
- tipo de dado;
- fonte da verdade;
- risco;
- recomendação;
- prioridade.

## 9. Checklist final

- [ ] Função do Viny Brain conferida
- [ ] Função do Notion conferida
- [ ] Função do ClickUp conferida
- [ ] Duplicidade conferida
- [ ] Segurança conferida
- [ ] Fonte da verdade conferida
- [ ] Recomendação registrada

## 10. Prompt reutilizável

`Siga o workflow Auditar Integrações. Leia os documentos de integração, o mapa de dados e as regras de segurança, identifique duplicidades, riscos e inconsistências, e devolva uma recomendação curta sem automatizar nada.`
