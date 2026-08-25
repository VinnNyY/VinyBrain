# Log técnico sanitizado

- Tentativa inicial com WhisperX `large-v3` em CPU executou transcrição, mas foi interrompida na etapa de alinhamento após mais de 66 minutos sem arquivos finais.
- Segunda tentativa com `faster-whisper/large-v3` em CPU foi interrompida após mais de 34 minutos sem arquivos finais.
- Fallback final local executado no mesmo ambiente virtual com `faster-whisper/small`, idioma `pt`, dispositivo `cpu`, `compute_type` `int8`, `beam_size` `5` e VAD ativo.
- Alinhamento palavra-a-palavra não executado no fallback.
- Diarização não executada no fallback; participantes foram revisados pelo conteúdo audível da transcrição.
- Segmentos gerados: `508`.
- Arquivos brutos gerados: JSON, SRT, TXT e TXT com timestamps.
- Nenhum conteúdo completo da transcrição, token ou credencial foi incluído neste log.
