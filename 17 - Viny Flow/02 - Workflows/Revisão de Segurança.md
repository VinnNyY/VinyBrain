# Revisão de Segurança

## 1. Objetivo

Criar uma validação específica para evitar vazamento de credenciais, tokens, dados de cliente, IPs sensíveis, domínios reais sensíveis ou ações perigosas.

## 2. Quando usar

Use este workflow quando:

- houver qualquer risco de exposição sensível;
- a tarefa envolver prints, URLs, logs, comandos ou histórico;
- houver dúvida sobre credenciais, tokens, senhas ou dados reais;
- a entrega puder ter impacto fora do vault.

## 3. Quando não usar

Não use este workflow quando:

- a tarefa for puramente conceitual e sem risco sensível;
- já houver um bloqueio claro que inviabilize a execução;
- outro controle de segurança mais específico já cobrir a frente inteira.

## 4. Entrada esperada

- arquivos da sessão;
- comandos ou prompts usados;
- prints ou referências visuais;
- histórico e checkpoint;
- qualquer conteúdo potencialmente sensível.

## 5. Agentes envolvidos

- **Agente Segurança**: faz a checagem principal de risco e exposição.
- **Agente Auditor**: confirma consistência, escopo e aderência ao fluxo.
- **Agente Memória/Checkpoint**: valida o que pode entrar no histórico e no checkpoint.

## 6. Etapas

### 1. Revisar credenciais e segredos

1. Procurar credenciais, tokens e senhas.
2. Procurar chaves, cookies ou dados equivalentes.
3. Bloquear qualquer registro que exponha segredos.

### 2. Revisar dados de cliente e ambiente

1. Procurar dados reais de cliente.
2. Procurar IPs sensíveis.
3. Procurar domínios reais que não devam ser registrados.

### 3. Revisar comandos e ações perigosas

1. Procurar comandos destrutivos.
2. Procurar instruções de instalação ou alteração fora do escopo.
3. Procurar ações que saiam do vault ou do fluxo aprovado.

### 4. Revisar mídia, URLs e integrações

1. Procurar prints com informação sensível.
2. Procurar URLs internas desnecessárias.
3. Procurar referências a WordPress, Google Drive ou outras integrações que não devam receber dado sensível.

### 5. Revisar histórico e checkpoint

1. Confirmar que histórico e checkpoint não guardam segredos.
2. Confirmar que o registro está curto e seguro.
3. Remover detalhes que não precisam ficar persistidos.

## 7. Critérios de aprovação

A revisão é aprovada quando:

- não há credenciais, tokens ou senhas expostos;
- não há dados reais de cliente registrados;
- não há IPs ou domínios sensíveis expostos;
- não há comandos perigosos normalizados sem necessidade;
- não há alteração fora do vault;
- histórico e checkpoint estão seguros;
- a entrega pode seguir sem risco relevante.

## 8. Critérios de reprovação

Reprovar quando houver:

- segredo exposto;
- dado de cliente salvo sem necessidade;
- print com informação sensível;
- IP ou domínio sensível exposto;
- comando perigoso normalizado;
- ação fora do vault;
- histórico ou checkpoint com detalhe sensível.

## 9. Checklist final

- [ ] Credenciais revisadas
- [ ] Tokens revisados
- [ ] Senhas revisadas
- [ ] Dados de cliente revisados
- [ ] Prints revisados
- [ ] URLs internas revisadas
- [ ] IPs revisados
- [ ] Comandos perigosos revisados
- [ ] Alterações fora do vault revisadas
- [ ] Histórico e checkpoint revisados

## 10. Prompt reutilizável

`Siga o workflow Revisão de Segurança. Revise estes arquivos e identifique credenciais, tokens, senhas, dados de cliente, IPs, domínios sensíveis, comandos perigosos, alterações fora do vault e riscos no histórico ou checkpoint, sem alterar os arquivos originais.`

