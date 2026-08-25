# Plano de Prints

Tutorial extra: `Como configurar um domínio personalizado no Deploy StayCloud`

Status da meta mensal: `12/12 — concluída`

Produção adicional: `1 tutorial extra publicado e validado`

## Regra de segurança

- Usar somente a conta própria de Vinicius, Painel Novo e aplicação descartável do Deploy.
- Não alterar domínio de cliente, domínio de produção, nameserver, domínio principal ou zona DNS sem autorização explícita.
- Capturar originais em `apoio/originais-e-versoes-antigas/`.
- Usar no preview e no WordPress somente arquivos sanitizados de `prints-finais/`.
- Criar o print de DNS externo e o print da aplicação no novo endereço somente se houver autorização explícita e ambiente descartável confirmado.

## Prints planejados

### PRINT 01 — Aplicação correta

Objetivo: mostrar onde abrir a aplicação descartável.

Alvo único: card, nome ou botão da aplicação descartável do Deploy.

Censurar: outros projetos, e-mail, dados de conta, IDs e URLs administrativas.

### PRINT 02 — Área de domínio

Objetivo: mostrar onde configurar o domínio.

Alvo único: termo oficial encontrado no painel, como `Domínios` ou equivalente.

### PRINT 03 — Adicionar domínio

Objetivo: mostrar onde inserir o endereço.

Alvo único: campo real de domínio ou subdomínio.

### PRINT 04 — Instruções DNS

Objetivo: mostrar qual registro precisa ser configurado.

Alvo único: tipo e valor do registro solicitado pelo Deploy.

Censurar: dados privados, IDs, hostnames privados, IPs e registros não relacionados.

### PRINT 05 — Configuração DNS

Criar somente se houver ambiente descartável autorizado.

Objetivo: mostrar o campo exato usado para criar o registro DNS.

Alvo único: registro necessário.

Não mostrar outros registros da zona.

### PRINT 06 — Validação

Objetivo: mostrar o status real apresentado pelo Deploy.

Alvo único: status ou botão de verificação.

### PRINT 07 — Aplicação no novo endereço

Criar somente se a configuração real for concluída.

Objetivo: mostrar a aplicação acessível pelo domínio ou subdomínio.

Alvo único: endereço ou conteúdo da aplicação descartável.

## Critério visual

Cada print deve sustentar exatamente um passo do tutorial: texto do passo -> alvo marcado -> resultado comprovado depois.

Marcação permitida: caixa fina, seta curta, círculo discreto, zoom ou recorte. A marcação não pode cobrir campo, botão, endereço, registro, valor, status, mensagem ou alvo principal.
