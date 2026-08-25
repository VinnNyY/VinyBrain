const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const site = 'https://ajuda.staycloud.com.br';
const reportPath = path.resolve(__dirname, 'ajuste-titulos-nativos-deploy-2026-07-30.json');

const docs = [
  {
    id: 2885,
    slug: 'ativar-deploy-staycloud',
    nativeTitle: 'DEPLOY STAYCLOUD NO PAINEL NOVO',
    expectedH1: 'Como ativar o Deploy no Painel Novo da StayCloud em 4 passos',
  },
  {
    id: 2896,
    slug: 'primeiro-deploy-staycloud',
    nativeTitle: 'PRIMEIRO DEPLOY STAYCLOUD',
    expectedH1: 'Como fazer o primeiro deploy na StayCloud',
  },
  {
    id: 2909,
    slug: 'cli-deploy-staycloud',
    nativeTitle: 'CLI DEPLOY STAYCLOUD',
    expectedH1: 'Como instalar e usar a CLI Deploy StayCloud',
  },
];

function secret(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

async function login(page) {
  const user = secret('Usuário WordPress');
  const password = secret('Senha WordPress');
  if (!user || !password) throw new Error('Credenciais WordPress não encontradas na fonte local autorizada.');
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', user, { delay: 8 });
  await page.type('#user_pass', password, { delay: 8 });
  await Promise.allSettled([
    page.click('#wp-submit'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await page.goto(`${site}/wp-admin/index.php`, { waitUntil: 'networkidle2' });
  const logged = await page.evaluate(() => location.href.includes('/wp-admin/') && !document.querySelector('#user_login'));
  if (!logged) throw new Error('Login WordPress não confirmado.');
}

async function wpFetch(page, url, options = {}) {
  return page.evaluate(async ({ url, options }) => {
    const nonce = window.wpApiSettings && window.wpApiSettings.nonce;
    const headers = Object.assign({ 'X-WP-Nonce': nonce, Accept: 'application/json' }, options.headers || {});
    const response = await fetch(url, Object.assign({}, options, { credentials: 'same-origin', headers }));
    const text = await response.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 500) };
    }
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { url, options });
}

async function validatePublic(page, doc) {
  const url = `${site}/docs/${doc.slug}/`;
  const response = await page.goto(url, { waitUntil: 'networkidle2' });
  const data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1')).map((item) => item.textContent.trim()).filter(Boolean);
    const title = document.querySelector('.entry-title, .betterdocs-entry-title, h1')?.textContent.trim() || '';
    return {
      documentTitle: document.title,
      headings,
      bodyText: document.body.innerText.replace(/\s+/g, ' ').slice(0, 1500),
      title,
    };
  });
  return {
    url,
    status: response ? response.status() : null,
    documentTitle: data.documentTitle,
    h1s: data.headings,
    containsNativeTitle: data.bodyText.includes(doc.nativeTitle),
    containsExpectedH1: data.bodyText.includes(doc.expectedH1),
  };
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200'],
    defaultViewport: { width: 1440, height: 1200, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);

  const results = [];
  for (const doc of docs) {
    const before = await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}?context=edit`);
    const updated = await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: doc.nativeTitle }),
    });
    const publicValidation = await validatePublic(page, doc);
    results.push({
      id: doc.id,
      slug: doc.slug,
      beforeTitle: before.title && before.title.raw,
      afterTitle: updated.title && updated.title.raw,
      expectedH1: doc.expectedH1,
      publicValidation,
    });
  }

  fs.writeFileSync(reportPath, JSON.stringify({ adjustedAt: new Date().toISOString(), results }, null, 2));
  console.log(JSON.stringify({ reportPath, results }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
