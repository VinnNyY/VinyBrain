# Regras de Detecção

## Palavras-chave

As regras usam listas editaveis para:

- acao;
- pendencia;
- ignorar;
- contexto WordPress;
- plugins de alta confianca;
- sinais de conclusao.
- installacao, licenca e erro ajudam a definir o tipo de solicitacao.

Depois do score inicial, gates criticos limitam o score final para evitar falso positivo.

## Status considerados pendentes

- Open
- Customer-Reply
- In Progress
- Answered

## Status ignorados

- Closed
- Resolved

## Sinais de conclusao

- ativado com sucesso;
- plugin ativado;
- ja esta ativo;
- já está ativo;
- concluido;
- concluído.

## Como reduzir falso positivo

- exigir combinacao de status + contexto + plugin;
- validar whitelist antes de subir para alta confianca;
- rebaixar ticket quando houver sinal de conclusao;
- tratar assuntos genericos como revisão, nao como ativacao;
- diferenciar ativacao, instalacao, licenca e erro;
- ignorar tickets fechados ou resolvidos.
- travar alta confiança quando `tipo_solicitacao` nao for `ativacao_plugin`.
- travar alta confiança quando o plugin ou o dominio nao forem identificados.

## Como melhorar precisao no futuro

- criar score numerico;
- usar sinônimos por plugin;
- incluir padroes de dominio e cliente;
- acrescentar regras para instalacao vs ativacao vs licenca;
- usar export real anonimizados para calibracao;
- mapear casos que viraram falso positivo ou falso negativo.
