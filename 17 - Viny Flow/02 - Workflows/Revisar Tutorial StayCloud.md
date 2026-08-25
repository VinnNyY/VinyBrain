# Revisar Tutorial StayCloud

## 1. Objetivo

Documentar o processo completo para revisar um tutorial StayCloud já criado localmente, garantindo qualidade textual, visual, técnica e de SEO antes de qualquer etapa manual no WordPress.

## Regra máxima — produção unitária

Nenhum novo tutorial do Painel Novo pode ser produzido em lote enquanto o padrão visual não estiver estabilizado.

Durante a revisão, reprovar qualquer pacote criado em lote que não tenha validação individual de Vinicius.

Para cada print, validar:

```txt
texto do passo -> elemento marcado -> resultado exibido no passo seguinte
```

Cada print deve ter, por padrão, somente um alvo principal. A marcação não pode cobrir botão, texto, campo, menu, título, informação necessária ou alvo principal.

## 2. Quando usar

Use este workflow quando:

- o tutorial StayCloud já existir em rascunho local;
- houver HTML e Markdown prontos ou quase prontos;
- os prints finais já tiverem sido capturados;
- a validação SEO precisar ser conferida;
- for necessário decidir se o material está pronto para revisão humana ou implementação manual.

## 3. Entrada esperada

- pasta do tutorial;
- HTML local;
- Markdown local;
- prints finais;
- URLs do WordPress, somente quando já houver upload autorizado;
- validação SEO;
- Guia de Padrão StayCloud Painel Novo lido anteriormente.

## 4. Agentes envolvidos

- **Agente Tutorial StayCloud**: confere se a estrutura e o fluxo seguem o padrão StayCloud e se o tom está em linguagem pública para cliente final.
- **Agente SEO Rank Math**: valida palavra-chave, título SEO, slug, meta description, alt text e meta acima de 80.
- **Agente Visual e Prints**: audita enquadramento, zoom, blur, marcação e contexto visual, reprovando print sem marcação suficiente quando clique, campo ou área importante dependem disso.
- **Agente UI/UX Experience**: valida clareza, fluxo, experiencia do cliente leigo, acessibilidade e friccao antes do checklist final.
- **Agente WordPress**: confere se o material está pronto para implementação manual.
- **Agente Auditor**: avalia consistência, lacunas e aderência ao padrão.
- **Agente Segurança**: confirma que não há credenciais, dados reais ou exposição sensível.
- **Quality Gate**: reprova se os prints não estiverem desenhados, se houver tom interno ou se o material ainda parecer rascunho técnico.

## 5. Skills usadas

- `staycloud-tutorial-guidelines`
- `writing-guidelines`
- `web-design-guidelines`

## 6. Etapa 1: validar estrutura do tutorial

1. Conferir se o tutorial segue a estrutura obrigatória.
2. Conferir se objetivo, pré-requisitos e passos estão claros.
3. Conferir se o encerramento existe.
4. Conferir se o tutorial não mistura rascunho com versão final.

## 7. Etapa 2: revisar texto e clareza

1. Verificar tom natural e profissional.
2. Verificar concisão.
3. Verificar uma ação por passo.
4. Verificar consistência de nomes, botões e menus.
5. Eliminar linguagem genérica ou robótica.
6. Eliminar linguagem interna e garantir tom de cliente final.

## 8. Etapa 3: revisar prints

Revisar:

- enquadramento;
- zoom;
- blur;
- marcação;
- contexto visual;
- ausência de dados sensíveis.

Critério:

- cada print precisa ter contexto suficiente, foco claro e marcação suficiente quando houver clique, campo ou área importante.

## 9. Etapa 4: revisar HTML para WordPress

1. Conferir se o HTML está limpo.
2. Conferir se a hierarquia visual está coerente.
3. Conferir se as imagens estão no ponto certo.
4. Conferir se o HTML não contém notas internas, credenciais ou marcação indevida.

## 10. Etapa 5: revisar Markdown

1. Conferir se o Markdown final contém apenas o HTML limpo.
2. Conferir se não há rascunho operacional misturado.
3. Conferir se não há caminhos locais finais.
4. Conferir se o arquivo está pronto para colagem.

## 11. Etapa 6: validar URLs das imagens

1. Verificar se as URLs públicas do WordPress estão corretas.
2. Verificar se não restaram caminhos locais.
3. Verificar se as imagens carregam.
4. Verificar se os nomes estão consistentes com o tutorial.

## 12. Etapa 7: validar SEO Rank Math

Validar:

- palavra-chave principal;
- título SEO;
- slug;
- meta description;
- alt text;
- objetivo acima de 80.

Regras:

- a palavra-chave principal deve aparecer no título, na introdução, no slug e na meta description;
- quando natural, deve aparecer em um subtítulo;
- os alt texts devem ajudar na compreensão;
- sem meta description, a revisão ainda não está completa.

## 13. Etapa 8: validar UI/UX Experience

1. Conferir clareza geral do tutorial.
2. Conferir se o fluxo segue a jornada real do cliente leigo.
3. Conferir se os prints ajudam a executar cada passo.
4. Conferir se o texto reduz ambiguidade.
5. Conferir se existem alertas, alternativas e orientacao para erro.

## 14. Etapa 9: confirmar segurança

Confirmar:

- sem credenciais;
- sem dados reais de cliente;
- sem caminhos locais finais;
- sem publicação automática.

Inspecionar os prints ampliados. Dados identificáveis ou sensíveis exigem cópia sanitizada em `prints-finais/`; o original deve permanecer isolado e sem referência no Markdown, HTML preview, HTML WordPress, modelos aprovados ou mídia pública.

## 15. Etapa 10: classificar status

- **Rascunho**: material ainda incompleto ou com várias pendências.
- **Pronto para revisão humana**: estrutura e texto ok, mas ainda precisa validação final.
- **Pronto para validação de Vinicius**: HTML preview, TXT, prints finais e SEO local revisados, sem ação em WordPress.
- **Pronto para publicação após aprovação explícita**: HTML, prints, URLs ou mapeamento para upload e SEO revisados, aguardando somente a frase exata `APROVADO PARA PUBLICAR`.
- **Reprovado**: existem problemas de estrutura, segurança, prints, texto ou SEO.

`Pronto para publicação após aprovação explícita` não significa publicado. O WordPress só pode ser acessado pelo workflow `Publicar Tutorial StayCloud` depois do gatilho exato.

## 16. Critérios de aprovação

O workflow está aprovado quando:

- a estrutura do tutorial está correta;
- o texto está claro, natural e em tom de cliente final;
- os prints estão legíveis, contextualizados e desenhados quando necessário;
- o HTML está limpo;
- o Markdown está pronto;
- as URLs das imagens estão válidas;
- a validação SEO está completa;
- a meta description existe;
- a nota alvo acima de 80 foi considerada;
- não há credenciais nem dados reais expostos.

## 17. Critérios de reprovação

Reprovar se:

- houver placeholder no material final;
- a estrutura do tutorial estiver incompleta;
- o texto estiver confuso, genérico ou com tom interno;
- os prints estiverem cortados, ampliados ou sem contexto;
- o blur esconder informação útil;
- o HTML estiver sujo;
- o Markdown não estiver pronto;
- faltarem URLs públicas depois de upload autorizado, ou faltar mapeamento claro de prints finais antes da aprovação;
- a validação SEO estiver incompleta;
- existir risco de credencial ou dado sensível;
- faltar marcação visual em print que exige orientação.

## 18. Checklist final

- [ ] Estrutura validada
- [ ] Texto revisado
- [ ] Prints revisados
- [ ] UI/UX Experience validado
- [ ] HTML revisado
- [ ] Markdown revisado
- [ ] URLs das imagens validadas
- [ ] SEO Rank Math validado
- [ ] Segurança confirmada
- [ ] Status classificado
- [ ] `apoio/registro-publicacao.md` criado ou atualizado
- [ ] Pendências para publicação registradas no Obsidian
- [ ] Material pronto para próxima etapa

## 19. Prompt reutilizável para iniciar esse workflow

`Siga o workflow Revisar Tutorial StayCloud. Valide a estrutura do tutorial, revise o texto, audite os prints, valide UI/UX Experience, confira HTML, Markdown, URLs das imagens e SEO Rank Math, e classifique o status final sem publicar e sem expor credenciais.`

## 20. Regras obrigatórias para publicação futura no WordPress

1. Markdown é apenas fonte editorial.
2. WordPress deve receber HTML limpo.
3. Todo tutorial V2 precisa do pacote oficial em `Tutoriais Corretos V2`.
4. Somente `02 - COLAR NO WORDPRESS.txt`, sem o primeiro H1 no corpo, pode ser usado no editor.
5. O título deve ser preenchido separadamente.
6. Imagens devem usar URLs públicas diretas somente depois do upload autorizado.
7. Nunca usar caminhos locais no conteúdo público.
8. Nunca usar o link permanente da mídia como imagem.
9. Usar o campo URL do arquivo.
10. Validar automaticamente a ausência de Markdown cru.
11. Criar e validar um rascunho real somente pelo workflow `Publicar Tutorial StayCloud`.
12. Preview local não substitui a prévia real do WordPress.
13. Tutorial só conta na meta quando estiver publicado, acessível publicamente e validado.
14. Nenhum dado sensível pode aparecer nos prints.
15. Não criar nova mídia quando uma versão sanitizada válida já existir.
16. Publicação futura exige categoria padrão `Painel novo`, salvo instrução explícita diferente.
17. Publicação futura exige palavra-chave confirmada como chip ativo no Rank Math.
18. Publicação futura exige snippet preenchido e score real mínimo 80/100 antes de clicar em Publicar.

## 21. Pacote final obrigatório

Confirmar a presença do pacote V2 oficial: `01 - VISUALIZAR TUTORIAL.html`, `02 - COLAR NO WORDPRESS.txt`, `03 - SEO RANK MATH.txt`, `04 - VALIDAÇÃO FINAL.md`, `prints-finais/` e `apoio/`.

O TXT de publicação precisa conter HTML puro e começar com exatamente um H1 para backup local. No WordPress, o primeiro H1 vira título nativo e deve ser removido do corpo. URLs públicas entram somente depois do upload autorizado pelo workflow `Publicar Tutorial StayCloud`. Reprovar pacotes que exijam inserção manual de prints ou entreguem apenas o Markdown editorial.

## 22. Auditoria obrigatória de alvo dos prints

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

Para cada print, responder:

- qual ação o texto manda executar;
- qual elemento deve ser clicado ou conferido;
- se a marcação aponta exatamente para esse elemento;
- se existe outra seta que pode confundir;
- se a marcação cobre o próprio botão;
- se o print possui contexto suficiente;
- se a etapa seguinte comprova que o alvo estava correto;
- se existe dado sensível visível;
- se a legenda corresponde ao alvo;
- se o ALT text corresponde à ação real.

Reprovar publicação quando a imagem pública ainda não corresponder ao print local final.
