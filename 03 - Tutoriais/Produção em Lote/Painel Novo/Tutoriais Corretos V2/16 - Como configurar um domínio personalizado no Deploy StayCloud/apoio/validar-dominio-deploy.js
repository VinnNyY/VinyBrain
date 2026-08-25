const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const projectName = 'tutorial-deploy-cli-teste';

for (const dir of [finalsDir, originalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function sanitizeText(value) {
  return String(value || '')
    .replace(/(--token\s+)(["']?)[^\s"']+/gi, '$1SEU_TOKEN')
    .replace(/(--api-url\s+)(["']?)[^\s"']+/gi, '$1URL_DA_API')
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, '$1TOKEN_CENSURADO')
    .replace(/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1TOKEN_CENSURADO')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]')
    .replace(/https?:\/\/(?!tutorial-deploy-cli-teste\.stayai\.space)[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"')<]*)?/gi, '[URL censurada]')
    .replace(/\b(?!tutorial-deploy-cli-teste\.stayai\.space\b)(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br|dev|app|cloud|space)\b/gi, '[dominio censurado]')
    .replace(/(vinicius|viny|legacy doc|legacy)/gi, '[dado censurado]');
}

async function login(page) {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  if (!email || !password) throw new Error('Credenciais do painel nao encontradas.');
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await wait(1200);
  const text = await page.evaluate(() => document.body.innerText);
  if (!/login|entrar|email|senha/i.test(text)) return 'sessao-reutilizada';
  await page.waitForSelector('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', { timeout: 30000 });
  await page.type('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', email, { delay: 8 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 8 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
  ]);
  await wait(2500);
  const after = await page.evaluate(() => document.body.innerText);
  if (/login|entrar/i.test(after) && /senha/i.test(after)) throw new Error('Login no painel nao confirmado.');
  return 'novo-login';
}

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll([
      '.intercom-lightweight-app',
      '.intercom-app',
      'iframe[src*="intercom"]',
      'iframe[src*="crisp"]',
      'iframe[src*="tawk"]',
      '.toast',
    ].join(',')).forEach((el) => el.remove());
    [...document.querySelectorAll('div, section, aside')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ');
      const style = getComputedStyle(el);
      if (/Em uma escala de 0 a 10/.test(text) && (style.position === 'fixed' || el.getBoundingClientRect().top > innerHeight - 220)) {
        el.remove();
      }
    });
  }).catch(() => {});
}

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1SEU_TOKEN'],
      [/(--api-url\s+)(["']?)[^\s"']+/gi, '$1URL_DA_API'],
      [/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, '$1TOKEN_CENSURADO'],
      [/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1TOKEN_CENSURADO'],
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/https?:\/\/(?!tutorial-deploy-cli-teste\.stayai\.space)[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"')<]*)?/gi, '[URL censurada]'],
      [/\b(?!tutorial-deploy-cli-teste\.stayai\.space\b)(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br|dev|app|cloud|space)\b/gi, '[dominio censurado]'],
      [/(vinicius|viny|legacy doc|legacy)/gi, '[dado censurado]'],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue || '';
      for (const [re, replacement] of replacements) value = value.replace(re, replacement);
      node.nodeValue = value;
    });
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'password') el.value = '';
      if (/token|secret|key|senha|password/i.test([el.name, el.id, el.placeholder].filter(Boolean).join(' '))) el.value = '';
    });
  });
}

async function rectFor(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"], [role="tab"], input, textarea, span, div, h1, h2, h3, p, code, pre, td, th')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title'), el.getAttribute('placeholder'), el.value]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 8 || r.height < 8) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      if (opts.maxHeight != null && r.height > opts.maxHeight) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (opts.smallest) return (ar.width * ar.height) - (br.width * br.height);
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function mark(page, rect) {
  await page.evaluate(({ rect }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${rect.x - 5}px`,
      `top:${rect.y - 5}px`,
      `width:${rect.width + 10}px`,
      `height:${rect.height + 10}px`,
      'border:3px solid #2563eb',
      'border-radius:8px',
      'box-shadow:0 0 0 4px rgba(37,99,235,.14)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect });
}

async function savePair(page, file, rect) {
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(originalsDir, `${file}-original.png`), fullPage: false });
  await sanitizeDom(page);
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
}

async function clickText(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('a, button, [role="button"], [role="tab"], div, span')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 8 || r.height < 8) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (opts.smallest) return (ar.width * ar.height) - (br.width * br.height);
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = candidates[opts.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    (el.closest('button, a, [role="button"], [role="tab"]') || el).click();
    return true;
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function clickProjectCard(page) {
  return page.evaluate((projectName) => {
    const candidates = [...document.querySelectorAll('button, a, [role="button"], div')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return text.includes(projectName) && /Abrir|pronto|domínio/i.test(text) && r.width > 450 && r.height > 40 && r.top > 250;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || ((br.width * br.height) - (ar.width * ar.height));
    });
    const el = candidates[0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    (el.closest('button, a, [role="button"]') || el).click();
    return true;
  }, projectName);
}

async function collect(page) {
  return page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input, textarea')].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        type: el.getAttribute('type') || el.tagName.toLowerCase(),
        name: el.getAttribute('name') || '',
        id: el.getAttribute('id') || '',
        placeholder: el.getAttribute('placeholder') || '',
        value: el.value || '',
        required: el.required,
        disabled: el.disabled,
        x: Math.round(r.left),
        y: Math.round(r.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    }).filter((item) => item.width > 0 && item.height > 0);
    const buttons = [...document.querySelectorAll('button, a, [role="button"], [role="tab"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return { text, disabled: el.disabled || el.getAttribute('aria-disabled') === 'true', x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter((item) => item.text && item.width > 0 && item.height > 0);
    return {
      url: location.href,
      title: document.title,
      body: document.body.innerText,
      inputs,
      buttons,
    };
  });
}

async function typeIntoFirstDomainField(page, value) {
  const selector = await page.evaluate(() => {
    const fields = [...document.querySelectorAll('input, textarea')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const r = el.getBoundingClientRect();
      const text = [el.getAttribute('name'), el.getAttribute('id'), el.getAttribute('placeholder'), el.getAttribute('aria-label')]
        .filter(Boolean).join(' ');
      return r.width > 30 && r.height > 15 && !el.disabled && el.type !== 'search' && /dom[aíi]nio|domain|host|url|endere|www\./i.test(text);
    });
    const el = fields[0] || [...document.querySelectorAll('input, textarea')].find((field) => {
      const r = field.getBoundingClientRect();
      return r.width > 80 && r.height > 20 && !field.disabled && !/password|senha|token|secret|key/i.test([field.type, field.name, field.id, field.placeholder].join(' '));
    });
    if (!el) return '';
    if (!el.id) el.id = `domain-field-${Date.now()}`;
    return `#${CSS.escape(el.id)}`;
  });
  if (!selector) return false;
  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value, { delay: 5 });
  await wait(800);
  return true;
}

async function rectForDomainInput(page) {
  return page.evaluate(() => {
    const fields = [...document.querySelectorAll('input, textarea')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 100 && r.height > 20 && !el.disabled && el.type !== 'search';
    }).sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = fields[0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  });
}

async function main() {
  fs.rmSync(finalsDir, { recursive: true, force: true });
  fs.mkdirSync(finalsDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);

  const loginMode = await login(page);
  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(2500);
  await dismissOverlays(page);

  const cardRect = await rectFor(page, new RegExp(projectName, 'i'), { minY: 120, maxWidth: 760 }) ||
    { x: 260, y: 250, width: 560, height: 140 };
  await savePair(page, '01-aplicacao-correta-sanitizado', cardRect);
  const projectClicked = await clickProjectCard(page);
  if (!projectClicked) await clickText(page, new RegExp(projectName, 'i'), { minY: 250, maxWidth: 1200 });
  await wait(2500);
  const projectState = await collect(page);

  let domainAreaClicked = await clickText(page, /^Dom[ií]nios?$|Dom[ií]nios?\s+\d*|Domains?/i, { minX: 60, minY: 120, maxWidth: 260, smallest: true });
  if (!domainAreaClicked) domainAreaClicked = await clickText(page, /Dom[ií]nios?|Domains?/i, { minX: 60, minY: 120, maxWidth: 320, smallest: true });
  await wait(2500);
  const domainsState = await collect(page);
  const areaRect = await rectFor(page, /^Dom[ií]nios?$|Dom[ií]nios?\s+\d*|Domains?/i, { minY: 100, maxWidth: 320, smallest: true }) ||
    await rectFor(page, /Dom[ií]nios?|Domains?/i, { minY: 100, maxWidth: 480, smallest: true }) ||
    { x: 230, y: 150, width: 180, height: 50 };
  await savePair(page, '02-area-dominio-sanitizado', areaRect);

  let addClicked = await clickText(page, /Adicionar.*dom|Novo.*dom|Conectar.*dom|Add.*domain|Custom domain|Dom[ií]nio personalizado/i, { minY: 120, maxWidth: 420, smallest: true });
  await wait(1800);
  const afterAddState = await collect(page);
  const fieldRect = await rectForDomainInput(page) ||
    await rectFor(page, /dom[aíi]nio|domain|host|url|endere|exemplo|example|www\./i, { minY: 120, maxHeight: 100, smallest: true }) ||
    { x: 420, y: 360, width: 520, height: 48 };

  let typedSubdomain = false;
  let typedRoot = false;
  if (afterAddState.inputs.length) {
    typedSubdomain = await typeIntoFirstDomainField(page, 'app.exemplo.com.br');
    await wait(800);
    await savePair(page, '03-adicionar-dominio-sanitizado', fieldRect);
    typedRoot = await typeIntoFirstDomainField(page, 'exemplo.com.br');
    await wait(800);
  } else {
    await savePair(page, '03-adicionar-dominio-sanitizado', fieldRect);
  }

  const afterTypingState = await collect(page);
  const dnsRect = await rectFor(page, /\bCNAME\b|DNS|registro|record|apont/i, { minY: 120, maxWidth: 900, smallest: true }) ||
    fieldRect;
  await savePair(page, '04-instrucoes-dns-sanitizado', dnsRect);

  const validationRect = await rectFor(page, /PENDENTES|ATIVOS|ERRO|SSL ok|aguardando|requer atenção/i, { minY: 120, maxWidth: 900, smallest: true }) ||
    dnsRect;
  await savePair(page, '06-validacao-sanitizado', validationRect);

  const report = {
    date: new Date().toISOString(),
    loginMode,
    projectName,
    safety: {
      dnsAuthorizationFoundInObsidian: false,
      externalDnsChanged: false,
      domainSubmittedOrSaved: false,
      productionDomainTouched: false,
      billingActionExecuted: false,
    },
    projectState: {
      url: projectState.url,
      bodySample: sanitizeText(projectState.body.slice(0, 5000)),
      buttons: projectState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    domainsState: {
      url: domainsState.url,
      bodySample: sanitizeText(domainsState.body.slice(0, 7000)),
      buttons: domainsState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
      inputs: domainsState.inputs.map((item) => ({ ...item, name: sanitizeText(item.name), id: sanitizeText(item.id), placeholder: sanitizeText(item.placeholder), value: sanitizeText(item.value) })),
    },
    afterAddState: {
      clickedAddDomain: addClicked,
      url: afterAddState.url,
      bodySample: sanitizeText(afterAddState.body.slice(0, 9000)),
      buttons: afterAddState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
      inputs: afterAddState.inputs.map((item) => ({ ...item, name: sanitizeText(item.name), id: sanitizeText(item.id), placeholder: sanitizeText(item.placeholder), value: sanitizeText(item.value) })),
    },
    afterTypingState: {
      typedSubdomainWithoutSubmitting: typedSubdomain,
      typedRootWithoutSubmitting: typedRoot,
      url: afterTypingState.url,
      bodySample: sanitizeText(afterTypingState.body.slice(0, 10000)),
      buttons: afterTypingState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
      inputs: afterTypingState.inputs.map((item) => ({ ...item, name: sanitizeText(item.name), id: sanitizeText(item.id), placeholder: sanitizeText(item.placeholder), value: sanitizeText(item.value) })),
    },
    answers: {
      areaExists: /dom[ií]nios?|domains?/i.test(domainsState.body) || domainAreaClicked,
      officialAreaName: /Dom[ií]nios/.test(domainsState.body) ? 'Domínios' : (/Domains/i.test(domainsState.body) ? 'Domains' : 'não confirmado'),
      acceptsRootDomain: typedRoot ? 'campo aceitou digitação de domínio raiz; salvamento não executado por segurança' : 'não confirmado',
      acceptsSubdomain: typedSubdomain ? 'campo aceitou digitação de subdomínio; salvamento não executado por segurança' : 'não confirmado',
      requiredInformation: afterAddState.inputs.length ? 'endereço de domínio/subdomínio no campo exibido' : 'não confirmado',
      panelProvidesDnsRecord: /\b(CNAME|A|AAAA|TXT)\b|DNS|registro|record|apont/i.test(afterTypingState.body) ? 'há instrução de DNS visível no fluxo inspecionado' : 'não confirmado sem salvar domínio',
      requestedRecordType: ((afterTypingState.body.match(/\b(CNAME|A|AAAA|TXT)\b/i) || [])[1] || 'não confirmado'),
      hasVerifyButton: /verificar|validar/i.test(afterTypingState.body),
      hasValidationStatus: /pendente|validado|aguardando|status|erro/i.test(afterTypingState.body),
      showsSsl: /\bSSL\b|certificado/i.test(afterTypingState.body),
      hasTemporaryDomain: /stayai\.space|dom[ií]nio tempor[aá]rio|tempor/i.test(projectState.body + domainsState.body),
      originalUrlStillWorks: 'confirmado em validações anteriores; não alterado nesta execução',
      billing: /cobran[çc]a|fatura|pagamento|plano/i.test(afterTypingState.body) ? 'há texto de plano/cobrança no painel; nenhuma ação financeira executada' : 'não identificado na tela de domínios',
      domainLimit: ((afterTypingState.body.match(/limite|(\d+)\s+dom/i) || [])[0] || 'não confirmado'),
      removable: /remover|excluir|deletar/i.test(afterTypingState.body),
    },
    screenshots: fs.readdirSync(finalsDir).filter((file) => file.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'validacao-dominio-deploy.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'estado-dominios-sanitizado.txt'), [
    '# Projeto',
    sanitizeText(projectState.body),
    '\n# Area de dominios',
    sanitizeText(domainsState.body),
    '\n# Fluxo adicionar dominio',
    sanitizeText(afterAddState.body),
    '\n# Depois de digitar exemplos sem salvar',
    sanitizeText(afterTypingState.body),
  ].join('\n\n'));

  console.log(JSON.stringify({
    areaExists: report.answers.areaExists,
    officialAreaName: report.answers.officialAreaName,
    clickedAddDomain: addClicked,
    screenshots: report.screenshots,
    report: path.join(reportsDir, 'validacao-dominio-deploy.json'),
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(sanitizeText(error.message));
  process.exit(1);
});
