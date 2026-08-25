const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const prompt = fs.readFileSync(promptPath, 'utf8');
const email = (prompt.match(/- Login do painel do cliente:\s*`([^`]*)`/) || [])[1];
const password = (prompt.match(/- Senha do painel do cliente:\s*`([^`]*)`/) || [])[1];
if (!email || !password) throw new Error('Nao consegui ler os acessos de teste no prompt local.');

const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/03 - Como usar busca e filtros na área de Domínios no Painel Novo da StayCloud';
const finalDir = path.join(root, 'prints-finais');
const apoioDir = path.join(root, 'apoio');
const oldDir = path.join(apoioDir, 'originais-e-versoes-antigas');
fs.mkdirSync(finalDir, { recursive: true });
fs.mkdirSync(oldDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function login(page) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"], input[name="email"], input[autocomplete="email"]', email, { delay: 10 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 10 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await sleep(1400);
}

async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove()));
}

async function sanitize(page) {
  await page.evaluate(() => {
    const domainRe = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com\.br|com|net|org|br|cloud|dev|site|online|store|app)\b/gi;
    const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const ipRe = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const moneyRe = /R\$\s*\d+(?:[.,]\d{2})?/g;
    const idRe = /\b(?:ID|Id|id)\s*#?\s*\d+\b/g;
    const accountRe = /Legacy Doc/g;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue
        .replace(emailRe, 'email oculto')
        .replace(ipRe, 'IP oculto')
        .replace(moneyRe, 'valor oculto')
        .replace(idRe, 'ID oculto')
        .replace(accountRe, 'Conta de teste')
        .replace(domainRe, 'dominio-exemplo.com.br');
    });
    document.querySelectorAll('input').forEach((input) => {
      const value = input.value || input.getAttribute('value') || '';
      if (domainRe.test(value) || emailRe.test(value)) {
        input.value = 'dominio-exemplo.com.br';
        input.setAttribute('value', 'dominio-exemplo.com.br');
      }
    });
  });
}

async function markSelector(page, selector, number, label, options = {}) {
  const ok = await page.evaluate(({ selector, number, label, options }) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.scrollIntoView({ block: options.block || 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const pad = options.pad ?? 6;
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${x - pad}px`,
      `top:${y - pad}px`,
      `width:${rect.width + pad * 2}px`,
      `height:${rect.height + pad * 2}px`,
      `border:${options.border || 3}px solid ${color}`,
      'border-radius:10px',
      'box-shadow:0 0 0 4px rgba(29,78,216,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = [
      'position:absolute',
      `left:${x + rect.width + 10}px`,
      `top:${Math.max(window.scrollY + 16, y + rect.height / 2 - 14)}px`,
      'width:28px',
      'height:28px',
      `background:${color}`,
      'color:#fff',
      'border:2px solid #fff',
      'border-radius:999px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font:800 13px/1 Arial,sans-serif',
      'pointer-events:none',
      'z-index:2147483001',
    ].join(';');
    pin.textContent = String(number);
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    const width = Math.min(280, Math.max(150, label.length * 7 + 24));
    const cx = Math.min(window.scrollX + window.innerWidth - width - 24, x + rect.width + 48);
    const cy = Math.max(window.scrollY + 16, y + rect.height / 2 - 18);
    caption.style.cssText = [
      'position:absolute',
      `left:${cx}px`,
      `top:${cy}px`,
      `width:${width}px`,
      'padding:7px 9px',
      'background:rgba(255,255,255,.98)',
      `border:1px solid ${color}`,
      'border-radius:7px',
      'box-shadow:0 10px 22px rgba(15,23,42,.14)',
      'color:#111827',
      'font:800 12px/1.25 Arial,sans-serif',
      'pointer-events:none',
      'z-index:2147483002',
    ].join(';');
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { selector, number, label, options });
  if (!ok) throw new Error(`Nao encontrei o seletor ${selector}`);
}

async function markButtonByText(page, text, number, label) {
  const ok = await page.evaluate(({ text, number, label }) => {
    const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();
    const el = Array.from(document.querySelectorAll('button, [role="tab"], a'))
      .find((node) => normalize(node.textContent || '').includes(normalize(text)));
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = `position:absolute;left:${x - 6}px;top:${y - 6}px;width:${rect.width + 12}px;height:${rect.height + 12}px;border:3px solid ${color};border-radius:10px;box-shadow:0 0 0 4px rgba(29,78,216,.12);pointer-events:none;z-index:2147483000`;
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = `position:absolute;left:${x + rect.width + 10}px;top:${y + rect.height / 2 - 14}px;width:28px;height:28px;background:${color};color:#fff;border:2px solid #fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:800 13px/1 Arial,sans-serif;pointer-events:none;z-index:2147483001`;
    pin.textContent = String(number);
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    caption.style.cssText = `position:absolute;left:${x + rect.width + 48}px;top:${y + rect.height / 2 - 18}px;max-width:240px;padding:7px 9px;background:rgba(255,255,255,.98);border:1px solid ${color};border-radius:7px;box-shadow:0 10px 22px rgba(15,23,42,.14);color:#111827;font:800 12px/1.25 Arial,sans-serif;pointer-events:none;z-index:2147483002`;
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { text, number, label });
  if (!ok) throw new Error(`Nao encontrei o botao/texto ${text}`);
}

async function markFilterGroup(page, number, label) {
  const ok = await page.evaluate(({ number, label }) => {
    const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();
    const allowed = ['todos', 'ativos', 'expirando em 30d', 'vencidos', 'cancelados'];
    const buttons = Array.from(document.querySelectorAll('button, [role="tab"]')).filter((node) => {
      const text = normalize(node.textContent || '');
      return allowed.some((item) => text.startsWith(item));
    });
    if (!buttons.length) return false;
    const rects = buttons.map((button) => {
      button.scrollIntoView({ block: 'center', inline: 'center' });
      return button.getBoundingClientRect();
    }).filter((rect) => rect.width && rect.height);
    if (!rects.length) return false;
    const left = Math.min(...rects.map((rect) => rect.left)) + window.scrollX;
    const top = Math.min(...rects.map((rect) => rect.top)) + window.scrollY;
    const right = Math.max(...rects.map((rect) => rect.right)) + window.scrollX;
    const bottom = Math.max(...rects.map((rect) => rect.bottom)) + window.scrollY;
    const color = '#1d4ed8';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = `position:absolute;left:${left - 6}px;top:${top - 6}px;width:${right - left + 12}px;height:${bottom - top + 12}px;border:3px solid ${color};border-radius:10px;box-shadow:0 0 0 4px rgba(29,78,216,.12);pointer-events:none;z-index:2147483000`;
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = `position:absolute;left:${left - 42}px;top:${top + (bottom - top) / 2 - 14}px;width:28px;height:28px;background:${color};color:#fff;border:2px solid #fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:800 13px/1 Arial,sans-serif;pointer-events:none;z-index:2147483001`;
    pin.textContent = String(number);
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    caption.style.cssText = `position:absolute;left:${Math.max(window.scrollX + 24, left - 190)}px;top:${top + (bottom - top) / 2 - 18}px;max-width:170px;padding:7px 9px;background:rgba(255,255,255,.98);border:1px solid ${color};border-radius:7px;box-shadow:0 10px 22px rgba(15,23,42,.14);color:#111827;font:800 12px/1.25 Arial,sans-serif;pointer-events:none;z-index:2147483002`;
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { number, label });
  if (!ok) throw new Error('Nao encontrei o grupo de filtros de dominios');
}

async function markText(page, text, number, label) {
  const ok = await page.evaluate(({ text, number, label }) => {
    const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();
    const el = Array.from(document.querySelectorAll('p, div, span')).find((node) => normalize(node.textContent || '') === normalize(text));
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = `position:absolute;left:${x - 10}px;top:${y - 8}px;width:${rect.width + 20}px;height:${rect.height + 16}px;border:3px solid ${color};border-radius:10px;box-shadow:0 0 0 4px rgba(29,78,216,.12);pointer-events:none;z-index:2147483000`;
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = `position:absolute;left:${x - 46}px;top:${y + rect.height / 2 - 14}px;width:28px;height:28px;background:${color};color:#fff;border:2px solid #fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:800 13px/1 Arial,sans-serif;pointer-events:none;z-index:2147483001`;
    pin.textContent = String(number);
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    caption.style.cssText = `position:absolute;left:${Math.max(window.scrollX + 24, x - 238)}px;top:${y + rect.height / 2 - 18}px;max-width:220px;padding:7px 9px;background:rgba(255,255,255,.98);border:1px solid ${color};border-radius:7px;box-shadow:0 10px 22px rgba(15,23,42,.14);color:#111827;font:800 12px/1.25 Arial,sans-serif;pointer-events:none;z-index:2147483002`;
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { text, number, label });
  if (!ok) throw new Error(`Nao encontrei o texto ${text}`);
}

async function screenshot(page, file) {
  await sanitize(page);
  await page.screenshot({ path: path.join(finalDir, file), fullPage: false });
}

async function getVisibleInfo(page) {
  return page.evaluate(() => {
    const text = (el) => (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ');
    const inputs = Array.from(document.querySelectorAll('input')).map((input) => ({
      placeholder: input.getAttribute('placeholder') || '',
      type: input.getAttribute('type') || '',
      value: input.value || '',
    }));
    const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'))
      .map(text)
      .filter(Boolean);
    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(text).filter(Boolean);
    const body = document.body.innerText.replace(/\s+/g, ' ').slice(0, 3000);
    return { inputs, buttons, headings, body };
  });
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });

  await login(page);

  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await sleep(1200);
  await clearMarks(page);
  await sanitize(page);
  await markSelector(page, 'a[href="/dashboard/dominios"]', 1, 'Menu Domínios');
  await screenshot(page, '01-menu-dominios-sanitizado.png');

  await page.goto('https://beta.staycloud.com/dashboard/dominios', { waitUntil: 'networkidle2' });
  await sleep(1600);
  await page.evaluate(() => window.scrollTo(0, 220));
  await sleep(500);
  const before = await getVisibleInfo(page);
  await clearMarks(page);
  await sanitize(page);
  await markSelector(page, 'input[placeholder="Buscar domínio..."]', 1, 'Campo de busca');
  await screenshot(page, '02-campo-busca-dominios-sanitizado.png');

  await clearMarks(page);
  await sanitize(page);
  await markFilterGroup(page, 1, 'Filtros da lista');
  await screenshot(page, '03-filtros-dominios-sanitizado.png');

  await page.focus('input[placeholder="Buscar domínio..."]');
  await page.keyboard.type('dominio-exemplo', { delay: 15 });
  await sleep(1000);
  await clearMarks(page);
  await sanitize(page);
  await markText(page, 'Nenhum domínio encontrado para esse filtro.', 1, 'Resultado da busca');
  await screenshot(page, '04-resultado-busca-sanitizado.png');

  const tabs = await page.evaluate(() => Array.from(document.querySelectorAll('button, [role="tab"]'))
    .map((button) => (button.textContent || '').trim().replace(/\s+/g, ' '))
    .filter((label) => /^(todos|ativos|expirando em 30d|vencidos|cancelados)\b/i.test(label)));

  const after = await getVisibleInfo(page);
  fs.writeFileSync(path.join(apoioDir, 'inspecao-fluxo-real.json'), JSON.stringify({
    data: new Date().toISOString(),
    url: page.url(),
    buscaUsada: 'dominio-exemplo',
    filtrosVisiveis: tabs,
    antes: before,
    depoisDaBusca: after,
    observacao: 'Script apenas navegou, digitou no campo de busca e marcou filtros/lista. Nenhuma acao de dominio foi executada.',
  }, null, 2));

  await browser.close();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
