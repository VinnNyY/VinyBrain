# Relatório de validação

Data: 2026-07-23

Arquivo validado: `publicacao/01 - Conteudo WordPress.html`

| Teste | Resultado | Evidência |
| --- | --- | --- |
| Conteúdo maior que zero | Aprovado | Arquivo possui corpo HTML preenchido. |
| Ausência dos padrões proibidos | Aprovado | Nenhuma ocorrência de Markdown cru, caminhos locais, bloco SEO, script, iframe ou h1. |
| Exatamente três imagens | Aprovado | O parser encontrou 3 tags `img`. |
| URLs HTTPS e do domínio correto | Aprovado | As três URLs usam `https://ajuda.staycloud.com.br/wp-content/uploads/`. |
| URLs terminam em PNG | Aprovado | As três URLs terminam em `.png`. |
| URLs diferentes | Aprovado | Foram encontradas 3 URLs únicas. |
| ALT texts preenchidos | Aprovado | As três imagens possuem ALT text não vazio. |
| Estrutura obrigatória | Aprovado | Há `h2`, `h3`, `figure`, `figcaption` e `p`. |
| Somente tags permitidas | Aprovado | Nenhuma tag fora da lista autorizada. |
| Ausência de caminhos locais | Aprovado | Nenhum caminho local foi encontrado. |
| Ausência de Markdown cru | Aprovado | Nenhum marcador de Markdown foi encontrado. |
| Rank Math fora do HTML público | Aprovado | O bloco interno não aparece no arquivo público. |
| URLs públicas correspondem aos arquivos locais | Aprovado | SHA-256 remoto e local é idêntico para cada uma das três imagens. |
| Preview local | Aprovado | Título, texto, três imagens e três legendas renderizaram no Chrome. Todas as imagens carregaram com largura natural de 1440 px. |

Resultado final: **aprovado para criação do rascunho WordPress**.

