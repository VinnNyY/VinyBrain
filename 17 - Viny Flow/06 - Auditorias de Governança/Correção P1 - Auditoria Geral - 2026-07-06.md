# Correção P1 - Auditoria Geral - 2026-07-06

## Problemas P1 corrigidos

1. `Mapa por Temas` com link frágil no item de MySQL `#2006`.
2. `Mapa por Temas` com item de `Transferência de Domínios (Nacionais e Internacionais)` sem arquivo local localizado.
3. `README` da área `Inteligência do Cérebro` usando links diretos para pastas.

## Arquivos alterados

- `13 - Base de Conhecimento/00 - Índice/Mapa por Temas.md`
- `17 - Viny Flow/05 - Inteligência do Cérebro/README.md`

## Antes / Depois resumido

### Mapa por Temas

- Antes: link para MySQL com `#2006` em formato frágil.
- Depois: link estável com escape do `#`.

- Antes: item `Transferência de Domínios (Nacionais e Internacionais)` apontava para uma nota inexistente no vault.
- Depois: o item ficou ligado ao `Índice Geral` com observação de validação, para não inventar arquivo que não existe localmente.

### Inteligência do Cérebro

- Antes: `README` apontava para pastas como entrada principal.
- Depois: o `README` aponta para arquivos de entrada mais úteis:
  - `Templates/README.md`
  - `Implementações Operacionais/README.md`
  - `Skills Candidatas/viny-ingest-source.md`

## Links corrigidos

- `Playbook: Resolução de Erro MySQL \#2006 (StayCare Technical Support)`
- `Transferência de Domínios (Nacionais e Internacionais)` com observação `precisa validar`
- `Templates/README.md`
- `Implementações Operacionais/README.md`
- `Skills Candidatas/viny-ingest-source.md`

## Itens que ainda precisam validar

- Confirmar se o arquivo de `Transferência de Domínios (Nacionais e Internacionais)` existe em outra origem fora do vault local.
- Confirmar se `Skills Candidatas` deve ganhar um `README.md` próprio no futuro. Isso ficou como sugestão P2, não foi alterado agora.

## Recomendação

Rodar uma nova auditoria geral depois dessa correção para confirmar se os mapas e as entradas principais ficaram coerentes.
