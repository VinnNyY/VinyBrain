const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const reportPath = path.join(reportDir, 'publicacao-wordpress.json');

const site = 'https://ajuda.staycloud.com.br';
const canonicalSlug = 'acessar-webmail-painel-novo-staycloud';
const title = 'WEBMAIL STAYCLOUD NO PAINEL NOVO';
const focusKeyword = 'acessar Webmail pelo Painel Novo';
const seoTitle = 'Acessar Webmail pelo Painel Novo da StayCloud';
const metaDescription = 'Aprenda a acessar Webmail pelo Painel Novo da StayCloud, localizar a conta correta e abrir a caixa de e-mail pelo navegador com segurança.';
const excerpt = 'Acesse o Webmail pelo Painel Novo da StayCloud, localize a conta correta e abra a caixa pelo navegador sem alterar configurações.';
const socialTitle = 'Como acessar o Webmail pelo Painel Novo';
const socialDescription = 'Veja como localizar a conta de e-mail no Painel Novo da StayCloud e abrir o Webmail com segurança.';
const painelNovoCategoryId = 17;
const tagNames = ['E-mail', 'Webmail', 'Painel Novo', 'StayCloud'];

const images = [
  {
    file: 'passo-01-gerenciar-servico.png',
    alt: 'Acessar Webmail pelo Painel Novo usando o botão Gerenciar do serviço correto',
    title: 'Gerenciar serviço para acessar Webmail pelo Painel Novo',
  },
  {
    file: 'passo-02-area-e-mails.png',
    alt: 'Aba E-mails no Painel Novo da StayCloud para acessar o Webmail',
    title: 'Aba E-mails no Painel Novo da StayCloud',
  },
  {
    file: 'passo-03-abrir-webmail.png',
    alt: 'Botão Abrir Webmail no Painel Novo da StayCloud',
    title: 'Botão Abrir Webmail no Painel Novo',
  },
];

fs.mkdirSync(reportDir, { recursive: true });

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
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { url, options });
}

async function uploadImage(page, image) {
  const filename = image.file;
  const filePath = path.join(tutorialDir, 'prints-finais', filename);
  const bytes = fs.readFileSync(filePath).toString('base64');
  const uploaded = await page.evaluate(async ({ filename, bytes }) => {
    const raw = Uint8Array.from(atob(bytes), (char) => char.charCodeAt(0));
    const response = await fetch('/wp-json/wp/v2/media', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-WP-Nonce': window.wpApiSettings.nonce,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'image/png',
        Accept: 'application/json',
      },
      body: raw,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify({ status: response.status, data }));
    return data;
  }, { filename, bytes });

  await wpFetch(page, `/wp-json/wp/v2/media/${uploaded.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: image.title,
      alt_text: image.alt,
      caption: image.title,
    }),
  });

  return {
    file: filename,
    id: uploaded.id,
    url: uploaded.source_url,
    alt: image.alt,
  };
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
  for (const item of uploaded) {
    html = html.replaceAll(`src="prints-finais/${item.file}"`, `src="${item.url}"`);
  }
  return html;
}

async function readRankMathScore(page, docId) {
  await page.goto(`${site}/wp-admin/post.php?post=${docId}&action=edit`, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 8000));
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

  const slugMatches = await wpFetch(page, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(canonicalSlug)}&status=publish,draft,pending,future,private&context=edit`);
  if (slugMatches.length) throw new Error(`Documento já existe para o slug ${canonicalSlug}: ID ${slugMatches[0].id}`);

  const uploaded = [];
  for (const image of images) uploaded.push(await uploadImage(page, image));

  const tagIds = [];
  for (const tag of tagNames) tagIds.push(await ensureTag(page, tag));

  const publicHtml = buildPublicHtml(uploaded);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS - PUBLICADO.txt'), publicHtml);

  const draft = await wpFetch(page, '/wp-json/wp/v2/docs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content: publicHtml,
      excerpt,
      slug: canonicalSlug,
      status: 'draft',
      doc_category: [painelNovoCategoryId],
      doc_tag: tagIds,
    }),
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
  if (scoreBeforePublish !== null && scoreBeforePublish < 80) {
    throw new Error(`Gate Rank Math bloqueado: score ${scoreBeforePublish}/100 antes da publicação.`);
  }

  const published = await wpFetch(page, `/wp-json/wp/v2/docs/${draft.id}`, {
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
    seo: {
      focusKeyword,
      seoTitle,
      metaDescription,
      excerpt,
      socialTitle,
      socialDescription,
    },
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    documentId: report.documentId,
    publicUrl: report.publicUrl,
    slug: report.slug,
    status: report.status,
    categories: report.categories,
    mediaIds: uploaded.map((item) => item.id),
    mediaUrls: uploaded.map((item) => item.url),
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
