# Auditar Governança do Viny Brain

## 1. Objetivo

Verificar se o `Viny Brain` está organizado, conectado, coerente e seguro como vault operacional, sem aplicar correções automaticamente.

## 2. Quando usar

Use este workflow quando:

- o vault crescer demais;
- houver novas áreas;
- forem importados playbooks ou tutoriais em lote;
- agentes ou workflows novos forem adicionados;
- um checkpoint importante estiver perto;
- houver suspeita de bagunça estrutural;
- for hora de uma revisão geral periódica.

## 3. Quando não usar

Não use quando:

- a tarefa for apenas criar conteúdo isolado;
- já existir um fluxo mais específico para a entrega principal;
- não houver autorização para auditar o vault inteiro;
- a ideia for mover, apagar ou renomear arquivos sem aprovação;
- a revisão depender de automação externa.

## 4. Entrada esperada

- objetivo da auditoria;
- área do vault em escopo;
- arquivos-base e mapas a ler;
- checkpoint e histórico relevantes;
- dúvidas específicas sobre organização, links ou segurança.

## 5. Agentes envolvidos

- `Agente Governança do Viny Brain`: conduz a leitura estrutural do vault.
- `Agente Auditor`: identifica inconsistências, lacunas e duplicações.
- `Agente Segurança`: revisa risco, exposição e comandos perigosos.
- `Agente Memória/Checkpoint`: confere continuidade e registro de decisões.
- `Agente Redator`: organiza o relatório final em linguagem curta.

## 6. Etapas

### 1. Definir o escopo

1. Registrar qual área será auditada.
2. Separar o que é estudo, operação e documentação final.
3. Confirmar se a auditoria é geral ou temática.

### 2. Ler a estrutura-base

1. Ler `17 - Viny Flow/README.md`.
2. Ler `Mapa de Agentes`, `Mapa de Workflows` e `Comandos Reutilizáveis`.
3. Ler `MOC - Viny Brain` e `Painel Operacional - Viny Brain`.
4. Ler `Índice Geral` e `Mapa por Temas` quando a auditoria tocar conhecimento.

### 3. Auditar organização

1. Verificar se as áreas têm nomes claros.
2. Verificar se existem pastas duplicadas.
3. Verificar se há arquivos fora do lugar.
4. Verificar se lotes reprovados ficaram arquivados corretamente.

### 4. Auditar conexões

1. Conferir links quebrados.
2. Conferir notas órfãs.
3. Conferir MOCs e índices desatualizados.
4. Conferir se agentes e workflows estão conectados entre si.

### 5. Auditar padrão e coerência

1. Conferir se arquivos têm título, objetivo, status e próximo passo.
2. Conferir se tutoriais seguem o padrão local.
3. Conferir se playbooks têm problema, causa, solução e risco.
4. Conferir se o conteúdo interno não foi misturado com conteúdo para cliente.

### 6. Auditar segurança

1. Procurar credenciais, tokens, senhas ou cookies.
2. Procurar instruções perigosas sem alerta.
3. Procurar referências indevidas a WordPress, Notion ou ClickUp.
4. Procurar arquivos sensíveis fora do padrão esperado.

### 7. Registrar achados e pedir aprovação

1. Classificar o que é `P0`, `P1` e `P2`.
2. Listar correções sugeridas, sem executar.
3. Pedir aprovação antes de qualquer alteração real.

## 7. Saída esperada

O workflow deve produzir um relatório com:

- status geral: saudável, atenção ou crítico;
- problemas encontrados;
- arquivos fora do lugar;
- links quebrados;
- notas órfãs;
- duplicações prováveis;
- áreas sem `README`;
- índices desatualizados;
- riscos de segurança;
- recomendações `P0`, `P1` e `P2`;
- correções sugeridas, mas não executadas;
- próximo passo seguro.

## 8. O que pode e não pode ser alterado

### Pode

- gerar relatório;
- apontar pendências;
- sugerir reorganização;
- sugerir atualização de mapas;
- sugerir revisão de padrões.

### Não pode

- apagar arquivos;
- mover pastas;
- renomear em massa;
- alterar conteúdo do vault sem aprovação;
- tocar em WordPress, Notion ou ClickUp;
- executar automação externa;
- chamar API externa.

## 9. Como gerar relatório

1. Reunir os achados por tema.
2. Separar por severidade.
3. Indicar o que é estrutural, o que é de conteúdo e o que é de segurança.
4. Finalizar com um próximo passo seguro.

## 10. Como pedir aprovação antes de corrigir

1. Listar a correção sugerida.
2. Explicar o impacto esperado.
3. Dizer claramente que nada foi alterado ainda.
4. Aguardar confirmação explícita.

## 11. Checklist final

- [ ] Escopo definido
- [ ] Estrutura-base lida
- [ ] Organização conferida
- [ ] Conexões conferidas
- [ ] Padrões conferidos
- [ ] Segurança conferida
- [ ] Severidade classificada
- [ ] Correções sugeridas sem execução
- [ ] Aprovação solicitada antes de mexer
- [ ] Relatório pronto

## 12. Prompt reutilizável

`Siga o workflow Auditar Governança do Viny Brain. Verifique estrutura, links, MOCs, tutoriais, playbooks, agentes, workflows e riscos de segurança, gere um relatório com prioridades e não corrija nada sem aprovação.`
