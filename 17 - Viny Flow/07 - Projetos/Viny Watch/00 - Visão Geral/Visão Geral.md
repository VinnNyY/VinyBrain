# Visao Geral

O Viny Watch monitora grupos VIP no WhatsApp Web comercial para detectar quando um cliente fica aguardando resposta por mais tempo que o limite configurado.

Nesta fase, o sistema e exclusivamente de leitura e deteccao. Ele nao envia mensagens, nao integra APIs externas e nao usa bibliotecas que acessem o protocolo interno do WhatsApp.

## Grupo de alertas

O grupo `🚨 Alertas Grupos 🚨` esta cadastrado como ignorado e nunca deve gerar alerta sobre ele mesmo.

## Modo atual

Modo atual: `all_groups`.

O grupo `Joao Emanuel <> StayCloud` foi usado apenas como piloto inicial. O monitoramento agora cobre automaticamente todos os grupos encontrados na aba `Grupos`, sem exigir cadastro manual de cada grupo.

Grupos novos devem nascer monitorados, exceto quando estiverem em `ignoredGroups` ou forem desativados manualmente.

## Criterios principais

- Ler somente a lista lateral de grupos.
- Diferenciar `OUTGOING`, `INTERNAL`, `INCOMING` e `UNKNOWN`.
- Diferenciar `INCOMING_PROBABLE` quando houver sinal forte de entrada, como mensagens nao lidas sem indicacao de resposta propria.
- Nao gerar alerta para `UNKNOWN`.
- `UNKNOWN` nao bloqueia a varredura dos outros grupos.
- Registrar alertas apenas como simulacao.
- Nao salvar conteudo integral de mensagens.
