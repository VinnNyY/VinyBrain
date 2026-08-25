# Playbook: Resolução de Erro MySQL #2006 (StayCare Technical Support)

## Metadados

- **Data:** 2026-09-03
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Orientar a triagem inicial do erro MySQL #2006 quando a aplicação perder conexão com o banco.

## Quando Usar

- Quando a aplicação acusar falha de conexão com o MySQL.
- Quando o site apresentar erro relacionado ao banco.
- Quando houver suspeita de indisponibilidade do serviço ou credencial incorreta.

## Pré-requisitos

- Saber qual aplicação está impactada.
- Confirmar se o problema é intermitente ou persistente.
- Ter acesso aos logs e ao painel do ambiente.

## Passo a Passo Interno

1. Confirmar a mensagem de erro e o escopo.
2. Verificar se o serviço de banco está disponível.
3. Conferir credenciais, host e recurso do ambiente.
4. Avaliar logs antes de qualquer reinício ou troca.
5. Registrar a causa provável e a ação executada.

## Resposta / Orientação Possível para Cliente

- Informar que a conexão com o banco falhou e está sendo verificada.
- Explicar, em linguagem simples, que o site depende da conexão com o MySQL.
- Evitar expor dados técnicos desnecessários.

## Pontos de Atenção

- Não alterar credenciais sem confirmar necessidade.
- Não reiniciar serviços sem observar o contexto.
- Não assumir que o problema é só do site.

## Erros Comuns

- Ignorar o serviço do banco.
- Não validar host ou credencial.
- Tentar corrigir sem olhar logs.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1FvzRHh8wsPEhOjf39fjPR-AdhfarOqG9qY6ZuT1TNgM/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Criação de Banco de Dados (cPanel)]]`

## Status do Conteúdo

- **Status atual:** Postado
- **Validação da fonte:** consolidado a partir do índice mestre; revisão fina pendente
- **Pode ser usado como referência final?** Sim, com revisão humana

## Observações de Validação

- O playbook é compatível com hospedagem e aplicação.
- Não foram incluídos dados sensíveis.

## Conexões internas

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Criação de Banco de Dados (cPanel)]]`
- `[[Ativação de Logs de Erro PHP (cPanel)]]`
