# Arquitetura Tecnica Proposta

## Objetivo da arquitetura

Criar uma arquitetura em fases para detectar tickets pendentes de ativacao e manter qualquer acao real fora desta etapa.

## Fase 1 - Detector local

Funcao:

- apenas le e analisa ticket exportado ou texto colado manualmente;
- classifica se e pendencia de ativacao de plugin;
- gera resumo e resposta sugerida;
- nao acessa API real.

Entradas:

- texto do ticket;
- contexto manual do atendente.

Saidas:

- classificacao do pedido;
- justificativa da classificacao;
- resposta sugerida;
- pedido de intervencao humana quando faltar dado.

## Fase 2 - Integracao controlada futura

Funcao:

- consulta `WHMCS` via API em modo leitura;
- busca tickets por departamento, status e palavras-chave;
- gera payload local;
- nao executa WordPress ainda.

Entradas:

- ticket no `WHMCS`;
- configuracao de busca;
- regras de triagem.

Saidas:

- payload local estruturado;
- fila de casos para analise;
- status do ticket com indicacao de pendencia ou aprovacao.

## Fase 3 - Execucao segura futura

Funcao:

- usa `WP-CLI` para verificar instalacao WordPress;
- lista plugins;
- confere status do plugin;
- ativa apenas plugins permitidos;
- registra resultado;
- responde ticket no `WHMCS`.

Controles:

- validacao previa obrigatoria;
- `dry-run` antes da execucao real;
- aprovacao explicita antes de alterar producao;
- log sem segredos;
- reversao planejada.

## Componentes logicos

- coletor de ticket;
- classificador de intencao;
- validador de cliente e dominio;
- resolvedor de servico e caminho WordPress;
- verificador de whitelist;
- motor de checklist;
- gerador de relatorio;
- executor controlado;
- registrador de resultado.

## Principio de desenho

O sistema deve ser local, audivel e reversivel. Nesta fase, o motor so classifica e reporta. A execucao real fica fora do escopo.
