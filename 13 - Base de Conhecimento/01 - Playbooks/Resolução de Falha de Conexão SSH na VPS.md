# Resolução de Falha de Conexão SSH na VPS

## Metadados

- **Data:** 17/04
- **Tipo:** Playbook
- **Status:** Postado
- **Autor:** Fael
- **Fonte:** `Conteudos - Base de conhecimento.xlsx`
- **Aba de origem:** `documentos`

## Resumo Objetivo

- Padronizar o diagnóstico e a recuperação de acesso SSH em VPS.

## Quando Usar

- Quando o cliente não consegue conectar por SSH.
- Quando o erro aponta timeout, recusa de conexão, falha de autenticação ou bloqueio de porta.
- Quando é preciso validar o serviço SSH e o acesso pela console.

## Pré-requisitos

- Identificar a mensagem de erro.
- Confirmar se a VPS está online.
- Revisar usuário, IP, porta e método de autenticação.

## Passo a Passo Interno

1. Confirmar se a falha é de rede, autenticação ou indisponibilidade do servidor.
2. Verificar se a VPS responde e se o acesso administrativo está disponível.
3. Revisar usuário, porta e método de autenticação informado.
4. Checar bloqueios de segurança que possam afetar o acesso remoto.
5. Validar novamente após qualquer ajuste e registrar o resultado.

## Resposta / Orientação Possível para Cliente

- Pedir o erro exato que aparece na conexão.
- Confirmar se o cliente usa senha ou chave SSH.
- Orientar a testar novamente após a validação do servidor.

## Pontos de Atenção

- Não desativar firewall permanentemente.
- Não alterar porta SSH sem aviso.
- Não remover `authorized_keys` sem necessidade.

## Erros Comuns

- Concluir que o servidor caiu sem checar a conectividade básica.
- Tentar corrigir a falha sem validar o método de autenticação.
- Reiniciar serviços sem necessidade técnica clara.

## Links Originais

- **Link principal:** https://docs.google.com/document/d/1iYa_g0sD7l-HDEzgUO5BgBOzqxkC_75OD2YtOQrlZuw/edit?tab=t.0#heading=h.llperv16ktme
- **Link complementar:** https://docs.google.com/document/d/1HPQLQiamQCrER3-r37zEJ1SzWLjmlby6QRC5Atbw-l8/edit?usp=sharing

## Materiais Complementares

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- `[[Instalação de Aplicações via Terminal Linux]]`

## Status do Conteúdo

- **Status atual:** Postado
- **Validação da fonte:** preservada no índice e no documento local
- **Pode ser usado como referência final?** Sim

## Observações de Validação

- O texto foi mantido em nível operacional alto, sem expor segredos.
- A relação com instalação e validação de serviços ficou direta.
