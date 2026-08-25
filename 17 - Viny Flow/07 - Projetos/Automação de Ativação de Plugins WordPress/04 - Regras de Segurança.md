# Regras de Seguranca

## Regras fortes

- Nunca ativar plugin sem validar dominio, cliente, servico e caminho WordPress.
- Nunca ativar plugin desconhecido.
- Nunca instalar plugin premium sem origem validada.
- Nunca salvar licenca premium no vault.
- Nunca imprimir token `WHMCS`, senha `cPanel`, cookie ou credencial.
- Nunca executar como `root` se puder executar como usuario da conta.
- Nunca rodar comando destrutivo.
- Nunca mexer em banco de dados sem backup e confirmacao.
- Nunca alterar plugin em site de producao sem validacao minima.
- Sempre fazer `dry-run` primeiro.
- Sempre gerar log sem dados sensiveis.
- Sempre registrar quando precisar de intervencao humana.

## Regras de operacao

- Saida de log deve omitir segredos, cookies e tokens.
- Qualquer informacao sensivel deve ser mascarada antes de aparecer em relatorio.
- Toda execucao deve ser associada a um ticket e a um motivo claro.
- A whitelist de plugins deve ser explicitamente mantida e revisada.
- A automacao deve falhar de forma segura quando faltarem dados.

## Sinais de parada

- dominio nao pertence ao cliente;
- servico inativo;
- caminho WordPress nao confirmado;
- plugin fora da whitelist;
- plugin premium sem origem validada;
- ausencia de autorizacao explicita;
- site com erro critico aparente;
- falta de plano de reversao;
- ausencia de aprovacao para execucao real.

