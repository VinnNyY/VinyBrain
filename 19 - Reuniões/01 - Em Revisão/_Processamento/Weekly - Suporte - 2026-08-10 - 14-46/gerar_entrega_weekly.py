import html
import json
import re
import shutil
import zipfile
from pathlib import Path


ROOT = Path("/home/vinicius-alves/Viny Brain")
PROCESS = ROOT / "19 - Reuniões/01 - Em Revisão/_Processamento/Weekly - Suporte - 2026-08-10 - 14-46"
REVIEW = ROOT / "19 - Reuniões/01 - Em Revisão"
FINAL_MD_DIR = ROOT / "19 - Reuniões/02 - Reuniões Formatadas/Weeklies"
FINAL_PDF_DIR = ROOT / "19 - Reuniões/03 - PDFs/Weeklies"
ORIGINALS = ROOT / "19 - Reuniões/04 - Transcrições Originais"
PAYLOADS = ROOT / "18 - Integrações/API/payloads"

BASE = "Weekly - Suporte - 2026-08-10 - 14-46"
TITLE = "Weekly — Equipe de Suporte — 10/08/2026"
SOURCE_VIDEO = "/home/vinicius-alves/Vídeos/Reunioes/2026-08-10 14-46-30.mkv"


revised_transcript = """# Transcrição revisada — Weekly Suporte — 10/08/2026

Arquivo original: `/home/vinicius-alves/Vídeos/Reunioes/2026-08-10 14-46-30.mkv`
Tipo: Weekly
Horário de início aproximado: 14:46
Duração: 5min20s
Modelo final utilizado: faster-whisper/small int8 CPU

## Participantes

- Participante principal não identificado: conduziu a reunião, fez perguntas à equipe e orientou encaminhamentos.
- Fael/Rafael: participante possivelmente acionado no início sobre demandas e migrações; identificação não ficou totalmente segura.
- Gabriel/Gaby: participante citado e consultado sobre demandas; informou que, por enquanto, estava tranquilo.
- Matheus: participante consultado no final sobre atuação no chat.
- Naldo: citado como pessoa que já havia sido acionada por Slack, mas não ficou claro se participou da reunião.

## Transcrição revisada com tempos aproximados

[00:00:00 - 00:00:16] O participante principal inicia a Weekly perguntando à equipe sobre demandas no chat, pendências e como foi a semana anterior. Ele direciona o início para Fael/Rafael e Gabriel, mas o trecho possui ruído e identificação incerta.

[00:00:16 - 00:00:38] Um participante informa que, no momento, está tudo mais ou menos tranquilo e menciona atuação em migrações. O participante principal confirma que migrações devem ser direcionadas para ele quando caírem nesse fluxo. Há menção a um ticket específico em andamento, mas sem identificação segura do cliente ou do número.

[00:00:39 - 00:00:50] O participante principal pergunta se havia algo travado e como foi a semana. O participante responde que a semana foi tranquila, sem nada muito difícil.

[00:00:50 - 00:01:24] Um participante informa que precisa falar com Naldo sobre um caso relacionado a atendimento/chat e parte financeira. Ele relata que já enviou mensagem pelo Slack, inclusive no privado. O participante principal orienta a acionar novamente, porque Naldo poderia estar em reunião, e pedir validação com alguém do time responsável ou com desenvolvedores, se necessário.

[00:01:24 - 00:02:53] O participante principal analisa um caso de contratação anual em que a conta ainda estava pendente. Ele orienta a não segurar o cliente no chat: informar que será aberto ou escalado um ticket para o financeiro validar, criar/liberar a conta pelo módulo de criação, colocar a data de vencimento da fatura e do produto/serviço para 11/08/2026 e criar um lembrete para conferir no dia seguinte se o cliente pagou. Se o pagamento for confirmado, a data de vencimento deverá ser ajustada para o ano seguinte.

[00:02:53 - 00:03:25] O mesmo caso passa a envolver renovação de domínio junto à fatura. O participante principal indica que a renovação de domínio não deve ser executada sem pagamento, pois isso geraria prejuízo. Um participante informa que vai verificar com a pessoa responsável e retornar com as informações corretas.

[00:03:26 - 00:03:38] Gabriel/Gaby é consultado sobre como estão suas demandas. Ele responde que, por enquanto, está tranquilo, mas menciona investigação de um bug em um script desenvolvido. O trecho sobre o script ficou parcialmente incerto.

[00:03:38 - 00:04:28] O participante principal pergunta se há demandas novas e comenta que, do lado dele, algumas responsabilidades mudaram. Ele informa que ficará mais voltado ao gerenciamento e à escalada de tickets para a equipe. Também são mencionadas novas metas ou entregas, incluindo artigos, playbooks e participação em migrações, mas a transcrição ficou ruidosa e os números devem ser confirmados.

[00:04:28 - 00:04:47] O participante principal reforça que ficará mais no gerenciamento, acompanhando junto com Matheus e escalando tickets antigos para a equipe, mas segue disponível para ser chamado quando necessário.

[00:04:47 - 00:05:08] Matheus é consultado sobre a semana, demandas e atuação. Ele responde que não tem muito a dizer, que está no chat, pegando demandas e acompanhando o backlog ou fila relacionada ao Naldo. O trecho final tem palavras incertas.

[00:05:08 - 00:05:20] O participante principal encerra a reunião informando que, se estiver tudo certo, cada pessoa pode focar no que estava fazendo. Ele pede que mandem mensagem se precisarem de algo.
"""


report_md = """---
tipo: Weekly
status: concluído
data: 2026-08-10
horario: "14:46"
equipe: Suporte
participantes:
  - Participante principal não identificado
  - Fael/Rafael
  - Gabriel/Gaby
  - Matheus
responsavel_registro: Vinicius
classificacao: Uso interno
pdf_gerado: sim
---

# Weekly — Equipe de Suporte — 10/08/2026

## Informações da reunião

- Tipo: Weekly
- Data: 10/08/2026
- Horário: 14:46
- Duração: 5min20s
- Equipe: Suporte
- Participantes identificados ou citados: Participante principal não identificado, Fael/Rafael, Gabriel/Gaby, Matheus e Naldo
- Responsável pelo relatório: Vinicius
- Classificação: Uso interno

## Resumo executivo

A Weekly foi uma reunião curta de acompanhamento do suporte. O foco principal foi verificar demandas pendentes da semana, orientar um caso de contratação anual com pendência de pagamento, tratar um ponto financeiro já escalado via Slack, acompanhar demandas de Gabriel/Gaby e Matheus e alinhar que o participante principal passará a atuar mais em gerenciamento e escalada de tickets para a equipe.

Houve uma orientação operacional clara para não manter o cliente preso no chat em um caso de contratação anual: a conta pode ser criada/liberada com vencimento ajustado para 11/08/2026, mantendo um lembrete para validar o pagamento no dia seguinte. Para renovação de domínio, a orientação foi diferente: não executar renovação sem pagamento confirmado, para evitar prejuízo.

## Principais atualizações

### Acompanhamento da equipe

- A reunião começou com checagem de demandas no chat, pendências e evolução desde a semana anterior.
- Um participante informou que estava atuando em migrações e que a semana havia sido tranquila, sem demandas muito difíceis.
- Gabriel/Gaby informou que, por enquanto, suas demandas estavam tranquilas e mencionou investigação de bug em um script desenvolvido.
- Matheus informou que estava atuando no chat, pegando demandas e acompanhando uma fila ou backlog relacionado a Naldo.

### Caso financeiro e contratação anual

- Um participante relatou um caso já acionado via Slack, inclusive no privado de Naldo.
- A orientação foi acionar novamente Naldo ou alguém responsável para validar com o financeiro, time técnico ou desenvolvedores, conforme o caso.
- Para uma contratação anual com conta pendente, a orientação foi abrir ou escalar ticket para o financeiro validar e liberar a conta para não travar o cliente no chat.
- A data de vencimento da fatura e do produto/serviço deve ser ajustada para 11/08/2026 e revisada no dia seguinte.

### Renovação de domínio

- O caso também envolvia renovação de domínio na mesma fatura.
- A renovação de domínio não deve ser feita sem pagamento confirmado, pois isso pode gerar prejuízo operacional.
- Um participante ficou de verificar o caso com a pessoa responsável e retornar com a orientação correta.

### Mudança de atuação do participante principal

- O participante principal informou que seu lado mudou e que ficará mais voltado ao gerenciamento.
- Ele passará a escalar mais tickets para a equipe e acompanhar a operação junto com Matheus.
- Ainda assim, informou que continuará disponível para ser chamado quando necessário.

## Resultados e entregas mencionados

- Orientação operacional definida para contratação anual pendente de pagamento.
- Orientação definida para não renovar domínio sem pagamento confirmado.
- Encaminhamento para novo contato com Naldo ou responsável pelo caso financeiro.
- Acompanhamento de demandas de Gabriel/Gaby e Matheus realizado.
- Mudança de atuação do participante principal comunicada à equipe.

## Problemas e bloqueios

| Problema | Impacto | Responsável | Ação esperada | Status |
|---|---|---|---|---|
| Caso financeiro com contratação anual pendente | Cliente pode ficar travado no chat e conta pode permanecer pendente | Participante que está atendendo o caso | Escalar para o financeiro validar, liberar conta quando aplicável e revisar pagamento em 11/08/2026 | Em andamento |
| Renovação de domínio junto à fatura | Renovar sem pagamento pode gerar prejuízo | A definir | Não renovar domínio sem pagamento confirmado | Em acompanhamento |
| Retorno de Naldo ou responsável pelo caso | Encaminhamento pode atrasar se não houver resposta no Slack | Participante que acionou Naldo | Reforçar contato e pedir validação com responsáveis | Pendente |
| Trechos ruidosos sobre novas metas ou entregas | Risco de registrar números incorretos | A definir | Confirmar em fonte escrita ou próxima reunião | Pendente |

## Decisões tomadas

| Decisão | Contexto | Responsável | Impacto | Prazo |
|---|---|---|---|---|
| Não manter o cliente preso no chat no caso de contratação anual pendente | Cliente tentava contratar/pagar e a conta estava pendente | Participante que atende o caso | Atendimento segue por ticket/validação financeira sem travar o chat | Imediato |
| Criar/liberar a conta quando aplicável e ajustar vencimento para 11/08/2026 | Contratação anual pendente de validação | Participante que atende o caso | Cliente recebe acesso enquanto o pagamento é validado | 11/08/2026 |
| Conferir no dia seguinte se o cliente pagou antes de ajustar o vencimento definitivo | Necessidade de confirmar pagamento antes de finalizar o ciclo anual | Participante que atende o caso | Evita vencimento incorreto e mantém controle financeiro | 11/08/2026 |
| Não renovar domínio sem pagamento confirmado | Renovação de domínio pode gerar custo imediato | Equipe de Suporte | Evita prejuízo operacional | Imediato |
| Participante principal atuará mais em gerenciamento e escalada de tickets | Mudança de responsabilidades informada na reunião | Participante principal não identificado | Equipe deve esperar mais tickets escalados por ele | A partir da reunião |

## Plano de ação

| Ação | Responsável | Prazo | Prioridade | Status | Dependência |
|---|---|---|---|---|---|
| Acionar novamente Naldo ou responsável pelo caso financeiro | Participante que está atendendo o caso | Não definido | Alta | Pendente | Resposta do responsável |
| Escalar ou abrir ticket para o financeiro validar a contratação anual | Participante que está atendendo o caso | Imediato | Alta | Pendente | Dados do atendimento |
| Criar/liberar a conta do cliente quando aplicável | Participante que está atendendo o caso | Imediato | Alta | Pendente | Conta pendente e fluxo de criação disponível |
| Ajustar vencimento da fatura e do produto/serviço para 11/08/2026 | Participante que está atendendo o caso | 11/08/2026 | Alta | Pendente | Conta criada/liberada |
| Criar lembrete para verificar pagamento no dia seguinte | Participante que está atendendo o caso | 11/08/2026 | Alta | Pendente | Registro do caso |
| Verificar se o cliente pagou e ajustar vencimento para o ano seguinte, se confirmado | Participante que está atendendo o caso | 11/08/2026 | Alta | Pendente | Pagamento confirmado |
| Não executar renovação de domínio sem pagamento confirmado | Equipe de Suporte | Imediato | Alta | Em acompanhamento | Confirmação de pagamento |
| Verificar orientação correta para o caso de domínio/fatura conjunta | Participante não identificado | Não definido | Média | Pendente | Retorno da pessoa responsável |
| Investigar bug em script desenvolvido | Gabriel/Gaby | Não definido | Média | Em andamento | Diagnóstico técnico |
| Confirmar números e escopo das novas metas citadas | A definir | Não definido | Média | Pendente | Fonte escrita ou próxima Weekly |

## Projetos, ferramentas e demandas citados

### Atendimento financeiro e criação/liberação de conta

- Objetivo: resolver um caso de contratação anual sem manter o cliente preso no chat.
- Contexto: conta pendente, tentativa de pagamento/contratação e necessidade de validação financeira.
- Decisões: liberar/criar conta quando aplicável, ajustar vencimentos para 11/08/2026 e revisar pagamento no dia seguinte.
- Risco: renovação de domínio não pode ser antecipada sem pagamento confirmado.
- Próximos passos: acionar responsável, registrar ticket financeiro e acompanhar pagamento.

### Bug em script desenvolvido

- Objetivo: investigar bug em script mencionado por Gabriel/Gaby.
- Contexto: demanda técnica citada rapidamente na reunião.
- Dúvidas: nome do script, impacto, responsável final e prazo não ficaram claros.
- Próximos passos: manter como ponto de acompanhamento.

### Mudança de atuação em gerenciamento e escalada

- Objetivo: participante principal passa a atuar mais no gerenciamento e na distribuição/escalada de tickets.
- Contexto: mudanças de responsabilidade informadas na reunião.
- Impacto: equipe deve receber mais tickets escalados e acionar o participante principal quando necessário.

## Pendências

- Confirmar nome do participante principal.
- Confirmar se Fael e Rafael se referem à mesma pessoa neste contexto.
- Confirmar o nome correto de Gabriel/Gaby.
- Confirmar o conteúdo exato das novas metas ou entregas citadas, incluindo artigos, playbooks e participação em migrações.
- Confirmar o responsável final pelo caso financeiro e pela renovação de domínio.
- Confirmar o nome e impacto do script com bug citado por Gabriel/Gaby.

## Pontos para a próxima Weekly

- Verificar se o caso financeiro foi resolvido e se o pagamento foi confirmado em 11/08/2026.
- Confirmar se houve renovação de domínio somente após pagamento.
- Revisar o andamento do bug em script investigado por Gabriel/Gaby.
- Validar como está funcionando a nova atuação do participante principal em gerenciamento e escalada.
- Confirmar as metas ou entregas citadas em áudio com fonte escrita.

## Conclusão

A reunião teve caráter de acompanhamento operacional e trouxe uma orientação importante para atendimento financeiro: liberar a conta quando aplicável, controlar vencimento para 11/08/2026 e verificar pagamento no dia seguinte, sem antecipar renovação de domínio sem confirmação financeira. Também ficou registrado que o participante principal passará a atuar mais em gerenciamento e escalada de tickets. Os trechos sobre novas metas e algumas identificações de participantes ficaram incertos e devem ser confirmados antes de virar tarefa formal definitiva.
"""


notes_md = """# Notas de revisão — Weekly Suporte — 10/08/2026

## Referência visual

- PDF utilizado como referência principal: `19 - Reuniões/03 - PDFs/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.pdf`.
- DOCX correspondente utilizado como referência de entrega: `19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.docx`.
- Motivo: reunião Weekly mais recente concluída no padrão aprovado.

## Transcrição e processamento

- Arquivo original validado: `/home/vinicius-alves/Vídeos/Reunioes/2026-08-10 14-46-30.mkv`.
- Formato: Matroska/WebM (`.mkv`) com vídeo H.264 e áudio AAC.
- Duração: 320,433s.
- Tamanho: 246775608 bytes.
- Áudio confirmado por `ffprobe`.
- Tentativa inicial com WhisperX `large-v3`, idioma `pt`, CPU/int8 e alinhamento foi interrompida após cerca de 12 minutos sem arquivos finais.
- Fallback final usado: `faster-whisper/small`, idioma português, CPU, int8, VAD ativo.
- Diarização automática não foi executada no fallback final.

## Participantes identificados

- Participante principal não identificado: conduziu a reunião.
- Fael/Rafael: identificação incerta no trecho inicial.
- Gabriel/Gaby: identificação incerta, mas citado/consultado.
- Matheus: citado diretamente no encerramento.
- Naldo: citado como pessoa acionada no Slack; participação na reunião não confirmada.

## Trechos inaudíveis ou incertos

- Trecho inicial entre 00:00 e 00:16, com nomes e abertura da reunião.
- Nome correto de Fael/Rafael.
- Nome correto de Gabriel/Gaby.
- Referência a Naldo e ao canal exato usado no Slack.
- Descrição do bug em script desenvolvido.
- Números e escopo das metas ou entregas citadas entre 00:03:58 e 00:04:28.
- Termos relacionados a backlog/fila no trecho final de Matheus.

## Decisões com autoria incerta

- As decisões foram atribuídas à reunião ou ao participante principal quando a autoria nominal não ficou segura.
- Responsáveis não explicitamente nomeados foram mantidos como `A definir` ou como `participante que está atendendo o caso`.

## Resolução de datas relativas

- A expressão "amanhã" foi resolvida como 11/08/2026, considerando a data da reunião em 10/08/2026.
- A expressão original foi preservada nesta nota para rastreabilidade.

## Sanitização

- Nenhum token, senha, cookie, chave de API, IP real, e-mail pessoal, domínio de cliente ou URL administrativa foi mantido no relatório final.
- O caso de cliente foi tratado de forma genérica para preservar dados de atendimento.
"""


original_md = f"""# Arquivo original — Weekly Suporte — 10/08/2026

- Caminho: `{SOURCE_VIDEO}`
- Tipo identificado: Weekly
- Data da reunião: 2026-08-10
- Horário aproximado: 14:46
- Formato: Matroska/WebM (`.mkv`)
- Streams: vídeo H.264 e áudio AAC
- Duração: 320,433s
- Tamanho: 246775608 bytes
- Observação: o arquivo original não foi copiado para dentro do vault para evitar duplicação de mídia; a referência preserva o caminho local validado.
"""


clickup_payload = {
    "modo": "lote_simples",
    "dry_run": True,
    "origem": "Weekly - Suporte - 2026-08-10 - 14-46",
    "tarefas": [
        {
            "nome": "Acompanhar caso financeiro de contratação anual",
            "descricao": "Escalar ou abrir ticket para validação financeira, liberar a conta quando aplicável e acompanhar pagamento no dia seguinte.",
            "responsavel": "Participante que está atendendo o caso",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "2026-08-11",
            "tags": ["viny-brain", "weekly", "suporte", "financeiro"],
            "checklist": [
                "Acionar Naldo ou responsável pelo caso",
                "Escalar ticket para validação financeira",
                "Ajustar vencimento para 11/08/2026 quando aplicável",
                "Verificar pagamento em 11/08/2026",
                "Ajustar vencimento anual se o pagamento for confirmado"
            ],
            "criterio_conclusao": "Pagamento conferido e vencimento ajustado corretamente.",
            "origem": "Weekly Suporte 2026-08-10",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Validar renovação de domínio somente após pagamento",
            "descricao": "Não executar renovação de domínio sem confirmação de pagamento para evitar prejuízo operacional.",
            "responsavel": "A definir",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "suporte", "dominio"],
            "checklist": [
                "Confirmar se domínio está na mesma fatura",
                "Confirmar pagamento",
                "Executar renovação apenas após validação financeira"
            ],
            "criterio_conclusao": "Renovação feita somente com pagamento confirmado ou orientação registrada.",
            "origem": "Weekly Suporte 2026-08-10",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Confirmar metas e entregas citadas na Weekly",
            "descricao": "Confirmar em fonte escrita os números e escopo de artigos, playbooks e participação em migrações citados com áudio incerto.",
            "responsavel": "A definir",
            "prioridade": "Média",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "suporte"],
            "checklist": [
                "Conferir fonte escrita das metas",
                "Validar números citados",
                "Atualizar próxima Weekly se necessário"
            ],
            "criterio_conclusao": "Metas confirmadas ou removidas do acompanhamento formal.",
            "origem": "Weekly Suporte 2026-08-10",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        }
    ]
}


notion_payload = {
    "titulo": "Weekly - Suporte - 2026-08-10 - 14:46",
    "data": "2026-08-10",
    "participantes": ["Participante principal não identificado", "Fael/Rafael", "Gabriel/Gaby", "Matheus"],
    "contexto": "Weekly curta de suporte sobre demandas da semana, caso financeiro, renovação de domínio, bug em script e mudança de atuação para gerenciamento/escalada.",
    "resumo_executivo": "A reunião acompanhou demandas pendentes e definiu orientação para um caso de contratação anual com pagamento pendente: liberar conta quando aplicável, ajustar vencimentos para 11/08/2026 e verificar pagamento no dia seguinte. A renovação de domínio não deve ser executada sem pagamento confirmado.",
    "pontos_discutidos": [
        "Demandas no chat e pendências da semana anterior.",
        "Caso financeiro com contratação anual pendente.",
        "Ajuste de vencimento para 11/08/2026.",
        "Renovação de domínio sem pagamento confirmado.",
        "Bug em script desenvolvido citado por Gabriel/Gaby.",
        "Mudança de atuação do participante principal para gerenciamento e escalada de tickets."
    ],
    "decisoes": [
        "Não manter o cliente preso no chat no caso de contratação anual pendente.",
        "Criar/liberar a conta quando aplicável e ajustar vencimento para 11/08/2026.",
        "Verificar pagamento no dia seguinte antes de ajustar vencimento definitivo.",
        "Não renovar domínio sem pagamento confirmado.",
        "Participante principal passará a atuar mais em gerenciamento e escalada de tickets."
    ],
    "pendencias": [
        {"descricao": "Confirmar nome do participante principal.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar responsáveis finais pelo caso financeiro e pela renovação de domínio.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar números e escopo das metas ou entregas citadas.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar nome e impacto do bug em script citado por Gabriel/Gaby.", "responsavel": "A definir", "prazo": "A definir"}
    ],
    "proximos_passos": [
        "Acompanhar pagamento em 11/08/2026.",
        "Não renovar domínio sem confirmação financeira.",
        "Verificar bug em script desenvolvido.",
        "Confirmar metas citadas em fonte escrita."
    ],
    "links_relacionados": [
        "19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-10 - 14-46.md",
        "19 - Reuniões/03 - PDFs/Weeklies/Weekly - Suporte - 2026-08-10 - 14-46.pdf"
    ],
    "status": "Preparado para revisão manual"
}


def markdown_to_html(md: str) -> str:
    lines = md.splitlines()
    body = []
    in_ul = False
    in_table = False
    table_lines = []
    in_frontmatter = False
    first_line = True

    def flush_ul():
        nonlocal in_ul
        if in_ul:
            body.append("</ul>")
            in_ul = False

    def flush_table():
        nonlocal in_table, table_lines
        if not in_table:
            return
        headers = [cell.strip() for cell in table_lines[0].strip("|").split("|")]
        rows = table_lines[2:]
        body.append("<table><thead><tr>" + "".join(f"<th>{html.escape(h)}</th>" for h in headers) + "</tr></thead><tbody>")
        for row in rows:
            cells = [cell.strip() for cell in row.strip("|").split("|")]
            body.append("<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in cells) + "</tr>")
        body.append("</tbody></table>")
        in_table = False
        table_lines = []

    for line in lines:
        if first_line and line.strip() == "---":
            in_frontmatter = True
            first_line = False
            continue
        first_line = False
        if in_frontmatter:
            if line.strip() == "---":
                in_frontmatter = False
            continue
        if line.startswith("|"):
            flush_ul()
            in_table = True
            table_lines.append(line)
            continue
        flush_table()
        if not line.strip():
            flush_ul()
            continue
        if line.startswith("# "):
            flush_ul()
            body.append(f"<h1>{html.escape(line[2:].strip())}</h1>")
        elif line.startswith("## "):
            flush_ul()
            body.append(f"<h2>{html.escape(line[3:].strip())}</h2>")
        elif line.startswith("### "):
            flush_ul()
            body.append(f"<h3>{html.escape(line[4:].strip())}</h3>")
        elif line.startswith("- "):
            if not in_ul:
                body.append("<ul>")
                in_ul = True
            body.append(f"<li>{html.escape(line[2:].strip())}</li>")
        else:
            flush_ul()
            body.append(f"<p>{html.escape(line.strip())}</p>")
    flush_ul()
    flush_table()
    return "\n".join(body)


def make_html(md: str) -> str:
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>{html.escape(TITLE)}</title>
  <style>
    @page {{ size: A4; margin: 18mm; @bottom-center {{ content: "Uso interno · Página " counter(page) " de " counter(pages); font-family: Arial, sans-serif; font-size: 8pt; color: #64748b; }} }}
    body {{ font-family: Arial, sans-serif; color: #1f2937; font-size: 10.5pt; line-height: 1.45; }}
    h1 {{ font-size: 20pt; color: #0f3d62; margin: 0 0 18px; }}
    h2 {{ font-size: 13pt; color: #0f3d62; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; break-after: avoid; }}
    h3 {{ font-size: 11pt; margin: 12px 0 4px; break-after: avoid; }}
    ul {{ margin-top: 4px; padding-left: 20px; }}
    li {{ margin-bottom: 3px; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 6px; }}
    th, td {{ border: 1px solid #94a3b8; padding: 5px; text-align: left; vertical-align: top; }}
    th {{ background: #e2e8f0; color: #0f172a; }}
    tr {{ break-inside: avoid; }}
    p {{ margin: 6px 0; }}
    .classification {{ color: #64748b; font-size: 9pt; margin-bottom: 18px; }}
  </style>
</head>
<body>
  <div class="classification">Uso interno</div>
  {markdown_to_html(md)}
</body>
</html>
"""


def text_to_docx(text: str, path: Path) -> None:
    paragraphs = []
    for line in text.splitlines():
        if not line.strip() or line.strip() == "---":
            continue
        if line.startswith("|"):
            paragraphs.append(line)
            continue
        clean = re.sub(r"^#+\s*", "", line)
        clean = re.sub(r"^- \s*", "• ", clean)
        paragraphs.append(clean)

    body = "".join(
        f"<w:p><w:r><w:t xml:space=\"preserve\">{html.escape(p)}</w:t></w:r></w:p>"
        for p in paragraphs
    )
    document = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>{body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1021" w:right="1021" w:bottom="1021" w:left="1021" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body>
</w:document>"""
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""
    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types)
        docx.writestr("_rels/.rels", rels)
        docx.writestr("word/document.xml", document)


def main() -> None:
    FINAL_MD_DIR.mkdir(parents=True, exist_ok=True)
    FINAL_PDF_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    PAYLOADS.mkdir(parents=True, exist_ok=True)
    apoio = PROCESS / "apoio"
    apoio.mkdir(exist_ok=True)

    revised_path = REVIEW / f"{BASE} - Transcrição Revisada.md"
    final_md = FINAL_MD_DIR / f"{BASE}.md"
    final_docx = FINAL_MD_DIR / f"{BASE}.docx"
    html_path = PROCESS / f"{BASE}.html"

    revised_path.write_text(revised_transcript, encoding="utf-8")
    final_md.write_text(report_md, encoding="utf-8")
    html_path.write_text(make_html(report_md), encoding="utf-8")
    text_to_docx(report_md, final_docx)

    (apoio / "notas-de-revisao.md").write_text(notes_md, encoding="utf-8")
    (apoio / "arquivo-original.md").write_text(original_md, encoding="utf-8")
    (apoio / "metadados.md").write_text(original_md, encoding="utf-8")
    (apoio / "demandas-para-clickup.json").write_text(json.dumps(clickup_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (apoio / "reuniao-para-notion.json").write_text(json.dumps(notion_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PAYLOADS / "weekly-suporte-2026-08-10-14-46.notion.json").write_text(json.dumps(notion_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PAYLOADS / "weekly-suporte-2026-08-10-14-46.clickup.json").write_text(json.dumps(clickup_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    raw_base = PROCESS / BASE
    copy_map = {
        raw_base.with_suffix(".txt"): apoio / "transcricao-bruta.txt",
        raw_base.with_name(BASE + " - com tempos.txt"): apoio / "transcricao-com-tempos.txt",
        raw_base.with_suffix(".srt"): apoio / "transcricao-com-tempos.srt",
        raw_base.with_suffix(".json"): apoio / "transcricao-estruturada.json",
    }
    for src, dst in copy_map.items():
        if src.exists():
            shutil.copy2(src, dst)
    if raw_base.with_suffix(".txt").exists():
        shutil.copy2(raw_base.with_suffix(".txt"), ORIGINALS / f"{BASE} - Transcrição Faster Whisper.txt")

    dry_run = {
        "status": "validado_localmente",
        "apply_executado": False,
        "notion_enviado": False,
        "clickup_criado": False,
        "notion_campos_obrigatorios": sorted(notion_payload.keys()),
        "clickup_quantidade_tarefas": len(clickup_payload["tarefas"]),
        "observacao": "Dry-run local: JSON parseado, campos obrigatórios conferidos e nenhum script com --apply executado."
    }
    (apoio / "dry-run-validacao.json").write_text(json.dumps(dry_run, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(final_md)
    print(final_docx)
    print(html_path)
    print(revised_path)


if __name__ == "__main__":
    main()
