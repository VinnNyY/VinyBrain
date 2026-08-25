# Comandos Sanitizados

Data: 2026-07-29

## Comandos públicos

```bash
npx @staysdev/setup help
```

```bash
npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API
```

```bash
npx @staysdev/setup deploy --new --name tutorial-deploy-cli-teste --subdomain tutorial-deploy-cli-teste
```

```bash
npx @staysdev/setup status
```

```bash
npx @staysdev/setup logs
```

## Placeholders

- `SEU_TOKEN`: token temporário gerado no painel. Nunca registrar valor real.
- `URL_DA_API`: URL oficial retornada no comando gerado pelo painel. Não registrar URL administrativa sensível se a interface mudar.
- `ID_DO_DEPLOY`: identificador interno do deploy. Não usar em prints finais.

## Segurança

O token real foi usado somente durante a execução local autorizada. Ele não foi salvo no Obsidian, no preview, no WordPress TXT, no SEO ou nos prints finais.
