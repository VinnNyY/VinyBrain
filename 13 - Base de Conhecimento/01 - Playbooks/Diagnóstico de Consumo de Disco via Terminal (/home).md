# Diagnóstico de Consumo de Disco via Terminal (/home)

## Metadados

- **Data:** 28/05
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Padronizar a identificação de consumo alto de disco na área `/home`.

## Quando Usar

- Quando houver alerta de espaço insuficiente.
- Quando o servidor começar a apresentar lentidão por armazenamento.
- Quando for necessário localizar diretórios com crescimento incomum.

## Pré-requisitos

- Acesso ao terminal da VPS.
- Saber que a análise será concentrada em `/home`.
- Ter cautela para não remover dados sem validação.

## Passo a Passo Interno

1. Confirmar qual partição ou diretório precisa ser analisado.
2. Identificar os pontos de maior consumo em `/home`.
3. Separar crescimento normal de consumo anormal.
4. Verificar se há logs, cache ou arquivos temporários envolvidos.
5. Registrar o resultado antes de qualquer limpeza.

## Resposta / Orientação Possível para Cliente

- Explicar que a análise serve para localizar onde o espaço está sendo consumido.
- Informar que a limpeza só é feita após confirmação do que pode ser removido.
- Evitar falar em exclusão antes de validar a origem do consumo.

## Pontos de Atenção

- Não apagar arquivos sem confirmar a origem.
- Não misturar diagnóstico com limpeza automática.
- Não tratar todo consumo como erro.

## Erros Comuns

- Limpar pasta errada por não validar o caminho.
- Apagar conteúdo útil junto com dados temporários.
- Encerrar a análise sem registrar a causa provável.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1Fl6IiPVDsT1-Gr_JZ-Nkf9phwco4QqMjeQ3ozNLTXcw/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Navegação em Sistemas de Arquivos Linux]]`

## Status do Conteúdo

- **Status atual:** Pendente
- **Validação da fonte:** preservada no índice e no documento local
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O foco ficou em diagnóstico e não em limpeza.
- O documento evita expor dados sensíveis ou caminhos reais de cliente.
