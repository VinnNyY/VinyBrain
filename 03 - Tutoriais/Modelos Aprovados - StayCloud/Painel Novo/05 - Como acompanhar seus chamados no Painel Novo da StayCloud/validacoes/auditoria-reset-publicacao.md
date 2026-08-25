# Auditoria de reset da publicação

Data: 2026-07-23

## Arquivos encontrados

- Fonte editorial: `markdown/como-acompanhar-chamados-painel-novo-staycloud.md`
- Preview antigo: `html-preview/como-acompanhar-chamados-painel-novo-staycloud-preview.html`
- HTML WordPress antigo: `html-wordpress/como-acompanhar-chamados-painel-novo-staycloud-wordpress.html`
- Três capturas antigas em `prints/`
- Três PNGs sanitizados em `prints/finais/`
- Validações antigas: `validacoes/relatorio-imagens-wordpress.md`, `validacoes/validacao-de-dados-sensiveis.md` e `validacoes/validacao-local.md`
- Cópia antiga em `Modelos Aprovados - StayCloud/Painel Novo/05 - Como acompanhar seus chamados no Painel Novo da StayCloud/`
- Não existiam `publicacao/` nem `validacoes/midias-publicas.json`.
- Não existe `prints/_originais-sensiveis/` na pasta deste tutorial.

## Classificação

- Arquivo Markdown mestre: `markdown/como-acompanhar-chamados-painel-novo-staycloud.md`
- Fonte editorial escolhida: o Markdown mestre, usado apenas como referência de texto e estrutura.
- Arquivos com sintaxe Markdown: Markdown mestre e relatórios/validações em Markdown.
- Arquivos com caminhos locais: preview antigo, Markdown mestre e validações antigas.
- Arquivos com URLs públicas: HTML WordPress antigo e relatório antigo de imagens.
- Arquivos obsoletos para publicação: os dois HTMLs antigos e a cópia antiga em Modelos Aprovados.
- O HTML WordPress antigo contém um `<h1>` no corpo, o que duplicaria o título preenchido separadamente.
- O preview antigo usa caminhos locais para as três imagens.

## Causa raiz

O Markdown editorial foi tratado como conteúdo público e inserido no editor visual. Isso fez a sintaxe Markdown, os caminhos locais e o título principal aparecerem como texto, deixou o campo de título sem o valor correto e impediu a renderização das imagens.

## Correções necessárias

- Separar título e corpo.
- Usar somente HTML limpo em `publicacao/01 - Conteudo WordPress.html`.
- Substituir caminhos locais pelas URLs diretas das mídias 2812, 2813 e 2814.
- Manter exatamente três imagens, com ALT text e legendas.
- Validar automaticamente a ausência de Markdown cru e caminhos locais.
- Criar e revisar um único rascunho real antes de qualquer publicação.
- Preencher Rank Math separadamente.
- Não alterar o artigo público antigo e não publicar nesta execução.

