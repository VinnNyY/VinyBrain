# Extrair Aprendizados da Sessão

## 1. Objetivo

Transformar aprendizados reais da sessão em memória operacional, sem salvar credenciais ou dados sensíveis.

## 2. Quando usar

Use este workflow quando:

- a sessão terminar com decisões úteis para reaproveitar;
- houver padrões que deram certo ou errado;
- for preciso atualizar histórico e checkpoint com base no que aconteceu;
- a sessão gerar correções importantes para o Viny Flow ou para a Base de Conhecimento.

## 3. Quando não usar

Não use este workflow quando:

- a sessão foi puramente executiva e não deixou aprendizado relevante;
- o material ainda estiver incompleto demais para virar memória útil;
- houver risco de registrar dados sensíveis sem necessidade.

## 4. Entrada esperada

- resumo do que foi feito;
- decisões tomadas;
- arquivos criados e alterados;
- pendências;
- riscos identificados;
- próximo passo provável.

## 5. Agentes envolvidos

- **Agente Memória/Checkpoint**: consolida o aprendizado em checkpoint e histórico.
- **Agente Auditor**: valida consistência e utilidade do aprendizado.
- **Agente Segurança**: bloqueia credenciais, tokens, IPs e dados sensíveis.
- **Agente Redator**: resume o aprendizado em texto curto e legível.

## 6. Etapas

### 1. Ler o fechamento da sessão

1. Ler o que foi concluído.
2. Ler o que ficou pendente.
3. Ler o que mudou no vault.

### 2. Separar o que vale guardar

1. Identificar decisões importantes.
2. Identificar padrões que funcionaram.
3. Identificar padrões que falharam.
4. Ignorar ruído e detalhe irrelevante.

### 3. Capturar correções e regras novas

1. Registrar ajustes que melhoram o fluxo.
2. Registrar cuidados que evitaram erro.
3. Registrar novas regras operacionais, se houver.

### 4. Registrar próximos passos

1. Indicar a próxima ação concreta.
2. Indicar o próximo workflow, se fizer sentido.
3. Indicar o que não deve ser repetido.

### 5. Atualizar histórico e checkpoint

1. Atualizar o histórico do dia.
2. Atualizar o checkpoint atual.
3. Manter a leitura curta e fácil de retomar.

## 7. Critérios de aprovação

O aprendizado é aprovado quando:

- as decisões ficaram registradas;
- os padrões úteis ficaram claros;
- os erros ou riscos ficaram descritos;
- o próximo passo ficou explícito;
- o histórico e o checkpoint foram atualizados;
- nada sensível foi salvo.

## 8. Critérios de reprovação

Reprovar quando houver:

- aprendizado vago demais;
- decisão importante esquecida;
- padrão útil perdido no texto;
- risco ignorado;
- dados sensíveis registrados;
- histórico ou checkpoint incoerente;
- próximo passo ausente.

## 9. Checklist final

- [ ] Decisões registradas
- [ ] Padrões úteis registrados
- [ ] Padrões ruins registrados
- [ ] Correções registradas
- [ ] Regras novas registradas
- [ ] Próximos passos registrados
- [ ] Histórico atualizado
- [ ] Checkpoint atualizado
- [ ] Sem dados sensíveis

## 10. Prompt reutilizável

`Siga o workflow Extrair Aprendizados da Sessão. Leia o fechamento da sessão, identifique decisões, padrões, correções e próximos passos, atualize o histórico e o checkpoint, e não registre credenciais nem dados sensíveis.`

