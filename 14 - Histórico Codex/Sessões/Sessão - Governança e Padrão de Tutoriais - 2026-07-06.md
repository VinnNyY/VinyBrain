# Sessão - Governança e Padrão de Tutoriais - 2026-07-06

## Resumo da sessão

Esta sessão fechou a fase de governança do `Viny Brain` e consolidou o novo padrão de tutoriais StayCloud para `Painel Novo`.

O ponto central foi a validação de um tutorial piloto simples, visual e 100% no Painel Novo, que passou a servir como referência para os próximos tutoriais.

Também foram criadas as camadas de governança para o vault:

- `Agente Governança do Viny Brain`
- workflow `Auditar Governança do Viny Brain`
- comando manual `/auditar-governanca`
- pasta de relatórios de auditoria

Na sequência, foi feita a primeira auditoria geral, depois a correção dos P1 e por fim a reauditoria P1.

## O que foi feito

- criação do novo agente de governança do vault
- criação do workflow de auditoria estrutural
- criação do comando manual `/auditar-governanca`
- criação da pasta de relatórios de governança
- atualização dos mapas centrais do Viny Brain
- execução da primeira auditoria geral
- correção dos P1 apontados na auditoria
- reauditoria P1 para validar as correções
- consolidação do padrão StayCloud para tutoriais de Painel Novo
- consolidação dos estudos NVIDIA `SkillSpector` e `Agent Skills`

## Arquivos criados

- `17 - Viny Flow/01 - Agentes/Agente Governança do Viny Brain.md`
- `17 - Viny Flow/02 - Workflows/Auditar Governança do Viny Brain.md`
- `17 - Viny Flow/06 - Auditorias de Governança/README.md`
- `17 - Viny Flow/06 - Auditorias de Governança/Auditoria Geral - Viny Brain - 2026-07-06.md`
- `17 - Viny Flow/06 - Auditorias de Governança/Correção P1 - Auditoria Geral - 2026-07-06.md`
- `17 - Viny Flow/06 - Auditorias de Governança/Reauditoria P1 - Viny Brain - 2026-07-06.md`

## Arquivos alterados

- `17 - Viny Flow/README.md`
- `17 - Viny Flow/01 - Agentes/Mapa de Agentes.md`
- `17 - Viny Flow/02 - Workflows/Mapa de Workflows.md`
- `17 - Viny Flow/03 - Comandos/Comandos Reutilizáveis.md`
- `00 - Mapas/MOC - Viny Brain.md`
- `00 - Mapas/Painel Operacional - Viny Brain.md`
- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/README.md`
- `14 - Histórico Codex/Checkpoint Atual.md`

## Decisões tomadas

- o tutorial piloto aprovado vira referência do novo padrão StayCloud
- tutoriais simples do Painel Novo passam a ser produzidos um por vez
- P2 de governança ficam para rodada futura
- a fonte externa de `Transferência de Domínios` só volta quando houver validação segura
- a governança estrutural do vault passa a ter agente, workflow e relatório próprios

## Estado atual

- o `Viny Brain` está organizado o suficiente para seguir produzindo
- o padrão de tutoriais StayCloud está mais claro
- os P1 da auditoria foram corrigidos e validados no vault local
- nenhum P0 novo foi identificado na reauditoria
- os P2 continuam para manutenção futura

## P0 / P1 / P2 atuais

- **P0:** nenhum confirmado
- **P1:** nenhum pendente no vault local
- **P2:** notas órfãs importantes, índice/entrada para áreas de produção em lote, normalização gradual de links longos e nomes antigos

## Tutorial piloto aprovado como padrão

- `Como encontrar seus serviços ativos no Painel Novo da StayCloud`

O piloto validado reforçou estas regras:

- falar com o leitor usando `você`
- manter o fluxo 100% no Painel Novo
- usar prints reais com marcação forte
- evitar cPanel quando houver caminho direto no painel
- escrever para cliente final, não para operação interna

## Regras novas para tutoriais

- se a ação existir no Painel Novo, o tutorial não deve mandar para o cPanel
- clique importante precisa ficar marcado
- print sem destaque só entra se a tela for muito óbvia
- o texto precisa orientar onde clicar e o que ver na tela
- tutoriais finais não podem ficar com placeholder de print
- o cliente leigo precisa conseguir acompanhar sem decodificar bastidor interno

## Estudos NVIDIA concluídos

- `NVIDIA SkillSpector`
- `NVIDIA Agent Skills`

Aprendizados consolidados:

- skills precisam ter identidade, escopo, critério de qualidade e risco
- segurança vem antes de instalação ou automação
- auditoria de skills e governança de catálogo são parte do desenho, não um detalhe

## Pendências

- validar externamente a fonte de `Transferência de Domínios (Nacionais e Internacionais)` quando o tema voltar a ser usado
- manter a produção de tutoriais em lote pequeno
- tratar P2 de governança em rodada futura

## Próximo passo exato

1. Seguir com os tutoriais simples do Painel Novo usando o tutorial piloto aprovado como padrão.
2. Criar os próximos tutoriais um por vez, não em lote grande.
3. Deixar os P2 de governança para uma rodada futura.
4. Validar externamente a fonte de `Transferência de Domínios` quando esse tema voltar a ser usado.

## Observação

- O arquivo de referência solicitado `03 - Tutoriais/Estudos de Padrão StayCloud/Tutorial Referência - Painel Novo.md` não estava presente no vault local durante a leitura desta sessão.
