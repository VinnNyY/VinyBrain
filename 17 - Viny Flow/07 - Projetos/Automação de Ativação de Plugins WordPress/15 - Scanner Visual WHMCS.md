# Scanner Visual WHMCS

## Objetivo

Criar um scanner visual local para a tela de tickets do `WHMCS` já aberta e logada, sem API e sem alterar nada no sistema.

## Quando usar

- quando a página de tickets estiver aberta em `https://painel.staycloud.com.br/gestor/supporttickets.php`;
- quando quiser destacar rapidamente tickets candidatos a ativação de plugin;
- quando quiser montar uma fila curta para revisão humana.

## Como usar via console

1. Abra a página de tickets do `WHMCS`.
2. Abra o console do navegador.
3. Cole o conteúdo de `browser-snippets/whmcs-scanner-visual-console.js`.
4. Execute o snippet.
5. Veja os destaques, o painel flutuante e a fila sugerida.

## Como usar via bookmarklet

1. Crie um novo favorito no navegador.
2. Nomeie como `Scanner Plugins WHMCS`.
3. No campo de URL, cole o conteúdo de `browser-snippets/whmcs-scanner-visual-bookmarklet.js`.
4. Abra a página de tickets do `WHMCS`.
5. Clique no favorito.
6. Veja os tickets destacados.

## Como instalar como favorito no Chrome

1. Copiar o conteúdo de `browser-snippets/whmcs-scanner-visual-bookmarklet-minificado.txt`.
2. Abrir o Chrome.
3. Criar novo favorito.
4. Nome: `Scanner Plugins WHMCS`.
5. URL: colar o conteúdo copiado.
6. Salvar.
7. Abrir `https://painel.staycloud.com.br/gestor/supporttickets.php`.
8. Clicar no favorito.
9. Conferir o painel flutuante.

## O que ele faz

- lê apenas o DOM visível da página atual;
- identifica linhas com sinais de ativação de plugin;
- classifica em `ALTA CONFIANÇA`, `REVISAR` ou `IGNORAR`;
- destaca visualmente a linha;
- adiciona badge ao lado do assunto;
- cria painel flutuante com contagem e fila;
- permite copiar a fila em texto simples;
- permite limpar marcações.

## O que ele não faz

- não usa API;
- não lê cookie;
- não lê `localStorage` ou `sessionStorage`;
- não envia dados para fora;
- não faz `fetch` externo;
- não acessa WordPress;
- não acessa cPanel;
- não ativa plugin;
- não instala plugin;
- não responde ticket;
- não altera ticket;
- não fecha ticket;
- não substitui revisão humana.

## Limitações

- lê apenas os tickets visíveis na página atual;
- se houver paginação, é preciso navegar para a próxima página e rodar novamente;
- não lê conteúdo interno do ticket ainda;
- depende do texto visível na tabela;
- pode precisar de ajuste caso o layout do `WHMCS` mude.

## Regra de classificação

- `ativação de plugin` com plugin conhecido é tratado como alta confiança;
- `reativação de VPS` e variações parecidas são tratados como ignorar, a menos que exista contexto explícito de plugin WordPress.

## Validação operacional

O bookmarklet foi validado na tela real do WHMCS e o caso `#MSQ-299716 - Solicitação de ativação de plugin(s): Elementor PRO, WP Rocket` entra como `ALTA CONFIANÇA`, enquanto `#DBY-773226 - Reativação de VPS` permanece em `IGNORAR`.

## Segurança

O scanner apenas observa a página atual e aplica marcação visual local. Ele não persiste dados, não chama endpoints e não modifica o estado do `WHMCS`.

## Validação de uso diário

Status: `MVP Visual validado`.

O bookmarklet `Scanner Plugins WHMCS` foi criado e testado na tela real de tickets do `WHMCS`.

Funcionamento validado:

- detecta ticket de ativação de plugin como `ALTA CONFIANÇA`;
- ignora falso positivo de `Reativação de VPS`;
- mostra painel flutuante com contagem;
- permite copiar fila;
- não usa API;
- não usa token;
- não lê cookies;
- não acessa `localStorage` ou `sessionStorage`;
- não faz `fetch` externo;
- não altera tickets;
- não responde tickets;
- não ativa plugins;
- apenas lê a tela visível e destaca visualmente.

## Relação com o scanner autônomo

O bookmarklet visual segue como opção rápida para triagem manual. A próxima fase do projeto usa um userscript read-only para ler listagens e tickets internos com mais autonomia.
