const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const invalidDir = path.join(__dirname, 'marcacoes-invalidas');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

for (const dir of [originalsDir, finalsDir, reportsDir, invalidDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function strongPassword() {
  return `Ct-${crypto.randomBytes(18).toString('base64url')}8!`;
}

function maskAccount(local = 'tutorial-cota') {
  return `${local.slice(0, 14)}****@dominio-censurado`;
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

async function findButtonRect(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"]')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      const r = el.getBoundingClientRect();
      if (!re.test(text) || r.width < 12 || r.height < 12) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function findTextRect(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"], span, div, label, input')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title'), el.getAttribute('placeholder')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      const r = el.getBoundingClientRect();
      if (!re.test(text) || r.width < 8 || r.height < 8) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function clickByPattern(page, pattern, opts = {}) {
  const ok = await page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"]')];
    const matches = nodes.filter((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      const r = el.getBoundingClientRect();
      if (!re.test(text) || r.width < 12 || r.height < 12) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.click();
    return true;
  }, { source: pattern.source, flags: pattern.flags, opts });
  if (!ok) throw new Error(`NAO_ENCONTREI_${pattern}`);
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
    const captionWidth = Math.min(260, Math.max(120, label.length * 7 + 28));
    let left = rect.x + rect.width + 14;
    if (left + captionWidth > scrollX + innerWidth - 24) left = rect.x - captionWidth - 14;
    left = Math.max(scrollX + 24, left);
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

async function findOrCreateTestAccount(page) {
  let local = await page.evaluate(() => {
    const preferred = document.body.innerText.match(/\btutorial-cota-[a-z0-9-]+(?=@)/i);
    if (preferred) return preferred[0];
    const any = document.body.innerText.match(/\b(?:tutorial-teste|teste-tutorial)-[a-z0-9-]+(?=@)/i);
    return any ? any[0] : '';
  });
  let accountMode = 'reutilizada';
  if (local) return { local, accountMode };

  local = `tutorial-cota-${stamp()}`;
  await clickByPattern(page, /Nova conta/i);
  await wait(1500);
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
  await clickByPattern(page, /Criar conta/i);
  await wait(5500);
  await dismissOverlays(page);
  return { local, accountMode: 'criada' };
}

async function rowInfo(page, local) {
  return page.evaluate((local) => {
    function clean(value) {
      return value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]').replace(/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br)\b/gi, '[dominio censurado]');
    }
    const all = [...document.querySelectorAll('tr, li, section, article, div')].filter((el) => (el.innerText || '').toLowerCase().includes(local.toLowerCase()));
    const row = all.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    })[0];
    if (!row) return null;
    row.setAttribute('data-test-mail-row', 'true');
    const r = row.getBoundingClientRect();
    const buttons = [...row.querySelectorAll('button, a, [role="button"]')].map((el, index) => {
      const br = el.getBoundingClientRect();
      return {
        index,
        label: clean([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()) || `[icone-${index}]`,
        rect: { x: br.left + scrollX, y: br.top + scrollY, width: br.width, height: br.height },
      };
    }).filter((item) => item.rect.width >= 12 && item.rect.height >= 12);
    return { rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }, text: clean(row.innerText || ''), buttons };
  }, local);
}

async function searchQuotaEverywhere(page) {
  return page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const foundText = /cota|quota|armazen|limite|espaço|espaco/i.test(text);
    const fields = [...document.querySelectorAll('input, select, [role="spinbutton"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const label = [el.name, el.id, el.placeholder, el.getAttribute('aria-label'), el.getAttribute('title'), el.value].filter(Boolean).join(' ');
      return { label, rect: { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height } };
    }).filter((f) => f.rect.width >= 30 && f.rect.height >= 16);
    const quotaField = fields.find((f) => /cota|quota|armazen|limite|espaço|espaco|mb|gb/i.test(f.label));
    return { foundText, fields, quotaField };
  });
}

async function probeQuotaActions(page, local) {
  const info = await rowInfo(page, local);
  if (!info) throw new Error('LINHA_CONTA_TESTE_NAO_ENCONTRADA');
  await page.mouse.move(info.rect.x + info.rect.width - 80, info.rect.y + info.rect.height / 2);
  await wait(900);
  const afterHover = await rowInfo(page, local);
  const labels = (afterHover?.buttons || []).map((b) => b.label);

  // Primeiro tenta clicar na própria linha, pois alguns painéis abrem detalhe lateral.
  await page.mouse.click(info.rect.x + Math.min(180, info.rect.width / 3), info.rect.y + info.rect.height / 2);
  await wait(1200);
  let quota = await searchQuotaEverywhere(page);
  if (quota.quotaField) return { available: true, mode: 'linha', quota, labels };
  await page.keyboard.press('Escape').catch(() => {});
  await wait(400);

  // Depois abre qualquer menu de mais opções da própria linha, se existir.
  const menuButton = (afterHover?.buttons || []).find((b) => /mais|opções|opcoes|menu|\[icone/i.test(b.label) && !/excluir|senha|webmail/i.test(b.label));
  if (menuButton) {
    await page.mouse.click(menuButton.rect.x + menuButton.rect.width / 2, menuButton.rect.y + menuButton.rect.height / 2);
    await wait(1000);
    const menuText = await page.evaluate(() => document.body.innerText.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]').slice(-1200));
    if (/cota|quota|armazen|limite|editar|gerenciar/i.test(menuText)) {
      const clicked = await page.evaluate(() => {
        const target = [...document.querySelectorAll('a, button, [role="menuitem"], [role="button"]')]
          .find((el) => /cota|quota|armazen|limite|editar|gerenciar/i.test([el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ')));
        if (!target) return false;
        target.click();
        return true;
      });
      if (clicked) {
        await wait(1200);
        quota = await searchQuotaEverywhere(page);
        if (quota.quotaField) return { available: true, mode: 'menu', quota, labels };
      }
    }
    await page.keyboard.press('Escape').catch(() => {});
  }

  // Finalmente tenta ações rotuladas como editar/gerenciar que não sejam senha, webmail ou excluir.
  for (const b of (afterHover?.buttons || [])) {
    if (!/editar|gerenciar|cota|quota|armazen|limite/i.test(b.label)) continue;
    if (/senha|reset|excluir|delete|webmail/i.test(b.label)) continue;
    await page.mouse.click(b.rect.x + b.rect.width / 2, b.rect.y + b.rect.height / 2);
    await wait(1300);
    quota = await searchQuotaEverywhere(page);
    if (quota.quotaField) return { available: true, mode: 'botao', quota, labels, actionRect: b.rect, actionLabel: b.label };
    await page.keyboard.press('Escape').catch(() => {});
    await wait(400);
  }

  return { available: false, labels, rowText: afterHover?.text || info.text };
}

async function captureWebmailFallback(page, local) {
  const info = await rowInfo(page, local);
  if (!info) throw new Error('LINHA_CONTA_TESTE_NAO_ENCONTRADA_WEBMAIL');
  const webmailButton = info.buttons.find((b) => /webmail/i.test(b.label));
  if (!webmailButton) throw new Error('BOTAO_WEBMAIL_NAO_ENCONTRADO');
  await savePair(page, 'passo-03-abrir-webmail', webmailButton.rect, 'Abrir Webmail');
  const pagesBefore = await page.browser().pages();
  await page.mouse.click(webmailButton.rect.x + webmailButton.rect.width / 2, webmailButton.rect.y + webmailButton.rect.height / 2);
  await wait(4500);
  const pagesAfter = await page.browser().pages();
  const newPage = pagesAfter.find((p) => !pagesBefore.includes(p)) || page;
  await newPage.bringToFront().catch(() => {});
  await dismissOverlays(newPage).catch(() => {});
  const privacy = await findButtonRect(newPage, /Salvar e Continuar|Save and Continue/i, { minY: 400, maxWidth: 260 }).catch(() => null);
  if (privacy) {
    await clickByPattern(newPage, /Salvar e Continuar|Save and Continue/i, { minY: 400, maxWidth: 260 }).catch(() => {});
    await wait(1800);
  }
  const rect = await findButtonRect(newPage, /^Abrir$/i, { minX: 10, minY: 250, maxWidth: 120 }) ||
    await findTextRect(newPage, /roundcube|Abrir sua caixa de entrada|Webmail/i, { maxWidth: 800 }) ||
    { x: 20, y: 90, width: 450, height: 220 };
  await savePair(newPage, 'passo-04-tela-webmail', rect, 'Abrir caixa');
}

async function main() {
  fs.rmSync(finalsDir, { recursive: true, force: true });
  fs.mkdirSync(finalsDir, { recursive: true });

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
  const gerenciarRect = await findButtonRect(page, /Gerenciar/i, { minX: 900, minY: 300, maxWidth: 180 });
  if (!gerenciarRect) throw new Error('BOTAO_GERENCIAR_NAO_ENCONTRADO');
  await savePair(page, 'passo-01-gerenciar-servico', gerenciarRect, 'Gerenciar');
  await clickByPattern(page, /Gerenciar/i, { minX: 900, minY: 300, maxWidth: 180 });
  await wait(3500);
  await dismissOverlays(page);

  const emailTabRect = await findButtonRect(page, /^E-mails/i, { minY: 160, maxWidth: 180 }) || await findTextRect(page, /^E-mails/i, { minY: 160, maxWidth: 180 });
  if (!emailTabRect) throw new Error('ABA_EMAILS_NAO_ENCONTRADA');
  await savePair(page, 'passo-02-area-e-mails', emailTabRect, 'E-mails');
  await clickByPattern(page, /^E-mails/i, { minY: 160, maxWidth: 180 }).catch(() => {});
  await wait(1500);
  await dismissOverlays(page);

  const { local, accountMode } = await findOrCreateTestAccount(page);
  const probe = await probeQuotaActions(page, local);
  const report = {
    loginMode,
    accountMode,
    maskedAccount: maskAccount(local),
    quotaProbe: probe.available ? 'localizado' : 'indisponivel',
    labelsFound: probe.labels || [],
  };

  if (probe.available && probe.quota.quotaField) {
    const field = probe.quota.quotaField;
    await savePair(page, 'passo-04-campo-cota', field.rect, 'Cota de armazenamento');
    report.quotaChanged = false;
    report.note = 'Campo localizado; alteração automática não executada por falta de seletor estável nesta execução.';
  } else {
    report.quotaChanged = false;
    report.fallback = 'webmail';
    await captureWebmailFallback(page, local);
  }

  report.finalPrints = fs.readdirSync(finalsDir).filter((f) => f.endsWith('.png')).sort();
  fs.writeFileSync(path.join(reportsDir, 'resultado-validacao-completa.json'), JSON.stringify(report, null, 2));
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
