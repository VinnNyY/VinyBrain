# Troubleshooting HTTP 403 WHMCS API

## Causas prováveis

- IP público ainda não liberado em `API IP Access Restriction`;
- IP presente em `Banned IPs`;
- credencial API sem role com `GetTickets` e `GetTicket`;
- `API Access Key` exigida pelo `configuration.php` e ausente no payload;
- firewall ou WAF bloqueando `POST` para `/includes/api.php`;
- endpoint incorreto.

## Como testar

Rodar primeiro:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --diagnose
```

Depois, quando o diagnóstico passar:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --dry-run --limit 5 --save-report
```

## O que pedir ao coordenador

- confirmar os IPs liberados em `Setup/Configuration > General Settings > Security > API IP Access Restriction`;
- confirmar que o IP não está em `Banned IPs`;
- confirmar role API somente com `GetTickets` e `GetTicket`;
- confirmar se existe `API Access Key` no `configuration.php`;
- confirmar se o WAF permite `POST` para `/includes/api.php`;
- confirmar endpoint `https://painel.staycloud.com.br/includes/api.php`.

## Segurança

- não registrar credenciais no documento;
- não colar `identifier`;
- não colar `secret`;
- não colar `accesskey`.
