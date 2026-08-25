import json
from pathlib import Path

from faster_whisper import WhisperModel


VIDEO = Path("/home/vinicius-alves/Vídeos/Reunioes/2026-08-10 14-46-30.mkv")
OUTPUT_DIR = Path("/home/vinicius-alves/Viny Brain/19 - Reuniões/01 - Em Revisão/_Processamento/Weekly - Suporte - 2026-08-10 - 14-46")
BASE_NAME = "Weekly - Suporte - 2026-08-10 - 14-46"


def srt_timestamp(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1_000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    apoio = OUTPUT_DIR / "apoio"
    apoio.mkdir(exist_ok=True)

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments_iter, info = model.transcribe(
        str(VIDEO),
        language="pt",
        beam_size=5,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 500},
    )

    segments = []
    for segment in segments_iter:
        segments.append(
            {
                "id": segment.id,
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip(),
                "avg_logprob": segment.avg_logprob,
                "no_speech_prob": segment.no_speech_prob,
            }
        )

    result = {
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "duration_after_vad": info.duration_after_vad,
        "model": "faster-whisper/small",
        "device": "cpu",
        "compute_type": "int8",
        "alignment": "not_run",
        "diarization": "not_run",
        "segments": segments,
    }

    base = OUTPUT_DIR / BASE_NAME
    json_text = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    base.with_suffix(".json").write_text(json_text, encoding="utf-8")

    txt_lines = []
    timed_lines = []
    srt_blocks = []
    for index, segment in enumerate(segments, start=1):
        text = segment["text"]
        txt_lines.append(text)
        timed_lines.append(
            f"[{srt_timestamp(segment['start']).replace(',', '.')} - {srt_timestamp(segment['end']).replace(',', '.')}] {text}"
        )
        srt_blocks.append(
            f"{index}\n{srt_timestamp(segment['start'])} --> {srt_timestamp(segment['end'])}\n{text}"
        )

    raw_text = "\n\n".join(txt_lines) + "\n"
    timed_text = "\n".join(timed_lines) + "\n"
    srt_text = "\n\n".join(srt_blocks) + "\n"

    base.with_suffix(".txt").write_text(raw_text, encoding="utf-8")
    base.with_name(BASE_NAME + " - com tempos.txt").write_text(timed_text, encoding="utf-8")
    base.with_suffix(".srt").write_text(srt_text, encoding="utf-8")
    (apoio / "transcricao-bruta.txt").write_text(raw_text, encoding="utf-8")
    (apoio / "transcricao-com-tempos.txt").write_text(timed_text, encoding="utf-8")
    (apoio / "transcricao-com-tempos.srt").write_text(srt_text, encoding="utf-8")
    (apoio / "transcricao-estruturada.json").write_text(json_text, encoding="utf-8")

    log = [
        "# Log técnico sanitizado",
        "",
        "- Tentativa inicial com WhisperX `large-v3`, idioma `pt`, CPU/int8 e alinhamento foi interrompida após cerca de 12 minutos sem arquivos finais.",
        "- Fallback final local executado no mesmo ambiente virtual com `faster-whisper/small`, idioma `pt`, dispositivo `cpu`, `compute_type` `int8`, `beam_size` `5` e VAD ativo.",
        "- Alinhamento palavra-a-palavra não executado no fallback.",
        "- Diarização não executada no fallback; participantes devem ser revisados pelo conteúdo audível da transcrição.",
        f"- Segmentos gerados: `{len(segments)}`.",
        "- Arquivos brutos gerados: JSON, SRT, TXT e TXT com timestamps.",
        "- Nenhum conteúdo completo da transcrição, token ou credencial foi incluído neste log.",
    ]
    (OUTPUT_DIR / "Log Técnico Sanitizado.md").write_text("\n".join(log) + "\n", encoding="utf-8")

    print(f"idioma={info.language}")
    print(f"probabilidade_idioma={info.language_probability:.4f}")
    print(f"duracao={info.duration:.2f}")
    print(f"duracao_pos_vad={info.duration_after_vad:.2f}")
    print(f"segmentos={len(segments)}")


if __name__ == "__main__":
    main()
