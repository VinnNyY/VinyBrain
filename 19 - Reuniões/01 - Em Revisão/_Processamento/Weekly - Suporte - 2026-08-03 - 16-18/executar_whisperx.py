import json
from pathlib import Path

import whisperx
from huggingface_hub import get_token
from whisperx.diarize import DiarizationPipeline, assign_word_speakers


VIDEO = Path("/home/vinicius-alves/Vídeos/Reunioes/2026-08-03 16-18-00.mkv")
OUTPUT_DIR = Path("/home/vinicius-alves/Viny Brain/19 - Reuniões/01 - Em Revisão/_Processamento/Weekly - Suporte - 2026-08-03 - 16-18")
DEVICE = "cpu"
BASE_NAME = "Weekly - Suporte - 2026-08-03 - 16-18"


def srt_timestamp(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1_000)
    return f"{hours:02d}:{minutes:02d},{seconds:02d},{milliseconds:03d}".replace(",", ":", 1)


def srt_timestamp(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1_000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    audio = whisperx.load_audio(str(VIDEO))
    model = whisperx.load_model(
        "large-v3",
        DEVICE,
        compute_type="int8",
        language="pt",
    )
    result = model.transcribe(audio, batch_size=2)
    align_model, metadata = whisperx.load_align_model(
        language_code=result["language"],
        device=DEVICE,
    )
    result = whisperx.align(
        result["segments"],
        align_model,
        metadata,
        audio,
        DEVICE,
        return_char_alignments=False,
    )

    diarization = "ok"
    try:
        diarize_model = DiarizationPipeline(token=get_token(), device=DEVICE)
        diarize_segments = diarize_model(audio)
        result = assign_word_speakers(diarize_segments, result)
    except Exception as error:
        diarization = f"falhou:{type(error).__name__}"

    base = OUTPUT_DIR / BASE_NAME
    with base.with_suffix(".json").open("w", encoding="utf-8") as file:
        json.dump(result, file, ensure_ascii=False, indent=2)

    txt_lines = []
    srt_blocks = []
    timed_lines = []
    for index, segment in enumerate(result["segments"], start=1):
        speaker = segment.get("speaker")
        text = segment.get("text", "").strip()
        prefix = f"{speaker}: " if speaker else ""
        start = segment.get("start", 0.0)
        end = segment.get("end", 0.0)
        txt_lines.append(f"{prefix}{text}")
        timed_lines.append(f"[{srt_timestamp(start).replace(',', '.')} - {srt_timestamp(end).replace(',', '.')}] {prefix}{text}")
        srt_blocks.append(
            f"{index}\n{srt_timestamp(start)} --> {srt_timestamp(end)}\n{prefix}{text}"
        )

    base.with_suffix(".txt").write_text("\n\n".join(txt_lines) + "\n", encoding="utf-8")
    base.with_name(BASE_NAME + " - com tempos.txt").write_text("\n".join(timed_lines) + "\n", encoding="utf-8")
    base.with_suffix(".srt").write_text("\n\n".join(srt_blocks) + "\n", encoding="utf-8")

    log = [
        "# Log técnico sanitizado",
        "",
        "- Executável WhisperX validado: `/home/vinicius-alves/.venvs/whisperx/bin/whisperx`.",
        "- Processamento local executado pela API WhisperX do mesmo ambiente virtual, usando modelo `large-v3`, idioma `pt`, dispositivo `cpu`, `compute_type` `int8` e `batch_size` `2`.",
        "- Alinhamento executado.",
        f"- Diarização: `{diarization}`.",
        f"- Segmentos gerados: `{len(result['segments'])}`.",
        "- Arquivos brutos gerados: JSON, SRT, TXT e TXT com timestamps.",
        "- Nenhum conteúdo completo da transcrição, token ou credencial foi incluído neste log.",
    ]
    (OUTPUT_DIR / "Log Técnico Sanitizado.md").write_text("\n".join(log) + "\n", encoding="utf-8")

    print(f"diarizacao={diarization}")
    print(f"segmentos={len(result['segments'])}")


if __name__ == "__main__":
    main()
