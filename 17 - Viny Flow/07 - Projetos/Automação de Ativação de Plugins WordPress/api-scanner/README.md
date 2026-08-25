# WHMCS API Read-Only Scanner

Scanner local para tickets do `WHMCS` em modo somente leitura.

## Objetivo

- ler tickets pela interface administrativa do WHMCS com Playwright, em modo read-only, sem depender da API quando o provider `browser-ui` estiver ativo;
- ler tickets com `GetTickets`;
- abrir candidatos com `GetTicket`;
- detectar solicitações pendentes de ativação de plugin WordPress;
- gerar relatórios em `Markdown`, `JSON` e `CSV`;
- bloquear qualquer ação de escrita na API.

## Ações permitidas

- `browser-ui` como provider principal para leitura pela interface administrativa;
- `GetTickets`
- `GetTicket`

## Ações bloqueadas

- `AddTicketReply`
- `UpdateTicket`
- `CloseTicket`
- `DeleteTicket`
- `AddTicketNote`
- qualquer outra ação de escrita

## Pré-requisitos

- credenciais salvas fora do vault em `/home/vinicius-alves/.config/viny-integrations/.env`;
- variáveis obrigatórias:
  - `WHMCS_API_URL`
  - `WHMCS_API_IDENTIFIER`
  - `WHMCS_API_SECRET`
- variável opcional:
  - `WHMCS_API_ACCESS_KEY`

Para leitura via interface:

- `--whmcs-provider browser-ui`
- `--browser-session interactive`
- login manual no WHMCS durante a execução

Modo persistente recomendado quando houver Cloudflare Access e Google Workspace:

- `--browser-session persistent`
- perfil dedicado fora do vault: `/home/vinicius-alves/.config/viny-integrations/browser-profiles/whmcs-automation`
- bootstrap manual inicial com `--browser-bootstrap-login`
- confirmação manual via terminal com `--browser-bootstrap-manual-confirm`
- timeout padrão do bootstrap: `900` segundos

## Como usar

Teste mock:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --mock --save-report
```

Teste real read-only:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --dry-run --limit 30 --save-report
```

Provider browser-ui:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --dry-run --whmcs-provider browser-ui --browser-session interactive --queue awaiting-reply --limit 20 --debug-browser-ui --save-report
```

Bootstrap persistente:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --dry-run --whmcs-provider browser-ui --browser-session persistent --browser-bootstrap-login --browser-bootstrap-manual-confirm --browser-bootstrap-timeout 900
```

Execução persistente normal:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --dry-run --whmcs-provider browser-ui --browser-session persistent --queue awaiting-reply --limit 20 --debug-browser-ui --save-report
```

Diagnostico seguro:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --diagnose
```

Fallback por HTML salvo:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/whmcs_api_readonly_scanner.py" --from-html caminho/para/listagem.html --save-report
```

Inventário local read-only de pacotes ZIP premium:

```bash
python "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/local_plugin_package_inventory.py" --source "/home/vinicius-alves/Documentos" --dry-run
```

## Configuração

Copie `config.example.json` para ajustar caminho do `.env`, diretório de relatórios e regras de detecção.

## Saídas

- `reports/whmcs-api-readonly-scanner-<timestamp>.md`
- `reports/whmcs-api-readonly-scanner-<timestamp>.json`
- `reports/whmcs-api-readonly-scanner-<timestamp>.csv`

## Inventário local

O inventário de pacotes locais identifica ZIPs WordPress sem copiá-los para o vault.

Quando for necessário registrar o inventário em arquivo externo, ele será escrito fora do vault em `/home/vinicius-alves/.config/viny-integrations/plugin-packages.json`.

## Garantias

- não imprime credenciais;
- não grava token;
- não altera ticket;
- não ativa plugin;
- não usa ações de escrita na API.
- não executa PHP de pacotes ZIP locais;
- não copia pacotes premium para o vault;
- não salva segredos de pacote.

## Diagnostico

Se a API devolver `403`, o scanner mostra uma explicação segura focada em:

- IP nao liberado na restricao de API;
- IP banido;
- role sem permissao;
- `API Access Key` ausente quando exigida;
- endpoint incorreto;
- bloqueio de firewall/WAF.

Quando usar `browser-ui`, o scanner lê a fila pela interface administrativa do WHMCS e não chama `/includes/api.php`.

No modo `persistent`, o perfil dedicado do Chrome é mantido fora do vault e pode guardar a sessão necessária para Cloudflare Access, Google Workspace/SAML e WHMCS.

## Chamada API

- metodo: `POST`;
- body: `application/x-www-form-urlencoded`;
- headers: `User-Agent`, `Content-Type` e `Accept`;
- `accesskey` enviado somente quando `WHMCS_API_ACCESS_KEY` existir no `.env` externo.
