# Logs Sanitizados

Data: 2026-07-30

Os logs foram tratados como conteúdo potencialmente sensível. O tutorial usa somente linhas genéricas de build, sem IDs, tokens, chaves, variáveis de ambiente, e-mails, URLs administrativas, caminhos privados ou dados da conta.

## Exemplos Seguros

```text
deploy enfileirado no StayCloud
deploy iniciado no backend
fonte validada pelo painel StayCloud
artefato estático pronto (1 arquivos)
[DEPLOY] preparando pacote de publicação
[DEPLOY] pacote de publicação gerado
[DEPLOY] enviando pacote para publicação
[DEPLOY] pacote enviado para publicação
[DEPLOY] ambiente de publicação criado
[DEPLOY] iniciando publicação
[DEPLOY] publicação enfileirada
```

## Significado Editorial

- `deploy enfileirado`: o processamento entrou na fila.
- `fonte validada`: o painel conseguiu validar a origem do deploy.
- `artefato estático pronto`: os arquivos foram preparados para publicação.
- `pacote de publicação gerado`: o pacote foi criado.
- `publicação enfileirada`: o deploy seguiu para a etapa final de publicação.

Não foram copiados logs completos.
