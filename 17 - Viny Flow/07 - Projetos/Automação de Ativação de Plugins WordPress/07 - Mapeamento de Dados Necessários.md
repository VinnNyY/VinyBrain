# Mapeamento de Dados Necessarios

## Dados de ticket

- id do ticket;
- data e hora;
- departamento;
- status;
- assunto;
- corpo da mensagem;
- urgencia;
- historico de respostas;
- indicacao de autorizacao explicita.

## Dados do cliente

- id do cliente no `WHMCS`;
- nome;
- e-mail principal;
- dominio associado;
- servico associado;
- status do servico.

## Dados tecnicos

- usuario `cPanel`;
- caminho da instalacao WordPress;
- existencia da instalacao;
- versao do WordPress, quando disponivel;
- lista de plugins instalados;
- status do plugin solicitado;
- origem do plugin, quando aplicavel;
- informacao de whitelist.

## Dados usados no detector local

- ticket_id;
- status;
- department;
- subject;
- message;
- customer_email;
- created_at;
- last_reply_by;
- cliente, quando informado no payload.

## Dados operacionais

- resultado do `dry-run`;
- aprovacao humana;
- plano de reversao;
- status de execucao;
- mensagem final para o ticket;
- identificador do responsavel pela execucao.

## Dados que nao devem ser persistidos em claro

- tokens;
- senhas;
- cookies;
- sessoes;
- licencas premium;
- qualquer credencial de acesso.
