# Fila de Aprovacao Humana

## Fluxo ideal

1. O detector encontra um ticket candidato.
2. O suporte revisa o resultado.
3. O suporte confirma cliente, dominio e plugin.
4. O suporte valida a whitelist.
5. O caso vira candidato para ativacao assistida apenas depois disso.
6. A ativacao real fica para uma fase futura.

## O que entra na fila

- tickets classificados como alta confianca;
- tickets que precisam revisao;
- tickets com plugin fora da whitelist;
- tickets com dominio ausente ou duvidoso;
- tickets com autorizacao nao comprovada.
- tickets com instalacao, licenca ou erro que ainda precisem leitura humana.
- tickets com score original alto, mas score final travado por gates criticos.

## O que nao entra

- tickets fechados ou resolvidos;
- tickets sem relacao com WordPress/plugin;
- tickets com conclusao clara;
- tickets com tema de SSL, DNS, e-mail ou financeiro.

## Regra operacional

A fila humana e o ponto de controle antes de qualquer automacao que altere ambiente real.

## Saidas da fila

- Markdown para leitura humana;
- JSON para outras rotinas locais;
- CSV para manipulação operacional.

## Prioridade operacional

- `fila_ativacao`: apenas ativacao clara com alta confianca.
- `revisar_instalacao`: pedido de instalacao.
- `revisar_licenca`: pedido de licenca.
- `revisar_erro_plugin`: pedido de erro no plugin.
- `revisar_pedido_generico`: pedido generico ou ativacao sem clareza suficiente.
- `ignorar`: nao relacionado, concluido ou fechado.
