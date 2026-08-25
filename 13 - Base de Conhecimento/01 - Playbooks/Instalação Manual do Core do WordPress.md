# Instalação Manual do Core do WordPress

## Metadados

- **Data:** 2026-02-05
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Padronizar a reinstalação manual do core do WordPress quando a instalação automática não resolver o problema.

## Diagnóstico rápido

- Use este playbook quando houver forte suspeita de core corrompido ou ausente.
- Se o erro for causado por plugin, tema ou Elementor, este não deve ser o primeiro caminho.
- Se um backup completo for a correção mais segura, a restauração de core pode não ser suficiente.
- Se o `wp-config` ou os logs apontarem outra camada, ajuste a hipótese antes de restaurar.

## Quando Usar

- Quando arquivos centrais do WordPress estiverem corrompidos.
- Quando a aplicação precisar ser restaurada sem apagar a configuração principal.
- Quando o suporte precisar repor apenas o core limpo.

## Pré-requisitos

- Confirmar backup antes de qualquer intervenção.
- Saber quais arquivos devem ser preservados.
- Ter acesso ao ambiente de hospedagem.

## Causas comuns

- Core corrompido.
- Arquivos centrais substituídos ou incompletos.
- Instalação automática falhou.
- Atualização interrompida.
- Ambiente com conflitos que impedem o carregamento do núcleo.

## Passo a Passo Interno

1. Confirmar o escopo da restauração.
2. Preservar a configuração e os dados que não podem ser perdidos.
3. Repor apenas os arquivos centrais necessários.
4. Validar se o site voltou a abrir corretamente.
5. Registrar o que foi mantido e o que foi substituído.

## Passo a passo seguro

1. Confirmar que o problema é mesmo de core.
2. Fazer backup do que for necessário antes de substituir arquivos.
3. Repor apenas o núcleo do WordPress.
4. Testar o site após a ação.
5. Se persistir, retomar diagnóstico de plugin, tema, `wp-config` ou cache.

## Resposta / Orientação Possível para Cliente

- Informar que a estrutura principal do WordPress foi recomposta.
- Explicar que o conteúdo do site precisa ser preservado em paralelo.
- Evitar expor detalhes operacionais desnecessários.

## O que NÃO fazer

- Não sobrescrever conteúdo ou configurações sem validação.
- Não tratar restauração de core como solução universal.
- Não substituir arquivos sem saber o impacto.
- Não seguir sem conferir se o problema não era plugin ou tema.

## Quando escalar

- Quando o site não voltar mesmo após a restauração do core.
- Quando houver risco de perder conteúdo, personalização ou configuração.
- Quando a falha estiver fora do núcleo do WordPress.

## Pontos de Atenção

- Não sobrescrever dados do site sem validação.
- Não tratar a reinstalação como solução para todo erro.
- Não perder a configuração da aplicação.

## Erros Comuns

- Substituir arquivos sem confirmar o impacto.
- Misturar restauração de core com limpeza de conteúdo.
- Não validar o retorno do site após a ação.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1KbSNX9K_wOvm6ZxJUcJVI9uVA36NMt3ww_pBu-EKDdU/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:**

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Como Instalar o WordPress]]`

## Status do Conteúdo

- **Status atual:** Pendente
- **Validação da fonte:** consolidado a partir do índice mestre; revisão fina pendente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O arquivo segue o fluxo de hospedagem e aplicação.
- O procedimento exato depende da fonte original.

## Conexões internas

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Como Instalar o WordPress]]`
- `[[Restauração do Core do WordPress (Automatico)]]`
- `[[Erro Crítico  no WordPress]]`
- `[[Diagnóstico Rápido - WordPress Erro Crítico e Core]]`
