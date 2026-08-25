const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

async function login(page) {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await wait(1200);
  let text = await page.evaluate(() => document.body.innerText);
  if (!/login|entrar|email|senha|password|sign in/i.test(text)) return;
  await page.waitForSelector('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', { timeout: 30000 });
  await page.type('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', email, { delay: 8 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 8 });
  const clicked = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('button, input[type="submit"], [role="button"]')];
    const el = candidates.find((node) => /sign in|entrar|login/i.test(node.innerText || node.value || node.textContent || '')) || candidates.find((node) => node.type === 'submit');
    if (!el) return false;
    el.click();
    return true;
  });
  if (!clicked) throw new Error('Botao de login nao encontrado.');
  await wait(5000);
  text = await page.evaluate(() => document.body.innerText);
  if (/login|entrar/i.test(text) && /senha|password/i.test(text)) throw new Error('Login nao confirmado.');
}

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(vinicius|viny|legacy doc|legacy)/gi, '[dado censurado]'],
      [/\btutorial-deploy-teste\b/gi, '[projeto de teste censurado]'],
      [/https?:\/\/[a-z0-9.-]*stayai\.space[^\s"')<]*/gi, '[URL publica censurada]'],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue || '';
      for (const [re, replacement] of replacements) value = value.replace(re, replacement);
      node.nodeValue = value;
    });
    [...document.querySelectorAll('div, section, aside')].forEach((el) => {
      const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ');
      const rect = el.getBoundingClientRect();
      if (/Em uma escala de 0 a 10|quanto você recomendaria/i.test(text) && rect.top > innerHeight - 180) {
        el.remove();
      }
      if (/Olá\. Precisa de ajuda/i.test(text) && rect.top > innerHeight - 180) {
        el.remove();
      }
    });
  });
}

async function findRect(page, pattern) {
  return page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    const matches = [...document.querySelectorAll('button, a, [role="button"], div, span, p')]
      .filter((el) => {
        if (!(el instanceof HTMLElement)) return false;
        const rect = el.getBoundingClientRect();
        const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
          .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        return re.test(text) && rect.width > 10 && rect.height > 10 && rect.top > 180;
      })
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (ar.width * ar.height) - (br.width * br.height);
      });
    const el = matches[0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags });
}

async function clickText(page, pattern) {
  return page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    const el = [...document.querySelectorAll('button, a, [role="button"], div, span')]
      .filter((node) => node instanceof HTMLElement)
      .find((node) => re.test((node.innerText || node.textContent || '').replace(/\s+/g, ' ')));
    if (!el) return false;
    (el.closest('button, a, [role="button"]') || el).click();
    return true;
  }, { source: pattern.source, flags: pattern.flags });
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

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(2500);
  await page.screenshot({ path: path.join(originalsDir, '01-projeto-publicado-sanitizado-original-recaptura.png'), fullPage: false });
  await sanitizeDom(page);
  const projectRect = { x: 405, y: 590, width: 450, height: 82 };
  await mark(page, projectRect);
  await page.screenshot({ path: path.join(finalsDir, '01-projeto-publicado-sanitizado.png'), fullPage: false });
  await clickText(page, /tutorial-deploy-cli-teste/i);
  await wait(2500);
  await clickText(page, /^Deploys$|ver todos os deploys/i);
  await wait(3000);
  await page.screenshot({ path: path.join(originalsDir, '06-conclusao-sanitizado-original-recaptura.png'), fullPage: false });
  await sanitizeDom(page);
  const rect = await findRect(page, /pronto|Pronto|live/i) || { x: 260, y: 520, width: 260, height: 70 };
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, '06-conclusao-sanitizado.png'), fullPage: false });
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(__dirname, 'relatorios', 'recaptura-conclusao-painel.txt'), text);
  console.log('06 recapturado');
  await browser.close();
}

main().catch((error) => {
  console.error(error.message.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'));
  process.exit(1);
});
