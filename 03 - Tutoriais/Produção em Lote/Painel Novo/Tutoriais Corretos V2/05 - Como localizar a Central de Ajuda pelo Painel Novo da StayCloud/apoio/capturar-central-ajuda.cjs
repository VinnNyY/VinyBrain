const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const prompt = fs.readFileSync(promptPath, 'utf8');
const email = (prompt.match(/- Login do painel do cliente:\s*`([^`]*)`/) || [])[1];
const password = (prompt.match(/- Senha do painel do cliente:\s*`([^`]*)`/) || [])[1];

if (!email || !password) {
  throw new Error('Acesso de teste nao encontrado no prompt local.');
}

const tutorialRoot = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud';
const finalDir = path.join(tutorialRoot, 'prints-finais');
const oldDir = path.join(tutorialRoot, 'apoio', 'originais-e-versoes-antigas');
const reportsDir = path.join(tutorialRoot, 'apoio', 'relatorios');
fs.mkdirSync(finalDir, { recursive: true });
fs.mkdirSync(oldDir, { recursive: true });
fs.mkdirSync(reportsDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function login(page) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  const hasEmail = await page.$('input[type="email"], input[name="email"], input[autocomplete="email"]');
  if (!hasEmail) return;

  await page.type('input[type="email"], input[name="email"], input[autocomplete="email"]', email, { delay: 8 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 8 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await sleep(1400);
}

async function sanitize(page) {
  await page.evaluate(() => {
    const sensitivePatterns = [
      /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
      /\b\d{1,3}(?:\.\d{1,3}){3}\b/,
      /\b(?:cliente|client|id|servi[cç]o|service)\s*#?\s*\d+\b/i,
      /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/,
      /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    ];

    const blurElement = (el) => {
      el.style.filter = 'blur(7px)';
      el.style.userSelect = 'none';
    };

    const hideElement = (el) => {
      el.style.visibility = 'hidden';
    };

    document.querySelectorAll('button, div, section, aside').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isOverlay = style.position === 'fixed';
      const nearBottom = rect.bottom > window.innerHeight - 220;
      if (isOverlay && nearBottom && rect.height < 220) {
        hideElement(el);
      }
    });

    const replacements = [
      [/Legacy Doc/gi, 'Conta exemplo'],
      [/legacydoc\.com\.br/gi, 'site-exemplo.com.br'],
      [/srv\d+\.stayx\.cloud/gi, 'servico-exemplo.staycloud.local'],
      [/Bom dia,\s*Legacy\./gi, 'Bom dia.'],
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      node.nodeValue = value;
    });

    const hideClosestTextBlock = (pattern) => {
      Array.from(document.querySelectorAll('body *')).forEach((el) => {
        const ownText = Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.nodeValue)
          .join(' ')
          .trim();
        if (!pattern.test(ownText)) return;
        let target = el;
        while (target.parentElement) {
          const rect = target.getBoundingClientRect();
          if (rect.height > 40 && rect.height < 240) break;
          target = target.parentElement;
        }
        hideElement(target);
      });
    };

    hideClosestTextBlock(/quanto voc[eê] recomendaria/i);
    hideClosestTextBlock(/Ol[aá]\. Precisa de ajuda/i);

    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.placeholder && /pesquisar|buscar|search/i.test(el.placeholder)) return;
      el.value = '';
      el.placeholder = '';
    });

    document.querySelectorAll('img[alt*="avatar" i], [class*="avatar" i], [class*="profile" i]').forEach(blurElement);

    document.querySelectorAll('body *').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text || text.length > 160) return;
      if (sensitivePatterns.some((pattern) => pattern.test(text))) blurElement(el);
    });
  });
}

async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll('[data-tutorial-mark="true"]').forEach((el) => el.remove()));
}

async function markText(page, text, options = {}) {
  const ok = await page.evaluate(({ text, label, tagName, align }) => {
    const target = text.trim().replace(/\s+/g, ' ').toLowerCase();
    const candidates = Array.from(document.querySelectorAll(tagName || 'a,button,[role="button"],h1,h2,h3,input,[placeholder]'));
    const el = candidates.find((node) => {
      const nodeText = [
        node.textContent || '',
        node.getAttribute('aria-label') || '',
        node.getAttribute('placeholder') || '',
        node.getAttribute('title') || '',
      ].join(' ').trim().replace(/\s+/g, ' ').toLowerCase();
      return nodeText.includes(target);
    });
    if (!el) return false;

    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const color = '#ef4444';
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const outline = document.createElement('div');
    outline.dataset.tutorialMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${x - 5}px`,
      `top:${y - 5}px`,
      `width:${rect.width + 10}px`,
      `height:${rect.height + 10}px`,
      `border:3px solid ${color}`,
      'border-radius:8px',
      'box-shadow:0 0 0 4px rgba(239,68,68,.14)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');

    const dot = document.createElement('div');
    dot.dataset.tutorialMark = 'true';
    const dotX = align === 'left' ? x - 14 : x + rect.width - 12;
    const dotY = y - 14;
    dot.style.cssText = [
      'position:absolute',
      `left:${dotX}px`,
      `top:${dotY}px`,
      'width:24px',
      'height:24px',
      `background:${color}`,
      'border:2px solid white',
      'border-radius:999px',
      'box-shadow:0 6px 14px rgba(15,23,42,.24)',
      'pointer-events:none',
      'z-index:2147483001',
    ].join(';');

    const caption = document.createElement('div');
    caption.dataset.tutorialMark = 'true';
    const captionWidth = Math.min(260, Math.max(150, label.length * 7 + 28));
    const captionLeft = Math.min(window.scrollX + window.innerWidth - captionWidth - 24, x + rect.width + 18);
    const captionTop = Math.max(window.scrollY + 18, y + rect.height / 2 - 18);
    caption.style.cssText = [
      'position:absolute',
      `left:${captionLeft}px`,
      `top:${captionTop}px`,
      `width:${captionWidth}px`,
      'padding:7px 9px',
      'background:#fff',
      `border:1px solid ${color}`,
      'border-radius:6px',
      'box-shadow:0 10px 24px rgba(15,23,42,.18)',
      'color:#111827',
      'font:700 12px/1.25 Arial,sans-serif',
      'pointer-events:none',
      'z-index:2147483002',
    ].join(';');
    caption.textContent = label;

    document.body.append(outline, dot, caption);
    return true;
  }, { text, label: options.label || text, tagName: options.tagName || '', align: options.align || 'right' });

  if (!ok) {
    throw new Error(`Nao encontrei o alvo: ${text}`);
  }
}

async function screenshot(page, filename) {
  await sanitize(page);
  await page.screenshot({ path: path.join(finalDir, filename), fullPage: false });
}

async function getVisibleTexts(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('a,button,h1,h2,h3,input,[placeholder]'))
    .map((el) => ({
      tag: el.tagName,
      text: (el.textContent || el.getAttribute('placeholder') || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' '),
      href: el.href || el.getAttribute('href') || '',
    }))
    .filter((item) => item.text)
    .slice(0, 120));
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });

  const report = {
    captured_at: new Date().toISOString(),
    flow: [],
    observations: [],
  };

  await login(page);

  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await sleep(1200);
  await sanitize(page);
  await clearMarks(page);
  await markText(page, 'Suporte', { label: 'Menu Suporte', tagName: 'a,button,[role="button"]' });
  await screenshot(page, '01-menu-suporte-sanitizado.png');
  report.flow.push('Menu Suporte localizado no painel.');

  await page.goto('https://beta.staycloud.com/dashboard/suporte', { waitUntil: 'networkidle2' });
  await sleep(1200);
  await sanitize(page);
  const suporteTexts = await getVisibleTexts(page);
  report.support_page_elements = suporteTexts;
  await clearMarks(page);
  await markText(page, 'Central de ajuda', { label: 'Central de ajuda', tagName: 'a,button,[role="button"]' });
  await screenshot(page, '02-central-ajuda-sanitizado.png');
  report.flow.push('Opcao Central de ajuda localizada na area de Suporte.');

  const clicked = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('a,button,[role="button"]'));
    const el = nodes.find((node) => (node.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase().includes('central de ajuda'));
    if (!el) return { ok: false };
    const href = el.href || el.getAttribute('href') || '';
    el.click();
    return { ok: true, href };
  });
  report.central_help_click = clicked;
  if (!clicked.ok) throw new Error('Nao consegui clicar em Central de ajuda.');

  await sleep(2500);
  const pages = await browser.pages();
  const targetPage = pages.find((candidate) => candidate.url() !== page.url() && /ajuda|docs|staycloud/i.test(candidate.url())) || page;
  await targetPage.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
  await targetPage.bringToFront();
  await sleep(1200);
  await sanitize(targetPage);
  report.destination_url = targetPage.url();
  report.destination_title = await targetPage.title();
  report.destination_elements = await getVisibleTexts(targetPage);

  await clearMarks(targetPage);
  const searchTarget = await targetPage.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('input,[role="searchbox"],[placeholder],a,button,h1,h2,h3'));
    const tutorialSearch = nodes.find((el) => /buscar tutorial/i.test([
      el.getAttribute('placeholder'),
      el.getAttribute('aria-label'),
      el.getAttribute('title'),
      el.textContent,
    ].join(' ')));
    const match = tutorialSearch || nodes.find((el) => /pesquis|busc|search|procur|painel novo|documenta/i.test([
      el.getAttribute('placeholder'),
      el.getAttribute('aria-label'),
      el.getAttribute('title'),
      el.textContent,
    ].join(' ')));
    if (!match) return null;
    return {
      text: (match.getAttribute('placeholder') || match.getAttribute('aria-label') || match.textContent || '').trim().replace(/\s+/g, ' '),
      tag: match.tagName,
    };
  });

  if (searchTarget && /pesquis|busc|search|procur/i.test(searchTarget.text)) {
    await markText(targetPage, searchTarget.text, { label: 'Campo de pesquisa', tagName: 'input,[role="searchbox"],[placeholder],button,a' });
    report.flow.push('Base de Conhecimento aberta com campo de pesquisa disponivel.');
  } else if (searchTarget) {
    await markText(targetPage, searchTarget.text, { label: 'Área de tutoriais', tagName: 'a,button,h1,h2,h3' });
    report.flow.push('Base de Conhecimento aberta; destaque adaptado para a area de tutoriais.');
  } else {
    fs.writeFileSync(path.join(reportsDir, 'debug-destino-central-ajuda.json'), JSON.stringify({
      url: targetPage.url(),
      title: await targetPage.title(),
      elements: await getVisibleTexts(targetPage),
    }, null, 2));
    await markText(targetPage, 'Central de ajuda', { label: 'Central de ajuda', tagName: 'a,button,h1,h2,h3' });
    report.flow.push('Base de Conhecimento aberta; destaque adaptado para a area de categorias.');
  }

  await screenshot(targetPage, '03-base-conhecimento-sanitizado.png');

  fs.writeFileSync(path.join(reportsDir, 'captura-central-ajuda.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
