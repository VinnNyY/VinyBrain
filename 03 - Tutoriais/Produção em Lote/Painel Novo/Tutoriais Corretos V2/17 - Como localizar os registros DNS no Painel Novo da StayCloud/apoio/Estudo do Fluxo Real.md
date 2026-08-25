# Estudo do Fluxo Real

Data: 2026-08-10

## Objetivo da validação

Confirmar no Painel Novo atual o caminho para localizar os registros ou dados DNS de uma hospedagem própria/de teste.

## Tentativa de validação

Foram testadas sessões locais disponíveis para automação:

- perfil dedicado usado em automações anteriores;
- cópia temporária do perfil padrão do navegador, sem alterar o perfil real.

Resultado:

- O Painel Novo e o WordPress administrativo redirecionaram para login.
- A sessão autorizada de Vinicius não estava disponível para validação headless.
- Nenhuma conta de cliente foi usada.
- Nenhum registro DNS, domínio, nameserver ou configuração externa foi alterado.

## Evidência local de apoio

Foram localizadas capturas antigas do Painel Novo no ambiente local:

- `apoio/originais-e-versoes-antigas/apoio-antigo-painel-servico-com-aba-dns.png`
- `apoio/originais-e-versoes-antigas/apoio-antigo-tela-dns-com-modal.png`

Essas capturas indicam:

- menu lateral com área de sites/hospedagem;
- serviço aberto;
- navegação superior da hospedagem com a aba `DNS`;
- área DNS com registros e modal de criação;
- campos observados no modal antigo: `Tipo`, `TTL (segundos)`, `Nome`, `Valor`.

## Limitação importante

A captura antiga da área DNS mostra um modal de criação de registro. Ela não deve ser usada como print final porque o tutorial solicitado não é sobre criar registros DNS.

## Campos observados na evidência de apoio

Campos confirmados apenas na evidência antiga:

- Tipo
- TTL (segundos)
- Nome
- Valor

Campos visíveis na área geral do serviço antigo:

- IP
- Nameservers

## Pendências antes da publicação

- Autenticar no Painel Novo com conta própria autorizada.
- Abrir uma hospedagem própria/de teste.
- Clicar na aba `DNS`.
- Registrar exatamente o que a tela atual mostra.
- Confirmar se a tela apresenta lista de registros, dados de apontamento, IP, nameservers, botão de copiar ou outros campos.
- Capturar prints atuais sem dados de cliente.
- Sanitizar domínio, IP, nameservers e identificadores.
- Revalidar o título conforme o cenário real encontrado.
