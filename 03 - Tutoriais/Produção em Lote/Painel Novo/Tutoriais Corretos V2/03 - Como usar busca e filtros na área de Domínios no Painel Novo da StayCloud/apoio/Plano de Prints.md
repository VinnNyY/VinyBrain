# Plano de Prints

Tutorial: Como usar busca e filtros na área de Domínios no Painel Novo da StayCloud

## Fluxo real validado

- Menu real: **Domínios**.
- Tela real: **Seus domínios**.
- Campo real: **Buscar domínio...**.
- Filtros reais em abas: **todos**, **ativos**, **expirando em 30d**, **vencidos** e **cancelados**.
- Estado real da conta de teste: **Nenhum domínio encontrado para esse filtro** e **0 de 0 domínios**.

## Prints finais

### PRINT 01

Arquivo: `prints-finais/01-menu-dominios-sanitizado.png`

Objetivo: mostrar onde entrar.

Alvo principal: menu **Domínios**.

Validação: alvo único, marcação no menu correto, sem cobrir texto do menu.

### PRINT 02

Arquivo: `prints-finais/02-campo-busca-dominios-sanitizado.png`

Objetivo: mostrar onde digitar o nome ou parte do domínio.

Alvo principal: campo **Buscar domínio...**.

Validação: alvo único, marcação no campo correto, sem cobrir o placeholder.

### PRINT 03

Arquivo: `prints-finais/03-filtros-dominios-sanitizado.png`

Objetivo: mostrar os filtros realmente disponíveis.

Alvo principal: grupo de filtros da lista de domínios.

Validação: alvo único agrupado porque o passo explica o conjunto de filtros disponíveis.

### PRINT 04

Arquivo: `prints-finais/04-resultado-busca-sanitizado.png`

Objetivo: mostrar como interpretar uma busca sem resultado.

Alvo principal: área de resultado da lista.

Validação: alvo único, mostra a mensagem vazia e o contador **0 de 0 domínios**.

## Dados sensíveis

- Nome da conta substituído por **Conta de teste**.
- Domínios reais substituídos por domínio de exemplo quando detectados.
- Nenhum e-mail, IP, ID, valor financeiro ou documento ficou visível nos prints finais.

## Observação

Uma primeira versão do print de filtros marcou o seletor de conta por erro de seleção. Essa versão foi reprovada e movida para `apoio/originais-e-versoes-antigas/`.
