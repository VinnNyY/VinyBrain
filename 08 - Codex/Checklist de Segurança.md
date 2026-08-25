# Checklist de Seguranca

## Antes de editar qualquer coisa

- [ ] Ler `08 - Codex/Regras do Codex.md`.
- [ ] Ler o contexto da tarefa.
- [ ] Confirmar a presenca dos arquivos-base obrigatorios do fluxo.
- [ ] Confirmar se existe risco de segredo, producao ou sistema sensivel.
- [ ] Confirmar se a mudanca e apenas documental ou organizacional.

## `.env`, tokens e credenciais

- [ ] Nao escrever senhas em notas.
- [ ] Nao escrever tokens em logs.
- [ ] Nao copiar chaves de API para arquivos permanentes.
- [ ] Nao versionar segredos no Git.
- [ ] Nao compartilhar credenciais em historico ou checkpoint.

## Git e repositorios

- [ ] Confirmar se o arquivo deve entrar no Git.
- [ ] Evitar commits com dados temporarios ou sensiveis.
- [ ] Revisar se a mudanca esta no arquivo certo.
- [ ] Nao mexer em branches ou historicos sem necessidade.
- [ ] Validar se o que sera salvo faz sentido como documentacao permanente.
- [ ] Fazer backup local manual do vault antes de mudancas grandes.

## Producao e ambiente

- [ ] Nao alterar producao sem confirmacao.
- [ ] Nao trocar configuracoes criticas do sistema sem aprovacao.
- [ ] Nao ativar automacoes que possam agir em contas reais sem revisao.
- [ ] Nao instalar nada sem plano e confirmacao.
- [ ] Nao assumir que uma integracao local e segura para producao.

## Antes de finalizar

- [ ] Conferir se nenhum segredo apareceu em texto.
- [ ] Conferir se o arquivo ficou organizado.
- [ ] Conferir se o historico foi atualizado quando necessario.
- [ ] Conferir se existe algum passo pendente de validacao.

## Regra de ouro

Se houver duvida sobre seguranca, parar e pedir validacao antes de seguir.
