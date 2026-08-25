# Criar Tutorial StayCloud

## Observação Operacional — Deploy/Cloud

- Para tutoriais do Deploy/Cloud, validar primeiro se o botão `Começar grátis` ou ações semelhantes criam recurso, cobrança, projeto ou publicação.
- Se houver risco de ativação ou criação de recurso, parar antes do clique final e registrar a necessidade de autorização de Vinicius.
- Não iniciar tutorial de primeiro deploy, CLI, logs, domínio ou redeploy antes de validar a etapa anterior no painel real.
- Quando a captura de prints sanitizados alterar o DOM de uma tela acionável, separar a captura da execução: primeiro gerar os prints, depois recarregar a tela e executar a ação real em uma passagem limpa.
- Relatórios técnicos do fluxo real devem ser sanitizados antes de permanecerem no Obsidian, removendo tokens, URLs de API, e-mails, IPs e IDs internos.

## 1. Objetivo

Documentar o processo completo e seguro para criar um tutorial StayCloud no `Viny Brain`, desde o planejamento até a preparação final para WordPress, sem publicar automaticamente e sem expor credenciais.

## Regra máxima — produção unitária

Nenhum novo tutorial do Painel Novo pode ser produzido em lote enquanto o padrão visual não estiver estabilizado.

O fluxo obrigatório é:

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

Para cada print, validar `texto do passo -> elemento marcado -> resultado exibido no passo seguinte`.

## 2. Quando usar

Use este workflow quando o trabalho for:

- criar um tutorial StayCloud novo;
- atualizar um tutorial StayCloud com base no fluxo real;
- preparar prints e arquivos TXT com HTML puro para colagem no WordPress;
- revisar SEO e qualidade visual antes da publicação manual.

## 3. Agentes envolvidos

- **Agente Tutorial StayCloud**: conduz o fluxo principal, valida a estrutura, exige tom de cliente final e garante aderência ao padrão StayCloud.
- **Agente SEO Rank Math**: valida palavra-chave, título SEO, slug, meta description e meta acima de 80.
- **Agente Visual e Prints**: audita enquadramento, contexto, marcação, legibilidade e recaptura, reprovando print sem marcação suficiente quando clique, campo ou área importante dependem disso.
- **Agente UI/UX Experience**: valida clareza, fluxo, experiencia do cliente leigo, acessibilidade e friccao antes do fechamento.
- **Agente WordPress**: prepara o material para implementação manual no editor.
- **Agente Auditor**: confere consistência geral, lacunas e aderência ao fluxo.
- **Agente Segurança**: verifica exposição sensível, credenciais e riscos operacionais.
- **Quality Gate**: reprova a entrega se os prints não estiverem desenhados ou se o material ainda parecer interno.

## 4. Skills usadas

- `staycloud-tutorial-guidelines`
- `writing-guidelines`
- `web-design-guidelines`

## 5. Arquivos obrigatórios de referência

- `17 - Viny Flow/README.md`
- `17 - Viny Flow/00 - Orquestração/Como funciona o Viny Flow.md`
- `17 - Viny Flow/00 - Orquestração/Regras de Orquestração.md`
- `17 - Viny Flow/02 - Workflows/Mapa de Workflows.md`
- `03 - Tutoriais/Estudos de Padrão StayCloud/Guia de Padrão - Tutoriais StayCloud Painel Novo.md`
- `03 - Tutoriais/Modo Tutorial StayCloud.md`
- `03 - Tutoriais/Padrão de Prints StayCloud.md`
- `03 - Tutoriais/Checklist SEO Rank Math StayCloud.md`
- `03 - Tutoriais/Checklist UI UX - Tutorial StayCloud.md`
- `03 - Tutoriais/Fluxo Oficial - Criação e Publicação de Tutorial StayCloud.md`
- `03 - Tutoriais/Fluxo Validado - Tutorial StayCloud.md` se existir
- `.agents/skills/staycloud-tutorial-guidelines/SKILL.md`
- `08 - Codex/Skills instaladas.md`

## 6. Etapa 1: planejamento do tutorial

1. Definir o tema do tutorial em uma frase.
2. Confirmar o resultado esperado para o leitor.
3. Listar os passos reais do fluxo.
4. Identificar riscos, dependências e pontos de captura.
5. Ler o Guia de Padrão StayCloud Painel Novo.
6. Definir os arquivos locais que serão usados como base.

Saída esperada:

- título provisório;
- objetivo;
- pré-requisitos;
- sequência de passos;
- risco principal;
- fontes de referência.

## 7. Etapa 2: leitura dos prompts locais sem expor credenciais

1. Ler o prompt principal do fluxo StayCloud.
2. Ler as referências locais associadas ao tema.
3. Identificar o que é sensível e nunca registrar no vault.
4. Manter credenciais, tokens, cookies e dados privados fora das notas.

Regra:

- se precisar mencionar que existe acesso local, usar apenas indicação genérica;
- não copiar valores sensíveis para histórico, checklist ou rascunho.

## 8. Etapa 3: captura real de prints

1. Abrir a interface real do fluxo.
2. Fechar pop-ups, banners e modais.
3. Capturar a tela com contexto suficiente.
4. Evitar zoom excessivo.
5. Garantir que o foco do passo esteja visível.
6. Marcar o clique, campo ou área importante quando necessário.

Critério:

- print precisa mostrar contexto e ação ao mesmo tempo.

## 9. Etapa 4: auditoria visual

1. Conferir se o print está legível.
2. Conferir se há foco claro.
3. Conferir se a marcação visual não polui a imagem.
4. Conferir se o print realmente ajuda o leitor.
5. Reprovar qualquer print cortado demais, ampliado demais ou sem contexto.

## 10. Etapa 5: correção de prints ruins ou cacheados

1. Se um print estiver travado, errado ou antigo, apagar apenas a imagem local do tutorial atual.
2. Recapturar com novo nome de arquivo, se necessário.
3. Atualizar referências no HTML e no Markdown.
4. Repetir a auditoria visual.

Regra:

- nunca apagar imagens fora do diretório do tutorial atual;
- nunca mexer em imagens publicadas sem confirmação explícita.

## 11. Etapa 6: geração do pacote V2

1. Criar o tutorial dentro de `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/`.
2. Montar o HTML final limpo.
3. Organizar título, objetivo, pré-requisitos, passos e encerramento.
4. Inserir os prints finais no ponto correto do preview local.
5. Gerar os arquivos TXT de título, corpo HTML, versão completa, SEO e pacote completo.
6. Criar o preview, o relatório, o checklist e `midias-publicas.json`.
7. Criar `apoio/registro-publicacao.md` com status inicial e sem credenciais.
8. Validar se a leitura continua clara para cliente leigo.

Regras:

- Markdown pode existir apenas como documentação interna;
- o TXT é a entrega principal de publicação;
- o corpo recomendado deve conter HTML puro e não pode conter H1;
- a versão completa deve conter exatamente um H1;
- não incluir notas operacionais, credenciais ou rascunho;
- o tutorial final deve falar com o leitor e não com a equipe;
- o material não pode ser considerado pronto se os prints não estiverem desenhados.

## 12. Etapa 7: validação SEO Rank Math

Validar obrigatoriamente:

- palavra-chave principal;
- título SEO;
- slug;
- meta description;
- objetivo de nota acima de 80.

Regras:

- a palavra-chave principal deve aparecer no título, na introdução, no slug e na meta description;
- quando natural, deve aparecer em pelo menos um subtítulo;
- a meta description deve resumir o benefício do tutorial;
- sem meta description, o tutorial ainda não está pronto.
- a validação local deve preparar score mínimo 80/100, mas a publicação futura só pode ocorrer depois de confirmar chip ativo e score real no Rank Math pelo workflow de publicação.

## 13. Etapa 8: preparo dos prints para publicação futura

1. Separar as imagens finais em `prints-finais/`.
2. Confirmar que cada imagem final está sanitizada.
3. Conferir que nenhuma imagem final expõe dado sensível.
4. Preparar título e ALT text de cada imagem.
5. Registrar pendências para upload futuro, quando houver.

Antes de considerar um print final, inspecionar a imagem ampliada. Se houver e-mail, IP, nome, documento, telefone, endereço, domínio identificável, credencial, ID de cliente, pedido, fatura, chamado ou dado financeiro, preservar o original isolado e criar cópia sanitizada em `prints-finais/`. Somente a cópia sanitizada pode ser referenciada no pacote final.

Regra:

- não subir imagens no WordPress antes da frase exata `APROVADO PARA PUBLICAR`;
- não publicar automaticamente;
- não usar credenciais reais em notas do vault.

## 14. Etapa 9: preparo para substituição de URLs públicas

1. Localizar todas as referências de imagem local.
2. Confirmar que elas apontam somente para `prints-finais/` no preview local.
3. Preparar o mapeamento esperado para `apoio/midias-publicas.json`.
4. Deixar claro que a substituição por URLs públicas acontece somente no workflow `Publicar Tutorial StayCloud`, após `APROVADO PARA PUBLICAR`.

## 15. Etapa 10: validação UI/UX Experience

1. Conferir clareza do objetivo em pouco tempo.
2. Conferir ordem logica dos passos.
3. Conferir se o print ajuda a executar a acao.
4. Conferir se o texto facilita a jornada do cliente.
5. Conferir se o tutorial reduz friccao e ticket repetido.

## 16. Etapa 11: auditoria final

1. Ler o HTML final como um leitor leria.
2. Conferir texto, prints e SEO.
3. Conferir se o material segue o padrão StayCloud.
4. Conferir se o tutorial está pronto para revisão humana.

## 17. Etapa 12: preparo para WordPress

1. Garantir que o HTML está limpo.
2. Garantir que o primeiro H1 existe no TXT local para backup.
3. Registrar que o corpo para WordPress deve remover apenas o primeiro H1.
4. Encaminhar qualquer ação em WordPress para `Publicar Tutorial StayCloud`.
5. Publicar apenas depois da frase exata `APROVADO PARA PUBLICAR`.

O gatilho `APROVADO PARA PUBLICAR` autoriza somente a publicação do tutorial informado. Antes dele, não fazer upload, não criar BetterDocs e não alterar artigo público.

Categoria padrão para Painel Novo:

```txt
Painel novo
```

## 18. Regras de segurança

- Não acessar WordPress sem necessidade do fluxo.
- Não publicar nada automaticamente.
- Não criar automação.
- Não instalar nada.
- Não usar credenciais reais em notas ou histórico.
- Não reutilizar prints de referência como imagem final.
- Não misturar tutorial, diagnóstico e auditoria no mesmo arquivo final.

## 19. Critérios de aprovação

O workflow está aprovado quando:

- o fluxo real foi seguido;
- os prints são reais e limpos;
- a auditoria visual foi aprovada;
- a validação SEO está completa;
- a meta description existe;
- o objetivo de Rank Math acima de 80 foi considerado;
- o HTML está limpo;
- o Markdown está pronto para colagem;
- nenhuma credencial foi exposta;
- o texto foi validado em tom de cliente final;
- as marcações visuais obrigatórias foram aplicadas quando necessárias.
- o registro local em `apoio/registro-publicacao.md` foi criado;
- o status deixa claro que o material aguarda aprovação antes do WordPress.

## 20. Critérios de reprovação

Reprovar se:

- houver placeholder no material final;
- faltar validação SEO;
- os prints estiverem cortados ou ampliados demais;
- o blur esconder contexto;
- o HTML estiver sujo;
- existir risco de credencial;
- o fluxo não refletir o comportamento real da interface;
- houver tentativa de publicação automática;
- o material parecer interno;
- os prints não estiverem desenhados para o leitor.

## 21. Checklist final

- [ ] Tema definido
- [ ] Objetivo confirmado
- [ ] Referências lidas
- [ ] Guia de Padrão StayCloud Painel Novo lido
- [ ] Prompt local consultado sem expor credenciais
- [ ] Prints reais capturados
- [ ] Auditoria visual concluída
- [ ] UI/UX Experience validado
- [ ] Prints ruins recapturados, se necessário
- [ ] HTML gerado
- [ ] Markdown pronto para colagem
- [ ] SEO Rank Math validado
- [ ] Prints finais sanitizados em `prints-finais/`
- [ ] Upload e URLs públicas pendentes de `APROVADO PARA PUBLICAR`
- [ ] Auditoria final concluída
- [ ] Publicação ainda não realizada sem confirmação
- [ ] Linguagem final em tom de cliente
- [ ] Marcações visuais obrigatórias aplicadas quando necessário

## 22. Prompt reutilizável para iniciar este workflow

`Siga o workflow Criar Tutorial StayCloud. Leia os arquivos de referência, planeje o tutorial, capture prints reais, valide SEO Rank Math, valide UI/UX Experience, gere HTML limpo e prepare o material para WordPress sem publicar, sem automação e sem expor credenciais.`

## 23. Regras obrigatórias para publicação futura no WordPress

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
13. Tutorial só conta na meta quando estiver publicado e acessível publicamente.
14. Nenhum dado sensível pode aparecer nos prints.
15. Não criar nova mídia quando uma versão sanitizada válida já existir.

## 24. Pacote V2 final obrigatório

Todo tutorial aprovado deve entregar dentro da área `Tutoriais Corretos V2`:

- `01 - VISUALIZAR TUTORIAL.html`;
- `02 - COLAR NO WORDPRESS.txt`;
- `03 - SEO RANK MATH.txt`;
- `04 - VALIDAÇÃO FINAL.md`;
- `prints-finais/`;
- `apoio/`.

O arquivo `02 - COLAR NO WORDPRESS.txt` é o único corpo recomendado para colagem. Ele deve começar com exatamente um H1 e conter o HTML completo do artigo. Antes da aprovação, pode referenciar os prints finais locais para preview e validação. Depois de `APROVADO PARA PUBLICAR`, o workflow `Publicar Tutorial StayCloud` deve substituir as imagens por URLs públicas diretas. Nunca exigir inserção manual dos prints, entregar apenas Markdown, usar caminhos locais no conteúdo público ou misturar SEO com o corpo público.

## 25. Quality Gate SEO

Nenhum tutorial pode ser aprovado somente porque o HTML abriu, as imagens carregaram ou o texto está formatado.

Validar obrigatoriamente:

- score Rank Math estimado ou real igual ou superior a 80/100;
- palavra-chave principal no título SEO, meta description, slug, primeiras 100 palavras, primeiro parágrafo, corpo, H2, H3 quando natural, ALT de pelo menos uma imagem, excerpt e texto social;
- conteúdo com profundidade suficiente, mínimo de 600 palavras e faixa recomendada de 650 a 900;
- título SEO com leitura natural e tamanho recomendado;
- meta description com palavra-chave e tamanho recomendado;
- pelo menos dois links internos úteis e existentes;
- densidade natural, sem keyword stuffing;
- status de validação local quando não houver conferência direta no Rank Math.

Quando o Rank Math real não for aberto, registrar: `SEO preparado localmente — aguardando conferência no Rank Math`.

Nunca inventar score real.

## 26. Quality Gate dos prints

Nenhum tutorial pode ser aprovado se o print destacar o alvo errado.

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

Antes de finalizar:

- conferir texto do passo, alvo marcado e tela seguinte;
- manter um alvo principal por etapa simples;
- não destacar caminhos alternativos sem necessidade;
- confirmar que a marcação não cobre o botão ou campo;
- confirmar que dados sensíveis estão censurados;
- confirmar que os prints finais locais são os mesmos que deverão ser enviados depois da aprovação;
- bloquear publicação quando o print foi corrigido localmente, mas a versão pública ainda não foi atualizada pelo workflow `Publicar Tutorial StayCloud`.
