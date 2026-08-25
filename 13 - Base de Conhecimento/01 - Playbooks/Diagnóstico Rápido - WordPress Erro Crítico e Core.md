# Diagnóstico Rápido - WordPress Erro Crítico e Core

## Objetivo

Servir como mapa operacional para decidir entre corrigir, restaurar core ou restaurar backup quando o WordPress apresentar erro crítico.

## Quando usar

- Quando o WordPress exibir erro crítico.
- Quando a falha surgir após alterar plugin, tema, Elementor, PHP ou core.
- Quando houver dúvida entre desativar plugin, restaurar core ou restaurar backup.
- Quando a operação precisar isolar a camada antes de agir.

## Sintomas comuns

- Erro crítico no WordPress.
- Tela branca.
- Falha logo após atualização.
- Site abre só depois de desativar algo.
- Elementor ou addon derrubando a página.
- Comportamento inconsistente após mexer em core.

## Matriz de diagnóstico

| Sintoma | Provável causa | Primeiro teste | Playbook relacionado |
|---|---|---|---|
| Erro após atualização de plugin | plugin com conflito | desativar plugin suspeito | [[Erro Crítico  no WordPress]] |
| Erro após mexer em tema | tema incompatível | trocar para tema padrão ou isolar tema | [[Erro Crítico  no WordPress]] |
| Erro com Elementor ativo | Elementor / Elementor Pro / addon | desativar Elementor ou addon suspeito | [[Erro Crítico  no WordPress]] |
| Site continua quebrado após desativar plugins | core corrompido | avaliar restauração de core | [[Instalação Manual do Core do WordPress]] |
| Erro persiste mesmo com core ajustado | problema além do core | revisar backup, `wp-config`, logs e cache | [[Restauração do Core do WordPress (Automatico)]] |

## Fluxo rápido

1. Identificar a mensagem/erro real.
2. Verificar plugin/tema.
3. Verificar Elementor/addons.
4. Verificar `htaccess` e cache.
5. Verificar core WordPress.
6. Decidir entre corrigir, restaurar core ou restaurar backup.

## O que NÃO fazer

- Não restaurar core sem tentar isolar plugin, tema ou Elementor.
- Não culpar core por toda falha crítica.
- Não limpar cache como única ação.
- Não mexer em `htaccess` sem necessidade.
- Não restaurar backup completo quando o problema parece ser só do core.

## Quando escalar

- Quando o erro persistir após isolar plugin, tema, Elementor e core.
- Quando houver risco de perda de conteúdo.
- Quando a causa estiver fora do WordPress.

## Links relacionados

- [[Erro Crítico  no WordPress]]
- [[Instalação Manual do Core do WordPress]]
- [[Restauração do Core do WordPress (Automatico)]]
- [[Alteração de Senha do WordPress via phpMyAdmin]]
- [[Conferência de Certificado SSL]]

## Próxima revisão

Precisa validar com casos reais de plugin, tema, Elementor e core corrompido.
