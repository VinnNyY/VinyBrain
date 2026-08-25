# Resolução de Erro de NameServer (NS) no Registro.br

## Metadados

- **Data:** 2026-04-14
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Resolver o erro de `Pesquisa Recusada` no Registro.br preparando o domínio no cPanel antes do apontamento.

## Quando Usar

- Quando o Registro.br recusar a alteração de nameservers.
- Quando o domínio .br ainda não responde no servidor de destino.

## Pré-requisitos

- Status do domínio validado no Registro.br.
- Domínio criado no cPanel.
- IP correto do servidor de destino.

## Passo a Passo Interno

1. Confirmar se o domínio já foi adicionado ao cPanel.
2. Aguardar a sincronização inicial da nova zona DNS.
3. Acessar o Registro.br e inserir os nameservers da StayCloud.
4. Repetir a tentativa apenas depois de validar o ambiente.

## Orientação Possível para Cliente

- Informar que o Registro.br exige que o domínio já esteja preparado no servidor.
- Avisar que pode haver pequena propagação interna antes de a alteração ser aceita.

## Pontos de Atenção

- Não insistir no Registro.br sem preparar o cPanel.
- Erro de digitação no domínio invalida a zona criada.

## Erros Comuns

- Criar o domínio fora do cPanel.
- Tentar salvar NS repetidamente sem aguardar sincronização.
- Ignorar a propagação interna de alguns minutos.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/15z-ELp2u8ySWDEPCZiO9-ogVinVBYaFWsFEcR56ys-o/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:** 

## Materiais Complementares

- `Configuração de Novo Domínio`.
- `Guia Interno Staycloud - Apontamentos DNS`.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- A fonte deixa claro que o Registro.br valida a zona antes de aceitar os NS.
- O procedimento foi resumido sem acrescentar passos que não estavam documentados.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Configuração de Novo Domínio]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Localização e Edição do Arquivo Hosts (Windows vs Server)]]
