# Regras para Playbooks

Playbooks são documentos internos de orientação operacional.

## O que entra como Playbook

Entram aqui conteúdos que:
- explicam como executar um processo interno
- orientam o suporte ou a operação
- registram fluxo de trabalho
- servem como referência para atendimento ou análise

## O que não entra como Playbook

Não tratar como playbook:
- tutorial público para cliente
- relatório
- nota solta sem contexto
- registro administrativo sem instrução operacional

## Estrutura esperada

Todo playbook deve, quando possível, ter:
- objetivo
- contexto
- pré-requisitos
- passo a passo
- pontos de atenção
- resultado esperado
- observações finais

## Como classificar

Use a classificação `Playbook` quando o documento:
- for interno
- orientar decisão ou execução
- precisar de referência técnica
- ajudar equipe a seguir um mesmo fluxo

## Como usar links

Se o playbook vier de Google Docs:
- manter o link original
- registrar a origem
- preservar o formato de referência

Se o playbook estiver ligado a um artigo público:
- separar a versão interna da versão para cliente
- registrar essa relação sem misturar os textos

## Como usar na prática

Playbooks devem ser usados para:
- padronizar respostas
- revisar procedimentos
- treinar equipe
- apoiar análise de casos
- gerar base para outros documentos

## Regra importante

Se houver dúvida entre playbook e tutorial:
- se for interno, use Playbook
- se for para cliente, use Tutorial

## Conexões internas

Cada playbook deve usar uma estrutura enxuta de navegação:

- `[[Índice Geral]]`
- `[[Mapa por Temas]]`
- no máximo 3 links diretamente relacionados ao assunto do documento

Regras obrigatórias:
- não transformar playbook individual em hub
- não linkar todos os playbooks entre si
- não usar links genéricos apenas para preencher conexão
- só criar conexão quando houver relação temática real
- se não houver relação clara, não adicionar link
- não repetir o mesmo link em seções diferentes apenas para reforçar o grafo
- não ligar o playbook a mapas globais fora da Base de Conhecimento sem necessidade operacional
- quando um link for necessário, preferir uma frase contextual a uma lista genérica de relacionados

Exemplos de relação temática válida:
- cPanel com cPanel, hospedagem, WHMCS, e-mail ou banco de dados quando houver relação direta
- DNS e domínio com DNS, domínio, nameserver, propagação, Registro.br ou Cloudflare
- Cloudflare com cache, DNS, proxy, SSL ou segurança
- E-mail com Exim, SMTP, autenticação, limites, caixa postal ou DNS de e-mail
- WordPress com Elementor, plugin, erro 404, erro 500, core, cache ou PHP
- VPS / SSH / Linux com terminal, firewall, comandos, EasyPanel ou acesso remoto
- Backups com JetBackup, restauração ou retenção
- Zendesk com chat, bot, status page ou atendimento
