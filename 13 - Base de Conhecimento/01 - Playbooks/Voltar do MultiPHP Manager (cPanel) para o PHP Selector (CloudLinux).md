# Voltar do MultiPHP Manager (cPanel) para o PHP Selector (CloudLinux)

## Metadados

- **Data:** 2026-01-05
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Orientar a volta do ambiente PHP para o seletor padrão quando uma alteração no MultiPHP Manager precisar ser revertida.

## Quando Usar

- Quando a aplicação passar a depender do seletor padrão do ambiente.
- Quando uma troca anterior de versão causar incompatibilidade.
- Quando a correção exigir voltar ao padrão da hospedagem.

## Pré-requisitos

- Saber qual site ou conta está sendo ajustado.
- Ter acesso ao painel de hospedagem.
- Confirmar a versão de PHP esperada pela aplicação.

## Passo a Passo Interno

1. Confirmar o estado atual da configuração de PHP.
2. Verificar qual versão ou modo de seleção o site precisa usar.
3. Reverter a configuração para o seletor apropriado.
4. Validar o site e os registros de erro após a alteração.
5. Registrar o resultado e possíveis pendências.

## Resposta / Orientação Possível para Cliente

- Explicar que a aplicação precisava voltar ao padrão de PHP compatível.
- Informar que a validação foi feita depois da mudança.
- Evitar citar detalhes internos que não ajudem o cliente.

## Pontos de Atenção

- Não mudar a versão sem confirmar o impacto.
- Não assumir que o seletor anterior estava correto.
- Não encerrar a análise sem testar o site.

## Erros Comuns

- Reverter para uma versão incompatível.
- Ajustar o PHP sem conferir logs e comportamento da aplicação.
- Misturar correção com teste não documentado.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/198KDFJE10mW_zQCQ3HC62HHR8ssnfBLYLWQgSgdzKfA/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Gerenciamento de Extensões PHP via PHP Selector]]`

## Status do Conteúdo

- **Status atual:** Pendente
- **Validação da fonte:** consolidado a partir do índice mestre; revisão fina pendente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O tema é compatível com hospedagem e aplicação.
- O procedimento precisa de confirmação final com a fonte original.

## Conexões internas

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Gerenciamento de Extensões PHP via PHP Selector]]`
- `[[Como Acessar o Painel de Controle (cPanel)]]`
