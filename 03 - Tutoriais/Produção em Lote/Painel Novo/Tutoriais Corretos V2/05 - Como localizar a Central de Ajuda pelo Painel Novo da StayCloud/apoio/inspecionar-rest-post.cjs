const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

function secret(prompt, label) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const wanted = normalize(label);
  for (const line of prompt.split(/\n/)) {
    const match = line.match(/-\s*([^:]+):\s*`([^`]+)`/);
    if (match && normalize(match[1]) === wanted) return match[2];
  }
  throw new Error(`Credencial autorizada nao encontrada: ${label}`);
}

async function login(page, prompt) {
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'domcontentloaded' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('#wp-submit'),
  ]);
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await login(page, prompt);
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'domcontentloaded' });
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const result = await page.evaluate(async () => {
    const nonce = window.wpApiSettings?.nonce;
    const routes = [
      '/wp-json/wp/v2/docs/2843?context=edit',
      '/wp-json/rankmath/v1/updateMeta',
      '/wp-json/rankmath/v1/getHead?url=https%3A%2F%2Fajuda.staycloud.com.br%2Fdocs%2Fcentral-de-ajuda-staycloud%2F',
    ];
    const out = { nonce: Boolean(nonce), routes: {} };
    for (const route of routes) {
      try {
        const response = await fetch(route, { credentials: 'same-origin', headers: { 'X-WP-Nonce': nonce || '' } });
        const text = await response.text();
        out.routes[route] = { status: response.status, text: text.slice(0, 4000) };
      } catch (error) {
        out.routes[route] = { error: error.message };
      }
    }
    return out;
  });
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
