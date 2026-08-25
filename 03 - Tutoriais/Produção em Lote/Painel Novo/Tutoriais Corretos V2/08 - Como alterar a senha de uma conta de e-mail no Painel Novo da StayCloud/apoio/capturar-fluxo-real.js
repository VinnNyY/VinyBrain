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

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function strongPassword() {
  return `Tt-${crypto.randomBytes(18).toString('base64url')}9!`;
}

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

async function dismissOverlays(page) {
  await page.evaluate(() => {
    const selectors = [
      '[role="dialog"][aria-label*="Intercom"]',
      '.intercom-lightweight-app',
      '.intercom-app',
      'iframe[src*="intercom"]',
      'iframe[src*="crisp"]',
      'iframe[src*="tawk"]',
      'iframe[src*="zendesk"]',
      '.toast',
      '.bugbar',
      '.sc-side',
      '.sc-side-head',
      '.sc-side-msg',
      '[class*=bugbar]',
      '[class*=sc-side]',
    ];
    document.querySelectorAll(selectors.join(',')).forEach((el) => el.remove());
    [...document.querySelectorAll('body *')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const box = el.getBoundingClientRect();
      if (box.left > innerWidth - 260 && box.top > innerHeight - 180) {
        el.remove();
        return;
      }
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
  if (!/login|entrar|email|senha/i.test(await page.evaluate(() => document.body.innerText))) return 'sessao-reutilizada';

  await page.waitForSelector('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', { timeout: 30000 });
  await page.type('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="email"]', email, { delay: 10 });
  await page.type('input[type="password"], input[name="password"], input[autocomplete="current-password"]', password, { delay: 10 });
  await Promise.allSettled([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
  ]);
  await wait(3500);
  const body = await page.evaluate(() => document.body.innerText);
  if (/captcha|verifica|verification|código|codigo/i.test(body) && /login|entrar|senha/i.test(body)) {
    throw new Error('VERIFICACAO_MANUAL');
  }
  if (/login|entrar/i.test(body) && /senha/i.test(body)) {
    throw new Error('LOGIN_NAO_CONFIRMADO');
  }
  return 'novo-login';
}

async function rectForText(page, text, opts = {}) {
  return page.evaluate(({ text, opts }) => {
    const wanted = text.toLowerCase();
    const nodes = [...document.querySelectorAll('a, button, [role="button"], input, textarea, label, span, div')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const value = [
        el.innerText,
        el.textContent,
        el.getAttribute('aria-label'),
        el.getAttribute('title'),
        el.getAttribute('placeholder'),
        el.value,
      ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!value.includes(wanted)) return false;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
      if (opts.minWidth != null && r.width < opts.minWidth) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { text, opts });
}

async function rectForButton(page, text, opts = {}) {
  return page.evaluate(({ text, opts }) => {
    const wanted = text.toLowerCase();
    const nodes = [...document.querySelectorAll('button, a, [role="button"]')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const value = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
      if (value !== wanted && !value.includes(wanted)) return false;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
      if (opts.minWidth != null && r.width < opts.minWidth) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (Math.abs(ar.width - br.width) > 20) return ar.width - br.width;
      return ar.left - br.left;
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { text, opts });
}

async function clickText(page, text, opts = {}) {
  const ok = await page.evaluate(({ text, opts }) => {
    const wanted = text.toLowerCase();
    const nodes = [...document.querySelectorAll('a, button, [role="button"]')];
    const matches = nodes.filter((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const value = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const r = el.getBoundingClientRect();
      if (!value.includes(wanted) || r.width < 8 || r.height < 8) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
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

async function markAndSanitize(page, rect, label) {
  await page.evaluate(({ rect, label }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
    [...document.querySelectorAll('body *')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const box = el.getBoundingClientRect();
      if (box.left > innerWidth - 260 && box.top > innerHeight - 180) {
        el.remove();
        return;
      }
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

    const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const domainRe = /\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi;
    const ipRe = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const sensitiveWords = /(financeiro|suporte|contato|admin|administrador|vinicius|viny)/gi;
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
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'password') el.value = '';
      if (/email|user|usuario|domain|dominio|host|ip|name|nome/i.test([el.name, el.id, el.placeholder].filter(Boolean).join(' '))) {
        el.value = '';
      }
    });
    document.querySelectorAll('[title], [aria-label]').forEach((el) => {
      for (const attr of ['title', 'aria-label']) {
        const value = el.getAttribute(attr);
        if (!value) continue;
        el.setAttribute(attr, value.replace(emailRe, '[e-mail censurado]').replace(domainRe, '[dominio censurado]').replace(ipRe, '[IP censurado]'));
      }
    });

    const color = '#2563eb';
    if (label === 'Resetar senha') {
      const targetX = rect.x + rect.width / 2;
      const targetY = rect.y + rect.height / 2;
      const caption = document.createElement('div');
      caption.dataset.docMark = 'true';
      caption.style.cssText = [
        'position:absolute',
        `left:${Math.max(24, rect.x - 190)}px`,
        `top:${Math.max(24, rect.y - 4)}px`,
        'width:150px',
        'padding:8px 10px',
        'background:#fff',
        `border:2px solid ${color}`,
        'border-radius:6px',
        'box-shadow:0 12px 24px rgba(15,23,42,.18)',
        'color:#111827',
        'font:700 13px/1.25 Arial, sans-serif',
        'pointer-events:none',
        'z-index:2147483001',
      ].join(';');
      caption.textContent = label;

      document.body.append(caption);
      return;
    }

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
    const captionWidth = Math.min(280, Math.max(150, label.length * 7 + 28));
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
  await markAndSanitize(page, rect, label);
  await page.screenshot({ path: path.join(finalsDir, `${base}.png`), fullPage: false });
}

async function goEmailArea(page) {
  const clicked = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a, button, [role="button"]')];
    const target = links.find((el) => /e-?mails?|contas de e-?mail|email/i.test([el.innerText, el.textContent, el.getAttribute('href')].filter(Boolean).join(' ')));
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  });
  if (clicked) {
    await wait(2500);
    return;
  }
  const current = page.url();
  const match = current.match(/\/dashboard\/hospedagem\/(\d+)/);
  if (match) {
    await page.goto(`https://beta.staycloud.com/dashboard/hospedagem/${match[1]}/email`, { waitUntil: 'networkidle2' });
    await wait(2500);
    return;
  }
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem/8445/email', { waitUntil: 'networkidle2' });
  await wait(2500);
}

async function findDisposable(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const m = body.match(/\b(?:tutorial-teste|teste-tutorial)-[a-z0-9-]+(?=@)/i);
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
  const pw = strongPassword();
  const filled = await page.evaluate((pw) => {
    const fields = [...document.querySelectorAll('input[type="password"], input[name*="pass" i], input[id*="pass" i]')];
    fields.forEach((input) => {
      input.value = pw;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return fields.length;
  }, pw);
  if (!filled) throw new Error('CAMPO_SENHA_NAO_ENCONTRADO');
  await clickText(page, 'Criar conta');
  await wait(5000);
  return local;
}

async function clickPasswordAction(page, local) {
  const clicked = await page.evaluate((local) => {
    const rows = [...document.querySelectorAll('tr, li, .row, [class*="table"], [class*="card"], [class*="item"]')];
    const row = rows.find((el) => (el.innerText || '').toLowerCase().includes(local.toLowerCase()));
    const scope = row || document.body;
    const candidates = [...scope.querySelectorAll('button, a, [role="button"]')];
    const target = candidates.find((el) => /senha|alterar|editar|gerenciar|reset|redefinir/i.test([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ')));
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  }, local);
  if (clicked) {
    await wait(1800);
    const body = await page.evaluate(() => document.body.innerText);
    if (/senha|password|redefinir|alterar/i.test(body)) return true;
  }
  const menuClicked = await page.evaluate((local) => {
    const rows = [...document.querySelectorAll('tr, li, .row, [class*="table"], [class*="card"], [class*="item"]')];
    const row = rows.find((el) => (el.innerText || '').toLowerCase().includes(local.toLowerCase()));
    const scope = row || document.body;
    const candidates = [...scope.querySelectorAll('button, a, [role="button"]')];
    const target = candidates[candidates.length - 1];
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  }, local);
  if (!menuClicked) throw new Error('ACAO_SENHA_NAO_ENCONTRADA');
  await wait(1000);
  await clickText(page, 'senha').catch(async () => clickText(page, 'Editar'));
  await wait(1800);
  return true;
}

async function main() {
  const recaptureOnly = process.env.RECAPTURE_ONLY === '1';
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
  await dismissOverlays(page);
  await page.goto('https://beta.staycloud.com/dashboard/hospedagem', { waitUntil: 'networkidle2' }).catch(() => {});
  await wait(2500);
  await dismissOverlays(page);

  let rect = await rectForButton(page, 'Gerenciar', { minX: 760, minY: 220, maxWidth: 180 });
  if (!rect) throw new Error('BOTAO_GERENCIAR_NAO_ENCONTRADO');
  await savePair(page, 'passo-01-gerenciar-servico', rect, 'Gerenciar');
  await clickText(page, 'Gerenciar', { minX: 760, minY: 220 });
  await wait(3500);
  await dismissOverlays(page);

  await goEmailArea(page);
  await dismissOverlays(page);
  rect = await rectForText(page, 'E-mail', { minY: 120, maxWidth: 280 }) || await rectForText(page, 'Contas de e-mail', { maxWidth: 360 });
  if (!rect) throw new Error('AREA_EMAIL_NAO_ENCONTRADA');
  await savePair(page, 'passo-02-contas-email', rect, 'Contas de e-mail');

  let local = await findDisposable(page);
  let accountMode = 'reutilizada';
  if (!local) {
    if (recaptureOnly) {
      local = 'tutorial-teste';
    } else {
    local = await createDisposable(page);
    accountMode = 'criada';
    await wait(3000);
    }
  }
  await dismissOverlays(page);

  const rowHover = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('tr, li, .row, [class*="table"], [class*="card"], [class*="item"]')];
    const row = rows.find((el) => /tutorial-teste|teste-tutorial/i.test(el.innerText || '')) || rows.find((el) => /imap|smtp|pop3/i.test(el.innerText || ''));
    if (!row) return null;
    const r = row.getBoundingClientRect();
    return { x: r.right - 70, y: r.top + r.height / 2 };
  });
  if (rowHover) {
    await page.mouse.move(rowHover.x, rowHover.y);
    await wait(600);
  }
  rect = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button, a, [role="button"]')]
      .map((el) => {
        const value = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
          .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        const r = el.getBoundingClientRect();
        return { el, value, rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }, visible: r.width >= 20 && r.width <= 48 && r.height >= 20 && r.height <= 48 };
      })
      .filter((item) => item.visible && /resetar senha/i.test(item.value))
      .sort((a, b) => b.rect.y - a.rect.y);
    const target = buttons[0];
    if (!target) return null;
    target.el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = target.el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }) || await rectForButton(page, 'Alterar senha', { minX: 900, minY: 360, maxWidth: 190 });
  if (!rect) throw new Error('RETANGULO_ACAO_SENHA_NAO_ENCONTRADO');
  await savePair(page, 'passo-03-acao-alterar-senha', rect, 'Resetar senha');

  await clickText(page, 'Resetar senha', { minX: 900, minY: 360, minWidth: 90, maxWidth: 190 }).catch(async () => clickText(page, 'Alterar senha', { minX: 900, minY: 360, maxWidth: 190 }).catch(async () => clickPasswordAction(page, local)));
  await dismissOverlays(page);
  await wait(1000);
  rect = await page.evaluate(() => {
    const fields = [...document.querySelectorAll('input[type="password"], input[name*="pass" i], input[id*="pass" i], input[placeholder*="senha" i]')];
    const el = fields[0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  });
  if (!rect) throw new Error('CAMPO_NOVA_SENHA_NAO_ENCONTRADO');
  await savePair(page, 'passo-04-nova-senha', rect, 'Nova senha');

  if (recaptureOnly) {
    fs.writeFileSync(path.join(reportsDir, 'resultado-recaptura.json'), JSON.stringify({
      loginMode,
      accountMode,
      maskedAccount: `${local.slice(0, 15)}****@dominio-censurado`,
      recaptureOnly: true,
      finalPrints: fs.readdirSync(finalsDir).filter((f) => f.endsWith('.png')).sort(),
    }, null, 2));
    await browser.close();
    return;
  }

  const newPassword = strongPassword();
  await page.evaluate((pw) => {
    const fields = [...document.querySelectorAll('input[type="password"], input[name*="pass" i], input[id*="pass" i], input[placeholder*="senha" i]')];
    fields.forEach((input) => {
      input.value = pw;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }, newPassword);

  const saved = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('button, a, [role="button"]')];
    const target = candidates.find((el) => /salvar|confirmar|alterar|atualizar|redefinir/i.test([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ')));
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  });
  if (!saved) throw new Error('BOTAO_SALVAR_SENHA_NAO_ENCONTRADO');
  await wait(5000);
  await dismissOverlays(page);
  const successRect = await rectForText(page, 'sucesso', { maxWidth: 900 }) || await rectForText(page, 'alterada', { maxWidth: 900 }) || await rectForText(page, 'salva', { maxWidth: 900 });
  if (successRect) await savePair(page, 'passo-05-confirmacao', successRect, 'Senha alterada');

  const report = {
    loginMode,
    accountMode,
    maskedAccount: `${local.slice(0, 15)}****@dominio-censurado`,
    passwordChanged: true,
    finalPrints: fs.readdirSync(finalsDir).filter((f) => f.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'resultado-captura.json'), JSON.stringify(report, null, 2));
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
