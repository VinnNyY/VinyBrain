"""Gera o PDF da daily no molde Daily_StayCloud a partir do HTML de apoio.

Ferramenta: Playwright + Chromium (já instalados no venv viny-whmcs-playwright).
O padrão original usava python-docx + LibreOffice, indisponíveis nesta máquina.
"""

from pathlib import Path

from playwright.sync_api import sync_playwright


BASE = Path(
    "/home/vinicius-alves/Viny Brain/19 - Reuniões/01 - Em Revisão/_Processamento/Daily - Suporte - 2026-08-17 - 11-33"
)
HTML = BASE / "apoio" / "Daily_StayCloud_17-08-2026.html"
DESTINO = Path(
    "/home/vinicius-alves/Viny Brain/19 - Reuniões/03 - PDFs/Dailies/Daily_StayCloud_17-08-2026.pdf"
)

ESTILO_MARGEM = (
    "font-family:'Liberation Sans',Arial,sans-serif;font-size:7pt;color:#6b6b6b;"
    "width:100%;padding:0 54pt;margin:0;-webkit-print-color-adjust:exact;"
    "white-space:nowrap;"
)

HEADER = f"""
<div style="{ESTILO_MARGEM}text-align:right;letter-spacing:0.3pt;">
  RELATÓRIO INTERNO | SUPORTE
</div>
"""

FOOTER = f"""
<div style="{ESTILO_MARGEM}display:flex;justify-content:space-between;">
  <span>Documento preparado a partir de registro operacional consolidado da daily.</span>
  <span>Página <span class="pageNumber"></span></span>
</div>
"""


def main() -> None:
    if DESTINO.exists():
        raise SystemExit(f"ABORTADO: já existe {DESTINO}")

    DESTINO.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        navegador = p.chromium.launch()
        pagina = navegador.new_page()
        pagina.goto(HTML.as_uri(), wait_until="load")
        pagina.emulate_media(media="print")
        pagina.pdf(
            path=str(DESTINO),
            format="Letter",
            print_background=True,
            display_header_footer=True,
            header_template=HEADER,
            footer_template=FOOTER,
            margin={
                "top": "0.75in",
                "bottom": "0.75in",
                "left": "0.75in",
                "right": "0.75in",
            },
        )
        navegador.close()

    print(f"gerado={DESTINO}")
    print(f"bytes={DESTINO.stat().st_size}")


if __name__ == "__main__":
    main()
