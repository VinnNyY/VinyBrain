# Estudo do Fluxo Real

Data: 2026-07-31

## Cenário encontrado

Cenário C — o usuário executa novamente o comando em um projeto já conectado.

Título final: `Como publicar uma nova versão pelo Deploy StayCloud`.

## Termos oficiais encontrados

- Área do painel: `Cloud`.
- Menu atual observado: `Deployments`.
- Botão/termo do painel: `Novo deploy`.
- Texto do painel: `Para atualizar produção, faça um novo deploy.`
- Descrição da área de deploys observada em validação anterior: `Reimplante ou inspecione os logs de qualquer deploy.`
- Status no painel: `pronto`.
- Status na CLI: `live`.

## Projeto de teste

Projeto reutilizado: `tutorial-deploy-cli-teste`.

Tecnologia: HTML estático simples.

URL pública descartável: `https://tutorial-deploy-cli-teste.stayai.space/`.

## Fluxo confirmado

1. Abrir `Cloud`.
2. Localizar o projeto de teste publicado.
3. Conferir a versão atual na URL pública.
4. Alterar um texto simples no `index.html`.
5. Executar `npx @staysdev/setup deploy` dentro da pasta do projeto conectado.
6. Aguardar o retorno `Deploy concluído`.
7. Conferir status `live` pela CLI.
8. Conferir status `pronto` no painel.
9. Abrir a URL pública e validar a nova versão.

## Comando validado

```bash
npx @staysdev/setup deploy
```

O comando `npx @staysdev/setup deploy --new` foi testado e retornou `Escopo insuficiente para esta operação` no projeto já conectado. Por isso, ele não foi usado no tutorial final.

## Resultado

A URL pública continuou a mesma no projeto descartável e passou a exibir `Versao 3 - atualizacao final de demonstracao`.

## Limitações

- Não foi validado rollback.
- Não foi validado domínio personalizado.
- Não foi validado zero downtime.
- Não foi validada atualização automática por GitHub.
- Não foi alterado projeto de cliente, Legacy Doc ou projeto comercial.
