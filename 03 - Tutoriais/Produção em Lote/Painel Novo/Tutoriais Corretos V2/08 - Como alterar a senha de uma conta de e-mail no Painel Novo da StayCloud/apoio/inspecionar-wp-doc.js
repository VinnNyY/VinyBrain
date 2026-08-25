const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const envPath = '/home/vinicius-alves/.secure/wordpress-ajuda-staycloud.env';

function readEnv(key) {
  const raw = fs.readFileSync(envPath, 'utf8');
  const match = raw.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

async function main() {
  const site = readEnv('WORDPRESS_URL') || 'https://ajuda.staycloud.com.br';
  const user = readEnv('WORDPRESS_USERNAME') || readEnv('WORDPRESS_EMAIL');
  const password = readEnv('WORDPRESS_PASSWORD');
  if (!user || !password) throw new Error('Credenciais WordPress ausentes no arquivo seguro.');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200'],
    defaultViewport: { width: 1440, height: 1200, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', user, { delay: 8 });
  await page.type('#user_pass', password, { delay: 8 });
  await Promise.allSettled([
    page.click('#wp-submit'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await page.goto(`${site}/wp-admin/post.php?post=2099&action=edit`, { waitUntil: 'networkidle2' });
  const result = await page.evaluate(async () => {
    const nonce = window.wpApiSettings && window.wpApiSettings.nonce;
    const res = await fetch('/wp-json/wp/v2/docs/2099?context=edit', {
      credentials: 'same-origin',
      headers: { 'X-WP-Nonce': nonce, Accept: 'application/json' },
    });
    const text = await res.text();
    let doc = null;
    try { doc = JSON.parse(text); } catch {}
    return {
      status: res.status,
      contentType: res.headers.get('content-type'),
      title: doc && doc.title,
      slug: doc && doc.slug,
      postStatus: doc && doc.status,
      link: doc && doc.link,
      docCategory: doc && doc.doc_category,
      docTag: doc && doc.doc_tag,
      metaKeys: doc && doc.meta ? Object.keys(doc.meta) : [],
      meta: doc && doc.meta ? doc.meta : null,
      htmlStart: doc ? null : text.slice(0, 120),
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
