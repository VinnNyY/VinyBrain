# Diagnóstico - Fluxo de Tutoriais StayCloud

## 1. Objetivo do prompt principal

O prompt principal orienta a criação local de tutoriais da StayCloud com padrão de publicação, usando capturas reais, imagens em WebP, HTML limpo para WordPress e validação visual antes de finalizar.

O foco é transformar um fluxo operacional em tutorial publicável sem depender de improviso, sem reaproveitar prints antigos como se fossem novos e sem publicar nada automaticamente.

## 2. Padrão esperado de tutorial

O padrão esperado é um tutorial prático, orientado a tarefa, com introdução curta, passos claros, imagens capturadas na execução real, conclusão objetiva e CTA final curto para suporte.

Pelo prompt e pelos exemplos publicados, o tutorial precisa:

- resolver uma tarefa específica
- manter sequência lógica de passos
- mostrar a interface real do painel
- usar linguagem direta e profissional
- destacar botões, menus e campos com precisão
- fechar com orientação final e chamada para suporte

## 3. Estrutura de arquivos do fluxo

A estrutura local observada no projeto é organizada por pasta do tutorial, com separação entre conteúdo, originais, imagens e validação.

Estrutura típica:

- `conteudo/`
- `originais/`
- `imagens-webp/`
- `imagens-webp-clean2/` ou variações de limpeza
- `imagens-webp-limpo/` quando existir
- `validacao/` quando existir

O fluxo também usa a pasta `_prompts/` como base operacional e de referências visuais.

## 4. Como os prints devem ser capturados

Os prints precisam ser capturados na interface real, no momento atual da tela, e nunca a partir de imagens antigas ou de referência.

Regras práticas observadas:

- fechar popups, banners, chats, notificações e modais antes de capturar
- enquadrar só a área útil do passo
- destacar exatamente o elemento citado no texto
- evitar barra do navegador quando o print for do produto e não do browser
- repetir a captura se a marcação ficar encoberta ou confusa

O material de referência local confirma que o print precisa parecer limpo, intencional e pronto para publicação.

## 5. Como as imagens devem ser tratadas

As imagens seguem um ciclo fixo:

- captura original
- limpeza visual
- conversão para WebP
- envio para a mídia do WordPress
- uso da URL pública no HTML final

No fluxo atual, a imagem final não pode depender de caminho local, arquivo bruto ou print reaproveitado. O tutorial só fica pronto quando cada imagem já estiver publicada e acessível por URL pública.

## 6. Como o HTML final deve ser gerado

O HTML final precisa ser limpo, pronto para colar no WordPress e sem restos de Markdown, checklist interno ou comentários de produção.

Pelo padrão local e pelos tutoriais publicados, o HTML final usa:

- `article` como bloco principal
- `header` com título e resumo
- seções com `h2`
- textos curtos por seção
- `figure` e `img` para cada print
- links de apoio quando realmente úteis
- CTA final de suporte

O HTML deve preservar legibilidade, espaçamento e hierarquia visual sem depender de estilização pesada no editor.

## 7. Como o Markdown final deve ser gerado

O arquivo `.md` do fluxo não deve ser um texto de trabalho. Ele deve conter somente o HTML final limpo, já pronto para colagem no WordPress.

Isso significa:

- sem checklist
- sem notas internas
- sem caminho local
- sem instruções de bastidor
- sem dados sensíveis
- sem credenciais

## 8. Como o tutorial deve ser preparado para WordPress

O fluxo exige que a imagem final já esteja na mídia do WordPress e que o HTML final use apenas URL pública.

Antes de publicar, o tutorial precisa estar:

- com imagens em WebP
- com URLs públicas corretas
- com HTML limpo validado
- com texto pronto para o editor
- com hierarquia visual coerente no WordPress
- com revisão final antes de publicar

O prompt deixa claro que não é para publicar automaticamente. A preparação é para colagem e validação no editor do WordPress.

## 9. Regras de escrita que devem ser seguidas

O padrão de escrita observado no prompt e nas referências pede:

- tom natural, direto e profissional
- frases objetivas
- ação clara em cada etapa
- vocabulário simples, sem enfeite
- uso consistente de termos da interface
- foco no que o leitor precisa fazer

As skills instaladas ajudam nesse ponto, principalmente:

- `writing-guidelines`, para clareza, tom e concisão
- `web-design-guidelines`, quando houver revisão de composição visual e leitura da página

## 10. Regras visuais vistas nos tutoriais publicados

Nos tutoriais publicados da categoria `painel-novo`, o padrão visual observado é:

- cabeçalho com título forte e resumo inicial
- introdução curta antes dos passos
- passo a passo em blocos numerados ou títulos de etapa
- print logo após o passo correspondente
- destaque visual para botões e menus
- fechamento com conclusão e suporte
- sumário automático ou seção equivalente no fim

Também aparece um estilo consistente de página limpa, com bastante espaço em branco, foco em leitura e imagens grandes o bastante para orientar a ação.

## 11. Padrões de marcação, destaque e organização

Os padrões recorrentes são:

- títulos descritivos, sem ambiguidade
- etapas numeradas
- destaque com `strong` para botões, menus e campos
- imagens logo após a explicação do passo
- legenda ou texto curto para contextualizar cada captura
- organização por subtópicos quando o fluxo é mais longo
- conclusão com CTA breve

Nos exemplos publicados, o conteúdo não tenta parecer acadêmico. Ele prioriza navegação, ação e reconhecimento visual da interface.

## 12. O que a skill `writing-guidelines` melhora nesse processo

A skill `writing-guidelines` ajuda a:

- reduzir texto genérico
- cortar frases longas demais
- melhorar clareza e ritmo
- manter o conteúdo focado em uma única tarefa por página
- reforçar voz ativa e instruções diretas
- evitar tom robótico ou excessivamente explicativo

Ela é útil principalmente para o texto do tutorial, para o HTML final e para a revisão do prompt operacional que guia a criação.

## 13. O que a skill `web-design-guidelines` melhora nesse processo

A skill `web-design-guidelines` ajuda a:

- revisar hierarquia visual
- validar leitura da página
- checar consistência de layout e espaçamento
- melhorar organização de seções e imagens
- evitar blocos visuais confusos
- reforçar clareza para o leitor final

Ela é especialmente útil para comparar o tutorial local com a aparência da base publicada e evitar que o artigo fique visualmente fora do padrão.

## 14. Riscos e cuidados

Principais riscos identificados:

- credenciais locais podem existir no prompt base
- prints podem expor dados sensíveis se a tela não for limpa
- imagens antigas podem ser reutilizadas por engano
- o HTML pode ficar limpo demais e perder o padrão editorial da StayCloud
- o texto pode ficar genérico se a skill for aplicada sem contexto
- a publicação pode ser precipitada se o QA não fechar antes

Cuidados obrigatórios:

- não registrar credenciais em nota alguma
- não copiar dados sensíveis para o Obsidian
- não publicar sem validação visual
- não alterar o prompt original neste momento
- não criar tutorial novo ainda

Se houver necessidade de mencionar acessos no estudo, usar apenas:

- `[CREDENCIAL LOCAL DISPONÍVEL - NÃO REGISTRADA]`

## 15. Checklist final antes de publicar

- [ ] O tema do tutorial está definido de forma única
- [ ] O fluxo real foi validado
- [ ] A estrutura de conteúdo está completa
- [ ] Os prints são atuais e limpos
- [ ] As imagens foram convertidas para WebP
- [ ] As imagens foram enviadas para a mídia do WordPress
- [ ] O HTML final usa apenas URL pública
- [ ] O `.md` contém somente HTML limpo
- [ ] Não há credenciais nem dados sensíveis registrados
- [ ] O texto mantém tom direto e profissional
- [ ] A organização visual bate com os tutoriais publicados
- [ ] O CTA final está curto e adequado
- [ ] A revisão final foi concluída antes de publicar

## Conclusão

O fluxo atual já tem base suficiente para gerar tutoriais StayCloud com padrão consistente, desde que a execução siga três controles: captura limpa, texto direto e validação final antes da publicação.

O próximo passo, depois de confirmado este diagnóstico, é transformar esse estudo em um modo operacional reutilizável para criação de novos tutoriais.
