# Decisoes do Projeto

## 2026-07-29 - Criacao da area Legacy Doc

Decisao: criar o Legacy Doc em `17 - Viny Flow/07 - Projetos/Legacy Doc`.

Motivo: o Viny Brain ja possui uma area de projetos em estudo e estruturacao dentro do Viny Flow. Essa area e apropriada para produto, landing page, pesquisa, arquitetura e planejamento antes de qualquer integracao real.

Impacto:

- O Legacy Doc fica separado de StayCloud, WordPress, tutoriais de suporte e bases operacionais.
- Nenhum arquivo existente foi movido ou apagado.
- Nenhuma publicacao, deploy ou alteracao remota foi executada.

## 2026-07-29 - Posicionamento principal

Decisao: tratar o Legacy Doc como produto real de tecnologia.

Regras:

- Nao posicionar como "apenas um projeto academico".
- Nao usar TCC no hero.
- Usar a origem academica apenas em secao secundaria de pesquisa e desenvolvimento.

## 2026-07-29 - Claims e evidencias

Decisao: claims comerciais, tecnicos e comparativos devem passar por checklist antes de uso publico.

Itens restritos:

- Acuracia superior.
- Comparacao com concorrentes.
- Precos e planos.
- Suporte a linguagens, frameworks e repositorios privados.
- Seguranca, privacidade e compliance.
- Clientes, metricas, depoimentos e resultados comerciais.

## 2026-07-29 - Estrategia da landing antes da implementacao

Decisao: a landing sera planejada antes de qualquer implementacao de codigo.

Impacto:

- Nenhum codigo de landing foi criado nesta fase.
- A pagina deve ter apenas um H1.
- A headline recomendada e `Documentacao tecnica gerada a partir do seu codigo`.
- O CTA principal recomendado e `Entrar na lista de interesse`.
- O CTA secundario recomendado e `Ver como funciona`.
- O TCC nao entra no hero nem no CTA principal.
- A origem do produto aparece apenas como pesquisa aplicada e evolucao do produto.

## 2026-07-29 - Estrutura final da landing

Decisao: usar a seguinte jornada:

1. Header.
2. Hero.
3. Demonstracao da transformacao.
4. Problema.
5. Como funciona.
6. Interface do produto.
7. Relatorio gerado.
8. Beneficios.
9. Cenarios de aplicacao.
10. Diferenciais tecnicos.
11. Pesquisa e desenvolvimento.
12. Roadmap ou evolucao.
13. Equipe.
14. FAQ.
15. CTA final.
16. Footer.

Motivo: a demonstracao vem cedo para provar tangibilidade antes de aprofundar problema, pesquisa, equipe e roadmap.

## 2026-07-29 - Concorrentes e precos

Decisao: nao incluir precos nem tabela de concorrentes na landing principal neste momento.

Motivo:

- Os precos do PDF sao preliminares e nao foram aprovados como oferta publica.
- Comparacao com concorrentes exige criterios equivalentes, fontes atuais, escopo tecnico do Legacy Doc e testes reproduziveis.
- A landing pode mencionar o espaco de produto de forma indireta, mas nao deve afirmar superioridade.

## 2026-07-29 - SEO inicial

Decisao: orientar a landing para a palavra-chave principal `documentacao de codigo legado`.

Configuracoes iniciais:

- Title: `Legacy Doc | Documentacao de codigo legado com IA`.
- Slug recomendado: `/documentacao-codigo-legado`.
- Meta description: `Use IA para analisar repositorios legados ou pouco documentados e gerar documentacao tecnica estruturada para times de engenharia.`
- Dados estruturados candidatos: `SoftwareApplication` e `FAQPage`, sem preco, rating, reviews ou compatibilidades nao confirmadas.

## 2026-07-29 - Direcao visual e design system

Decisao: a landing sera dark-first, tecnica, premium e contida, com azul oficial como cor principal de acao, foco e progresso.

Conceito visual:

`Codigo legado complexo -> analise -> identificacao de estrutura -> organizacao de informacoes -> documentacao tecnica clara`

Impacto:

- A primeira dobra deve mostrar produto e prova visual, nao imagem abstrata.
- O mockup principal deve combinar arvore de arquivos, analise, estados e relatorio.
- A secao de relatorio deve ser uma ancora visual de alto destaque.
- O visual deve evitar cyberpunk, particulas, glassmorphism pesado, roxo dominante, imagens stock e dashboards genericos.
- Componentes devem ser densos, funcionais, com bordas sutis e raio controlado.

## 2026-07-29 - Motion e acessibilidade visual

Decisao: motion deve comunicar processo tecnico e usar prioritariamente `transform` e `opacity`.

Regras:

- Animacoes nao podem bloquear leitura ou interacao.
- Progressao de analise deve ter estados textuais, nao apenas movimento/cor.
- `prefers-reduced-motion` e obrigatorio.
- Mobile deve usar motion simplificado.
- Blocos de codigo, relatorio, FAQ, menu e tabs precisam ser acessiveis por teclado.

## 2026-07-29 - Prototipo visual isolado

Decisao: criar apenas uma prova visual isolada de hero e relatorio, sem implementar a landing completa.

Arquivo:

`17 - Viny Flow/07 - Projetos/Legacy Doc/04 - UX e UI/Prototipos/hero-relatorio/index.html`

Escopo:

- Validar composicao visual.
- Validar densidade do mockup.
- Validar destaque do relatorio.
- Validar responsividade basica.
- Validar motion leve e `prefers-reduced-motion`.

Fora de escopo:

- Deploy.
- Captura real de leads.
- Backend.
- Funcionalidades reais de analise.
- Arquitetura final da landing.

## 2026-07-29 - Implementacao da landing page

Decisao: implementar a landing em um app Next.js novo e isolado em `06 - Desenvolvimento/landing-page`.

Motivo:

- A auditoria nao encontrou repositorio frontend anterior do Legacy Doc.
- Nao havia codigo existente a preservar.
- A stack atual oficial do Next.js recomenda `create-next-app` com TypeScript, Tailwind CSS, ESLint, App Router e alias `@/*` para novos projetos.

Stack:

- Next.js `16.2.12`.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS `4`.
- lucide-react como biblioteca unica de icones.

Regras aplicadas:

- Sem deploy.
- Sem publicacao.
- Sem alteracao remota.
- Sem uso de credenciais.
- Sem alteracao de projetos StayCloud.
- Conteudo principal como Server Components.
- Client Components apenas para menu mobile, tabs e FAQ.

## 2026-07-29 - SEO e publicacao bloqueada

Decisao: configurar SEO tecnico, mas manter `noindex, nofollow`.

Motivo:

- Dominio real ainda nao foi confirmado.
- CTA real ainda nao foi confirmado.
- Politica de privacidade ainda nao existe para captura de leads.

Impacto:

- Metadata API, Open Graph, Twitter Card e JSON-LD foram implementados.
- Canonical usa placeholder documentado `https://seudominio.com/documentacao-codigo-legado`.
- Antes de publicar, o dominio real deve substituir o placeholder e robots deve ser reavaliado.

## 2026-07-29 - CTA sem captura falsa

Decisao: nao implementar formulario nem email placeholder como canal real.

Motivo:

- O canal de captura da lista de interesse nao foi confirmado.
- Coleta de dados exige politica de privacidade.

Impacto:

- CTAs rolam para a secao final.
- A secao final informa que o canal de captura definitivo depende de confirmacao.

## 2026-07-29 - Ajuste de contraste do azul

Decisao: usar `#2563eb` como fundo dos botoes preenchidos e manter `#3b82f6` como azul oficial de destaque, borda, foco e progresso.

Motivo:

- Axe identificou contraste insuficiente entre texto branco e fundo `#3b82f6` nos botoes.
- O ajuste preserva a familia visual oficial e atende contraste WCAG.

## 2026-07-29 - Redesign estrutural V2 da landing

Decisao: reprovar visualmente a V1 e implementar uma V2 estrutural, nao apenas ajustes superficiais.

Motivo:

- A V1 era tecnicamente correta, mas repetitiva e institucional.
- Havia excesso de secoes com o mesmo padrao de titulo, texto e cards.
- A demonstracao do produto e o relatorio nao tinham protagonismo visual suficiente.
- A pagina nao possuia planos, embora o usuario tenha autorizado a inclusao dos planos oficiais nesta fase.

Direcao aplicada:

- Hero com demonstracao tecnica maior e mais legivel.
- Transformacao visual entre codigo sem contexto e documentacao revisavel.
- Pipeline `Repositorio -> Varredura -> Analise -> Documentacao`.
- Demonstracao navegavel com screenshots extraidos do material oficial.
- Secao clara para destacar o relatorio gerado.
- Beneficios e cenarios fundidos para reduzir repeticao.
- Diferenciais tecnicos reduzidos e mais objetivos.
- Planos oficiais incluidos sem checkout, descontos, garantias ou recursos inventados.
- Pesquisa e origem mantidas como secao secundaria.
- Dark theme permanece principal; light theme aparece estrategicamente no relatorio.

Planos autorizados:

- Basic: `$300 / mes`, 10 licencas de usuario, recursos basicos, suporte.
- Plus: `$800 / mes`, 30 licencas de usuario, modelos adaptaveis, suporte personalizado.
- Ultra: `$1.400 / mes`, 50 licencas de usuario, modelos adaptaveis, suporte personalizado, acesso ao Core LD 1.0.
- Stand Alone: `$59 / mes`, 1 licenca de usuario, recursos basicos, suporte.

Regras mantidas:

- Sem deploy.
- Sem publicacao.
- Sem alteracao remota.
- Sem uso de credenciais.
- Sem clientes, depoimentos, metricas, descontos, garantias, claims de seguranca ou compatibilidades inventadas.
- Revisao humana continua explicita.

Preservacao:

- A V1 foi preservada em `06 - Desenvolvimento/Backups/landing-page-v1-2026-07-29`.

## 2026-07-29 - Ajuste de planos e comparativo

Decisao: padronizar todos os CTAs dos cards de planos como `Conhecer o plano` e substituir a imagem do slide por um comparativo implementado em HTML/CSS.

Motivo:

- CTAs diferentes passavam intencoes comerciais distintas dentro da mesma trilha de planos.
- `Contratar` foi evitado nesta etapa porque ainda nao existe checkout, fluxo de compra, forma de pagamento ou politica de privacidade confirmada.
- O print do slide funcionava como referencia interna, mas visualmente parecia uma apresentacao colada na landing.
- A comparacao com ferramentas externas deve preservar nomes e evitar afirmacoes de superioridade sem benchmark.

Impacto:

- Todos os planos agora usam o mesmo CTA: `Conhecer o plano`.
- O comparativo de recursos entre planos foi recriado como componente visual responsivo.
- A leitura de mercado foi mantida como comparativo conceitual anonimizado, usando categorias aproximadas e sem citar marcas diretamente.
- Nenhum preco, desconto, garantia, cliente, depoimento, metrica ou recurso adicional foi inventado.

## 2026-07-29 - Remocao do comparativo da secao de planos

Decisao: remover o bloco de comparativo da landing V2.

Motivo:

- A tabela comparativa nao foi aprovada visualmente.
- O bloco aumentava a densidade da secao de planos sem melhorar a decisao principal do usuario.
- A comparacao com categorias externas, mesmo anonimizada, nao e necessaria nesta fase.

Impacto:

- A secao de planos passa a conter somente cards de planos e FAQ.
- Os valores foram explicitados como dolares.
- A FAQ informa que ainda nao existe checkout, carrinho ou forma de pagamento confirmada.
- O CTA dos planos permanece como redirecionamento ilustrativo para o proximo passo de contato.
- `Core LD 1.0` passa a ser descrito como o core proprio do Legacy Doc.

## 2026-07-29 - Carrinho ilustrativo para planos

Decisao: criar uma rota local `/checkout` para receber os CTAs dos planos e remover da landing a mensagem explicita sobre ausencia de checkout.

Motivo:

- A informacao sobre checkout/carrinho/formas de pagamento dentro da FAQ da landing foi considerada pouco profissional.
- Os CTAs dos planos precisam ter um destino mais coerente do que apenas rolar para uma secao final.
- O fluxo ainda nao deve simular pagamento real nem coletar dados sensiveis.

Impacto:

- Cada CTA `Conhecer o plano` aponta para `/checkout?plano=<slug-do-plano>`.
- A rota `/checkout` exibe um resumo do plano selecionado e acoes para continuar ou alterar plano.
- A pagina e tratada como carrinho/resumo ilustrativo, sem gateway, pagamento, carrinho persistente ou coleta de dados.
- O selo do plano Ultra foi alterado de `Mais completo` para `Destaque`.
- O rotulo `Popular` nao foi usado por poder sugerir popularidade comprovada sem dado validado.

## 2026-08-14 - Redesign V3: estagio MVP explicito e lista de espera

Contexto: a landing atual em producao local ja era a V2 (29/07). Os problemas
relatados agora (pagina longa, cards repetidos, screenshots pequenos, relatorio
sem protagonismo) sao os mesmos que a V2 pretendia corrigir na V1. Por isso esta
fase e tratada como V3, preservando o historico das anteriores.

Decisoes tomadas com o Vinicius antes da implementacao:

- Meta da lista de espera: `100` inscricoes.
- Contador de inscritos: real, com backend proprio. Nada de numero simulado.
- Persistencia: rota de API no Next + SQLite local, atras de um modulo de
  storage isolado e trocavel.
- Badge de estagio: `Em desenvolvimento`.
- Politica de privacidade: rascunho tecnico criado nesta fase, sem revisao
  juridica.

Decisoes tecnicas derivadas:

- `WAITLIST_GOAL` fica em `src/lib/mvp-config.ts` como constante unica. Alterar
  a meta e mudanca de um numero em um arquivo.
- O contador so aparece quando existe fonte de dados real. Se a API falhar, a
  secao exibe apenas a meta e o convite, nunca um numero estimado.
- Usado `node:sqlite` (embutido no Node 22) para nao adicionar dependencia.
- Tipagem de `node:sqlite` declarada localmente em `src/types/node-sqlite.d.ts`
  porque o projeto usa `@types/node@20`. Remover quando subir para 22+.
- Os quatro planos deixaram de apontar para `/checkout`. CTA passou de
  `Conhecer o plano` para `Falar com a equipe`, apontando para a lista de
  espera. Motivo: o requisito V3 proibe CTA que sugira compra disponivel.
- A rota `/checkout` NAO foi removida, apenas desconectada da landing. A
  remocao depende de autorizacao.

Regras mantidas: sem deploy, sem publicacao, sem alteracao remota, sem uso de
credenciais, sem clientes, depoimentos, metricas ou claims inventados.

## 2026-08-14 - Runtime da StayCloud e arquitetura de publicacao

Descoberta: o Deploy StayCloud publica ARTEFATO ESTATICO. Nao executa codigo
no servidor neste fluxo.

Evidencias, todas verificaveis:

- Log real da CLI capturado na producao do tutorial 13, em 2026-07-29:
  `artefato estatico pronto`. No tutorial 15 aparece como
  `artefato estatico pronto (1 arquivos)`.
- README publico de `@staysdev/setup@0.1.3` documenta `deploy --output-dir dist`.
  O CLI envia o conteudo de um diretorio. Nao ha flag de runtime, build command,
  start command ou variavel de ambiente de servidor.
- O projeto que validou o fluxo era HTML estatico, sem formulario, banco ou
  variavel de ambiente.
- Templates de Next.js e SvelteKit no painel estao marcados como `em breve`.

Consequencia direta: Route Handlers do Next nao funcionam la. Publicar a landing
como estava faria a pagina pedir inscricao e descartar cada inscricao em
silencio.

Teste executado para confirmar: `output: "export"` falha com
`export const dynamic = "force-dynamic" on page "/api/waitlist" cannot be used
with "output: export"`.

Decisoes tomadas com o Vinicius:

- Lista de espera: funcao serverless separada, em outro provedor. Landing
  estatica na StayCloud.
- Publicar agora, mesmo com o redesign composicional incompleto.
- Manter `noindex, nofollow`.
- Usar subdominio da plataforma em `stayai.space`, sem dominio proprio e sem DNS.

Decisoes tecnicas derivadas:

- `next.config.ts` passa a ter dois modos. Com `STATIC_EXPORT=true` gera
  `out/` estatico. Sem a variavel, mantem servidor e API local.
- O Route Handler foi renomeado para `route.local.ts` e so e reconhecido via
  `pageExtensions` fora do export. Nada foi deletado: em desenvolvimento a API
  continua funcionando; no artefato publicado ela nao existe.
- Endereco da API entra em build por `NEXT_PUBLIC_WAITLIST_API`.
- Sem endpoint configurado, a secao esconde o formulario e informa que as
  inscricoes abrem em breve. Nunca exibe campo que descartaria a inscricao.
- A barra de progresso passa a aparecer somente a partir do primeiro inscrito.
- `/checkout` foi convertido para Client Component com `useSearchParams` dentro
  de `Suspense`, para ser compativel com export estatico. A rota continua
  desconectada da landing. A remocao definitiva segue pendente de autorizacao.
- Worker escrito em `serverless/waitlist-worker`, com contrato identico ao
  handler local. NAO foi publicado.

## 2026-08-14 - Transicao entre faixas: degrade testado e reprovado

Contexto: a revisao apontou que a troca do claro para o escuro era brusca
demais. Foi implementado degrade de 120px na entrada e na saida das duas
faixas claras.

Decisao: REMOVER o degrade. Reprovado visualmente pelo Vinicius.

Solucao mantida: fundo solido com corte reto e borda `#cbd5e1` em cima e
embaixo das faixas claras. O limite fica evidente sem mancha de transicao.

Registro para nao repetir: nao reintroduzir degrade vertical entre secoes.
A separacao vem de borda definida mais alternancia de superficie.

## 2026-08-14 - Olho-magico: bug de especificidade

O rotulo acima do titulo e um elemento `p`. Regras como `.report-copy p`
tem especificidade `0,1,1` e venciam `.eyebrow`, que tem `0,1,0`. O tamanho
variava por secao: `19px` no relatorio contra `12px` nas demais.

Corrigido com `p.eyebrow` e `span.eyebrow`, empatando a especificidade.
Tamanho unico de `14px` em toda a pagina, verificado nos doze rotulos.

Licao: seletores de classe para elementos que tambem sao alvo de seletores
de tipo dentro de containers precisam de especificidade equivalente.

## 2026-08-14 - Remocao do mockup antigo do hero

Decisao: remover `src/components/product-mockup.tsx`, orfao desde a
substituicao do hero por `hero-pipeline.tsx`.

Motivo: nenhum arquivo o importava. O componente nao ia para o bundle, mas
as 19 regras de CSS associadas continuavam sendo baixadas por todo visitante
sem estilizar nada, porque CSS nao passa por tree-shaking.

Execucao:

- Arquivo removido. Preservado em
  `06 - Desenvolvimento/Backups/landing-page-v1-2026-07-29`.
- 28 blocos de CSS removidos: `hero-demo`, `demo-topbar`, `demo-grid`,
  `demo-files`, `demo-label`, `demo-code`, `demo-section-header`,
  `demo-code-card`, `demo-functions`, `demo-doc`, `demo-note` e `scan-line`.
- Um bloco foi podado em vez de removido: `.demo-code-card code, .code-scroll
  code` era compartilhado, e `.code-scroll` continua em uso na secao de
  Transformacao. Manteve-se apenas a parte viva.

Resultado: `globals.css` de `3525` para `3322` linhas. CSS do artefato de
`60.440` para `57.524` bytes. Zero classes mortas no artefato publicado.

Validacao: lint, typecheck e build aprovados, axe com `0 violacoes`, sete
breakpoints sem overflow, e a secao de Transformacao conferida visualmente
por causa do seletor compartilhado.
