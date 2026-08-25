# Checklist de Validacao Antes de Ativar Plugin

Este checklist permanece como referencia para fases futuras. O MVP atual nao executa ativacao.

Checklist obrigatorio antes de qualquer ativacao:

- Ticket confirmado?
- Cliente autorizou?
- Dominio identificado?
- Servico ativo?
- Dominio pertence ao cliente?
- Usuario `cPanel` identificado?
- Caminho WordPress confirmado?
- `WP-CLI` disponivel?
- Plugin esta na whitelist?
- Plugin ja esta instalado?
- Plugin nao esta ativo?
- Site nao aparenta erro critico antes da ativacao?
- Existe plano de reversao?
- A acao foi aprovada explicitamente?

## Regra de uso

Se qualquer resposta for nao, desconhecida ou incerta, a ativacao nao deve seguir.

## Saida esperada

- `OK` para continuar;
- `PENDENCIA` para bloqueio humano;
- `BLOQUEADO` quando houver risco ou falta de validacao.
