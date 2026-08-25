const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const reportsDir = path.join(__dirname, 'relatorios');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(originalsDir, { recursive: true });

function readSecret(label) {
  const text = fs.readFileSync(promptPath, 'utf8');
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp('- ' + escapedLabel + ': `([^`]+)`'));
  if (!match) throw new Error(`Credencial nao localizada: ${label}`);
  return match[1];
}

const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || process.env.STAY_PANEL_EMAIL || readSecret('Login do painel do cliente');
const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || process.env.STAY_PANEL_PASSWORD || readSecret('Senha do painel do cliente');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    defaultViewport: { width: 1365, height: 920, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1365,920'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(1500);
  if (await page.$('input[type="password"]')) {
    await page.type('input[type="email"], input[name="email"], input[name="username"]', email, { delay: 10 });
    await page.type('input[type="password"]', password, { delay: 10 });
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await sleep(3000);
  }
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2500);
  await page.screenshot({ path: path.join(originalsDir, 'inspecao-hospedagem-original.png'), fullPage: true });
  const before = await collect(page);

  const clicked = [];
  const candidates = before.clickables
    .filter((item) => item.visible && item.y > 160 && item.x > 760)
    .sort((a, b) => a.y - b.y || b.x - a.x)
    .slice(0, 12);
  for (const item of candidates) {
    await page.mouse.click(item.x + item.width / 2, item.y + item.height / 2);
    await sleep(700);
    const after = await collect(page);
    clicked.push({ clicked: item, bodyHasVerDetalhes: /ver detalhes/i.test(after.body), visibleTexts: after.clickables.map((x) => x.text).filter(Boolean).slice(0, 80) });
    await page.screenshot({ path: path.join(originalsDir, `inspecao-click-${clicked.length}.png`), fullPage: false });
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(250);
  }

  fs.writeFileSync(path.join(reportsDir, 'inventario-botoes.json'), JSON.stringify({ before, clicked }, null, 2));
  console.log(JSON.stringify({
    bodyHasVerDetalhes: /ver detalhes/i.test(before.body),
    visibleWithDetalhes: before.clickables.filter((item) => /detalh/i.test(item.text)),
    candidates: candidates.map((item) => ({ text: item.text, x: item.x, y: item.y, width: item.width, height: item.height })),
    clickedWithVerDetalhes: clicked.filter((item) => item.bodyHasVerDetalhes).length,
  }, null, 2));
  await browser.close();
}

async function collect(page) {
  return page.evaluate(() => ({
    url: location.href,
    title: document.title,
    body: document.body.innerText,
    clickables: [...document.querySelectorAll('button,a,[role="button"],[role="menuitem"]')].map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        text: (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' '),
        tag: el.tagName,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth,
      };
    }).filter((item) => item.visible),
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
