const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const site = 'https://ajuda.staycloud.com.br';
const slug = 'logs-deploy-staycloud';

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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1600'],
    defaultViewport: { width: 1440, height: 1600, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.goto(`${site}/wp-login.php`, { waitUntil: 'networkidle2' });
  await page.type('#user_login', secret('Usuário WordPress'), { delay: 8 });
  await page.type('#user_pass', secret('Senha WordPress'), { delay: 8 });
  await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
  await page.goto(`${site}/wp-admin/index.php`, { waitUntil: 'networkidle2' });
  const docs = await page.evaluate(async ({ slug }) => {
    const response = await fetch(`/wp-json/wp/v2/docs?slug=${encodeURIComponent(slug)}&status=publish,draft,pending,future,private&context=edit`, {
      credentials: 'same-origin',
      headers: { 'X-WP-Nonce': window.wpApiSettings.nonce, Accept: 'application/json' },
    });
    return response.json();
  }, { slug });
  const draft = docs.find((doc) => doc.status !== 'publish');
  if (!draft) throw new Error('Rascunho não encontrado.');
  await page.goto(`${site}/wp-admin/post.php?post=${draft.id}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 12000));
  const result = await page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const score = [...text.matchAll(/\b([0-9]{1,3})\s*\/\s*100\b/g)].map((m) => Number(m[1])).filter((n) => n >= 0 && n <= 100).sort((a, b) => b - a)[0] || null;
    const snippets = [];
    for (const needle of ['Basic SEO', 'Additional', 'Title Readability', 'Content Readability', 'Focus Keyword', 'passed', 'failed', 'keyword', 'Content is', 'URL']) {
      const i = text.toLowerCase().indexOf(needle.toLowerCase());
      if (i >= 0) snippets.push(text.slice(Math.max(0, i - 300), Math.min(text.length, i + 900)));
    }
    return { score, snippets, bodyStart: text.slice(0, 6000) };
  });
  fs.writeFileSync(path.resolve(__dirname, 'relatorios', 'rankmath-diagnostico.json'), JSON.stringify({ id: draft.id, ...result }, null, 2));
  console.log(JSON.stringify({ id: draft.id, score: result.score, report: path.resolve(__dirname, 'relatorios', 'rankmath-diagnostico.json') }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
