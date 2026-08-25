# Checklist Inicial - StayCloud

## Objetivo
Padronizar a triagem inicial no suporte, validando domínio, DNS e sinais básicos de erro antes de avançar para uma análise mais profunda.

## Quando usar
- Primeiro contato com o cliente.
- Casos com domínio fora do ar, DNS inconsistente ou suspeita de apontamento errado.
- Situações em que o suporte precisa conferir site e e-mail antes de escalar.

## Passo a passo interno
- Cumprimente o cliente rapidamente e confirme o recebimento.
- Solicite o PIN quando ele não tiver sido informado.
- Valide o domínio com DNS Checker, Registro.br ou Whois, conforme a extensão.
- Se houver Cloudflare, peça a captura da zona DNS para conferência.
- Confirme apontamentos de site e e-mail, principalmente A, CNAME, MX e TXT.
- Registre a triagem antes de avançar para ações mais específicas.

## Orientação que pode ser enviada ao cliente
- Confirme o recebimento e peça os dados necessários para a análise.
- Explique de forma simples que será verificado se o domínio está apontando corretamente.
- Se precisar de print da Cloudflare, peça apenas a imagem da zona DNS.

## Cuidados
- Não assumir que o problema é do servidor sem validar DNS e domínio.
- Verificar cada caso individualmente.
- Tratar prints de exemplo apenas como referência visual, não como regra fixa.

## Links originais
- https://docs.google.com/document/d/1aP1UKREeapRmXOidHqD37j0CIbE0qQKK/edit

## Fonte
- `Conteudos - Base de conhecimento.xlsx` > aba `documentos`
- Título na planilha: `Checklist Inicial - StayCloud`

## Status
- Postado

## Autor
- Vini

## Conexões internas

- [[Índice Geral]]
- [[Mapa por Temas]]
- [[Guia Interno Staycloud - Apontamentos DNS]]
- [[Resolução de Conflitos de DNS de E-mail]]
- [[Otimização de Cache na Cloudflare]]
