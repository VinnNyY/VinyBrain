# Estudo do Fluxo Real

Data: 2026-08-03

Conta usada: conta própria de Vinicius, sessão autenticada autorizada.

Produto: Painel Novo > Deploy > Cloud.

Aplicação descartável: `tutorial-deploy-cli-teste`.

## Cenário escolhido

Cenário A — recurso de domínio confirmado.

Título final: `Como configurar um domínio personalizado no Deploy StayCloud`.

## Respostas validadas

1. Existe área de domínio na aplicação? Sim. A área oficial observada é `Domínios`.
2. Nome oficial da área: `Domínios`.
3. O sistema aceita domínio raiz? O modal solicita `Domínio` sem protocolo e sem path. Não houve salvamento de domínio raiz por segurança.
4. O sistema aceita subdomínio? O campo aceitou digitação de exemplo de subdomínio, mas não houve salvamento por segurança.
5. Informação que precisa ser inserida: nome do domínio, sem protocolo e sem path.
6. O painel fornece registro DNS? Sim. A área orienta apontar um `CNAME`.
7. Tipo de registro solicitado: `CNAME`.
8. Existe botão para verificar domínio? Não foi observado botão específico de verificação sem domínio cadastrado.
9. Existe status de validação? Sim. A tela exibe contadores `ATIVOS`, `PENDENTES` e `ERRO`.
10. O painel apresenta SSL? Sim. Texto observado: `SSL automático via CDN global`.
11. Existe domínio temporário? Sim. A listagem do projeto mantém URL temporária do tipo `stayai.space`.
12. A URL original continua funcionando? Não foi alterada nesta execução; validações anteriores confirmaram a URL temporária ativa.
13. Existe cobrança? Não foi observada cobrança específica na área de domínios. Nenhuma ação financeira foi executada.
14. Existe limite de domínios? Não confirmado. A tela mostrou `0 domínios`, mas isso é contador atual, não limite.
15. É possível remover o domínio? Não confirmado sem domínio cadastrado.

## Ações executadas

- Acesso ao Painel Novo.
- Abertura do produto `Cloud`.
- Localização da aplicação descartável.
- Acesso à área `Domínios`.
- Abertura do modal `Adicionar domínio`.
- Digitação de exemplo no campo, sem salvar.
- Captura de instrução CNAME e status.
- Sanitização dos prints.

## Ações não executadas

- Nenhum domínio foi salvo.
- Nenhum DNS externo foi alterado.
- Nenhum nameserver foi alterado.
- Nenhum domínio de cliente ou produção foi tocado.
- Nenhum domínio foi removido.
- Nenhuma publicação no BetterDocs foi feita.
- Nenhuma imagem foi enviada ao WordPress.

## Limitação registrada

Sem autorização explícita no Obsidian para alterar DNS de um domínio/subdomínio descartável, a validação final pelo novo endereço não foi executada. O tutorial explica a etapa externa como ação que depende do acesso autorizado ao DNS do domínio.
