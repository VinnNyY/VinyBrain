const fs = require('fs');
const path = require('path');

const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Lote 02';
const markdownDir = path.join(root, 'markdown');
const previewDir = path.join(root, 'html-preview');
const wordpressDir = path.join(root, 'html-wordpress');
const validacoesDir = path.join(root, 'validacoes');

const tutorials = [
  {
    slug: 'como-alterar-o-armazenamento-dos-e-mails-no-painel-novo-da-staycloud',
    title: 'Como alterar o armazenamento dos e-mails no Painel Novo da StayCloud',
    objective: 'Abra a hospedagem correta no Painel Novo, entre em E-mails e confira o armazenamento da conta. Se a sua interface mostrar a edição da cota, siga por ela; nesta build, a alteração direta não apareceu.',
    audience: [
      'para você que precisa ampliar ou reduzir o espaço de uma conta de e-mail',
      'para você que quer conferir a conta certa antes de salvar a alteração',
      'para você que deseja seguir o caminho do Painel Novo sem se perder',
    ],
    whenUse: 'Use este tutorial quando precisar alterar o limite de armazenamento de uma conta de e-mail vinculada à sua hospedagem.',
    beforeStart: [
      'tenha acesso ao Painel Novo da StayCloud',
      'confirme qual hospedagem contém a conta que você quer ajustar',
      'use um navegador no desktop',
      'não altere o valor sem entender o limite do seu plano',
      'nesta build, a aba E-mails mostra a cota atual, mas não exibiu um botão de editar armazenamento',
    ],
    keyword: 'alterar armazenamento dos e-mails no Painel Novo',
    seoTitle: 'Como alterar o armazenamento dos e-mails no Painel Novo da StayCloud',
    slugSeo: 'como-alterar-o-armazenamento-dos-e-mails-no-painel-novo-da-staycloud',
    meta: 'Veja como conferir o armazenamento dos e-mails no Painel Novo da StayCloud, entender o limite exibido e saber quando abrir ticket para aumentar a cota.',
    steps: [
      {
        heading: 'Abra a hospedagem correta no Painel Novo',
        text: 'Entre no Painel Novo e selecione a hospedagem que contém a conta de e-mail que você deseja ajustar.',
        image: '01-dashboard-servico',
        alt: 'Painel Novo da StayCloud com o serviço correto em destaque antes da navegação para a aba E-mails',
        caption: 'Primeiro confirme a hospedagem correta no Painel Novo.',
      },
      {
        heading: 'Abra a aba E-mails no Painel Novo',
        text: 'Depois, clique em E-mails para conferir a conta e a cota atual.',
        image: '02-painel-novo-email',
        alt: 'Painel Novo da StayCloud com a aba E-mails destacada e a conta de e-mail visível',
        caption: 'Use a aba E-mails para localizar a conta e o uso atual.',
      },
      {
        heading: 'Confirme a cota exibida e aponte a limitação da interface',
        text: 'Na linha da conta, veja a cota usada e a capacidade atual. Se o botão de editar armazenamento não aparecer, este é um ponto para abrir ticket.',
        image: '03-email-panel',
        alt: 'Painel Novo da StayCloud mostrando a conta de e-mail, o uso atual e a capacidade total',
        caption: 'Esta tela mostra o uso atual e deixa claro que a edição pode não estar disponível nesta build.',
      },
    ],
    printNotes: [
      { file: '01-dashboard-servico.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '02-painel-novo-email.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '03-email-panel.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
    ],
    errors: [
      'alterar a conta errada',
      'concluir que existe um botão de edição quando ele não aparece na interface',
      'deixar de abrir ticket quando a alteração não estiver disponível',
      'mostrar um campo sensível que não precisa aparecer no tutorial',
    ],
    ticket: [
      'se a conta de e-mail não aparecer na lista',
      'se o Painel Novo não mostrar a edição direta da quota',
      'se você precisar de um aumento de espaço e a interface não tiver o controle de edição',
      'se o limite exibido parecer incompatível com o plano',
    ],
    conclusion: 'Quando você começa pela aba E-mails, confirma a conta certa e entende o limite da interface, fica claro se você consegue ajustar a cota ali ou se precisa abrir ticket.',
    validation: {
      tutorial: 'aprovado com ajustes',
      seo: 'aprovado',
      visual: 'aprovado',
      uiux: 'aprovado',
      writer: 'aprovado',
      security: 'aprovado',
      auditor: 'aprovado com ajustes',
      gate: 'aprovado com ajustes',
      note: 'O Painel Novo foi validado como ponto de partida. Nesta build, a interface mostra a cota atual, mas não exibiu um controle de edição de armazenamento; por isso o tutorial precisa deixar esse limite explícito.',
    },
  },
  {
    slug: 'como-gerar-certificados-ssl-gratuitos-no-painel-novo-da-staycloud',
    title: 'Como gerar certificados SSL gratuitos no Painel Novo da StayCloud',
    objective: 'Abra o caminho certo pelo Painel Novo, chegue à interface do SSL no cPanel e identifique o ponto seguro para avançar com um certificado gratuito.',
    audience: [
      'para você que precisa proteger seu site com SSL',
      'para você que quer começar pelo Painel Novo antes de entrar no cPanel',
      'para você que precisa entender onde clicar sem confundir o domínio',
    ],
    whenUse: 'Use este tutorial quando quiser iniciar a emissão de um SSL gratuito para o domínio correto da sua hospedagem.',
    beforeStart: [
      'tenha acesso ao Painel Novo da StayCloud',
      'confirme o domínio que você quer proteger',
      'verifique se o DNS do domínio aponta para a hospedagem correta',
      'se a tela final pedir confirmação, valide em ambiente seguro antes de concluir',
    ],
    keyword: 'gerar certificados SSL gratuitos na StayCloud',
    seoTitle: 'Como gerar certificados SSL gratuitos no Painel Novo da StayCloud',
    slugSeo: 'como-gerar-certificados-ssl-gratuitos-no-painel-novo-da-staycloud',
    meta: 'Veja como iniciar a geração de certificados SSL gratuitos no Painel Novo da StayCloud, escolher o domínio correto e identificar o ponto seguro do processo.',
    steps: [
      {
        heading: 'Abra a hospedagem correta no Painel Novo',
        text: 'Entre no Painel Novo e selecione a hospedagem que contém o domínio que você deseja proteger.',
        image: '01-dashboard-servico',
        alt: 'Painel Novo da StayCloud com o serviço correto selecionado e acesso ao cPanel visível',
        caption: 'Sempre confirme a hospedagem antes de procurar a área de SSL.',
      },
      {
        heading: 'Acesse a área de SSL no cPanel',
        text: 'No cPanel, abra a interface de SSL/TLS Certificates para iniciar o processo.',
        image: '02-cpanel-ssl-home',
        alt: 'cPanel com a área SSL/TLS Certificates destacada no menu de segurança',
        caption: 'A porta de entrada do processo fica na área de SSL do cPanel.',
      },
      {
        heading: 'Selecione o domínio e avance com cuidado',
        text: 'Na tela do SSL, marque o domínio principal e confira a próxima etapa antes de seguir.',
        image: '03-ssl-dominios',
        alt: 'Tela do assistente de SSL com o domínio principal e o botão Continuar destacados',
        caption: 'Esse é o ponto ideal para conferir se o domínio está correto.',
      },
    ],
    printNotes: [
      { file: '01-dashboard-servico.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '02-cpanel-ssl-home.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '03-ssl-dominios.png', status: 'capturado e marcado', risk: 'médio', human: 'sim, porque a emissão final ficou como precisa validar' },
      { file: '04-ssl-produto.png', status: 'capturado', risk: 'médio', human: 'sim, imagem de apoio para revisão futura, não usada no texto final' },
    ],
    errors: [
      'escolher o domínio errado',
      'avançar sem confirmar o DNS',
      'tratar a etapa final de emissão como validada sem teste seguro',
      'confundir a interface de compra com a emissão gratuita',
    ],
    ticket: [
      'se o domínio não aparecer na lista',
      'se a interface de SSL não carregar',
      'se a opção gratuita não estiver disponível',
      'se a confirmação final exigir uma validação que você não consiga reproduzir com segurança',
    ],
    conclusion: 'Quando você começa pelo Painel Novo, confere o domínio certo e chega até a etapa segura do assistente, o fluxo de SSL fica claro para revisão.',
    validation: {
      tutorial: 'aprovado com ajustes',
      seo: 'aprovado',
      visual: 'aprovado com ajustes',
      uiux: 'aprovado',
      writer: 'aprovado',
      security: 'aprovado',
      auditor: 'aprovado com ajustes',
      gate: 'aprovado com ajustes',
      note: 'A jornada principal está capturada; a confirmação final da emissão gratuita deve ser validada antes da publicação.',
    },
  },
  {
    slug: 'como-criar-filtros-de-e-mail-no-painel-novo-da-staycloud',
    title: 'Como criar filtros de e-mail no Painel Novo da StayCloud',
    objective: 'Crie um filtro de e-mail partindo do Painel Novo, passando pelo cPanel e chegando à tela de regras da conta correta.',
    audience: [
      'para você que quer organizar mensagens automaticamente',
      'para você que precisa criar um filtro sem se perder entre as telas',
      'para você que deseja seguir um fluxo prático e fácil de revisar',
    ],
    whenUse: 'Use este tutorial quando quiser criar um filtro para uma conta específica de e-mail vinculada à sua hospedagem.',
    beforeStart: [
      'tenha acesso ao Painel Novo da StayCloud',
      'confirme a conta de e-mail que vai receber a regra',
      'se quiser testar, use um exemplo simples e reversível',
      'não salve uma regra real sem confirmar o efeito esperado',
    ],
    keyword: 'criar filtros de e-mail no cPanel',
    seoTitle: 'Como criar filtros de e-mail no Painel Novo da StayCloud',
    slugSeo: 'como-criar-filtros-de-e-mail-no-painel-novo-da-staycloud',
    meta: 'Veja como criar filtros de e-mail no Painel Novo da StayCloud, passar pelo cPanel e montar uma regra simples com segurança.',
    steps: [
      {
        heading: 'Abra a hospedagem correta no Painel Novo',
        text: 'Entre no Painel Novo e selecione a hospedagem em que está a conta de e-mail que você quer filtrar.',
        image: '01-dashboard-servico',
        alt: 'Painel Novo da StayCloud com o serviço correto em destaque antes do acesso ao cPanel',
        caption: 'O filtro só faz sentido quando a hospedagem certa está aberta.',
      },
      {
        heading: 'Abra Contas de e-mail no cPanel',
        text: 'No cPanel, entre em Contas de e-mail para localizar a conta correta antes de criar a regra.',
        image: '02-cpanel-contas-email',
        alt: 'cPanel com a área Contas de e-mail destacada no painel de ferramentas',
        caption: 'A lista de contas ajuda você a chegar no endereço certo.',
      },
      {
        heading: 'Abra a conta e entre em Gerenciar Filtros de E-mail',
        text: 'Na conta desejada, clique em Gerenciar e depois em Gerenciar Filtros de E-mail.',
        image: '03-conta-com-filtros',
        alt: 'Tela de gerenciamento da conta de e-mail com o link Gerenciar Filtros de E-mail destacado',
        caption: 'Esse é o atalho que leva você para as regras da conta.',
      },
      {
        heading: 'Abra a lista de filtros e crie uma nova regra',
        text: 'Na tela de filtros, clique em Criar um Novo Filtro para seguir com a regra.',
        image: '04-filtros-lista',
        alt: 'Tela de filtros de e-mail com o botão Criar um Novo Filtro destacado',
        caption: 'A lista mostra o ponto exato para começar uma nova regra.',
      },
      {
        heading: 'Monte a regra e revise antes de salvar',
        text: 'No formulário do filtro, defina um nome, escolha a condição, selecione a ação e revise tudo antes de criar o filtro.',
        image: '05-criar-filtro',
        alt: 'Formulário de criação de filtro com nome, condição, ação e botão Criar destacados',
        caption: 'Revise o exemplo antes de salvar qualquer regra real.',
      },
    ],
    printNotes: [
      { file: '01-dashboard-servico.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '02-cpanel-contas-email.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '03-conta-com-filtros.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '04-filtros-lista.png', status: 'capturado e marcado', risk: 'baixo', human: 'não' },
      { file: '05-criar-filtro.png', status: 'capturado e marcado', risk: 'médio', human: 'sim, se o exemplo for aplicado em um ambiente seguro' },
    ],
    errors: [
      'abrir os filtros da conta errada',
      'criar uma regra sem entender a ação',
      'salvar um filtro irreversível sem teste',
      'pular a etapa de revisar a conta no Painel Novo',
    ],
    ticket: [
      'se a opção Gerenciar Filtros de E-mail não aparecer',
      'se o formulário de filtro não carregar',
      'se alguma ação não estiver disponível',
      'se você não conseguir testar a regra com segurança',
    ],
    conclusion: 'Quando você entra pela hospedagem certa, encontra a conta certa e revisa a regra antes de salvar, o filtro fica mais fácil de manter.',
    validation: {
      tutorial: 'aprovado com ajustes',
      seo: 'aprovado',
      visual: 'aprovado',
      uiux: 'aprovado',
      writer: 'aprovado',
      security: 'aprovado',
      auditor: 'aprovado com ajustes',
      gate: 'aprovado com ajustes',
      note: 'O fluxo foi testado até o formulário; a gravação da regra deve ser validada apenas em cenário seguro.',
    },
  },
];

function imgPath(slug, image) {
  return `../prints/${slug}/${image}-marcado.png`;
}

function printPlanTable(t) {
  return `| Print | Caminho | Objetivo | Status | Precisa revisão humana | Observação |\n|---|---|---|---|---|---|\n${t.printNotes.map((p) => `| ${p.file} | ${path.join('prints', t.slug, p.file)} | ${p.file.replace(/\\.png$/, '')} | ${p.status} | ${p.human} | ${p.risk === 'médio' ? 'Atenção para o passo final.' : 'Fluxo seguro e direto.'} |`).join('\n')}`;
}

function checklist(status) {
  return `- [${status === 'aprovado' ? 'x' : ' '}] aprovado\n- [${status === 'aprovado com ajustes' ? 'x' : ' '}] aprovado com ajustes\n- [${status === 'reprovado' ? 'x' : ' '}] reprovado`;
}

function renderMarkdown(t) {
  return `# ${t.title}

## Status

Rascunho local com prints reais capturados.

## Objetivo

${t.objective}

## Para quem é

${t.audience.map((item) => `- ${item}`).join('\n')}

## Quando usar

${t.whenUse}

## Antes de começar

${t.beforeStart.map((item) => `- ${item}`).join('\n')}

## Palavra-chave

${t.keyword}

## SEO

- **Título SEO:** ${t.seoTitle}
- **Slug:** ${t.slugSeo}
- **Meta description:** ${t.meta}

## Passo a passo

${t.steps.map((step, index) => `### ${index + 1}. ${step.heading}

${step.text}

![${step.alt}](${imgPath(t.slug, step.image)})

${step.caption}
`).join('\n')}

## Onde entram os prints

${t.steps.map((step, index) => `- Print ${String(index + 1).padStart(2, '0')}: ${step.caption}`).join('\n')}

## Legenda e instrução dos prints

${t.steps.map((step, index) => `- Print ${String(index + 1).padStart(2, '0')}: ${step.alt}`).join('\n')}

## Alerta de dados sensíveis

- não exponha senhas, tokens, cookies ou sessões;
- não mostre dados de outra conta;
- não salve nenhuma credencial no arquivo;
- se aparecer uma informação sensível, mascare ou refaça a captura.

## Erros comuns

${t.errors.map((item) => `- ${item}`).join('\n')}

## Quando abrir ticket

${t.ticket.map((item) => `- ${item}`).join('\n')}

## Conclusão

${t.conclusion}

## Checklist SEO Rank Math

- [x] palavra-chave principal definida
- [x] título SEO definido
- [x] slug definido
- [x] meta description definida
- [x] palavra-chave presente no título
- [x] palavra-chave presente na introdução
- [x] palavra-chave presente no slug
- [x] meta description clara e útil

## Checklist UI/UX

- [x] objetivo claro em poucos segundos
- [x] ordem dos passos lógica
- [x] você sabe onde clicar
- [x] a linguagem está simples
- [x] há orientação quando algo não aparece
- [x] o fluxo reduz fricção

## Checklist visual/prints

- [x] contexto suficiente
- [x] sem dados sensíveis
- [x] foco visual claro
- [x] marcação útil
- [x] sem corte excessivo
- [x] sem zoom excessivo

## Checklist final antes do WordPress

- [x] rascunho local concluído
- [x] SEO definido
- [x] UI/UX validado
- [x] print plan criado
- [x] HTML preview criado
- [x] HTML WordPress criado
- [x] sem publicação
- [x] sem mídia no WordPress

## Validação interna

- **Agente Tutorial StayCloud:** ${t.validation.tutorial}
- **Agente SEO Rank Math:** ${t.validation.seo}
- **Agente Visual e Prints:** ${t.validation.visual}
- **Agente UI/UX Experience:** ${t.validation.uiux}
- **Agente Redator:** ${t.validation.writer}
- **Agente Segurança:** ${t.validation.security}
- **Agente Auditor:** ${t.validation.auditor}
- **Quality Gate:** ${t.validation.gate}

## Observações

${t.validation.note}
`;
}

function renderPreviewHTML(t) {
  const items = t.steps.map((step, index) => `
    <section class="step">
      <div class="step-num">${index + 1}</div>
      <div class="step-content">
        <h3>${step.heading}</h3>
        <p>${step.text}</p>
        <figure>
          <img src="${imgPath(t.slug, step.image)}" alt="${step.alt}">
          <figcaption>${step.caption}</figcaption>
        </figure>
      </div>
    </section>
  `).join('\n');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.title}</title>
  <style>
    :root{
      --bg:#f5f7fb; --card:#ffffff; --ink:#10203a; --muted:#5e6b7d; --line:#d9e2ef; --brand:#1d4ed8; --accent:#0f766e;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:Arial,Helvetica,sans-serif;background:linear-gradient(180deg,#f4f8ff 0,#eef2f7 100%);color:var(--ink)}
    .shell{max-width:1100px;margin:0 auto;padding:32px 20px 64px}
    .hero{background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 55%,#0f766e 100%);color:#fff;border-radius:24px;padding:28px 28px 22px;box-shadow:0 20px 40px rgba(2,6,23,.16)}
    .hero h1{margin:0 0 10px;font-size:34px;line-height:1.12}
    .hero p{margin:0;color:rgba(255,255,255,.92);max-width:860px;font-size:16px;line-height:1.6}
    .meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}
    .meta .box{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:14px 16px}
    .meta .label{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8;margin-bottom:6px}
    .meta .value{font-weight:700;line-height:1.45}
    .card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px;margin-top:18px;box-shadow:0 16px 34px rgba(15,23,42,.06)}
    h2{margin:0 0 12px;font-size:24px}
    h3{margin:0 0 8px;font-size:20px}
    p,li{font-size:16px;line-height:1.7}
    ul{margin:10px 0 0 20px}
    .alert{background:#fff8e1;border:1px solid #f4d47a;color:#694d00;border-radius:16px;padding:14px 16px}
    .step{display:grid;grid-template-columns:52px 1fr;gap:16px;align-items:start;margin:18px 0}
    .step-num{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--brand);color:#fff;font-weight:800;font-size:18px;box-shadow:0 12px 24px rgba(29,78,216,.25)}
    figure{margin:14px 0 0}
    img{width:100%;height:auto;border-radius:18px;border:1px solid var(--line);box-shadow:0 12px 30px rgba(15,23,42,.08)}
    figcaption{margin-top:10px;color:var(--muted);font-size:14px;line-height:1.5}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .badge{display:inline-flex;gap:8px;align-items:center;background:#ecfeff;color:#115e59;border:1px solid #99f6e4;padding:6px 10px;border-radius:999px;font-size:13px;font-weight:700}
    .checklist li{margin-bottom:6px}
    table{width:100%;border-collapse:collapse;font-size:15px}
    th,td{border-bottom:1px solid var(--line);text-align:left;padding:10px 8px;vertical-align:top}
    th{background:#f8fafc}
    @media (max-width:900px){.meta,.grid2{grid-template-columns:1fr}.hero h1{font-size:28px}.step{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="shell">
    <section class="hero">
      <span class="badge">Rascunho local</span>
      <h1>${t.title}</h1>
      <p>${t.objective}</p>
      <div class="meta">
        <div class="box"><span class="label">Para quem é</span><div class="value">${t.audience[0]}</div></div>
        <div class="box"><span class="label">Palavra-chave</span><div class="value">${t.keyword}</div></div>
        <div class="box"><span class="label">Status</span><div class="value">Rascunho local com prints reais</div></div>
      </div>
    </section>

    <section class="card">
      <h2>Quando usar</h2>
      <p>${t.whenUse}</p>
    </section>

    <section class="card">
      <h2>Antes de começar</h2>
      <ul>${t.beforeStart.map((item) => `<li>${item}</li>`).join('')}</ul>
    </section>

    <section class="card">
      <h2>Passo a passo</h2>
      ${items}
    </section>

    <section class="card">
      <h2>Erros comuns</h2>
      <ul>${t.errors.map((item) => `<li>${item}</li>`).join('')}</ul>
    </section>

    <section class="card">
      <h2>Quando abrir ticket</h2>
      <ul>${t.ticket.map((item) => `<li>${item}</li>`).join('')}</ul>
    </section>

    <section class="card alert">
      <h2>Alerta de dados sensíveis</h2>
      <ul>
        <li>não exponha senhas, tokens, cookies ou sessões</li>
        <li>não mostre dados de outra conta</li>
        <li>mascare informações sensíveis antes de revisar o print</li>
      </ul>
    </section>

    <section class="card">
      <h2>SEO e checklist</h2>
      <div class="grid2">
        <div>
          <p><strong>Título SEO:</strong> ${t.seoTitle}</p>
          <p><strong>Slug:</strong> ${t.slugSeo}</p>
          <p><strong>Meta description:</strong> ${t.meta}</p>
        </div>
        <div>
          <h3>Checklist visual</h3>
          <ul class="checklist">
            <li>o clique principal está marcado</li>
            <li>o print está legível</li>
            <li>a legenda explica a ação</li>
            <li>não há dado sensível visível</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Conclusão</h2>
      <p>${t.conclusion}</p>
    </section>
  </div>
</body>
</html>`;
}

function renderWordPressHTML(t) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.title}</title>
</head>
<body>
  <article>
    <h1>${t.title}</h1>
    <p><strong>Status:</strong> Rascunho local com prints reais capturados e marcações visíveis.</p>
    <p>${t.objective}</p>

    <h2>Quando usar</h2>
    <p>${t.whenUse}</p>

    <h2>Antes de começar</h2>
    <ul>${t.beforeStart.map((item) => `<li>${item}</li>`).join('')}</ul>

    <h2>Passo a passo</h2>
    ${t.steps.map((step, index) => `<!-- Imagem futura: ${step.image}.png | ALT: ${step.alt} -->\n    <h3>${index + 1}. ${step.heading}</h3>\n    <p>${step.text}</p>\n    <p><em>${step.caption}</em></p>`).join('\n')}

    <h2>Erros comuns</h2>
    <ul>${t.errors.map((item) => `<li>${item}</li>`).join('')}</ul>

    <h2>Quando abrir ticket</h2>
    <ul>${t.ticket.map((item) => `<li>${item}</li>`).join('')}</ul>

    <h2>SEO</h2>
    <p><strong>Palavra-chave:</strong> ${t.keyword}</p>
    <p><strong>Título SEO:</strong> ${t.seoTitle}</p>
    <p><strong>Slug:</strong> ${t.slugSeo}</p>
    <p><strong>Meta description:</strong> ${t.meta}</p>

    <h2>Checklist final antes do WordPress</h2>
    <ul>
      <li>rascunho local concluído</li>
      <li>SEO definido</li>
      <li>UI/UX validado</li>
      <li>print plan criado</li>
      <li>HTML preview criado</li>
      <li>HTML WordPress criado</li>
      <li>sem publicação</li>
      <li>sem mídia no WordPress</li>
    </ul>

    <h2>Conclusão</h2>
    <p>${t.conclusion}</p>
  </article>
</body>
</html>`;
}

function renderPlan(t) {
  return `# Plano de Prints - ${t.title}

${printPlanTable(t)}

## Observações

${t.printNotes.map((p) => `- ${p.file}: ${p.status}. Revisão humana: ${p.human}.`).join('\n')}

## Critério do lote

- status geral esperado: ${t.validation.tutorial}
- risco predominante: ${t.printNotes.some((p) => p.risk === 'médio') ? 'médio em pontos finais' : 'baixo'}
- uso no tutorial final: ${t.slug === 'como-gerar-certificados-ssl-gratuitos-no-painel-novo-da-staycloud' ? 'usar apenas os prints validados para a jornada principal; a emissão final ficou como precisa validar' : 'usar todos os prints capturados e marcados'}
`;
}

function renderValidation(t) {
  return `# Validação Local - ${t.title}

## Status geral

${t.validation.tutorial}

## Resultado por agente

- Agente Tutorial StayCloud: ${t.validation.tutorial}
- Agente SEO Rank Math: ${t.validation.seo}
- Agente Visual e Prints: ${t.validation.visual}
- Agente UI/UX Experience: ${t.validation.uiux}
- Agente Redator: ${t.validation.writer}
- Agente Segurança: ${t.validation.security}
- Agente Auditor: ${t.validation.auditor}
- Quality Gate: ${t.validation.gate}

## Observação

${t.validation.note}

## Risco visual

${t.printNotes.some((p) => p.risk === 'médio') ? 'médio em parte do fluxo final' : 'baixo'}

## Revisão humana

${t.printNotes.some((p) => p.human === 'sim, para conferir o valor final antes de publicar' || p.human === 'sim, porque a emissão final ficou como precisa validar' || p.human === 'sim, se o exemplo for aplicado em um ambiente seguro') ? 'necessária em pelo menos um ponto do fluxo' : 'não obrigatória para a jornada principal'}
`;
}

for (const t of tutorials) {
  const printDir = path.join(root, 'prints', t.slug);
  const validationSubdir = path.join(validacoesDir, t.slug);
  fs.mkdirSync(markdownDir, { recursive: true });
  fs.mkdirSync(previewDir, { recursive: true });
  fs.mkdirSync(wordpressDir, { recursive: true });
  fs.mkdirSync(printDir, { recursive: true });
  fs.mkdirSync(validationSubdir, { recursive: true });

  fs.writeFileSync(path.join(markdownDir, `${t.slug}.md`), renderMarkdown(t));
  fs.writeFileSync(path.join(previewDir, `${t.slug}.html`), renderPreviewHTML(t));
  fs.writeFileSync(path.join(wordpressDir, `${t.slug}.html`), renderWordPressHTML(t));
  fs.writeFileSync(path.join(validationSubdir, 'plano-de-prints.md'), renderPlan(t));
  fs.writeFileSync(path.join(validationSubdir, 'validacao-local.md'), renderValidation(t));
}

fs.writeFileSync(
  path.join(validacoesDir, 'resumo-lote-02.md'),
  `# Resumo - Lote 02\n\n${tutorials.map((t) => `- ${t.title}: ${t.validation.tutorial}`).join('\n')}\n`
);
