# Log técnico sanitizado

- Tentativa inicial com WhisperX `large-v3`, idioma `pt`, CPU/int8 e alinhamento foi interrompida após cerca de 12 minutos sem arquivos finais.
- Fallback final local executado no mesmo ambiente virtual com `faster-whisper/small`, idioma `pt`, dispositivo `cpu`, `compute_type` `int8`, `beam_size` `5` e VAD ativo.
- Alinhamento palavra-a-palavra não executado no fallback.
- Diarização não executada no fallback; participantes devem ser revisados pelo conteúdo audível da transcrição.
- Segmentos gerados: `116`.
- Arquivos brutos gerados: JSON, SRT, TXT e TXT com timestamps.
- Nenhum conteúdo completo da transcrição, token ou credencial foi incluído neste log.
