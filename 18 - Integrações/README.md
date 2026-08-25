# Integrações

Base documental para planejar integrações futuras entre o `Viny Brain`, o `Notion` e o `ClickUp`.

## Estado atual

- Fase manual e conceitual.
- Nenhuma API conectada na camada operacional.
- Nenhum token solicitado aqui.
- Nenhuma credencial registrada.
- Nenhuma sincronização automática ativa.
- A fase técnica segura de API existe em modo de teste e dry-run, com credenciais fora do vault.
- A fase atual da camada API é: `API segura / testes / dry-run / sem criação real`.

## Papel das ferramentas

- Esta nota: visão geral das integrações.
- [[18 - Integrações/Plano de Integração - Notion e ClickUp|Plano de Integração - Notion e ClickUp]]
- [[18 - Integrações/Mapeamento de Dados|Mapeamento de Dados]]
- [[18 - Integrações/Regras de Segurança - Integrações|Regras de Segurança - Integrações]]
- [[18 - Integrações/Decisões - Integrações|Decisões - Integrações]]
- [[18 - Integrações/API/README|API segura]]

## Subáreas

- [[18 - Integrações/Notion/README|Notion]]
- [[18 - Integrações/ClickUp/README|ClickUp]]
- [[18 - Integrações/API/README|API]]
- [[18 - Integrações/Pilotos/Piloto 01 - Reunião para Notion e ClickUp|Pilotos]]
- [[18 - Integrações/Pilotos/Piloto 02 - Demanda para ClickUp|Piloto 02]]

## Regra geral

- O `Viny Brain` continua sendo a memória principal, o lugar de raciocínio e o histórico.
- `Notion` e `ClickUp` entram apenas como camadas operacionais externas, cada uma com função bem definida.
- Qualquer fase de API real deve ser tratada como nova etapa, com revisão de segurança antes de qualquer conexão.
- A fase API, quando usada, começa por autenticação e dry-run, nunca por criação real.
