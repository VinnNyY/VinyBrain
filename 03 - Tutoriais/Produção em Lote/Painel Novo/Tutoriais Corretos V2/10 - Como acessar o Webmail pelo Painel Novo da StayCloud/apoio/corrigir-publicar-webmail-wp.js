const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const reportPath = path.join(reportDir, 'publicacao-wordpress.json');

const site = 'https://ajuda.staycloud.com.br';
const oldSlug = 'acessar-webmail-painel-novo-staycloud';
const canonicalSlug = 'webmail-staycloud-painel-novo';
const title = 'WEBMAIL STAYCLOUD NO PAINEL NOVO';
const focusKeyword = 'Webmail StayCloud';
const seoTitle = 'Webmail StayCloud: acessar pelo Painel Novo em 4 passos';
const metaDescription = 'Aprenda a acessar o Webmail StayCloud pelo Painel Novo, localizar a conta correta e abrir a caixa de e-mail pelo navegador com segurança.';
const excerpt = 'Acesse o Webmail StayCloud pelo Painel Novo, localize a conta correta e abra a caixa pelo navegador sem alterar configurações.';
const socialTitle = 'Webmail StayCloud pelo Painel Novo';
const socialDescription = 'Veja como localizar a conta de e-mail no Painel Novo e abrir o Webmail StayCloud com segurança.';
const painelNovoCategoryId = 17;

function secret(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

async function login(page) {
  const user = secret('Usuário WordPress');
  const password = secret('Senha WordPress');
  if (!user || !password) throw new Error('Credenciais WordPress não encontradas.');
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
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { url, options });
}

function buildPublicHtmlFromExistingUploads() {
  const previousPath = path.join(tutorialDir, '02 - COLAR NO WORDPRESS - PUBLICADO.txt');
  if (!fs.existsSync(previousPath)) throw new Error('HTML publicado com URLs públicas ainda não existe.');
  const previous = fs.readFileSync(previousPath, 'utf8');
  const current = fs.readFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS.txt'), 'utf8');
  const files = ['passo-01-gerenciar-servico.png', 'passo-02-area-e-mails.png', 'passo-03-abrir-webmail.png'];
  let html = current;
  for (const file of files) {
    const re = new RegExp(`src="([^"]+/${file.replace('.', '\\.')}|[^"]+/${file.replace('.png', '-1\\.png')})"`);
    const match = previous.match(re);
    if (!match) {
      const loose = previous.match(new RegExp(`src="([^"]+${file.replace('.png', '')}[^"]+\\.png)"`));
      if (!loose) throw new Error(`URL pública não encontrada para ${file}`);
      html = html.replaceAll(`src="prints-finais/${file}"`, `src="${loose[1]}"`);
    } else {
      html = html.replaceAll(`src="prints-finais/${file}"`, `src="${match[1]}"`);
    }
  }
  fs.writeFileSync(previousPath, html);
  return html;
}

async function readRankMathScore(page, docId) {
  await page.goto(`${site}/wp-admin/post.php?post=${docId}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const candidates = [...text.matchAll(/\b([0-9]{1,3})\s*\/\s*100\b/g)].map((m) => Number(m[1])).filter((n) => n >= 0 && n <= 100);
    return candidates.length ? Math.max(...candidates) : null;
  });
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

  const conflicts = await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(canonicalSlug)}&status=publish,draft,pending,future,private&context=edit`);
  const oldMatches = await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(oldSlug)}&status=publish,draft,pending,future,private&context=edit`);
  const doc = oldMatches[0] || conflicts[0];
  if (!doc) throw new Error('Rascunho do Webmail não encontrado.');
  if (conflicts.length && conflicts[0].id !== doc.id) throw new Error(`Slug novo já usado por outro documento: ${conflicts[0].id}`);

  const before = await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}?context=edit`);
  const publicHtml = buildPublicHtmlFromExistingUploads();

  const updated = await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content: publicHtml,
      excerpt,
      slug: canonicalSlug,
      status: 'draft',
      doc_category: [painelNovoCategoryId],
    }),
  });

  const rankMath = await wpFetch(page, '/wp-json/rankmath/v1/updateMeta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectType: 'post',
      objectID: doc.id,
      meta: {
        rank_math_focus_keyword: focusKeyword,
        rank_math_title: seoTitle,
        rank_math_description: metaDescription,
        rank_math_facebook_title: socialTitle,
        rank_math_facebook_description: socialDescription,
        rank_math_twitter_title: socialTitle,
        rank_math_twitter_description: socialDescription,
      },
    }),
  });

  const scoreBeforePublish = await readRankMathScore(page, doc.id);
  if (scoreBeforePublish !== null && scoreBeforePublish < 80) {
    throw new Error(`Gate Rank Math bloqueado novamente: score ${scoreBeforePublish}/100.`);
  }

  await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'publish' }),
  });
  const after = await wpFetch(page, `/wp-json/wp/v2/docs/${doc.id}?context=edit`);
  const scoreAfterPublish = await readRankMathScore(page, doc.id);

  const mediaUrls = [...publicHtml.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const report = {
    documentId: doc.id,
    editUrl: `${site}/wp-admin/post.php?post=${doc.id}&action=edit`,
    publicUrl: after.link,
    slugBefore: before.slug,
    slugAfter: after.slug,
    statusBefore: before.status,
    statusAfter: after.status,
    titleBefore: before.title && before.title.raw,
    titleAfter: after.title && after.title.raw,
    categoriesAfter: after.doc_category,
    mediaUrls,
    rankMathResponse: rankMath,
    rankMathScoreBeforeCorrection: 70,
    rankMathScoreBeforePublish: scoreBeforePublish,
    rankMathScoreAfterPublish: scoreAfterPublish,
    seo: { focusKeyword, seoTitle, metaDescription, excerpt, socialTitle, socialDescription },
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    documentId: report.documentId,
    publicUrl: report.publicUrl,
    slugAfter: report.slugAfter,
    statusAfter: report.statusAfter,
    rankMathScoreBeforeCorrection: 70,
    rankMathScoreBeforePublish: scoreBeforePublish,
    rankMathScoreAfterPublish: scoreAfterPublish,
    reportPath,
  }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
