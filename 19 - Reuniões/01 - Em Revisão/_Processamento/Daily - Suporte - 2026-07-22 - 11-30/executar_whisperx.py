import json
from pathlib import Path

import whisperx
from huggingface_hub import get_token
from whisperx.diarize import DiarizationPipeline, assign_word_speakers


VIDEO = Path("/home/vinicius-alves/Viny Brain/19 - Reuniões/04 - Transcrições Originais/Daily - Suporte - 2026-07-22 - 11-30-57.mkv")
OUTPUT_DIR = Path("/home/vinicius-alves/Viny Brain/19 - Reuniões/01 - Em Revisão/_Processamento/Daily - Suporte - 2026-07-22 - 11-30")
DEVICE = "cpu"


def srt_timestamp(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1_000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"


def main() -> None:
    audio = whisperx.load_audio(str(VIDEO))
    model = whisperx.load_model("large-v3", DEVICE, compute_type="int8", language="pt")
    result = model.transcribe(audio, batch_size=2)
    align_model, metadata = whisperx.load_align_model(language_code=result["language"], device=DEVICE)
    result = whisperx.align(result["segments"], align_model, metadata, audio, DEVICE, return_char_alignments=False)

    diarization = "ok"
    try:
        diarize_model = DiarizationPipeline(token=get_token(), device=DEVICE)
        result = assign_word_speakers(diarize_model(audio), result)
    except Exception as error:
        diarization = f"falhou:{type(error).__name__}"

    base = OUTPUT_DIR / "Daily - Suporte - 2026-07-22 - 11-30"
    with base.with_suffix(".json").open("w", encoding="utf-8") as file:
        json.dump(result, file, ensure_ascii=False, indent=2)

    txt_lines = []
    srt_blocks = []
    for index, segment in enumerate(result["segments"], start=1):
        speaker = segment.get("speaker")
        text = segment.get("text", "").strip()
        prefix = f"{speaker}: " if speaker else ""
        txt_lines.append(f"{prefix}{text}")
        srt_blocks.append(f"{index}\n{srt_timestamp(segment['start'])} --> {srt_timestamp(segment['end'])}\n{prefix}{text}")
    base.with_suffix(".txt").write_text("\n\n".join(txt_lines) + "\n", encoding="utf-8")
    base.with_suffix(".srt").write_text("\n\n".join(srt_blocks) + "\n", encoding="utf-8")
    print(f"diarizacao={diarization}")
    print(f"segmentos={len(result['segments'])}")


if __name__ == "__main__":
    main()
