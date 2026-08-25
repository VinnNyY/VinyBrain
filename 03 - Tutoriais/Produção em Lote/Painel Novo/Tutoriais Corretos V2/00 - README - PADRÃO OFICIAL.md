# Padrão oficial dos tutoriais V2

## Regra máxima de produção unitária

Nenhum novo tutorial do Painel Novo pode ser produzido em lote enquanto o padrão visual não estiver estabilizado.

Fluxo obrigatório:

1. Escolher um tema.
2. Auditar duplicação.
3. Validar o fluxo real.
4. Criar o texto.
5. Criar o plano de prints.
6. Capturar os prints.
7. Sanitizar os dados.
8. Marcar somente um alvo principal por print.
9. Abrir o preview.
10. Parar para validação de Vinicius.
11. Corrigir o mesmo tutorial até aprovação.
12. Somente depois iniciar outro tutorial.

Regra visual obrigatória:

- validar sempre `texto do passo -> elemento marcado -> resultado exibido no passo seguinte`;
- cada print deve possuir, por padrão, somente um alvo principal;
- a marcação precisa apontar exatamente para o botão, menu, campo, filtro ou informação citada;
- não marcar botão próximo, banner, aviso financeiro, fatura, opção alternativa, área de outro passo ou elemento apenas visível;
- a marcação não pode cobrir botão, texto, campo, menu, título, informação necessária ou alvo principal;
- usar seta curta apontando de fora, caixa fina, círculo discreto, zoom ou recorte quando necessário.

Cada tutorial possui quatro arquivos principais:

- 01 - VISUALIZAR TUTORIAL.html
- 02 - COLAR NO WORDPRESS.txt
- 03 - SEO RANK MATH.txt
- 04 - VALIDAÇÃO FINAL.md

Também possui:

- prints-finais/
- apoio/
- apoio/registro-publicacao.md

O modelo oficial também precisa manter `apoio/registro-publicacao.md` para todo tutorial novo já nascer com rastreabilidade de criação, validação, upload, BetterDocs, Rank Math, publicação e validação pública.

Para publicar:

Abra o preview HTML e confira.
Abra o TXT do código.
Copie todo o conteúdo.
Cole no Editor de código do WordPress.
Salve primeiro como rascunho.
Preencha o Rank Math usando o arquivo de SEO.
Confirme que a palavra-chave virou etiqueta/chip ativo.
Preencha snippet, resumo, social e categoria.
Aguarde o Rank Math recalcular.
Publique somente com score real mínimo 80/100.
As imagens já estão incorporadas pelas URLs públicas.
Não é necessário inserir imagens manualmente.
Nunca utilizar os arquivos editoriais antigos para publicar.

## Gate Rank Math antes de publicar

Antes de clicar em Publicar, confirmar visualmente:

1. A palavra-chave de foco foi preenchida.
2. A palavra-chave aparece como etiqueta/chip ativa.
3. O campo não contém somente texto ainda não confirmado.
4. O título SEO foi salvo.
5. O slug foi salvo.
6. A meta description foi salva.
7. O resumo foi preenchido.
8. A categoria foi selecionada.
9. O Rank Math recalculou.
10. O score real é no mínimo 80/100.

Se qualquer item estiver ausente:

- não publicar;
- permanecer no mesmo documento;
- preencher os dados;
- salvar;
- recalcular;
- validar novamente.

Não basta digitar a palavra-chave. É obrigatório confirmar que o Rank Math transformou o texto em palavra-chave ativa e recalculou o score.

## Quality Gate SEO

Nenhum tutorial pode ser aprovado somente porque o HTML abriu, as imagens carregaram ou o texto está formatado.

Também precisa passar pelo Quality Gate SEO:

- score Rank Math estimado ou real igual ou superior a 80/100;
- palavra-chave principal no título SEO, meta description, slug, primeiro parágrafo, corpo, H2, H3 quando natural e ALT de pelo menos uma imagem;
- conteúdo com profundidade suficiente, preferencialmente entre 650 e 900 palavras;
- título SEO e meta description dentro dos limites recomendados;
- pelo menos dois links internos úteis e válidos;
- densidade natural, sem keyword stuffing;
- validação local registrada quando não houver conferência direta no Rank Math.

Status possíveis:

1. Conteúdo em produção.
2. Visual validado.
3. SEO preparado.
4. SEO validado no WordPress.
5. Pronto para publicação.
6. Publicado.
7. Publicação validada.

`Pronto para publicação` só pode ser usado depois do Gate Rank Math completo no rascunho. `Publicado` sem score real mínimo 80/100 é publicação incompleta e deve voltar para correção no mesmo documento.

O tutorial só conta na meta quando estiver publicado e acessível publicamente.
O tutorial só conta na meta quando também estiver validado e com `apoio/registro-publicacao.md` atualizado.

## Quality Gate dos prints

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

Um tutorial só pode ser marcado como pronto quando:

- texto aprovado;
- SEO aprovado;
- todos os prints aprovados;
- alvos corretos;
- dados sensíveis censurados;
- imagens públicas correspondem aos arquivos locais finais;
- HTML usa as URLs das versões aprovadas;
- preview foi aberto e revisado;
- nenhum caminho local existe;
- publicação real ainda depende da autorização de Vinicius.
