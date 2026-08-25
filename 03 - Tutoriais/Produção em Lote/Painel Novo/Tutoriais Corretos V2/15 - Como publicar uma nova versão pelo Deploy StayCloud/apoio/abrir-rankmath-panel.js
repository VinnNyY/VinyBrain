const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const site = 'https://ajuda.staycloud.com.br';
const docId = 2937;

function secret(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

async function login(page) {
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', secret('Usuário WordPress'), { delay: 8 });
  await page.type('#user_pass', secret('Senha WordPress'), { delay: 8 });
  await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1400'],
    defaultViewport: { width: 1440, height: 1400, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  await page.goto(`${site}/wp-admin/post.php?post=${docId}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 12000));
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('button, div, span')];
    const score = nodes.find((el) => /79\s*\/\s*100/.test(el.innerText || el.textContent || ''));
    if (score) (score.closest('button') || score).click();
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await page.screenshot({ path: path.join(reportDir, 'rankmath-panel-aberto.png'), fullPage: true });
  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  fs.writeFileSync(path.join(reportDir, 'rankmath-panel-aberto.txt'), text);
  console.log(text.slice(0, 4000));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
