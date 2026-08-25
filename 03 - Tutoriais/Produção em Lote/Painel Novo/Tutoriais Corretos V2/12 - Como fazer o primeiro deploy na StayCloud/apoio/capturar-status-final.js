const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(root, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const publicUrl = 'https://tutorial-deploy-teste.stayai.space';

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
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]')
    .replace(/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/(--api-url\s+)(["']?)[^\s"']+/gi, '$1[URL_DA_API]')
    .replace(/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/Legacy Doc/gi, '[dado censurado]');
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
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]'],
      [/(--api-url\s+)(["']?)[^\s"']+/gi, '$1[URL_DA_API]'],
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
    document.querySelectorAll([
      '.intercom-lightweight-app',
      '.intercom-app',
      'iframe[src*="intercom"]',
      'iframe[src*="crisp"]',
      'iframe[src*="tawk"]',
    ].join(',')).forEach((el) => el.remove());
    [...document.querySelectorAll('div, section, aside')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const r = el.getBoundingClientRect();
      if (/Em uma escala de 0 a 10|quanto você recomendaria|Olá\. Precisa de ajuda/i.test(text) && r.width > 180 && r.height > 40) el.remove();
    });
  });
}

async function rectFor(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"], span, div, h1, h2, h3, p, code, pre')];
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
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
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
  await sanitizeDom(page);
  await page.screenshot({ path: path.join(originalsDir, `${name}-original.png`), fullPage: false });
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${name}.png`), fullPage: false });
}

async function collect(page) {
  return page.evaluate(() => ({
    url: location.href,
    title: document.title,
    body: document.body.innerText.replace(/\s+/g, ' '),
  }));
}

async function main() {
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
  await wait(3500);
  const dashboardState = await collect(page);
  const statusRect = await rectFor(page, /tutorial-deploy-teste|No ar|Online|Deployments|https:\/\/tutorial-deploy-teste/i, { minX: 260, minY: 120, maxWidth: 1000, smallest: true }) ||
    { x: 328, y: 320, width: 760, height: 180 };
  await savePair(page, '05-concluido-sanitizado', statusRect);

  const appPage = await browser.newPage();
  await appPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await appPage.goto(publicUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(1500);
  const appState = await collect(appPage);
  const appRect = await rectFor(appPage, /Tutorial Deploy Teste|ambiente de demonstração/i, { maxWidth: 900, smallest: true }) ||
    { x: 300, y: 240, width: 700, height: 180 };
  await savePair(appPage, '06-aplicacao-publicada-sanitizado', appRect);

  fs.writeFileSync(path.join(reportsDir, 'status-final-publicacao.json'), JSON.stringify({
    data: new Date().toISOString(),
    loginMode,
    publicUrl,
    dashboard: {
      url: sanitizeText(dashboardState.url),
      bodySample: sanitizeText(dashboardState.body.slice(0, 5000)),
    },
    app: {
      url: publicUrl,
      bodySample: sanitizeText(appState.body.slice(0, 2000)),
    },
  }, null, 2));

  await appPage.close();
  await browser.close();
}

main().catch((error) => {
  console.error(`ERRO_STATUS_FINAL: ${error.message}`);
  process.exit(1);
});
