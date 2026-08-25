# Detector de Ativacoes Pendentes

## Objetivo

Criar um MVP local de apoio que analisa tickets ficticios ou exportados manualmente do `WHMCS` e identifica quais parecem ser solicitacoes pendentes de ativacao de plugin WordPress.

> Nota: o caminho principal do projeto agora e o scanner visual no navegador. Este detector continua como apoio offline para estudo, calibracao e comparacao.

## Como rodar

Use um JSON local com lista de tickets:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/scripts/detect_pending_plugin_activations.py" \
  "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/payloads/whmcs_tickets_sample.json"
```

Para mostrar apenas a fila acionavel:

```bash
python3 "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/scripts/detect_pending_plugin_activations.py" \
  "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/payloads/whmcs_tickets_sample.json" \
  --only-queue
```

O script:

- le o JSON local;
- aplica regras editaveis;
- classifica tickets;
- imprime resumo no terminal;
- gera relatorio Markdown em `reports/`.
- permanece sem acesso a API, cookies, `localStorage`, `sessionStorage` ou qualquer dado sensivel.

## O que ele detecta

- pedidos claros de ativacao de plugin;
- pedidos de instalacao, licenca e erro relacionados a plugin;
- tickets com plugin conhecido na whitelist;
- tickets com score suficiente para alta confianca;
- casos que precisam revisao humana por falta de dados.

## O que ele nao faz

- nao acessa `WHMCS` real;
- nao usa API real;
- nao usa token;
- nao cria `.env`;
- nao salva credenciais;
- nao acessa `WordPress` real;
- nao acessa `cPanel` real;
- nao ativa plugin;
- nao instala plugin;
- nao executa acao real.

## Saidas

- relatorio geral em Markdown;
- fila de aprovacao em Markdown, JSON e CSV;
- resumo no terminal com score, tipo de solicitacao e proxima acao.

## Limitacoes

- detecao baseada em palavras-chave pode gerar falso positivo;
- tickets com texto curto ou ambiguidade exigem revisao humana;
- plugin pode ser citado sem existir no contexto real;
- dominio pode aparecer sem correspondencia valida ao cliente;
- casos de instalacao, licenca ou erro podem parecer pedido de ativacao.

## Riscos

- classificar errado um ticket de suporte;
- deixar de detectar um pedido real por linguagem indireta;
- assumir autorizacao que nao existe;
- tratar um pedido de licenca como pedido de ativacao.

## Proximos passos

- ajustar palavras-chave com exemplos reais anonimizados;
- refinar score de confianca;
- aceitar exportacao em CSV no futuro para outros formatos;
- criar fila de aprovacao humana;
- integrar com leitura controlada do `WHMCS` apenas numa fase posterior.
