const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud';
const contentPath = path.join(root, '02 - COLAR NO WORDPRESS.txt');
const previewPath = path.join(root, '01 - VISUALIZAR TUTORIAL.html');
const mediaOutput = path.join(root, 'apoio', 'midias-publicas.json');
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

const images = [
  {
    etapa: 1,
    file: 'prints-finais/01-barra-busca-geral-sanitizado.png',
    title: 'Busca do Painel Novo StayCloud - Barra superior',
    alt: 'Busca do Painel Novo StayCloud destacada no topo da tela inicial',
    caption: 'Barra de busca geral destacada no topo do Painel Novo.',
  },
  {
    etapa: 2,
    file: 'prints-finais/02-resultados-busca-geral-sanitizado.png',
    title: 'Busca do Painel Novo StayCloud - Resultados',
    alt: 'Resultados exibidos pela busca do Painel Novo StayCloud após digitar um termo',
    caption: 'Resultados exibidos depois de digitar um termo na busca.',
  },
  {
    etapa: 3,
    file: 'prints-finais/03-resultado-correto-busca-sanitizado.png',
    title: 'Busca do Painel Novo StayCloud - Resultado correto',
    alt: 'Resultado correto destacado na busca do Painel Novo StayCloud',
    caption: 'Resultado correto destacado antes de abrir a página correspondente.',
  },
];

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

async function login(page, prompt, url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
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
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    }
    return data;
  }, { nonce, route, options });
}

async function existingMedia(page, filename) {
  await page.goto(`https://ajuda.staycloud.com.br/wp-admin/upload.php?mode=list&s=${encodeURIComponent(filename)}`, { waitUntil: 'networkidle2' });
  const matches = await page.$$eval('#the-list tr', (rows, filename) => rows.map((row) => {
    const editLink = Array.from(row.querySelectorAll('a')).find((link) => /post\.php\?post=\d+&action=edit/.test(link.href));
    const title = editLink?.textContent?.trim() || '';
    const edit = editLink?.href || '';
    const text = row.textContent || '';
    return { title, edit, text };
  }).filter((row) => row.edit && (row.text.includes(filename) || row.title.includes(filename.replace(/\.[^.]+$/, '')))), filename);
  return matches[0] || null;
}

async function updateAndReadMedia(page, editUrl, item) {
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  if (await page.$('#title')) await page.$eval('#title', (element, value) => { element.value = value; }, item.title);
  if (await page.$('#attachment_alt')) await page.$eval('#attachment_alt', (element, value) => { element.value = value; }, item.alt);
  if (await page.$('#publish')) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#publish'),
    ]);
  }
  return {
    media_id: Number(new URL(editUrl).searchParams.get('post')),
    public_url: await page.$eval('#attachment_url', (element) => element.value),
  };
}

async function uploadMedia(page, item) {
  const filename = path.basename(item.file);
  const existing = await existingMedia(page, filename);
  if (existing) {
    const media = await updateAndReadMedia(page, existing.edit, item);
    return { ...item, filename, ...media, sanitizada: true, status: 'existente_atualizada' };
  }
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/media-new.php', { waitUntil: 'networkidle2' });
  const input = await page.$('input[type="file"]');
  if (!input) throw new Error(`Campo de upload de midia nao encontrado para ${filename}.`);
  await input.uploadFile(path.join(root, item.file));
  await page.waitForFunction(() => document.querySelectorAll('#media-items .media-item').length > 0, { timeout: 45000 });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const created = await existingMedia(page, filename);
  if (!created) throw new Error(`Upload feito, mas midia nao encontrada: ${filename}`);
  const media = await updateAndReadMedia(page, created.edit, item);
  return { ...item, filename, ...media, sanitizada: true, status: 'enviada' };
}

function updateLocalHtml(midias) {
  for (const file of [contentPath, previewPath]) {
    let html = fs.readFileSync(file, 'utf8');
    for (const item of midias) {
      html = html.replaceAll(item.file, item.public_url);
    }
    fs.writeFileSync(file, html);
  }
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

async function clickRankMath(page) {
  await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const item = candidates.find((node) => /Rank Math/i.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (item) item.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 1800));
}

async function setFieldByLabels(page, labels, value, options = {}) {
  const ok = await page.evaluate(({ labels, value }) => {
    const norm = (text) => (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const wanted = labels.map(norm);
    const fields = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, [contenteditable="true"]'));
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const candidates = fields.filter(visible).map((el) => {
      const id = el.id;
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      const haystack = [
        label?.innerText,
        el.getAttribute('aria-label'),
        el.getAttribute('placeholder'),
        el.closest('label')?.innerText,
        el.parentElement?.innerText,
        el.closest('[class*="field"], [class*="input"], [class*="form"], [class*="snippet"], [class*="keyword"]')?.innerText,
      ].filter(Boolean).join(' ');
      return { el, haystack: norm(haystack) };
    });
    const match = candidates.find((item) => wanted.some((label) => item.haystack.includes(label)));
    if (!match) return false;
    const el = match.el;
    el.focus();
    if (el.isContentEditable) {
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, value);
    } else {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }, { labels, value });
  if (!ok && options.required) throw new Error(`Campo nao encontrado: ${labels.join(' | ')}`);
  if (ok && options.enter) await page.keyboard.press('Enter');
  await new Promise((resolve) => setTimeout(resolve, options.wait || 1200));
  return ok;
}

async function collectRankMathState(page) {
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
      snippet_visible: text.includes(values.seoTitle) && text.includes(values.slug) && text.includes(values.metaDescription),
      social_visible: text.includes(values.socialTitle) || text.includes(values.socialDescription),
      relevant_lines: text.split('\n').filter((line) => /Rank Math|Palavra|Foco|Fragmento|Snippet|SEO|Social|Busca|Painel Novo|100|Descrição|Titulo|Título|Slug/i.test(line)).slice(0, 120),
    };
  }, payload);
}

async function fillRankMath(page, editUrl) {
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 5500));
  await clickRankMath(page);
  const before = await collectRankMathState(page);

  await setFieldByLabels(page, ['Palavra-chave de foco', 'focus keyword', 'keyword'], payload.focusKeyword, { enter: true, wait: 2500 });

  const clickedSnippet = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const item = candidates.find((node) => /Editar Fragmento|Editar.*snippet|Edit Snippet|Fragmento de c[oó]digo/i.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (!item) return false;
    item.click();
    return true;
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (clickedSnippet) {
    await setFieldByLabels(page, ['Título', 'SEO Title', 'title'], payload.seoTitle);
    await setFieldByLabels(page, ['Link Permanente', 'Permalink', 'Slug'], payload.slug);
    await setFieldByLabels(page, ['Descrição', 'Description', 'Meta Description'], payload.metaDescription);
  }

  await page.evaluate((excerpt) => {
    if (window.wp?.data?.dispatch) {
      window.wp.data.dispatch('core/editor')?.editPost?.({ excerpt });
    }
  }, payload.excerpt);

  const openedSocial = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const item = candidates.find((node) => /^Social$/i.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (!item) return false;
    item.click();
    return true;
  });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (openedSocial) {
    await setFieldByLabels(page, ['Título', 'Facebook Title', 'Título do Facebook', 'Twitter Title'], payload.socialTitle);
    await setFieldByLabels(page, ['Descrição', 'Facebook Description', 'Descrição do Facebook', 'Twitter Description'], payload.socialDescription);
  }

  const afterFill = await collectRankMathState(page);
  await page.screenshot({ path: path.join(root, 'apoio', 'rankmath-pre-publicacao.png'), fullPage: true });
  const saved = await page.evaluate(async () => {
    if (window.wp?.data?.dispatch && window.wp?.data?.select) {
      await window.wp.data.dispatch('core/editor').savePost();
      return true;
    }
    return false;
  });
  await new Promise((resolve) => setTimeout(resolve, 9000));
  const afterSave = await collectRankMathState(page);
  await page.screenshot({ path: path.join(root, 'apoio', 'rankmath-pos-save.png'), fullPage: true });
  return { before, afterFill, afterSave, saved, clickedSnippet, openedSocial };
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
  await login(page, prompt, 'https://ajuda.staycloud.com.br/wp-admin/upload.php');

  const midias = [];
  for (const item of images) midias.push(await uploadMedia(page, item));
  fs.writeFileSync(mediaOutput, JSON.stringify({
    tutorial: payload.title,
    origem: 'Upload autorizado por Vinicius em 2026-07-27. Publicacao autorizada.',
    midias,
  }, null, 2));
  updateLocalHtml(midias);

  const nonce = await getNonce(page);
  const existing = await api(page, nonce, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(payload.slug)}&status=publish,draft,pending,private,future&context=edit`);
  if (existing.length) throw new Error(`Ja existe documento com o slug ${payload.slug}: id ${existing[0].id}`);

  const taxonomies = await api(page, nonce, '/wp-json/wp/v2/taxonomies?type=docs&context=edit');
  const taxonomyKeys = Object.keys(taxonomies);
  const categoryTaxonomy = taxonomyKeys.find((key) => /doc.*cat|category|categoria/i.test(key));
  const tagTaxonomy = taxonomyKeys.find((key) => /doc.*tag|tag/i.test(key));

  const rawContent = fs.readFileSync(contentPath, 'utf8');
  if (/src="prints-finais\//.test(rawContent)) throw new Error('Conteudo ainda contem caminho local de imagem.');
  const content = rawContent.replace(/^\s*<h1>.*?<\/h1>\s*/s, '').trim();

  const body = {
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

  let category = null;
  if (categoryTaxonomy) {
    category = await findTerm(page, nonce, categoryTaxonomy, payload.categoryName);
    if (category) body[categoryTaxonomy] = [category.id];
  }

  const tags = [];
  if (tagTaxonomy) {
    for (const tag of payload.tags) tags.push(await findOrCreateTag(page, nonce, tagTaxonomy, tag));
    body[tagTaxonomy] = tags.map((tag) => tag.id);
  }

  const draft = await api(page, nonce, '/wp-json/wp/v2/docs', { method: 'POST', body });
  const editUrl = `https://ajuda.staycloud.com.br/wp-admin/post.php?post=${draft.id}&action=edit`;
  const rankMath = await fillRankMath(page, editUrl);
  const finalScore = rankMath.afterSave.score;
  const focusOk = rankMath.afterSave.focus_chip_detected || rankMath.afterSave.focus_visible;
  if (finalScore === null || finalScore < 80 || !focusOk || !rankMath.clickedSnippet || !category) {
    fs.writeFileSync(reportPath, JSON.stringify({
      status: 'rascunho_bloqueado',
      blocked_at: new Date().toISOString(),
      id: draft.id,
      edit_url: editUrl,
      link: draft.link,
      score: finalScore,
      focus_ok: focusOk,
      clicked_snippet: rankMath.clickedSnippet,
      category_confirmed: Boolean(category),
      category_taxonomy: categoryTaxonomy || null,
      category_id: category?.id || null,
      tag_taxonomy: tagTaxonomy || null,
      tag_ids: tags.map((tag) => tag.id),
      rankMath,
      midias,
    }, null, 2));
    throw new Error(`Gate Rank Math bloqueou a publicacao. score=${finalScore}, focus_ok=${focusOk}, snippet=${rankMath.clickedSnippet}, category=${Boolean(category)}`);
  }

  const published = await api(page, nonce, `/wp-json/wp/v2/docs/${draft.id}`, {
    method: 'POST',
    body: { status: 'publish' },
  });

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
    score: finalScore,
    focus_chip_confirmed: rankMath.afterSave.focus_chip_detected,
    focus_visible: rankMath.afterSave.focus_visible,
    snippet_confirmed: rankMath.afterSave.snippet_visible,
    social_available: rankMath.openedSocial,
    rankMath,
    midias,
  }, null, 2));
  console.log(`PUBLICADO ${published.id} ${published.link} SCORE ${finalScore}`);
}

main().catch((error) => {
  console.error(`PUBLICACAO_INTERROMPIDA: ${error.stack || error.message}`);
  process.exitCode = 1;
});
