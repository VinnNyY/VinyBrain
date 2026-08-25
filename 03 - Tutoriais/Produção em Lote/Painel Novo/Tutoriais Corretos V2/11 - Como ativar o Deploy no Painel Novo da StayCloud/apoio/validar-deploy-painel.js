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
    [...document.querySelectorAll('body *')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const box = el.getBoundingClientRect();
      if (box.left > innerWidth - 300 && box.top > innerHeight - 230) el.remove();
      if (/Em uma escala de 0 a 10|quanto você recomendaria|Olá\. Precisa de ajuda/i.test(text)) el.remove();
    });
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

async function sanitize(page) {
  await page.evaluate(() => {
    const replacements = [
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi, '[dominio censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(vinicius|viny|admin|financeiro|suporte|contato|legacy doc)/gi, '[dado censurado]'],
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
    const nodes = [...document.querySelectorAll('a, button, [role="button"], [role="tab"], span, div, h1, h2, h3, p')];
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

async function buttonRectFor(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"]')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 10 || r.height < 10) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function mark(page, rect, label) {
  await page.evaluate(({ rect }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
    const color = '#2563eb';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${rect.x - 5}px`,
      `top:${rect.y - 5}px`,
      `width:${rect.width + 10}px`,
      `height:${rect.height + 10}px`,
      `border:3px solid ${color}`,
      'border-radius:8px',
      'box-shadow:0 0 0 4px rgba(37,99,235,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect, label });
}

async function savePair(page, name, rect, label) {
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(originalsDir, `${name}-original.png`), fullPage: false });
  await sanitize(page);
  await mark(page, rect, label);
  await page.screenshot({ path: path.join(finalsDir, `${name}.png`), fullPage: false });
}

async function clickFirst(page, pattern, opts = {}) {
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

async function collectState(page) {
  return page.evaluate(() => {
    const clean = (value) => (value || '')
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
      .replace(/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi, '[dominio censurado]')
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]');
    const buttons = [...document.querySelectorAll('a, button, [role="button"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const text = clean([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim());
      return { text, x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter((item) => item.text && item.width >= 10 && item.height >= 10);
    const tabs = [...document.querySelectorAll('[role="tab"], a, button')].map((el) => clean(el.innerText || el.textContent || '')).filter((text) => /Visão geral|Deployments|Logs|Domínios|Integrações|Plano/i.test(text));
    return {
      url: location.href,
      title: clean(document.title),
      bodySample: clean(document.body.innerText.replace(/\s+/g, ' ').slice(0, 5000)),
      buttons,
      tabs: [...new Set(tabs)],
    };
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
  page.setDefaultTimeout(35000);
  const loginMode = await login(page, email, password);

  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await wait(2200);
  await dismissOverlays(page);
  const deployMenu = await rectFor(page, /^Deploy$/i, { maxX: 260, maxWidth: 220 }) || await rectFor(page, /Deploy/i, { maxX: 280, maxWidth: 240 });
  if (!deployMenu) throw new Error('MENU_DEPLOY_NAO_ENCONTRADO');
  await savePair(page, '01-menu-deploy-sanitizado', deployMenu, 'Deploy');

  await page.evaluate(() => document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove()));
  await clickFirst(page, /^Deploy$/i, { maxX: 280, maxWidth: 240 });
  await wait(3500);
  if (!/\/dashboard\/cloud/.test(page.url())) {
    await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
    await wait(2500);
  }
  await dismissOverlays(page);
  const cloudTitle = await rectFor(page, /Cloud|Deploy/i, { minX: 220, minY: 80, maxHeight: 180 }) || { x: 260, y: 92, width: 420, height: 160 };
  await savePair(page, '02-tela-inicial-deploy-sanitizado', cloudTitle, 'Tela do Deploy');
  const initialState = await collectState(page);

  const prereq = await rectFor(page, /cloud ainda n[aã]o ativo/i, { minX: 260, minY: 120, maxWidth: 220, maxHeight: 80, smallest: true }) ||
    await rectFor(page, /Ainda n[aã]o ativo|n[aã]o ativo|Ative/i, { minX: 260, minY: 120, maxWidth: 260, maxHeight: 90, smallest: true }) ||
    cloudTitle;
  await savePair(page, '03-status-cloud-nao-ativo-sanitizado', prereq, 'Status');

  const activation = await buttonRectFor(page, /^Começar grátis/i, { minX: 260, minY: 120, maxWidth: 240 }) ||
    await buttonRectFor(page, /Ativar|Começar|Iniciar|Contratar|Criar/i, { minX: 260, minY: 120, maxWidth: 260 });
  if (activation) await savePair(page, '04-botao-ativacao-sanitizado', activation, 'Começar grátis');

  const report = {
    data: new Date().toISOString(),
    loginMode,
    acaoExecutada: 'consulta, navegacao e prints; nenhum clique de ativacao',
    estadoInicial: initialState,
    ativacao: {
      botaoEncontrado: Boolean(activation),
      executada: false,
      motivoParada: 'ativacao pode criar recurso, contratar plano ou iniciar servico; exige validacao humana antes do clique final',
    },
    printsFinais: fs.readdirSync(finalsDir).filter((file) => file.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'validacao-deploy-painel.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(`ERRO_FLUXO_REAL: ${error.message}`);
  process.exit(1);
});
