# Estudo do Fluxo Real

Data: 2026-07-29

## Objetivo

Validar como o primeiro deploy é feito no sistema Cloud/Deploy do Painel Novo da StayCloud.

## Forma Real Utilizada

Fluxo validado por painel com `Upload de .zip`.

O painel também mostrou opções para GitHub e CLI, mas elas não foram usadas neste tutorial para evitar repositório privado e token de conexão.

## Localização no Painel

- Menu lateral: `Deploy`.
- Produto exibido: `Cloud`.
- Tela de criação: `Novo projeto`.

## Pré-requisitos Confirmados

- Deploy/Cloud ativo na conta.
- Arquivo `.zip` com build estático pronto.
- Limite exibido pela interface: varia conforme o plano. No plano validado, o painel mostrou o limite disponível para upload.
- Nome do projeto em letras minúsculas, formato kebab e entre 3 e 32 caracteres.

## Passos Validados

1. Abrir `Deploy`.
2. Clicar em `Novo projeto`.
3. Usar `Upload de .zip`.
4. Selecionar `tutorial-deploy-teste.zip`.
5. Preencher `NOME DO PROJETO` com `tutorial-deploy-teste`.
6. Clicar em `criar e implantar`.
7. Acompanhar a tela `Implantando`.
8. Conferir o status `publicando`.
9. Confirmar o projeto como `pronto`.
10. Confirmar o indicador `No ar`.
11. Abrir a aplicação publicada.

## Mensagens e Estados Reais

- `Vamos criar algo novo`.
- `Upload de .zip`.
- `selecionar arquivo .zip`.
- `NOME DO PROJETO`.
- `criar e implantar`.
- `Implantando tutorial-deploy-teste`.
- `publicando`.
- `Publicando serviço`.
- `Logs de build`.
- `deploy enfileirado no StayCloud`.
- `fonte validada pelo painel StayCloud`.
- `artefato estático pronto`.
- `pronto`.
- `No ar`.

## Resultado Final

O projeto `tutorial-deploy-teste` foi publicado.

URL pública: `https://tutorial-deploy-teste.stayai.space`

HTTP: 200

Conteúdo exibido: página estática `Tutorial Deploy Teste`.

## Segurança

Nenhum token foi usado no fluxo documentado.

O comando de CLI apareceu no painel, mas foi tratado como fora de escopo e mantido sanitizado nos relatórios.

Não houve uso de repositório privado, domínio real, DNS, credencial ou dado de cliente.

## Limitações

Este tutorial não cobre:

- GitHub;
- CLI;
- domínio personalizado;
- variáveis de ambiente;
- logs avançados;
- redeploy;
- exclusão de projeto.
