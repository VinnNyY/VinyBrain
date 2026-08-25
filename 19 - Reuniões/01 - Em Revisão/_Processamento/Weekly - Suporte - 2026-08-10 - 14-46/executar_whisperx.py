import json
from pathlib import Path

import whisperx
from huggingface_hub import get_token
from whisperx.diarize import DiarizationPipeline, assign_word_speakers


VIDEO = Path("/home/vinicius-alves/Vídeos/Reunioes/2026-08-10 14-46-30.mkv")
OUTPUT_DIR = Path("/home/vinicius-alves/Viny Brain/19 - Reuniões/01 - Em Revisão/_Processamento/Weekly - Suporte - 2026-08-10 - 14-46")
BASE_NAME = "Weekly - Suporte - 2026-08-10 - 14-46"
DEVICE = "cpu"
COMPUTE_TYPE = "int8"


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

    audio = whisperx.load_audio(str(VIDEO))
    model = whisperx.load_model(
        "large-v3",
        DEVICE,
        compute_type=COMPUTE_TYPE,
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
        token = get_token()
        if not token:
            raise RuntimeError("huggingface_token_indisponivel")
        diarize_model = DiarizationPipeline(token=token, device=DEVICE)
        diarize_segments = diarize_model(audio)
        result = assign_word_speakers(diarize_segments, result)
    except Exception as error:
        diarization = f"falhou:{type(error).__name__}"

    base = OUTPUT_DIR / BASE_NAME
    json_path = base.with_suffix(".json")
    json_path.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

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
        timed_lines.append(
            f"[{srt_timestamp(start).replace(',', '.')} - {srt_timestamp(end).replace(',', '.')}] {prefix}{text}"
        )
        srt_blocks.append(
            f"{index}\n{srt_timestamp(start)} --> {srt_timestamp(end)}\n{prefix}{text}"
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
    (apoio / "transcricao-estruturada.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    log = [
        "# Log técnico sanitizado",
        "",
        "- Executável WhisperX validado: `/home/vinicius-alves/.venvs/whisperx/bin/whisperx`.",
        "- Processamento local executado pela API WhisperX do mesmo ambiente virtual.",
        "- Modelo: `large-v3`.",
        "- Idioma: `pt`.",
        f"- Dispositivo: `{DEVICE}`.",
        f"- Compute type: `{COMPUTE_TYPE}`.",
        "- Alinhamento executado.",
        f"- Diarização: `{diarization}`.",
        f"- Segmentos gerados: `{len(result['segments'])}`.",
        "- Arquivos brutos gerados: JSON, SRT, TXT e TXT com timestamps.",
        "- Nenhum token, senha, cookie ou credencial foi incluído neste log.",
    ]
    (OUTPUT_DIR / "Log Técnico Sanitizado.md").write_text("\n".join(log) + "\n", encoding="utf-8")

    print(f"diarizacao={diarization}")
    print(f"segmentos={len(result['segments'])}")


if __name__ == "__main__":
    main()
