# Validação Final

Tutorial: Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo da StayCloud

Status: Reprovado por Vinicius — não publicar

Data: 2026-07-28

## Auditoria de duplicação

- Categoria oficial Painel novo auditada: sim.
- Base pública pesquisada: sim.
- Obsidian pesquisado: sim.
- Artigo dedicado com o mesmo objetivo encontrado: não.
- Classificação anterior: novo tutorial complementar.
- Classificação revisada: reprovado por escopo fraco e marcações incorretas.
- Observação: artigos existentes usam `Gerenciar` em fluxos específicos, mas não explicam a diferença entre detalhes do card e gerenciamento do serviço.

## Fluxo real validado

- `Ver detalhes` textual não apareceu na interface atual.
- Controle real observado: `Expandir detalhes`.
- Destino de `Expandir detalhes`: expande o card do serviço e mostra indicadores rápidos.
- Destino de `Gerenciar`: abre a tela interna do serviço na aba `Visão geral`.
- Nenhuma alteração foi executada no serviço.
- Nenhuma cobrança, plano, DNS, arquivo, e-mail ou banco de dados foi alterado.

## Prints

| Print | Arquivo | Alvo | Status |
|---|---|---|---|
| 01 | `prints-finais/passo-01-ver-detalhes-e-gerenciar.png` | `Expandir detalhes` e `Gerenciar` numerados | Reprovado: comparação pouco clara e alvo `Expandir detalhes` não aparece como texto visível |
| 02 | `prints-finais/passo-02-destino-ver-detalhes.png` | Indicador `DISCO` exibido após expandir detalhes | Reprovado: marcação no rótulo `DISCO` não explica o destino de detalhes |
| 03 | `prints-finais/passo-03-botao-gerenciar.png` | Botão `Gerenciar` | Reprovado: redundante em relação ao Print 01 |
| 04 | `prints-finais/passo-04-destino-gerenciar.png` | Aba `Visão geral` da tela de gerenciamento | Não reaproveitar sem reconstrução do fluxo |

## Quality Gate visual

- Quality Gate visual: reprovado.
- O tutorial não deve ser publicado.
- O tema precisa ser descartado ou reconstruído com outro objetivo.
- Dados sensíveis foram censurados nos prints finais, mas isso não corrige a falha visual e editorial.

## SEO

- Palavra-chave principal: `Ver detalhes e Gerenciar StayCloud`.
- Título SEO: `Ver detalhes e Gerenciar StayCloud: qual a diferença?`
- Slug: `ver-detalhes-gerenciar-staycloud`.
- Meta description: `Entenda a diferença entre Ver detalhes e Gerenciar StayCloud, saiba qual botão utilizar e evite acessar a área errada no Painel Novo.`
- Categoria: `Painel novo`.
- Tags: `Painel Novo`, `Gerenciar`, `Serviços`, `Navegação`, `StayCloud`.
- Status Rank Math: SEO preparado localmente. Score real depende da etapa WordPress.

## Links internos validados

- https://ajuda.staycloud.com.br/docs/localizar-arquivos-staycloud/ — HTTP 200
- https://ajuda.staycloud.com.br/docs/como-acessar-o-cpanel-painel-novo/ — HTTP 200
- https://ajuda.staycloud.com.br/docs/consultar-faturas-staycloud/ — HTTP 200

## Segurança

- Credenciais não foram registradas.
- Cookies e sessão não foram registrados.
- Domínio, IP, nameservers e identificadores foram censurados nos relatórios e prints finais.
- Originais ficam preservados em `apoio/originais-e-versoes-antigas/`.
- Nada foi publicado.
- Nenhum BetterDocs foi criado.
- Nenhum segundo tutorial foi iniciado.

## Motivo da reprovação

- O título fala em `Ver detalhes`, mas esse botão textual não apareceu no painel atual.
- O elemento real é `Expandir detalhes`, uma seta pequena sem texto visível.
- O Print 01 deixa os dois alvos muito próximos e não comunica bem a diferença.
- O Print 02 marca `DISCO`, o que pode fazer o usuário entender que o tutorial é sobre consumo de disco.
- O objetivo do tutorial ficou menos útil do que outros temas da fila.

## Pendências

- Não publicar.
- Não fazer upload.
- Não criar BetterDocs.
- Decidir se o tema será descartado ou transformado em seção dentro de outro tutorial.
