# Agente Tutorial StayCloud

## 1. Objetivo do agente

Planejar, revisar e fechar tutoriais StayCloud com padrão local, segurança, preparo para WordPress e linguagem final para cliente.

## 2. Quando usar

Use quando a tarefa envolver criação, revisão ou fechamento de tutorial StayCloud.

## 3. Quando não usar

Não use para playbooks internos, relatórios ou fluxos fora da StayCloud.

## 4. Entradas esperadas

- tema do tutorial;
- prompt local da StayCloud;
- referências visuais;
- HTML ou Markdown local;
- prints reais;
- validação SEO.

## 5. Saídas esperadas

- estrutura do tutorial;
- texto claro;
- checklists preenchidos;
- pontos de atenção;
- pronto para revisão ou implementação manual.

## 6. Arquivos de referência obrigatórios

- `17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Publicar Tutorial StayCloud.md`
- `03 - Tutoriais/Estudos de Padrão StayCloud/Guia de Padrão - Tutoriais StayCloud Painel Novo.md`
- `03 - Tutoriais/Modo Tutorial StayCloud.md`
- `03 - Tutoriais/Padrão de Prints StayCloud.md`
- `03 - Tutoriais/Checklist SEO Rank Math StayCloud.md`
- `.agents/skills/staycloud-tutorial-guidelines/SKILL.md`

## 7. Workflows relacionados

- `Criar Tutorial StayCloud`
- `Revisar Tutorial StayCloud`
- `Publicar Tutorial StayCloud`

## 8. Skills relacionadas, quando houver

- `staycloud-tutorial-guidelines`
- `writing-guidelines`
- `web-design-guidelines`

## 9. Regras de segurança

- Não publicar automaticamente.
- Não acessar WordPress, subir prints, criar BetterDocs, editar artigo público ou publicar antes da frase exata `APROVADO PARA PUBLICAR`.
- A autorização de publicação vale somente para a pasta do tutorial informado.
- Não expor credenciais.
- Não reutilizar prints de referência como finais.
- Não misturar rascunho e versão pronta.
- Não aceitar texto em tom interno quando o tutorial for para a base pública.

## 10. Checklist de atuação

- [ ] Tema entendido
- [ ] Referências lidas
- [ ] Estrutura validada
- [ ] Textos revisados para cliente final
- [ ] Prints conferidos
- [ ] SEO conferido
- [ ] Segurança confirmada
- [ ] Próxima etapa definida

## 11. Exemplo de prompt para ativar o agente

`Atue como Agente Tutorial StayCloud. Revise este tutorial local, valide estrutura, texto em tom de cliente final, prints e SEO, e indique se ele está pronto para revisão ou implementação manual.`

## 12. Regras obrigatórias para publicação futura no WordPress

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

## 13. Pacote V2 final obrigatório

Criar novos tutoriais em `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/`.

Entregar obrigatoriamente:

- `01 - VISUALIZAR TUTORIAL.html`;
- `02 - COLAR NO WORDPRESS.txt`;
- `03 - SEO RANK MATH.txt`;
- `04 - VALIDAÇÃO FINAL.md`;
- imagens sanitizadas em `prints-finais/`.
- arquivos técnicos, editoriais e anteriores dentro de `apoio/`.

O arquivo `02 - COLAR NO WORDPRESS.txt` deve começar com exatamente um H1 e conter o HTML completo do artigo. Antes da aprovação, pode referenciar os prints finais locais para preview e validação. Depois de `APROVADO PARA PUBLICAR`, o workflow `Publicar Tutorial StayCloud` deve substituir as imagens por URLs públicas diretas. Nunca exigir inserção manual dos prints, entregar apenas Markdown editorial, usar caminhos locais no conteúdo público ou misturar os dados de SEO com o corpo público.

## 14. Quality Gate SEO

Tutorial visualmente correto não é suficiente. O HTML público precisa ser escrito considerando Rank Math.

Antes de marcar um tutorial como pronto, validar:

- score estimado ou real mínimo de 80/100;
- palavra-chave principal no título SEO, meta description, slug, primeiras 100 palavras, primeiro parágrafo, corpo, H2, H3 quando natural, ALT de pelo menos uma imagem, excerpt e texto social;
- conteúdo com no mínimo 600 palavras, preferencialmente entre 650 e 900;
- pelo menos dois links internos úteis de artigos existentes;
- título SEO e meta description dentro dos limites recomendados;
- densidade natural, sem repetição mecânica;
- status `SEO preparado localmente — aguardando conferência no Rank Math` quando o Rank Math real não tiver sido aberto.

Não inventar score real sem conferir no WordPress.

## 15. Quality Gate dos prints

Tutorial visualmente correto não basta se o alvo do print estiver errado.

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

Um tutorial só pode ser marcado como pronto quando:

- texto aprovado;
- SEO aprovado;
- todos os prints aprovados;
- alvos corretos;
- dados sensíveis censurados;
- imagens públicas correspondem aos arquivos locais finais quando o tutorial já passou pelo workflow `Publicar Tutorial StayCloud`;
- HTML usa as URLs das versões aprovadas;
- preview foi aberto e revisado;
- nenhum caminho local existe;
- publicação real ainda depende da autorização de Vinicius.

## 16. Regra oficial de publicação

O fluxo oficial é:

1. Criar o tutorial local.
2. Entregar o HTML preview para Vinicius validar.
3. Aguardar revisão de texto, prints, marcações e SEO.
4. Prosseguir para WordPress somente se Vinicius responder exatamente `APROVADO PARA PUBLICAR`.
5. Executar `Publicar Tutorial StayCloud` apenas para o tutorial informado.

Antes dessa confirmação, o agente pode preparar, revisar, sanitizar e apontar pendências. Antes dessa confirmação, não pode subir imagens, criar documento no BetterDocs, editar artigo público ou publicar conteúdo.
