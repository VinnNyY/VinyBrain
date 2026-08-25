const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Lote 02';
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const txt = fs.readFileSync(promptPath, 'utf8');
const email = (txt.match(/- Login do painel do cliente:\s*`([^`]*)`/) || [])[1];
const password = (txt.match(/- Senha do painel do cliente:\s*`([^`]*)`/) || [])[1];

if (!email || !password) {
  throw new Error('Nao consegui extrair os acessos de teste do prompt local.');
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function login(page) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', email, { delay: 12 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 12 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await wait(1500);
}

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll([
      '[role="dialog"]',
      '[aria-modal="true"]',
      '.modal',
      '.popup',
      '.popover',
      '.toast',
      'iframe[src*="intercom"]',
      'iframe[src*="crisp"]',
      'iframe[src*="tawk"]',
      'iframe[src*="zendesk"]',
    ].join(',')).forEach((el) => el.remove());
  });
}

async function mark(page, selector, number, label, opts = {}) {
  const ok = await page.evaluate(({ selector, number, label, opts }) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const color = '#1d4ed8';
    const pad = opts.pad ?? 6;
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${x - pad}px`,
      `top:${y - pad}px`,
      `width:${rect.width + pad * 2}px`,
      `height:${rect.height + pad * 2}px`,
      `border:3px solid ${color}`,
      'border-radius:12px',
      'box-shadow:0 0 0 5px rgba(29,78,216,.10)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    const pin = document.createElement('div');
    pin.dataset.docMark = 'true';
    pin.style.cssText = [
      'position:absolute',
      `left:${x + rect.width - 12}px`,
      `top:${y - 14}px`,
      'width:26px',
      'height:26px',
      `background:${color}`,
      'color:#fff',
      'border:2px solid #fff',
      'border-radius:999px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font:800 13px/1 Arial, sans-serif',
      'pointer-events:none',
      'z-index:2147483001',
    ].join(';');
    pin.textContent = String(number);
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    const width = Math.min(300, Math.max(160, label.length * 7 + 28));
    const cx = Math.min(window.scrollX + window.innerWidth - width - 24, x + rect.width + 18);
    const cy = Math.max(window.scrollY + 20, y + Math.max(0, (rect.height - 36) / 2));
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
      'font:800 13px/1.25 Arial, sans-serif',
      'pointer-events:none',
      'z-index:2147483002',
    ].join(';');
    caption.textContent = label;
    document.body.append(outline, pin, caption);
    return true;
  }, { selector, number, label, opts });
  if (!ok) throw new Error(`Nao encontrei o seletor para marcar: ${selector}`);
}

async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove()));
}

async function shotPair(page, fileBase, markFn, options = {}) {
  await dismiss(page);
  await clearMarks(page);
  if (options.wait) await wait(options.wait);
  const original = `${fileBase}.png`;
  await page.screenshot({ path: original, fullPage: false });
  if (markFn) {
    await markFn();
    await wait(500);
    await page.screenshot({ path: `${fileBase}-marcado.png`, fullPage: false });
    await clearMarks(page);
  }
}

async function openCpanelHome(page) {
  await page.goto('https://beta.staycloud.com/api/staypanel/8445/cpanel-autologin', { waitUntil: 'networkidle2' });
  await wait(2500);
}

async function openFromCpanel(page, text) {
  await page.evaluate((needle) => {
    const link = [...document.querySelectorAll('a')].find((a) => (a.textContent || '').includes(needle));
    if (link) link.click();
  }, text);
  await wait(7000);
}

async function run() {
  const tutorials = {
    storage: path.join(root, 'prints', 'como-alterar-o-armazenamento-dos-e-mails-no-painel-novo-da-staycloud'),
    ssl: path.join(root, 'prints', 'como-gerar-certificados-ssl-gratuitos-no-painel-novo-da-staycloud'),
    filters: path.join(root, 'prints', 'como-criar-filtros-de-e-mail-no-painel-novo-da-staycloud'),
  };
  Object.values(tutorials).forEach(ensureDir);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1400'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1400, deviceScaleFactor: 1 });

  // Tutorial 1: armazenamento de e-mails
  await login(page);
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem/8445', { waitUntil: 'networkidle2' });
  await shotPair(page, path.join(tutorials.storage, '01-dashboard-servico'), async () => {
    await mark(page, 'a[href="/api/staypanel/8445/cpanel-autologin"]', 1, 'Abra o cPanel do serviço correto');
  }, { wait: 1000 });

  await openCpanelHome(page);
  await shotPair(page, path.join(tutorials.storage, '02-cpanel-contas-email'), async () => {
    await mark(page, 'a[href="email_accounts/index.html"]', 1, 'Abra Contas de e-mail');
    await mark(page, 'a[href="mail/manage_disk_usage/"]', 2, 'Referência da área de armazenamento');
  });

  await openFromCpanel(page, 'Contas de e-mail');
  await wait(2000);
  await shotPair(page, path.join(tutorials.storage, '03-contas-email-lista'), async () => {
    await mark(page, '#email_table_disk_and_quota_tutorial01\\@legacydoc\\.com\\.br', 1, 'Clique em Gerenciar na conta certa');
  });

  await page.evaluate(() => document.getElementById('email_table_disk_and_quota_tutorial01@legacydoc.com.br')?.click());
  await wait(6000);
  await shotPair(page, path.join(tutorials.storage, '04-gerenciar-cota-email'), async () => {
    await mark(page, '#limitedQuota', 1, 'Escolha a cota de armazenamento');
    await mark(page, '#quota', 2, 'Defina o valor permitido');
    await mark(page, '#btnUpdateEmailEmailAccount', 3, 'Salve a alteração');
  });

  // Tutorial 2: SSL gratuito
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem/8445', { waitUntil: 'networkidle2' });
  await shotPair(page, path.join(tutorials.ssl, '01-dashboard-servico'), async () => {
    await mark(page, 'a[href="/api/staypanel/8445/cpanel-autologin"]', 1, 'Abra o cPanel do serviço correto');
  }, { wait: 1000 });

  await openCpanelHome(page);
  await shotPair(page, path.join(tutorials.ssl, '02-cpanel-ssl-home'), async () => {
    await mark(page, 'a[href="security/tls_wizard/index.html"]', 1, 'Abra SSL/TLS Certificates');
    await mark(page, 'a[href="security/tls_wizard/index.html#/create?domain=legacydoc.com.br"]', 2, 'Atalho para adicionar SSL');
  });

  await openFromCpanel(page, 'SSL/TLS Certificates');
  await wait(3000);
  await page.waitForSelector('#letsEncryptBtn', { timeout: 30000 });
  await shotPair(page, path.join(tutorials.ssl, '03-ssl-dominios'), async () => {
    await mark(page, '#legacydoc\\.com\\.br_Checkbox', 1, 'Selecione o domínio principal');
    await mark(page, '#domainsContinueBtn', 2, 'Continue para a próxima etapa');
  });

  // Tutorial 3: filtros de e-mail
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem/8445', { waitUntil: 'networkidle2' });
  await shotPair(page, path.join(tutorials.filters, '01-dashboard-servico'), async () => {
    await mark(page, 'a[href="/api/staypanel/8445/cpanel-autologin"]', 1, 'Abra o cPanel do serviço correto');
  }, { wait: 1000 });

  await openCpanelHome(page);
  await shotPair(page, path.join(tutorials.filters, '02-cpanel-contas-email'), async () => {
    await mark(page, 'a[href="email_accounts/index.html"]', 1, 'Abra Contas de e-mail');
  });

  await page.evaluate(() => document.querySelector('a[href="email_accounts/index.html"]')?.click());
  await wait(7000);
  await page.evaluate(() => document.getElementById('email_table_disk_and_quota_tutorial01@legacydoc.com.br')?.click());
  await wait(7000);
  await shotPair(page, path.join(tutorials.filters, '03-conta-com-filtros'), async () => {
    await mark(page, '#lnkMailFilter', 1, 'Abra Gerenciar Filtros de E-mail');
  });

  await page.evaluate(() => document.getElementById('lnkMailFilter')?.click());
  await wait(6000);
  await shotPair(page, path.join(tutorials.filters, '04-filtros-lista'), async () => {
    await mark(page, '#btnCreateFilter', 1, 'Crie um novo filtro');
  });

  await page.evaluate(() => document.getElementById('btnCreateFilter')?.click());
  await wait(6000);
  await shotPair(page, path.join(tutorials.filters, '05-criar-filtro'), async () => {
    await mark(page, '#filtername', 1, 'Nome do filtro');
    await mark(page, '[name="part1"]', 2, 'Condição da regra');
    await mark(page, '#action_menu1', 3, 'Ação do filtro');
    await mark(page, '#activate-button', 4, 'Criar filtro');
  });

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
