# Apontamento Local via Arquivo hosts no Linux

## Metadados

- **Data:** 2026-05-29
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Forçar localmente o apontamento de um domínio no Linux para validar um site antes da propagação pública do DNS.

## Quando Usar

- Em migrações e testes prévios ao apontamento público.
- Quando o site precisa ser homologado antes da troca definitiva de DNS.

## Pré-requisitos

- IP do servidor de destino.
- Permissão de `sudo` na máquina local.
- Acesso ao terminal Linux.

## Passo a Passo Interno

1. Abrir `/etc/hosts` com `sudo nano`.
2. Adicionar a linha com `IP` e `domínio`.
3. Salvar o arquivo e validar com `ping` ou consulta equivalente.
4. Testar o site em aba anônima.
5. Remover a linha após a validação.

## Orientação Possível para Cliente

- Informar que o teste local permite ver o novo servidor sem esperar a propagação global.
- Pedir que o cliente use aba anônima para evitar cache.

## Pontos de Atenção

- Não deixar a linha no arquivo após o teste.
- Não misturar URL completa com o registro do hosts.

## Erros Comuns

- Esquecer de remover o apontamento local.
- Salvar o arquivo sem privilégio de administrador.
- Testar sem limpar cache.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1OPcaQT_ueAMNk-x24iqhcsJxg03kHeCxXVn4qLMFtdY/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:** 

## Materiais Complementares

- `Localização e Edição do Arquivo Hosts (Windows vs Server)`.
- `Configuração de Novo Domínio`.

## Status do Conteúdo

- **Status na planilha:** Pendente
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- A fonte usa o hosts como validação local antes da propagação pública.
- O procedimento é útil para homologação, não para substituir DNS definitivo.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Localização e Edição do Arquivo Hosts (Windows vs Server)]]
- [[Configuração de Novo Domínio]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
