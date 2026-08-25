# Configuração de Novo Domínio

## Metadados

- **Data:** 2026-05-27
- **Tipo:** Playbook
- **Status:** Pendente
- **Autor:** Maria Eduarda
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Organizar a criação de um novo domínio no cPanel, o apontamento de DNS e a preparação para instalação do site.

## Quando Usar

- Quando o cliente acabou de comprar um domínio.
- Quando o domínio precisa ser adicionado à hospedagem e apontado para a StayCloud.

## Pré-requisitos

- Acesso ao cPanel.
- Acesso ao painel onde o domínio foi comprado.
- Nameservers corretos da hospedagem.

## Passo a Passo Interno

1. Criar o domínio no cPanel antes de apontar os DNS.
2. Localizar os nameservers da hospedagem.
3. Fazer o apontamento no registrador do domínio.
4. Aguardar a propagação antes de seguir para a instalação do WordPress.

## Orientação Possível para Cliente

- Explicar que primeiro o servidor precisa estar preparado para receber o domínio.
- Orientar que a propagação pode levar de 2 a 24 horas.

## Pontos de Atenção

- Não manter `Share document root` marcado quando o domínio for novo e independente.
- Não instalar o site antes da propagação.
- Não forçar HTTPS cedo demais.

## Erros Comuns

- Inverter a ordem entre criar o domínio e apontar os DNS.
- Apontar DNS sem validar o ambiente.
- Compartilhar a raiz do documento por engano.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/12iWCQir0xQj7PoQ2I7szZyO3fShf3on_R9R2uKK1YYE/edit?tab=t.0
- **Link complementar:** https://ajuda.staycloud.com.br/docs/como-adicionar-e-remover-dominios-no-cpanel/

## Materiais Complementares

- `Como Renovar o Domínio`.
- `Resolução de Erro de NameServer (NS) no Registro.br`.
- `Conferência de Certificado SSL`.

## Status do Conteúdo

- **Status na planilha:** Pendente
- **Validação da fonte:** conteúdo extraído do Google Docs e resumido localmente
- **Pode ser usado como referência final?** Não, até revisão manual

## Observações de Validação

- O documento original já aponta a ordem correta: criar domínio, depois apontar DNS, depois instalar o site.
- Há relação direta com propagação e SSL, mas o status segue pendente.

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Como Renovar o Domínio]]
- [[Resolução de Erro de NameServer (NS) no Registro.br]]
- [[Conferência de Certificado SSL]]
