# Auditoria de Alvos e Marcações dos Prints

Data: 2026-07-23

## Resumo

- Total de tutoriais analisados: 2
- Total de prints analisados: 6
- Prints corretos na auditoria local final: 6
- Prints incorretos identificados antes da correção: 2
- Prints corrigidos localmente: 2
- Prints pendentes: 2
- Motivo das pendências: as URLs públicas atuais ainda apontam para versões anteriores; novo upload é necessário antes da publicação.

## Relação de auditoria

| Tutorial | Passo | Ação descrita | Alvo esperado | Alvo marcado no print | Resultado |
|---|---|---|---|---|---|
| Como acompanhar seus chamados no Painel Novo da StayCloud | 1. Abra o Suporte | Abrir a área de Suporte no menu lateral | Menu Suporte | Menu Suporte | correto |
| Como acompanhar seus chamados no Painel Novo da StayCloud | 2. Selecione Meus chamados | Selecionar a aba Meus chamados dentro de Suporte | Aba Meus chamados | Aba Meus chamados | correto |
| Como acompanhar seus chamados no Painel Novo da StayCloud | 3. Confira o status do chamado | Conferir lista e filtros de status | Filtros de status/lista de chamados | Filtros de status/lista de chamados | correto |
| Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | 1. Acesse o serviço correto | Localizar o serviço e clicar em Gerenciar | Botão Gerenciar do serviço correto | Antes: Ver detalhes; depois: Gerenciar | marcação errada corrigida localmente; pendente de upload |
| Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | 2. Abra a área de e-mails | Abrir a área E-mails no serviço | Aba E-mails | Aba E-mails | correto |
| Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | 3. Consulte o uso e a cota | Conferir uso atual e cota na linha da conta | Valores de uso e cota | Antes: aba E-mails; depois: valores de uso/cota | marcação errada corrigida localmente; pendente de upload |

## Conferência por print

### Chamados — passo 1

- Ação do texto: abrir Suporte.
- Elemento esperado: item Suporte no menu lateral.
- A marcação aponta para o elemento correto: sim.
- Existe outra seta que pode confundir: não.
- A marcação cobre o botão: não.
- Contexto suficiente: sim.
- Etapa seguinte confirma o fluxo: sim, mostra a área de Suporte.
- Dados sensíveis visíveis: não; dados relevantes estão censurados.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.

### Chamados — passo 2

- Ação do texto: selecionar Meus chamados.
- Elemento esperado: aba Meus chamados.
- A marcação aponta para o elemento correto: sim.
- Existe outra seta que pode confundir: não.
- A marcação cobre o botão: não.
- Contexto suficiente: sim.
- Etapa seguinte confirma o fluxo: sim, mostra a lista/filtros de chamados.
- Dados sensíveis visíveis: não.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.

### Chamados — passo 3

- Ação do texto: conferir status do chamado.
- Elemento esperado: filtros/lista de status dos chamados.
- A marcação aponta para o elemento correto: sim.
- Existe outra seta que pode confundir: não.
- A marcação cobre o botão: não.
- Contexto suficiente: sim.
- Etapa seguinte confirma o fluxo: não há etapa posterior, mas o print corresponde ao resultado esperado.
- Dados sensíveis visíveis: não.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.

### Uso de e-mail — passo 1

- Ação do texto: localizar o serviço correto e clicar em Gerenciar.
- Elemento esperado: botão Gerenciar do serviço correto.
- A marcação aponta para o elemento correto: sim na versão local corrigida.
- Existe outra seta que pode confundir: não na versão local corrigida.
- A marcação cobre o botão: não.
- Contexto suficiente: sim; o recorte mantém a área Sites e infraestrutura e o card do serviço.
- Etapa seguinte confirma o fluxo: sim, mostra a página do serviço com a aba E-mails.
- Dados sensíveis visíveis: não; dados sensíveis permanecem censurados.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.
- Pendência: novo upload necessário, pois a URL pública atual ainda aponta para a versão anterior.

Arquivo corrigido:

`03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints-finais/consultar-uso-email-painel-novo-staycloud-01-sanitizado.png`

Versão anterior preservada:

`03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/apoio/originais-e-versoes-antigas/consultar-uso-email-painel-novo-staycloud-01-sanitizado-com-marcacao-incorreta-ver-detalhes.png`

### Uso de e-mail — passo 2

- Ação do texto: abrir a área de e-mails.
- Elemento esperado: aba E-mails.
- A marcação aponta para o elemento correto: sim.
- Existe outra seta que pode confundir: não.
- A marcação cobre o botão: não.
- Contexto suficiente: sim.
- Etapa seguinte confirma o fluxo: sim, mostra a lista de caixas de e-mail.
- Dados sensíveis visíveis: não.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.

### Uso de e-mail — passo 3

- Ação do texto: consultar uso e cota.
- Elemento esperado: valores de uso atual e cota na linha da conta.
- A marcação aponta para o elemento correto: sim na versão local corrigida.
- Existe outra seta que pode confundir: não na versão local corrigida.
- A marcação cobre o valor: não.
- Contexto suficiente: sim; o recorte mantém a seção Caixas de e-mail e a linha da conta.
- Etapa seguinte confirma o fluxo: não há etapa posterior, mas o print corresponde ao resultado esperado.
- Dados sensíveis visíveis: não; endereço e dados sensíveis permanecem censurados.
- Legenda corresponde ao alvo: sim.
- ALT text corresponde à ação real: sim.
- Pendência: novo upload necessário, pois a URL pública atual ainda aponta para a versão anterior.

Arquivo corrigido:

`03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints-finais/consultar-uso-email-painel-novo-staycloud-03-sanitizado.png`

Versão anterior preservada:

`03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/02 - Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/apoio/originais-e-versoes-antigas/consultar-uso-email-painel-novo-staycloud-03-sanitizado-com-marcacao-incorreta-aba-emails.png`

## Necessidade de novo upload

| Tutorial | Mídia | Situação | Novo upload necessário |
|---|---:|---|---|
| Uso de e-mail | 2805 | Print corrigido localmente; URL pública ainda aponta para versão anterior | sim |
| Uso de e-mail | 2801 | Print corrigido localmente; URL pública ainda aponta para versão anterior | sim |

## Status

- Tutorial de chamados: prints aprovados.
- Tutorial de uso de e-mail: bloqueado para publicação até upload das versões locais corrigidas e atualização das URLs públicas.

Nada foi publicado, enviado por upload, apagado ou alterado no WordPress nesta execução.
