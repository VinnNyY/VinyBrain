# Guia - Como Formalizar Reuniões de Suporte

Este guia orienta o Codex a transformar anotações e transcricoes brutas de `Daily Suporte` e `Weekly Suporte` em ata formal, clara e pronta para coordenacao.

## Objetivo

Padronizar o processo de leitura, interpretacao, formalizacao, revisao e entrega final sem inventar informacao.

## Passo a passo

1. Ler o texto bruto inteiro antes de reescrever.
2. Identificar se a reuniao e `Daily Suporte` ou `Weekly Suporte`.
3. Identificar a data da reuniao.
4. Identificar participantes, se houver nomes citados.
5. Remover gírias, abreviacoes e frases truncadas sem mudar o sentido.
6. Transformar frases soltas em texto formal e coerente.
7. Separar fatos, decisões, pendências, bloqueios e acoes.
8. Nao inventar responsavel, prazo ou decisao.
9. Marcar `Não informado` quando faltar dado.
10. Criar uma versao pronta para coordenacao.
11. Gerar o Markdown final.
12. Gerar o HTML de revisao.
13. Gerar o PDF final, se houver ferramenta local disponivel, com prioridade para `google-chrome` em modo headless.

## Regras de formalizacao

- trocar linguagem informal por formal;
- manter o significado original;
- remover expressoes coloquiais;
- organizar ideias em ordem logica;
- deixar claro o que foi dito, o que foi decidido e o que ficou pendente;
- nao ampliar o conteudo alem da transcricao;
- nao transformar suposicao em fato.

## Exemplos de formalizacao

### Exemplo 1

Texto bruto:

`hj teve mt ticket de email, geral perdido com dns`

Texto formal:

`Foi identificado um volume elevado de tickets relacionados a e-mail, principalmente envolvendo dúvidas sobre configuração de DNS.`

### Exemplo 2

Texto bruto:

`fulano ficou de ver isso dps`

Texto formal:

`Ficou pendente a validacao desse ponto pelo responsavel mencionado, porém o nome e o prazo nao foram informados.`

### Exemplo 3

Texto bruto:

`deu ruim no ssl de alguns clientes`

Texto formal:

`Foram relatadas dificuldades pontuais na emissao de SSL para alguns clientes.`

### Exemplo 4

Texto bruto:

`tem q melhorar isso ai`

Texto formal:

`Foi registrada a necessidade de melhoria nesse processo.`

## Como lidar com ausencias

- se o tipo da reuniao nao estiver claro, pedir confirmacao;
- se a data nao estiver clara, pedir confirmacao;
- se o participante não estiver claro, registrar `Não informado`;
- se a ação não tiver responsável, registrar `Não informado`;
- se a ação não tiver prazo, registrar `Não informado`;
- se uma decisao estiver implícita, mas nao declarada, mover para `Pontos a confirmar`.

## Como gerar a versao final

1. Preencher o template correspondente.
2. Conferir se o texto ficou profissional.
3. Conferir se fatos e opinioes nao foram misturados.
4. Gerar o HTML de revisao em `02 - Em Revisão/`.
5. Gerar o Markdown final em `03 - Reuniões Concluídas/`.
6. Revisar visualmente o HTML.
7. Gerar o PDF final em `04 - PDFs/` usando `google-chrome` headless quando estiver disponivel.
8. Se `google-chrome` nao estiver disponivel, considerar `wkhtmltopdf`, `pandoc`, `chromium` ou `libreoffice`, nesta ordem de apoio.

## Validação final

Antes de encerrar, verificar se:

- o tipo da reuniao foi identificado;
- a data foi identificada;
- os participantes foram identificados, quando possivel;
- as gírias foram formalizadas;
- o texto ficou profissional;
- nao houve invenção de informacao;
- as pendencias ficaram claras;
- as decisões ficaram separadas das opinioes;
- as próximas ações têm responsável e prazo ou `Não informado`;
- o PDF foi gerado ou a limitacao tecnica foi registrada;
- o arquivo foi salvo no local correto.

## Status do fluxo

O fluxo foi testado com `Daily Suporte` e `Weekly Suporte` e está aprovado para uso real.

### Comando base de referência para PDF

```bash
google-chrome --headless --disable-gpu --print-to-pdf="CAMINHO-SAIDA.pdf" "file://CAMINHO-HTML.html"
```
