const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(root, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

for (const dir of [originalsDir, finalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function sanitizeText(value) {
  return (value || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi, '[dominio censurado]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]')
    .replace(/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/Legacy Doc/gi, '[dado censurado]');
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
  });
}

async function login(page, email, password) {
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
  await wait(3000);
  const body = await page.evaluate(() => document.body.innerText);
  if (/captcha|verifica|verification|código|codigo/i.test(body) && /login|entrar|senha/i.test(body)) throw new Error('VERIFICACAO_MANUAL');
  if (/login|entrar/i.test(body) && /senha/i.test(body)) throw new Error('LOGIN_NAO_CONFIRMADO');
  return 'novo-login';
}

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi, '[dominio censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]'],
      [/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]'],
      [/(vinicius|viny|admin|financeiro|suporte|contato|legacy doc|legacy)/gi, '[dado censurado]'],
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
      if (/email|user|usuario|domain|dominio|host|ip|name|nome|repo|token|key|secret/i.test([el.name, el.id, el.placeholder].filter(Boolean).join(' '))) el.value = '';
    });
  });
}

async function rectFor(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"], [role="tab"], span, div, h1, h2, h3, p, code, pre')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 8 || r.height < 8) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
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
      'box-shadow:0 0 0 4px rgba(37,99,235,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect });
}

async function savePair(page, name, rect) {
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(originalsDir, `${name}-original.png`), fullPage: false });
  await sanitizeDom(page);
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${name}.png`), fullPage: false });
}

async function clickText(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('a, button, [role="button"]')].filter((el) => {
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 10 || r.height < 10) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = candidates[opts.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.click();
    return true;
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function forceClickText(page, pattern) {
  return page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('button, a, [role="button"], div, span')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return re.test(text) && r.width >= 20 && r.height >= 20 && style.display !== 'none' && style.visibility !== 'hidden';
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    });
    const el = candidates[0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const clickable = el.closest('button, a, [role="button"]') || el;
    clickable.click();
    return true;
  }, { source: pattern.source, flags: pattern.flags });
}

async function collect(page) {
  return page.evaluate(() => {
    const buttons = [...document.querySelectorAll('a, button, [role="button"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return { text, x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter((item) => item.text && item.width >= 8 && item.height >= 8);
    const body = document.body.innerText.replace(/\s+/g, ' ');
    return { url: location.href, title: document.title, body, buttons };
  });
}

async function main() {
  fs.rmSync(finalsDir, { recursive: true, force: true });
  fs.mkdirSync(finalsDir, { recursive: true });

  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  if (!email || !password) throw new Error('CREDENCIAIS_NAO_ENCONTRADAS');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  const loginMode = await login(page, email, password);

  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(2500);
  await dismissOverlays(page);
  const initial = await collect(page);
  await page.evaluate(() => {
    [...document.querySelectorAll('button, a, [role="button"]')].forEach((el) => {
      const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim();
      if (/Fechar|×/i.test(text)) {
        const box = el.getBoundingClientRect();
        if (box.top > innerHeight - 180 || box.left > innerWidth - 80) el.click();
      }
    });
  }).catch(() => {});
  await wait(800);
  const billingRisk = /cobran[çc]a|fatura|pagamento|checkout|plano pago/i.test(initial.body) && !/sem cart[aã]o|Começar grátis/i.test(initial.body);
  const startRect = await rectFor(page, /Começar grátis|Novo projeto|Publicar agora|Criar projeto|Primeiro deploy|Deploy/i, { minX: 260, minY: 120, maxWidth: 280, smallest: true }) ||
    { x: 340, y: 430, width: 180, height: 44 };
  await savePair(page, '01-iniciar-deploy-sanitizado', startRect);

  let afterStart = initial;
  let clickedStart = false;
  if (!billingRisk && /Começar grátis/i.test(initial.body)) {
    clickedStart = await clickText(page, /^Começar grátis/i, { minX: 260, minY: 120, maxWidth: 240 });
    if (!clickedStart) clickedStart = await forceClickText(page, /^Começar grátis/i);
    await wait(5000);
    afterStart = await collect(page);
  }

  const projectRect = await rectFor(page, /npx @staysdev\/setup init|GitHub|\.zip|comece do zero|Novo projeto|Criar projeto|token/i, { minX: 260, minY: 120, maxWidth: 800, smallest: true }) ||
    await rectFor(page, /Deployments|Logs|Domínios|Integrações|Plano/i, { minX: 60, minY: 120, maxWidth: 260, smallest: true }) ||
    startRect;
  await savePair(page, '02-informar-projeto-sanitizado', projectRect);

  const finalState = await collect(page);
  const rawCommand = (finalState.body.match(/npx\s+@staysdev\/setup\s+init(?:\s+--token\s+\S+)?/i) || [''])[0];
  const report = {
    data: new Date().toISOString(),
    loginMode,
    billingRiskBeforeClick: billingRisk,
    clickedStart,
    initial: {
      url: initial.url,
      bodySample: sanitizeText(initial.body.slice(0, 5000)),
      buttons: initial.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    afterStart: {
      url: afterStart.url,
      bodySample: sanitizeText(afterStart.body.slice(0, 5000)),
      buttons: afterStart.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    finalState: {
      url: finalState.url,
      bodySample: sanitizeText(finalState.body.slice(0, 7000)),
      buttons: finalState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    commandFoundSanitized: sanitizeText(rawCommand),
    commandHasToken: /--token\s+\S+/i.test(rawCommand),
    printsFinais: fs.readdirSync(finalsDir).filter((file) => file.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'validacao-painel-primeiro-deploy.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(`ERRO_FLUXO_REAL: ${error.message}`);
  process.exit(1);
});
