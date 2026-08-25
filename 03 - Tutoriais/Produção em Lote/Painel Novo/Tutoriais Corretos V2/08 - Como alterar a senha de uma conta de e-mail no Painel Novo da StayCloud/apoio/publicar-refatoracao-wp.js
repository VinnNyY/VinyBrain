const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportDir = path.join(__dirname, 'relatorios');
const reportPath = path.join(reportDir, 'publicacao-wordpress.json');

const site = 'https://ajuda.staycloud.com.br';
const docId = 2099;
const canonicalSlug = 'alterar-senha-de-e-mail';
const title = 'ALTERAR SENHA DE E-MAIL';
const focusKeyword = 'alterar senha de e-mail';
const seoTitle = 'Alterar senha de e-mail StayCloud em 4 passos';
const metaDescription = 'Aprenda a alterar senha de e-mail StayCloud pelo Painel Novo, localizar a conta correta e definir uma nova senha com segurança.';
const excerpt = 'Veja como alterar a senha de uma conta de e-mail StayCloud pelo Painel Novo, conferindo o serviço correto e usando a ação Resetar senha com segurança.';
const socialTitle = 'Alterar senha de e-mail StayCloud pelo Painel Novo';
const socialDescription = 'Aprenda a localizar uma conta de e-mail no Painel Novo da StayCloud e redefinir a senha com segurança.';
const painelNovoCategoryId = 17;
const tagNames = ['E-mail', 'Senha', 'Painel Novo', 'Segurança', 'StayCloud'];

const images = [
  {
    file: 'passo-01-gerenciar-servico.png',
    alt: 'Alterar senha de e-mail StayCloud começando pelo botão Gerenciar do serviço correto',
    title: 'Gerenciar serviço para alterar senha de e-mail StayCloud',
  },
  {
    file: 'passo-02-contas-email.png',
    alt: 'Área de E-mails no Painel Novo da StayCloud para gerenciar contas',
    title: 'Área de E-mails no Painel Novo da StayCloud',
  },
  {
    file: 'passo-03-acao-alterar-senha.png',
    alt: 'Ação Resetar senha em uma conta de e-mail StayCloud no Painel Novo',
    title: 'Ação Resetar senha no Painel Novo',
  },
  {
    file: 'passo-04-nova-senha.png',
    alt: 'Alterar senha de e-mail StayCloud no modal de Resetar senha do Painel Novo',
    title: 'Modal Resetar senha de e-mail StayCloud',
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
    if (!response.ok) {
      throw new Error(JSON.stringify({ status: response.status, data }));
    }
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
  await page.goto(`${site}/wp-admin/post.php?post=${docId}&action=edit`, { waitUntil: 'networkidle2' });

  const before = await wpFetch(page, `/wp-json/wp/v2/docs/${docId}?context=edit`);
  if (before.id !== docId) throw new Error('ID BetterDocs inesperado.');
  if (before.slug !== canonicalSlug) throw new Error(`Slug inesperado antes da atualização: ${before.slug}`);
  if (before.status !== 'publish') throw new Error(`Status inesperado antes da atualização: ${before.status}`);

  const previousReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null;
  const previousUploads = previousReport && Array.isArray(previousReport.uploaded) ? previousReport.uploaded : [];
  const uploaded = [];
  for (const image of images) {
    const existing = previousUploads.find((item) => item.file === image.file && item.url);
    uploaded.push(existing || await uploadImage(page, image));
  }

  const tagIds = [];
  for (const tag of tagNames) tagIds.push(await ensureTag(page, tag));

  const publicHtml = buildPublicHtml(uploaded);
  fs.writeFileSync(path.join(tutorialDir, '02 - COLAR NO WORDPRESS - PUBLICADO.txt'), publicHtml);

  const updated = await wpFetch(page, `/wp-json/wp/v2/docs/${docId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content: publicHtml,
      excerpt,
      slug: canonicalSlug,
      status: 'publish',
      doc_category: [painelNovoCategoryId],
      doc_tag: tagIds,
    }),
  });

  const rankMath = await wpFetch(page, '/wp-json/rankmath/v1/updateMeta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectType: 'post',
      objectID: docId,
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

  const after = await wpFetch(page, `/wp-json/wp/v2/docs/${docId}?context=edit`);
  const report = {
    documentId: docId,
    editUrl: `${site}/wp-admin/post.php?post=${docId}&action=edit`,
    publicUrl: after.link,
    slugBefore: before.slug,
    slugAfter: after.slug,
    statusBefore: before.status,
    statusAfter: after.status,
    titleBefore: before.title && before.title.raw,
    titleAfter: after.title && after.title.raw,
    categoriesBefore: before.doc_category,
    categoriesAfter: after.doc_category,
    tagsAfter: after.doc_tag,
    uploaded,
    rankMathResponse: rankMath,
    seo: {
      focusKeyword,
      seoTitle,
      metaDescription,
      excerpt,
      socialTitle,
      socialDescription,
    },
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    documentId: report.documentId,
    publicUrl: report.publicUrl,
    slugAfter: report.slugAfter,
    statusAfter: report.statusAfter,
    categoriesAfter: report.categoriesAfter,
    mediaIds: uploaded.map((item) => item.id),
    mediaUrls: uploaded.map((item) => item.url),
    rankMathUpdated: !!rankMath,
    reportPath,
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
