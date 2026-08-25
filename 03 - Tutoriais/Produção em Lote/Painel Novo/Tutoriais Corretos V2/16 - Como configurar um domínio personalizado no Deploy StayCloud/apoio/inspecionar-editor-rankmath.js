const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const site = 'https://ajuda.staycloud.com.br';
const slug = 'dominio-personalizado-deploy-staycloud';
const outDir = path.resolve(__dirname, 'relatorios');

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
  await page.goto(`${site}/wp-admin/index.php`, { waitUntil: 'networkidle2' });
}

async function wpFetch(page, url) {
  return page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'same-origin', headers: { 'X-WP-Nonce': window.wpApiSettings.nonce, Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, url);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200'],
    defaultViewport: { width: 1440, height: 1200 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  const [doc] = await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(slug)}&status=publish,draft,pending,future,private&context=edit`);
  await page.goto(`${site}/wp-admin/post.php?post=${doc.id}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.screenshot({ path: path.join(outDir, 'rankmath-editor-before-click.png'), fullPage: true });
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button, [role="button"], a')];
    const scoreButton = buttons.find((el) => /[0-9]{1,3}\s*\/\s*100/.test(el.innerText || el.textContent || ''));
    if (scoreButton) scoreButton.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 6000));
  await page.screenshot({ path: path.join(outDir, 'rankmath-editor-after-click.png'), fullPage: true });
  const result = await page.evaluate(() => {
    const fieldInfo = [...document.querySelectorAll('input, textarea, [contenteditable="true"]')].map((el) => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      name: el.getAttribute('name'),
      id: el.id,
      placeholder: el.getAttribute('placeholder'),
      aria: el.getAttribute('aria-label'),
      value: el.value || el.textContent || '',
      className: String(el.className || '').slice(0, 160),
    })).filter((item) => {
      const haystack = Object.values(item).join(' ').toLowerCase();
      return haystack.includes('rank') || haystack.includes('keyword') || haystack.includes('seo') || haystack.includes('description') || haystack.includes('title') || haystack.includes('palavra') || haystack.includes('descr');
    });
    const buttons = [...document.querySelectorAll('button, [role="button"], a')].map((el) => ({
      text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160),
      aria: el.getAttribute('aria-label'),
      className: String(el.className || '').slice(0, 120),
    })).filter((item) => Object.values(item).join(' ').toLowerCase().match(/rank|seo|snippet|editar|palavra|keyword|score|100/));
    return { url: location.href, text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 6000), fieldInfo, buttons };
  });
  fs.writeFileSync(path.join(outDir, 'rankmath-editor-inspecao.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ docId: doc.id, output: path.join(outDir, 'rankmath-editor-inspecao.json') }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
