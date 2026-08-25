# Backlog do Projeto

## P0

- Scanner autônomo read-only por userscript.
- Varredura de listagem.
- Leitura em profundidade de candidatos.
- Classificação final com domínio, autorização e plugin.

## P1

- Melhorar aliases de plugins.
- Melhorar detecção de autorização.
- Melhorar detecção de domínio.
- Gerar resposta sugerida.
- Gerar tarefa ClickUp manual.

## P2

- Integração `WHMCS API` somente leitura.
- Diagnostico seguro da API com validacao de `.env`, endpoint, IP publico e resposta `403`.
- Fallback local `--from-html` para leitura de listagem salva sem depender da API.
- Integração com execução assistida via `WP-CLI`.
- Fila com aprovação explícita.
- Ativação real futura somente com confirmação humana.

## P3

- Inventário local read-only de pacotes ZIP premium.
- Registro operacional externo fora do vault.
- Priorização de Elementor Pro e WP Rocket entre os pacotes locais.
- Comparação de versões locais do mesmo plugin.
- Seleção segura de candidato para instalação futura.

## Histórico

- `P0` do scanner visual concluído.
- `MVP Visual validado`.
- Teste real da API bloqueado por `HTTP 403` enquanto o IP nao esta liberado.
- Inventário local de pacotes premium em `/home/vinicius-alves/Documentos` preparado como etapa read-only.

## Critérios de ordenação

- primeiro reduzir risco;
- depois automatizar leitura e preparação;
- por último executar ação real;
- qualquer item de P2 depende de validação de segurança e revisão operacional.
- qualquer item de P3 depende de inspeção read-only e nunca pode mover ZIP, instalar plugin ou expor segredo.
