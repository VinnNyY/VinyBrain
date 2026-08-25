# Fluxo Atual do Suporte

## Cenario atual

O suporte recebe tickets no `WHMCS` pedindo ativacao de plugin em contas WordPress de clientes.

## Fluxo manual observado

1. O ticket chega ao suporte.
2. Um atendente le a solicitacao.
3. O atendente identifica o cliente e o dominio com base no conteudo do ticket e em consultas internas.
4. O atendente verifica o estado do servico.
5. O atendente localiza o ambiente WordPress correto.
6. O atendente confere se o plugin pedido e aceitavel.
7. Se necessario, o atendente pede confirmacao adicional.
8. O atendente executa a alteracao.
9. O atendente registra o retorno no ticket.

## Pontos de risco do processo atual

- variacao entre atendentes;
- risco de ativar plugin no dominio errado;
- risco de agir sem autorizacao clara;
- risco de misturar pedido de plugin com outras demandas;
- risco de nao registrar a revisao previa;
- risco de resposta inconsistente ao cliente.

## Problema a resolver

O fluxo atual depende demais de verificacao manual repetitiva. A automacao precisa reduzir trabalho operacional, mas sem remover as validacoes criticas.

