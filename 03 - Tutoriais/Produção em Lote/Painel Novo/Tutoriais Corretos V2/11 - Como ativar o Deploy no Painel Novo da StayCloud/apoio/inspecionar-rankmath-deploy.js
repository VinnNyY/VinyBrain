const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const out = path.join(__dirname, 'relatorios', 'rankmath-editor-text.txt');
const site = 'https://ajuda.staycloud.com.br';
const slug = 'ativar-deploy-staycloud';

function secret(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
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
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  if (await page.$('#user_login')) {
    await page.type('#user_login', secret('Usuário WordPress'), { delay: 8 });
    await page.type('#user_pass', secret('Senha WordPress'), { delay: 8 });
    await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
  }
  await page.goto(`${site}/wp-admin/edit.php?post_type=docs`, { waitUntil: 'networkidle2' });
  const docs = await page.evaluate(async (slug) => {
    const response = await fetch(`/wp-json/wp/v2/docs?slug=${encodeURIComponent(slug)}&status=publish,draft,pending,future,private&context=edit`, {
      credentials: 'same-origin',
      headers: { 'X-WP-Nonce': window.wpApiSettings.nonce, Accept: 'application/json' },
    });
    return response.json();
  }, slug);
  if (!docs.length) throw new Error('RASCUNHO_NAO_ENCONTRADO');
  await page.goto(`${site}/wp-admin/post.php?post=${docs[0].id}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button, a, [role="button"]')];
    for (const item of buttons) {
      const text = (item.innerText || item.textContent || item.getAttribute('aria-label') || '').trim();
      if (/Rank Math|SEO/i.test(text)) item.click();
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  fs.writeFileSync(out, text);
  await page.screenshot({ path: path.join(__dirname, 'relatorios', 'rankmath-editor.png'), fullPage: true });
  console.log(JSON.stringify({ docId: docs[0].id, status: docs[0].status, out }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
