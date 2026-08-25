# Registrar Reunião no Notion

## 1. Objetivo

Transformar anotações de reunião em um registro limpo para ser copiado manualmente para o `Notion`, mantendo a reunião formatada no Viny Brain como fonte de verdade.

## 2. Quando usar

Use este workflow quando:

- a reunião já tiver acontecido;
- houver pauta, decisões ou próximos passos;
- o material precisar ficar consultável e compartilhável;
- o registro for ser levado ao Notion de forma manual.

## 3. Quando não usar

Não use este workflow quando:

- a reunião ainda estiver em andamento;
- as anotações estiverem muito incompletas;
- houver risco de registrar dado sensível sem revisão;
- a intenção for publicar automaticamente.

## 4. Entrada esperada

- pauta;
- participantes;
- data;
- decisões;
- pendências;
- follow-ups;
- observações relevantes.
- link ou caminho da reunião em `19 - Reuniões/`, quando já existir.

## 5. Saída esperada

- ata resumida e organizada;
- bloco de decisões;
- bloco de pendências;
- bloco de próximos passos;
- indicação de que a publicação será manual.

## 6. Agentes envolvidos

- **Agente Redator**: estrutura a ata.
- **Agente Auditor**: confere clareza e consistência.
- **Agente Segurança**: bloqueia dados sensíveis.

## 7. Etapas

1. Preservar o conteúdo bruto em `19 - Reuniões/04 - Transcrições Originais/` e criar a revisão em `19 - Reuniões/01 - Em Revisão/`, quando aplicável.
2. Ler a reunião formatada em `19 - Reuniões/02 - Reuniões Formatadas/` ou as anotações ainda em revisão.
3. Separar pauta, decisão e pendência.
4. Reescrever em formato limpo e consultável.
5. Destacar o que deve virar página no Notion.
6. Remover qualquer dado sensível desnecessário.
7. Indicar que o registro final será manual, sem conectar APIs.

## 8. Campos obrigatórios

- título da reunião;
- data;
- participantes;
- resumo;
- decisões;
- pendências;
- próximos passos;
- responsável por follow-up, se houver.

## 9. Checklist final

- [ ] Reunião identificada
- [ ] Decisões separadas
- [ ] Pendências separadas
- [ ] Próximos passos separados
- [ ] Dados sensíveis revisados
- [ ] Texto pronto para cópia manual
- [ ] Fonte de verdade preservada em `19 - Reuniões/`

## 10. Prompt reutilizável

`Siga o workflow Registrar Reunião no Notion. Leia estas anotações de reunião, organize pauta, decisões, pendências e próximos passos em formato consultável, preserve a fonte da verdade no Viny Brain e não crie página automaticamente.`
