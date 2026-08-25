# Responsividade

Data: 2026-07-29

## Principio

A versao mobile nao deve ser apenas o desktop empilhado. O conteudo tecnico precisa ser reduzido, reorganizado e mantido legivel.

## Breakpoints

- Desktop grande: `>= 1280px`
- Notebook: `1024px - 1279px`
- Tablet: `768px - 1023px`
- Mobile: `<= 767px`
- Mobile estreito: `<= 420px`

## Desktop grande

Menu:

- Header sticky com logo, links centrais e CTA a direita.
- Altura `72px`.

Hero:

- Duas colunas.
- Copy ocupa `45-50%`.
- Mockup ocupa `50-55%`.
- Mockup completo com sidebar, analise e painel de relatorio.
- Primeira dobra deve mostrar pista da proxima secao.

Relatorio:

- Preview amplo, quase tela cheia.
- Indice lateral.
- Conteudo central.
- Painel de evidencias ou findings a direita.

Cards:

- Grids de 3 ou 4 colunas, conforme densidade.
- Cards com altura estavel e texto curto.

Equipe:

- Cards em linha ou grid 4 colunas, se houver fotos/papeis aprovados.

FAQ:

- Lista central ou duas colunas.

CTA:

- Texto e acao lado a lado.

Animacoes:

- Motion completo, mas discreto.

## Notebook

Menu:

- Header igual ao desktop.
- Links podem reduzir para 4 itens se houver falta de espaco.

Hero:

- Duas colunas mantidas.
- Reduzir densidade do mockup: menos arquivos e menos findings visiveis.
- H1 entre `44px` e `52px`.

Relatorio:

- Indice lateral compacto.
- Evitar tres colunas apertadas.

Cards:

- Grids 2 ou 3 colunas.

Animacoes:

- Manter scanning e highlights, reduzir stagger.

## Tablet

Menu:

- Header com logo, poucos links ou menu compacto.
- CTA visivel se couber; caso contrario dentro do menu.

Hero:

- Preferir empilhado se o mockup ficar comprimido.
- Copy primeiro.
- Mockup abaixo com largura total.
- Tabs do mockup podem virar scroll horizontal.

Relatorio:

- Indice vira tabs horizontais.
- Findings abaixo do conteudo principal.

Cards:

- 2 colunas.

Equipe:

- 2 colunas.

FAQ:

- Lista unica ou accordion central.

Animacoes:

- Sem parallax.
- Reveals mais curtos.

## Mobile

Menu:

- Logo a esquerda.
- Botao de menu a direita.
- CTA dentro do menu.
- Areas de toque `44px`.

Hero:

- Copy primeiro.
- CTA primario e secundario empilhados ou em largura total.
- Mockup abaixo.
- Mockup simplificado com 1 painel principal e 2-3 indicadores.
- Evitar miniatura ilegivel.

Demonstracao:

- Antes/depois em tabs ou cards empilhados.
- Nao usar duas colunas.

Como funciona:

- Timeline vertical.
- Etapas com texto curto.

Interface:

- Tabs horizontais.
- Mostrar um painel por vez.

Relatorio:

- Preview em cards/accordion.
- Indice lateral removido.
- Blocos de codigo com overflow horizontal.
- Texto minimo `14px` em mockups.

Beneficios e cenarios:

- Lista vertical.
- Cards com headings claros.

Equipe:

- Lista vertical com avatar/foto opcional.

FAQ:

- Accordion unico.

CTA:

- Botao largura total.
- Formulario com labels visiveis, se existir.

Animacoes:

- Sem hover.
- Sem parallax.
- Scan line opcional; remover se distrair.
- Maximo comum `280ms`.

## Mobile estreito

- Remover detalhes secundarios do mockup.
- Mostrar apenas:
  - status de analise;
  - 3 arquivos;
  - 1 trecho de codigo;
  - 1 bloco de relatorio.
- Evitar tabelas; usar listas.
- H1 com `clamp` limitado para nao quebrar layout.
- Botao principal em largura total.

## Regras gerais

- Textos nao podem ultrapassar cards/botoes.
- Blocos de codigo sempre com `overflow-x: auto`.
- Nao usar altura fixa em secoes com muito texto.
- Imagens/screenshot com dimensoes definidas para evitar CLS.
- Motion reduzido quando `prefers-reduced-motion`.
