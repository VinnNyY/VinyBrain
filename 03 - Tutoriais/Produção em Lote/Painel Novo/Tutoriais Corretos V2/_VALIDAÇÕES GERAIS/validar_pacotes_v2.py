#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import re
import sys

BASE = Path(__file__).resolve().parents[1]
TUTORIALS = [
    {
        "path": BASE / "01 - Como acompanhar seus chamados no Painel Novo da StayCloud",
        "keyword": "acompanhar chamados StayCloud",
        "slug": "acompanhar-chamados-staycloud",
        "min_words": 600,
        "min_kw": 4,
        "max_kw": 8,
    },
    {
        "path": BASE / "02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud",
        "keyword": "consultar uso de e-mail",
        "slug": "consultar-uso-email-painel-novo",
        "min_words": 600,
        "min_kw": 4,
        "max_kw": 8,
    },
]
MAIN_FILES = {
    "01 - VISUALIZAR TUTORIAL.html",
    "02 - COLAR NO WORDPRESS.txt",
    "03 - SEO RANK MATH.txt",
    "04 - VALIDAÇÃO FINAL.md",
}
ALLOWED_TAGS = {"h1", "h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "figure", "img", "figcaption"}
BANNED = [
    "# ",
    "## ",
    "### ",
    "**",
    "![",
    "](",
    "```",
    "./prints/",
    "prints/finais/",
    "prints-finais/",
    "originais-sensiveis",
    "/home/vinicius-alves/",
    "file://",
    "URL_PUBLICA",
    "URL_DIRETA_",
    "SEO para preenchimento",
    "<script",
    "<iframe",
    "<style",
]


class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.imgs = []
        self.links = []
        self.figcaptions = 0
        self.figures = 0
        self.errors = []
        self.text = []
        self.h2 = []
        self.h3 = []
        self._current_heading = None

    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        if tag not in ALLOWED_TAGS:
            self.errors.append(f"tag não permitida: <{tag}>")
        attrs = dict(attrs)
        if tag == "img":
            self.imgs.append(attrs)
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "figure":
            self.figures += 1
        if tag == "figcaption":
            self.figcaptions += 1
        if tag in {"h2", "h3"}:
            self._current_heading = tag

    def handle_endtag(self, tag):
        if tag == self._current_heading:
            self._current_heading = None

    def handle_data(self, data):
        value = data.strip()
        if not value:
            return
        self.text.append(value)
        if self._current_heading == "h2":
            self.h2.append(value)
        if self._current_heading == "h3":
            self.h3.append(value)


def word_count(text):
    return len(re.findall(r"[A-Za-zÀ-ÿ0-9]+(?:[-'][A-Za-zÀ-ÿ0-9]+)?", text))


def contains_keyword(text, keyword):
    return bool(re.search(re.escape(keyword), text, flags=re.I))


def section_value(seo, label):
    match = re.search(rf"{re.escape(label)}:\n(.+?)(?:\n\n[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 /]+:|\Z)", seo, flags=re.S)
    return match.group(1).strip() if match else ""


def validate_public_code(path, config):
    html = path.read_text(encoding="utf-8")
    parser = ArticleParser()
    parser.feed(html)
    errors = list(parser.errors)
    keyword = config["keyword"]

    for banned in BANNED:
        if banned in html:
            errors.append(f"contém padrão proibido: {banned}")

    checks = {
        "exatamente um H1": len(re.findall(r"<h1[>\s]", html, flags=re.I)) == 1,
        "possui H2": bool(re.search(r"<h2[>\s]", html, flags=re.I)),
        "possui H3": bool(re.search(r"<h3[>\s]", html, flags=re.I)),
        "possui parágrafo": bool(re.search(r"<p[>\s]", html, flags=re.I)),
        "possui lista": bool(re.search(r"<(?:ul|ol)[>\s]", html, flags=re.I)),
        "três imagens": len(parser.imgs) == 3,
        "três figures": parser.figures == 3,
        "três figcaptions": parser.figcaptions == 3,
    }
    errors.extend(name for name, ok in checks.items() if not ok)

    text = " ".join(parser.text)
    words = word_count(text)
    if words < config["min_words"]:
        errors.append(f"conteúdo abaixo de {config['min_words']} palavras: {words}")

    text_occurrences = len(re.findall(re.escape(keyword), text, flags=re.I))
    alt_occurrences = sum(1 for img in parser.imgs if contains_keyword(img.get("alt", ""), keyword))
    total_occurrences = text_occurrences + alt_occurrences
    if total_occurrences < config["min_kw"] or total_occurrences > config["max_kw"]:
        errors.append(f"ocorrências da palavra-chave fora da faixa: {total_occurrences}")

    first_100 = " ".join(re.findall(r"[A-Za-zÀ-ÿ0-9]+(?:[-'][A-Za-zÀ-ÿ0-9]+)?", text)[:100])
    if not contains_keyword(first_100, keyword):
        errors.append("palavra-chave ausente nas primeiras 100 palavras")
    if not any(contains_keyword(h, keyword) for h in parser.h2):
        errors.append("palavra-chave ausente em H2")
    if not any(contains_keyword(h, keyword) for h in parser.h3):
        errors.append("palavra-chave ausente em H3")
    if not alt_occurrences:
        errors.append("palavra-chave ausente no ALT das imagens")

    urls = [img.get("src", "") for img in parser.imgs]
    if len(set(urls)) != 3:
        errors.append("URLs das imagens não são três URLs diferentes")
    for img in parser.imgs:
        url = img.get("src", "")
        alt = img.get("alt", "").strip()
        parsed = urlparse(url)
        if parsed.scheme != "https":
            errors.append(f"URL sem HTTPS: {url}")
        if parsed.netloc != "ajuda.staycloud.com.br":
            errors.append(f"domínio inválido: {url}")
        if "/wp-content/uploads/" not in parsed.path:
            errors.append(f"URL sem /wp-content/uploads/: {url}")
        if not parsed.path.endswith(".png"):
            errors.append(f"URL não aponta para PNG: {url}")
        if not alt:
            errors.append(f"imagem sem ALT: {url}")

    internal_links = [url for url in parser.links if url.startswith("https://ajuda.staycloud.com.br/")]
    if len(set(internal_links)) < 2:
        errors.append("menos de dois links internos HTTPS")
    if any("clique aqui" in item.lower() for item in parser.text):
        errors.append("âncora genérica encontrada: clique aqui")

    return errors


def validate_seo_file(path, config):
    seo = path.read_text(encoding="utf-8")
    errors = []
    keyword = config["keyword"]
    title = section_value(seo, "TÍTULO SEO")
    meta = section_value(seo, "META DESCRIPTION")
    slug = section_value(seo, "SLUG")
    status = section_value(seo, "STATUS")

    if "80/100" not in section_value(seo, "SCORE MÍNIMO PARA APROVAÇÃO"):
        errors.append("score mínimo 80/100 ausente")
    if "SEO preparado localmente" not in status and "SEO validado no Rank Math" not in status:
        errors.append("status SEO inválido ou ausente")
    if not title.lower().startswith(keyword.lower()):
        errors.append("título SEO não começa com a palavra-chave")
    if not 40 <= len(title) <= 60:
        errors.append(f"título SEO fora do tamanho esperado: {len(title)}")
    if not contains_keyword(meta, keyword):
        errors.append("meta description sem palavra-chave")
    if not 140 <= len(meta) <= 160:
        errors.append(f"meta description fora do tamanho esperado: {len(meta)}")
    if slug != config["slug"]:
        errors.append(f"slug diferente do obrigatório: {slug}")
    if not contains_keyword(section_value(seo, "EXCERPT"), keyword.split()[0]):
        errors.append("excerpt possivelmente fraco para a palavra-chave")
    for label in [
        "DENSIDADE ESTIMADA",
        "QUANTIDADE DE PALAVRAS",
        "H2 COM PALAVRA-CHAVE",
        "H3 COM PALAVRA-CHAVE OU VARIAÇÃO",
        "IMAGEM COM PALAVRA-CHAVE NO ALT",
        "LINKS INTERNOS",
        "LINKS EXTERNOS",
        "TÍTULO SOCIAL",
        "DESCRIÇÃO SOCIAL",
        "CHECKLIST RANK MATH",
        "PENDÊNCIAS",
    ]:
        if not section_value(seo, label):
            errors.append(f"campo SEO vazio: {label}")
    return errors


def validate_tutorial(config):
    tutorial = config["path"]
    errors = []
    root_files = {p.name for p in tutorial.iterdir() if p.is_file()}
    extra_root_files = root_files - MAIN_FILES
    missing = MAIN_FILES - root_files
    if missing:
        errors.append(f"arquivos principais ausentes: {sorted(missing)}")
    if extra_root_files:
        errors.append(f"arquivos soltos na raiz: {sorted(extra_root_files)}")
    if not (tutorial / "prints-finais").is_dir():
        errors.append("pasta prints-finais ausente")
    if not (tutorial / "apoio").is_dir():
        errors.append("pasta apoio ausente")
    if (tutorial / "02 - COLAR NO WORDPRESS.txt").exists():
        errors.extend(validate_public_code(tutorial / "02 - COLAR NO WORDPRESS.txt", config))
    if (tutorial / "03 - SEO RANK MATH.txt").exists():
        errors.extend(validate_seo_file(tutorial / "03 - SEO RANK MATH.txt", config))
    validation_file = tutorial / "04 - VALIDAÇÃO FINAL.md"
    if validation_file.exists():
        validation = validation_file.read_text(encoding="utf-8")
        if "Imagem pública corresponde à versão local aprovada: pendente" in validation:
            errors.append("imagem pública ainda não corresponde à versão local aprovada")
        if "aguardando upload do print corrigido" in validation:
            errors.append("tutorial aguardando upload do print corrigido")
    print_count = len(list((tutorial / "prints-finais").glob("*"))) if (tutorial / "prints-finais").is_dir() else 0
    if print_count != 3:
        errors.append(f"prints-finais deve conter 3 arquivos, contém {print_count}")
    return errors


def main():
    failed = False
    for config in TUTORIALS:
        errors = validate_tutorial(config)
        if errors:
            failed = True
            print(f"REPROVADO: {config['path'].name}")
            for error in errors:
                print(f"- {error}")
        else:
            print(f"APROVADO: {config['path'].name}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
