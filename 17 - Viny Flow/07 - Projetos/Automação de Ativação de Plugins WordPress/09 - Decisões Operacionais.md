# Decisoes Operacionais

## Decisoes registradas

- O objetivo principal agora e detectar pendencias de ativacao na tela do WHMCS, nao executar alteracoes.
- O MVP principal agora e visual e local, lendo apenas o DOM da pagina aberta e logada.
- Nao ha uso de API real, token, `.env` ou credenciais nesta fase.
- A automacao nao executa ativacao; ela apenas destaca candidatos e gera fila visual de aprovacao humana.
- A leitura deve acontecer apenas na tabela visivel da pagina atual.
- Paginação exige nova execucao manual.
- O detector offline por JSON continua apenas como apoio/fallback.
- A whitelist inicial e editavel e vive em arquivo local para calibracao, nao para capturar sessao.
- O scanner deve falhar de forma segura quando a URL nao parecer a pagina alvo.
- A fila de aprovacao humana e obrigatoria para tickets candidatos.
- A interface visual nao pode alterar ticket, checkbox, formulario ou estado do WHMCS.
- O score de confianca orienta a triagem, mas nao substitui revisao humana.
- O score nao decide sozinho. A classificacao final depende de gates criticos para evitar falso positivo em instalacao, licenca, erro ou pedido generico.
- O scanner visual deve diferenciar "ativação de plugin" de "reativação de VPS" para evitar falso positivo por substring.
- O Scanner Visual WHMCS foi validado na tela real e identificou corretamente ticket de ativacao de plugin como `ALTA CONFIANÇA`, ignorando `Reativação de VPS`.
- Status atual: `MVP Visual validado`.
- O bookmarklet `Scanner Plugins WHMCS` foi criado e testado na tela real de tickets do `WHMCS`.
- P0 concluído: scanner visual local/bookmarklet para detectar ativações pendentes.
- Próximos passos em P1: melhorar o texto de cópia, criar resumo do ticket, enriquecer aliases de plugins e testar outras páginas/status.
- Próximos passos em P2: analisar a tela interna do ticket, propor resposta sugerida e só depois estudar `WHMCS API` somente leitura.
- A automacao autonoma começa como read-only. Ela pode navegar e ler tickets usando a sessao do navegador, mas nao pode alterar ticket, responder, fechar, ativar plugin ou executar acao real.
- O scanner autônomo deve usar apenas leitura same-origin de paginas do `WHMCS`, sem API e sem gravar credenciais.
- O teste real da API ficou bloqueado por `HTTP 403` enquanto o IP nao estiver liberado.
- A continuidade agora inclui mock, diagnostico seguro, checklist de liberacao e fallback por HTML local ate o coordenador liberar o acesso.
- O modo `--diagnose` passa a ser o primeiro teste controlado da integracao API.
- O modo `--from-html` pode ser usado como contingencia local sem acesso real a API.
- Os pacotes premium continuam fora do vault em `/home/vinicius-alves/Documentos`.
- O Viny Brain armazena somente metadados e documentação dos pacotes.
- O registro operacional de pacotes fica fora do vault em `/home/vinicius-alves/.config/viny-integrations/plugin-packages.json`.
- O inventário local de pacotes é read-only e nunca executa PHP, instala plugin ou copia ZIP para o vault.

## Decisoes pendentes

- criterio numerico de score de confianca;
- refinamento de heuristicas por layout do WHMCS;
- suporte opcional a export local;
- regras de paginação e filtros visuais;
- modelo exato da fila humana em fases posteriores.

## Regra

Se uma decisao alterar o modo de operacao, ela deve ser atualizada aqui antes de virar pratica.
