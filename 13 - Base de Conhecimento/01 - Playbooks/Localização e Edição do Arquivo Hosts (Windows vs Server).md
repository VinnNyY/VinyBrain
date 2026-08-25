# Localização e Edição do Arquivo Hosts (Windows vs Server)

## Metadados

- **Data:** 2026-03-27
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Rafael Menezes
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Mostrar como localizar e editar o arquivo `hosts` no Windows e no servidor Linux para testes de apontamento antes da propagação.

## Quando Usar

- Em homologação de site antes da troca pública de DNS.
- Quando for preciso validar um novo IP localmente.

## Pré-requisitos

- Acesso administrativo no Windows ou `sudo` no Linux.
- IP do servidor de destino.
- Domínio a ser testado.

## Passo a Passo Interno

1. No Windows, abrir a pasta `C:\Windows\System32\drivers\etc`.
2. Editar o arquivo como administrador.
3. No Linux, acessar `/etc` e consultar o `hosts`.
4. Inserir o apontamento no formato `IP DOMÍNIO`.
5. Remover a linha após a validação.

## Orientação Possível para Cliente

- Informar que o teste local ajuda a ver o novo servidor antes da propagação.
- Pedir teste em modo anônimo após a alteração.

## Pontos de Atenção

- No Windows, o arquivo não deve ser salvo como `.txt`.
- No Linux, é preciso privilégios de escrita.

## Erros Comuns

- Esquecer de apagar a linha depois do teste.
- Inserir URL completa em vez de IP + domínio.
- Tentar salvar sem permissão administrativa.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1_e0ONQCGDlov2ICK86VmGI7LPKqkW5-bqvabTsQaIeE/edit?tab=t.0
- **Link complementar:** 

## Materiais Complementares

- `Apontamento Local via Arquivo hosts no Linux`.
- `Configuração de Novo Domínio`.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- A fonte diferencia claramente o fluxo do Windows e do Linux.
- O foco é validação local, não configuração pública de DNS.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Apontamento Local via Arquivo hosts no Linux]]
- [[Configuração de Novo Domínio]]
- [[Resolução de Erro de NameServer (NS) no Registro.br]]
