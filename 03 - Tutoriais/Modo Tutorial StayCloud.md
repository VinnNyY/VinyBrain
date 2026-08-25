# Modo Tutorial StayCloud

## Quando usar este modo

Use este modo sempre que eu pedir um novo tutorial da StayCloud e o objetivo for criar o material local completo, com preparo para WordPress, sem publicar automaticamente.

Este modo vale para:

- estudo do fluxo
- captura de prints
- montagem do HTML final
- preparação do `.md` para colagem no WordPress
- revisão visual e textual antes de publicar

## Arquivos de referência obrigatórios

Antes de criar qualquer tutorial neste modo, leia:

- `/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md`
- `/home/vinicius-alves/tutoriais-staycloud/_prompts/prompt_staycloud_v2/referencias/`
- o HTML local de referência aprovado do tutorial mais próximo do tema
- os tutoriais publicados da categoria StayCloud mais próxima do tema, quando acessíveis

Também use:

- `03 - Tutoriais/Diagnóstico - Fluxo de Tutoriais StayCloud.md`
- `03 - Tutoriais/Padrão de Prints StayCloud.md`
- `03 - Tutoriais/Checklist SEO Rank Math StayCloud.md`
- `03 - Tutoriais/Checklist UI UX - Tutorial StayCloud.md`
- `03 - Tutoriais/Checklist Final - Revisão antes do WordPress.md`
- `03 - Tutoriais/Estudos de Padrão StayCloud/Guia de Padrão - Tutoriais StayCloud Painel Novo.md`
- `03 - Tutoriais/Modelo de tutorial.md`
- `03 - Tutoriais/Checklist de tutorial.md`

## Como ler o prompt principal sem expor credenciais

- Leia o prompt completo localmente.
- Não copie credenciais para Obsidian, histórico, checklist, template ou diagnóstico.
- Não transcreva usuário, senha, tokens, cookies ou chaves.
- Se precisar registrar a existência de acesso local, use apenas: `[CREDENCIAL LOCAL DISPONÍVEL - NÃO REGISTRADA]`
- O prompt original continua sendo a fonte operacional, mas a parte sensível nunca deve sair do arquivo de origem.

## Como consultar as referências locais

- Abra as imagens de referência para entender padrão visual, editor, biblioteca de mídia e limpeza de tela.
- Use as referências como guia de operação, não como arte final.
- Não reutilize as imagens de referência em tutorial novo.
- Se o fluxo pedir comparação visual, valide enquadramento, limpeza, destaque e hierarquia.

## Como analisar os tutoriais publicados

- Use os tutoriais publicados como padrão real de publicação.
- Observe título, introdução, subtítulos, organização dos passos, uso de imagens, encerramento e CTA.
- Compare o tutorial novo com a página publicada para evitar desalinhamento de tom e composição.
- Se a publicação mais próxima do tema estiver acessível, use-a como espelho visual e editorial.

## Como usar `writing-guidelines`

Use `writing-guidelines` para revisar:

- clareza
- tom
- concisão
- organização de parágrafos
- redução de texto genérico
- consistência editorial

Não use a skill para reescrever o tutorial de forma automática. Use como revisão final do texto e do HTML quando o rascunho já estiver pronto.

## Como usar `web-design-guidelines`

Use `web-design-guidelines` para revisar:

- hierarquia visual
- leitura da página
- espaçamento
- organização de blocos
- consistência entre imagens e texto
- proximidade com o padrão publicado

Use a skill como apoio para evitar tutorial visualmente confuso ou fora do padrão da StayCloud.

## Estrutura obrigatória do tutorial

Todo tutorial criado neste modo deve seguir esta estrutura:

1. Título claro e específico
2. Objetivo
3. Pré-requisitos
4. Passo a passo
5. Imagens reais do fluxo
6. Resultado esperado
7. Erros comuns
8. Observações finais
9. Texto final pronto para WordPress

Se o tema exigir, adicione subtópicos, mas sem quebrar a lógica principal.

## Validação SEO / Rank Math

Todo tutorial StayCloud deve incluir uma seção de validação SEO com:

- palavra-chave principal
- título SEO sugerido
- slug
- meta description
- critérios de Rank Math

Regras obrigatórias:

- o objetivo mínimo é atingir pontuação acima de 80 no Rank Math
- a palavra-chave principal deve aparecer no título, na introdução, no slug e na meta description
- a palavra-chave principal deve aparecer em pelo menos um subtítulo quando isso for natural
- a meta description deve ser clara, conter a palavra-chave e resumir o benefício do tutorial
- o resumo de validação final não pode ser considerado completo sem meta description

Se a validação SEO não estiver preenchida, o tutorial ainda não está pronto para uso real.

## Padrão de linguagem

- Tom natural, direto e profissional
- Frases curtas e claras
- Uma ação por passo
- Sem excesso de explicação
- Sem linguagem robótica
- Sem dados inventados
- Sem variações desnecessárias de nome de botão ou menu

## Padrão de prints

- Capturar a interface atual
- Fechar popups, banners, avisos e modais antes de capturar
- Mostrar apenas o que ajuda o leitor a executar o passo
- Marcar exatamente o elemento citado no texto quando houver clique, campo ou dado importante
- Evitar prints com sujeira visual
- Repetir a captura se a marcação ficar ruim
- Converter a imagem final para WebP
- Enviar a imagem para a mídia do WordPress
- Usar apenas URL pública no HTML final
- Tutorial com placeholders não pode ser considerado pronto para uso real.
- Um tutorial só pode ser considerado pronto quando tiver prints reais, interface validada e revisão final de HTML/Markdown.
- Nenhum tutorial pode ser considerado pronto se os prints estiverem ampliados demais, cortados demais ou sem marcação clara
- Prints com placeholders, blur excessivo ou pouco contexto devem reprovar no checklist
- Antes de finalizar qualquer tutorial, rode obrigatoriamente a Auditoria Visual dos Prints
- Se o print estiver óbvio por si só, a ausência de marcação precisa ser justificada no plano de prints
- Print final sem destaque suficiente para clique ou conferência deve ser reprovado

## Padrão de leitura

- O tutorial é escrito para cliente final.
- O texto deve falar com o leitor usando `você`.
- O texto não deve parecer instrução interna.
- O cliente leigo precisa entender onde clicar e o que esperar na tela.

## Regra de recaptura e cache

Quando uma imagem ou print ficar travado, cacheado, errado, com enquadramento ruim ou insistir em aparecer antigo:

- você pode apagar a imagem local antiga apenas dentro do diretório do tutorial em execução
- não apague imagens fora do diretório do tutorial atual
- não apague imagens já publicadas no WordPress sem confirmação explícita
- depois de apagar, recapture a imagem
- prefira um novo nome de arquivo com sufixo de versão, como `passo-04-dados-acesso-v2.webp` ou `passo-04-dados-acesso-recaptura.webp`
- atualize todas as referências no HTML e no Markdown
- confirme que a imagem antiga não está mais referenciada
- rode a auditoria visual novamente
- registre no relatório que a imagem foi removida e recapturada

## Padrão de HTML

- Gerar HTML limpo e colável no WordPress
- Usar `article`, `header`, `section`, `h1`, `h2`, `p`, `figure` e `img` quando fizer sentido
- Manter hierarquia visual clara
- Inserir as imagens no ponto exato do passo correspondente
- Usar CTA final curto e objetivo
- Não inserir markdown dentro do HTML final
- Não deixar comentários internos, checklist ou anotações operacionais no HTML final

## Padrão de Markdown

- O arquivo `.md` final deve conter somente o HTML limpo
- Não incluir rascunho, checklist ou relatório
- Não incluir credenciais ou caminhos locais
- Não incluir dados internos do processo
- Não usar marcação Markdown no conteúdo final

## Checklist antes de finalizar

- [ ] A referência principal foi lida
- [ ] As referências locais foram consultadas
- [ ] O Guia de Padrão StayCloud Painel Novo foi lido
- [ ] O tutorial publicado de referência foi analisado, quando acessível
- [ ] A validação SEO foi preenchida
- [ ] A palavra-chave principal aparece no título, na introdução, no slug, na meta description e em pelo menos um subtítulo quando natural
- [ ] O título SEO sugerido foi definido
- [ ] O slug foi definido
- [ ] A meta description foi definida
- [ ] O objetivo mínimo de Rank Math acima de 80 foi planejado
- [ ] O texto está claro e natural
- [ ] Os prints são reais e limpos
- [ ] As imagens estão em WebP
- [ ] As URLs das imagens são públicas
- [ ] O HTML está limpo
- [ ] O `.md` está pronto para colagem
- [ ] Não houve exposição de credenciais
- [ ] O tutorial segue o padrão da StayCloud
- [ ] A auditoria visual dos prints foi concluída
- [ ] Nenhum print está ampliado demais, cortado demais, sem marcação clara ou com blur excessivo
- [ ] O texto está em tom de cliente final
- [ ] O tutorial não usa linguagem interna

## Checklist antes de publicar

- [ ] O HTML foi validado visualmente
- [ ] O conteúdo está coerente com o fluxo real
- [ ] A validação SEO está completa
- [ ] O status de SEO Rank Math está no alvo acima de 80
- [ ] O título e o objetivo estão corretos
- [ ] As imagens carregam no WordPress
- [ ] O CTA final está adequado
- [ ] O texto não ficou genérico
- [ ] O QA final foi concluído
- [ ] A auditoria visual dos prints foi aprovada
- [ ] A publicação só acontecerá com confirmação explícita

## Regras de segurança

- Não publicar automaticamente
- Não alterar o prompt original
- Não registrar credenciais em notas do vault
- Não expor dados de cliente
- Não salvar cookies, tokens ou senhas
- Não executar ações destrutivas
- Não fazer login novo sem necessidade
- Não continuar se houver risco de expor informação sensível

## O que precisa da minha confirmação

Você precisa confirmar explicitamente:

- criação de um tutorial novo
- uso de acesso local quando necessário
- preparação para WordPress em um caso específico
- publicação final
- qualquer mudança no prompt principal
- qualquer ajuste estrutural neste modo operacional

## Regra final

Se este modo estiver ativo, o trabalho só avança depois de ler o prompt, validar o padrão visual, aplicar as skills úteis e preparar o tutorial sem publicar nada por conta própria.
