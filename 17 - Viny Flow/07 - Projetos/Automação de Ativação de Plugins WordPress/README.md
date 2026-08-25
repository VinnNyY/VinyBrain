# Automação de Ativação de Plugins WordPress

Projeto para estudar uma automação segura de ativação de plugins em WordPress a partir de tickets do `WHMCS`, sem executar ações reais nesta fase.

## Objetivo

Criar um scanner visual local para a tela de tickets do `WHMCS`, com foco em destacar candidatos a ativação de plugin WordPress.

## O que este projeto faz agora

- lê a tabela visível da página de tickets já aberta/logada;
- destaca candidatos a ativação de plugin;
- separa alta confiança, revisão e ignorados;
- mostra painel flutuante com fila copiável;
- mantém o fluxo local, visual e sem alterações no `WHMCS`.
- inclui um Scanner Visual WHMCS validado na tela real, pronto para uso diário via bookmarklet.
- inclui um Scanner Autônomo WHMCS read-only por userscript para varrer listagem e tickets em profundidade.

## Status

MVP Visual validado.

O bookmarklet `Scanner Plugins WHMCS` foi criado e testado na tela real de tickets do `WHMCS`.

Funcionamento validado:

- detecta ticket de ativação de plugin como `ALTA CONFIANÇA`;
- ignora falso positivo de `Reativação de VPS`;
- mostra painel flutuante com contagem;
- permite copiar fila;
- não usa API;
- não usa token;
- não lê cookies;
- não acessa `localStorage` ou `sessionStorage`;
- não faz `fetch` externo;
- não altera tickets;
- não responde tickets;
- não ativa plugins;
- apenas lê a tela visível e destaca visualmente.

Scanner Autonomo WHMCS em criacao como fase read-only seguinte, sem qualquer acao de alteracao.

Etapa adicional em andamento:

- inventário read-only dos tickets via API WHMCS;
- validação segura do acesso WordPress via navegador isolado;
- inventário local de pacotes ZIP premium fora do vault.

## O que este projeto não faz agora

- não acessa `WHMCS` real;
- não usa API real;
- não usa token;
- não cria `.env`;
- não salva credenciais;
- não acessa `WordPress` real;
- não acessa `cPanel` real;
- não manipula pacotes ZIP premium em modo destrutivo;
- não ativa plugin;
- não instala plugin;
- não executa ação real.

## Fase atual

Fase 1: scanner visual local no navegador, com detector por JSON mantido como apoio/fallback offline.

Fase complementar: inventário read-only de pacotes locais em `/home/vinicius-alves/Documentos`, com registro operacional externo fora do vault.

## Regras desta área

- Não acessar sistemas reais.
- Não usar credenciais.
- Não salvar tokens, senhas, cookies ou sessões.
- Não executar automação destrutiva.
- Não ativar plugin sem validação completa.

## Arquivos

- [01 - Visão Geral.md](./01%20-%20Vis%C3%A3o%20Geral.md)
- [02 - Fluxo Atual do Suporte.md](./02%20-%20Fluxo%20Atual%20do%20Suporte.md)
- [03 - Fluxo Desejado da Automação.md](./03%20-%20Fluxo%20Desejado%20da%20Automa%C3%A7%C3%A3o.md)
- [04 - Regras de Segurança.md](./04%20-%20Regras%20de%20Seguran%C3%A7a.md)
- [05 - Arquitetura Técnica Proposta.md](./05%20-%20Arquitetura%20T%C3%A9cnica%20Proposta.md)
- [06 - Checklist de Validação Antes de Ativar Plugin.md](./06%20-%20Checklist%20de%20Valida%C3%A7%C3%A3o%20Antes%20de%20Ativar%20Plugin.md)
- [07 - Mapeamento de Dados Necessários.md](./07%20-%20Mapeamento%20de%20Dados%20Necess%C3%A1rios.md)
- [08 - Backlog do Projeto.md](./08%20-%20Backlog%20do%20Projeto.md)
- [09 - Decisões Operacionais.md](./09%20-%20Decis%C3%B5es%20Operacionais.md)
- [10 - Detector de Ativações Pendentes.md](./10%20-%20Detector%20de%20Ativa%C3%A7%C3%B5es%20Pendentes.md)
- [11 - Regras de Detecção.md](./11%20-%20Regras%20de%20Detec%C3%A7%C3%A3o.md)
- [12 - Fila de Aprovação Humana.md](./12%20-%20Fila%20de%20Aprova%C3%A7%C3%A3o%20Humana.md)
- [13 - Score de Confiança.md](./13%20-%20Score%20de%20Confian%C3%A7a.md)
- [15 - Scanner Visual WHMCS.md](./15%20-%20Scanner%20Visual%20WHMCS.md)
- [Scanner Visual WHMCS](./15%20-%20Scanner%20Visual%20WHMCS.md)
- [16 - Scanner Autonomo WHMCS.md](./16%20-%20Scanner%20Aut%C3%B4nomo%20WHMCS.md)
- [autonomous-scanner/README.md](./autonomous-scanner/README.md)

## Estrutura do MVP

- `browser-snippets/`: scanner visual para console e bookmarklet
- `scripts/`: detector local em Python como fallback offline
- `config/`: regras editáveis e whitelist exemplo
- `payloads/`: entradas fictícias para teste
- `reports/`: relatórios Markdown gerados localmente
- `templates/`: respostas sugeridas para tickets

## Saidas do MVP

- relatório visual local;
- fila copiável no painel flutuante;
- marcação visual dos tickets candidatos;
- detector offline como apoio para estudos e calibração.
- bookmarklet operacional para abrir direto no Chrome sem colar JS no console.
- userscript read-only para leitura autônoma de listagem e tickets em profundidade.

## Próximos passos

P0 concluído:

- scanner visual local/bookmarklet para detectar ativações pendentes.

P1:

- melhorar botão `Copiar fila` com texto mais pronto para o suporte;
- adicionar botão `Copiar resumo do ticket`;
- adicionar lista de plugins premium permitidos com aliases melhores;
- testar em outras páginas/status do `WHMCS`;
- criar modo que analisa também a página interna do ticket quando aberta.

P2:

- criar scanner da tela interna do ticket para detectar domínio, autorização e mensagem do cliente;
- criar resposta sugerida para `WHMCS`;
- depois, estudar integração com `WHMCS API` somente leitura.

P3:

- manter inventário local de pacotes premium;
- preparar seleção segura de candidatos por versão;
- só depois discutir instalação assistida.

## Nova fase

Scanner autônomo read-only em userscript como caminho natural para reduzir trabalho manual na triagem.
