# Comandos Reutilizaveis

Aqui ficam prompts curtos e repetiveis para o Codex CLI.

## Modelos base

- **Abertura**: `Leia os arquivos de contexto e diga o objetivo da sessao em uma frase.`
- **Analise**: `Leia estes arquivos e devolva diagnostico, riscos e pontos de atencao.`
- **Revisao**: `Revise este material para clareza, consistencia e alinhamento com o Viny Flow.`
- **Fechamento**: `Consolide o resultado com o que foi feito, o que ficou pendente e o proximo passo.`
- **Checkpoint**: `Registre um checkpoint curto com objetivo, ultima entrega e proximo passo.`
- **Mudanca de escopo**: `O objetivo mudou. Reorganize o fluxo antes de continuar.`
- **Retomada**: `Retome a sessao a partir do checkpoint mais recente e da pendencia atual.`
- **Formatar reuniao de suporte**: `Leia uma transcricao bruta de Daily ou Weekly do suporte, preserve o original em 19 - Reuniões/04 - Transcrições Originais/, formalize o texto, crie a revisão em 01 - Em Revisão/, gere Markdown final e PDF validado nas subpastas corretas, sem inventar dados.`

## /auditar-contexto

- **Quando usar**: antes de tarefas grandes, quando houver risco de contexto misturado ou dúvida sobre a fonte de verdade.
- **O que faz**: valida objetivo, arquivos-base, conflitos, checkpoint, histórico e risco antes de qualquer alteração.
- **Prompt para copiar**: `Siga o workflow Auditar Contexto. Leia o checkpoint, o histórico e os arquivos-base da tarefa, separe fonte de verdade de referência, identifique conflitos e riscos, e diga se o escopo está pronto para execução sem mexer em nada ainda.`
- **Workflows acionados**: `Auditar Contexto`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`
- **Saídas esperadas**:
  - `Tarefa ativa`: objetivo, tipo da tarefa, status e escopo;
  - `Fontes de verdade`: arquivos que devem ser lidos, arquivos que não devem ser usados como fonte principal e possíveis conflitos de contexto;
  - `Permissões da tarefa`: o que pode alterar, o que não pode alterar, se pode criar arquivos e se pode atualizar histórico/checkpoint;
  - `Riscos`: credenciais, dados sensíveis, WordPress, Notion, ClickUp, APIs, scripts, instalações e alterações fora do vault;
  - `Plano seguro`: primeiro passo, workflow recomendado, agentes envolvidos, se precisa de Quality Gate e se precisa de Revisão de Segurança;
  - `Decisão`: pode seguir, seguir com restrições ou não seguir antes de esclarecer.

## /quality-gate

- **Quando usar**: no encerramento de tarefas grandes ou quando a entrega parecer pronta, mas ainda precise validação final.
- **O que faz**: confere objetivo inicial, arquivos alterados, segurança, índices, histórico, checkpoint e pendências.
- **Prompt para copiar**: `Siga o workflow Quality Gate - Validar Entrega. Leia o objetivo inicial, revise os arquivos criados e alterados, confira segurança, histórico, checkpoint, índices e pendências, e diga se a entrega está finalizada ou apenas parcial.`
- **Workflows acionados**: `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`

## /publicar-tutorial-staycloud

- **Quando usar**: somente depois que um tutorial StayCloud V2 estiver validado localmente e Vinicius responder exatamente `APROVADO PARA PUBLICAR`.
- **O que faz**: executa a publicação controlada no BetterDocs, com upload dos prints finais sanitizados, URLs públicas, HTML sem H1 duplicado, Rank Math validado antes da publicação, categoria, publicação e validação pública.
- **Regra máxima**: nenhum novo tutorial do Painel Novo pode ser produzido ou publicado em lote enquanto o padrão visual não estiver estabilizado. A autorização vale somente para o tutorial informado.
- **Entrada obrigatória**:
  - caminho da pasta do tutorial;
  - confirmação explícita `APROVADO PARA PUBLICAR`;
  - categoria desejada, quando diferente de `Painel novo`;
  - indicação se é artigo novo ou atualização de artigo existente.
- **Prompt para copiar**: `Siga o workflow Publicar Tutorial StayCloud. Pasta do tutorial: [CAMINHO]. Confirmação: [APROVADO PARA PUBLICAR]. Categoria: [Painel novo ou categoria explicitamente informada]. Tipo: [artigo novo ou atualização de artigo existente]. Antes de acessar o WordPress, rode o Quality Gate local; se qualquer item falhar, não acesse o WordPress e informe exatamente a pendência. Se aprovado, verifique duplicação no BetterDocs, suba somente prints-finais sanitizados, recupere URLs públicas diretas, atualize o HTML, crie ou atualize somente o documento autorizado, salve como rascunho, preencha Rank Math, pressione Enter na palavra-chave quando necessário, confirme visualmente o chip ativo, preencha snippet, resumo, social e categoria, salve rascunho, aguarde o Rank Math recalcular, publique apenas com score real mínimo 80/100, valide a URL pública e atualize os registros locais sem salvar credenciais, cookies, tokens ou nonces.`
- **Workflows acionados**: `Publicar Tutorial StayCloud`, `Revisão de Segurança`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente WordPress`, `Agente Tutorial StayCloud`, `Agente SEO Rank Math`, `Agente Visual e Prints`, `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`
- **Regras obrigatórias**:
  - não publicar antes da frase exata `APROVADO PARA PUBLICAR`;
  - a autorização vale somente para a pasta informada;
  - categoria padrão é `Painel novo`;
  - não criar slug com sufixo automático `-2` ou `-3`;
  - não criar duplicidade no BetterDocs;
  - não usar imagens fora de `prints-finais/`;
  - não clicar em `Publicar` antes de confirmar chip ativo da palavra-chave;
  - não clicar em `Publicar` antes de preencher e salvar snippet, resumo, social e categoria;
  - não clicar em `Publicar` antes do Rank Math recalcular score real mínimo 80/100;
  - não salvar credenciais, cookies, tokens ou nonces;
  - não atualizar outro artigo sem autorização clara.

## /criar-tutorial-staycloud-unitario

- **Quando usar**: para criar um único tutorial do Painel Novo depois da reprovação de lote por marcações visuais.
- **O que faz**: audita duplicação, valida fluxo real, cria texto, planeja prints, captura e sanitiza imagens, marca um alvo principal por print, abre preview e para para validação de Vinicius.
- **Prompt para copiar**: `Siga o workflow Criar Tutorial StayCloud em modo unitário. Crie somente um tutorial. Antes de criar, audite duplicação na categoria pública e no Viny Brain. Valide o fluxo real. Crie Plano de Prints antes das imagens. Cada print deve ter um alvo principal e passar pela regra texto do passo -> elemento marcado -> resultado exibido no passo seguinte. Abra o preview e pare para validação de Vinicius. Não faça upload, não crie BetterDocs, não publique e não inicie outro tutorial.`
- **Regras obrigatórias**:
  - não produzir lote;
  - não iniciar segundo tutorial;
  - não marcar botão próximo, banner, aviso financeiro, fatura, opção alternativa ou área de outro passo;
  - não cobrir o alvo principal com a marcação;
  - corrigir o mesmo tutorial até aprovação antes de seguir.

## /validar-uiux

- **Quando usar**: para revisar experiencia visual, clareza, fluxo e facilidade de execucao em tutoriais, prints, paginas de ajuda e jornadas do cliente.
- **O que faz**: valida clareza, ordem dos passos, prints, marcacoes visuais, friccao, alternativas de erro e orientacao ao cliente sem publicar nada.
- **Prompt para copiar**: `Atue como Agente UI/UX Experience. Revise este tutorial, pagina ou jornada do cliente e diga se a clareza, o fluxo, os prints e a experiencia estao aprovados, aprovados com ajustes ou reprovados, sem publicar e sem alterar o painel real.`
- **Workflows acionados**: `Criar Tutorial StayCloud`, `Revisar Tutorial StayCloud`
- **Agentes usados**: `Agente UI/UX Experience`, `Agente Tutorial StayCloud`, `Agente Visual e Prints`, `Agente Redator`, `Agente Auditor`, `Agente Segurança`
- **Saídas esperadas**:
  - `Status`: aprovado, aprovado com ajustes ou reprovado;
  - `Problemas`: friccoes, inconsistencias, passos confusos e riscos de leitura;
  - `Ajustes obrigatorios`: mudancas de texto, ordem, prints ou marcacoes;
  - `Sugestoes`: melhorias para clareza e atendimento;
  - `Risco`: impacto visual, experiencia ou suporte;
  - `Novo print`: dizer se precisa recapturar;
  - `Simplificacao`: dizer se o texto precisa ser reduzido;
  - `Decisao`: se pode seguir para revisao final.
- **Regras**:
  - revisar clareza;
  - revisar ordem dos passos;
  - revisar prints;
  - revisar marcações visuais;
  - apontar fricções;
  - sugerir melhoria;
  - aprovar, aprovar com ajustes ou reprovar;
  - nunca publicar;
  - nunca alterar painel real sem autorização.

## /seguranca

- **Quando usar**: quando houver credenciais, tokens, prints, URLs, logs, WordPress, Google Drive ou outro material com risco de exposição.
- **O que faz**: revisa segredos, dados de cliente, IPs, domínios sensíveis, comandos perigosos e histórico/checkpoint.
- **Prompt para copiar**: `Siga o workflow Revisão de Segurança. Revise estes arquivos e identifique credenciais, tokens, senhas, dados de cliente, IPs, domínios sensíveis, comandos perigosos, alterações fora do vault e riscos no histórico ou checkpoint, sem alterar os arquivos originais.`
- **Workflows acionados**: `Revisão de Segurança`
- **Agentes usados**: `Agente Segurança`, `Agente Auditor`, `Agente Memória/Checkpoint`

## /learn

- **Quando usar**: no fechamento da sessão, depois de decisões importantes ou quando houver aprendizados que valem virar memória operacional.
- **O que faz**: extrai decisões, padrões, correções, regras novas e próximos passos para histórico e checkpoint.
- **Prompt para copiar**: `Siga o workflow Extrair Aprendizados da Sessão. Leia o fechamento da sessão, identifique decisões, padrões, correções e próximos passos, atualize o histórico e o checkpoint, e não registre credenciais nem dados sensíveis.`
- **Workflows acionados**: `Extrair Aprendizados da Sessão`
- **Agentes usados**: `Agente Memória/Checkpoint`, `Agente Auditor`, `Agente Segurança`, `Agente Redator`

## /checkpoint

- **Quando usar**: quando houver mudança importante, fim de sessão ou retomada que precise ficar explícita.
- **O que faz**: consolida checkpoint curto e registro diário sem inflar o histórico.
- **Prompt para copiar**: `Atue como Agente Memória/Checkpoint. Consolide a sessão em checkpoint curto, atualize o histórico do dia e deixe explícitos pendências e próximo passo, sem registrar dados sensíveis.`
- **Workflows acionados**: `Fechamento de Sessão`, `Extrair Aprendizados da Sessão`
- **Agentes usados**: `Agente Memória/Checkpoint`, `Agente Auditor`, `Agente Redator`

## /auditar-viny-flow

- **Quando usar**: quando a estrutura do Viny Flow parecer crescer demais, duplicar regras ou ficar confusa.
- **O que faz**: revisa agentes, workflows, skills instaladas e duplicidades, e sugere limpeza ou fusão.
- **Prompt para copiar**: `Siga o workflow Auditar Skills, Agents e Workflows. Leia os mapas e a lista de skills instaladas, identifique duplicidades, lacunas, itens obsoletos e relações incoerentes, e devolva uma recomendação curta e objetiva sem alterar os arquivos originais.`
- **Workflows acionados**: `Auditar Skills, Agents e Workflows`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Redator`

## /auditar-governanca

- **Quando usar**: quando o vault crescer, antes de um checkpoint importante ou quando houver suspeita de desorganização estrutural.
- **O que faz**: audita organização, links, MOCs, tutoriais, playbooks, agentes, workflows e riscos de segurança, e devolve um relatório sem corrigir nada automaticamente.
- **Prompt para copiar**: `Siga o workflow Auditar Governança do Viny Brain. Verifique estrutura, links, MOCs, tutoriais, playbooks, agentes, workflows e riscos de segurança, gere um relatório com prioridades e não corrija nada sem aprovação.`
- **Workflows acionados**: `Auditar Governança do Viny Brain`
- **Agentes usados**: `Agente Governança do Viny Brain`, `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`
- **Saídas esperadas**:
  - `Status geral`: saudável, atenção ou crítico;
  - `Problemas encontrados`: arquivos fora do lugar, links quebrados, notas órfãs, áreas sem README, índices desatualizados e duplicações;
  - `Riscos de segurança`: credenciais, tokens, senhas, comandos perigosos e instruções sensíveis;
  - `Prioridades`: itens `P0`, `P1` e `P2`;
  - `Correções sugeridas`: lista de ajustes sem execução;
  - `Próximo passo`: ação segura e aprovações pendentes.
- **Regras**:
  - auditar estrutura;
  - auditar links;
  - auditar MOCs;
  - auditar tutoriais;
  - auditar playbooks;
  - auditar agentes e workflows;
  - auditar riscos de segurança;
  - gerar relatório;
  - não corrigir nada sem aprovação.

## /auditar-tutoriais-staycloud

- **Quando usar**: depois de ciclos grandes de criação, correção, reprovação, publicação ou mudança de workflow dos tutoriais StayCloud.
- **O que faz**: audita agentes, workflows, comandos, MOCs, fila, backlog, meta, pacotes V2, registros de publicação, aprendizados recentes, links internos e contradições do fluxo StayCloud.
- **Prompt para copiar**: `Siga os workflows Auditar Contexto, Auditar Governança do Viny Brain, Auditar Skills, Agents e Workflows e Quality Gate - Validar Entrega. Audite todo o ciclo recente dos tutoriais StayCloud, valide se os aprendizados viraram regras em agentes, workflows, comandos, checklists, MOCs e checkpoint, corrija apenas arquivos Markdown autorizados no Obsidian, gere o relatório geral e pare sem criar novo tutorial, sem publicar e sem tocar no WordPress.`
- **Workflows acionados**: `Auditar Contexto`, `Auditar Governança do Viny Brain`, `Auditar Skills, Agents e Workflows`, `Quality Gate - Validar Entrega`.
- **Agentes usados**: `Agente Auditor`, `Agente Governança do Viny Brain`, `Agente Tutorial StayCloud`, `Agente Visual e Prints`, `Agente UI UX Experience`, `Agente SEO Rank Math`, `Agente Segurança`, `Agente Memória/Checkpoint`.
- **Referências obrigatórias**:
  - `00 - Mapas/MOC - Tutoriais StayCloud`
  - `03 - Tutoriais/Fluxo Oficial - Criação e Publicação de Tutorial StayCloud`
  - `03 - Tutoriais/Padrão de Prints StayCloud`
  - `03 - Tutoriais/Checklist UI UX - Tutorial StayCloud`
  - `03 - Tutoriais/Checklist Final - Revisão antes do WordPress`
  - `03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo`
  - `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - ÍNDICE DOS TUTORIAIS`
  - `14 - Histórico Codex/Checkpoint Atual`
- **Regras obrigatórias**:
  - não publicar;
  - não acessar WordPress;
  - não acessar Painel StayCloud;
  - não registrar credenciais, cookies, tokens ou sessão;
  - não contar tutorial local, reprovado, descartado ou sem URL pública validada na meta;
  - marcar contradições entre documentos antigos e fluxo V2;
  - corrigir MOCs, agentes, workflows, comandos e checklists quando a correção for somente Markdown autorizada;
  - parar antes de iniciar novo tutorial.

## /processar-demanda

- **Quando usar**: quando chegar uma demanda solta e você quiser transformá-la em tarefa pronta para ClickUp, registro mínimo no Viny Brain, indicação de uso de Notion, checklist de segurança e pendências faltantes.
- **O que faz**: organiza a demanda bruta, separa o que vira ClickUp, o que fica no Viny Brain, se precisa ir para Notion e o que ainda falta validar.
- **Workflows acionados**: `Enviar Demanda para ClickUp`, `Auditar Integrações`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`
- **Prompt para copiar**: `Siga o workflow Enviar Demanda para ClickUp. Leia a demanda bruta, analise tipo da demanda, área afetada, urgência, impacto, esforço estimado, dependências e riscos, decida se deve virar tarefa, documentação ou decisão no Viny Brain, gere a saída pronta para ClickUp, registre o mínimo no Viny Brain, diga se também deve ir para Notion e valide segurança, sem conectar APIs, sem criar nada automaticamente e sem registrar credenciais.`
- **Modelo de entrada bruta**:

```txt
Origem:
Solicitante:
Contexto:
Demanda:
Prazo desejado:
Responsável sugerido:
Prioridade percebida:
Observações:
```

- **Saídas esperadas**:
  - `ClickUp`: nome da tarefa, descrição, responsável, prioridade, status inicial, prazo, tags sugeridas, checklist, critério de conclusão, origem, observações internas;
  - `Viny Brain`: demanda, decisão, motivo, responsável, status, próximo passo, link da tarefa, se existir depois;
  - `Notion`: dizer se precisa ou não ir para Notion e por quê;
  - `Segurança`: validar senha, token, dados sensíveis, acesso interno, print sensível e link privado;
  - `Pendências`: listar informações que faltam.

- **Saída JSON para integração real**:
  - gerar também um JSON compatível com `18 - Integrações/API/scripts/create_clickup_task_from_json.py`;
  - manter apenas dados fictícios ou aprovados na saída estruturada;
  - nunca incluir token, credencial ou segredo;
  - o JSON deve poder ser usado como ponte entre o `Viny Flow` e o `ClickUp`.
- **Orientação prática**:
  1. Gerar a saída normal em texto.
  2. Gerar também o JSON compatível com os scripts.
  3. Salvar o JSON em `18 - Integrações/API/payloads/`.
  4. Rodar o script em `dry-run`.
  5. Aplicar com `--apply` somente se o usuário confirmar.

- **Modo inteligente de captura**:
  - Quando a demanda vier incompleta, avaliar o que falta antes de gerar o JSON final.
  - Campos importantes: o que precisa ser feito, responsável, prazo, prioridade, se é anotação simples ou tarefa detalhada, se precisa ir para Notion ou apenas ClickUp, e se existe risco, bloqueio ou dependência.
  - Se faltar algo crítico, perguntar antes de gerar o JSON final.
  - Fazer no máximo 3 perguntas por vez.
  - Se a demanda for simples, não complicar.
  - Se o texto disser `só anota`, `coloca na lista` ou `bem simples`, criar tarefa mínima.
  - Se o texto disser `detalha`, `cria checklist` ou `vira demanda completa`, criar tarefa detalhada.

- **Modo lista simples**:
  - Usar quando eu quiser apenas registrar algo no ClickUp como lista de afazeres.
  - Exemplo:

```txt
/processar-demanda
Só anota no ClickUp:
revisar prints do tutorial de acesso ao cPanel
```

  - Saída esperada:

```txt
Nome da tarefa:
Revisar prints do tutorial de acesso ao cPanel

Descrição:
Registro rápido criado a partir do Viny Brain.

Responsável:
A definir

Prioridade:
Média

Prazo:
A definir

Status:
Pendente

Checklist:
- Revisar prints
- Ajustar se necessário
- Marcar como concluído
```

- **Regra de perguntas**:
  - Se faltar prazo, perguntar: `Para qual dia você quer isso?`
  - Se faltar responsável, perguntar: `Quem deve ficar responsável?`
  - Se faltar prioridade, perguntar: `Qual a prioridade: baixa, média, alta ou urgente?`
  - Se faltar nível de detalhamento, perguntar: `Isso é só para anotar no ClickUp ou precisa virar uma tarefa detalhada?`
  - Se houver dúvida sobre dependência, perguntar: `Tem alguma dependência ou bloqueio?`
  - Se houver dúvida sobre documentação, perguntar: `Precisa documentar no Notion também ou só ClickUp?`

- **Regra final**:
  - Nunca inventar prazo, responsável ou prioridade.
  - Nunca mandar para Notion se for só anotação simples.
  - Sempre revisar antes de gerar o JSON final.
  - Se um JSON em lote já foi aplicado com sucesso, não reaplicar o mesmo arquivo; gerar um novo JSON para qualquer novo lote.

## /formatar-reuniao-suporte

- **Quando usar**: quando eu enviar uma anotação ou transcrição bruta de `Daily Suporte` ou `Weekly Suporte` e quiser transformar em ata formal + PDF para coordenação.
- **O que faz**: identifica tipo e data quando possível, preserva a transcrição original, formaliza a escrita, separa resumo, decisões, pendências e ações, gera Markdown final, versão de revisão quando necessária e PDF final validado em `19 - Reuniões/`.
- **Prompt para copiar**: `Siga o workflow Formatar Reunião de Suporte. Salve a transcrição bruta em 19 - Reuniões/04 - Transcrições Originais/, identifique se é Daily ou Weekly e a data, formalize o texto sem mudar o sentido, use A definir para responsável ou prazo ausentes, registre pontos incertos, gere Markdown final e PDF final, valide a abertura do PDF e salve cada arquivo na subpasta correta de 19 - Reuniões/, sem inventar dados.`
- **Workflows acionados**: `Formatar Reunião de Suporte`, `Revisar Texto`, `Criar Relatório`
- **Agentes usados**: `Agente Ata e Reuniões de Suporte`, `Agente Redator`, `Agente Auditor`, `Agente Segurança`
- **Saídas esperadas**:
  - `Identificação`: tipo da reunião, data e participantes, quando possível;
  - `Ata formal`: resumo executivo, principais pontos, pendências, bloqueios, decisões e ações;
  - `Original`: transcrição em `19 - Reuniões/04 - Transcrições Originais/`;
  - `Revisão`: HTML ou Markdown preliminar em `19 - Reuniões/01 - Em Revisão/`;
  - `Final`: Markdown em `19 - Reuniões/02 - Reuniões Formatadas/Dailies/` ou `Weeklies/` e PDF correspondente em `19 - Reuniões/03 - PDFs/`;
  - `Pontos a confirmar`: dados ausentes, ambiguidade e trechos duvidosos;
  - `Validação`: confirmação de que não houve invenção de informação.
- **Regra de perguntas**:
  - Se não estiver claro se é Daily ou Weekly, perguntar: `Isso é Daily ou Weekly?`
  - Se a data não estiver clara, perguntar: `Qual é a data da reunião?`
  - Se houver dúvida sobre PDF, perguntar: `Você quer que eu gere o PDF final também?`
- **Regras finais**:
  - não inventar responsável, prazo ou decisão;
  - não alterar o sentido do que foi dito;
  - não mexer em Notion, ClickUp ou WordPress;
  - não usar API externa;
  - não salvar credenciais, tokens, senhas ou cookies;
  - marcar informações ausentes como `Não informado`, exceto responsável e prazo, que devem ficar como `A definir`;
  - registrar dúvidas em `Pontos a confirmar`;
  - validar o local final antes de encerrar.

## /kcs-suporte

- **Quando usar**: quando você quiser transformar um atendimento, ticket, conversa ou solução técnica em conhecimento reaproveitável no Viny Brain.
- **O que faz**: captura o caso, valida a solução, define se é interno ou cliente, sugere destino e gera uma nota KCS sem publicar nada automaticamente.
- **Prompt para copiar**: `Siga o workflow Suporte para Conhecimento KCS. Leia este caso, valide a solução, classifique o destino do conhecimento e gere uma nota Markdown limpa para o Viny Brain sem salvar dados sensíveis e sem publicar nada automaticamente.`
- **Workflows acionados**: `Suporte para Conhecimento KCS`, `Auditar Integrações`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`
- **Saídas esperadas**:
  - `Caso`: resumo do atendimento, origem, tipo, status e público;
  - `Conhecimento`: problema, causa provável, solução validada, passo a passo e riscos;
  - `Destino`: resposta pronta, playbook, tutorial, checklist, runbook, postmortem, backlog ou descarte;
  - `Segurança`: validar se há credenciais, dado sensível ou orientação perigosa;
  - `Próximo passo`: linkar com índice, atualizar nota ou revisar depois.
- **Regras**:
  - perguntar qual foi o caso;
  - perguntar se a solução foi validada;
  - perguntar se é interno ou cliente;
  - sugerir destino;
  - gerar nota usando template;
  - nunca publicar automaticamente;
  - nunca salvar dados sensíveis;
  - nunca criar tarefa real sem autorização.

- **Alias textual**:
  - `Adicionar ClickUp`
  - `Adicionar no ClickUp`
  - `Adicionar tarefa ClickUp`
  - `Criar tarefa no ClickUp`
  - `Jogar no ClickUp`
  - `Colocar no ClickUp`
  - Essas frases devem acionar o mesmo fluxo do `/processar-demanda`

## /processar-demanda - Modo entrevista rápida

- **Quando usar**: quando a entrada vier só com o gatilho `Adicionar ClickUp` ou com poucos dados.
- **O que faz**: inicia uma entrevista curta para completar o mínimo necessário antes de montar a tarefa.
- **Perguntas principais**:
  1. Qual é a demanda ou tarefa?
  2. Quem vai fazer?
  3. Tem prazo? Se sim, qual?
  4. Qual prioridade? Baixa, média, alta ou urgente?
  5. É uma anotação simples ou uma tarefa detalhada?
  6. Quer criar no ClickUp agora ou só preparar?
- **Regras**:
  - fazer no máximo 3 perguntas por vez;
  - não perguntar tudo de uma vez se já tiver informação suficiente;
  - não inventar prazo;
  - não inventar responsável;
  - se o usuário disser `sou eu`, usar `Vinicius`;
  - se o usuário disser `sem prazo`, usar `A definir`;
  - se o usuário disser `só anota`, usar modo simples;
  - se o usuário disser `detalha`, usar modo detalhado;
  - se o usuário disser `criar no ClickUp agora`, seguir o modo aplicar no ClickUp;
  - se faltar informação crítica, perguntar antes de criar real.

## /processar-demanda - Cenários de uso

### Cenário A - Sem detalhes

```txt
Adicionar ClickUp
```

Resposta esperada:

```txt
Beleza. Qual demanda você quer adicionar ao ClickUp?

Também me diga, se já souber:
- quem vai fazer;
- prazo;
- prioridade;
- se é só anotação simples ou tarefa detalhada.
```

### Cenário B - Com demanda, mas sem prazo ou responsável

```txt
Adicionar ClickUp: revisar tutorial de faturas
```

Resposta esperada:

```txt
Certo. Antes de montar a tarefa:

1. Quem vai ficar responsável?
2. Tem prazo ou deixo como A definir?
3. É só anotação simples ou quer tarefa detalhada?
```

### Cenário C - Simples e completo

```txt
Adicionar ClickUp:
revisar tutorial de faturas
Responsável: Vinicius
Prazo: sem prazo
Prioridade: média
Só anota.
```

Resposta esperada:

- gerar tarefa simples;
- gerar JSON;
- sugerir nome do payload;
- mostrar comando de dry-run;
- não aplicar automaticamente.

### Cenário D - Criar real

```txt
Adicionar ClickUp:
revisar tutorial de faturas
Responsável: Vinicius
Sem prazo
Só anota
Criar no ClickUp agora
```

Resposta esperada:

- gerar JSON;
- salvar payload;
- rodar dry-run;
- se o dry-run estiver válido, aplicar com `--apply`;
- confirmar tarefa criada;
- mostrar URL da tarefa, se disponível.

## /processar-demanda - Modo aplicar no ClickUp

- **Quando usar**: somente quando o usuário autorizar explicitamente a criação real no ClickUp.
- **Frases que autorizam**:
  - `crie no ClickUp agora`
  - `pode subir no ClickUp`
  - `aplica no ClickUp`
  - `pode rodar --apply`
- **O que faz**: gera o JSON, salva em `18 - Integrações/API/payloads/`, roda `dry-run`, valida a saída e só então roda `--apply` no script do ClickUp.
- **Saída após aplicar**:
  - nome da tarefa;
  - lista destino;
  - status da criação;
  - URL da tarefa, se houver;
  - arquivo JSON usado.
- **Regra de segurança**:
  - se a frase não for explicitamente de aplicação, permanecer em JSON + dry-run/manual.
  - se o payload já foi aplicado, não reaplicar o mesmo arquivo.
  - se o dry-run não estiver claro, parar antes do `--apply`.

## /processar-demanda - Quando faltar informação

- Se faltar dado crítico, perguntar antes de criar a tarefa.
- Campos críticos:
  - nome da tarefa;
  - se é simples ou detalhada;
  - prazo, se parecer importante;
  - responsável, se não for óbvio;
  - prioridade, se houver urgência.
- Regras:
  - não inventar prazo;
  - não inventar responsável;
  - se o usuário disser `sem prazo`, usar `A definir`;
  - se o usuário disser `sou eu`, usar `Vinicius`;
  - se o usuário disser `só anota`, usar modo simples;
  - se o usuário autorizar criação real mas faltar prazo ou responsável, perguntar no máximo 3 coisas;
  - se for anotação simples e o usuário disser `sem prazo e sem responsável`, não perguntar.

- **Modo lista em lote**:
  - Usar quando eu enviar vários itens em lista.
  - Cada item vira uma tarefa simples separada.
  - Não perguntar sobre cada item individualmente se eu disser `sem prazo`, `sem responsável` ou `só anota`.
  - Perguntar no máximo 3 coisas se faltar uma configuração geral importante.
  - Não inventar prazo.
  - Não inventar responsável.
  - Não mandar para Notion se for apenas lista rápida.
  - Se o lote já foi aplicado com sucesso, tratar o payload como consumido e criar um novo arquivo para qualquer nova execução.
  - Exemplo:

```txt
/processar-demanda
Só anota no ClickUp, sem prazo:
- revisar prints do tutorial de cPanel
- conferir tutorial de faturas
- ajustar checklist de publicação
- revisar base de e-mails
```

  - Saída esperada: uma tarefa simples por item, com título curto, descrição mínima, responsável `A definir` quando não informado, prazo `A definir` quando não informado, prioridade `Média` quando não informada, tags `viny-brain` e `captura-rapida`, e checklist curto.

## /registrar-reuniao

- **Quando usar**: quando houver reunião, daily, weekly ou anotação solta que precise virar página pronta para Notion, tarefas derivadas para ClickUp, decisões principais para o Viny Brain, pendências e checklist de segurança.
- **O que faz**: salva a reunião na estrutura `19 - Reuniões/`, organiza a revisão, separa o que entra no Notion, o que vira demanda no ClickUp, o que fica como decisão operacional no Viny Brain e o que ainda precisa validação.
- **Workflows acionados**: `Registrar Reunião no Notion`, `Transformar Reunião em Demandas`, `Sincronizar Decisões Operacionais`, `Auditar Integrações`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`
- **Prompt para copiar**: `Siga os workflows Registrar Reunião no Notion, Transformar Reunião em Demandas e Sincronizar Decisões Operacionais. Salve o bruto em 19 - Reuniões/04 - Transcrições Originais/, crie a primeira versão em 01 - Em Revisão/ e, após validação, salve o Markdown e o PDF nas subpastas adequadas. Organize título, data, participantes, resumo executivo, contexto, decisões, pendências e próximos passos. Prepare saídas para Notion e ClickUp apenas para uso manual, sem conectar APIs, sem criar nada automaticamente e sem registrar credenciais.`
- **Modelo de entrada bruta**:

```txt
Tipo de reunião:
Data:
Participantes:
Contexto:
Anotações:
Decisões:
Pendências:
Prazos:
Responsáveis:
Links relacionados:
Observações:
```

- **Saídas esperadas**:
  - `Notion`: título da reunião, data, participantes, resumo executivo, contexto, pontos discutidos, decisões tomadas, pendências, próximos passos, links relacionados e status da reunião;
  - `ClickUp`: nome da tarefa, descrição, responsável, prioridade, status inicial, prazo, checklist, origem e observações internas;
  - `Viny Brain`: reunião bruta, revisão, Markdown final e PDF em `19 - Reuniões/`, além de decisões operacionais, mudanças de processo, próximos passos importantes, pendências que afetam continuidade e links externos apenas se existirem depois;
  - `Segurança`: validar senha, token, dados sensíveis de cliente, acesso interno, print sensível, link privado e informação que não deveria ir para Notion ou ClickUp;
  - `Pendências`: listar informações faltantes, responsáveis não definidos, prazos não definidos e decisões que precisam de validação.

- **Saída JSON para integração real**:
  - gerar também um JSON compatível com `18 - Integrações/API/scripts/create_notion_meeting_from_json.py`;
  - manter apenas dados fictícios ou aprovados na saída estruturada;
  - nunca incluir token, credencial ou segredo;
  - o JSON deve poder ser usado como ponte entre o `Viny Flow` e o `Notion`.
- **Orientação prática**:
  1. Gerar a saída normal em texto.
  2. Gerar também o JSON compatível com os scripts.
  3. Salvar o JSON em `18 - Integrações/API/payloads/`.
  4. Rodar o script em `dry-run`.
  5. Aplicar com `--apply` somente se o usuário confirmar.

## /extrair-aprendizados

- **Quando usar**: depois de reuniões, demandas, sessões do Codex, pilotos ou mudanças operacionais que geraram aprendizado útil para reaproveitar.
- **O que faz**: transforma o conteúdo bruto em aprendizados práticos, decisões tomadas, regras novas, padrões úteis e pendências, além de sugerir a atualização do checkpoint.
- **Workflows acionados**: `Extrair Aprendizados da Sessão`, `Revisão de Segurança`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Memória/Checkpoint`, `Agente Auditor`, `Agente Segurança`, `Agente Redator`
- **Prompt para copiar**: `Siga o workflow Extrair Aprendizados da Sessão. Leia o material bruto, extraia aprendizados práticos, decisões tomadas, regras novas, padrões que funcionaram e que falharam, pendências, próximos passos e um checkpoint sugerido, valide segurança e não registre credenciais nem dados sensíveis.`
- **Modelo de entrada bruta**:

```txt
Origem:
Data:
Contexto:
O que aconteceu:
Decisões tomadas:
O que funcionou:
O que não funcionou:
Pendências:
Próximos passos:
Observações:
```

- **Saídas esperadas**:
  - `Aprendizados`: aprendizados práticos, padrões que devem ser repetidos, padrões que devem ser evitados e melhorias identificadas;
  - `Decisões`: decisão, motivo, impacto, onde registrar e se precisa atualizar workflow, checklist ou regra;
  - `Regras novas`: regra operacional sugerida, onde aplicar, se é obrigatória ou recomendada e risco se não seguir;
  - `Pendências`: pendência, responsável, prioridade, prazo e destino sugerido;
  - `Checkpoint sugerido`: bloco curto com estado atual, próxima ação, riscos, pendências e última decisão importante;
  - `Segurança`: validar senha, token, dados sensíveis de cliente, acesso interno, print sensível, link privado e informação que não deveria ser registrada.

## /checkpoint

- **Quando usar**: no final de uma sessão, depois de uma tarefa grande ou antes de encerrar o Codex.
- **O que faz**: consolida o que foi feito, os arquivos criados e alterados, decisões, pendências, riscos e o próximo passo para retomar sem perder contexto.
- **Workflows acionados**: `Fechamento de Sessão`, `Extrair Aprendizados da Sessão`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Memória/Checkpoint`, `Agente Auditor`, `Agente Segurança`, `Agente Redator`
- **Prompt para copiar**: `Siga o workflow Fechamento de Sessão. Leia o contexto da sessão, consolide o que foi feito, liste arquivos criados e alterados, registre decisões, pendências, riscos e o próximo passo, atualize o histórico do dia e o Checkpoint Atual, e não registre credenciais nem dados sensíveis.`
- **Modelo de entrada opcional**:

```txt
Contexto opcional:
[se quiser, colo aqui o resumo do que fizemos ou deixo o Codex inferir pelo histórico da sessão]
```

- **Saídas esperadas**:
  - `Resumo da sessão`: o que foi feito, objetivo inicial, resultado final e se ficou concluído ou parcial;
  - `Arquivos`: arquivos criados, arquivos alterados e arquivos que precisam revisão;
  - `Decisões`: decisões tomadas, motivo e impacto;
  - `Pendências`: pendência, responsável, prioridade e próximo passo;
  - `Riscos`: credenciais, dados sensíveis, alterações externas, automações, WordPress, Notion, ClickUp e APIs;
  - `Próxima sessão`: onde continuar, primeiro comando recomendado, arquivos que devem ser lidos primeiro e tarefa ativa ou próxima ideia;
  - `Atualização do checkpoint`: atualizar obrigatoriamente `14 - Histórico Codex/Checkpoint Atual.md` e o histórico do dia.

## /auditar-viny-flow

- **Quando usar**: quando a estrutura do Viny Flow precisar de revisão periódica, antes de novas ideias grandes ou quando houver suspeita de duplicidade, excesso de estrutura ou links quebrados.
- **O que faz**: revisa agents, workflows, comandos reutilizáveis, skills instaladas, links, duplicidades, itens obsoletos, itens sem uso, riscos de segurança e aderência ao Painel Operacional.
- **Workflows acionados**: `Auditar Skills, Agents e Workflows`, `Auditar Contexto`, `Quality Gate - Validar Entrega`
- **Agentes usados**: `Agente Auditor`, `Agente Segurança`, `Agente Memória/Checkpoint`, `Agente Redator`
- **Prompt para copiar**: `Siga o workflow Auditar Skills, Agents e Workflows. Leia o Mapa de Agentes, o Mapa de Workflows, o arquivo de comandos reutilizáveis, a lista de skills instaladas e o Painel Operacional, identifique links quebrados, duplicidades, itens obsoletos, itens sem uso, riscos de segurança e ajustes necessários, e devolva uma recomendação curta sem apagar agents ou workflows.`
- **Saídas esperadas**:
  - `Estado geral`: saudável, parcialmente saudável ou precisa de ajuste;
  - `Agents`: agents encontrados, agents sem uso, agents duplicados e agents que precisam de ajuste;
  - `Workflows`: workflows encontrados, workflows duplicados, workflows sem agent, workflows que citam agent inexistente e workflows que precisam de ajuste;
  - `Comandos`: comandos encontrados, comandos sem workflow correspondente, comandos duplicados e comandos úteis que ainda faltam;
  - `Skills`: skills instaladas, skills em uso, skills pouco usadas e skills que podem ser úteis;
  - `Links e navegação`: links quebrados, links legados, Home, Painel Operacional e MOCs;
  - `Segurança`: risco de credenciais, risco de automação indevida, risco de alteração externa e risco de API/token;
  - `Recomendações`: corrigir agora, corrigir depois e não mexer.

## /criar-relatorio

- **Quando usar**: quando anotações, daily, weekly ou histórico precisarem virar relatório pronto para envio.
- **O que faz**: organiza o conteúdo em concluído, andamento, pendências e próximos passos.
- **Prompt para copiar**: `Siga o workflow Criar Relatório. Organize estas anotações em um relatório claro e objetivo, separando concluído, andamento, pendências e próximos passos, sem inventar informações e sem expor dados sensíveis.`
- **Workflows acionados**: `Criar Relatório`
- **Agentes usados**: `Agente Relatorios`, `Agente Redator`, `Agente Auditor`, `Agente Segurança`

## /revisar-texto

- **Quando usar**: quando um texto bruto precisar de clareza, tom natural e correção de português sem perder a intenção original.
- **O que faz**: revisa a redação e prepara uma versão pronta para uso.
- **Prompt para copiar**: `Siga o workflow Revisar Texto. Revise este texto para o público-alvo indicado, corrija português, melhore clareza e tom, preserve minha intenção original e remova qualquer dado sensível.`
- **Workflows acionados**: `Revisar Texto`
- **Agentes usados**: `Agente Redator`, `Agente Auditor`, `Agente Segurança`

## Regra

Esses comandos sao instrucoes humanas reutilizaveis. Nao sao automacoes.
