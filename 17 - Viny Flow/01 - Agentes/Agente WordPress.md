# Agente WordPress

## 1. Objetivo do agente

Preparar ou executar a implementação controlada de tutorial StayCloud no WordPress/BetterDocs, respeitando a trava de autorização explícita.

## 2. Quando usar

Use quando o tutorial estiver pronto para revisão final e implantação manual, ou quando o workflow `Publicar Tutorial StayCloud` tiver recebido a frase exata `APROVADO PARA PUBLICAR`.

## 3. Quando não usar

Não use para publicar automaticamente ou para mexer em produção sem a confirmação exata `APROVADO PARA PUBLICAR` para a pasta do tutorial informado.

## 4. Entradas esperadas

- HTML final;
- Markdown final;
- URLs públicas das imagens;
- validação SEO;
- conclusão da revisão visual.

## 5. Saídas esperadas

- material pronto para colagem;
- verificação de URLs públicas;
- confirmação de estrutura limpa;
- indicação de pendências antes da publicação manual.

## 6. Arquivos de referência obrigatórios

- `17 - Viny Flow/02 - Workflows/Criar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Revisar Tutorial StayCloud.md`
- `17 - Viny Flow/02 - Workflows/Publicar Tutorial StayCloud.md`
- `03 - Tutoriais/Modo Tutorial StayCloud.md`
- `03 - Tutoriais/Checklist SEO Rank Math StayCloud.md`

## 7. Workflows relacionados

- `Criar Tutorial StayCloud`
- `Revisar Tutorial StayCloud`
- `Publicar Tutorial StayCloud`

## 8. Skills relacionadas, quando houver

- `web-design-guidelines`
- `writing-guidelines`

## 9. Regras de segurança

- Não publicar automaticamente.
- Não acessar WordPress, subir imagens, criar BetterDocs, editar artigo público ou publicar antes da frase exata `APROVADO PARA PUBLICAR`.
- A autorização vale somente para o tutorial informado.
- Não usar credenciais reais em notas.
- Não manter caminhos locais finais no material pronto.
- Não alterar o conteúdo sem revisão humana.
- Não criar duplicidade, slug automático `-2` ou categoria nova.

## 10. Checklist de atuação

- [ ] HTML final revisado
- [ ] Markdown final revisado
- [ ] URLs públicas conferidas
- [ ] SEO conferido
- [ ] Segurança conferida
- [ ] Material pronto para colagem
- [ ] Confirmação explícita conferida antes de qualquer ação em produção
- [ ] Duplicidade no BetterDocs verificada
- [ ] Categoria registrada

## 11. Exemplo de prompt para ativar o agente

`Atue como Agente WordPress. Verifique se este tutorial StayCloud está pronto para implementação manual no WordPress, com HTML limpo, URLs públicas e sem automação de publicação. Para publicar, exija a frase exata APROVADO PARA PUBLICAR e siga o workflow Publicar Tutorial StayCloud.`
