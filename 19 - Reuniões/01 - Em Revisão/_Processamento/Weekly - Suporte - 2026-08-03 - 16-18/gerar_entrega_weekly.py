import html
import json
import re
import shutil
import zipfile
from pathlib import Path


ROOT = Path("/home/vinicius-alves/Viny Brain")
PROCESS = ROOT / "19 - Reuniões/01 - Em Revisão/_Processamento/Weekly - Suporte - 2026-08-03 - 16-18"
REVIEW = ROOT / "19 - Reuniões/01 - Em Revisão"
FINAL_MD_DIR = ROOT / "19 - Reuniões/02 - Reuniões Formatadas/Weeklies"
FINAL_PDF_DIR = ROOT / "19 - Reuniões/03 - PDFs/Weeklies"
ORIGINALS = ROOT / "19 - Reuniões/04 - Transcrições Originais"
PAYLOADS = ROOT / "18 - Integrações/API/payloads"

BASE = "Weekly - Suporte - 2026-08-03 - 16-18"
TITLE = "Weekly — Equipe de Suporte — 03/08/2026"


revised_transcript = """# Transcrição revisada — Weekly Suporte — 03/08/2026

Arquivo original: `/home/vinicius-alves/Vídeos/Reunioes/2026-08-03 16-18-00.mkv`
Tipo: Weekly
Horário de início aproximado: 16:18
Duração: 20min05s
Modelo final utilizado: faster-whisper/small int8 CPU

## Participantes

- Participante principal não identificado: conduziu a apresentação e explicou os novos processos.
- Gabriel: citado como responsável por tickets de N3 e também por demandas de N2 quando necessário.
- Alves: citado como responsável por N2, N3/Stack Linux e escala de grupos.
- Fael/Rafael: citado como responsável por N2 e escala de grupos; a transcrição alternou entre os nomes.
- Matheus: citado como N1 e futuro participante da escala de grupos quando estiver preparado.
- Vinny, Luiz e Nico: citados como pessoas que também podem registrar ou considerar pontos de avaliação.

## Transcrição revisada com tempos aproximados

[00:00:00 - 00:00:30] [trecho incerto]. Há ruído inicial e ajustes de áudio. Um participante pede para baixar um pouco o som. Em seguida, o apresentador informa que resolveu e vai compartilhar a tela.

[00:00:30 - 00:01:15] O apresentador informa que vai mostrar novidades para a equipe de suporte. Ele explica que foi criada uma ferramenta nova aplicada ao Zendesk, para facilitar a localização de contas, a listagem de serviços e a escalada de tickets.

[00:01:15 - 00:02:21] A ferramenta é apresentada como WHMCS Finder [transcrição bruta registrou variações como “WMCS/BMCS Finder”]. Ela permite abrir a conta do cliente, listar serviços, executar ações rápidas e fazer a escalada de atendimento sem que a equipe precise procurar manualmente tickets e rodar comandos.

[00:02:21 - 00:03:05] O apresentador informa que a equipe vai parar de usar o PIN como ferramenta de identificação do cliente e passará a usar o e-mail. A maioria das contas já deve vir com e-mail atrelado, mas algumas contas ainda não estarão vinculadas. Nesses casos, o atendente deverá pedir o e-mail ao cliente e vincular a conta para facilitar atendimentos futuros.

[00:03:16 - 00:03:48] Um participante pergunta como será feita a vinculação da conta. O apresentador responde que o processo é simples: o atendente deve pegar o e-mail do cliente, inserir na ferramenta quando a conta não aparecer vinculada, e a ferramenta buscará a conta relacionada.

[00:03:51 - 00:05:35] O apresentador explica que o suporte passará a ser dividido por níveis. Chat e WhatsApp ficam como linha de frente. Quando o cliente não conseguir resolver ou quando a demanda exigir ticket, o atendimento deverá ser escalado tecnicamente. Se o caso não puder ser resolvido no nível atual, a escalada deverá ir para N3. Toda escalada deve ser precedida por investigação documentada, para evitar retrabalho e repetição de processo.

[00:05:35 - 00:06:24] O fluxo resumido é: se não resolveu no chat, escalar para ticket; se N2 não resolver, escalar para N3. A equipe deve depois consultar o ticket ou pedir feedback para aprender como o caso foi resolvido. O objetivo é fazer o ciclo de suporte girar melhor e evitar tickets parados em fila ou em mãos específicas.

[00:06:24 - 00:08:25] O apresentador mostra os dados obrigatórios para escalada: produto, tipo de demanda, IP quando for VPS, domínio quando for hospedagem, serviço do cliente, título da demanda, investigação realizada, testes executados, anexos, prints e logs quando existirem. Ele reforça que o título da demanda aparece para o cliente e deve ser escrito com cuidado. Também compara um exemplo ruim, com descrição vazia, e um exemplo adequado, com erro, serviço, domínio, investigação, anexos e logs.

[00:08:25 - 00:09:47] São definidas regras de encerramento do dia e pausas. Ninguém deve encerrar o dia com ticket preso na própria demanda ou “em atendimento”. Caso o ticket não possa ser resolvido antes de sair ou antes do almoço, ele deve ser devolvido para a fila correta, seja N1, N2 ou N3. O apresentador reforça que a equipe deve permanecer online durante o dia para receber demandas.

[00:09:47 - 00:10:51] O apresentador aponta um problema atual: a equipe tende a escolher demandas mais simples e deixar as demandas complexas para depois, como migrações longas. A orientação é pegar o ticket, investigar e escalar quando necessário, mesmo que o atendente não saiba executar uma migração por SSH. Ele informa que N3 cai para Gabriel, N2 fica com Alves e Fael, e N1 com Matheus. Quando não houver demanda de N3, tickets de N2 também podem passar para Gabriel, se necessário.

[00:10:55 - 00:11:58] O apresentador pergunta se há dúvidas e reforça outra mudança importante: a equipe vai parar de usar o grupo de WhatsApp para acionar uns aos outros em demandas internas. A comunicação importante passa a acontecer no Slack, especialmente em uma sala de suporte N1. O WhatsApp fica para falar com clientes e conversas informais, não para passar demanda operacional.

[00:11:58 - 00:13:30] O apresentador trata dos grupos de WhatsApp de clientes. Ele relata que grupos estavam ficando sem resposta por muito tempo, gerando insatisfação, e diz que não considera isso culpa individual. A partir de agora, cada pessoa terá um dia da semana para acompanhar os grupos de suporte. A escala definida foi: segunda-feira, Alves; terça-feira, Gabriel; quarta-feira, Fael; quinta-feira, Alves; sexta-feira, Rafael; sábado, quem estiver de plantão; domingo, quem estiver de sobreaviso. Quando Matheus estiver preparado, um dia de Rafael será transferido para ele.

[00:13:30 - 00:15:05] O apresentador apresenta KPIs por nível. Para N1, a transcrição indica meta de 400 tickets no mês, CSAT de 98, tempo médio de resolução de 40 minutos e QA de 88. Para N2, a transcrição indica 300 tickets, CSAT de 96, FCR de 65 e QA de 88. Fael/Rafael, por estar em transição de N1 para N2, pode considerar métricas de N2. Para N3 e Stack Linux, Gabriel e Alves terão métricas de N3; o volume esperado é menor por envolver demandas mais complexas. O tempo médio de resolução foi citado como 2 horas, com observação de que a média atual de tickets N3 estaria em torno de 2h10.

[00:15:05 - 00:17:07] O apresentador define que pelo menos 3 dos 4 KPIs precisam ser batidos para validar as metas mensais. Ele afirma que, pela consistência recente da equipe, espera que todos consigam bater os indicadores. Também informa que convidou a equipe para o dashboard do Stack [trecho incerto] para acompanhar os KPIs individuais diariamente. O acompanhamento das métricas impacta a meta, a matriz, promoções e bônus.

[00:17:07 - 00:18:07] O apresentador informa que enviará a apresentação para que todos leiam com calma e reforça que ficará à disposição no Slack para dúvidas. Ele menciona que atitudes específicas, como uma semana de forte atuação em tickets ou o cuidado para não deixar clientes sem resposta, poderão gerar pontuação positiva e impactar a matriz. O mesmo vale para impactos negativos. A análise será feita a cada seis meses, considerando desempenho e cultura.

[00:18:07 - 00:19:40] Um participante pergunta sobre a análise e a contagem desses pontos. O apresentador esclarece que a avaliação será baseada no conjunto, não em um deslize isolado. Se houver um grupo sem resposta, a orientação é avisar a pessoa responsável, pedir que responda ou que acione alguém. Se a pessoa estiver com muita demanda, deve comunicar e pedir apoio. O apresentador reforça que ações terão reações e que bom atendimento ao cliente será recompensado, enquanto atendimento muito ruim terá consequência.

[00:19:40 - 00:20:05] O apresentador pergunta se ficaram dúvidas. Um participante responde negativamente. O apresentador informa que enviará a apresentação e que todos podem mandar mensagem em caso de dúvida. Também pede que aceitem os convites enviados por e-mail para o dashboard.
"""


report_md = """---
tipo: Weekly
status: concluído
data: 2026-08-03
horario: "16:18"
equipe: Suporte
participantes:
  - Participante principal não identificado
  - Gabriel
  - Alves
  - Fael/Rafael
  - Matheus
responsavel_registro: Vinicius
classificacao: Uso interno
pdf_gerado: sim
---

# Weekly — Equipe de Suporte — 03/08/2026

## Informações da reunião

- Tipo: Weekly
- Data: 03/08/2026
- Horário: 16:18
- Duração: 20min05s
- Equipe: Suporte
- Participantes identificados ou citados: Participante principal não identificado, Gabriel, Alves, Fael/Rafael e Matheus
- Responsável pelo relatório: Vinicius
- Classificação: Uso interno

## Resumo executivo

A Weekly foi conduzida como apresentação de mudanças no processo de suporte. O foco principal foi a adoção do WHMCS Finder no Zendesk, a substituição do PIN pelo e-mail como identificador do cliente, a organização do suporte por níveis, a melhoria da escalada de tickets, a definição de uso do Slack para comunicação interna e a criação de escala para acompanhamento dos grupos de WhatsApp de clientes.

Também foram apresentados KPIs por nível de suporte e uma regra de validação das metas mensais: cada pessoa deverá atingir pelo menos 3 dos 4 indicadores aplicáveis. A equipe receberá a apresentação e deverá aceitar os convites para acompanhar os indicadores no dashboard.

## Principais atualizações

### WHMCS Finder

- Foi apresentada uma ferramenta nova integrada ao Zendesk, chamada WHMCS Finder.
- A ferramenta permite localizar conta do cliente, listar serviços, acessar ações rápidas e facilitar a escalada de tickets.
- A equipe deverá deixar de usar o PIN como principal ferramenta de identificação do cliente.
- O e-mail passará a ser a referência para localizar ou vincular a conta do cliente.

### Fluxo de suporte por níveis

- Chat e WhatsApp ficam como linha de frente.
- Demandas que não forem resolvidas ou que exigirem continuidade técnica devem ser escaladas para ticket.
- Casos não resolvidos no nível atual devem seguir para N3.
- Toda escalada deve conter investigação prévia e informações suficientes para evitar retrabalho.

### Comunicação interna

- O grupo de WhatsApp deixa de ser o canal principal para acionar pessoas em demandas operacionais.
- O Slack passa a ser o canal recomendado para repasses, dúvidas e acionamentos internos.
- O WhatsApp permanece para comunicação com clientes e conversas informais.

### Grupos de WhatsApp de clientes

- Foi identificado risco de grupos de clientes ficarem sem resposta por longos períodos.
- Cada pessoa terá um dia da semana para acompanhar os grupos de suporte.
- A escala definida na reunião foi: segunda-feira, Alves; terça-feira, Gabriel; quarta-feira, Fael; quinta-feira, Alves; sexta-feira, Rafael; sábado, plantonista; domingo, sobreaviso.
- Quando Matheus estiver preparado, um dia atualmente atribuído a Rafael deverá ser transferido para ele.

## Resultados e entregas mencionados

- WHMCS Finder criado e apresentado para uso da equipe.
- Sala ou grupo de suporte N1 no Slack criado para comunicação interna.
- Dashboard de KPIs disponibilizado por convite aos e-mails corporativos.
- Apresentação da Weekly será enviada à equipe para consulta.

## Problemas e bloqueios

| Problema | Impacto | Responsável | Ação esperada | Status |
|---|---|---|---|---|
| Algumas contas podem não estar vinculadas ao e-mail do cliente | Atendimento pode exigir busca manual ou vinculação durante o contato | Equipe de Suporte | Solicitar e-mail e vincular a conta quando necessário | Em andamento |
| Escaladas chegam sem investigação suficiente | Retrabalho para N2/N3 e maior tempo de resolução | Equipe de Suporte | Documentar investigação, testes, produto, serviço, domínio/IP, anexos e logs | A iniciar |
| Tickets podem ficar presos em demandas individuais | Risco de fila parada e cliente sem retorno | Equipe de Suporte | Devolver para a fila correta antes de sair ou pausar | A iniciar |
| Demandas complexas tendem a ser deixadas para depois | Migrações e casos técnicos podem atrasar | Equipe de Suporte | Investigar e escalar para o nível correto quando não souber resolver | A iniciar |
| Grupos de WhatsApp de clientes ficam sem resposta | Insatisfação do cliente e perda de acompanhamento | Escala semanal definida | Monitorar grupos no dia atribuído e acionar apoio quando necessário | A iniciar |

## Decisões tomadas

| Decisão | Contexto | Responsável | Impacto | Prazo |
|---|---|---|---|---|
| Usar o WHMCS Finder no Zendesk para localizar contas, listar serviços e facilitar escaladas | Ferramenta nova apresentada à equipe | Equipe de Suporte | Reduz busca manual e padroniza escalada | A definir |
| Substituir o PIN pelo e-mail como identificador principal do cliente | Processo de identificação e vínculo de contas | Equipe de Suporte | Facilita localização futura das contas | A definir |
| Organizar o suporte por níveis N1, N2 e N3 | Necessidade de direcionar corretamente chats, tickets e casos técnicos | Equipe de Suporte | Melhora fluxo de atendimento e reduz filas paradas | A definir |
| Exigir investigação documentada antes de escalada | Tickets estavam chegando com informação insuficiente | Equipe de Suporte | Reduz retrabalho e melhora continuidade do atendimento | A definir |
| Não encerrar dia ou pausa com ticket preso na própria fila pessoal | Evitar tickets parados sem resposta | Equipe de Suporte | Tickets devem voltar para N1, N2 ou N3 conforme o caso | A definir |
| Usar Slack para repasses e acionamentos internos de demanda | WhatsApp interno estava sendo usado para operação | Equipe de Suporte | Centraliza comunicação operacional | A definir |
| Definir escala semanal para acompanhar grupos de WhatsApp de clientes | Grupos estavam ficando sem resposta | Alves, Gabriel, Fael/Rafael, plantonistas e sobreavisos | Evita falta de resposta nos grupos | A partir da semana da reunião |
| Atingir pelo menos 3 de 4 KPIs para validar metas mensais | Criação de métricas por nível de suporte | Equipe de Suporte | Conecta desempenho, metas, matriz, promoções e bônus | Mensal |
| Considerar desempenho e cultura na análise semestral | Pontuação positiva ou negativa por comportamento e atendimento | Liderança | Impacta avaliação individual e plano de crescimento | Semestral |

## Plano de ação

| Ação | Responsável | Prazo | Prioridade | Status | Dependência |
|---|---|---|---|---|---|
| Enviar a apresentação da Weekly para a equipe | Participante principal não identificado | A definir | Alta | Pendente | Material apresentado |
| Aceitar os convites do dashboard de KPIs | Equipe de Suporte | A definir | Alta | Pendente | Convites enviados por e-mail |
| Usar o WHMCS Finder nos atendimentos aplicáveis | Equipe de Suporte | A definir | Alta | A iniciar | Acesso à ferramenta no Zendesk |
| Solicitar e-mail do cliente quando a conta não estiver vinculada | Equipe de Suporte | Quando ocorrer | Alta | A iniciar | Cliente informar e-mail |
| Registrar investigação completa antes de escalar tickets | Equipe de Suporte | Quando ocorrer | Alta | A iniciar | Dados do atendimento |
| Devolver tickets não resolvidos para a fila correta antes de sair ou pausar | Equipe de Suporte | Diário | Alta | A iniciar | Filas N1/N2/N3 configuradas |
| Usar Slack para repasses operacionais internos | Equipe de Suporte | Imediato | Média | A iniciar | Sala de suporte no Slack |
| Monitorar grupos de WhatsApp no dia atribuído | Alves, Gabriel, Fael/Rafael, plantonista e sobreaviso | Semanal | Alta | A iniciar | Escala definida |
| Transferir um dia da escala para Matheus quando ele estiver preparado | Participante principal não identificado | Não definido | Média | Pendente | Matheus estar preparado |
| Acompanhar KPIs individuais diariamente | Equipe de Suporte | Diário | Média | Pendente | Dashboard acessível |
| Tirar dúvidas sobre o processo no Slack ou por mensagem | Equipe de Suporte | Quando necessário | Média | Em aberto | Apresentação enviada |

## Projetos, ferramentas e demandas citados

### WHMCS Finder

- Objetivo: facilitar localização de contas, listagem de serviços e escalada de tickets dentro do Zendesk.
- Contexto: reduzir busca manual, padronizar informações e evitar tickets incompletos.
- Envolvidos citados: equipe de suporte; Gabriel, Alves, Fael/Rafael e Matheus por nível ou escala.
- Decisões: usar e-mail como identificador principal e documentar escaladas.
- Dúvidas: não ficou registrado prazo formal de adoção nem responsável técnico pela manutenção da ferramenta.
- Próximos passos: enviar apresentação, aceitar convites do dashboard e iniciar uso do processo.

Novo projeto — aguardando sessão dedicada de planejamento.

## Pendências

- Confirmar o nome correto do apresentador principal.
- Confirmar se “Fael” e “Rafael” se referem à mesma pessoa ou a pessoas diferentes na escala.
- Confirmar o nome exato do dashboard citado como “Stack” ou “Stack Linux” na transcrição.
- Confirmar formalmente os KPIs de N1, N2 e N3 em fonte escrita, pois a transcrição teve trechos incertos.
- Confirmar o prazo de início obrigatório do novo fluxo.

## Pontos para a próxima Weekly

- Validar se a equipe conseguiu usar o WHMCS Finder nos atendimentos.
- Verificar se as escaladas passaram a chegar com investigação completa.
- Conferir se os grupos de WhatsApp ficaram cobertos pela escala.
- Revisar dúvidas sobre KPIs e dashboard.
- Confirmar se Matheus já pode entrar na escala de acompanhamento de grupos.

## Conclusão

A reunião formalizou uma mudança relevante no modelo operacional do suporte. O processo passa a depender de identificação por e-mail, uso do WHMCS Finder, escalada documentada por níveis, comunicação interna pelo Slack, acompanhamento estruturado dos grupos de WhatsApp e gestão por KPIs. Não foram definidos prazos exatos para todas as ações, portanto os itens sem prazo explícito permanecem como “A definir” ou “Não definido”.
"""


notes_md = """# Notas de revisão — Weekly Suporte — 03/08/2026

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
"""


original_md = """# Arquivo original — Weekly Suporte — 03/08/2026

- Caminho: `/home/vinicius-alves/Vídeos/Reunioes/2026-08-03 16-18-00.mkv`
- Tipo informado: Weekly
- Data da reunião: 2026-08-03
- Horário aproximado: 16:18
- Formato: Matroska/WebM (`.mkv`)
- Streams: vídeo H.264 e áudio AAC
- Duração: 1205,566s
- Tamanho: 928888179 bytes
- Observação: o arquivo original não foi copiado para dentro do vault para evitar duplicar 886 MB; a referência preserva o caminho local validado.
"""


clickup_payload = {
    "modo": "lote_simples",
    "dry_run": True,
    "origem": "Weekly - Suporte - 2026-08-03 - 16-18",
    "tarefas": [
        {
            "nome": "Enviar apresentação da Weekly de suporte",
            "descricao": "Enviar para a equipe a apresentação usada na Weekly de 03/08/2026.",
            "responsavel": "Participante principal não identificado",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "suporte"],
            "checklist": ["Localizar apresentação", "Enviar para a equipe", "Confirmar recebimento"],
            "criterio_conclusao": "Apresentação enviada e disponível para consulta da equipe.",
            "origem": "Weekly Suporte 2026-08-03",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Aceitar convites do dashboard de KPIs",
            "descricao": "Equipe deve aceitar os convites enviados por e-mail para acompanhar KPIs individuais.",
            "responsavel": "Equipe de Suporte",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "kpi"],
            "checklist": ["Abrir e-mail corporativo", "Aceitar convite", "Validar acesso ao dashboard"],
            "criterio_conclusao": "Equipe com acesso ao dashboard de KPIs.",
            "origem": "Weekly Suporte 2026-08-03",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Padronizar escalada de tickets com investigação completa",
            "descricao": "Aplicar o padrão de escalada com produto, tipo de demanda, IP/domínio quando aplicável, serviço, título, investigação, testes, anexos e logs.",
            "responsavel": "Equipe de Suporte",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "suporte", "processo"],
            "checklist": ["Revisar campos obrigatórios", "Aplicar em escaladas", "Revisar qualidade dos tickets escalados"],
            "criterio_conclusao": "Tickets escalados com informação suficiente para N2/N3.",
            "origem": "Weekly Suporte 2026-08-03",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Implantar escala de acompanhamento dos grupos de WhatsApp",
            "descricao": "Acompanhar grupos de suporte por dia da semana conforme definido na Weekly.",
            "responsavel": "Equipe de Suporte",
            "prioridade": "Alta",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "whatsapp", "suporte"],
            "checklist": ["Confirmar escala", "Monitorar grupos no dia atribuído", "Acionar apoio quando estiver com muita demanda"],
            "criterio_conclusao": "Grupos de clientes monitorados sem longos períodos sem resposta.",
            "origem": "Weekly Suporte 2026-08-03",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        },
        {
            "nome": "Usar Slack para repasses operacionais internos",
            "descricao": "Migrar repasses e acionamentos internos de demanda para o Slack, mantendo WhatsApp para clientes e conversas informais.",
            "responsavel": "Equipe de Suporte",
            "prioridade": "Média",
            "status_inicial": "Pendente",
            "prazo": "A definir",
            "tags": ["viny-brain", "weekly", "slack", "suporte"],
            "checklist": ["Confirmar sala de suporte", "Fazer repasses no Slack", "Evitar repasses operacionais pelo WhatsApp interno"],
            "criterio_conclusao": "Repasses operacionais concentrados no Slack.",
            "origem": "Weekly Suporte 2026-08-03",
            "observacoes_internas": "Preparado apenas para revisão manual; não aplicar sem autorização."
        }
    ]
}


notion_payload = {
    "titulo": "Weekly - Suporte - 2026-08-03 - 16:18",
    "data": "2026-08-03",
    "participantes": ["Participante principal não identificado", "Gabriel", "Alves", "Fael/Rafael", "Matheus"],
    "contexto": "Weekly de suporte sobre WHMCS Finder, escalada por níveis, Slack, escala de WhatsApp e KPIs.",
    "resumo_executivo": "A reunião formalizou mudanças no processo de suporte, incluindo uso do WHMCS Finder, identificação por e-mail, escalada documentada, comunicação interna pelo Slack, escala de grupos de WhatsApp e acompanhamento por KPIs.",
    "pontos_discutidos": [
        "WHMCS Finder integrado ao Zendesk.",
        "Substituição do PIN pelo e-mail como identificador principal.",
        "Fluxo de suporte por N1, N2 e N3.",
        "Campos obrigatórios para escalada de tickets.",
        "Regras para devolver tickets à fila antes de sair ou pausar.",
        "Uso do Slack para repasses internos.",
        "Escala semanal para grupos de WhatsApp de clientes.",
        "KPIs por nível e regra de 3 de 4 indicadores."
    ],
    "decisoes": [
        "Usar WHMCS Finder no Zendesk.",
        "Usar e-mail como identificador principal do cliente.",
        "Escalar tickets com investigação documentada.",
        "Não deixar tickets presos na fila individual ao encerrar dia ou pausa.",
        "Usar Slack para repasses operacionais internos.",
        "Adotar escala semanal para acompanhamento dos grupos de WhatsApp.",
        "Validar metas mensais com pelo menos 3 de 4 KPIs."
    ],
    "pendencias": [
        {"descricao": "Confirmar nome do apresentador principal.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar se Fael e Rafael são a mesma pessoa no contexto da escala.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar KPIs em fonte escrita.", "responsavel": "A definir", "prazo": "A definir"},
        {"descricao": "Confirmar prazo de início obrigatório do novo fluxo.", "responsavel": "A definir", "prazo": "A definir"}
    ],
    "proximos_passos": [
        "Enviar apresentação da Weekly.",
        "Aceitar convites do dashboard.",
        "Aplicar padrão de escalada documentada.",
        "Monitorar grupos de WhatsApp conforme escala.",
        "Levar dúvidas para o Slack."
    ],
    "links_relacionados": [
        "19 - Reuniões/02 - Reuniões Formatadas/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.md",
        "19 - Reuniões/03 - PDFs/Weeklies/Weekly - Suporte - 2026-08-03 - 16-18.pdf"
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
    (apoio / "demandas-para-clickup.json").write_text(json.dumps(clickup_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (apoio / "reuniao-para-notion.json").write_text(json.dumps(notion_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PAYLOADS / "weekly-suporte-2026-08-03-16-18.notion.json").write_text(json.dumps(notion_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PAYLOADS / "weekly-suporte-2026-08-03-16-18.clickup.json").write_text(json.dumps(clickup_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

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
