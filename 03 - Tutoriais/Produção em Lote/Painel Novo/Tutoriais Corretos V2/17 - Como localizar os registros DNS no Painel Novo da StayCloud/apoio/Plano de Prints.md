# Plano de Prints

Tutorial: Como localizar os registros DNS no Painel Novo da StayCloud
Status: primeira fase local, bloqueado para publicação até recaptura atual do fluxo real.

## Objetivo visual

Usar entre 3 e 5 prints apenas para ensinar o cliente a localizar e consultar os registros ou dados de DNS da hospedagem no Painel Novo. O tutorial não deve ensinar criação de registro, troca de nameservers, configuração completa de Cloudflare ou alteração de DNS.

## Print 01 — Aba DNS

- Fonte esperada: print real fornecido por Vinicius.
- Status nesta execução: o arquivo fornecido não foi localizado no contexto local.
- Fonte temporária usada como apoio: captura antiga local do Painel Novo com a aba `DNS` visível.
- Arquivo sanitizado temporário: `prints-finais/print-01-aba-dns-sanitizado.png`.
- Texto relacionado: "Dentro da hospedagem, clique na aba DNS."
- Alvo único: `DNS`.
- Validação: a marcação aponta somente para `DNS` e não cobre a palavra.
- Pendência: substituir pela captura fornecida por Vinicius ou por nova captura atual do Painel Novo.

## Print 02 — Tela DNS

- Fonte esperada: captura atual da tela aberta após clicar em `DNS`.
- Status nesta execução: não capturado em ambiente atual porque a sessão autorizada do Painel Novo não estava disponível para automação.
- Fonte temporária usada como apoio: captura antiga local da área DNS, com modal de criação aberto.
- Arquivo sanitizado temporário: `prints-finais/print-02-tela-dns-apoio-sanitizado.png`.
- Alvo planejado: lista, card ou seção onde aparecem os registros ou dados DNS.
- Observação: a imagem de apoio não deve ser usada como print final do tutorial porque mostra um modal de criação, fora do escopo editorial.

## Print 03 — Identificar o registro

- Fonte esperada: captura atual da lista real de registros ou dados.
- Alvo planejado: conjunto mínimo onde aparecem tipo, nome/host e valor/destino, somente se esses campos existirem na interface atual.
- Status: pendente de validação real.

## Print 04 — Copiar informação

- Fonte esperada: captura atual do botão real de copiar, se existir.
- Alvo planejado: botão de copiar do dado necessário.
- Status: condicional. Não criar este print se a interface atual não tiver botão de copiar.

## Print 05 — Exemplo externo

- Decisão editorial: não criar por padrão.
- Motivo: o foco é Painel Novo da StayCloud. Cloudflare, Registro.br ou outro provedor entram apenas como contexto conceitual.

## Quality gate visual pendente

- Reabrir Painel Novo em conta própria autorizada.
- Capturar a tela atual da aba DNS.
- Sanitizar domínio, conta, IP, nameservers e qualquer dado identificador.
- Conferir cada print pelo encadeamento: texto -> alvo marcado -> próxima ação ou informação.
- Não publicar usando a captura de apoio do modal de criação.
