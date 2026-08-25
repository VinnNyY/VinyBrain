const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud';
const contentPath = path.join(root, '02 - COLAR NO WORDPRESS.txt');
const reportPath = path.join(root, 'apoio', 'publicacao-betterdocs.json');

const payload = {
  title: 'CENTRAL DE AJUDA STAYCLOUD',
  slug: 'central-de-ajuda-staycloud',
  excerpt: 'Acesse a Central de Ajuda StayCloud pelo Painel Novo e encontre tutoriais para solucionar dúvidas sobre sua conta e seus serviços.',
  seoTitle: 'Central de Ajuda StayCloud: acesse pelo Painel Novo',
  metaDescription: 'Veja como localizar a Central de Ajuda StayCloud pelo Painel Novo, pesquisar tutoriais e encontrar orientações para sua conta e serviços com segurança.',
  focusKeyword: 'Central de Ajuda StayCloud',
  categoryName: 'Painel novo',
  tags: ['Central de Ajuda', 'Painel Novo', 'Suporte', 'StayCloud', 'Base de Conhecimento'],
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
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    }
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
  return api(page, nonce, `/wp-json/wp/v2/${taxonomy}`, {
    method: 'POST',
    body: { name },
  });
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const rawContent = fs.readFileSync(contentPath, 'utf8');
  if (/src="prints-finais\//.test(rawContent)) {
    throw new Error('Conteudo ainda contem caminho local de imagem.');
  }
  const content = rawContent.replace(/^\s*<h1>.*?<\/h1>\s*/s, '').trim();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await login(page, prompt);
  const nonce = await getNonce(page);

  const existing = await api(page, nonce, `/wp-json/wp/v2/docs?slug=${encodeURIComponent(payload.slug)}&status=publish,draft,pending,private,future&context=edit`);
  if (existing.length) {
    throw new Error(`Ja existe documento com o slug ${payload.slug}: id ${existing[0].id}`);
  }

  const taxonomies = await api(page, nonce, '/wp-json/wp/v2/taxonomies?type=docs&context=edit');
  const taxonomyKeys = Object.keys(taxonomies);
  const categoryTaxonomy = taxonomyKeys.find((key) => /doc.*cat|category|categoria/i.test(key));
  const tagTaxonomy = taxonomyKeys.find((key) => /doc.*tag|tag/i.test(key));

  const body = {
    title: payload.title,
    slug: payload.slug,
    content,
    excerpt: payload.excerpt,
    status: 'publish',
    meta: {
      rank_math_title: payload.seoTitle,
      rank_math_description: payload.metaDescription,
      rank_math_focus_keyword: payload.focusKeyword,
      rank_math_facebook_title: payload.seoTitle,
      rank_math_facebook_description: payload.metaDescription,
      rank_math_twitter_title: payload.seoTitle,
      rank_math_twitter_description: payload.metaDescription,
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

  const post = await api(page, nonce, '/wp-json/wp/v2/docs', {
    method: 'POST',
    body,
  });

  await browser.close();
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'publicado',
    published_at: new Date().toISOString(),
    id: post.id,
    link: post.link,
    slug: post.slug,
    category_taxonomy: categoryTaxonomy || null,
    category_id: category?.id || null,
    tag_taxonomy: tagTaxonomy || null,
    tag_ids: tags.map((tag) => tag.id),
    rank_math_meta_sent: true,
  }, null, 2));
  console.log(`PUBLICADO ${post.id} ${post.link}`);
}

main().catch((error) => {
  console.error(`PUBLICACAO_INTERROMPIDA: ${error.message}`);
  process.exitCode = 1;
});
