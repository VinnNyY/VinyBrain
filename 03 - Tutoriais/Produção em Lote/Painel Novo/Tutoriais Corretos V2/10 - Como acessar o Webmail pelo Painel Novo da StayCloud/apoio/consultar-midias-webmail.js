const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const site = 'https://ajuda.staycloud.com.br';
const urls = [
  'https://ajuda.staycloud.com.br/wp-content/uploads/2026/07/passo-01-gerenciar-servico-1.png',
  'https://ajuda.staycloud.com.br/wp-content/uploads/2026/07/passo-02-area-e-mails.png',
  'https://ajuda.staycloud.com.br/wp-content/uploads/2026/07/passo-03-abrir-webmail.png',
];

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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', secret('Usuário WordPress'), { delay: 8 });
  await page.type('#user_pass', secret('Senha WordPress'), { delay: 8 });
  await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
  await page.goto(`${site}/wp-admin/index.php`, { waitUntil: 'networkidle2' });
  const result = await page.evaluate(async (urls) => {
    const out = [];
    for (const source of urls) {
      const name = source.split('/').pop().replace('.png', '');
      const response = await fetch(`/wp-json/wp/v2/media?search=${encodeURIComponent(name)}&per_page=20&context=edit`, {
        credentials: 'same-origin',
        headers: { 'X-WP-Nonce': window.wpApiSettings.nonce, Accept: 'application/json' },
      });
      const data = await response.json();
      const found = data.find((item) => item.source_url === source) || data[0];
      out.push(found ? { id: found.id, url: found.source_url, title: found.title && found.title.raw } : { id: null, url: source });
    }
    return out;
  }, urls);
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
