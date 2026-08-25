const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const reportPath = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud/apoio/correcao-rankmath.json';

const values = {
  focus: 'Central de Ajuda StayCloud',
  title: 'Central de Ajuda StayCloud: como acessar pelo Painel Novo',
  slug: 'central-de-ajuda-staycloud',
  description: 'Aprenda a localizar a Central de Ajuda StayCloud pelo Painel Novo, pesquisar tutoriais e encontrar rapidamente orientações para sua conta e serviços.',
  excerpt: 'Acesse a Central de Ajuda StayCloud pelo Painel Novo e encontre tutoriais para solucionar dúvidas sobre sua conta e seus serviços.',
  socialTitle: 'Central de Ajuda StayCloud pelo Painel Novo',
  socialDescription: 'Veja como acessar a Central de Ajuda StayCloud, pesquisar tutoriais e encontrar orientações para sua conta e serviços.',
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
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
}

async function clickByText(page, pattern, selector = 'button, a, [role="button"]') {
  const clicked = await page.evaluate(({ pattern, selector }) => {
    const re = new RegExp(pattern, 'i');
    const items = Array.from(document.querySelectorAll(selector));
    const el = items.find((node) => re.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (!el) return false;
    el.click();
    return true;
  }, { pattern, selector });
  if (!clicked) throw new Error(`Nao encontrei botao/link: ${pattern}`);
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

async function getScore(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const matches = Array.from(text.matchAll(/\b(\d{1,3})\s*\/\s*100\b/g)).map((match) => Number(match[1]));
    return matches.length ? Math.max(...matches) : null;
  });
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
      const containerText = [
        label?.innerText,
        el.getAttribute('aria-label'),
        el.getAttribute('placeholder'),
        el.closest('label')?.innerText,
        el.parentElement?.innerText,
        el.closest('[class*="field"], [class*="input"], [class*="form"], [class*="snippet"], [class*="keyword"]')?.innerText,
      ].filter(Boolean).join(' ');
      return { el, haystack: norm(containerText) };
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
  if (!ok) throw new Error(`Campo nao encontrado: ${labels.join(' | ')}`);
  if (options.enter) await page.keyboard.press('Enter');
  await new Promise((resolve) => setTimeout(resolve, options.wait || 1200));
}

async function collectRankMathState(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const fields = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, [contenteditable="true"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        tag: el.tagName,
        id: el.id || '',
        name: el.getAttribute('name') || '',
        aria: el.getAttribute('aria-label') || '',
        placeholder: el.getAttribute('placeholder') || '',
        className: String(el.className || '').slice(0, 120),
        value: (el.value || el.innerText || '').trim().slice(0, 220),
        nearby: (el.closest('label, div, section')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 300),
      };
    }).filter(Boolean).filter((item) => /rank|math|seo|keyword|palavra|focus|titulo|title|description|descricao|fragment|snippet|permalink|slug|social|facebook|twitter/i.test(Object.values(item).join(' ')));
    return {
      score: (() => {
        const matches = Array.from(text.matchAll(/\b(\d{1,3})\s*\/\s*100\b/g)).map((match) => Number(match[1]));
        return matches.length ? Math.max(...matches) : null;
      })(),
      hasFocusText: text.includes('Central de Ajuda StayCloud'),
      hasFocusChipLike: Array.from(document.querySelectorAll('*')).some((el) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        const className = String(el.className || '');
        const own = Array.from(el.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.nodeValue).join(' ').trim();
        return own === 'Central de Ajuda StayCloud' && /tag|chip|token|keyword|pill|badge/i.test(className + ' ' + (el.parentElement?.className || ''));
      }),
      snippets: {
        title: text.includes(values.title),
        slug: text.includes(values.slug),
        description: text.includes(values.description),
        socialTitle: text.includes(values.socialTitle),
        socialDescription: text.includes(values.socialDescription),
      },
      fields,
      relevantText: text.split('\n').filter((line) => /Rank Math|Palavra|Foco|Fragmento|Snippet|SEO|Social|Central de Ajuda|100|Descrição|Titulo|Título|Slug/i.test(line)).slice(0, 160),
    };
  });
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
  await login(page, prompt);
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const scoreBefore = await getScore(page);
  await clickByText(page, 'Rank Math', 'button[aria-label="Rank Math"], button, a, [role="button"]');
  await page.screenshot({ path: '/tmp/rankmath-panel-before.png', fullPage: true });
  let beforePanel = await collectRankMathState(page);

  try {
    await setFieldByLabels(page, ['Palavra-chave de foco', 'focus keyword', 'keyword'], values.focus, { enter: true, wait: 2500 });
  } catch (error) {
    beforePanel.focusError = error.message;
  }

  const clickedSnippet = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const el = candidates.find((node) => /Editar Fragmento|Editar.*snippet|Edit Snippet|Fragmento de codigo|Fragmento de código/i.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (!el) return false;
    el.click();
    return true;
  });
  await new Promise((resolve) => setTimeout(resolve, 1800));

  if (clickedSnippet) {
    await setFieldByLabels(page, ['Título', 'SEO Title', 'title'], values.title);
    await setFieldByLabels(page, ['Link Permanente', 'Permalink', 'Slug'], values.slug);
    await setFieldByLabels(page, ['Descrição', 'Description', 'Meta Description'], values.description);
  }

  // BetterDocs summary is already present, but force-save it through the REST store if available.
  await page.evaluate((excerpt) => {
    if (window.wp?.data?.dispatch) {
      window.wp.data.dispatch('core/editor')?.editPost?.({ excerpt });
    }
  }, values.excerpt);

  const openedSocial = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const el = candidates.find((node) => /^Social$/i.test((node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim()));
    if (!el) return false;
    el.click();
    return true;
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  let socialAvailable = openedSocial;
  if (openedSocial) {
    try {
      await setFieldByLabels(page, ['Título', 'Facebook Title', 'Título do Facebook', 'Twitter Title'], values.socialTitle);
      await setFieldByLabels(page, ['Descrição', 'Facebook Description', 'Descrição do Facebook', 'Twitter Description'], values.socialDescription);
    } catch {
      socialAvailable = false;
    }
  }

  await page.screenshot({ path: '/tmp/rankmath-panel-filled.png', fullPage: true });
  const afterFill = await collectRankMathState(page);

  const updated = await page.evaluate(async () => {
    if (window.wp?.data?.dispatch && window.wp?.data?.select) {
      await window.wp.data.dispatch('core/editor').savePost();
      return true;
    }
    return false;
  });
  await new Promise((resolve) => setTimeout(resolve, 9000));
  const afterSave = await collectRankMathState(page);
  await page.screenshot({ path: '/tmp/rankmath-panel-after-save.png', fullPage: true });

  fs.writeFileSync(reportPath, JSON.stringify({
    corrected_at: new Date().toISOString(),
    post_id: 2843,
    score_before: scoreBefore,
    score_after_fill: afterFill.score,
    score_after_save: afterSave.score,
    updated,
    clicked_snippet: clickedSnippet,
    social_available: socialAvailable,
    beforePanel,
    afterFill,
    afterSave,
    values,
  }, null, 2));
  await browser.close();
  console.log(reportPath);
}

main().catch((error) => {
  console.error(`CORRECAO_INTERROMPIDA: ${error.stack || error.message}`);
  process.exitCode = 1;
});
