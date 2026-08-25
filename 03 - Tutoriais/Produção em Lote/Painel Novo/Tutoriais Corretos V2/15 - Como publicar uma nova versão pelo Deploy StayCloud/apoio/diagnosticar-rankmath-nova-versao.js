const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const site = 'https://ajuda.staycloud.com.br';
const slugs = ['publicar-nova-versao-staycloud', 'publicar-nova-versao-deploy-staycloud'];

function secret(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

async function login(page) {
  const user = secret('Usuário WordPress');
  const password = secret('Senha WordPress');
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', user, { delay: 8 });
  await page.type('#user_pass', password, { delay: 8 });
  await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
  await page.goto(`${site}/wp-admin/index.php`, { waitUntil: 'networkidle2' });
}

async function wpFetch(page, url, options = {}) {
  return page.evaluate(async ({ url, options }) => {
    const nonce = window.wpApiSettings && window.wpApiSettings.nonce;
    const headers = Object.assign({ 'X-WP-Nonce': nonce, Accept: 'application/json' }, options.headers || {});
    const response = await fetch(url, Object.assign({}, options, { credentials: 'same-origin', headers }));
    const text = await response.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { url, options });
}

async function main() {
  fs.mkdirSync(reportDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1400'],
    defaultViewport: { width: 1440, height: 1400, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  let docs = [];
  for (const slug of slugs) {
    docs = docs.concat(await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(slug)}&status=publish,draft,pending,future,private&context=edit`));
  }
  const draft = docs.find((doc) => doc.status !== 'publish') || docs[0];
  if (!draft) throw new Error('Rascunho não encontrado.');
  await page.goto(`${site}/wp-admin/post.php?post=${draft.id}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 12000));
  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  fs.writeFileSync(path.join(reportDir, 'rankmath-diagnostico-nova-versao.txt'), text);
  await page.screenshot({ path: path.join(reportDir, 'rankmath-diagnostico-nova-versao.png'), fullPage: true });
  const snippets = [...text.matchAll(new RegExp('(.{0,80}(?:Erro|Aviso|Focus|keyword|palavra|Título|Meta|URL|Content|Image|Link|79\\\\s*/\\\\s*100|SEO).{0,160})', 'gi'))].map((m) => m[1]);
  console.log(JSON.stringify({ id: draft.id, slug: draft.slug, status: draft.status, snippets: snippets.slice(0, 80) }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
