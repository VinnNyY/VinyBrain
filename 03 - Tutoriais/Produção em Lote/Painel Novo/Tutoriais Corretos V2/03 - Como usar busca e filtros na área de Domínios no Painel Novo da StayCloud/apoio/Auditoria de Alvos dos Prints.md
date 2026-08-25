# Auditoria de Alvos dos Prints

Data: 2026-07-24

## Resultado geral

Status: aprovado localmente, aguardando validação de Vinicius.

Quantidade de prints finais: 4.

## Print 01

Arquivo: `prints-finais/01-menu-dominios-sanitizado.png`

- Texto do passo: abrir a área de Domínios.
- Alvo marcado: menu **Domínios**.
- Resultado: aprovado.
- Observação: há elementos de painel visíveis, mas a marcação não cobre o menu nem aponta para ação alternativa.

## Print 02

Arquivo: `prints-finais/02-campo-busca-dominios-sanitizado.png`

- Texto do passo: localizar o campo de busca.
- Alvo marcado: campo **Buscar domínio...**.
- Resultado: aprovado.
- Observação: a tela confirma o estado vazio da lista real.

## Print 03

Arquivo: `prints-finais/03-filtros-dominios-sanitizado.png`

- Texto do passo: utilizar os filtros disponíveis.
- Alvo marcado: grupo de filtros **todos**, **ativos**, **expirando em 30d**, **vencidos** e **cancelados**.
- Resultado: aprovado.
- Observação: o alvo agrupado é necessário porque o passo explica o conjunto de filtros, não uma aba isolada.

## Print 04

Arquivo: `prints-finais/04-resultado-busca-sanitizado.png`

- Texto do passo: conferir os resultados.
- Alvo marcado: área de resultado da lista.
- Resultado: aprovado.
- Observação: mostra a busca digitada, a mensagem **Nenhum domínio encontrado para esse filtro** e o contador **0 de 0 domínios**.

## Dados sensíveis

- Nome da conta substituído por **Conta de teste**.
- Domínio de exemplo usado na busca.
- Nenhum domínio real, e-mail, IP, ID, documento, valor ou dado financeiro ficou visível nos prints finais.

## Versões reprovadas

- `apoio/originais-e-versoes-antigas/04-filtros-dominios-sanitizado-reprovado.png`: reprovado porque marcou o seletor da conta, não os filtros.
- `apoio/originais-e-versoes-antigas/03-busca-preenchida-sanitizado-reprovado.png`: substituído por um print final mais útil de resultado vazio.
