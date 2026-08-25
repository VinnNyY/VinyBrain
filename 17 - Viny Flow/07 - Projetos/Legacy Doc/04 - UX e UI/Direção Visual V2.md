# Direção Visual V2

Data: 2026-07-29

## Conceito

`Repositório pouco documentado -> análise orientada por IA -> funções identificadas -> documentação técnica revisável`

A V2 deve ser dark-first, técnica e premium, mas com uma quebra clara em light theme na seção de relatório para valorizar o documento gerado.

## Decisões visuais

- Container principal mais largo: entre `1280px` e `1440px`.
- Hero próximo da altura da viewport em desktop, sem virar splash vazio.
- H1 desktop entre `64px` e `80px`, com limites responsivos.
- H2s maiores e menos frequentes.
- Menos cards, mais painéis de produto.
- Screenshots reais do PDF em tamanho grande.
- Relatório com superfície clara, simulando documento técnico real.
- Planos com trilha horizontal no desktop e scroll-snap no mobile.

## Momentos visuais da página

1. Hero com demo de produto em browser técnico.
2. Transformação antes/depois com código e documentação lado a lado.
3. Pipeline horizontal `Repositório -> Varredura -> Análise -> Documentação`.
4. Demonstração navegável com screenshots oficiais do PDF.
5. Relatório em fundo claro com índice e documento.
6. Planos em trilha comercial.
7. Origem/pesquisa em bloco secundário.

## Motion

- Scanner percorrendo arquivos no hero.
- Progresso de análise por barras e estados.
- Funções surgindo como chips técnicos.
- Tabs com transição de opacity/transform.
- Cards de plano com hover de borda e elevação discreta.
- Scroll-snap manual no mobile.
- `prefers-reduced-motion` deve pausar loops e reduzir transições.

## Restrições

- Sem partículas.
- Sem visual cyberpunk.
- Sem imagens genéricas de IA.
- Sem cards aninhados.
- Sem métricas inventadas.
- Sem screenshots minúsculos.
- Sem prometer suporte, segurança ou compatibilidade não confirmada.
