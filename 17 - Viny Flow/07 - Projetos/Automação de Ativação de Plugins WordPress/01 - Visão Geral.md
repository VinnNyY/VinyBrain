# Visao Geral

Este projeto estuda uma automacao segura para atender tickets do `WHMCS` sobre ativacao de plugins em WordPress.

## Objetivo

Criar um detector local de tickets pendentes de ativacao de plugin WordPress, com apoio a triagem e aprovacao humana.

## Resultado esperado do MVP

- identificar tickets que parecem solicitacoes pendentes de ativacao;
- separar alta confianca, revisao e ignorados;
- gerar relatorio local em Markdown;
- apontar a fila de aprovacao humana;
- manter o projeto fora de qualquer integracao real.

## Escopo desta fase

Nesta fase o projeto e apenas de analise e desenho.

- Nenhuma integracao real.
- Nenhum acesso a WHMCS real.
- Nenhum acesso a WordPress real.
- Nenhuma ativacao de plugin.
- Nenhum armazenamento de credenciais.

## Ao final desta fase

Ao final desta fase, o projeto deve ter:

- detector local funcionando com JSON de teste;
- regras de deteccao editaveis;
- whitelist inicial de plugins;
- template de resposta pendente;
- fila de aprovacao humana documentada;
- backlog priorizado para evolucao futura.

## Principio central

Seguranca e validacao vem antes de automacao. Se faltar confirmacao, a acao deve parar e pedir intervencao humana.
