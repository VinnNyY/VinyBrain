# Plano de Adaptação - Viny Flow

## 1. O que é o Viny Flow

Viny Flow é a camada de orquestração própria do `Viny Brain` para organizar trabalho com Codex, Obsidian, skills locais, histórico, checkpoint e status operacional.

A ideia não é copiar o Ruflo. A ideia é absorver os princípios úteis dele e convertê-los em um sistema mais simples, auditável e controlado, sem daemon, sem hooks agressivos, sem instalação global e sem dependência forte de um ecossistema externo.

## 2. Conceitos do Ruflo que serão aproveitados

- Memória orientada a contexto.
- Agentes especializados por função.
- Workflows por tipo de tarefa.
- Checklists de entrada e saída.
- Separação entre coordenação e execução.
- Reutilização de prompts e comandos.
- Rastreamento de estado e status operacional.
- Medição de risco antes de automatizar.
- Organização por módulos em vez de um fluxo único e pesado.

## 3. Conceitos do Ruflo que serão descartados

- Daemon em background.
- Hooks automáticos como padrão.
- Instalação global.
- MCP automático como dependência central.
- Registry externo como base do sistema.
- Federação entre máquinas.
- Autonomia contínua com loop permanente.
- Stack de embeddings e modelos só por entusiasmo técnico.
- Instalação de pacote completo sem necessidade concreta.

## 4. Conceitos adiados

- Integração mais profunda com múltiplos providers.
- Qualquer forma de colaboração entre máquinas.
- Automação de browser.
- Fluxos de benchmark mais avançados.
- Memória semântica sofisticada.
- Plugins próprios.
- Camadas de aprendizado automático.

Esses pontos podem existir no futuro, mas não entram no primeiro desenho.

## 5. Como o Viny Flow deve funcionar sem daemon, hooks agressivos ou instalação global

O Viny Flow deve funcionar como uma convenção de pastas, prompts, checklists e registros dentro do próprio vault.

Regras-base:

- Tudo é iniciado manualmente.
- Nada roda sozinho em background.
- Nenhuma ação crítica acontece sem confirmação.
- Toda tarefa passa por uma entrada curta e uma saída curta.
- O que for automatizado deve ser explícito, local e reversível.
- A configuração fica no vault, não no sistema global.

O Viny Flow deve ser previsível. Se uma sessão termina, o estado fica registrado em Markdown e pode ser retomado sem depender de memória implícita.

## 6. Como criar agentes especializados dentro do Viny Brain

No Viny Flow, um agente especializado não precisa ser um runtime complexo. Pode ser um pacote simples de:

- propósito;
- escopo;
- entradas esperadas;
- saídas esperadas;
- checklist;
- prompt-base;
- arquivos de referência.

Cada agente pode existir como uma nota de operação e, quando fizer sentido, como uma skill local.

Sugestão de padrão:

- nome curto;
- função única;
- instruções diretas;
- limite de escopo;
- critérios de saída;
- arquivos que pode ler e alterar;
- riscos principais.

## 7. Como criar workflows por tipo de tarefa

Cada workflow deve mapear um tipo recorrente de trabalho.

Workflows iniciais sugeridos:

- tutorial StayCloud;
- playbook e base de conhecimento;
- relatório operacional;
- suporte e resposta padrão;
- processo seletivo;
- estudo de curso;
- revisão de documentos;
- checklist de segurança;
- checkpoint de sessão.

Cada workflow deve dizer:

- quando iniciar;
- o que ler antes;
- o que produzir;
- o que não mexer;
- quando parar;
- como registrar o resultado.

## 8. Como criar comandos/prompt reutilizáveis

Em vez de comandos automáticos, o Viny Flow deve usar prompts reutilizáveis e curtos, armazenados no vault.

Boas unidades de reutilização:

- prompt de abertura;
- prompt de análise;
- prompt de revisão;
- prompt de fechamento;
- prompt de checkpoint;
- prompt de mudança de escopo;
- prompt de retomada.

Esses prompts devem ser projetados para o Codex CLI e não para copiar o fluxo do Claude Code.

## 9. Como usar checklists de entrada e saída

Cada fluxo deve começar com um checklist de entrada e terminar com um checklist de saída.

Checklist de entrada:

- objetivo confirmado;
- arquivos lidos;
- escopo definido;
- risco principal identificado;
- arquivos autorizados para alteração;
- restrições explícitas.

Checklist de saída:

- entrega registrada;
- arquivos criados;
- arquivos alterados;
- pendências anotadas;
- risco residual descrito;
- próximo passo definido;
- histórico atualizado.

## 10. Como integrar com histórico, checkpoint, status operacional, skills locais, Obsidian e Codex CLI

### Histórico

O Viny Flow deve registrar a sessão no histórico diário e usar checkpoints curtos para retomar depois.

### Checkpoint

Checkpoint é o marcador de progresso. Não é uma tarefa nova. Ele serve para continuar sem reabrir o raciocínio do zero.

### Status operacional

O status operacional deve mostrar o estado atual do Codex e do fluxo, para que a sessão comece com contexto limpo.

### Skills locais

As skills locais viram blocos de especialidade do Viny Flow. Elas não são o sistema inteiro; são ferramentas do sistema.

### Obsidian

O Obsidian é o meio principal de persistência humana. O Viny Flow deve viver em Markdown claro, com navegação simples.

### Codex CLI

O Codex CLI é o executor principal. O Viny Flow define como trabalhar, o Codex executa dentro dessas regras.

## 11. Como aplicar isso aos fluxos atuais

### Tutoriais StayCloud

- workflow com leitura de base, captura, revisão e fechamento;
- checklist obrigatório de qualidade;
- separação entre rascunho, revisão e publicação;
- histórico do tutorial ligado ao checkpoint;
- status final claro.

### Playbooks e base de conhecimento

- workflow de importação e curadoria;
- validação do tema antes de criar vínculo;
- classificação por utilidade real;
- separação entre estrutura e conteúdo.

### Relatórios

- workflow de contexto, atualização principal, demandas concluídas, em andamento, pontos de atenção e próximos passos;
- formato curto e reutilizável;
- checkpoint ao final de mudanças grandes.

### Suporte

- workflow de resposta padrão;
- escopo muito claro;
- resposta curta, objetiva e consistente;
- registro do problema e da solução.

### Processo seletivo

- workflow de triagem, análise, mensagem e acompanhamento;
- prompts reutilizáveis;
- separação entre triagem e decisão;
- linguagem padronizada.

### Estudos de cursos

- workflow de leitura, extração, resumo, validação e aplicação;
- checkpoints por capítulo ou bloco;
- distinção entre estudo e implementação;
- notas de lacuna para o que ainda falta testar.

## 12. Estrutura de pastas sugerida

- `17 - Viny Flow/`
- `17 - Viny Flow/00 - Visão Geral/`
- `17 - Viny Flow/01 - Agentes/`
- `17 - Viny Flow/02 - Workflows/`
- `17 - Viny Flow/03 - Prompts/`
- `17 - Viny Flow/04 - Checklists/`
- `17 - Viny Flow/05 - Histórico e Checkpoints/`
- `17 - Viny Flow/06 - Decisões e Riscos/`
- `17 - Viny Flow/07 - Integrações/`

Essa estrutura mantém a camada de orquestração separada do restante do vault.

## 13. Primeiros agentes recomendados

- `agente-contexto`
- `agente-checkpoint`
- `agente-revisao`
- `agente-staycloud`
- `agente-base-conhecimento`
- `agente-relatorios`
- `agente-suporte`
- `agente-processo-seletivo`
- `agente-estudos`
- `agente-seguranca`

Cada um deve ter responsabilidade única e saída previsível.

## 14. Primeiros workflows recomendados

- `wf-abertura-sessao`
- `wf-fechamento-sessao`
- `wf-tutorial-staycloud`
- `wf-importacao-bk`
- `wf-relatorio-operacional`
- `wf-suporte-resposta`
- `wf-processo-seletivo`
- `wf-estudo-curso`
- `wf-checkpoint-importante`
- `wf-revisao-de-risco`

## 15. Riscos

- Excesso de abstração e criação de burocracia.
- Duplicação de regras já existentes no vault.
- Mistura entre documentação e execução.
- Tentação de criar automação antes do desenho estar estável.
- Sobreposição com as regras do Codex já existentes.
- Crescimento da estrutura sem ganho prático.
- Criação de pastas e arquivos demais sem uso real.

O Viny Flow só vale se reduzir atrito. Se aumentar ruído, ele falhou.

## 16. Ordem recomendada de implementação

1. Definir a visão e o escopo mínimo do Viny Flow.
2. Criar a estrutura de pastas base.
3. Criar os primeiros agentes como notas de referência.
4. Criar os workflows principais.
5. Criar os prompts reutilizáveis.
6. Criar os checklists de entrada e saída.
7. Conectar histórico, checkpoint e status operacional.
8. Revisar integração com skills locais.
9. Testar em um fluxo real pequeno.
10. Só depois pensar em ampliar.

## Fechamento

Viny Flow deve ser a versão local, enxuta e controlada da ideia de orquestração: menos “plataforma”, mais disciplina operacional.

O objetivo é que o Codex trabalhe melhor no `Viny Brain` sem depender de uma camada pesada, automática ou difícil de auditar.
