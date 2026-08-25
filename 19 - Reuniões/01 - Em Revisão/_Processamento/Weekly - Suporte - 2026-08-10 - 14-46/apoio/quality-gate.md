# Quality gate — Weekly Suporte — 10/08/2026

## Referência

- Modelo visual usado: `19 - Reuniões/03 - PDFs/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.pdf`.
- DOCX de referência: `19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.docx`.

## Validações técnicas

- Gravação validada com `ffprobe`: MKV com vídeo H.264 e áudio AAC.
- Duração validada: 320,433s.
- Transcrição final gerada: `faster-whisper/small`, idioma `pt`, CPU/int8, VAD ativo.
- JSON de Notion validado em dry-run, sem `--apply`.
- JSON de ClickUp validado em dry-run, sem `--apply`.
- DOCX validado com `unzip -t`.
- PDF validado com `pdfinfo`: 5 páginas, A4, não criptografado.

## Revisão visual do PDF

- PDF renderizado em PNG com `pdftoppm`.
- Páginas revisadas visualmente: 1, 2, 3, 4 e 5.
- Resultado: sem texto cortado, sem sobreposição, sem tabela quebrada, sem página vazia, sem caractere corrompido visível.
- Cabeçalho, rodapé, paginação e indicação de uso interno conferidos em todas as páginas.

## Segurança

- Varredura por tokens, senhas, cookies, API keys, IPs, e-mails, URLs administrativas e `.env` executada nos artefatos finais e payloads.
- Nenhum dado sensível exposto foi encontrado.
- Dados de cliente foram mantidos genéricos.

## Resultado

- Status: aprovado.
- Notion: payload preparado e validado em dry-run; nada enviado.
- ClickUp: 3 demandas preparadas e validadas em dry-run; nenhuma tarefa criada.
