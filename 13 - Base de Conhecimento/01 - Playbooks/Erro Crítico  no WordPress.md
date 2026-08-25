# Erro Crítico  no WordPress

## Metadados

- **Data:** 2026-08-05
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Registrar a triagem inicial de erro crítico no WordPress e organizar a investigação antes de qualquer correção.

## Diagnóstico rápido

- Se o erro apareceu após mudança recente, verifique primeiro plugin, tema, Elementor/addons e PHP.
- Se o erro vier acompanhado de tela branca ou `critical error`, trate como falha de aplicação antes de restaurar core.
- Se o comportamento mudar após desativar plugins, a causa provável é plugin ou tema.
- Se nada mudar após revisar plugins e tema, avance para core, `wp-config` e logs.

## Quando Usar

- Quando o site exibir erro crítico.
- Quando a aplicação deixar de responder após mudança.
- Quando for preciso localizar a causa antes de qualquer reparo.

## Pré-requisitos

- Confirmar que o erro ocorreu de fato.
- Ter acesso ao ambiente e aos registros de erro.
- Saber se houve alteração recente de plugin, tema, PHP ou core.

## Causas comuns

- Plugin recém-atualizado com conflito.
- Tema com erro ou incompatibilidade.
- Elementor ou Elementor Pro causando falha.
- Addons do Elementor interferindo.
- Core corrompido.
- `wp-config.php` ou `wp-debug` indicando falha relevante.

## Passo a Passo Interno

1. Identificar a alteração mais recente do ambiente.
2. Conferir logs e mensagens disponíveis.
3. Verificar se o problema é de plugin, tema, PHP ou core.
4. Isolar a causa provável antes de qualquer ação maior.
5. Registrar o diagnóstico e a decisão tomada.

## Passo a passo seguro

1. Confirmar a mensagem de erro real.
2. Desativar apenas o que for necessário para testar a hipótese mais provável.
3. Se houver Elementor/addons, validar esse caminho antes de restaurar core.
4. Se o core parecer corrompido, comparar com a hipótese de restauração de core.
5. Se houver indício em logs, registrar antes de mudar mais coisas.
6. Encerrar só quando a causa mais provável estiver separada.

## Resposta / Orientação Possível para Cliente

- Informar que o site está com falha crítica e precisa de triagem.
- Explicar que a equipe está validando a causa antes de mexer em produção.
- Evitar prometer correção sem diagnóstico.

## O que NÃO fazer

- Não restaurar core sem evidência.
- Não culpar plugin ou tema sem teste.
- Não mexer em `htaccess` sem necessidade.
- Não limpar cache como substituto de diagnóstico.
- Não misturar erro de aplicação com manutenção de backup.

## Quando escalar

- Quando a mensagem de erro não clarear a origem.
- Quando plugin, tema e Elementor não explicarem a falha.
- Quando o core parecer íntegro, mas o site continuar quebrado.
- Quando houver risco de perda de conteúdo ou configuração.

## Pontos de Atenção

- Não reiniciar o processo sem entender a causa.
- Não apagar arquivos sem validar o impacto.
- Não tratar o erro como genérico demais.

## Erros Comuns

- Pular a análise de logs.
- Culpar plugin ou tema sem evidência.
- Corrigir sem registrar o que foi alterado.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1AkaTDEs5hzSnj74Dm5bYutBPmNq5wAHWoRlgyuKIfV4/edit?tab=t.0
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Instalação Manual do Core do WordPress]]`

## Status do Conteúdo

- **Status atual:** Pendente
- **Validação da fonte:** consolidado a partir do índice mestre; revisão fina pendente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O conteúdo é sensível e depende da triagem correta.
- O playbook não deve ser usado para adivinhar a solução.

## Conexões internas

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Instalação Manual do Core do WordPress]]`
- `[[Restauração do Core do WordPress (Automatico)]]`
- `[[Diagnóstico Rápido - WordPress Erro Crítico e Core]]`
- `[[Alteração de Senha do WordPress via phpMyAdmin]]`
