# Auditoria Visual - Reprovação

Data: 2026-07-28

Tutorial: Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo da StayCloud

Status: Reprovado - não publicar

## Decisão

O pacote não deve seguir para publicação.

O tutorial foi reprovado por dois motivos:

1. O objetivo editorial ficou fraco para cliente final.
2. As marcações dos prints não explicam o fluxo com clareza suficiente.

## Problema de escopo

O botão textual `Ver detalhes` não apareceu no painel validado. O elemento encontrado foi uma seta com rótulo acessível `Expandir detalhes`.

Isso muda o tema. O usuário não vê claramente um botão chamado `Ver detalhes`, então um tutorial com esse título tende a confundir em vez de orientar.

## Problemas por print

| Print | Problema | Decisão |
|---|---|---|
| 01 | Compara `Gerenciar` com uma seta pequena de expansão. O alvo `Expandir detalhes` não aparece como texto visível na interface, então a marcação parece forçada. | Reprovado |
| 02 | Marca o rótulo `DISCO`, mas o texto fala em destino de `Ver detalhes`. O alvo real deveria ser a área expandida inteira ou uma explicação mais clara do card expandido. | Reprovado |
| 03 | Repete o botão `Gerenciar` muito próximo do Print 01 e não acrescenta contexto suficiente. | Reprovado |
| 04 | Mostra a tela de gerenciamento, mas sozinho não salva o fluxo porque os prints anteriores não estabelecem bem a comparação. | Pendente, mas não aproveitado |

## Conclusão

Este tutorial não deve ser publicado nem ajustado superficialmente.

Opções melhores:

- descartar o tema atual;
- transformar em uma seção curta dentro de outro tutorial de serviços;
- criar outro tutorial mais claro, por exemplo: `Como expandir os detalhes de um serviço no Painel Novo da StayCloud`, somente se houver utilidade real;
- priorizar o próximo tema da fila com ação mais objetiva.

## Regra registrada

Não criar tutorial novo quando o elemento principal não aparece com o nome do título na interface real.

Se o painel mostra `Expandir detalhes`, o tutorial não deve se chamar `Ver detalhes` sem uma justificativa forte e sem validação visual clara.
