# Como usar

1. Cole ou salve a transcricao bruta em:
   `04 - Gestão/Reuniões Suporte/01 - Entradas Brutas/`

2. Rode no Codex:
   Use o comando manual `/formatar-reuniao-suporte`.

3. Informe:
   - tipo da reuniao: Daily ou Weekly;
   - data;
   - arquivo bruto;
   - se deseja gerar PDF.

4. Revise o HTML/PDF antes de enviar para coordenacao.

5. Se o PDF for gerado neste ambiente, o conversor padrão é `google-chrome` em modo headless.

6. Fluxo recomendado:
   - gerar Markdown formal;
   - gerar HTML de revisão;
   - revisar visualmente;
   - converter HTML para PDF com `google-chrome` headless;
   - salvar o PDF em `04 - PDFs/`.

7. Comando base:
   ```bash
   google-chrome --headless --disable-gpu --print-to-pdf="CAMINHO-SAIDA.pdf" "file://CAMINHO-HTML.html"
   ```

8. Depois de gerar o PDF, confirme:
   - se o PDF existe;
   - o caminho completo;
   - o tamanho do arquivo;
   - se o Markdown e o HTML não foram alterados sem necessidade.

9. O fluxo está validado para uso real em `Daily Suporte` e `Weekly Suporte`.
