# Diagnóstico - `npx skills`

## Contexto

Investigação inicial para entender se a CLI `skills` funciona neste ambiente, como ela se relaciona com o Codex CLI e qual é a melhor forma de integrar isso ao `Viny Brain` e ao Obsidian sem instalar nada ainda.

## 1. Verificação do ambiente

- `node -v` -> `v22.22.2`
- `npm -v` -> `10.9.7`
- `npx -v` -> `10.9.7`

## 2. Validação da CLI `skills`

- `npx skills --help` funcionou.
- `npx skills list` funcionou.
- `npx skills ls -a codex` funcionou.
- `npx skills add vercel-labs/agent-skills --list` funcionou e listou skills disponíveis para o agente `codex`.

## 3. Estado atual das skills

### No projeto

- Não existe pasta `.agents/skills/` neste vault.
- `npx skills list` informou que não há skills de projeto instaladas.

### No Codex

- Existe `~/.codex/skills/`.
- O diretório já contém skills do sistema:
  - `.system/imagegen`
  - `.system/openai-docs`
  - `.system/plugin-creator`
  - `.system/skill-creator`
  - `.system/skill-installer`

### Global

- `npx skills ls -g` informou que não há skills globais instaladas.

## 4. Skills disponíveis via repositório recomendado

O comando `npx skills add vercel-labs/agent-skills --list` encontrou 9 skills:

- `vercel-composition-patterns`
- `deploy-to-vercel`
- `vercel-react-best-practices`
- `vercel-react-native-skills`
- `vercel-react-view-transitions`
- `vercel-cli-with-tokens`
- `vercel-optimize`
- `web-design-guidelines`
- `writing-guidelines`

## 5. Skills mais úteis para o Viny Brain

- `writing-guidelines`
- `web-design-guidelines`
- `vercel-react-best-practices`
- `vercel-composition-patterns`
- `vercel-react-view-transitions`
- `vercel-optimize`, se houver trabalho de performance ou custo em app Vercel

## 6. Como o `npx skills` funciona com o Codex

- A CLI detectou o agente `codex` automaticamente.
- O padrão de uso mostra dois escopos:
  - `project`, que é o default quando não se usa `-g`
  - `global`, habilitado com `-g`
- Para o Codex, o estado local relevante hoje é `~/.codex/skills/`.
- Para este vault, ainda não há skills de projeto em `.agents/skills/`.

## 7. Riscos

- Instalar tudo de uma vez pode poluir o ambiente e misturar skills pouco relevantes.
- Instalar globalmente pode espalhar comportamento fora deste vault.
- Skills de terceiros precisam de triagem antes de entrar no fluxo principal.
- Copiar fluxo de Claude Code sem adaptação pode gerar ruído operacional no Codex.

## 8. Recomendação

Recomendo instalar por projeto, não globalmente.

Motivos:

- mantém o `Viny Brain` isolado
- reduz risco de contaminação do ambiente
- facilita auditoria e remoção posterior
- permite selecionar apenas as skills realmente úteis ao fluxo do Codex

## 9. Comandos sugeridos para a próxima etapa

Sem executar ainda, os comandos mais prováveis são:

```bash
npx skills add vercel-labs/agent-skills --agent codex --skill writing-guidelines
npx skills add vercel-labs/agent-skills --agent codex --skill web-design-guidelines
npx skills add vercel-labs/agent-skills --agent codex --skill vercel-react-best-practices
```

Se quiser trabalhar com um conjunto maior depois da validação:

```bash
npx skills add vercel-labs/agent-skills --agent codex --skill writing-guidelines web-design-guidelines vercel-react-best-practices
```

## 10. Conclusão

- `npx skills` funciona neste ambiente.
- A CLI já reconhece o agente `codex`.
- Não há skills de projeto instaladas ainda.
- Não há skills globais instaladas ainda.
- O repositório recomendado pela própria CLI já expõe skills úteis para o ecossistema do `Viny Brain`.
- O próximo passo seguro é revisar quais skills entram primeiro e instalar só o necessário, por projeto.
