# Componentes da Landing Page

Data: 2026-07-29

## Componentes estruturais

### `Header`

Uso: navegacao principal.

Conteudo:

- Logo Legacy Doc.
- Links ancora: Como funciona, Produto, Aplicacoes, Roadmap, FAQ.
- CTA: `Entrar na lista`.
- Menu mobile.

Estados:

- Default.
- Sticky.
- Mobile open.
- Focus.

Requisitos:

- `nav` com `aria-label="Principal"`.
- Botao mobile com `aria-expanded` e `aria-controls`.
- Area de toque minima `44px`.

### `HeroSection`

Uso: primeira dobra.

Conteudo:

- H1 unico da pagina.
- Subheadline.
- CTA primario.
- CTA secundario.
- Microcopy de produto em desenvolvimento.
- Mockup do produto.

Visual:

- Desktop em duas colunas.
- Mockup com codigo, analise e relatorio.
- Azul apenas em CTA e estados de analise.

### `ProductMockup`

Uso: prova visual principal.

Partes:

- `MockBrowserFrame`
- `RepositoryTree`
- `AnalysisPanel`
- `ReportPanel`
- `TraceLine`
- `StatusBadge`

Regras:

- Deve parecer interface operacional.
- Texto tecnico legivel.
- Dados estaticos podem ser sinteticos, mas precisam parecer plausiveis.
- Nao afirmar suporte real a integracoes ou linguagens nao confirmadas.

### `TransformationPanel`

Uso: antes/depois.

Conteudo:

- Antes: codigo disperso, README vazio, dependencias opacas.
- Depois: arquitetura, modulos, fluxos, documentacao revisavel.

Desktop:

- Duas colunas.

Mobile:

- Tabs ou cards empilhados.

### `ProblemCard`

Uso: dores.

Itens:

- Onboarding lento.
- Documentacao desatualizada.
- Conhecimento centralizado.
- Modernizacao com incerteza.

Regras:

- Card com titulo curto, descricao direta e icone decorativo.
- Sem card aninhado.

### `WorkflowSteps`

Uso: como funciona.

Etapas:

1. Envie ou conecte uma base de codigo.
2. Analise estrutura e contexto.
3. Organize os achados.
4. Revise e evolua.

Regras:

- Indicadores em texto, nao apenas cor.
- Motion opcional de progresso.

### `InterfacePreview`

Uso: mostrar tela do produto.

Estados:

- Analise.
- Modulos.
- Documentacao.

Interacao:

- Tabs acessiveis se houver alternancia.

### `ReportShowcase`

Uso: secao visual de alto destaque.

Partes:

- Indice lateral.
- Resumo do sistema.
- Modulos principais.
- Fluxos criticos.
- Riscos.
- Evidencias no codigo.
- Perguntas para validacao.

Regras:

- Deve ocupar area ampla.
- Parecer documento tecnico real.
- Findings em lista densa.
- Status com texto + cor.

### `CodeEvidence`

Uso: conectar conclusao ao codigo.

Conteudo:

- Filename.
- Trecho de codigo.
- Linha destacada.
- Nota: `Evidencia para revisao`.

Requisitos:

- Usar `<pre><code>`.
- Nao depender apenas de cor.
- Overflow horizontal no mobile.

### `BenefitItem`

Uso: beneficios qualitativos.

Formato:

- Titulo.
- Texto.
- Icone linear.

### `UseCaseCard`

Uso: cenarios de aplicacao.

Cenarios:

- Entrada em projeto legado.
- Transicao de equipe.
- Auditoria tecnica.
- Refatoracao.
- Modernizacao.

### `TechnicalDifferentiator`

Uso: diferenciais tecnicos.

Itens:

- Foco em legado.
- Saida estruturada.
- Fluxo revisavel.
- Pesquisa aplicada.

Regra: nao chamar de comprovado ate haver evidencia.

### `RoadmapColumns`

Uso: evolucao.

Colunas:

- Proposta confirmada.
- Em validacao.
- Planejado.

Requisitos:

- Status textual.
- Sem datas se nao houver aprovacao.

### `TeamMember`

Uso: equipe.

Conteudo:

- Nome.
- Papel publico, se confirmado.
- Foto/avatar, se autorizado.

Pendencia: autorizacao publica.

### `FAQAccordion`

Uso: objecoes.

Requisitos:

- Perguntas em `<button>`.
- `aria-expanded`.
- `aria-controls`.
- Foco previsivel.

### `FinalCTA`

Uso: conversao final.

Conteudo:

- Headline: `Quer criar uma primeira documentacao para um sistema existente?`
- Texto.
- CTA: `Entrar na lista de interesse`.

### `Footer`

Uso: fechamento.

Conteudo:

- Logo.
- Descricao curta.
- Links.
- Contato.
- Politica de privacidade, se houver coleta de dados.

## Componentes de estado

### `StatusBadge`

Estados:

- `Scanning`
- `Mapped`
- `Generated`
- `Needs review`
- `Risk`
- `Pending context`

### `ProgressSteps`

Estados:

- `Queued`
- `Scanning repository`
- `Mapping dependencies`
- `Generating report`
- `Ready for review`

### `LoadingSkeleton`

Uso:

- Relatorio carregando.
- Lista de arquivos.
- Cards de finding.

### `ErrorMessage`

Uso:

- URL invalida.
- Analise incompleta.
- Falha de processamento.

Regra: mensagem curta + acao de recuperacao.

### `EmptyState`

Uso:

- Nenhum repositorio analisado.
- Nenhum relatorio selecionado.

## Componentes visuais proibidos nesta fase

- Tabela publica de concorrentes.
- Cards de preco.
- Depoimentos.
- Logos de clientes.
- Selos de seguranca/compliance nao confirmados.
- Claims numericos de performance.
