# Relatório geral V2

Data: 2026-07-23

## Padrão aplicado

Os dois tutoriais existentes em `Tutoriais Corretos V2` foram atualizados para o padrão simples com Quality Gate SEO.

Cada tutorial contém:

- `01 - VISUALIZAR TUTORIAL.html`
- `02 - COLAR NO WORDPRESS.txt`
- `03 - SEO RANK MATH.txt`
- `04 - VALIDAÇÃO FINAL.md`
- `prints-finais/`
- `apoio/`

## Quality Gate SEO

O tutorial não é considerado aprovado apenas por abrir o HTML ou carregar imagens. O conteúdo público também precisa atender aos critérios locais equivalentes ao Rank Math:

- palavra-chave principal no título SEO, meta description, slug, primeiro parágrafo, primeiras 100 palavras, corpo, H2, H3 e ALT;
- mínimo de 600 palavras;
- densidade natural;
- pelo menos dois links internos úteis;
- título SEO e meta description dentro da faixa recomendada;
- score estimado local igual ou superior a 80/100;
- score real pendente até conferência no Rank Math.

## Resultado por tutorial

| Tutorial | Palavra-chave | Palavras | Densidade estimada | Score estimado local | Status |
|---|---|---:|---:|---:|---|
| Como acompanhar seus chamados no Painel Novo da StayCloud | acompanhar chamados StayCloud | 801 | 0,75% | 84/100 | SEO preparado localmente |
| Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | consultar uso de e-mail | 812 | 0,74% | 84/100 | SEO preparado localmente |

## Validação automática

Comando executado:

`python3 _VALIDAÇÕES GERAIS/validar_pacotes_v2.py`

Resultado:

- APROVADO: 01 - Como acompanhar seus chamados no Painel Novo da StayCloud
- APROVADO: 02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud

## Previews

Os previews foram abertos no Chrome headless e screenshots foram gerados:

- `preview-seo-01-chamados.png`
- `preview-seo-02-uso-email.png`

O conteúdo dentro de `<article>` nos previews corresponde ao arquivo `02 - COLAR NO WORDPRESS.txt`.

## Observações

- Links internos foram selecionados a partir de registros locais de artigos publicados ou estudados na base StayCloud.
- Nenhum link externo foi adicionado, por exceção editorial registrada nos arquivos SEO.
- Nenhum score real do Rank Math foi inventado.
- Nada foi publicado, apagado, enviado por upload ou alterado no WordPress.

## Auditoria de alvos dos prints

Relatório criado:

`_VALIDAÇÕES GERAIS/Auditoria de Alvos e Marcações dos Prints.md`

Resultado:

- Total de tutoriais analisados: 2
- Total de prints analisados: 6
- Prints incorretos identificados antes da correção: 2
- Prints corrigidos localmente: 2
- Prints pendentes de novo upload: 2

Correções locais:

- Tutorial de uso de e-mail, passo 1: removida a marcação em `Ver detalhes`; alvo local corrigido para `Gerenciar`.
- Tutorial de uso de e-mail, passo 3: removida a marcação herdada da aba `E-mails`; alvo local corrigido para os valores de uso e cota.

Status de publicação:

- Tutorial de chamados: aprovado na auditoria de prints.
- Tutorial de uso de e-mail: bloqueado para publicação até upload dos prints corrigidos e atualização das URLs públicas.
