# Estudo do Vídeo - Sistema de Deploy

Fonte: https://www.youtube.com/watch?v=V-P2VggjmzU&t=5s

Data do estudo: 2026-07-29

## Observação Sobre A Fonte

O YouTube expôs uma faixa de transcrição automática em português, mas a rota de legenda retornou conteúdo vazio no ambiente local. O estudo foi feito pela tela do vídeo incorporada no painel e pela comparação com o sistema real.

## Objetivo Do Produto

O produto aparece como uma forma de publicar sites, páginas ou aplicações/SaaS criados com IA ou trazidos de repositório/arquivo, sem exigir configuração manual de servidor.

## Onde O Deploy Aparece No Painel

- Menu lateral principal: `Deploy`.
- Área interna: `Cloud`.
- Subtítulo: `deploy de git`.
- URL validada: `https://beta.staycloud.com/dashboard/cloud`.

## Pré-Requisitos E Sinais Visuais

- Conta autenticada no Painel Novo.
- Produto ainda não ativo no estado validado.
- Status visível: `cloud ainda não ativo`.
- Botão principal: `Começar grátis`.
- Botão secundário: `Falar com vendas`.
- Comando exibido: `npx @staysdev/setup init`.

## Passos Apresentados Ou Sugeridos

- Abrir o menu `Deploy`.
- Conferir a tela `Cloud`.
- Avaliar as formas de iniciar: comando no terminal, GitHub, arquivo `.zip` ou projeto do zero.
- Usar o botão `Começar grátis` para iniciar a ativação.
- Depois da ativação, acompanhar deploys, logs, domínios, integrações e plano.

## Botões, Campos E Abas Reais

- `Deploy`
- `Visão geral`
- `Deployments`
- `Logs`
- `Domínios`
- `Integrações`
- `Plano`
- `Começar grátis`
- `Falar com vendas`
- `Assistir o tutorial`

## Possíveis Erros E Limitações

- Ativar sem entender se o Cloud cria recurso ou altera plano.
- Confundir Deploy/Cloud com cPanel, EasyPanel, Coolify ou Docker em VPS.
- Clicar em `Falar com vendas` quando o objetivo for ativar diretamente.
- Usar comandos da tela sem confirmar se há segredo, token ou contexto de projeto.

## Resultado Final Esperado

Após ativação autorizada, o usuário deve conseguir iniciar o primeiro projeto e acompanhar publicações, logs, domínio e configurações pelo painel.

## Pontos Que Precisam Ser Confirmados No Painel

- O que acontece exatamente depois de clicar em `Começar grátis`.
- Se há confirmação, cobrança, limite ou criação imediata de recurso.
- Fluxo real de primeiro projeto.
- Funcionamento da CLI.
- Conteúdo real das abas `Deployments`, `Logs`, `Domínios`, `Integrações` e `Plano` após ativação.

## Divisão Recomendada Dos Tutoriais

1. Como ativar o Deploy no Painel Novo da StayCloud.
2. Como fazer o primeiro deploy na StayCloud.
3. Como instalar e usar a CLI do Deploy StayCloud.
4. Como consultar logs e status de um deploy.
5. Como configurar domínio no Deploy.
