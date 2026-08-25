# Pesquisa - Runbooks e Incidentes

## Estrutura padrão de runbook

- sintoma
- impacto
- prioridade
- primeiros testes
- comandos seguros
- onde olhar
- o que NÃO fazer
- causas prováveis
- correções comuns
- quando escalar
- mensagem para cliente
- aprendizado gerado

## Runbooks candidatos

- Site fora do ar
- E-mail não recebe
- SSL não gera
- Malware detectado
- Migração com erro
- Banco de dados indisponível
- Erro 500 WordPress
- Elementor crítico
- DNS incorreto Cloudflare
- Lentidão geral

## Estrutura de uso

- runbook crítico: passo a passo para contenção e correção segura
- runbook de apoio: validação secundária ou caso menos frequente
- runbook de incidente: registro da resposta e do aprendizado gerado

## O que uma boa linha de runbook precisa ter

- teste inicial seguro
- sinal de quando parar
- caminho de escalonamento
- mensagem mínima para cliente
- aprendizado para virar KCS ou playbook

## Como usar

1. Descrever o sintoma com precisão
2. Confirmar impacto e prioridade
3. Fazer testes seguros primeiro
4. Registrar o que foi tentado
5. Corrigir o que for conhecido
6. Escalar quando sair do padrão
7. Registrar aprendizado para a base

## Riscos

- comando perigoso
- correção rápida sem entender a causa
- perder contexto durante incidente
- repetir erro em vez de documentar
