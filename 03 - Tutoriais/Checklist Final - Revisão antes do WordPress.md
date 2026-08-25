# Checklist Final - Revisão antes do WordPress

## Objetivo

Usar este checklist antes de publicar ou preparar qualquer tutorial StayCloud no WordPress.

## Quando usar

- antes de subir tutorial no WordPress;
- antes de enviar para revisão;
- antes de publicar;
- depois de gerar HTML/Markdown;
- depois de capturar ou otimizar prints.

## Quando não usar

- para criar tutorial do zero;
- para publicar automaticamente;
- para substituir revisão humana;
- para validar conteúdo sem prints reais.

## Checklist de conteúdo

Validar:

- título claro;
- introdução objetiva;
- passo a passo compreensível;
- linguagem simples;
- sem texto robótico;
- sem tom interno;
- sem informação inventada;
- conclusão curta;
- orientação adequada para cliente.

## Checklist de UI/UX Experience

Validar:

- clareza em poucos segundos;
- fluxo em ordem lógica;
- prints legíveis e contextualizados;
- marcações visuais úteis e obrigatórias em clique, campo ou área importante;
- avisos de risco quando necessário;
- alternativa quando o caminho nao aparece;
- indicacao de quando abrir ticket;
- linguagem simples e acessivel;
- cliente leigo consegue seguir.

## Checklist de prints

Validar:

- prints reais;
- pop-ups fechados;
- tela sem corte excessivo;
- zoom adequado;
- destaque visual claro;
- print desenhado para indicar onde clicar ou o que conferir;
- dados sensíveis borrados;
- nenhum login, senha, token, domínio sensível ou dado de cliente exposto;
- imagens otimizadas;
- alt text definido.

## Checklist de SEO Rank Math

Validar:

- palavra-chave principal definida;
- palavra-chave no título;
- palavra-chave na introdução;
- slug sugerido;
- meta description criada;
- subtítulos coerentes;
- links internos quando fizer sentido;
- objetivo de pontuação acima de 80.

## Checklist de links

Validar:

- links funcionando;
- URLs públicas corretas, se houver;
- nenhum link local indevido;
- nenhum link quebrado;
- nenhum link interno sensível;
- imagens apontando para o lugar certo.

## Checklist de HTML e pacote V2

Validar:

- `01 - VISUALIZAR TUTORIAL.html` existe;
- `02 - COLAR NO WORDPRESS.txt` existe;
- `03 - SEO RANK MATH.txt` existe;
- `04 - VALIDAÇÃO FINAL.md` existe;
- `prints-finais/` existe;
- `apoio/` existe;
- estrutura está limpa;
- sem placeholders;
- sem texto interno de bastidor;
- sem comentários internos desnecessários;
- pronto para copiar para o WordPress.

## Checklist de segurança

Validar:

- sem credenciais;
- sem tokens;
- sem senhas;
- sem dados reais de cliente;
- sem prints sensíveis;
- sem URL interna desnecessária;
- sem registro de acesso local;
- sem informação que não deveria ir para base pública.
- todo print passou por inspeção ampliada de dados sensíveis;
- quando houver dado identificável, apenas a cópia sanitizada em `prints-finais/` é referenciada;
- nenhum original sensível entra no HTML preview, HTML WordPress, modelos aprovados ou Biblioteca de Mídia.

## Checklist WordPress

Validar:

- publicação não automática;
- imagens só serão enviadas com confirmação;
- conteúdo revisado antes de colar;
- categoria correta definida;
- slug revisado;
- meta description revisada;
- Rank Math revisado;
- publicação depende de confirmação humana.
- HTML preview validado com imagens reais visíveis.

## Critério de aprovação

O tutorial só pode seguir para WordPress se todos os pontos críticos estiverem aprovados.

## Critério de reprovação

Reprovar se houver:

- print ruim;
- print sem marcação suficiente;
- dado sensível;
- SEO incompleto;
- texto confuso;
- procedimento não validado;
- placeholder;
- link quebrado;
- arquivo faltando.
- tutorial ainda com tom interno.

## Prompt rápido de uso

`Siga o workflow Revisar Tutorial StayCloud. Leia o tutorial, valide conteúdo, prints, SEO Rank Math, links, HTML, Markdown e segurança, e diga se está pronto para revisão humana ou para WordPress, sem publicar automaticamente.`

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

O arquivo `02 - COLAR NO WORDPRESS.txt` deve conter HTML puro, nunca sintaxe Markdown. As imagens precisam estar incorporadas por URLs públicas antes da publicação. A versão local pode manter H1 para preview, mas a publicação deve evitar H1 duplicado no BetterDocs. Nunca entregar somente o Markdown editorial nem exigir inserção manual dos prints.

## Quality Gate de prints

Antes do WordPress, confirmar:

- [ ] Texto aprovado.
- [ ] SEO aprovado.
- [ ] Todos os prints aprovados.
- [ ] Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.
- [ ] Botões próximos, banners, alertas, faturas ou ações alternativas não estão destacados apenas por estarem visíveis na tela.
- [ ] Dados sensíveis estão censurados.
- [ ] Imagens públicas correspondem aos arquivos locais finais.
- [ ] HTML usa as URLs das versões aprovadas.
- [ ] Preview foi aberto e revisado.
- [ ] Nenhum caminho local existe.
- [ ] Publicação real ainda depende da autorização de Vinicius.
