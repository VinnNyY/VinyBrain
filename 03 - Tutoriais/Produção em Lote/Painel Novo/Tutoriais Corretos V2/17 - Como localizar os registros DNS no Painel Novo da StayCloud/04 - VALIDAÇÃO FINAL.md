# Validação final

## Arquivos principais

- Preview HTML: `01 - VISUALIZAR TUTORIAL.html`
- Código WordPress: `02 - COLAR NO WORDPRESS.txt`
- SEO Rank Math: `03 - SEO RANK MATH.txt`
- Pasta de prints: `prints-finais/`
- Registro de publicação: `apoio/registro-publicacao.md`

## Resultado geral

Status: bloqueado para publicação.

Motivos:

- O rascunho BetterDocs `2999` foi localizado na planilha, mas o conteúdo administrativo não abriu porque a sessão redirecionou para login.
- A interface atual da aba `DNS` não foi validada com conta própria autorizada nesta execução.
- O print real fornecido por Vinicius não foi localizado no filesystem/contexto atual.
- As imagens geradas são sanitizações de apoio, não o conjunto final aprovado para publicação.
- O código WordPress usa placeholder de URL pública para imagem e não deve ser colado/publicado sem upload e substituição.

## Validação do código

- [x] Possui exatamente um H1
- [x] Possui H2
- [x] Possui H3
- [x] Possui parágrafos
- [x] Possui listas/conteúdo escaneável
- [ ] Todas as imagens possuem URL pública
- [x] Todas as imagens possuem ALT text no preview local
- [x] Todas as imagens possuem legenda no preview local
- [ ] Nenhuma imagem usa caminho local no preview
- [x] Não existe sintaxe Markdown no código WordPress
- [x] Não existe script
- [x] Não existe iframe
- [x] Não existe CSS no código público
- [x] Não existe informação interna do Rank Math no código WordPress
- [x] Nenhum dado sensível está visível nas imagens de apoio sanitizadas
- [x] Ainda não publicado

## Mídias utilizadas

| Etapa | Arquivo local | ALT text | Status |
|---|---|---|---|
| Print 01 | `prints-finais/print-01-aba-dns-sanitizado.png` | Aba DNS para localizar registros DNS StayCloud no Painel Novo | Apoio sanitizado; substituir por print fornecido/atual |
| Print 02 | `prints-finais/print-02-tela-dns-apoio-sanitizado.png` | Não aprovado para uso final | Apoio técnico; não usar no artigo final porque mostra modal de criação |

## Validação SEO

- [x] Palavra-chave no título SEO
- [x] Palavra-chave na meta description
- [x] Palavra-chave no slug
- [x] Palavra-chave nas primeiras 100 palavras
- [x] Palavra-chave no primeiro parágrafo
- [x] Palavra-chave no corpo
- [x] Palavra-chave em pelo menos um H2
- [x] Palavra-chave ou variação em pelo menos um H3
- [x] Palavra-chave no ALT planejado
- [x] Densidade natural
- [x] Conteúdo com no mínimo 600 palavras
- [x] Conteúdo dentro do intervalo editorial aproximado: 898 palavras
- [x] Título SEO dentro do tamanho recomendado
- [x] Meta description dentro do tamanho recomendado
- [x] Links internos planejados
- [x] Excerpt preenchido
- [x] Categoria preenchida
- [x] Tags preenchidas
- [x] Título social preenchido
- [x] Descrição social preenchida
- [ ] Palavra-chave de foco preenchida no Rank Math
- [ ] Palavra-chave confirmada como etiqueta/chip ativa
- [ ] Título SEO salvo no snippet
- [ ] Slug salvo no snippet
- [ ] Meta description salva no snippet
- [ ] Categoria selecionada antes da publicação
- [ ] Rank Math recalculado antes da publicação
- [ ] Score Rank Math igual ou superior a 80, quando validado no WordPress

## Validação do alvo dos prints

- [x] Print 01 aponta exatamente para `DNS`
- [x] Print 01 não aponta para Backups, Desempenho, Domínios, Acessos, IP ou nameservers
- [x] Print 01 não cobre a palavra `DNS`
- [x] Dados sensíveis do print 01 foram censurados
- [ ] Print 01 usa a captura real fornecida por Vinicius
- [ ] Print 02 final mostra a tela DNS atual sem modal de criação
- [ ] Print 03 final identifica tipo, nome/host e valor/destino conforme campos reais
- [ ] Print 04 final mostra botão de copiar apenas se ele existir

## Segurança

- Domínio real, nome de cliente, IP e nameservers foram censurados nos prints de apoio.
- Nenhum token, senha, cookie, `.env`, credencial ou dado de acesso foi salvo nos arquivos do pacote.
- O material não orienta alteração real de DNS, nameservers ou Cloudflare.

## Próximo gate antes de publicar

Executar somente após Vinicius liberar acesso/autenticação ou reenviar o print:

1. Abrir o rascunho BetterDocs `2999`.
2. Comparar conteúdo original, slug, palavra-chave e prints.
3. Validar a aba `DNS` atual no Painel Novo.
4. Recapturar os prints finais.
5. Sanitizar novamente.
6. Substituir placeholders por URLs públicas.
7. Validar Rank Math real.
8. Aguardar `APROVADO PARA PUBLICAR`.
