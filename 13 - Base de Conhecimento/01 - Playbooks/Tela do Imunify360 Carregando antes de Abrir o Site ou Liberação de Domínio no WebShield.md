# Tela do Imunify360 Carregando antes de Abrir o Site ou Liberação de Domínio no WebShield

## Metadados

- **Data:** May 28, 2026
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Vinicius Alves
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Liberar um domínio no WebShield do Imunify360 quando a proteção estiver exibindo tela de verificação antes da abertura do site.

## Quando Usar

- Quando o cliente relatar tela de verificação do Imunify360.
- Quando uma aplicação legítima estiver sendo travada pelo WebShield.

## Pré-requisitos

- Acesso root ao servidor.
- Acesso ao terminal via WHM ou SSH.
- Confirmação do domínio correto.

## Passo a Passo Interno

1. Confirmar o domínio e a legitimidade do caso.
2. Executar o comando de whitelist do domínio no Imunify360.
3. Validar o retorno `OK`.
4. Testar novamente em aba anônima e, se possível, em outra rede.

## Orientação Possível para Cliente

- Informar que a tela de verificação foi liberada para o domínio.
- Pedir novo teste em aba anônima ou navegador diferente.

## Pontos de Atenção

- Não liberar domínio incorreto.
- Não desativar o Imunify360 globalmente.
- Não aplicar a liberação sem validação do caso.

## Erros Comuns

- Executar comando como root sem confirmar o servidor.
- Liberar domínio de outro cliente.
- Assumir que toda tela de verificação é falha de DNS.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1FNcd0HhXHf_YmhbDB8OwT1rGstASSBVVSDkZrVLu_v0/edit?tab=t.0
- **Link complementar:** 

## Materiais Complementares

- Documentação da cPanel sobre whitelist no Imunify360.
- Documentação da CloudLinux sobre WebShield.

## Status do Conteúdo

- **Status na planilha:** Postado
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- O comando principal da fonte é `imunify360-agent whitelist domain add example.com`.
- A validação final depende de novo teste do domínio após a liberação.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Resolução de Verificação de Acesso via Cloudflare]]
- [[Apontamento Local via Arquivo hosts no Linux]]
- [[Otimização de Cache na Cloudflare]]
