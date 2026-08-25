# Plano de Prints

Tutorial: Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo da StayCloud

Status: em captura e validação real.

## Regra visual

Validar sempre:

texto do passo -> elemento marcado -> tela aberta depois.

Cada print deve ter somente um alvo principal, exceto o Print 01, que compara dois botões e usa marcações numeradas.

## Prints planejados

### PRINT 01 - Localização dos dois botões

- Objetivo: mostrar que `Ver detalhes` e `Gerenciar` são opções diferentes no card do serviço.
- Alvos:
  1. `Ver detalhes`
  2. `Gerenciar`
- Marcação: números 1 e 2 com setas curtas.
- Não marcar: alerta, fatura, vencimento, CPU, RAM, disco, outro serviço.

### PRINT 02 - Destino de Ver detalhes

- Objetivo: comprovar a tela real aberta após clicar em `Ver detalhes`.
- Alvo principal: título, seção ou informação que confirme o destino observado.
- Não marcar ação interna que não será usada.

### PRINT 03 - Botão Gerenciar

- Objetivo: mostrar que `Gerenciar` deve ser usado para abrir os recursos operacionais do serviço.
- Alvo único: botão `Gerenciar`.
- Não marcar `Ver detalhes`.

### PRINT 04 - Destino de Gerenciar

- Objetivo: comprovar a tela de gerenciamento aberta.
- Alvo principal: título da área, menu ou abas que confirmem que o serviço foi aberto para gerenciamento.
- Não navegar para recursos específicos além do necessário.

## Dados a censurar

- domínio;
- nome do serviço;
- e-mail;
- nome pessoal;
- ID;
- valores;
- data de vencimento;
- informações financeiras;
- hostname;
- IP;
- notificações;
- dados da conta.

## Critérios de aprovação

- Print 01 usa somente as marcações 1 e 2.
- Print 02 comprova o destino de `Ver detalhes`.
- Print 03 marca somente `Gerenciar`.
- Print 04 comprova o destino de `Gerenciar`.
- Nenhuma marcação cobre botão, texto ou campo.
- Nenhuma seta aponta para banner, fatura, alerta ou serviço errado.
- Somente imagens sanitizadas entram em `prints-finais/`.
