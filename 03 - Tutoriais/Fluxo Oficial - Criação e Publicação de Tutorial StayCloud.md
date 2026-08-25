# Fluxo Oficial — Tutorial StayCloud

## Regra máxima — produção unitária

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

Para cada passo, validar:

```txt
texto do passo -> elemento marcado -> resultado exibido no passo seguinte
```

Não marcar botão próximo, banner, aviso financeiro, fatura, opção alternativa, área pertencente a outro passo ou elemento apenas porque está visível.

## Fase 1 — Ideia e auditoria

1. Escolher o tema.
2. Auditar duplicação na base pública e local.
3. Confirmar se é novo, refatoração ou descarte.
4. Registrar na fila e no backlog.

## Fase 2 — Produção local

1. Validar o fluxo real no Painel Novo.
2. Criar texto para cliente final.
3. Criar plano de prints.
4. Capturar prints.
5. Sanitizar dados sensíveis.
6. Validar texto, alvo e tela seguinte.
7. Preparar SEO para score mínimo 80.
8. Criar os quatro arquivos oficiais:
   - `01 - VISUALIZAR TUTORIAL.html`
   - `02 - COLAR NO WORDPRESS.txt`
   - `03 - SEO RANK MATH.txt`
   - `04 - VALIDAÇÃO FINAL.md`
9. Manter `prints-finais/` e `apoio/`.

## Fase 3 — Validação de Vinicius

1. Abrir o preview.
2. Validar texto.
3. Validar prints e marcações.
4. Validar se o botão correto foi destacado.
5. Validar SEO.
6. Corrigir até aprovação.

Gatilho obrigatório:

```txt
APROVADO PARA PUBLICAR
```

## Fase 4 — Publicação automática

Executar:

```txt
/publicar-tutorial-staycloud
```

Etapas:

1. Validar Quality Gate.
2. Subir apenas prints sanitizados.
3. Recuperar IDs e URLs públicas.
4. Atualizar o HTML com URLs públicas.
5. Acessar BetterDocs -> Adicionar novo.
6. Abrir Editor de código.
7. Preencher título nativo.
8. Colar o HTML sem H1 duplicado.
9. Salvar como rascunho.
10. Preencher palavra-chave no Rank Math.
11. Pressionar Enter e confirmar o chip ativo.
12. Preencher título SEO, slug e meta description.
13. Preencher resumo e social.
14. Selecionar categoria padrão Painel novo.
15. Aguardar o Rank Math recalcular.
16. Corrigir até score real mínimo de 80/100.
17. Abrir prévia.
18. Fazer revisão final.
19. Publicar.
20. Confirmar novamente com visibilidade Pública.
21. Validar a URL pública.

## Fase 5 — Pós-publicação

1. Confirmar HTTP 200.
2. Conferir título, conteúdo e imagens.
3. Conferir ausência de Markdown.
4. Conferir ausência de caminhos locais.
5. Conferir dados sensíveis.
6. Conferir slug e categoria.
7. Registrar ID, URL, mídias e score.
8. Atualizar índice, fila e meta.
9. Marcar como Publicado e validado.

## Gates obrigatórios

- Visual aprovado.
- Prints aprovados.
- Alvos corretos.
- Dados sanitizados.
- HTML validado.
- Imagens públicas.
- Palavra-chave ativa no Rank Math.
- Snippet preenchido.
- Categoria selecionada.
- Score real mínimo 80.
- Prévia aprovada.
- Autorização explícita de Vinicius.

## Segurança

- Nunca salvar credenciais no Viny Brain.
- Nunca registrar cookies, tokens ou sessão.
- Nunca publicar sem autorização.
- Nunca usar print original sensível.
- Nunca criar artigo duplicado.
- Nunca aceitar slug com `-2` ou `-3` sem investigar.
- Nunca publicar com Rank Math vazio ou abaixo do gate.

## Registro obrigatório

Cada tutorial precisa ter `apoio/registro-publicacao.md`.

O registro deve documentar criação, validação, sanitização, upload, BetterDocs, Rank Math, publicação, validação pública e atualização da meta. Nada pode ficar somente no histórico do terminal.
