const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(root, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

for (const dir of [originalsDir, finalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

function readSecret(label) {
  const text = fs.readFileSync(promptPath, 'utf8');
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp('- ' + escapedLabel + ': `([^`]+)`'));
  if (!match) throw new Error(`Credencial nao localizada: ${label}`);
  return match[1];
}

const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || process.env.STAY_PANEL_EMAIL || readSecret('Login do painel do cliente');
const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || process.env.STAY_PANEL_PASSWORD || readSecret('Senha do painel do cliente');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sanitizePage(page) {
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const replacements = [
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[a-z0-9-]+\.(?:com\.br|com|net|org|dev|cloud|br)\b/gi, '[dominio censurado]'],
      [/R\$\s?[\d.,]+/g, '[valor censurado]'],
      [/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[data censurada]'],
      [/\b(?:Legacy Doc|Vinicius|Viny|Suporte|Financeiro|Contato|Admin)\b/gi, '[dado censurado]'],
      [/\bNS[12]\b\s*\S+/gi, '[nameserver censurado]'],
    ];
    for (const node of nodes) {
      let value = node.nodeValue;
      for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
      node.nodeValue = value;
    }
    document.querySelectorAll('input, textarea').forEach((el) => {
      const value = el.value || '';
      if (value.includes('@')) el.value = '[e-mail censurado]';
      if (el.type === 'password') el.value = '';
      if (el.placeholder && el.placeholder.includes('@')) el.placeholder = '[e-mail censurado]';
    });
    document.querySelectorAll('[title], [aria-label]').forEach((el) => {
      for (const attr of ['title', 'aria-label']) {
        const value = el.getAttribute(attr);
        if (!value) continue;
        el.setAttribute(attr, value
          .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
          .replace(/\b[a-z0-9-]+\.(?:com\.br|com|net|org|dev|cloud|br)\b/gi, '[dominio censurado]')
          .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'));
      }
    });
  });
}

async function hideObtrusiveUi(page) {
  await page.evaluate(() => {
    const textIncludes = (el, needle) => ((el.innerText || el.textContent || '').toLowerCase().includes(needle));
    [...document.querySelectorAll('body *')].forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const style = getComputedStyle(el);
      const bottomRightWidget = rect.left > innerWidth - 280 && rect.top > innerHeight - 180 && rect.width < 320 && rect.height < 220;
      const text = (el.innerText || el.textContent || '').toLowerCase();
      if (bottomRightWidget) {
        el.style.visibility = 'hidden';
        return;
      }
      if (!['fixed', 'sticky'].includes(style.position) && !(rect.top < 45 && rect.height < 70 && text.includes('encontrou um bug'))) return;
      if (
        text.includes('em uma escala de 0 a 10') ||
        text.includes('olá. precisa de ajuda') ||
        text.includes('encontrou um bug?') ||
        text.includes('nos reporte aqui')
      ) {
        el.style.visibility = 'hidden';
      }
    });
    [...document.querySelectorAll('button')].forEach((button) => {
      if (textIncludes(button, 'fechar aviso')) button.click();
    });
  });
}

async function visibleElements(page, selector = 'button, a, [role="button"], [role="menuitem"], h1, h2, h3, [class*="title"]') {
  return page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].map((el, index) => {
      const rect = el.getBoundingClientRect();
      const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ');
      return {
        index,
        text,
        tag: el.tagName,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth,
      };
    }).filter((item) => item.visible && item.text);
  }, selector);
}

async function findByText(page, needle) {
  const items = await visibleElements(page);
  return items.find((item) => item.text.toLowerCase().includes(needle.toLowerCase()));
}

async function findClickableByText(page, needle) {
  const items = await visibleElements(page, 'button, a, [role="button"], [role="menuitem"]');
  return items.find((item) => item.text.toLowerCase().includes(needle.toLowerCase()));
}

async function findSmallTextBlock(page, needle) {
  const items = await visibleElements(page, 'body *');
  const matches = items
    .filter((item) => item.text.toLowerCase().includes(needle.toLowerCase()) && item.x < 1180)
    .sort((a, b) => (a.width * a.height) - (b.width * b.height));
  return matches[0];
}

async function clickBox(page, box) {
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

async function clickText(page, needle) {
  const box = await findByText(page, needle);
  if (!box) throw new Error(`Elemento nao encontrado: ${needle}`);
  await clickBox(page, box);
  return box;
}

async function loginIfNeeded(page) {
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(1500);
  const hasPassword = await page.$('input[type="password"]');
  if (!hasPassword) return 'sessao autenticada ou redirecionamento ja resolvido';
  const emailSelector = 'input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]';
  const passwordSelector = 'input[type="password"], input[name="password"], input[autocomplete="current-password"]';
  await page.waitForSelector(emailSelector, { timeout: 30000 });
  await page.click(emailSelector, { clickCount: 3 });
  await page.type(emailSelector, email, { delay: 10 });
  await page.click(passwordSelector, { clickCount: 3 });
  await page.type(passwordSelector, password, { delay: 10 });
  const submitted = await page.evaluate(() => {
    const submit = document.querySelector('button[type="submit"], input[type="submit"]');
    if (submit) {
      submit.click();
      return true;
    }
    const buttons = [...document.querySelectorAll('button')];
    const entrar = buttons.find((button) => /entrar|login|acessar/i.test(button.innerText || button.textContent || ''));
    if (entrar) {
      entrar.click();
      return true;
    }
    return false;
  });
  if (!submitted) await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  await sleep(3000);
  return 'login realizado na conta autorizada';
}

async function goHosting(page) {
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2500);
}

async function openDetailsMenu(page) {
  let details = await findByText(page, 'Ver detalhes');
  if (!details) details = await findByText(page, 'Expandir detalhes');
  if (details) return details;
  const gerenciar = await findClickableByText(page, 'Gerenciar');
  if (!gerenciar) throw new Error('Botao Gerenciar nao localizado para abrir o menu de detalhes.');
  const candidates = await page.evaluate((g) => {
    return [...document.querySelectorAll('button, [role="button"], a')].map((el, index) => {
      const rect = el.getBoundingClientRect();
      const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ');
      return { index, text, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }).filter((item) =>
      item.width > 0 && item.height > 0 &&
      item.y > g.y - 50 && item.y < g.y + 80 &&
      item.x > g.x - 30 && item.x < g.x + 180
    ).sort((a, b) => b.x - a.x);
  }, gerenciar);
  for (const candidate of candidates) {
    await page.mouse.click(candidate.x + candidate.width / 2, candidate.y + candidate.height / 2);
    await sleep(700);
    details = await findByText(page, 'Ver detalhes');
    if (!details) details = await findByText(page, 'Expandir detalhes');
    if (details) return details;
    await page.keyboard.press('Escape').catch(() => {});
  }
  throw new Error('Ver detalhes/Expandir detalhes nao apareceu apos abrir as opcoes do servico.');
}

async function addMarkers(page, markers) {
  await page.evaluate((items) => {
    document.querySelectorAll('[data-codex-marker]').forEach((el) => el.remove());
    for (const item of items) {
      const box = document.createElement('div');
      box.setAttribute('data-codex-marker', 'box');
      Object.assign(box.style, {
        position: 'fixed',
        left: `${Math.max(0, item.x - 6)}px`,
        top: `${Math.max(0, item.y - 6)}px`,
        width: `${item.width + 12}px`,
        height: `${item.height + 12}px`,
        border: '3px solid #5b5cf6',
        borderRadius: '10px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        zIndex: 2147483646,
        boxShadow: '0 0 0 4px rgba(91,92,246,.16)',
      });
      const label = document.createElement('div');
      label.setAttribute('data-codex-marker', 'label');
      Object.assign(label.style, {
        position: 'fixed',
        left: `${Math.max(8, item.x - 2)}px`,
        top: `${Math.max(8, item.y - 34)}px`,
        background: '#5b5cf6',
        color: '#fff',
        font: '700 13px Arial, sans-serif',
        padding: '5px 9px',
        borderRadius: '8px',
        zIndex: 2147483647,
        pointerEvents: 'none',
        boxShadow: '0 4px 14px rgba(35,35,75,.2)',
      });
      label.textContent = item.label;
      document.body.appendChild(box);
      document.body.appendChild(label);
    }
  }, markers);
}

async function shot(page, name, markers) {
  await hideObtrusiveUi(page);
  await page.screenshot({ path: path.join(originalsDir, `${name}-original.png`), fullPage: false });
  await sanitizePage(page);
  if (markers && markers.length) await addMarkers(page, markers);
  await page.screenshot({ path: path.join(finalsDir, `${name}.png`), fullPage: false });
}

function markerFrom(box, label, pad = 0) {
  return { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2, label };
}

function maskReportValue(value) {
  return String(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
    .replace(/\blegacydoc\.com\.br\b/gi, '[dominio censurado]')
    .replace(/\bns[12]\.tito\.staydns\.com\b/gi, '[nameserver censurado]')
    .replace(/\bTITO\b/g, '[servidor censurado]');
}

function sanitizeReport(report) {
  for (const section of ['details', 'manage']) {
    if (!report[section]) continue;
    for (const key of Object.keys(report[section])) {
      report[section][key] = Array.isArray(report[section][key])
        ? report[section][key].map(maskReportValue)
        : maskReportValue(report[section][key]);
    }
  }
  report.note = 'Relatorio sanitizado: dominios, IPs, nameservers e identificadores reais foram censurados.';
  return report;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    defaultViewport: { width: 1365, height: 860, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1365,860'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  const report = { startedAt: new Date().toISOString(), login: null, details: {}, manage: {}, prints: [] };
  report.login = await loginIfNeeded(page);
  await goHosting(page);
  await hideObtrusiveUi(page);

  const detailsBox = await openDetailsMenu(page);
  const manageBoxForPrint01 = await findClickableByText(page, 'Gerenciar');
  if (!manageBoxForPrint01) throw new Error('Gerenciar nao localizado no print comparativo.');
  await shot(page, 'passo-01-ver-detalhes-e-gerenciar', [
    markerFrom(detailsBox, detailsBox.text.toLowerCase().includes('expandir') ? '1. Expandir detalhes' : '1. Ver detalhes'),
    markerFrom(manageBoxForPrint01, '2. Gerenciar'),
  ]);
  report.prints.push({ file: 'passo-01-ver-detalhes-e-gerenciar.png', targets: ['Ver detalhes', 'Gerenciar'] });

  const detailLabel = detailsBox.text;
  await clickBox(page, detailsBox);
  await sleep(2500);
  const detailsState = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    headings: [...document.querySelectorAll('h1,h2,h3,[class*="title"],[class*="header"]')]
      .map((el) => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .slice(0, 20),
    body: document.body.innerText.slice(0, 1600),
  }));
  report.details = detailsState;
  const detailMarker = (await findSmallTextBlock(page, 'DISCO')) ||
    (await findSmallTextBlock(page, 'CPU')) ||
    (await findSmallTextBlock(page, 'RAM')) ||
    (await findSmallTextBlock(page, 'EMAILS')) ||
    (await findSmallTextBlock(page, 'Mais informações')) ||
    (await findSmallTextBlock(page, 'Informações')) ||
    (await visibleElements(page, 'h1,h2,h3,[class*="title"],[class*="header"]')).find((item) => item.y > 80);
  if (!detailMarker) throw new Error('Nao foi possivel identificar o destino visual de Ver detalhes.');
  await shot(page, 'passo-02-destino-ver-detalhes', [markerFrom(detailMarker, 'Destino de Ver detalhes')]);
  report.prints.push({ file: 'passo-02-destino-ver-detalhes.png', target: detailMarker.text });

  await goHosting(page);
  const manageBox = await findClickableByText(page, 'Gerenciar');
  if (!manageBox) throw new Error('Gerenciar nao localizado para o passo 03.');
  await shot(page, 'passo-03-botao-gerenciar', [markerFrom(manageBox, 'Gerenciar')]);
  report.prints.push({ file: 'passo-03-botao-gerenciar.png', target: 'Gerenciar' });

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 12000 }).catch(() => {}),
    clickBox(page, manageBox),
  ]);
  await sleep(3500);
  const manageState = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    headings: [...document.querySelectorAll('h1,h2,h3,[class*="title"],[class*="header"]')]
      .map((el) => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .slice(0, 20),
    body: document.body.innerText.slice(0, 1600),
  }));
  report.manage = manageState;
  const manageMarker = (await findByText(page, 'Visão geral')) ||
    (await findByText(page, 'WordPress')) ||
    (await findByText(page, 'E-mails')) ||
    (await findByText(page, 'Arquivos')) ||
    (await visibleElements(page, 'h1,h2,h3,[class*="title"],nav,[role="tablist"]')).find((item) => item.y > 60);
  if (!manageMarker) throw new Error('Nao foi possivel identificar o destino visual de Gerenciar.');
  await shot(page, 'passo-04-destino-gerenciar', [markerFrom(manageMarker, 'Destino de Gerenciar')]);
  report.prints.push({ file: 'passo-04-destino-gerenciar.png', target: manageMarker.text });

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(reportsDir, 'resultado-fluxo-real.json'), JSON.stringify(sanitizeReport(report), null, 2));
  console.log(JSON.stringify({
    ok: true,
    detailsControl: detailLabel,
    login: report.login,
    detailsUrl: report.details.url,
    manageUrl: report.manage.url,
    prints: report.prints.map((item) => item.file),
  }, null, 2));
  await browser.close();
}

main().catch((error) => {
  fs.writeFileSync(path.join(reportsDir, 'erro-captura.txt'), `${error.stack || error.message}\n`);
  console.error(error.message);
  process.exit(1);
});
