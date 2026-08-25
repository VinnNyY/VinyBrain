# Scanner Autonomo WHMCS

## Objetivo

Criar uma automacao read-only dentro do navegador, usando a sessao ja logada do `WHMCS`, para varrer a listagem, ler tickets candidatos em profundidade e montar fila operacional sem alterar nada.

## Diferenca para o bookmarklet visual

- o bookmarklet visual destaca a pagina aberta e depende de leitura manual da tela;
- o scanner autonomo usa um userscript e consegue navegar/ler paginas internas em modo leitura;
- ambos sao read-only;
- nenhum deles ativa plugin, responde ticket ou altera status.

## Como instalar

1. Instale `Tampermonkey` ou `Violentmonkey`.
2. Crie um novo userscript.
3. Cole o conteudo de `autonomous-scanner/whmcs-autonomous-scanner.user.js`.
4. Salve.
5. Abra `https://painel.staycloud.com.br/gestor/supporttickets.php`.
6. Use o painel `Scanner Autonomo de Plugins`.

## Botões

- `Escanear pagina atual`: lê a listagem ou o ticket aberto.
- `Escanear proximas paginas`: tenta seguir a paginacao da listagem em modo leitura.
- `Escanear candidatos em profundidade`: abre ou busca os tickets candidatos para ler dominio e autorizacao.
- `Copiar fila`: gera texto simples para suporte.
- `Exportar relatorio`: baixa um Markdown local.
- `Limpar marcacoes`: remove destaque visual e reinicia a sessao local do scanner.

## Interpretacao

### PRONTO PARA APROVACAO

Usar quando o ticket estiver aberto, com pedido claro de ativacao, plugin conhecido, dominio citado, autorizacao detectada e sem sinal de conclusao.

### REVISAR MANUALMENTE

Usar quando o ticket parece relacionado a plugin, mas falta dominio, autorizacao, plugin claro ou existe ambiguidade.

### IGNORAR

Usar para VPS, migracao, redirecionamento, encerramento, conclusao, fechamento e temas fora do escopo.

## Limitações

- se o layout do `WHMCS` mudar, os seletores podem precisar de ajuste;
- se a paginacao nao puder ser identificada com seguranca, o scanner para;
- se a pagina interna do ticket nao abrir em leitura, o candidato fica para revisao manual.

## Segurança

O scanner e read-only. Ele nao usa API, nao usa token, nao le cookie, nao usa armazenamento do navegador e nao executa acao real.

