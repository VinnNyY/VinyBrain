# Auditar Playbooks

## 1. Objetivo

Documentar o processo para auditar playbooks da Base de Conhecimento sem alterar os documentos originais, avaliando qualidade, organização, conexões e segurança.

## 2. Quando usar

Use este workflow quando:

- houver lote novo de playbooks importados;
- for preciso revisar uma amostra ou um conjunto inteiro;
- o Índice Geral ou o Mapa por Temas precisarem de validação;
- houver dúvida sobre separação entre conteúdo interno e conteúdo para cliente;
- for necessário localizar excesso de conexões, metadados fracos ou riscos sensíveis.

## 3. Entrada esperada

- playbooks importados ou em análise;
- `Índice Geral`;
- `Mapa por Temas`;
- `Modelo de Playbook Importado`;
- regras de playbooks;
- links originais e complementares, quando existirem.

## 4. Agentes envolvidos

- **Agente Base de Conhecimento**: confere padrão, organização e relação com a base.
- **Agente Auditor**: avalia consistência, excesso de link, utilidade e lacunas.
- **Agente Segurança**: verifica exposição sensível, dados reais e origem dos links.
- **Agente Redator**: resume o resultado da auditoria de forma clara e objetiva.

## 5. Etapas de auditoria

### Metadados

Verificar:

- título;
- data;
- tipo;
- status;
- autor;
- origem;
- categoria sugerida.

### Links originais

Verificar:

- se o link principal existe;
- se o link complementar faz sentido;
- se a origem foi preservada;
- se não há links quebrados ou irrelevantes.

### Status pendente/postado

Verificar:

- se o status faz sentido com o conteúdo;
- se o material está marcado corretamente;
- se há pendência documentada na origem.

### Separação interno/cliente

Verificar:

- se o playbook é interno;
- se o conteúdo não está misturado com tutorial público;
- se a versão para cliente ficou separada quando aplicável.

### Conexões internas

Verificar:

- se os links internos são temáticos;
- se não há excesso de links;
- se o playbook não virou hub;
- se a navegação respeita a utilidade real.

### Índice Geral

Verificar:

- se o item aparece na categoria correta;
- se os metadados batem com a origem;
- se o status está coerente;
- se a entrada está legível para navegação.

### Mapa por Temas

Verificar:

- se o playbook aparece no tema certo;
- se não está duplicado em temas sem relação;
- se o vínculo tem utilidade real para navegação.

### Dados sensíveis

Verificar:

- se o texto contém credenciais;
- se há dados reais de cliente;
- se há caminhos locais indevidos;
- se existe exposição desnecessária de informação sensível.

## 6. Critérios de aprovação

O playbook auditado é aprovado quando:

- os metadados estão coerentes;
- os links originais fazem sentido;
- o status está correto;
- a separação interno/cliente está clara;
- as conexões internas são úteis e limitadas;
- o Índice Geral está coerente;
- o Mapa por Temas está coerente;
- não há dados sensíveis expostos;
- o documento é útil como referência.

## 7. Critérios de reprovação

Reprovar quando houver:

- metadados incorretos;
- links quebrados ou sem relação;
- status incoerente;
- mistura entre interno e cliente;
- excesso de conexão artificial;
- playbook tentando virar hub;
- classificação de tema errada;
- dados sensíveis no texto;
- origem ou referência comprometida.

## 8. Checklist final

- [ ] Metadados conferidos
- [ ] Links originais conferidos
- [ ] Status conferido
- [ ] Separação interno/cliente conferida
- [ ] Conexões internas conferidas
- [ ] Índice Geral conferido
- [ ] Mapa por Temas conferido
- [ ] Dados sensíveis verificados
- [ ] Resultado classificado
- [ ] Próximo passo registrado

## 9. Prompt reutilizável para iniciar auditoria

`Siga o workflow Auditar Playbooks. Leia o Índice Geral, o Mapa por Temas, o modelo de playbook e as regras da Base de Conhecimento, e audite os playbooks sem alterar os arquivos originais.`

