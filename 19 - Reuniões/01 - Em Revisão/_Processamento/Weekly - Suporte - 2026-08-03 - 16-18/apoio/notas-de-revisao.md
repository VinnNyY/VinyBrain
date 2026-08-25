# Notas de revisão — Weekly Suporte — 03/08/2026

## Referência visual

- PDF utilizado como referência principal: `19 - Reuniões/03 - PDFs/Dailies/Daily - Suporte - 2026-07-29 - 11-12.pdf`.
- Motivo: é o PDF validado mais recente na área oficial `19 - Reuniões`; não havia Weekly concluída com Markdown e PDF validados.

## Transcrição e processamento

- Arquivo original validado: `/home/vinicius-alves/Vídeos/Reunioes/2026-08-03 16-18-00.mkv`.
- Formato: Matroska/WebM (`.mkv`) com vídeo H.264 e áudio AAC.
- Duração: 1205,566s.
- Tamanho: 928888179 bytes.
- Áudio confirmado por `ffprobe` e `ffmpeg volumedetect`.
- Tentativa WhisperX `large-v3` em CPU foi interrompida na etapa de alinhamento após mais de 66 minutos sem arquivos finais.
- Tentativa `faster-whisper/large-v3` em CPU foi interrompida após mais de 34 minutos sem arquivos finais.
- Fallback final usado: `faster-whisper/small`, idioma português, CPU, int8, VAD ativo.
- Diarização não foi executada no fallback final.

## Participantes identificados

- Participante principal não identificado: conduz a apresentação.
- Gabriel: citado como N3 e também como apoio a N2 quando necessário.
- Alves: citado em N2, N3/Stack Linux e escala.
- Fael/Rafael: citado em N2 e escala; a transcrição alternou entre os nomes.
- Matheus: citado como N1 e futuro participante da escala.

## Participantes incertos

- Nome do apresentador principal.
- Se Fael e Rafael são a mesma pessoa no contexto da escala.
- Vinny, Luiz e Nico foram citados, mas não ficou claro se participaram da reunião.

## Trechos inaudíveis ou incertos

- Ruído inicial entre 00:00 e 00:30.
- Nome exato da ferramenta foi corrigido para WHMCS Finder pelo contexto, mas a transcrição bruta registrou variações.
- Nome exato do dashboard ou área “Stack/Stack Linux” ficou parcialmente incerto.
- Alguns números de KPI foram mantidos conforme entendimento da fala, mas devem ser confirmados em fonte escrita.

## Conflitos de diarização

- Não houve diarização final.
- Falas foram separadas por conteúdo, não por locutor técnico.

## Decisões com autoria incerta

- Todas as decisões foram atribuídas à reunião ou à equipe quando não houve identificação nominal segura do decisor.
- O apresentador principal não foi nomeado por falta de evidência suficiente.

## Sanitização

- Nenhum token, senha, cookie, chave de API, IP real, e-mail pessoal ou domínio sensível foi mantido no relatório final.
- Termos técnicos genéricos como WHMCS, Zendesk, Slack, WhatsApp, VPS, hospedagem e Deploy foram preservados por serem necessários ao contexto.
