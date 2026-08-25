# Checklist para Liberar API WHMCS

## Antes de testar

- IP público da máquina que vai rodar o scanner:
- liberar esse IP em `API IP Access Restriction`;
- confirmar que o IP não está em `Banned IPs`;
- confirmar que a role da API permite somente:
  - `GetTickets`
  - `GetTicket`
- confirmar que NÃO permite:
  - `AddTicketReply`
  - `UpdateTicket`
  - `CloseTicket`
  - `DeleteTicket`
  - `AddTicketNote`
- confirmar endpoint:
  - `https://painel.staycloud.com.br/includes/api.php`
- confirmar que a credencial está ativa;
- testar primeiro com `--diagnose`;
- depois testar com `--dry-run --limit 5 --save-report`.

## Observações

- o teste real da API ficou bloqueado por `HTTP 403` enquanto o IP não está liberado;
- o projeto seguirá com mock, diagnóstico, checklist e fallback por HTML até a liberação do coordenador.
