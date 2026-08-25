# Regras de Segurança - Integrações

## Regras fortes

- Nunca salvar tokens no Obsidian.
- Nunca salvar API keys no histórico.
- Nunca salvar credenciais no checkpoint.
- Quando chegar a fase de API, usar `.env` fora do vault.
- Não sincronizar dados sensíveis de cliente sem revisão.
- Não enviar prints com dados sensíveis.
- Não criar tarefa em ClickUp automaticamente na fase inicial.
- Não criar página em Notion automaticamente na fase inicial.
- Qualquer API real deve passar por `Revisão de Segurança` antes.

## Regras operacionais

- Se um dado puder expor cliente, ambiente ou operação, ele fica fora do vault até revisão.
- Se a integração gerar duplicidade de verdade, a fonte principal precisa ser definida antes de publicar.
- Se houver dúvida sobre sensibilidade, tratar como sensível.
- Se houver dúvida sobre automação, manter manual.

## O que não fazer

- Não registrar login, senha, token, cookie, chave ou segredo.
- Não registrar URLs internas desnecessárias.
- Não registrar IPs sensíveis.
- Não registrar prints de tela com dados reais.
- Não ativar integração real sem validação explícita.

## Validação obrigatória

- Reuniões, demandas e decisões só devem sair do manual para uma integração real após revisão humana.
- Nenhuma automação deve ser considerada pronta só porque a documentação existe.
- Mesmo na Fase 3, credenciais continuam fora do vault.
- Mesmo na Fase 3, manter `dry-run` como validação antes de qualquer escrita real.
- Mesmo na Fase 3, payloads devem ser tratados como entrada operacional e revisados antes de `--apply`.
- Se faltar prazo, responsável ou prioridade, perguntar antes de gerar o JSON final.
- Nunca inventar dados para completar a tarefa.
