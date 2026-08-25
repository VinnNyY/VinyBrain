# Transcrição revisada — Weekly Suporte — 03/08/2026

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
