# Seguranca

## Regras da fase 1

- Nao enviar mensagens.
- Nao abrir conversas de clientes.
- Nao usar APIs ou bibliotecas nao oficiais do protocolo WhatsApp.
- Nao copiar cookies, localStorage, IndexedDB, tokens ou chaves para o Viny Brain.
- Nao usar o perfil padrao do Google Chrome.
- Nao registrar numeros de telefone, participantes, midia ou historico completo.
- Nao imprimir dados de sessao no terminal.
- Nao usar o grupo de alertas como origem de alerta.
- Nao permitir loop de alerta sobre `🚨 Alertas Grupos 🚨`.

## Perfil do navegador

Perfil exclusivo:

`~/.config/viny-watch/chromium-profile/`

Este caminho fica fora do vault.

## Persistencia

SQLite real:

`/home/vinicius-alves/Projetos/viny-watch/data/viny-watch.sqlite`

Logs reais:

`/home/vinicius-alves/Projetos/viny-watch/logs/viny-watch.log`

Ambos ficam fora do vault.

## Dados persistidos

- nome do grupo;
- hash da previa;
- horario exibido;
- tipo de remetente;
- contagem de nao lidas;
- preferencias locais por grupo;
- timestamps de observacao e alerta simulado.

Conteudo integral da mensagem nao deve ser persistido.
