const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const txt = fs.readFileSync(promptPath, 'utf8');
const email = (txt.match(/- Login do painel do cliente:\s*`([^`]*)`/) || [])[1];
const password = (txt.match(/- Senha do painel do cliente:\s*`([^`]*)`/) || [])[1];
if (!email || !password) throw new Error('Nao consegui ler os acessos de teste no prompt local.');

const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Unitários/Como localizar o menu Domínios no Painel Novo da StayCloud/prints';
fs.mkdirSync(root, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function login(page) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"], input[name="email"], input[autocomplete="email"]', email, { delay: 12 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 12 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await sleep(1200);
}

async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove()));
}

async function markSelector(page, selector, number, label) {
  const ok = await page.evaluate(({ selector, number, label }) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${x - 6}px`,
      `top:${y - 6}px`,
      `width:${rect.width + 12}px`,
      `height:${rect.height + 12}px`,
      `border:4px solid ${color}`,
      'border-radius:14px',
      'box-shadow:0 0 0 5px rgba(29,78,216,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = [
      'position:absolute',
      `left:${x + rect.width - 10}px`,
      `top:${y - 16}px`,
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
    const width = Math.min(320, Math.max(180, label.length * 7 + 32));
    const cx = Math.min(window.scrollX + window.innerWidth - width - 24, x + rect.width + 18);
    const cy = Math.max(window.scrollY + 16, y + Math.max(0, (rect.height - 36) / 2));
    caption.style.cssText = [
      'position:absolute',
      `left:${cx}px`,
      `top:${cy}px`,
      `width:${width}px`,
      'padding:8px 10px',
      'background:rgba(255,255,255,.98)',
      `border:1px solid ${color}`,
      'border-radius:8px',
      'box-shadow:0 12px 28px rgba(15,23,42,.16)',
      'color:#111827',
      'font:800 13px/1.25 Arial,sans-serif',
      'pointer-events:none',
      'z-index:2147483002',
    ].join(';');
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { selector, number, label });
  if (!ok) throw new Error(`Nao encontrei o seletor ${selector}`);
}

async function markText(page, text, number, label) {
  const ok = await page.evaluate(({ text, number, label }) => {
    const normalize = (value) => value
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const needle = normalize(text);
    const nodes = Array.from(document.querySelectorAll('a,button,h1,h2,h3,h4,h5,h6,p,div,span,li,input'));
    const el = nodes.find((node) => {
      const haystack = normalize(node.textContent || node.getAttribute('aria-label') || node.getAttribute('placeholder') || '');
      return haystack.includes(needle);
    });
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${x - 6}px`,
      `top:${y - 6}px`,
      `width:${rect.width + 12}px`,
      `height:${rect.height + 12}px`,
      `border:4px solid ${color}`,
      'border-radius:14px',
      'box-shadow:0 0 0 5px rgba(29,78,216,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = [
      'position:absolute',
      `left:${x + rect.width - 10}px`,
      `top:${y - 16}px`,
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
    const width = Math.min(320, Math.max(180, label.length * 7 + 32));
    const cx = Math.min(window.scrollX + window.innerWidth - width - 24, x + rect.width + 18);
    const cy = Math.max(window.scrollY + 16, y + Math.max(0, (rect.height - 36) / 2));
    caption.style.cssText = [
      'position:absolute',
      `left:${cx}px`,
      `top:${cy}px`,
      `width:${width}px`,
      'padding:8px 10px',
      'background:rgba(255,255,255,.98)',
      `border:1px solid ${color}`,
      'border-radius:8px',
      'box-shadow:0 12px 28px rgba(15,23,42,.16)',
      'color:#111827',
      'font:800 13px/1.25 Arial,sans-serif',
      'pointer-events:none',
      'z-index:2147483002',
    ].join(';');
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { text, number, label });
  if (!ok) throw new Error(`Nao encontrei o texto ${text}`);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1400'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1400, deviceScaleFactor: 1 });

  await login(page);

  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await sleep(1200);
  await page.screenshot({ path: path.join(root, '01-dashboard.png') });
  await clearMarks(page);
  await markSelector(page, 'a[href="/dashboard/dominios"]', 1, 'Menu Domínios no painel');
  await page.screenshot({ path: path.join(root, '01-dashboard-marcado.png') });

  await page.goto('https://beta.staycloud.com/dashboard/dominios', { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.screenshot({ path: path.join(root, '02-dominios-topo.png') });
  await clearMarks(page);
  await markSelector(page, 'h1', 1, 'Tela principal de Domínios');
  await markSelector(page, 'a[href*="Transfer%C3%AAncia%20de%20dom%C3%ADnio"]', 2, 'Botão Transferir');
  await markSelector(page, 'a[href="/dashboard/loja/dominios"]', 3, 'Botão Registrar domínio');
  await page.screenshot({ path: path.join(root, '02-dominios-topo-marcado.png') });

  await page.evaluate(() => window.scrollTo(0, 260));
  await sleep(700);
  await page.screenshot({ path: path.join(root, '03-dominios-lista.png') });
  await clearMarks(page);
  await markSelector(page, 'input[placeholder="Buscar domínio..."]', 1, 'Busca de domínios');
  await markSelector(page, 'button.tab.active', 2, 'Filtro ativo da lista de domínios');
  await page.screenshot({ path: path.join(root, '03-dominios-lista-marcado.png') });

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
