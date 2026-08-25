# Estudo da CLI ou Comando

Data: 2026-07-29

## Cenário Identificado

Cenário A — existe ferramenta real executável por CLI.

Título escolhido: `Como instalar e usar a CLI do Deploy StayCloud`.

Motivo: o painel usa o rótulo `Deploy via CLI`, o pacote público `@staysdev/setup` existe no npm e o comando foi executado com sucesso pelo terminal.

## Nome Oficial

- Pacote: `@staysdev/setup`
- Binário declarado: `staycloud`
- Versão validada: `0.1.3`
- Execução oficial exibida no painel: `npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API`

## Respostas da Validação

1. Existe uma CLI própria da StayCloud? Sim, via pacote `@staysdev/setup`.
2. Existe pacote para instalação? Sim, pacote npm público executado com `npx`.
3. Nome oficial da ferramenta: `@staysdev/setup`.
4. Comando oficial: `npx @staysdev/setup init`.
5. A CLI exige login? Exige conexão por token temporário gerado no painel.
6. Autenticação: token temporário no comando gerado.
7. O comando é individual? Sim, gerado no painel com validade temporária.
8. Precisa estar na pasta do projeto? Sim, a CLI publica os arquivos do diretório atual.
9. Sistemas suportados: validado em Ubuntu local; pacote exige Node.js 18 ou superior.
10. Agentes citados: painel menciona IA favorita; tela pública cita Claude, GPT, v0 e outras IAs.
11. Deploy pela CLI: sim, validado com `deploy --new`.
12. Retorno: URL pública e status validado por HTTP 200/painel.
13. Risco de expor token: sim; token deve ser censurado.
14. Comando de remoção: pacote possui `disconnect`, usado apenas para revogar a credencial local após validação.

## Fluxo Real Validado

1. Abrir `Deploy`.
2. Clicar em `Novo projeto`.
3. Localizar `Deploy via CLI`.
4. Gerar comando.
5. Executar `npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API`.
6. Executar `npx @staysdev/setup deploy --new --name tutorial-deploy-cli-teste --subdomain tutorial-deploy-cli-teste`.
7. Conferir URL pública.
8. Validar HTTP 200.
9. Conferir projeto `pronto` no painel.

## Resultado

Projeto descartável publicado: `tutorial-deploy-cli-teste`.

URL pública: `https://tutorial-deploy-cli-teste.stayai.space/`

HTTP: 200.

Status no painel: `pronto`.

## Segurança

O token real foi usado somente em memória durante a execução. Prints finais, preview, WordPress TXT, SEO e Obsidian usam apenas placeholders.
