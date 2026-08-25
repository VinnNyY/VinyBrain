# Autonomous Scanner

Scanner autônomo read-only para a tela do `WHMCS`, pensado para rodar dentro da sessão já logada do navegador por meio de `Tampermonkey` ou `Violentmonkey`.

## O que ele faz

- lê a listagem atual de tickets;
- tenta seguir próximas páginas em modo leitura;
- abre tickets candidatos em profundidade via `GET` same-origin;
- detecta plugin, domínio e autorização;
- classifica em `PRONTO PARA APROVACAO`, `REVISAR MANUALMENTE` ou `IGNORAR`;
- gera fila copiável e relatório local em Markdown.

## O que ele não faz

- não usa API do `WHMCS`;
- não usa token;
- não cria `.env`;
- não salva credenciais;
- não lê `document.cookie`;
- não usa `localStorage` ou `sessionStorage`;
- não faz `POST`;
- não clica em botões;
- não envia dados para fora;
- não ativa plugin;
- não instala plugin;
- não responde ticket;
- não fecha ticket;
- não altera status.

## Instalação

1. Instale `Tampermonkey` ou `Violentmonkey`.
2. Crie um novo userscript.
3. Cole o conteúdo de `whmcs-autonomous-scanner.user.js`.
4. Salve e mantenha ativo apenas para o domínio `painel.staycloud.com.br`.

## Uso

1. Abra `https://painel.staycloud.com.br/gestor/supporttickets.php`.
2. Aguarde o painel `Scanner Autonomo de Plugins`.
3. Clique em `Escanear pagina atual`.
4. Clique em `Escanear proximas paginas`.
5. Clique em `Escanear candidatos em profundidade`.
6. Revise `PRONTO PARA APROVACAO` e `REVISAR MANUALMENTE`.
7. Use `Copiar fila` ou `Exportar relatorio`.

## Limitações

- a paginação precisa ser identificada com segurança;
- se a página interna do ticket não carregar, o item permanece para revisão manual;
- o layout do `WHMCS` pode exigir ajuste de seletores;
- o scanner não substitui revisão humana.

## Interpretação

- `PRONTO PARA APROVACAO`: ticket aberto, ativação clara, plugin conhecido, dominio e autorização detectados, sem sinal de conclusão.
- `REVISAR MANUALMENTE`: existe indício de plugin, mas falta dominio, autorização, contexto ou há ambiguidade.
- `IGNORAR`: não é plugin, é VPS, está concluído, já foi resolvido ou não pertence ao escopo.

## Risco

O scanner é read-only. O principal risco é falso positivo ou layout diferente do `WHMCS`, nunca execução automática de alteração.

