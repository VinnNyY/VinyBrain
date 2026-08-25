# Comandos Sanitizados

Data: 2026-07-31

## Comandos públicos usados

```bash
npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API
```

```bash
npx @staysdev/setup deploy
```

```bash
npx @staysdev/setup status
```

```bash
npx @staysdev/setup logs
```

```bash
npx @staysdev/setup disconnect
```

## Placeholders

- `SEU_TOKEN`: token temporário gerado no painel. O valor real não foi salvo.
- `URL_DA_API`: endpoint retornado pelo painel. O valor real não foi registrado nos arquivos finais.

## Observação do fluxo

O comando validado para atualizar um projeto já conectado foi:

```bash
npx @staysdev/setup deploy
```

O comando `deploy --new` retornou escopo insuficiente neste contexto e não foi usado no tutorial final.

## Segurança

Nenhum token, cookie, chave, variável de ambiente ou credencial foi salvo no Obsidian, no preview, no WordPress TXT, no SEO ou nos prints finais.
