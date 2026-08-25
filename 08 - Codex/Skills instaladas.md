# Skills instaladas

## Escopo

Skills instaladas no projeto `Viny Brain` para uso pelo agente `codex`.

## Instalação atual

| Skill | Origem | Onde foi instalada | Para que serve | Quando usar | Exemplo de prompt | Riscos / cuidados | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `writing-guidelines` | `vercel-labs/agent-skills` | `.agents/skills/writing-guidelines` | Revisar documentação, voz, tom e conformidade de escrita. | Quando houver revisão de docs, notas, textos ou relatórios. | `Revise estes arquivos segundo as Writing Guidelines: <arquivos>` | A skill consulta regras externas; confirme se a fonte continua atual antes de usar em massa. | Instalado no projeto |
| `web-design-guidelines` | `vercel-labs/agent-skills` | `.agents/skills/web-design-guidelines` | Revisar UI e acessibilidade segundo Web Interface Guidelines. | Quando houver análise de interface, layout ou UX. | `Revise este layout segundo as Web Interface Guidelines: <arquivo>` | Pode puxar recomendações mais rígidas do que o contexto do projeto pede; usar com critério. | Instalado no projeto |
| `staycloud-tutorial-guidelines` | Criada localmente no `Viny Brain` | `.agents/skills/staycloud-tutorial-guidelines` | Guiar criação, revisão e auditoria de tutoriais StayCloud com padrão próprio de texto, estrutura e prints. | Quando houver tutorial StayCloud novo, revisão visual, auditoria de prints ou preparo local para WordPress. | `Aplique a staycloud-tutorial-guidelines neste tutorial: <arquivo>` | Skill específica do fluxo StayCloud; deve ser combinada com revisão humana e com as skills genéricas quando houver ajuste de texto ou layout. | Instalado no projeto |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | `.agents/skills/vercel-react-best-practices` | Guiar escrita e revisão de React/Next.js com foco em performance. | Quando houver componentes React, páginas Next.js ou refatoração de performance. | `Aplique as Vercel React Best Practices neste componente: <arquivo>` | Focado em React/Next.js; não é útil fora desse stack. | Instalado no projeto |
| `vercel-composition-patterns` | `vercel-labs/agent-skills` | `.agents/skills/vercel-composition-patterns` | Ajudar com padrões de composição e arquitetura de componentes React. | Quando houver componentes com muitos props booleanos, APIs flexíveis ou composição complexa. | `Revise esta API de componentes usando Composition Patterns: <arquivo>` | Pode sugerir refatoração estrutural; validar impacto antes de mexer em código sensível. | Instalado no projeto |
| `vercel-react-view-transitions` | `vercel-labs/agent-skills` | `.agents/skills/vercel-react-view-transitions` | Guiar animações e transições com View Transition API em React. | Quando houver necessidade de transições de página, estado ou navegação. | `Avalie se View Transitions fazem sentido neste fluxo: <arquivo>` | Não aplicar por padrão; usar só quando a transição realmente comunica continuidade espacial. | Instalado no projeto |

## Observações

- A instalação foi feita no escopo do projeto, não global.
- As skills foram copiadas para `.agents/skills/` pelo agente `codex`.
- O conjunto instalado foi reduzido para evitar ruído e manter o ambiente fácil de auditar.
- `writing-guidelines` foi validada em uso real no arquivo `08 - Codex/Prompt de Inicialização.md` e exigiu apenas ajustes leves.

## Próxima decisão

- Se o fluxo pedir mais cobertura de Vercel ou UI, revisar antes se vale instalar `vercel-optimize` ou manter o conjunto atual enxuto.
