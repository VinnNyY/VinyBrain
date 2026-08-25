const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const site = 'https://ajuda.staycloud.com.br';
const slug = 'dominio-personalizado-deploy-staycloud';

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

async function wpFetch(page, url, options = {}) {
  return page.evaluate(async ({ url, options }) => {
    const headers = Object.assign({ 'X-WP-Nonce': window.wpApiSettings.nonce, Accept: 'application/json' }, options.headers || {});
    const response = await fetch(url, Object.assign({}, options, { credentials: 'same-origin', headers }));
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 1000) }; }
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { url, options });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200'],
    defaultViewport: { width: 1440, height: 1200 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  const docs = await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(slug)}&status=publish,draft,pending,future,private&context=edit`);
  const doc = docs[0];
  if (!doc) throw new Error('Rascunho não encontrado.');
  await page.goto(`${site}/wp-admin/post.php?post=${doc.id}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 12000));
  const diagnosis = await page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const matches = [...text.matchAll(/\b([0-9]{1,3})\s*\/\s*100\b/g)].map((m) => Number(m[1]));
    const needles = ['Focus Keyword', 'Palavra-chave', 'domínio personalizado', 'SEO Title', 'Meta Description', 'Basic SEO', 'SEO básico'];
    const snippets = {};
    for (const needle of needles) {
      const idx = text.toLowerCase().indexOf(needle.toLowerCase());
      snippets[needle] = idx >= 0 ? text.slice(Math.max(0, idx - 220), idx + 900) : null;
    }
    return {
      title: document.querySelector('[name="post_title"], #title') && document.querySelector('[name="post_title"], #title').value,
      scores: matches,
      snippets,
      textStart: text.slice(0, 2000),
    };
  });
  console.log(JSON.stringify({ id: doc.id, status: doc.status, link: doc.link, title: doc.title.raw, meta: doc.meta, diagnosis }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
