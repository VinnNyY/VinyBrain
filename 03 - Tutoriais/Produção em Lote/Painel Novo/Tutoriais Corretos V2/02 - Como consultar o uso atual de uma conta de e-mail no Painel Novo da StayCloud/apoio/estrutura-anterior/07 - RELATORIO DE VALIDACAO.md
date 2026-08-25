# Relatório de validação

Data: 23 de julho de 2026

Status: aprovado para aguardar publicação.

## Estrutura

- Arquivos obrigatórios: aprovados
- Título TXT contém somente o título: aprovado
- Corpo começa com `<p>`: aprovado
- H1 ausente no corpo recomendado: aprovado
- Exatamente um H1 na versão completa: aprovado
- H2, H3, listas e parágrafos: aprovados
- Versão completa igual ao título mais o corpo: aprovado
- Conteúdo do preview igual à versão completa: aprovado
- Escopo limitado à consulta: aprovado

## Imagens

- Quantidade: 3
- URLs públicas distintas: 3
- IDs: 2805, 2800 e 2801
- HTTPS e domínio permitido: aprovados
- Caminho `/wp-content/uploads/`: aprovado
- Resposta pública `image/png`: aprovada nas três URLs
- ALT texts: aprovados
- Figures e legendas: aprovados
- Dimensões explícitas: aprovadas
- Cópias locais sanitizadas: 3
- Imagens quebradas no preview: nenhuma

## Segurança e formato

- Sintaxe Markdown nos TXT de publicação: ausente
- Caminhos locais nos TXT e no preview: ausentes
- Placeholders de URL: ausentes
- Referências a originais sensíveis: ausentes
- Tags HTML fora da lista permitida: ausentes
- Alteração de cota ou exclusão de conta: não ensinadas

## Preview

O arquivo `06 - PREVIEW FINAL.html` foi aberto no Google Chrome em modo headless. Título, textos, hierarquia, listas, três imagens sanitizadas e legendas foram renderizados. A captura está em `_VALIDAÇÕES GERAIS/preview-02-uso-email.png`.

## Comando de validação

`python3 "_VALIDAÇÕES GERAIS/validar_pacotes_v2.py"`

Resultado automático: APROVADO.
