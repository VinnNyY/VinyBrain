# Motion e Microinteracoes

Data: 2026-07-29

## Principio

Motion deve comunicar processo tecnico: entrada, varredura, identificacao, estruturacao e documentacao. A animacao confirma estado e guia leitura, mas nao bloqueia interacao nem substitui texto.

## Tokens

```css
--motion-duration-instant: 80ms;
--motion-duration-fast: 140ms;
--motion-duration-base: 220ms;
--motion-duration-slow: 420ms;
--motion-duration-process: 900ms;
--motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
--motion-ease-enter: cubic-bezier(0, 0, 0.2, 1);
--motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);
--motion-ease-technical: cubic-bezier(0.16, 1, 0.3, 1);
--motion-distance-xs: 4px;
--motion-distance-sm: 8px;
--motion-distance-md: 16px;
--motion-distance-lg: 24px;
--motion-scale-subtle: 1.015;
--motion-scale-active: 0.985;
--motion-stagger-tight: 35ms;
--motion-stagger-base: 70ms;
--motion-stagger-slow: 120ms;
```

## Regras de performance

Preferir:

- `transform`
- `opacity`
- `background-color`
- `border-color`

Evitar:

- animar `width`, `height`, `top`, `left`;
- `box-shadow` em loop;
- `filter` em loop;
- parallax pesado;
- canvas/video/Lottie sem necessidade;
- animacao que atrase leitura ou clique.

## Insercao de URL

Uso futuro em formulario/demo.

Focus:

- `opacity: .86 -> 1`
- `translateY(0 -> -1px)`
- `scale(1 -> 1.005)`
- duracao `140ms`

URL valida:

- icone de link `scale(.96 -> 1)`;
- borda passa para azul;
- check aparece com `opacity` e `translateY(4px -> 0)`.

URL invalida:

- micro shake horizontal interno;
- duracao maxima `180ms`;
- nao repetir automaticamente.

## Inicio da analise

Sequencia:

1. `0ms`: botao confirma clique com `scale(.985 -> 1)`.
2. `80ms`: painel de analise entra com `opacity` e `translateY`.
3. `160ms`: primeira linha de status aparece.
4. `240ms`: trilha de varredura inicia.

Nao travar a pagina inteira. Apenas impedir novo envio se necessario.

## Progressao da varredura

Scan line:

```css
transform: translateX(-12%) -> translateX(112%);
opacity: 0 -> .72 -> 0;
duration: 900ms;
```

Barra de progresso:

- usar `transform: scaleX()`;
- `transform-origin: left`;
- nao animar `width`.

Estados:

- `queued`
- `scanning`
- `identified`
- `structured`
- `documented`

## Arquivos identificados

Item:

- `opacity: 0 -> 1`
- `translateY(8px -> 0)`
- duracao `180ms`
- stagger `35ms`

Arquivo critico:

- acento lateral com `scaleY(0 -> 1)`;
- duracao `180ms`.

## Funcoes surgindo

As funcoes aparecem como derivadas dos arquivos.

- `opacity: 0 -> 1`
- `translateX(-8px -> 0)`
- duracao `160ms`
- stagger curto.

Hover em chip:

- `translateY(-1px)`
- opacidade aumenta levemente.

## Transformacao no relatorio

Momento principal da narrativa visual.

Sequencia:

1. Blocos de codigo reduzem opacidade.
2. Linhas estruturais aparecem.
3. Secoes do relatorio entram em grupos.
4. CTA aparece apenas depois de a primeira secao estar legivel.

Motion:

```css
.source-code {
  opacity: .38;
  transform: translateY(-8px);
  transition-duration: 220ms;
}

.report-section {
  opacity: 1;
  transform: translateY(0);
  transition-duration: 420ms;
}
```

Nao usar rotacao 3D, flips ou morphs teatrais.

## Scroll reveals

Usar uma vez por secao:

- `opacity: 0 -> 1`
- `translateY(18px -> 0)`
- duracao `420ms`
- threshold aproximado `0.18`

Listas internas:

- duracao `220ms`;
- stagger `50ms`;
- maximo total `240ms`.

## Hover tecnico

Botoes:

- hover: `translateY(-1px) scale(1.015)`;
- active: `scale(.985)`.

Cards:

- hover: `translateY(-2px)`;
- borda mais clara;
- surface elevada.

Linhas de codigo:

- mudar background/acento;
- sem movimento necessario.

Icones:

- rotacao maxima `4deg`, apenas se fizer sentido.

## Transicao de tema

Rapida e funcional:

- background-color `180ms`;
- color `140ms`;
- border-color `140ms`;
- overlays `180ms`.

Nao animar todos os elementos individualmente com stagger.

## Mobile

- Reduzir stagger em 50%.
- Sem parallax.
- Scan lines continuas opcionais; remover se distrair.
- Reveals com `translateY(10px)` no maximo.
- Hover vira active/tap.
- Duracao maxima comum: `280ms`, exceto progresso.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Versao reduzida:

- manter estados finais visiveis;
- remover scan-line, parallax, stagger e loops;
- progresso por etapas discretas.
