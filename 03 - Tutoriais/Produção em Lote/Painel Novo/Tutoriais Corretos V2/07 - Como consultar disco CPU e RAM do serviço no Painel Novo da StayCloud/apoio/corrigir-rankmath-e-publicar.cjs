const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/07 - Como consultar disco CPU e RAM do serviço no Painel Novo da StayCloud';
const reportPath = path.join(root, 'apoio', 'publicacao-betterdocs.json');
const contentPath = path.join(root, '02 - COLAR NO WORDPRESS.txt');

const values = {
  id: 2865,
  title: 'DISCO, CPU E RAM NO PAINEL NOVO',
  slug: 'disco-cpu-ram-painel-novo-staycloud',
  focus: 'disco, CPU e RAM no Painel Novo StayCloud',
  seoTitle: 'Disco, CPU e RAM no Painel Novo StayCloud: como consultar',
  description: 'Aprenda a consultar disco, CPU e RAM no Painel Novo StayCloud, identificar o uso atual do serviço e evitar alterações desnecessárias.',
  excerpt: 'Veja onde consultar disco, CPU e RAM no Painel Novo StayCloud e como interpretar os indicadores básicos do serviço.',
  socialTitle: 'Disco, CPU e RAM no Painel Novo StayCloud',
  socialDescription: 'Confira onde ver os indicadores de disco, CPU e memória do serviço no Painel Novo StayCloud sem executar alterações.',
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
  const editUrl = `https://ajuda.staycloud.com.br/wp-admin/post.php?post=${values.id}&action=edit`;
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
}

async function getNonce(page) {
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

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureVisualEditor(page) {
  await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('button,a,[role="button"]')).find((el) => /Sair do editor de código/i.test(el.innerText || el.textContent || ''));
    if (item) item.click();
  });
  await wait(7500);
}

async function openRankMath(page) {
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button,[role="button"]'));
    const item = buttons.find((el) => (el.getAttribute('aria-label') || '').trim() === 'Rank Math')
      || buttons.find((el) => {
        const label = (el.innerText || el.textContent || '').trim();
        return /\b\d+\s*\/\s*100\b/.test(label) && /components-button/.test(String(el.className || ''));
      });
    if (item) item.click();
  });
  await wait(2200);
}

async function typeFocusKeyword(page) {
  const setWithApi = await page.evaluate((focus) => {
    const original = Array.from(document.querySelectorAll('input'))
      .find((input) => input.value?.startsWith('[{"value"') || input.placeholder === 'Exemplo: Rank Math SEO');
    if (original?._tagify) {
      original._tagify.removeAllTags();
      original._tagify.addTags([focus]);
      original.dispatchEvent(new Event('input', { bubbles: true }));
      original.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, values.focus);
  if (!setWithApi) {
    await page.evaluate(() => {
      const input = document.querySelector('.tagify__input');
      if (input) {
        input.focus();
        input.textContent = '';
      }
    });
    await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(values.focus, { delay: 8 });
    await page.keyboard.press('Enter');
  }
  await wait(2200);
}

async function openSnippet(page) {
  const clicked = await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('button,a,[role="button"]')).find((el) => /Editar fragmento de c[oó]digo|Editar fragmento|snippet/i.test(el.innerText || el.textContent || ''));
    if (!item) return false;
    item.click();
    return true;
  });
  await wait(1800);
  return clicked;
}

async function setInput(page, selector, value) {
  const ok = await page.evaluate(({ selector, value }) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    el.focus();
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { selector, value });
  if (!ok) throw new Error(`Campo nao encontrado: ${selector}`);
  await wait(900);
}

async function fillSnippet(page) {
  const opened = await openSnippet(page);
  if (!opened) throw new Error('Botao Editar fragmento de codigo nao encontrado.');
  await setInput(page, '#rank-math-editor-title', values.seoTitle);
  await setInput(page, '#rank-math-editor-permalink', values.slug);
  await setInput(page, '#rank-math-editor-description', values.description);
  return opened;
}

async function fillSocialIfVisible(page) {
  const opened = await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('button,a,[role="button"]')).find((el) => /^Social$/i.test((el.innerText || el.textContent || '').trim()));
    if (!item) return false;
    item.click();
    return true;
  });
  await wait(1600);
  if (!opened) return false;
  const fields = await page.evaluate(() => Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea')).map((el) => ({
    id: el.id || '',
    placeholder: el.getAttribute('placeholder') || '',
    nearby: (el.closest('label,div,section,aside')?.innerText || '').replace(/\s+/g, ' ').slice(0, 200),
  })));
  const titleField = fields.find((field) => /title|t[ií]tulo/i.test(`${field.id} ${field.placeholder} ${field.nearby}`));
  const descField = fields.find((field) => /description|descri/i.test(`${field.id} ${field.placeholder} ${field.nearby}`));
  const escapeId = (id) => id.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  if (titleField?.id) await setInput(page, `#${escapeId(titleField.id)}`, values.socialTitle).catch(() => {});
  if (descField?.id) await setInput(page, `#${escapeId(descField.id)}`, values.socialDescription).catch(() => {});
  return opened;
}

async function collectState(page) {
  return page.evaluate((values) => {
    const text = document.body.innerText;
    const scores = Array.from(text.matchAll(/\b(\d{1,3})\s*\/\s*100\b/g)).map((match) => Number(match[1])).filter((score) => score <= 100);
    const ownText = (el) => Array.from(el.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.nodeValue).join(' ').trim();
    const chip = Array.from(document.querySelectorAll('*')).some((el) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const className = String(el.className || '') + ' ' + String(el.parentElement?.className || '');
      return ownText(el) === values.focus && /tag|chip|token|keyword|pill|badge/i.test(className);
    });
    return {
      score: scores.length ? scores[0] : null,
      focus_visible: text.includes(values.focus),
      focus_chip_detected: chip,
      seo_title_visible: text.includes(values.seoTitle),
      slug_visible: text.includes(values.slug),
      description_visible: text.includes(values.description),
      social_visible: text.includes(values.socialTitle) || text.includes(values.socialDescription),
      lines: text.split('\n').filter((line) => /Rank Math|Palavra|Foco|Fragmento|Snippet|SEO|Social|Disco|CPU|RAM|Painel Novo|100|Descrição|Titulo|Título|Slug|erro/i.test(line)).slice(0, 120),
    };
  }, values);
}

async function saveDraft(page) {
  const saved = await page.evaluate(async () => {
    if (window.wp?.data?.dispatch) {
      await window.wp.data.dispatch('core/editor').savePost();
      return true;
    }
    return false;
  }).catch(() => false);
  if (!saved) {
    await page.evaluate(() => {
      const item = Array.from(document.querySelectorAll('button')).find((el) => /Salvar rascunho|Atualizar/i.test(el.innerText || el.textContent || el.getAttribute('aria-label') || ''));
      if (item) item.click();
    });
  }
  await wait(11000);
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1800,1200'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 1200, deviceScaleFactor: 1 });
  await login(page, prompt);
  const nonce = await getNonce(page);
  const rawContent = fs.readFileSync(contentPath, 'utf8');
  if (/src="prints-finais\//.test(rawContent)) throw new Error('Conteudo ainda contem caminho local de imagem.');
  await api(page, nonce, `/wp-json/wp/v2/docs/${values.id}`, {
    method: 'POST',
    body: {
      title: values.title,
      slug: values.slug,
      content: rawContent.replace(/^\s*<h1>.*?<\/h1>\s*/s, '').trim(),
      excerpt: values.excerpt,
      status: 'draft',
      meta: {
        rank_math_title: values.seoTitle,
        rank_math_description: values.description,
        rank_math_focus_keyword: values.focus,
        rank_math_facebook_title: values.socialTitle,
        rank_math_facebook_description: values.socialDescription,
        rank_math_twitter_title: values.socialTitle,
        rank_math_twitter_description: values.socialDescription,
      },
    },
  });
  await page.goto(`https://ajuda.staycloud.com.br/wp-admin/post.php?post=${values.id}&action=edit`, { waitUntil: 'networkidle2' });
  await wait(8000);
  await ensureVisualEditor(page);
  await openRankMath(page);
  const before = await collectState(page);
  await typeFocusKeyword(page);
  const snippetOpened = await fillSnippet(page);
  const socialOpened = await fillSocialIfVisible(page);
  await page.keyboard.press('Escape');
  await wait(1200);
  await page.screenshot({ path: path.join(root, 'apoio', 'rankmath-filled-before-save.png'), fullPage: true });
  await saveDraft(page);
  await openRankMath(page);
  const afterSave = await collectState(page);
  await page.screenshot({ path: path.join(root, 'apoio', 'rankmath-filled-after-save.png'), fullPage: true });

  const midias = JSON.parse(fs.readFileSync(path.join(root, 'apoio', 'midias-publicas.json'), 'utf8')).midias;
  const gate = {
    score_ok: afterSave.score !== null && afterSave.score >= 80,
    focus_ok: afterSave.focus_chip_detected || afterSave.focus_visible,
    snippet_ok: afterSave.seo_title_visible || afterSave.description_visible,
  };
  if (!gate.score_ok || !gate.focus_ok || !gate.snippet_ok) {
    fs.writeFileSync(reportPath, JSON.stringify({
      status: 'rascunho_bloqueado',
      blocked_at: new Date().toISOString(),
      id: values.id,
      edit_url: `https://ajuda.staycloud.com.br/wp-admin/post.php?post=${values.id}&action=edit`,
      link: `https://ajuda.staycloud.com.br/?post_type=docs&p=${values.id}`,
      before,
      afterSave,
      gate,
      snippetOpened,
      socialOpened,
      midias,
    }, null, 2));
    await browser.close();
    throw new Error(`Gate Rank Math bloqueou a publicacao. score=${afterSave.score}, focus=${gate.focus_ok}, snippet=${gate.snippet_ok}`);
  }

  const published = await api(page, nonce, `/wp-json/wp/v2/docs/${values.id}`, { method: 'POST', body: { status: 'publish' } });
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'publicado',
    published_at: new Date().toISOString(),
    id: published.id,
    edit_url: `https://ajuda.staycloud.com.br/wp-admin/post.php?post=${published.id}&action=edit`,
    link: published.link,
    slug: published.slug,
    score: afterSave.score,
    focus_chip_confirmed: afterSave.focus_chip_detected,
    focus_visible: afterSave.focus_visible,
    snippet_confirmed: gate.snippet_ok,
    social_available: socialOpened,
    before,
    afterSave,
    midias,
  }, null, 2));
  await browser.close();
  console.log(`PUBLICADO ${published.id} ${published.link} SCORE ${afterSave.score}`);
}

main().catch((error) => {
  console.error(`CORRECAO_PUBLICACAO_INTERROMPIDA: ${error.stack || error.message}`);
  process.exitCode = 1;
});
