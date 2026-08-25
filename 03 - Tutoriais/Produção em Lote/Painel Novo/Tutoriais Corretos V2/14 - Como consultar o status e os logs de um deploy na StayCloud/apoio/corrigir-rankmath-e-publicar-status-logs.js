const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const reportPath = path.join(reportDir, 'publicacao-wordpress.json');
const mediaPath = path.join(__dirname, 'midias-publicas.json');

const site = 'https://ajuda.staycloud.com.br';
const canonicalSlug = 'logs-do-deploy-staycloud';
const previousSlug = 'logs-deploy-staycloud';
const title = 'LOGS DO DEPLOY STAYCLOUD';
const focusKeyword = 'logs do Deploy StayCloud';
const seoTitle = 'Logs do Deploy StayCloud: consulte em 5 passos';
const metaDescription = 'Veja como consultar os logs do Deploy StayCloud, acompanhar o status da publicação e identificar se sua aplicação foi concluída ou apresentou erro.';
const excerpt = 'Aprenda a consultar os logs do Deploy StayCloud, acompanhar o status, abrir o histórico de publicações e identificar sinais de sucesso ou falha no build.';
const socialTitle = 'Logs do Deploy StayCloud: consulte em 5 passos';
const socialDescription = 'Veja onde acompanhar o status do deploy, abrir o histórico de publicações e consultar logs de build no Painel Novo.';
const painelNovoCategoryId = 17;
const tagNames = ['Deploy', 'Logs', 'Status', 'Aplicações', 'Desenvolvimento', 'StayCloud'];

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
  await Promise.allSettled([page.click('#wp-submit'), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })]);
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

async function ensureTag(page, name) {
  const existing = await wpFetch(page, `/wp-json/wp/v2/doc_tag?search=${encodeURIComponent(name)}&per_page=20`);
  const found = existing.find((term) => term.name.toLowerCase() === name.toLowerCase());
  if (found) return found.id;
  const created = await wpFetch(page, '/wp-json/wp/v2/doc_tag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return created.id;
}

function buildPublicHtml(uploaded) {
  let html = fs.readFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS.txt'), 'utf8');
  uploaded.forEach((item, index) => {
    const placeholder = `URL_DA_IMAGEM_${String(index + 1).padStart(2, '0')}`;
    html = html.replaceAll(`src="${placeholder}"`, `src="${item.url}"`);
    html = html.replaceAll(`src="prints-finais/${item.file}"`, `src="${item.url}"`);
  });
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

  const matches = [
    ...await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(canonicalSlug)}&status=publish,draft,pending,future,private&context=edit`),
    ...await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(previousSlug)}&status=publish,draft,pending,future,private&context=edit`),
  ];
  if (matches.some((doc) => doc.status === 'publish')) throw new Error(`Slug já publicado: ${canonicalSlug}`);
  const draft = matches.find((doc) => doc.status !== 'publish');
  if (!draft) throw new Error(`Rascunho não encontrado para slug ${canonicalSlug}`);

  const uploaded = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
  const tagIds = [];
  for (const tag of tagNames) tagIds.push(await ensureTag(page, tag));

  const publicHtml = buildPublicHtml(uploaded);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS - PUBLICADO.txt'), publicHtml);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS.txt'), publicHtml);

  await wpFetch(page, `/wp-json/wp/v2/docs/${draft.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: publicHtml, excerpt, slug: canonicalSlug, status: 'draft', doc_category: [painelNovoCategoryId], doc_tag: tagIds }),
  });

  const rankMath = await wpFetch(page, '/wp-json/rankmath/v1/updateMeta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectType: 'post',
      objectID: draft.id,
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

  const scoreBeforePublish = await readRankMathScore(page, draft.id);
  if (scoreBeforePublish !== null && scoreBeforePublish < 80) throw new Error(`Gate Rank Math bloqueado: score ${scoreBeforePublish}/100 antes da publicação.`);

  await wpFetch(page, `/wp-json/wp/v2/docs/${draft.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'publish' }),
  });
  const after = await wpFetch(page, `/wp-json/wp/v2/docs/${draft.id}?context=edit`);
  const scoreAfterPublish = await readRankMathScore(page, draft.id);

  const report = {
    documentId: draft.id,
    editUrl: `${site}/wp-admin/post.php?post=${draft.id}&action=edit`,
    publicUrl: after.link,
    slug: after.slug,
    status: after.status,
    title: after.title && after.title.raw,
    categories: after.doc_category,
    tags: after.doc_tag,
    uploaded,
    rankMathResponse: rankMath,
    rankMathScoreBeforePublish: scoreBeforePublish,
    rankMathScoreAfterPublish: scoreAfterPublish,
    seo: { focusKeyword, seoTitle, metaDescription, excerpt, socialTitle, socialDescription },
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    documentId: report.documentId,
    publicUrl: report.publicUrl,
    slug: report.slug,
    status: report.status,
    mediaIds: uploaded.map((item) => item.id),
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
