const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud';
const contentPath = path.join(root, '02 - COLAR NO WORDPRESS.txt');
const reportPath = path.join(root, 'apoio', 'conteudo-rankmath-recalc.json');

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
  const raw = fs.readFileSync(contentPath, 'utf8');
  const content = raw.replace(/^\s*<h1>.*?<\/h1>\s*/s, '').trim();
  if (/prints-finais\//.test(content)) throw new Error('Conteudo contem caminho local de imagem.');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100 });
  await login(page, prompt);
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'domcontentloaded' });
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const result = await page.evaluate(async (content) => {
    const nonce = window.wpApiSettings?.nonce || window.rankMath?.restNonce || '';
    const postResponse = await fetch('/wp-json/wp/v2/docs/2843', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
      body: JSON.stringify({ content }),
    });
    const postText = await postResponse.text();
    const rankResponse = await fetch('/wp-json/rankmath/v1/updateMeta', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': window.rankMath?.restNonce || nonce },
      body: JSON.stringify({
        objectID: 2843,
        objectType: 'post',
        meta: {
          rank_math_focus_keyword: 'Central de Ajuda StayCloud',
          rank_math_title: 'Central de Ajuda StayCloud: como acessar pelo Painel Novo',
          rank_math_description: 'Aprenda a localizar a Central de Ajuda StayCloud pelo Painel Novo, pesquisar tutoriais e encontrar rapidamente orientações para sua conta e serviços.',
          rank_math_facebook_title: 'Central de Ajuda StayCloud pelo Painel Novo',
          rank_math_facebook_description: 'Veja como acessar a Central de Ajuda StayCloud, pesquisar tutoriais e encontrar orientações para sua conta e serviços.',
          rank_math_facebook_image: 'https://ajuda.staycloud.com.br/wp-content/uploads/2026/07/01-menu-suporte-sanitizado.png',
          rank_math_facebook_image_id: '2838',
          rank_math_twitter_use_facebook: 'off',
          rank_math_twitter_title: 'Central de Ajuda StayCloud pelo Painel Novo',
          rank_math_twitter_description: 'Veja como acessar a Central de Ajuda StayCloud, pesquisar tutoriais e encontrar orientações para sua conta e serviços.',
          rank_math_twitter_image: 'https://ajuda.staycloud.com.br/wp-content/uploads/2026/07/01-menu-suporte-sanitizado.png',
          rank_math_twitter_image_id: '2838',
        },
        content,
      }),
    });
    const rankText = await rankResponse.text();
    return {
      postStatus: postResponse.status,
      postText: postText.slice(0, 500),
      rankStatus: rankResponse.status,
      rankText: rankText.slice(0, 500),
    };
  }, content);

  await browser.close();
  fs.writeFileSync(reportPath, JSON.stringify({
    updated_at: new Date().toISOString(),
    post_id: 2843,
    external_link_added: 'https://staycloud.com/',
    result,
  }, null, 2));
  console.log(reportPath);
}

main().catch((error) => {
  console.error(`RECALC_INTERROMPIDO: ${error.stack || error.message}`);
  process.exitCode = 1;
});
