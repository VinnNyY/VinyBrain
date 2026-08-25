# API da lista de espera — Legacy Doc

Função serverless que cobre a parte dinamica da landing. A landing em si e
estatica e fica na StayCloud, que nao executa codigo no servidor.

## Por que existe

O Deploy StayCloud publica artefato estatico. Route Handlers do Next nao vao
para o artefato, entao gravar inscricoes e ler a contagem real precisa de um
runtime em outro lugar.

## Contrato

Identico ao handler local usado em desenvolvimento.

- `GET` devolve `{ count, goal }` com a contagem real.
- `POST` recebe `{ email, name?, company?, role?, codebaseSize?, language? }`
  e devolve `{ status, count, goal }`.
- `201` inscricao criada, `200` e-mail ja existente, `422` e-mail invalido,
  `400` payload invalido, `405` metodo nao suportado, `503` storage indisponivel.

## Passos para publicar

Nao executados. Dependem de conta Cloudflare e autorizacao.

1. `npx wrangler login`
2. `npx wrangler d1 create legacy-doc-waitlist`
3. Copiar o `database_id` retornado para `wrangler.toml`.
4. `npx wrangler d1 execute legacy-doc-waitlist --remote --file=./schema.sql`
5. Preencher `ALLOWED_ORIGINS` com a origem publicada da landing.
6. `npx wrangler deploy`
7. Anotar a URL do worker.

## Ligar a landing na API

No build de publicacao da landing:

```
STATIC_EXPORT=true NEXT_PUBLIC_WAITLIST_API=<url-do-worker> npm run build
```

Sem essa variavel, a secao esconde o formulario e informa que as inscricoes
abrem em breve, em vez de descartar inscricao em silencio.

## Privacidade

E-mail e dado pessoal. A funcao nao grava e-mail em log. O tratamento precisa
constar na politica de privacidade da landing, incluindo o provedor usado.
