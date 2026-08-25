# Decisão - Ruflo no Viny Brain

## Critério

Avaliar o que vale incorporar no `Viny Brain` sem instalar o Ruflo inteiro nem herdar a superfície arriscada do ecossistema Claude Code.

## Tabela de decisão

| Recurso Ruflo | O que faz | Risco | Benefício | Aplicar no Viny Brain? | Adaptar manualmente? | Adiar? | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `init` completo | Cria integração ampla com arquivos locais, hooks, memória e possível daemon | Alto | Alto, mas invasivo | Não | Não literalmente | Sim | Só faz sentido após teste mínimo muito bem controlado |
| `--minimal` | Tenta reduzir a instalação para uma base menor | Médio | Médio | Talvez, mas não agora | Sim | Sim | Ainda pode deixar resíduos e comportamento inesperado |
| `--no-global` | Evita mexer em `~/.claude/CLAUDE.md` | Baixo | Alto para segurança | Sim, como requisito se houver teste futuro | Sim | Não | É a primeira trava de segurança relevante |
| `--skip-claude` | Pula a parte do Claude Code | Médio | Médio | Talvez | Sim | Sim | Útil para separar runtime local de integração com Claude |
| `--only-claude` | Cria só a integração Claude | Médio | Baixo a médio | Não como prioridade | Parcialmente | Sim | Pouco útil para o foco atual, que é Codex + vault |
| `plugins` | Gerencia plugins via registry IPFS | Médio a alto | Médio | Não no estado atual | Sim | Sim | A existência de registry na rede aumenta a superfície de risco |
| `plugins list` / `search` | Lista ou busca plugins sem instalar | Baixo a médio | Médio | Sim, em laboratório | Sim | Não | Útil para pesquisa, não para execução permanente |
| `plugins install` | Instala plugin a partir do registry | Alto | Médio | Não agora | Não | Sim | Pode puxar dependências e criar arquivos fora do escopo mental esperado |
| `plugins create` | Scaffold de novo plugin | Médio | Médio | Não | Sim, se houver necessidade futura | Sim | Interessante como inspiração, não como ação imediata |
| `status` | Exibe estado/saúde da instalação atual | Baixo | Alto | Sim, em laboratório | Sim | Não | Subcomando mais promissor da superfície atual |
| `update` | Atualiza componentes mantendo estado | Médio | Médio | Talvez mais tarde | Sim | Sim | Exige saber exatamente o que vai tocar |
| `migrate` | Faz transição entre versões/formatos | Alto | Médio | Não por enquanto | Não | Sim | Mudança de layout/config aumenta chance de resíduos |
| `task` | Orquestra tarefas | Médio | Alto | Sim, como conceito | Sim | Não | Pode virar o padrão que vale adaptar para Codex |
| `benchmark` | Mede performance/custos/capacidade | Baixo | Alto | Sim, se isolado | Sim | Não | Útil para comparar impacto antes de adoção |
| `benchmark` com embeddings | Testa subsistema de embeddings e modelos ONNX | Alto | Baixo a médio | Não por enquanto | Não | Sim | A dependência de rede/modelos foge da meta de leitura simples |
| `hooks` | Configuração de gatilhos automáticos | Alto | Alto, mas arriscado | Não | Só o conceito | Sim | É um dos maiores vetores de bagunça operacional |
| `daemon` / `start-daemon` | Mantém processo em background | Alto | Médio | Não | Não | Sim | Incompatível com o objetivo de ambiente limpo e auditável |
| `start-all` | Sobe todo o stack automaticamente | Muito alto | Alto | Não | Não | Sim | É exatamente o tipo de atalho que não cabe no Viny Brain |
| `--cloud-mcp` | Registra MCP externo na instalação | Alto | Médio | Não | Não | Sim | Aumenta exposição e dependência de rede/credenciais |
| `--dual` | Integra Claude Code e Codex no mesmo fluxo | Alto | Médio | Não por enquanto | Só como ideia | Sim | Interessante em tese, mas cedo demais para o vault atual |
| `--all-agents` | Instala o conjunto completo de agentes | Médio a alto | Baixo a médio | Não | Não | Sim | Excesso de superfície para o que o Viny Brain precisa |
| `skills` antigo | Suporte de skills como unidade de capacidade | Baixo a médio | Médio | Sim, como conceito | Sim | Não | No estudo atual, a versão consultada não expôs esse comando |
| `memory` / RAG | Memória e busca semântica | Médio | Alto | Sim, como arquitetura manual | Sim | Não | O conceito é útil; a implementação precisa ser adaptada ao vault |

## Decisão prática

- Não instalar Ruflo inteiro no `Viny Brain` agora.
- Não copiar hooks, daemon, MCP automático nem registry remoto como padrão do vault.
- Aproveitar apenas os conceitos que ajudam organização: memória, tarefas, benchmark, revisão e workflows.
- Se houver próximo teste, manter só no laboratório e usar uma leitura da CLI atual para confirmar os subcomandos reais antes de qualquer init.

## Recomendação final

No estado atual, o Ruflo entra como referência de arquitetura e não como dependência do `Viny Brain`.

O melhor uso agora é:

1. observar;
2. medir;
3. adaptar manualmente;
4. adiar instalação permanente.
