const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/06 - Como usar a busca geral do Painel Novo da StayCloud';
const finalDir = path.join(root, 'prints-finais');
const reportsDir = path.join(root, 'apoio', 'relatorios');

fs.mkdirSync(finalDir, { recursive: true });
fs.mkdirSync(reportsDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readAccess() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const email = (prompt.match(/- Login do painel do cliente:\s*`([^`]*)`/) || [])[1];
  const password = (prompt.match(/- Senha do painel do cliente:\s*`([^`]*)`/) || [])[1];
  if (!email || !password) throw new Error('Acesso de teste nao encontrado no prompt local.');
  return { email, password };
}

async function login(page) {
  const { email, password } = readAccess();
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  if (!(await page.$('input[type="email"], input[name="email"], input[autocomplete="email"]'))) return;
  await page.type('input[type="email"], input[name="email"], input[autocomplete="email"]', email, { delay: 8 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 8 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
  ]);
  await sleep(1500);
}

async function sanitize(page) {
  await page.evaluate(() => {
    const replacements = [
      [/legacydoc\.com\.br/gi, 'site-exemplo.com.br'],
      [/Legacy Doc/gi, 'Conta exemplo'],
      [/Legacy/gi, 'Cliente exemplo'],
      [/srv\d+\.stayx\.cloud/gi, 'servico-exemplo.staycloud.local'],
      [/#[0-9]{3,}/g, '#0000'],
      [/\bR\$\s?[\d.,]+/g, 'R$ 00,00'],
    ];

    const sensitivePatterns = [
      /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
      /\b\d{1,3}(?:\.\d{1,3}){3}\b/,
      /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/,
      /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
      /\b(?:fatura|chamado|ticket|cliente|servi[cç]o|service|id)\s*#?\s*\d+\b/i,
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      node.nodeValue = value;
    });

    const blur = (el) => {
      el.style.filter = 'blur(7px)';
      el.style.userSelect = 'none';
    };

    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.placeholder && /buscar|pesquisar|search/i.test(el.placeholder)) return;
      if (el.value && sensitivePatterns.some((pattern) => pattern.test(el.value))) el.value = '';
    });

    document.querySelectorAll('img[alt*="avatar" i], [class*="avatar" i], [class*="profile" i]').forEach(blur);

    document.querySelectorAll('body *').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text || text.length > 180) return;
      if (sensitivePatterns.some((pattern) => pattern.test(text))) blur(el);
    });

    Array.from(document.querySelectorAll('body *')).forEach((el) => {
      const text = (el.textContent || '').trim();
      if (/quanto voc[eê] recomendaria|Ol[aá]\. Precisa de ajuda/i.test(text)) {
        el.style.visibility = 'hidden';
      }
    });

    const launcher = document.querySelector('[aria-label*="Precisa de ajuda" i]') || document.querySelector('[class*="chat" i]');
    if (launcher) launcher.style.visibility = 'hidden';

    document.querySelectorAll('body *').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const floatingBottom = ['fixed', 'sticky'].includes(style.position) && rect.top > window.innerHeight - 150;
      const tutorialOverlay = rect.top > window.innerHeight - 90 && rect.height < 70 && rect.width < 650;
      if (floatingBottom || tutorialOverlay) el.style.visibility = 'hidden';
    });
  });
}

async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll('[data-tutorial-mark="true"]').forEach((el) => el.remove()));
}

async function markElement(page, finder, label, align = 'right') {
  const ok = await page.evaluate(({ finder, label, align }) => {
    const normalized = finder.trim().toLowerCase();
    let el = null;
    if (finder.startsWith('selector:')) {
      el = document.querySelector(finder.replace(/^selector:/, ''));
    }
    const candidates = Array.from(document.querySelectorAll('button, a, input, [role="button"], [cmdk-input], [placeholder], [role="option"], [cmdk-item], li, div'));
    if (!el) el = candidates.find((node) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const text = [
        node.getAttribute('placeholder') || '',
        node.getAttribute('aria-label') || '',
        node.getAttribute('title') || '',
        node.textContent || '',
        node.value || '',
      ].join(' ').trim().toLowerCase();
      return text.includes(normalized);
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
    dot.style.cssText = [
      'position:absolute',
      `left:${dotX}px`,
      `top:${y - 14}px`,
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
    const captionWidth = Math.min(280, Math.max(150, label.length * 7 + 28));
    const captionLeft = Math.min(window.scrollX + window.innerWidth - captionWidth - 24, x + rect.width + 18);
    caption.style.cssText = [
      'position:absolute',
      `left:${captionLeft}px`,
      `top:${Math.max(window.scrollY + 18, y + rect.height / 2 - 18)}px`,
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
  }, { finder, label, align });
  if (!ok) throw new Error(`Alvo nao encontrado para marcacao: ${finder}`);
}

async function openSearch(page) {
  const opened = await page.evaluate(() => {
    const directTrigger = document.querySelector('button[aria-label*="Buscar site" i]');
    if (directTrigger) {
      directTrigger.click();
      return true;
    }
    const visibleInput = Array.from(document.querySelectorAll('input')).find((el) => {
      const rect = el.getBoundingClientRect();
      const text = `${el.placeholder || ''} ${el.getAttribute('aria-label') || ''}`;
      return rect.width > 0 && rect.height > 0 && /buscar|site|dom/i.test(text);
    });
    if (visibleInput) {
      visibleInput.focus();
      return true;
    }
    const trigger = Array.from(document.querySelectorAll('button, [role="button"], input, div')).find((el) => {
      const rect = el.getBoundingClientRect();
      const text = `${el.textContent || ''} ${el.placeholder || ''} ${el.getAttribute('aria-label') || ''}`;
      return rect.width > 0 && rect.height > 0 && /Buscar site, domínio, fatura ou chamado/i.test(text);
    });
    if (trigger) {
      trigger.click();
      return true;
    }
    return false;
  });
  if (!opened) throw new Error('Busca geral nao abriu.');
  await sleep(1000);
}

async function typeSearch(page, term) {
  await page.evaluate(() => {
    const input = Array.from(document.querySelectorAll('input')).find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (input) {
      input.focus();
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');
  await page.keyboard.type(term, { delay: 20 });
  await sleep(1600);
}

async function visibleSearchData(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    return Array.from(document.querySelectorAll('input, button, a, [role="option"], [cmdk-item], li, div'))
      .filter(visible)
      .map((el) => ({
        tag: el.tagName,
        role: el.getAttribute('role') || '',
        placeholder: el.getAttribute('placeholder') || '',
        text: (el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 180),
        href: el.href || el.getAttribute('href') || '',
      }))
      .filter((item) => item.text || item.placeholder)
      .slice(0, 160);
  });
}

async function screenshot(page, filename) {
  await sanitize(page);
  await page.screenshot({ path: path.join(finalDir, filename), fullPage: false });
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
    observations: [],
    queries: [],
  };

  await login(page);
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await sleep(1200);
  await sanitize(page);
  await clearMarks(page);
  await markElement(page, 'selector:button[aria-label*="Buscar site" i]', 'Busca geral');
  await screenshot(page, '01-barra-busca-geral-sanitizado.png');
  report.observations.push('Barra superior identificada com o texto "Buscar site, domínio, fatura ou chamado..." e atalho Cmd/Ctrl+K.');

  await openSearch(page);
  await typeSearch(page, 'site');
  await sanitize(page);
  report.queries.push({ term: 'site', visible: await visibleSearchData(page) });
  await clearMarks(page);
  const resultSelector = await page.evaluate(() => {
    document.querySelectorAll('[data-busca-result-demo="true"]').forEach((el) => el.removeAttribute('data-busca-result-demo'));
    const candidates = Array.from(document.querySelectorAll('a, button, [role="option"], [cmdk-item], li, div')).filter((el) => {
      const rect = el.getBoundingClientRect();
      const text = (el.textContent || '').trim();
      if (text.length > 90) return false;
      return rect.top > 150 && rect.top < 260 && rect.left > 450 && rect.right < 1160 && rect.width > 240 && rect.height > 28 && /Meus sites/i.test(text);
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    });
    if (!candidates.length) return '';
    candidates[0].setAttribute('data-busca-result-demo', 'true');
    return '[data-busca-result-demo="true"]';
  });
  await markElement(page, resultSelector ? `selector:${resultSelector}` : 'site', 'Resultados da busca', 'left');
  await screenshot(page, '02-resultados-busca-geral-sanitizado.png');

  const resultText = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('a, button, [role="option"], [cmdk-item], li, div')).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 80 && rect.height > 20 && /site|dom[ií]nio|fatura|chamado|resultado/i.test(el.textContent || '');
    });
    return (candidates[0]?.textContent || 'resultado').trim().replace(/\s+/g, ' ').slice(0, 80);
  });
  await clearMarks(page);
  await markElement(page, 'selector:[data-busca-result-demo="true"]', 'Resultado correto', 'left');
  await screenshot(page, '03-resultado-correto-busca-sanitizado.png');
  report.observations.push(`Resultado usado para demonstracao: ${resultText || 'resultado sanitizado'}. Nenhuma alteracao foi executada.`);

  await openSearch(page);
  for (const term of ['domínio', 'fatura', 'chamado']) {
    await typeSearch(page, term);
    await sanitize(page);
    report.queries.push({ term, visible: await visibleSearchData(page) });
  }

  fs.writeFileSync(path.join(reportsDir, 'captura-busca-geral.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log('CAPTURA_CONCLUIDA');
}

run().catch((error) => {
  console.error(`CAPTURA_INTERROMPIDA: ${error.stack || error.message}`);
  process.exitCode = 1;
});
