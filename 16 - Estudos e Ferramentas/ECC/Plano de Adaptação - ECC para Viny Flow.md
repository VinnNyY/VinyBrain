# Plano de Adaptação - ECC para Viny Flow

## Objetivo

Levar para o Viny Flow apenas os padrões que aumentam clareza, segurança, retomada e qualidade de decisão.

## Adaptar agora

### 1. Auditoria de contexto

Criar uma rotina simples para medir quando a sessão está ficando pesada e quando vale fechar com checkpoint.

**Como fazer agora**

- adicionar uma leitura rápida de contexto antes de tarefas grandes;
- registrar o que já foi confirmado e o que ainda está aberto;
- reduzir o escopo quando houver excesso de arquivos ou de risco.

### 2. Auditoria de skills, agentes e workflows

Criar um inventário curto do que existe, do que é útil e do que já ficou redundante.

**Como fazer agora**

- revisar periodicamente os mapas de agentes e workflows;
- marcar duplicidades;
- manter o que realmente ajuda o fluxo.

### 3. Extração de aprendizados da sessão

Transformar descobertas recorrentes em notas reutilizáveis.

**Como fazer agora**

- registrar padrões de decisão;
- apontar o que funcionou e o que não funcionou;
- atualizar o histórico e o checkpoint com linguagem curta e auditável.

## Adaptar depois

### 1. Sistema de voz reutilizável

Quando houver mais material local, vale criar um `brand voice` do Viny Brain.

### 2. Pesquisa com separação de evidência

Um fluxo de pesquisa mais formal pode entrar depois, quando houver necessidade recorrente de comparação ou investigação.

### 3. Controle leve de qualidade

Uma versão local de `verification-loop` pode ser adaptada para revisar docs, playbooks e mudanças mais sensíveis.

## Não adaptar

- hooks automáticos como base da operação;
- MCP como camada central;
- instalação global de qualquer coisa;
- scripts do ECC como dependência do Viny Brain;
- catálogo multi-harness completo;
- release machinery pública do ECC;
- comandos que existem só para a ergonomia do plugin ECC.

## Sequência recomendada

1. Criar um checklist curto de auditoria de contexto.
2. Criar um checklist curto de auditoria de skills e workflows.
3. Formalizar o hábito de extrair aprendizados em checkpoint e histórico.
4. Só depois pensar em voice profile e pesquisa mais sofisticada.
