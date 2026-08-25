# Verificação de Disponibilidade e Conectividade VPS

## Metadados

- **Data:** 14/03
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Padronizar a checagem inicial de disponibilidade e conectividade de uma VPS.

## Quando Usar

- Quando houver suspeita de indisponibilidade.
- Quando o cliente relata instabilidade, lentidão ou queda de acesso.
- Quando é preciso separar falha local, falha de rede ou falha do servidor.

## Pré-requisitos

- Saber qual VPS será validada.
- Ter acesso ao painel ou à console administrativa.
- Ter a mensagem de erro ou o relato do cliente.

## Passo a Passo Interno

1. Confirmar se a VPS responde no painel ou na ferramenta de gestão.
2. Diferenciar problema de acesso remoto de indisponibilidade real.
3. Validar se a falha parece ser de rede, autenticação ou serviço.
4. Conferir se existe bloqueio de segurança associado ao caso.
5. Registrar a conclusão e orientar a próxima ação necessária.

## Resposta / Orientação Possível para Cliente

- Informar que a validação verifica se o servidor está acessível.
- Pedir que o cliente envie o erro exato e teste novamente após a checagem.
- Explicar, sem excesso técnico, se o problema parece ser local ou no servidor.

## Pontos de Atenção

- Não concluir indisponibilidade sem checar o painel.
- Não misturar teste de conectividade com alteração de produção.
- Não prometer correção antes de identificar a causa.

## Erros Comuns

- Tratar instabilidade local como queda total da VPS.
- Ignorar bloqueios de rede ou autenticação.
- Pular a confirmação do estado do servidor antes de orientar o cliente.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1rqKipPtk-2E3r1MVuL0Mbz4Upi_3QfEToT2KAVQ-AFU/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Resolução de Falha de Conexão SSH na VPS]]`

## Status do Conteúdo

- **Status atual:** Postado
- **Validação da fonte:** preservada no índice e no documento local
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- O playbook ficou focado em triagem e não em intervenção arriscada.
- A conexão temática com SSH e serviços básicos é direta.
