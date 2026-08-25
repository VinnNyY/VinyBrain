# Guia de Padrão - Tutoriais StayCloud Painel Novo

## 1. Objetivo do padrão

Este guia define o padrão oficial para novos tutoriais da StayCloud, com foco em texto claro, leitura para cliente leigo e prints desenhados para mostrar exatamente onde clicar ou o que conferir.

Nenhum novo tutorial deve começar sem ler este guia.

## 2. Estrutura obrigatória do tutorial

Modelo base:

1. Título claro
2. Introdução curta
3. Quando usar
4. Antes de começar
5. Passo a passo
6. Prints reais com marcações
7. Erros comuns
8. Quando abrir ticket
9. Conclusão
10. SEO
11. Checklist final

Regras:

- o tutorial deve parecer material final para cliente;
- o texto não pode parecer instrução interna;
- o fluxo precisa ficar natural para quem está lendo pela primeira vez.

## 3. Padrão de texto

Regras obrigatórias:

- falar diretamente com o leitor usando `você`;
- não usar `o cliente` para falar com o próprio leitor;
- não usar tom de bastidor ou processo interno;
- usar frases curtas;
- explicar termos técnicos quando aparecerem;
- sempre dizer onde clicar;
- sempre dizer o que esperar na tela;
- sempre avisar o que fazer se a opção não aparecer;
- não presumir conhecimento prévio.

Exemplos:

Errado:

> O cliente precisa acessar a hospedagem correta.

Certo:

> Acesse a hospedagem que deseja gerenciar. Se você tiver mais de um serviço ativo, confira o nome do domínio antes de continuar.

Errado:

> Botão Gerenciar destacado.

Certo:

> Clique em Gerenciar no serviço que deseja acessar.

Errado:

> Confira os campos que o cliente precisa copiar.

Certo:

> Copie as informações exibidas na tela e use esses dados na configuração do seu domínio.

## 4. Padrão de prints

Regra principal:

Todo print precisa ajudar o leitor a entender exatamente onde clicar, o que ler ou o que conferir.

Regras:

- print sem marcação só pode ser usado quando a tela estiver extremamente óbvia;
- botão importante precisa de seta, caixa ou círculo;
- campo importante precisa de destaque;
- área sensível precisa de blur;
- informação que será copiada precisa estar destacada;
- tela muito cheia precisa de recorte ou zoom;
- cada print precisa ter legenda útil;
- cada print precisa ter alt text;
- nunca usar print poluído;
- nunca usar print com dado sensível real;
- placeholder de print é proibido em tutorial final;
- se o print estiver autoexplicativo, a falta de marcação precisa ser justificada no plano de prints.

## 5. Tipos de marcação

- **Seta:** para indicar clique.
- **Retângulo:** para destacar botão, campo ou área.
- **Círculo:** para chamar atenção em item pequeno.
- **Numeração:** para fluxos com vários cliques na mesma tela.
- **Blur:** para ocultar dados sensíveis.
- **Zoom/recorte:** para área pequena ou tela muito ampla.
- **Legenda:** para explicar o que a imagem mostra.

## 6. Padrão de passo a passo

Cada passo precisa ter:

- ação clara;
- print logo abaixo ou logo acima;
- destaque visual no print;
- explicação do resultado esperado;
- aviso se algo puder aparecer diferente;
- texto curto o bastante para o leitor não se perder.

## 7. Padrão visual observado na StayCloud

Nos tutoriais públicos da base, o padrão mais consistente é:

- introdução curta;
- passo numerado;
- print logo após a ação;
- legenda explicando o que a imagem mostra;
- seção de problemas comuns ou dúvidas frequentes;
- conclusão com próximo passo ou suporte.

O novo padrão deve preservar isso, mas com marcação visual mais explícita nos pontos principais.

## 8. Checklist de aprovação visual

- [ ] O leitor sabe onde clicar?
- [ ] A marcação está clara?
- [ ] O botão ou campo principal está destacado?
- [ ] O print está legível?
- [ ] O print não tem dado sensível?
- [ ] O print não está largo demais sem foco?
- [ ] Existe legenda?
- [ ] O texto antes do print prepara o leitor?
- [ ] O texto depois do print confirma o próximo passo?
- [ ] Um leitor leigo conseguiria seguir sem suporte?

## 9. Padrão de SEO

Regras:

- o título precisa ser natural e claro;
- a palavra-chave deve aparecer no título, na introdução, no slug e na meta description;
- a meta description deve resumir o benefício;
- o SEO não pode prejudicar a clareza;
- o tutorial precisa manter um tom útil para o leitor, não para o mecanismo.

Estrutura recomendada:

- **Título SEO:** `Como [ação] [objeto] no Painel Novo da StayCloud`
- **Slug:** curto, sem excesso, seguindo o tema principal
- **Meta description:** clara, útil e orientada ao resultado

## 10. Erros que reprovam o tutorial

Reprovar se:

- não tem marcação nos prints importantes;
- parece documentação interna;
- usa `cliente` para falar com o leitor;
- pula etapa;
- o print não mostra onde clicar;
- tem dado sensível;
- não tem HTML preview;
- não tem HTML WordPress;
- não passou pelo UI/UX;
- não passou pelo Visual e Prints;
- o texto não está em tom de cliente final;
- a imagem depende de contexto interno para ser entendida.
- dado sensível está visível, parcialmente oculto ou foi enviado sem cópia sanitizada.

## 10.1 Segurança dos prints

Todo print deve passar por inspeção de dados sensíveis antes de ser aprovado. E-mail, IP, nome, documento, telefone, endereço, domínio identificável, usuário, credencial, ID de conta, pedido, fatura, chamado ou dado financeiro exigem uma cópia sanitizada. Só a cópia sanitizada pode entrar no Markdown, HTML preview, HTML WordPress, modelos aprovados e WordPress; o original fica isolado localmente e sem referências.

## 11. Próximo uso do padrão

Antes de começar um novo tutorial do Painel Novo:

1. Leia este guia.
2. Leia o inventário de tutoriais estudados.
3. Escolha o tutorial de referência mais próximo.
4. Valide o fluxo real.
5. Só então escreva o tutorial novo.

## 12. Conclusão

O novo padrão da StayCloud para o Painel Novo precisa unir três coisas:

- texto direto para cliente leigo;
- prints realmente orientadores;
- marcação visual clara nos pontos importantes.

Se um desses três pontos faltar, o tutorial não deve seguir para publicação.

## Regras obrigatórias para WordPress

1. Markdown é apenas fonte editorial.
2. WordPress deve receber HTML limpo.
3. Todo tutorial V2 precisa de `01 - VISUALIZAR TUTORIAL.html`, `02 - COLAR NO WORDPRESS.txt`, `03 - SEO RANK MATH.txt`, `04 - VALIDAÇÃO FINAL.md`, `prints-finais/` e `apoio/`.
4. Somente `02 - COLAR NO WORDPRESS.txt` pode ser usado como fonte do corpo no BetterDocs.
5. O título deve ser preenchido separadamente no campo nativo do WordPress.
6. Ao colar no corpo, remover H1 duplicado quando o editor já usar o título nativo.
7. Imagens devem usar URLs públicas diretas.
8. Nunca usar caminhos locais no conteúdo público.
9. Nunca usar o link permanente da mídia como imagem.
10. Usar o campo URL do arquivo.
11. Validar automaticamente a ausência de Markdown cru.
12. Criar e validar um rascunho real antes de publicar.
13. Preview local não substitui a prévia real do WordPress.
14. Tutorial só conta na meta quando estiver publicado, acessível publicamente e com Rank Math mínimo 80.
15. Nenhum dado sensível pode aparecer nos prints.
16. Não criar nova mídia quando uma versão sanitizada válida já existir.

## Pacote final obrigatório V2

Todo tutorial aprovado deve entregar:

- `01 - VISUALIZAR TUTORIAL.html`
- `02 - COLAR NO WORDPRESS.txt`
- `03 - SEO RANK MATH.txt`
- `04 - VALIDAÇÃO FINAL.md`
- `prints-finais/`
- `apoio/`

O arquivo `02 - COLAR NO WORDPRESS.txt` contém HTML puro e é a fonte de publicação. As imagens ficam incorporadas por URLs públicas após o upload das versões sanitizadas. Nunca entregar somente o Markdown editorial nem exigir inserção manual dos prints.

## Regra de coerência entre texto, print e fluxo

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

O print deve ser validado no conjunto:

Texto do passo → botão ou campo destacado → tela apresentada no passo seguinte.

Se qualquer parte não estiver coerente, o print é reprovado e o tutorial não segue para publicação.
