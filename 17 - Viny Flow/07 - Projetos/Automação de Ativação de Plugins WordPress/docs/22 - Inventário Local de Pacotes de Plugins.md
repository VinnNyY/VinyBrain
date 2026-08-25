# Inventário Local de Pacotes de Plugins

## Objetivo

Esta etapa faz apenas leitura estrutural dos pacotes ZIP guardados fora do vault, em `/home/vinicius-alves/Documentos`.

Ela serve para identificar pacotes WordPress disponíveis para a automação, com prioridade para:

- Elementor Pro
- WP Rocket

## Onde ficam os pacotes reais

Os pacotes premium permanecem fora do vault, em:

`/home/vinicius-alves/Documentos`

O repositório do Viny Brain armazena apenas:

- código;
- documentação;
- metadados seguros;
- modelos de registro.

## O que o inventário faz

- percorre o diretório informado recursivamente;
- localiza arquivos `.zip`;
- inspeciona a estrutura do ZIP com `zipfile`;
- lê cabeçalhos WordPress diretamente dos arquivos internos;
- identifica nome, versão, slug e arquivo principal;
- classifica o pacote como válido, ambíguo ou inválido;
- compara versões locais do mesmo plugin;
- prepara um candidato local para instalação futura, sem instalar nada.

## O que o inventário não faz

- não extrai ZIPs permanentemente;
- não copia pacotes para o vault;
- não altera, renomeia ou apaga arquivos em `Documentos`;
- não executa PHP;
- não envia ZIP para WordPress;
- não instala ou ativa plugin;
- não salva licenças, chaves ou credenciais.

## Como rodar

Dry-run somente leitura:

```bash
python "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/local_plugin_package_inventory.py" \
  --source "/home/vinicius-alves/Documentos" \
  --dry-run
```

Escrita do registro externo, somente após confirmação explícita:

```bash
python "17 - Viny Flow/07 - Projetos/Automação de Ativação de Plugins WordPress/api-scanner/local_plugin_package_inventory.py" \
  --source "/home/vinicius-alves/Documentos" \
  --write-registry
```

## Interpretação

- `VALID_PACKAGE`: estrutura reconhecida de plugin WordPress, ZIP íntegro e arquivo principal identificado.
- `REVIEW_PACKAGE`: parece plugin, mas a estrutura é ambígua ou incompleta.
- `INVALID_PACKAGE`: ZIP corrompido ou sem estrutura identificável de plugin.
- `DUPLICATE_VERSION`: mesma versão localizada mais de uma vez para o mesmo plugin.
- `OLDER_VERSION`: versão local mais antiga do mesmo plugin.
- `LATEST_CANDIDATE`: versão local mais recente identificada entre os pacotes encontrados.

## Seleção do pacote

O pacote selecionável é apenas o candidato local com melhor versão e estrutura válida.

Essa seleção não instala, não ativa e não substitui a decisão humana.

## Registro operacional externo

Quando necessário, o inventário pode atualizar o registro em:

`/home/vinicius-alves/.config/viny-integrations/plugin-packages.json`

Esse arquivo fica fora do vault e contém apenas metadados seguros:

- nome do plugin;
- slug;
- versão;
- caminho do pacote;
- hash SHA-256;
- status;
- indicação de seleção;
- observações.

## Garantias

- nenhum ZIP é alterado;
- nenhum ZIP é movido;
- nenhum ZIP é copiado para o vault;
- nenhum PHP é executado;
- nenhuma licença é impressa;
- nenhum segredo é salvo;
- a etapa é apenas read-only.
