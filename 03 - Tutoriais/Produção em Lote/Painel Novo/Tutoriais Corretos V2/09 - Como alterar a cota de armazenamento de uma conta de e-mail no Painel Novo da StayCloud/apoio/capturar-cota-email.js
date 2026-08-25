const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

for (const dir of [originalsDir, finalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function strongPassword() {
  return `Tt-${crypto.randomBytes(18).toString('base64url')}9!`;
}

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function maskAccount(local = 'tutorial-teste') {
  return `${local.slice(0, 15)}****@dominio-censurado`;
}

function printSafe(message, data = {}) {
  console.log(JSON.stringify({ message, ...data }, null, 2));
}

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll([
      '.intercom-lightweight-app',
      '.intercom-app',
      'iframe[src*="intercom"]',
      'iframe[src*="crisp"]',
      'iframe[src*="tawk"]',
      '.toast',
      '[class*=bugbar]',
      '[class*=sc-side]',
    ].join(',')).forEach((el) => el.remove());
    [...document.querySelectorAll('body *')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const box = el.getBoundingClientRect();
      if (box.left > innerWidth - 280 && box.top > innerHeight - 210) el.remove();
      if (/Em uma escala de 0 a 10|quanto você recomendaria|Olá\. Precisa de ajuda/i.test(text)) {
        let target = el;
        while (target.parentElement && !['BODY', 'HTML'].includes(target.parentElement.tagName)) {
          const style = getComputedStyle(target);
          if (style.position === 'fixed' || style.position === 'sticky') break;
          target = target.parentElement;
        }
        target.remove();
      }
    });
  });
}

async function login(page, email, password) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await wait(1200);
  const text = await page.evaluate(() => document.body.innerText);
  if (!/login|entrar|email|senha/i.test(text)) return 'sessao-reutilizada';

  await page.waitForSelector('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', { timeout: 30000 });
  await page.type('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', email, { delay: 8 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 8 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
  ]);
  await wait(3000);
  const body = await page.evaluate(() => document.body.innerText);
  if (/captcha|verifica|verification|código|codigo/i.test(body) && /login|entrar|senha/i.test(body)) throw new Error('VERIFICACAO_MANUAL');
  if (/login|entrar/i.test(body) && /senha/i.test(body)) throw new Error('LOGIN_NAO_CONFIRMADO');
  return 'novo-login';
}

async function visibleRect(page, selectorOrMatcher) {
  return page.evaluate((selectorOrMatcher) => {
    let el = null;
    if (selectorOrMatcher.startsWith('text:')) {
      const wanted = selectorOrMatcher.slice(5).toLowerCase();
      el = [...document.querySelectorAll('a, button, [role="button"], span, div, input, label')]
        .filter((node) => {
          if (!(node instanceof HTMLElement)) return false;
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
          const value = [node.innerText, node.textContent, node.getAttribute('aria-label'), node.getAttribute('title'), node.getAttribute('placeholder')]
            .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const r = node.getBoundingClientRect();
          return value.includes(wanted) && r.width >= 8 && r.height >= 8;
        })
        .sort((a, b) => {
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          return (ar.top - br.top) || (ar.left - br.left);
        })[0] || null;
    } else {
      el = document.querySelector(selectorOrMatcher);
    }
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, selectorOrMatcher);
}

async function clickText(page, text, opts = {}) {
  const ok = await page.evaluate(({ text, opts }) => {
    const wanted = text.toLowerCase();
    const nodes = [...document.querySelectorAll('a, button, [role="button"]')];
    const matches = nodes.filter((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const value = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const r = el.getBoundingClientRect();
      if (!value.includes(wanted) || r.width < 8 || r.height < 8) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    });
    const el = matches[opts.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.click();
    return true;
  }, { text, opts });
  if (!ok) throw new Error(`NAO_ENCONTREI_${text}`);
}

async function goEmailArea(page) {
  const clicked = await page.evaluate(() => {
    const target = [...document.querySelectorAll('a, button, [role="button"]')]
      .find((el) => /e-?mails?|contas de e-?mail|email/i.test([el.innerText, el.textContent, el.getAttribute('href')].filter(Boolean).join(' ')));
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  });
  if (!clicked) {
    const match = page.url().match(/\/dashboard\/hospedagem\/(\d+)/);
    await page.goto(`https://beta.staycloud.com/dashboard/hospedagem/${match ? match[1] : '8445'}/email`, { waitUntil: 'networkidle2' });
  }
  await wait(3000);
  await dismissOverlays(page);
}

async function sanitizeAndMark(page, rect, label) {
  await page.evaluate(({ rect, label }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
    const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const domainRe = /\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi;
    const ipRe = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const sensitiveWords = /(financeiro|suporte|contato|admin|administrador|vinicius|viny|legacy doc)/gi;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      value = value.replace(emailRe, '[e-mail censurado]');
      value = value.replace(domainRe, '[dominio censurado]');
      value = value.replace(ipRe, '[IP censurado]');
      value = value.replace(sensitiveWords, '[dado censurado]');
      node.nodeValue = value;
    });
    document.querySelectorAll('[title], [aria-label]').forEach((el) => {
      for (const attr of ['title', 'aria-label']) {
        const value = el.getAttribute(attr);
        if (!value) continue;
        el.setAttribute(attr, value.replace(emailRe, '[e-mail censurado]').replace(domainRe, '[dominio censurado]').replace(ipRe, '[IP censurado]'));
      }
    });
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'password') el.value = '';
      if (/email|user|usuario|domain|dominio|host|ip|name|nome/i.test([el.name, el.id, el.placeholder].filter(Boolean).join(' '))) el.value = '';
    });

    const color = '#2563eb';
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${rect.x - 5}px`,
      `top:${rect.y - 5}px`,
      `width:${rect.width + 10}px`,
      `height:${rect.height + 10}px`,
      `border:3px solid ${color}`,
      'border-radius:8px',
      'box-shadow:0 0 0 4px rgba(37,99,235,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    const caption = document.createElement('div');
    caption.dataset.docMark = 'true';
    const captionWidth = Math.min(260, Math.max(130, label.length * 7 + 28));
    const rightSpace = scrollX + innerWidth - (rect.x + rect.width) - 24;
    const leftSpace = rect.x - scrollX - 24;
    let left = rightSpace > captionWidth + 16 ? rect.x + rect.width + 14 : rect.x - captionWidth - 14;
    if (rightSpace <= captionWidth + 16 && leftSpace <= captionWidth + 16) {
      left = Math.max(scrollX + 24, Math.min(scrollX + innerWidth - captionWidth - 24, rect.x));
    }
    const top = Math.max(scrollY + 22, rect.y + Math.max(0, (rect.height - 34) / 2));
    caption.style.cssText = [
      'position:absolute',
      `left:${left}px`,
      `top:${top}px`,
      `width:${captionWidth}px`,
      'padding:8px 10px',
      'background:#fff',
      `border:1px solid ${color}`,
      'border-radius:6px',
      'box-shadow:0 12px 24px rgba(15,23,42,.16)',
      'color:#111827',
      'font:700 13px/1.25 Arial, sans-serif',
      'pointer-events:none',
      'z-index:2147483001',
    ].join(';');
    caption.textContent = label;
    document.body.append(outline, caption);
  }, { rect, label });
}

async function savePair(page, base, rect, label) {
  await page.screenshot({ path: path.join(originalsDir, `${base}-original.png`), fullPage: false });
  await sanitizeAndMark(page, rect, label);
  await page.screenshot({ path: path.join(finalsDir, `${base}.png`), fullPage: false });
}

async function findDisposableLocal(page) {
  return page.evaluate(() => {
    const m = document.body.innerText.match(/\b(?:tutorial-teste|teste-tutorial)-[a-z0-9-]+(?=@)/i);
    return m ? m[0] : '';
  });
}

async function createDisposable(page) {
  const local = `tutorial-teste-${stamp()}`;
  await clickText(page, 'Nova conta');
  await wait(1500);
  await page.waitForSelector('input[name="user"], input[placeholder*="usu"], input[placeholder*="email"], input[type="text"]', { timeout: 20000 });
  const userSelector = await page.evaluate(() => {
    const el = document.querySelector('input[name="user"]') || [...document.querySelectorAll('input')].find((input) => /usu|email|conta/i.test([input.name, input.id, input.placeholder].filter(Boolean).join(' ')));
    if (!el) return '';
    el.setAttribute('data-codex-user-field', 'true');
    return '[data-codex-user-field="true"]';
  });
  if (!userSelector) throw new Error('CAMPO_USUARIO_NAO_ENCONTRADO');
  await page.click(userSelector, { clickCount: 3 });
  await page.type(userSelector, local, { delay: 8 });
  const password = strongPassword();
  const filled = await page.evaluate((password) => {
    const fields = [...document.querySelectorAll('input[type="password"], input[name*="pass" i], input[id*="pass" i], input[placeholder*="senha" i]')];
    fields.forEach((input) => {
      input.value = password;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return fields.length;
  }, password);
  if (!filled) throw new Error('CAMPO_SENHA_NAO_ENCONTRADO');
  await clickText(page, 'Criar conta');
  await wait(5500);
  await dismissOverlays(page);
  return local;
}

async function getDisposableRowInfo(page, local) {
  return page.evaluate((local) => {
    const rows = [...document.querySelectorAll('tr, li, .row, [class*="table"], [class*="card"], [class*="item"], div')];
    const row = rows.find((el) => (el.innerText || '').toLowerCase().includes(local.toLowerCase()));
    if (!row) return null;
    const r = row.getBoundingClientRect();
    const buttons = [...row.querySelectorAll('button, a, [role="button"]')].map((el, index) => {
      const br = el.getBoundingClientRect();
      return {
        index,
        label: [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
          .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'),
        rect: { x: br.left + scrollX, y: br.top + scrollY, width: br.width, height: br.height },
        html: el.outerHTML.slice(0, 260).replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'),
      };
    }).filter((item) => item.rect.width >= 16 && item.rect.height >= 16);
    return { rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }, buttons };
  }, local);
}

async function clickQuotaAction(page, local) {
  const result = await page.evaluate((local) => {
    const rows = [...document.querySelectorAll('tr, li, .row, [class*="table"], [class*="card"], [class*="item"], div')];
    const row = rows.find((el) => (el.innerText || '').toLowerCase().includes(local.toLowerCase()));
    if (!row) return { clicked: false, reason: 'linha-nao-encontrada' };
    const buttons = [...row.querySelectorAll('button, a, [role="button"]')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width >= 16 && r.height >= 16;
    });
    const labeled = buttons.find((el) => /cota|quota|armazen|limite|editar/i.test([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ')));
    const target = labeled;
    if (!target) return { clicked: false, reason: 'acao-rotulada-nao-encontrada' };
    target.setAttribute('data-quota-target', 'true');
    target.scrollIntoView({ block: 'center', inline: 'center' });
    const r = target.getBoundingClientRect();
    target.click();
    return {
      clicked: true,
      label: [target.innerText, target.textContent, target.getAttribute('aria-label'), target.getAttribute('title')].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
      rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height },
    };
  }, local);
  await wait(1200);
  return result;
}

async function findQuotaField(page) {
  return page.evaluate(() => {
    const labels = [...document.querySelectorAll('label, div, span, p')].filter((el) => /cota|quota|armazen|limite|espaço|espaco/i.test(el.innerText || ''));
    const inputs = [...document.querySelectorAll('input, select, [role="spinbutton"]')].filter((el) => {
      const value = [el.name, el.id, el.placeholder, el.getAttribute('aria-label'), el.getAttribute('title'), el.value].filter(Boolean).join(' ');
      const near = labels.some((label) => {
        const lr = label.getBoundingClientRect();
        const ir = el.getBoundingClientRect();
        return Math.abs(lr.top - ir.top) < 90 || (lr.top < ir.top && ir.top - lr.top < 140);
      });
      const r = el.getBoundingClientRect();
      return r.width >= 40 && r.height >= 18 && (/cota|quota|armazen|limite|espaço|espaco|mb|gb/i.test(value) || near);
    });
    const el = inputs[0];
    if (!el) return null;
    el.setAttribute('data-quota-field', 'true');
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return {
      selector: '[data-quota-field="true"]',
      before: el.value || '',
      tag: el.tagName,
      type: el.getAttribute('type') || '',
      rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height },
    };
  });
}

async function setQuotaAndSave(page, field) {
  const safeValue = '512';
  await page.evaluate((selector, safeValue) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.focus();
    if (el.tagName === 'SELECT') {
      const option = [...el.options].find((opt) => /512/i.test(opt.textContent) || /512/i.test(opt.value)) || [...el.options].find((opt) => /1\s*gb|1024/i.test(opt.textContent) || /1024/i.test(opt.value));
      if (option) el.value = option.value;
    } else {
      el.value = safeValue;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, field.selector, safeValue);
  await wait(700);
  const saved = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('button, a, [role="button"]')].filter((el) => {
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ');
      const r = el.getBoundingClientRect();
      return r.width >= 20 && r.height >= 20 && /salvar|atualizar|confirmar|alterar|save|update/i.test(text);
    });
    const target = candidates.find((el) => !/senha|password/i.test([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' '))) || candidates[0];
    if (!target) return null;
    target.setAttribute('data-save-target', 'true');
    const r = target.getBoundingClientRect();
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return {
      label: [target.innerText, target.textContent, target.getAttribute('aria-label'), target.getAttribute('title')].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
      rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height },
    };
  });
  await wait(4500);
  return { safeValue, saved };
}

async function main() {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  if (!email || !password) throw new Error('CREDENCIAIS_NAO_ENCONTRADAS');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(35000);

  const loginMode = await login(page, email, password);
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2' }).catch(() => {});
  await wait(2500);
  await dismissOverlays(page);
  const gerenciarRect = await visibleRect(page, 'text:Gerenciar');
  if (!gerenciarRect) throw new Error('BOTAO_GERENCIAR_NAO_ENCONTRADO');
  await savePair(page, 'passo-01-gerenciar-servico', gerenciarRect, 'Gerenciar');
  await clickText(page, 'Gerenciar');
  await wait(3500);
  await dismissOverlays(page);

  await goEmailArea(page);
  const emailRect = await visibleRect(page, 'text:E-mails');
  if (!emailRect) throw new Error('AREA_EMAIL_NAO_ENCONTRADA');
  await savePair(page, 'passo-02-area-e-mails', emailRect, 'E-mails');
  let local = await findDisposableLocal(page);
  let accountMode = 'reutilizada';
  if (!local) {
    local = await createDisposable(page);
    accountMode = 'criada';
    await wait(2500);
  }

  const infoBefore = await getDisposableRowInfo(page, local);
  printSafe('conta-descartavel-localizada', {
    loginMode,
    maskedAccount: maskAccount(local),
    accountMode,
    buttonLabels: (infoBefore?.buttons || []).map((b) => b.label || `[icone-${b.index}]`),
  });

  const clickResult = await clickQuotaAction(page, local);
  if (!clickResult.clicked) throw new Error(`ACAO_COTA_NAO_ENCONTRADA:${clickResult.reason}`);
  await savePair(page, 'passo-03-editar-cota', clickResult.rect, clickResult.label || 'Editar cota');

  const field = await findQuotaField(page);
  if (!field) {
    const body = await page.evaluate(() => document.body.innerText.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]').slice(0, 1200));
    fs.writeFileSync(path.join(reportsDir, 'recurso-indisponivel.txt'), body);
    throw new Error('CAMPO_COTA_NAO_ENCONTRADO');
  }
  await savePair(page, 'passo-04-campo-cota', field.rect, 'Cota de armazenamento');

  const { safeValue, saved } = await setQuotaAndSave(page, field);
  let successRect = await visibleRect(page, 'text:sucesso') || await visibleRect(page, 'text:atualizado') || await visibleRect(page, 'text:salvo');
  if (!successRect && saved?.rect) successRect = saved.rect;
  if (successRect) await savePair(page, 'passo-05-salvar-cota', successRect, saved?.label || 'Salvar alteração');

  const report = {
    loginMode,
    maskedAccount: maskAccount(local),
    accountMode,
    featureAvailable: true,
    quotaPreviousRaw: field.before ? '[valor anterior capturado]' : '[valor anterior vazio ou nao exibido]',
    quotaFinalGeneric: `${safeValue} MB`,
    actionLabel: clickResult.label || 'acao por icone',
    saveLabel: saved?.label || 'salvar',
    finalPrints: fs.readdirSync(finalsDir).filter((f) => f.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'resultado-cota.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((error) => {
  if (error && error.message === 'VERIFICACAO_MANUAL') {
    console.error('Aguardando verificação manual na janela já aberta.');
  } else {
    console.error(`ERRO_FLUXO_REAL: ${error.message}`);
  }
  process.exit(1);
});
