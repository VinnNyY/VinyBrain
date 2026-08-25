# Segurança da API WHMCS

## Regras obrigatórias

- usar somente leitura;
- manter `GetTickets` e `GetTicket` como únicas ações permitidas;
- bloquear completamente qualquer ação de escrita;
- não registrar credenciais em logs, relatórios ou histórico;
- não salvar tokens no vault;
- não criar `.env` dentro do vault;
- não responder tickets;
- não alterar WHMCS;
- não ativar plugin.

## Diagnóstico seguro

- confirmar que o `.env` externo existe;
- confirmar `WHMCS_API_URL`;
- confirmar `WHMCS_API_IDENTIFIER` sem imprimir o valor;
- confirmar `WHMCS_API_SECRET` sem imprimir o valor;
- confirmar `WHMCS_API_ACCESS_KEY` sem imprimir o valor, quando existir;
- confirmar o endpoint configurado;
- mostrar o IP público atual quando possível;
- confirmar metodo `POST`;
- confirmar headers seguros;
- testar `GetTickets limitnum=1`;
- em `403`, assumir bloqueio de IP, banimento, permissão de role, access key ausente, endpoint incorreto ou firewall/WAF.

## Mensagem de 403

Proximos passos para `HTTP 403`:

- confirmar se os IPs foram adicionados em `Setup/Configuration > General Settings > Security > API IP Access Restriction`;
- confirmar se o IP não está em `Banned IPs`;
- confirmar se a credencial API está vinculada a uma role com `GetTickets` e `GetTicket`;
- confirmar se existe `API Access Key` no `configuration.php` e se ela precisa ser enviada;
- confirmar se firewall/WAF permite `POST` para `/includes/api.php`;
- confirmar se o endpoint está correto.

## Fallback local

Enquanto o acesso real estiver indisponível, o projeto pode operar com:

- `--mock`;
- `--diagnose`;
- `--from-html CAMINHO_DO_ARQUIVO`.
