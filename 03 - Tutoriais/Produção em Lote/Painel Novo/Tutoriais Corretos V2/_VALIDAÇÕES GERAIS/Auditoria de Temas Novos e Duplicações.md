# Auditoria de temas novos e duplicações

Data: 2026-07-27

Fonte oficial obrigatória auditada:
https://ajuda.staycloud.com.br/ajuda-category/painel-novo/

Fontes locais auditadas:

- `03 - Tutoriais/Produção em Lote/Painel Novo/`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/`
- `03 - Tutoriais/Modelos Aprovados - StayCloud/`
- `03 - Tutoriais/Estudos de Padrão StayCloud/`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Fila de Produção - Painel Novo.md`
- `03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/00 - BACKLOG DE IDEIAS.md`

## Matriz de duplicação

| Tema candidato | Artigo oficial parecido | URL | Tutorial local parecido | Sobreposição | Decisão | Justificativa |
|---|---|---|---|---|---|---|
| Como identificar o serviço correto antes de clicar em Gerenciar | Como usar a busca geral do Painel Novo da StayCloud; Como acessar o cPanel; Onde localizar os acessos no Painel StayCloud | https://ajuda.staycloud.com.br/docs/busca-do-painel-novo-staycloud/ | Como encontrar seus serviços ativos no Painel Novo da StayCloud | Alta | duplicado | O tutorial local aprovado já ensina localizar o serviço ativo, conferir domínio/status e abrir o serviço correto. Criar outro artigo concorreria com a mesma intenção. |
| Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo | Como acessar o cPanel; Onde localizar os acessos no Painel StayCloud | https://ajuda.staycloud.com.br/docs/como-acessar-o-cpanel-painel-novo/ | Como encontrar seus serviços ativos no Painel Novo da StayCloud | Média | pendente de validação do painel | Na conta testada não apareceu botão `Ver detalhes` junto de `Gerenciar`. Sem esse elemento real, o tema não deve ser produzido. |
| Como consultar disco, CPU e RAM do serviço no Painel Novo | Como acessar o cPanel; Onde localizar os acessos no Painel StayCloud | https://ajuda.staycloud.com.br/docs/como-acessar-o-cpanel-painel-novo/ | Nenhum tutorial local com foco em métricas de hospedagem/VPS no Painel Novo | Baixa | novo tutorial | O objetivo é apenas consultar indicadores exibidos no Painel Novo. Não ensina cPanel, não altera plano e não executa ação sensível. NOVO TUTORIAL — APROVADO NA AUDITORIA. |
| Como conferir o plano e o status do serviço contratado | Upgrade/downgrade; Como consultar faturas no painel StayCloud | https://ajuda.staycloud.com.br/docs/upgrade-e-downgrade-staycloud/ | Como encontrar seus serviços ativos no Painel Novo da StayCloud | Média/alta | complementar | Plano, status e domínio já aparecem no fluxo de serviços ativos. Pode virar seção de melhoria nesse conteúdo, mas não deve ganhar URL nova agora. |
| Como conferir qual domínio está vinculado a um serviço | Adicionar Dominios; Onde localizar os acessos no Painel StayCloud | https://ajuda.staycloud.com.br/docs/como-adicionar-dominio-no-staypanel/ | Como encontrar seus serviços ativos no Painel Novo da StayCloud | Alta | duplicado | A conferência do domínio vinculado já está coberta no tutorial local de serviços ativos. Criar novo artigo canibalizaria a busca por serviço/domínio correto. |
| Como localizar a área de Deploy no Painel Novo | Como encontrar as ferramentas no Painel StayCloud | https://ajuda.staycloud.com.br/docs/ferramentas-painel-staycloud/ | Nenhum tutorial local dedicado ao menu Deploy/Cloud | Baixa | novo tutorial | A área `Deploy` existe no menu e abre a tela `Cloud`, mas a conta mostra `Cloud ainda não ativo`. O escopo será somente localizar e reconhecer a área, sem iniciar deploy. NOVO TUTORIAL — APROVADO NA AUDITORIA. |
| Como criar uma conta de e-mail | Contas de Email; Criar E-mails painel Stay | https://ajuda.staycloud.com.br/docs/como-criar-email-no-painel-novo/ | Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud | Alta | duplicado | Bloqueado explicitamente. O artigo oficial já cobre criação de e-mail; a rodada atual não autoriza recriação. |

## Temas realmente novos aprovados

1. Como consultar disco, CPU e RAM do serviço no Painel Novo da StayCloud.
2. Como localizar a área de Deploy no Painel Novo da StayCloud.

## Temas não produzidos

- Como identificar o serviço correto antes de clicar em Gerenciar: duplicado do tutorial local de serviços ativos.
- Qual a diferença entre Ver detalhes e Gerenciar no Painel Novo: pendente porque `Ver detalhes` não apareceu no painel validado.
- Como conferir o plano e o status do serviço contratado: complementar ao tutorial de serviços ativos.
- Como conferir qual domínio está vinculado a um serviço: duplicado do tutorial de serviços ativos.
- Como criar uma conta de e-mail: duplicado e bloqueado.

## Regra registrada

Não criar tutorial apenas para completar quantidade. Nesta rodada, somente 2 dos 6 candidatos passaram como novos e úteis.
