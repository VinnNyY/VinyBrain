# Scanner API WHMCS Read-only

## Objetivo

Ler tickets do `WHMCS` em modo somente leitura, identificar solicitações pendentes de ativação de plugin WordPress e gerar relatórios locais sem qualquer alteração no sistema.

## Modos

- `--mock`: usa payload local para validar a lógica sem API.
- `--diagnose`: valida `.env`, endpoint, IP público, ações permitidas e tentativa mínima `GetTickets limitnum=1`.
- `--dry-run --limit 30 --save-report`: caminho real somente leitura quando a API estiver liberada.
- `--from-html CAMINHO_DO_ARQUIVO`: fallback local para analisar uma listagem HTML salva.

## Garantias

- não imprime credenciais;
- não salva token no vault;
- não cria `.env` dentro do vault;
- não responde ticket;
- não altera ticket;
- não ativa plugin;
- não usa ações de escrita.

## Restrições

- ações permitidas: `GetTickets`, `GetTicket`;
- ações bloqueadas: `AddTicketReply`, `UpdateTicket`, `CloseTicket`, `DeleteTicket`, `AddTicketNote`;
- qualquer outro verbo de escrita deve falhar.

## Chamada HTTP

- metodo: `POST`;
- body: `application/x-www-form-urlencoded`;
- headers: `User-Agent`, `Content-Type` e `Accept`;
- `accesskey` opcional quando `WHMCS_API_ACCESS_KEY` estiver configurado no `.env` externo.

## Situação atual

O teste real da API ficou bloqueado por `HTTP 403` enquanto o IP não estiver liberado.
O projeto segue com mock, diagnóstico seguro, checklist de liberação e fallback por HTML local.
