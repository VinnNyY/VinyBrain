# Publicar Tutorial StayCloud

## 1. Objetivo

Publicar automaticamente um tutorial StayCloud ja validado no BetterDocs, com upload dos prints finais, preenchimento de Rank Math, categoria, publicacao publica, validacao da URL e atualizacao dos registros locais.

Este workflow so pode ser executado depois da confirmacao explicita de Vinicius:

```txt
APROVADO PARA PUBLICAR
```

Sem essa frase exata, a atuacao fica limitada a criacao local, preview, revisao, sanitizacao, preparacao de codigo e informe de pendencias.

Regra máxima:

Nenhum novo tutorial do Painel Novo pode ser produzido ou publicado em lote enquanto o padrão visual não estiver estabilizado.

A autorização `APROVADO PARA PUBLICAR` vale somente para o tutorial informado. Se houver mais de um tutorial na mensagem, validar individualmente o nome de cada tutorial e publicar um por vez.

## 2. Comando

Comando manual:

```txt
/publicar-tutorial-staycloud
```

Entradas obrigatorias:

- caminho da pasta do tutorial;
- confirmacao explicita `APROVADO PARA PUBLICAR`;
- categoria desejada, somente quando diferente de `Painel novo`;
- indicacao se e artigo novo ou atualizacao de artigo existente.

Categoria padrao:

```txt
Painel novo
```

Nao inventar categoria diferente.

## 3. Pasta oficial

Usar somente tutoriais dentro de:

```txt
/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/
```

Cada tutorial precisa possuir:

- `01 - VISUALIZAR TUTORIAL.html`
- `02 - COLAR NO WORDPRESS.txt`
- `03 - SEO RANK MATH.txt`
- `04 - VALIDAÇÃO FINAL.md`
- `prints-finais/`
- `apoio/`

## 4. Regra de autorizacao

Antes de receber `APROVADO PARA PUBLICAR`, pode:

- criar arquivos locais;
- gerar preview;
- revisar SEO;
- corrigir prints;
- sanitizar dados;
- preparar codigo;
- informar pendencias.

Antes de receber `APROVADO PARA PUBLICAR`, nao pode:

- subir imagens;
- criar documento no BetterDocs;
- editar artigo publico;
- publicar conteudo.

Depois de receber `APROVADO PARA PUBLICAR`, a autorizacao vale somente para o tutorial informado e cobre:

- upload dos prints finais daquele tutorial;
- criacao ou atualizacao do documento informado;
- preenchimento do Rank Math;
- selecao da categoria;
- publicacao publica;
- validacao pos-publicacao;
- atualizacao da meta e dos relatorios locais.

## 5. Status permitidos

Usar somente estes status:

- `Aguardando validação de Vinicius`
- `Aprovado para publicação`
- `Publicação em andamento`
- `Publicado — aguardando validação pública`
- `Publicado e validado`

O tutorial so conta para a meta quando estiver `Publicado e validado`.

## 6. Etapa 1: Quality Gate antes do WordPress

Antes de acessar o WordPress, validar:

- existe `01 - VISUALIZAR TUTORIAL.html`;
- existe `02 - COLAR NO WORDPRESS.txt`;
- existe `03 - SEO RANK MATH.txt`;
- existe `04 - VALIDAÇÃO FINAL.md`;
- existe `prints-finais/`;
- todos os prints estao sanitizados;
- nenhum print exibe e-mail, IP, nome pessoal, documento, hostname, ID de cliente ou dado sensivel;
- todos os prints possuem marcacoes corretas;
- nenhuma marcacao cobre o alvo;
- cada marcacao aponta exatamente para o elemento citado no texto;
- cada print possui, por padrão, somente um alvo principal;
- o fluxo `texto do passo -> elemento marcado -> resultado exibido no passo seguinte` foi validado;
- o preview abre corretamente;
- o preview possui texto completo;
- o preview possui H1, H2 e H3;
- o conteudo possui pelo menos 600 palavras;
- os prints aparecem na ordem correta;
- nao ha Markdown cru;
- nao ha imagem quebrada;
- o SEO possui palavra-chave principal, titulo SEO, slug, meta description, excerpt, categoria, tags, titulo social e descricao social;
- existem no minimo dois links internos reais;
- o material esta preparado para score minimo 80/100 no Rank Math.

Se qualquer item falhar:

- nao acessar o WordPress;
- nao fazer upload;
- nao publicar;
- informar exatamente a pendencia.

## 7. Etapa 2: verificar duplicacao do artigo

Antes de criar novo documento, pesquisar no BetterDocs:

- titulo exato;
- slug;
- variacoes proximas;
- rascunhos existentes;
- artigos publicados.

Se existir documento com o mesmo objetivo:

- nao criar outro automaticamente;
- nao permitir slug com `-2`, `-3` ou outro sufixo;
- identificar se e atualizacao de artigo existente;
- atualizar somente quando isso estiver claramente autorizado.

Para tutorial novo:

- criar um unico documento;
- usar o slug definido em `03 - SEO RANK MATH.txt`;
- nao aceitar slug automatico numerico;
- nao criar duplicidade.

## 8. Etapa 3: subir os prints finais

Depois da autorizacao, acessar:

```txt
https://ajuda.staycloud.com.br/wp-admin/upload.php
```

Usar somente arquivos dentro de:

```txt
prints-finais/
```

Nunca usar:

- originais sensiveis;
- versoes intermediarias;
- imagens reprovadas;
- `apoio/originais-e-versoes-antigas/`.

Antes de subir cada imagem:

- pesquisar pelo nome;
- verificar se a mesma versao sanitizada ja existe;
- reutilizar quando for exatamente a mesma imagem;
- evitar duplicacao desnecessaria.

Quando precisar subir:

- enviar uma imagem por vez;
- confirmar conclusao;
- preencher titulo;
- preencher ALT text;
- recuperar ID da midia;
- recuperar a URL do campo `URL do arquivo`.

Nao usar link permanente da midia, URL de edicao ou caminho local.

A URL correta deve:

- comecar com `https://`;
- pertencer a `ajuda.staycloud.com.br`;
- conter `/wp-content/uploads/`;
- apontar diretamente para a imagem;
- abrir corretamente.

Registrar em `apoio/midias-publicas.json`:

```json
{
  "tutorial": "",
  "midias": [
    {
      "etapa": "",
      "arquivo_local": "",
      "media_id": 0,
      "public_url": "",
      "title": "",
      "alt_text": "",
      "status": "validada"
    }
  ]
}
```

Nao salvar credenciais, cookies, tokens ou nonces.

## 9. Etapa 4: atualizar o codigo HTML

Atualizar `02 - COLAR NO WORDPRESS.txt` substituindo todas as imagens locais pelas URLs publicas.

Formato obrigatorio:

```html
<figure>
  <img src="URL_PUBLICA" alt="ALT TEXT">
  <figcaption>Legenda correspondente.</figcaption>
</figure>
```

O TXT local pode manter o H1 para visualizacao e backup.

Para inserir no WordPress automaticamente:

1. Ler o primeiro H1 do TXT.
2. Usar esse texto no campo nativo de titulo.
3. Remover somente o primeiro H1 do conteudo antes de colar no corpo.
4. Manter todos os H2, H3, textos, listas, imagens e legendas.

O corpo inserido no WordPress nao deve possuir H1.

Validar ausencia de Markdown, `#`, `##`, `**`, `![`, caminhos locais, `file://`, `/home/vinicius-alves/`, `prints-finais/`, placeholders de URL, scripts, iframes e CSS.

## 10. Etapa 5: acessar o BetterDocs

No WordPress, acessar:

```txt
BetterDocs -> Adicionar novo
```

Nao usar `Rascunho rapido`.

Nao criar Pagina ou Post comum.

Se o navegador pedir login ou verificacao:

- nao preencher credenciais automaticamente;
- nao colocar aspas ou caracteres extras;
- nao repetir login em loop;
- manter a janela aberta;
- informar `Aguardando login ou verificação manual no navegador.`;
- continuar na mesma sessao depois da confirmacao.

## 11. Etapa 6: preencher titulo e corpo

No campo `Adicionar titulo`, inserir titulo claro e resumido.

Usar preferencialmente o titulo definido em `03 - SEO RANK MATH.txt` ou o conteudo do primeiro H1 do TXT.

Nao criar titulo generico e nao duplicar o titulo no corpo.

Abrir o editor de codigo pelo menu de tres pontos:

```txt
Editor -> Editor de codigo
```

Ou usar o atalho disponivel.

No campo `Comece a escrever um texto ou HTML`, colar somente o corpo HTML sem o primeiro H1.

Nao colar Markdown, bloco com tres crases, SEO Rank Math, titulo nativo, instrucoes internas ou caminhos locais.

Depois de colar:

- salvar como rascunho;
- sair temporariamente do editor de codigo;
- conferir se o conteudo renderiza;
- confirmar que as imagens aparecem.

O botao `Publicar` ainda nao pode ser acionado nesta etapa.

## 12. Etapa 7: preencher Rank Math

Abrir o painel Rank Math no canto superior.

Preencher a palavra-chave de foco usando exatamente a palavra-chave principal definida em `03 - SEO RANK MATH.txt`.

Depois de digitar:

- pressionar `Enter`, quando o campo exigir;
- aguardar o Rank Math transformar o texto em etiqueta/chip;
- confirmar visualmente que a palavra-chave aparece como chip ativo;
- confirmar que o campo nao contem somente texto temporario ainda nao aceito.

Nao basta digitar a palavra-chave. E obrigatorio confirmar que o Rank Math transformou o texto em palavra-chave ativa e recalculou o score.

A palavra-chave deve existir no titulo SEO, meta description, slug, inicio do conteudo, conteudo, pelo menos um H2 e pelo menos um ALT.

Nao alterar a palavra-chave apenas para aumentar score sem relacao com o conteudo.

## 13. Etapa 8: editar snippet

Dentro do Rank Math, clicar em:

```txt
Editar Fragmento de código (snippet)
```

Preencher:

- `Titulo`: titulo SEO do arquivo SEO;
- `Link permanente`: slug do arquivo SEO;
- `Descricao`: meta description do arquivo SEO.

Validar:

- titulo idealmente entre 50 e 60 caracteres;
- slug curto, sem acentos e com hifens;
- descricao aproximadamente entre 140 e 160 caracteres;
- palavra-chave presente naturalmente;
- nenhuma URL concorrente;
- nenhum sufixo automatico `-2`.

Depois de preencher, conferir a previa do snippet e fechar o modal somente quando os tres valores estiverem exibidos corretamente.

Se o slug ja estiver ocupado:

- nao publicar;
- verificar se e atualizacao;
- informar o conflito.

## 14. Etapa 9: campos SEO adicionais

Preencher quando disponiveis:

- excerpt ou resumo;
- titulo social;
- descricao social;
- imagem social ou destacada;
- ALT da imagem destacada;
- tags.

Usar os valores definidos em `03 - SEO RANK MATH.txt`.

Nao inventar conteudo diferente.

Salvar o documento como rascunho depois de preencher esses campos.

## Gate Rank Math antes de publicar

Antes de clicar em `Publicar`, confirmar visualmente:

1. A palavra-chave de foco foi preenchida.
2. A palavra-chave aparece como etiqueta/chip ativa.
3. O campo nao contem somente texto ainda nao confirmado.
4. O titulo SEO foi salvo.
5. O slug foi salvo.
6. A meta description foi salva.
7. O resumo foi preenchido.
8. A categoria foi selecionada.
9. O Rank Math recalculou.
10. O score real e no minimo 80/100.

Se qualquer item estiver ausente:

- nao publicar;
- permanecer no mesmo documento;
- preencher os dados;
- salvar;
- recalcular;
- validar novamente.

O botao `Publicar` nunca pode ser acionado antes deste Gate Rank Math.

## 15. Etapa 10: validar score Rank Math

Antes de publicar:

- aguardar o Rank Math recalcular;
- verificar score;
- verificar SEO basico;
- verificar adicional;
- verificar legibilidade.

Quality Gate:

- score minimo 80/100;
- nenhum erro critico em SEO basico;
- palavra-chave confirmada como chip ativo;
- titulo SEO salvo;
- palavra-chave na meta;
- palavra-chave no slug;
- palavra-chave no inicio;
- palavra-chave no corpo;
- palavra-chave em subtitulo;
- palavra-chave em ALT;
- conteudo com pelo menos 600 palavras;
- links internos validos;
- excerpt preenchido.

Se o score estiver abaixo de 80:

- nao publicar;
- corrigir o mesmo documento;
- corrigir somente pendencias reais indicadas pelo Rank Math;
- preservar o sentido;
- nao criar texto generico;
- nao repetir palavra-chave artificialmente;
- recalcular novamente.

Nao inventar score.

## 16. Etapa 11: definir categoria

Abrir as configuracoes gerais do documento.

Em `Categorias`, selecionar por padrao:

```txt
Painel novo
```

Usar outra categoria somente quando Vinicius informar explicitamente.

Antes de selecionar:

- verificar se ja esta marcada;
- nao marcar categorias aleatorias;
- nao criar categoria nova;
- nao deixar sem categoria.

Registrar a categoria utilizada.

## 17. Etapa 12: revisao pre-publicacao

Antes de clicar em `Publicar`, validar:

- titulo preenchido;
- corpo HTML preenchido;
- nenhum H1 duplicado;
- imagens visiveis;
- imagens na ordem correta;
- ALT texts presentes;
- legendas presentes;
- nenhum caminho local;
- nenhum Markdown visivel;
- palavra-chave preenchida;
- palavra-chave confirmada como chip ativo;
- snippet preenchido;
- slug correto;
- meta description correta;
- excerpt preenchido;
- categoria `Painel novo` marcada ou categoria explicitamente solicitada;
- score Rank Math minimo 80;
- documento correto do BetterDocs;
- nenhum artigo duplicado.

Abrir a previa quando disponivel.

Se houver qualquer erro:

- nao publicar;
- corrigir o mesmo documento;
- validar novamente.

## 18. Etapa 13: publicar

Somente depois de todos os gates aprovados:

1. Clicar em `Publicar`.
2. Na confirmacao, manter `Visibilidade: Público`.
3. Manter publicacao imediata, salvo instrucao diferente.
4. Revisar titulo e categoria.
5. Clicar novamente em `Publicar`.

Nao cancelar, nao agendar e nao mudar para privado.

## Ordem definitiva da publicacao

1. Criar BetterDocs.
2. Preencher titulo.
3. Colar HTML.
4. Salvar como rascunho.
5. Confirmar imagens.
6. Abrir Rank Math.
7. Preencher palavra-chave e pressionar `Enter`.
8. Confirmar chip ativo.
9. Preencher snippet.
10. Preencher resumo.
11. Preencher social.
12. Selecionar categoria.
13. Salvar rascunho.
14. Aguardar score recalcular.
15. Corrigir ate no minimo 80.
16. Abrir previa.
17. Executar revisao final.
18. Somente entao publicar.
19. Validar a pagina publica.

O botao `Publicar` nunca pode ser acionado antes do Gate Rank Math.

## 19. Etapa 14: validar publicacao

Depois de publicar:

- abrir a URL publica;
- confirmar HTTP 200;
- confirmar acesso sem sessao administrativa;
- confirmar titulo;
- confirmar conteudo;
- confirmar imagens;
- confirmar legendas;
- confirmar links;
- confirmar ausencia de Markdown;
- confirmar ausencia de caminhos locais;
- confirmar ausencia de dados sensiveis;
- confirmar slug correto;
- confirmar categoria correta.

Se a pagina publica apresentar erro:

- nao criar outro artigo;
- corrigir o mesmo artigo;
- validar novamente.

## 20. Etapa 15: atualizar o Viny Brain

Atualizar `04 - VALIDAÇÃO FINAL.md` com:

- ID do documento;
- URL de edicao;
- URL publica;
- titulo;
- slug;
- categoria;
- palavra-chave;
- score Rank Math;
- IDs das midias;
- URLs das imagens;
- data e hora da publicacao;
- validacao publica;
- status final.

Atualizar tambem:

- `00 - ÍNDICE DOS TUTORIAIS.md`;
- `Fila de Produção - Painel Novo.md`;
- meta mensal.

O tutorial so conta para a meta quando esta publicado, acessivel publicamente e passou na validacao pos-publicacao.

## 21. Seguranca

- Nao imprimir credenciais.
- Nao salvar cookies.
- Nao registrar tokens.
- Nao usar usuario de exibicao como login.
- Nao inserir aspas nos campos.
- Nao excluir midia.
- Nao apagar artigo.
- Nao alterar outro documento.
- Nao criar duplicacoes.
- Nao publicar sem autorizacao explicita.
- Nao criar categoria nova.
- Nao executar acoes financeiras.
- Nao alterar DNS ou configuracoes do painel StayCloud.

## 22. Teste controlado

Nao publicar outro tutorial imediatamente.

Primeiro:

1. Criar este workflow.
2. Atualizar agentes e regras.
3. Selecionar um tutorial ja validado.
4. Solicitar a confirmacao `APROVADO PARA PUBLICAR`.
5. Executar o fluxo completo somente nesse tutorial.
6. Validar o resultado.
7. Registrar problemas encontrados.
8. Corrigir o workflow antes do proximo.

## 23. Resultado final esperado

Ao finalizar uma publicacao, informar:

1. Tutorial publicado.
2. ID do BetterDocs.
3. Titulo utilizado.
4. URL publica.
5. Slug.
6. Categoria.
7. Palavra-chave principal.
8. Score Rank Math.
9. Confirmacao de chip ativo da palavra-chave.
10. Quantidade de imagens.
11. IDs das midias.
12. URLs publicas das imagens.
13. Confirmacao de ausencia de Markdown.
14. Confirmacao de ausencia de caminhos locais.
15. Confirmacao de que a pagina publica abriu.
16. Status da meta mensal.
17. Pendencias, caso existam.

## 24. Prompt reutilizavel

```txt
Siga o workflow Publicar Tutorial StayCloud. Use a pasta do tutorial informada, valide o Quality Gate local, confirme que a frase exata APROVADO PARA PUBLICAR foi recebida para este tutorial, verifique duplicacao no BetterDocs, suba somente prints-finais sanitizados, atualize o HTML com URLs publicas, crie ou atualize o documento BetterDocs autorizado, salve como rascunho, preencha Rank Math, pressione Enter na palavra-chave quando necessario, confirme chip ativo, preencha snippet, resumo, social e categoria, salve rascunho, aguarde o recalculo do Rank Math, publique somente se o score real for no minimo 80/100 e todos os gates passarem, valide a URL publica e atualize os registros locais sem salvar credenciais, cookies, tokens ou nonces.
```
