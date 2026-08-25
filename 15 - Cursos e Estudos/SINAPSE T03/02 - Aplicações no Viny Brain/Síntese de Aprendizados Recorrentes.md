# Síntese de Aprendizados Recorrentes

## Padrões de trabalho

- Trabalhar por sessão e por objetivo, evitando misturar contextos diferentes.
- Preferir terminal e estrutura local de arquivos em vez de depender só da interface de chat.
- Usar o vault como memória persistente e o histórico do Codex como trilha de execução.
- Separar conhecimento bruto, nota de aula, plano de aplicação e implementação.
- Registrar checkpoints em tarefas longas para facilitar retomada no dia seguinte.
- Dividir projetos grandes em partes menores e mais fáceis de manter.
- Tratar atualização, revisão e validação como parte do fluxo, não como etapa opcional.

## Regras para Codex

- Ler contexto antes de agir.
- Manter uma sessão por objetivo principal.
- Não misturar tarefas diferentes sem justificativa.
- Não salvar segredos, tokens, credenciais ou dados sensíveis.
- Não alterar produção, permissões críticas ou automações sensíveis sem confirmação.
- Registrar decisões importantes no vault e no histórico.
- Usar regras, prompts e templates para reduzir dependência de memória de sessão.
- Separar trabalho técnico, documentação e organização em fluxos diferentes quando necessário.

## Prompts úteis

- Prompt de inicialização para abrir sessão com leitura obrigatória de contexto.
- Prompt de checkpoint duplo para auditoria interna antes de concluir trabalho.
- Prompt de adaptação de fluxo Claude Code -> Codex CLI.
- Prompt de criação de memória persistente em Markdown.
- Prompt de lead scoring e qualificação de formulário.
- Prompt de checklist de segurança para projetos com IA.
- Prompt de isolamento de sessão quando houver risco de mistura de contexto.

## Skills adaptáveis

- Skill de leitura de contexto do vault.
- Skill de organização de notas de aula em Markdown.
- Skill de segurança para credenciais e `.env`.
- Skill de sessão técnica isolada.
- Skill de checkpoint e histórico.
- Skill de adaptação Claude Code -> Codex CLI.
- Skill de funil, lead score e automação de marketing.
- Skill de restauração de ambiente a partir do vault.

## Automações possíveis

- Atualização automática do histórico de sessão.
- Captura diária de checkpoints para continuidade no dia seguinte.
- Compactação ou resumo de memória em notas permanentes.
- Validação automática de presença de arquivos-base e templates.
- Organização assistida de material bruto em notas estruturadas.
- Rotina de backup local do vault antes de mudanças maiores.
- Fluxos programados para tarefas repetitivas, desde que documentados e aprovados.

## Melhorias no Viny Brain

- Consolidar `08 - Codex` como camada operacional do Codex.
- Manter `00 - Mapas` como entrada de navegação do vault.
- Usar `MOC - Codex` como porta de entrada para o fluxo operacional.
- Usar `Checkpoint Atual` como retomada rápida de contexto.
- Padronizar notas de aula, planos de aplicação e skills adaptadas.
- Criar mais templates apenas quando houver padrão recorrente real.
- Usar a Base de Conhecimento como memória estável para regras e referências.

## Riscos e cuidados

- Expor credenciais por falta de disciplina com `.env` ou logs.
- Misturar tarefas diferentes na mesma sessão e perder contexto.
- Automatizar antes de validar o fluxo.
- Criar documentação em excesso e perder clareza.
- Depender de uma única sessão como se ela fosse memória permanente.
- Reproduzir fluxos de Claude Code sem traduzir para o Codex CLI.
- Fazer integração com produção ou contas reais sem confirmação.

## Ordem recomendada de implementação

1. Reforçar as regras de sessão, isolamento e segurança.
2. Manter o checkpoint atual sempre útil para retomada.
3. Aplicar o template padrão em novas aulas e materiais brutos.
4. Converter aprendizados recorrentes em planos de aplicação.
5. Converter padrões reutilizáveis em skills, prompts ou templates.
6. Só depois discutir automações mais avançadas.
7. Por fim, revisar o que realmente entrou em uso e o que ficou só como referência.

## Observação final

O curso reforça três ideias centrais: contexto precisa ser preservado, segurança precisa ser explícita e repetição útil deve virar estrutura. No Viny Brain, isso se traduz em sessão isolada, memória persistente e documentação reutilizável.
