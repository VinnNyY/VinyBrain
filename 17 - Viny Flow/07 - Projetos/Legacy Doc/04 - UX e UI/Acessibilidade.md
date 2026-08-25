# Acessibilidade

Data: 2026-07-29

## Regras globais

- Contraste minimo: texto normal `4.5:1`.
- Contraste minimo: texto grande `3:1`.
- Icones funcionais, bordas de foco e estados de UI: `3:1`.
- Todo elemento interativo deve ter `:focus-visible`.
- Nao remover `outline` sem substituto.
- Ordem de tabulacao deve seguir a leitura visual.
- Usar `header`, `nav`, `main`, `section` e `footer`.
- Incluir skip link para o conteudo principal.
- Links de ancora com `scroll-margin-top`.
- Icones decorativos com `aria-hidden="true"`.
- Icones funcionais com nome acessivel.
- Texto tecnico deve ser texto real, nao imagem.
- Em mobile, evitar conteudo que exija zoom.

## Hierarquia de titulos

- Apenas um H1: `Documentacao tecnica gerada a partir do seu codigo`.
- Cada secao principal usa H2.
- Subitens usam H3.
- Nao pular niveis por razao visual.

## Header

- `nav` com `aria-label="Principal"`.
- Logo como link para o topo.
- Botao mobile com:
  - `aria-expanded`;
  - `aria-controls`;
  - label claro.
- Area de toque minima `44px`.
- CTA no menu mobile nao deve duplicar foco escondido.

## Hero

- H1 unico.
- CTAs:
  - usar `<a>` se navegar/rolar;
  - usar `<button>` se abrir modal/formulario.
- Mockup:
  - se informativo, alt resumindo a transformacao;
  - se decorativo, ocultar com `aria-hidden`.
- Microcopy de revisao humana deve ser texto real.

## Navegador simulado

Se for visual estatico:

- Marcar como imagem conceitual com descricao curta.
- Ocultar detalhes decorativos.

Se tiver tabs:

- `role="tablist"`;
- `role="tab"`;
- `aria-selected`;
- `aria-controls`;
- navegacao por teclado.

## Blocos de codigo

- Usar `<pre><code>`.
- Fonte minima legivel.
- `overflow-x: auto`.
- Linha destacada deve ter texto/icone/label, nao so cor.
- Nao quebrar layout mobile.

## Relatorio

- Headings reais para secoes.
- Indice lateral como `nav` se for navegavel.
- Status sempre com texto + cor.
- Accordions com `<button aria-expanded>`.
- Findings em listas semanticas quando possivel.

## Cards

- Nao usar `<div onClick>` como card interativo.
- Se todo card for link, usar `<a>`.
- Cada card deve ter heading curto.
- Icones decorativos com `aria-hidden`.

## FAQ

- Perguntas em `<button>`.
- `aria-expanded`.
- `aria-controls`.
- Foco permanece previsivel ao abrir/fechar.

## Formulario e CTA

Se houver formulario:

- Todo campo com `<label>` visivel.
- Email com `type="email"`, `name` e `autocomplete`.
- Mensagem de erro inline.
- Erro deve focar o primeiro campo invalido.
- Sucesso/erro assincrono com `aria-live="polite"`.

## Tema claro/escuro

- Definir `color-scheme`.
- Testar contraste em dark e light.
- `meta theme-color` alinhado ao fundo.
- Transicao de tema nao deve esconder conteudo.

## Reduced motion

Em `prefers-reduced-motion: reduce`:

- Remover loops e scan lines.
- Remover parallax.
- Remover stagger.
- Manter estados finais visiveis.
- Nao depender de animacao para explicar progresso.

## Validacao antes de publicar

- Teste so com teclado.
- Teste com zoom em `200%`.
- Teste mobile estreito.
- Teste dark/light.
- Teste com `prefers-reduced-motion`.
- Teste de contraste em textos pequenos de mockups, badges, tabs e relatorio.
- Teste basico com leitor de tela.
