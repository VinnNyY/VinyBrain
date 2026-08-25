const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud';
const contentPath = path.join(root, '02 - COLAR NO WORDPRESS.txt');
const reportPath = path.join(root, 'apoio', 'publicacao-betterdocs.json');

const payload = {
  title: 'BUSCA DO PAINEL NOVO STAYCLOUD',
  slug: 'busca-do-painel-novo-staycloud',
  excerpt: 'Use a busca do Painel Novo StayCloud para localizar sites, domínios, faturas ou chamados e abrir o resultado correto com segurança.',
  seoTitle: 'Busca do Painel Novo StayCloud: como usar',
  metaDescription: 'Aprenda a usar a busca do Painel Novo StayCloud para localizar sites, domínios, faturas e chamados com rapidez, segurança e organização no painel.',
  focusKeyword: 'busca do Painel Novo StayCloud',
  categoryName: 'Painel novo',
  tags: ['Painel Novo', 'Busca', 'Conta', 'StayCloud'],
  socialTitle: 'Busca do Painel Novo StayCloud',
  socialDescription: 'Veja como usar a busca do Painel Novo StayCloud para encontrar sites, domínios, faturas e chamados de forma rápida.',
};

function secret(prompt, label) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const wanted = normalize(label);
  for (const line of prompt.split(/\n/)) {
    const match = line.match(/-\s*([^:]+):\s*`([^`]+)`/);
    if (match && normalize(match[1]) === wanted) return match[2];
  }
  throw new Error(`Credencial autorizada nao encontrada: ${label}`);
}

function chromePath() {
  for (const candidate of ['/opt/google/chrome/chrome', '/usr/bin/google-chrome']) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return '/usr/bin/google-chrome';
}

async function login(page, prompt) {
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post-new.php?post_type=docs', { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
}

async function getNonce(page) {
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post-new.php?post_type=docs', { waitUntil: 'networkidle2' });
  const nonce = await page.evaluate(() => window.wpApiSettings?.nonce || window.wp?.apiFetch?.nonceMiddleware?.nonce || '');
  if (nonce) return nonce;
  const html = await page.content();
  const match = html.match(/"nonce":"([^"]+)"/) || html.match(/wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"/);
  if (match) return match[1].replace(/\\\//g, '/');
  throw new Error('Nonce REST do WordPress nao encontrado.');
}

async function api(page, nonce, route, options = {}) {
  return page.evaluate(async ({ nonce, route, options }) => {
    const response = await fetch(route, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
        ...(options.headers || {}),
      },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    return data;
  }, { nonce, route, options });
}

async function findTerm(page, nonce, taxonomy, name) {
  const terms = await api(page, nonce, `/wp-json/wp/v2/${taxonomy}?search=${encodeURIComponent(name)}&per_page=100&context=edit`);
  const wanted = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return terms.find((term) => term.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === wanted) || terms[0] || null;
}

async function findOrCreateTag(page, nonce, taxonomy, name) {
  const existing = await findTerm(page, nonce, taxonomy, name);
  if (existing) return existing;
  return api(page, nonce, `/wp-json/wp/v2/${taxonomy}`, { method: 'POST', body: { name } });
}

async function waitStable(page) {
  await new Promise((resolve) => setTimeout(resolve, 9000));
  try {
    await page.waitForNetworkIdle({ idleTime: 1500, timeout: 15000 });
  } catch {}
}

async function clickRankMath(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const clicked = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('button[aria-label*="Rank Math" i], button.components-button, [role="button"][aria-label*="Rank Math" i]'));
      const item = candidates.find((node) => {
        const label = (node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim();
        const href = node.getAttribute('href') || '';
        return /Rank Math/i.test(label) && !/admin\.php\?page=rank-math/i.test(href);
      });
      if (!item) return false;
      item.click();
      return true;
    }).catch(() => false);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    if (clicked) return true;
  }
  return false;
}

async function scoreState(page) {
  return page.evaluate((values) => {
    const text = document.body.innerText;
    const scores = Array.from(text.matchAll(/\b(\d{1,3})\s*\/\s*100\b/g)).map((match) => Number(match[1])).filter((score) => score <= 100);
    const ownText = (el) => Array.from(el.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.nodeValue).join(' ').trim();
    return {
      score: scores.length ? Math.max(...scores) : null,
      focus_visible: text.includes(values.focusKeyword),
      focus_chip_detected: Array.from(document.querySelectorAll('*')).some((el) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        const className = String(el.className || '') + ' ' + String(el.parentElement?.className || '');
        return ownText(el) === values.focusKeyword && /tag|chip|token|keyword|pill|badge/i.test(className);
      }),
      seo_title_visible: text.includes(values.seoTitle),
      slug_visible: text.includes(values.slug),
      description_visible: text.includes(values.metaDescription),
      social_visible: text.includes(values.socialTitle) || text.includes(values.socialDescription),
      relevant_lines: text.split('\n').filter((line) => /Rank Math|Palavra|Foco|Fragmento|Snippet|SEO|Social|Busca|Painel Novo|100|Descrição|Titulo|Título|Slug/i.test(line)).slice(0, 100),
    };
  }, payload);
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const rawContent = fs.readFileSync(contentPath, 'utf8');
  if (/src="prints-finais\//.test(rawContent)) throw new Error('Conteudo ainda contem caminho local de imagem.');
  const content = rawContent.replace(/^\s*<h1>.*?<\/h1>\s*/s, '').trim();
  const midias = JSON.parse(fs.readFileSync(path.join(root, 'apoio', 'midias-publicas.json'), 'utf8')).midias;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
  await login(page, prompt);
  const nonce = await getNonce(page);

  const existing = await api(page, nonce, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(payload.slug)}&status=publish,draft,pending,private,future&context=edit`);
  if (!existing.length) throw new Error(`Documento nao encontrado pelo slug ${payload.slug}.`);
  if (existing.length > 1) throw new Error(`Mais de um documento encontrado pelo slug ${payload.slug}: ${existing.map((post) => post.id).join(', ')}`);
  const doc = existing[0];

  const taxonomies = await api(page, nonce, '/wp-json/wp/v2/taxonomies?type=docs&context=edit');
  const taxonomyKeys = Object.keys(taxonomies);
  const categoryTaxonomy = taxonomyKeys.find((key) => /doc.*cat|category|categoria/i.test(key));
  const tagTaxonomy = taxonomyKeys.find((key) => /doc.*tag|tag/i.test(key));
  const category = categoryTaxonomy ? await findTerm(page, nonce, categoryTaxonomy, payload.categoryName) : null;
  const tags = [];
  if (tagTaxonomy) {
    for (const tag of payload.tags) tags.push(await findOrCreateTag(page, nonce, tagTaxonomy, tag));
  }

  const updateBody = {
    title: payload.title,
    slug: payload.slug,
    content,
    excerpt: payload.excerpt,
    status: 'draft',
    meta: {
      rank_math_title: payload.seoTitle,
      rank_math_description: payload.metaDescription,
      rank_math_focus_keyword: payload.focusKeyword,
      rank_math_facebook_title: payload.socialTitle,
      rank_math_facebook_description: payload.socialDescription,
      rank_math_twitter_title: payload.socialTitle,
      rank_math_twitter_description: payload.socialDescription,
    },
  };
  if (categoryTaxonomy && category) updateBody[categoryTaxonomy] = [category.id];
  if (tagTaxonomy && tags.length) updateBody[tagTaxonomy] = tags.map((tag) => tag.id);
  const draft = await api(page, nonce, `/wp-json/wp/v2/docs/${doc.id}`, { method: 'POST', body: updateBody });

  const editUrl = `https://ajuda.staycloud.com.br/wp-admin/post.php?post=${draft.id}&action=edit`;
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  await waitStable(page);
  const rankMathOpened = await clickRankMath(page);
  await waitStable(page);
  const beforePublish = await scoreState(page);
  await page.screenshot({ path: path.join(root, 'apoio', 'rankmath-gate-before-publish.png'), fullPage: true });

  const focusOk = beforePublish.focus_chip_detected || beforePublish.focus_visible;
  const snippetOk = beforePublish.seo_title_visible || beforePublish.description_visible;
  if (beforePublish.score === null || beforePublish.score < 80 || !focusOk || !snippetOk || !category) {
    fs.writeFileSync(reportPath, JSON.stringify({
      status: 'rascunho_bloqueado',
      blocked_at: new Date().toISOString(),
      id: draft.id,
      edit_url: editUrl,
      link: draft.link,
      score: beforePublish.score,
      focus_ok: focusOk,
      snippet_ok: snippetOk,
      rank_math_opened: rankMathOpened,
      category_confirmed: Boolean(category),
      category_taxonomy: categoryTaxonomy || null,
      category_id: category?.id || null,
      tag_taxonomy: tagTaxonomy || null,
      tag_ids: tags.map((tag) => tag.id),
      beforePublish,
      midias,
    }, null, 2));
    await browser.close();
    throw new Error(`Gate Rank Math bloqueou a publicacao. score=${beforePublish.score}, focus_ok=${focusOk}, snippet_ok=${snippetOk}, category=${Boolean(category)}`);
  }

  const published = await api(page, nonce, `/wp-json/wp/v2/docs/${draft.id}`, { method: 'POST', body: { status: 'publish' } });
  await browser.close();
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'publicado',
    published_at: new Date().toISOString(),
    id: published.id,
    edit_url: editUrl,
    link: published.link,
    slug: published.slug,
    category_taxonomy: categoryTaxonomy || null,
    category_id: category?.id || null,
    tag_taxonomy: tagTaxonomy || null,
    tag_ids: tags.map((tag) => tag.id),
    score: beforePublish.score,
    focus_chip_confirmed: beforePublish.focus_chip_detected,
    focus_visible: beforePublish.focus_visible,
    snippet_confirmed: snippetOk,
    social_visible: beforePublish.social_visible,
    rankMath: beforePublish,
    midias,
  }, null, 2));
  console.log(`PUBLICADO ${published.id} ${published.link} SCORE ${beforePublish.score}`);
}

main().catch((error) => {
  console.error(`CONTINUACAO_INTERROMPIDA: ${error.stack || error.message}`);
  process.exitCode = 1;
});
