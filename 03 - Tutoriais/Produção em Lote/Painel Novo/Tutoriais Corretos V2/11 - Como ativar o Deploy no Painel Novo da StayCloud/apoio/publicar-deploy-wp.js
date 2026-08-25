const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const reportPath = path.join(reportDir, 'publicacao-wordpress.json');
const mediaPath = path.join(__dirname, 'midias-publicas.json');

const site = 'https://ajuda.staycloud.com.br';
const canonicalSlug = 'ativar-deploy-staycloud';
const title = 'DEPLOY STAYCLOUD NO PAINEL NOVO';
const focusKeyword = 'Deploy StayCloud';
const seoTitle = 'Ativar Deploy StayCloud pelo Painel Novo em 4 passos';
const metaDescription = 'Veja como ativar o Deploy StayCloud pelo Painel Novo, conferir os pré-requisitos e preparar sua conta para publicar aplicações.';
const excerpt = 'Aprenda onde localizar o Deploy StayCloud no Painel Novo, conferir o status Cloud e identificar o botão Começar grátis antes da ativação.';
const socialTitle = 'Como ativar o Deploy StayCloud pelo Painel Novo';
const socialDescription = 'Veja o caminho seguro para localizar o Deploy, conferir o status Cloud e iniciar a ativação somente com autorização.';
const painelNovoCategoryId = 17;
const tagNames = ['Deploy', 'Painel Novo', 'Aplicações', 'Desenvolvimento', 'StayCloud'];

const images = [
  {
    file: '01-menu-deploy-sanitizado.png',
    alt: 'Menu Deploy para ativar Deploy StayCloud no Painel Novo',
    title: 'Menu Deploy no Painel Novo da StayCloud',
  },
  {
    file: '02-tela-inicial-deploy-sanitizado.png',
    alt: 'Tela Cloud do Deploy StayCloud no Painel Novo',
    title: 'Tela Cloud do Deploy StayCloud',
  },
  {
    file: '03-status-cloud-nao-ativo-sanitizado.png',
    alt: 'Status cloud ainda não ativo antes de ativar Deploy StayCloud',
    title: 'Status Cloud ainda não ativo',
  },
  {
    file: '04-botao-ativacao-sanitizado.png',
    alt: 'Botão Começar grátis para ativar Deploy StayCloud',
    title: 'Botão Começar grátis do Deploy StayCloud',
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
    title: image.title,
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
  const existingDraft = slugMatches.find((doc) => doc.status !== 'publish');

  const uploaded = fs.existsSync(mediaPath)
    ? JSON.parse(fs.readFileSync(mediaPath, 'utf8'))
    : [];
  if (!uploaded.length) {
    for (const image of images) uploaded.push(await uploadImage(page, image));
    fs.writeFileSync(mediaPath, JSON.stringify(uploaded, null, 2));
  }

  const tagIds = [];
  for (const tag of tagNames) tagIds.push(await ensureTag(page, tag));

  const publicHtml = buildPublicHtml(uploaded);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS - PUBLICADO.txt'), publicHtml);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS.txt'), publicHtml);

  const draft = existingDraft
    ? await wpFetch(page, `/wp-json/wp/v2/docs/${existingDraft.id}`, {
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
      })
    : await wpFetch(page, '/wp-json/wp/v2/docs', {
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
