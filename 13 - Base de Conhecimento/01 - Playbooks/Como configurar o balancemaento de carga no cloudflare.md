# Como configurar o balancemaento de carga no cloudflare

## Metadados

- **Data:** Date
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Vinicius Alves
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Orientar a configuração de balanceamento de carga na Cloudflare para distribuir tráfego entre servidores diferentes.

## Quando Usar

- Quando o cliente tiver dois ou mais servidores com IPs distintos.
- Quando houver necessidade de alta disponibilidade e fallback.

## Pré-requisitos

- Dois ou mais servidores reais.
- Arquivos e bancos sincronizados entre os servidores.
- Proxy da Cloudflare ativo.

## Passo a Passo Interno

1. Criar o hostname do balanceador na Cloudflare.
2. Definir o pool com os endpoints e seus pesos.
3. Criar o monitor de integridade com o tipo e caminho corretos.
4. Configurar o roteamento e o pool de fallback.
5. Validar se o hostname responde e se o failover funciona.

## Orientação Possível para Cliente

- Explicar que o tráfego será distribuído entre servidores para reduzir risco de queda.
- Informar que a estrutura precisa de redundância real para funcionar.

## Pontos de Atenção

- Não funciona com um único IP.
- O balanceador não substitui sincronização de arquivos e banco.
- A nuvem laranja precisa permanecer ativa.

## Erros Comuns

- Configurar apenas um servidor no pool.
- Esquecer o monitor de integridade.
- Deixar o fallback sem validar.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/14chzAXbXroGzf2-ZeqpwU3yadxqUEl4TMroiZ-OUQ38/edit?tab=t.0
- **Link complementar:** 

## Materiais Complementares

- `Otimização de Cache na Cloudflare`.
- `Conferência de Certificado SSL`.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- O documento-fonte define explicitamente o requisito de múltiplos servidores com IPs diferentes.
- O passo a passo original foi preservado em forma resumida.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Otimização de Cache na Cloudflare]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Conferência de Certificado SSL]]
