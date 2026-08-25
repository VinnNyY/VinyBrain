# Estudo do Fluxo Real

Data: 2026-07-30

Tutorial: `Como consultar o status e os logs de um deploy na StayCloud`

## Cenário Validado

Cenário A — existem status e logs oficiais no painel.

O título aprovado para a fase local é `Como consultar o status e os logs de um deploy na StayCloud`.

## Onde o Recurso Aparece

O produto aparece no painel como `Cloud`, com subtítulo `deploy de git`. Dentro do projeto descartável, o menu lateral do projeto apresenta:

- `Visão geral`;
- `Deploys`;
- `Logs`;
- `Domínios`;
- `Variáveis`.

## Projeto Utilizado

Projeto descartável: `tutorial-deploy-cli-teste`.

Uso: projeto estático simples, criado para os tutoriais do Deploy, sem dados pessoais, sem formulário, sem banco de dados, sem variáveis secretas e sem integração externa.

## Fluxo Confirmado

1. Acessar `Cloud`.
2. Abrir o projeto descartável.
3. Conferir `IMPLANTAÇÃO DE PRODUÇÃO`.
4. Ler o campo `status`.
5. Abrir `ver todos os deploys` ou a aba `Deploys`.
6. Conferir o registro do deploy.
7. Abrir `Logs`.
8. Ler os logs de build.
9. Usar os filtros `Todos`, `Info · OK`, `Alertas` e `Erros · Fatal` quando necessário.
10. Usar `Abrir` para acessar a aplicação publicada.

## Estados e Indicadores Observados

- Projeto: `online`.
- Status de implantação: `pronto`.
- Fase: `live`.
- Duração observada: `23s`.
- Painel de deploys: `Total`, `Produção`, `Build · Ativos`, `Falha`.
- Filtros de execução: `Todas as branches`, `Todos os autores`, `Últimos 30 dias`.
- Filtros de log: `Todos`, `Info · OK`, `Alertas`, `Erros · Fatal`.

## Logs Confirmados

A aba `Logs` existe e mostra logs de build do último deploy. O painel informa que os logs atualizam sozinhos a cada 2s.

Limitação oficial observada: logs de runtime do site no ar ainda não aparecem nessa visão.

## Segurança

IDs, domínio, URL administrativa e dados da conta foram censurados nos prints finais. Os exemplos de log usados no tutorial são linhas genéricas e seguras. Nenhum token, chave, cookie, variável de ambiente ou credencial foi salvo.
