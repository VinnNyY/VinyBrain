# Importar Playbooks

## 1. Objetivo

Documentar o processo para importar playbooks para a Base de Conhecimento de forma controlada, preservando metadados, separação de escopo e navegação útil, sem alterar playbooks já existentes.

## 2. Quando usar

Use este workflow quando:

- houver um lote novo a importar da planilha de origem;
- for necessário trazer playbooks temáticos para o vault;
- a Base de Conhecimento precisar crescer sem perder organização;
- houver limite de quantidade definido para a rodada;
- o lote precisar ser importado com rastreabilidade e auditoria posterior.

## 3. Entrada esperada

- tema/lote;
- planilha de origem;
- links dos Google Docs;
- limite de quantidade;
- categoria sugerida.

## 4. Agentes envolvidos

- **Agente Base de Conhecimento**: seleciona, organiza e classifica o lote.
- **Agente Auditor**: confere consistência, conectividade e utilidade.
- **Agente Segurança**: verifica origem, links e riscos sensíveis.
- **Agente Redator**: estrutura os arquivos Markdown e o resumo da importação.

## 5. Etapas

### Ler índice/planilha

1. Ler o Índice Geral.
2. Ler a planilha de origem.
3. Identificar títulos, status, autor, links e categoria sugerida.

### Selecionar lote temático

1. Escolher apenas o tema definido.
2. Confirmar se o lote faz sentido para a rodada.
3. Evitar misturar temas diferentes na mesma importação.

### Importar apenas quantidade definida

1. Respeitar o limite da rodada.
2. Registrar o que ficou para depois.
3. Não importar fora do escopo aprovado.

### Preservar metadados

1. Manter título, data, tipo, status, autor e origem.
2. Registrar o link original.
3. Registrar o link complementar quando existir.

### Separar interno/cliente

1. Confirmar se o conteúdo é interno.
2. Confirmar se existe versão para cliente.
3. Evitar misturar tutorial público com playbook interno.

### Criar arquivos Markdown

1. Criar um Markdown por playbook importado.
2. Usar o modelo de playbook importado.
3. Manter a estrutura esperada da Base de Conhecimento.

### Atualizar Índice Geral

1. Inserir a nova entrada na seção correta.
2. Manter os metadados coerentes.
3. Registrar a situação da importação.

### Atualizar Mapa por Temas

1. Inserir o playbook no tema correto.
2. Evitar duplicações sem relação.
3. Manter a navegação enxuta.

### Criar conexões internas naturais

1. Linkar apenas conteúdos relacionados de verdade.
2. Evitar criar hub artificial.
3. Priorizar utilidade real na navegação.

### Rodar auditoria do lote

1. Passar o lote pelo workflow `Auditar Playbooks`.
2. Verificar qualidade, organização e segurança.
3. Registrar pendências ou correções de estrutura.

## 6. Regras de conexão

- sempre linkar `[[Índice Geral]]`;
- sempre linkar `[[Mapa por Temas]]`;
- no máximo 3 links relacionados;
- sem links artificiais.
- não adicionar outros mapas globais por padrão;
- não repetir o mesmo link na mesma nota sem função editorial diferente;
- links relacionados precisam indicar relação operacional, fonte, continuidade ou navegação real.

## 7. Critérios de aprovação

O lote importado é aprovado quando:

- o limite da rodada foi respeitado;
- os metadados foram preservados;
- os links originais foram mantidos;
- a separação interno/cliente está clara;
- os arquivos Markdown foram criados;
- o Índice Geral foi atualizado;
- o Mapa por Temas foi atualizado;
- as conexões internas são naturais;
- a auditoria do lote foi executada;
- não houve exposição sensível.

## 8. Critérios de reprovação

Reprovar quando houver:

- importação fora do tema;
- quantidade maior que a definida;
- metadados alterados sem motivo;
- origem não preservada;
- mistura entre interno e cliente;
- links artificiais;
- Index Geral ou Mapa por Temas incoerentes;
- dados sensíveis no conteúdo;
- falta de auditoria do lote.

## 9. Checklist final

- [ ] Tema/lote conferido
- [ ] Planilha de origem lida
- [ ] Links dos Google Docs conferidos
- [ ] Limite de quantidade respeitado
- [ ] Categoria sugerida validada
- [ ] Metadados preservados
- [ ] Separação interno/cliente validada
- [ ] Markdown criado
- [ ] Índice Geral atualizado
- [ ] Mapa por Temas atualizado
- [ ] Conexões internas naturais
- [ ] Auditoria do lote executada
- [ ] Sem exposição sensível

## 10. Prompt reutilizável para importar novo lote

`Siga o workflow Importar Playbooks. Leia a planilha de origem e o Índice Geral, selecione apenas o lote temático e o limite definido, preserve os metadados e crie os arquivos Markdown sem alterar playbooks existentes.`

## 11. Prompt reutilizável para auditar lote importado

`Siga o workflow Auditar Playbooks. Revise o lote importado, confira metadados, links, status, separação interno/cliente, conexões e segurança, sem alterar os playbooks originais.`
