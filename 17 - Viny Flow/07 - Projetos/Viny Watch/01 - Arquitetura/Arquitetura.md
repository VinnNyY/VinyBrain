# Arquitetura

## Stack

- Node.js
- TypeScript
- Playwright
- Chromium/Google Chrome visivel
- SQLite via `better-sqlite3`
- Express para painel local
- Vitest para testes

## Modulos

- `src/browser`: abertura de Chromium com perfil persistente exclusivo.
- `src/scanner`: seletores centralizados e varredura da lista lateral.
- `src/detector`: classificacao de remetente e regra de grupo aguardando resposta.
- `src/state`: schema SQLite, observacoes, alertas simulados e resolucao.
- `src/dashboard`: painel local em `127.0.0.1:3847`.
- `src/config`: carregamento de configuracao sem credenciais.
- `src/delivery`: interface futura de entrega de alertas. Apenas console esta ativo.
- `src/shared`: tipos, logs, hash e horarios.

## Entrega de alertas

Interface criada:

- `AlertDeliveryProvider`

Implementacao ativa:

- `ConsoleAlertProvider`

Implementacao de envio web:

- `WhatsAppWebAlertProvider`

O provider de WhatsApp Web so pode executar teste manual controlado. Ele usa a pesquisa do WhatsApp Web, valida allowlist exata, destino unico, cabecalho, campo de mensagem, envio automatico desativado e trava diaria antes de enviar.

O scanner e o provider sao independentes: falhas no filtro `Grupos` do scanner nao bloqueiam o teste manual do canal.

## Seletoras usadas

Centralizadas em:

`/home/vinicius-alves/Projetos/viny-watch/src/scanner/selectors.ts`

Fallbacks atuais:

- app carregado: `[data-testid='chat-list']`, labels de lista de conversas, `#pane-side`;
- filtro grupos: botao/tab/texto `Grupos`;
- lista lateral: `chat-list`, `#pane-side`, labels semanticas;
- linhas: `role=listitem`, `role=row`, itens sob `#pane-side`.

Se a interface do WhatsApp mudar, a manutencao deve ocorrer nessa camada antes de alterar regras de negocio.
