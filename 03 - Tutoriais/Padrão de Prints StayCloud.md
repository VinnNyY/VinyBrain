# Padrão de Prints StayCloud

## Objetivo

Definir o padrão mínimo de captura, recorte, marcação e ocultação para prints usados em tutoriais StayCloud.

## Princípio central

Todo print precisa ajudar o leitor a entender exatamente onde clicar, o que conferir ou o que acontece na tela.

## Regras de captura

- Capturar em resolução ampla, preferencialmente tela cheia.
- Evitar zoom excessivo.
- Mostrar contexto suficiente da interface.
- Não cortar botões importantes.
- Não cortar menus laterais ou superiores quando eles ajudam na localização.
- Fechar pop-ups, banners, chats e modais antes da captura.
- Usar conta de exemplo ou conta autorizada.
- Nunca expor dados reais de cliente.
- Nunca deixar placeholder em tutorial final.

## Regras de recorte

- Recortar apenas quando o recorte ainda mantiver contexto.
- Não aproximar demais o botão.
- Evitar prints que mostram só um pedaço isolado da tela.
- Manter visível a área onde o leitor está e a área onde deve clicar.
- Se o recorte perder contexto, refazer a captura.

## Regras de marcação

- Destacar o elemento principal com marcação clara.
- Usar seta, contorno ou destaque visual quando necessário.
- A marcação deve chamar atenção sem poluir a imagem.
- Cada print deve ter apenas um foco principal.
- Não cobrir o elemento com a própria marcação.
- Clique importante, campo importante ou valor para copiar precisam de destaque visual.
- Se a tela estiver evidente por si só, o print sem marcação pode ser aceito com justificativa.

## Tipos de marcação recomendados

- Seta: para indicar clique.
- Retângulo: para destacar botão, campo ou área.
- Círculo: para chamar atenção em item pequeno.
- Numeração: para fluxos com vários cliques na mesma tela.
- Blur: para ocultar dados sensíveis.
- Zoom ou recorte: para área pequena ou tela muito ampla.
- Legenda: para explicar o que a imagem mostra.

## Regras de ocultação

- Borrar apenas dados sensíveis.
- Não borrar metade da tela.
- Não borrar elementos necessários para o entendimento.
- Manter botões, menus e títulos visíveis.
- Se o blur esconder contexto importante, refazer a captura.

## Regras de legenda

- Cada print deve ter legenda curta.
- A legenda deve explicar o que a imagem mostra.
- A legenda não deve repetir exatamente o título do passo.
- A legenda deve ajudar o leitor a se localizar.

## Critérios para print publicável

Um print só pode ser considerado pronto se:

- mostra contexto suficiente;
- tem foco claro;
- não expõe dados sensíveis;
- não está cortado demais;
- não está ampliado demais;
- tem marcação visual clara quando necessário;
- combina com o padrão dos tutoriais publicados.

## Sinal de reprovação

Reprovar automaticamente quando o print:

- estiver ampliado demais;
- estiver cortado demais;
- não tiver marcação clara quando o clique ou o campo forem importantes;
- esconder contexto importante com blur excessivo;
- mostrar só um pedaço da interface sem orientação suficiente;
- depender de um texto interno para ser compreendido.

## Regra de recaptura e cache

Quando uma imagem ou print ficar travado, cacheado, errado, com enquadramento ruim ou insistir em aparecer antigo:

- você pode apagar a imagem local antiga apenas dentro do diretório do tutorial em execução;
- não apague imagens fora do diretório do tutorial atual;
- não apague imagens já publicadas no WordPress sem confirmação explícita;
- depois de apagar, recapture a imagem;
- prefira um novo nome de arquivo com sufixo de versão, como `passo-04-dados-acesso-v2.webp` ou `passo-04-dados-acesso-recaptura.webp`;
- atualize todas as referências no HTML e no Markdown;
- confirme que a imagem antiga não está mais referenciada;
- rode a auditoria visual novamente;
- registre no relatório que a imagem foi removida e recapturada.

## Regra final

Antes de finalizar qualquer tutorial, rodar obrigatoriamente a auditoria visual dos prints. Se um print não passar nessa checagem, ele volta para recaptura antes de qualquer preparação para WordPress.

## Inspeção obrigatória de dados sensíveis

Todo print deve passar por inspeção de dados sensíveis antes de ser aprovado. Quando houver e-mail, IP, nome, documento, telefone, endereço, domínio identificável, credencial ou outro dado pessoal, deve ser criada uma cópia sanitizada. Somente a cópia sanitizada pode entrar no tutorial, nos modelos aprovados ou no WordPress. Preserve o original somente em pasta local isolada, sem referências de HTML ou Markdown. Reprovar automaticamente censura fraca, dado parcialmente legível, original sensível referenciado ou censura que cubra a ação principal.

## Regra oficial de alvo visual

Uma marcação visual só é aprovada quando aponta exatamente para o elemento citado no texto e o passo seguinte confirma o mesmo fluxo.

Botões próximos, banners, alertas, faturas ou ações alternativas não podem ser destacados apenas por estarem visíveis na tela.

Por padrão, cada print deve ter apenas um alvo principal. Uma segunda marcação só é permitida quando o passo exige duas ações na mesma tela e a ordem está explicada no texto.

Se a imagem local foi corrigida mas a URL pública ainda aponta para a versão anterior, o tutorial fica bloqueado para publicação até novo upload e atualização da URL.
