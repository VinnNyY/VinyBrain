const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(root, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const zipPath = path.join(__dirname, 'projeto-teste-src', 'tutorial-deploy-teste.zip');

for (const dir of [originalsDir, finalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function sanitizeText(value) {
  return (value || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br|app|dev|cloud)\b/gi, '[dominio censurado]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]')
    .replace(/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/(--api-url\s+)(["']?)[^\s"']+/gi, '$1[URL_DA_API]')
    .replace(/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]')
    .replace(/Legacy Doc/gi, '[dado censurado]');
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
    ].join(',')).forEach((el) => el.remove());
    [...document.querySelectorAll('div, section, aside')].forEach((el) => {
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const r = el.getBoundingClientRect();
      if (/Em uma escala de 0 a 10|quanto você recomendaria|Olá\. Precisa de ajuda/i.test(text) && r.width > 180 && r.height > 40) el.remove();
    });
  }).catch(() => {});
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

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|net|org|br|app|dev|cloud)\b/gi, '[dominio censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]'],
      [/(--api-url\s+)(["']?)[^\s"']+/gi, '$1[URL_DA_API]'],
      [/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1[TOKEN_CENSURADO]'],
      [/(vinicius|viny|admin|financeiro|suporte|contato|legacy doc|legacy)/gi, '[dado censurado]'],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue || '';
      for (const [re, replacement] of replacements) value = value.replace(re, replacement);
      node.nodeValue = value;
    });
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'password') el.value = '';
      if (/email|user|usuario|domain|dominio|host|ip|name|nome|repo|token|key|secret/i.test([el.name, el.id, el.placeholder].filter(Boolean).join(' '))) el.value = '';
    });
  });
}

async function rectFor(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const nodes = [...document.querySelectorAll('a, button, [role="button"], [role="tab"], label, span, div, h1, h2, h3, p, code, pre')];
    const matches = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 8 || r.height < 8) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxX != null && r.left > opts.maxX) return false;
      if (opts.maxY != null && r.top > opts.maxY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      if (opts.maxHeight != null && r.height > opts.maxHeight) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (opts.smallest) return (ar.width * ar.height) - (br.width * br.height);
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[opts.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function mark(page, rect) {
  await page.evaluate(({ rect }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
    const outline = document.createElement('div');
    outline.dataset.docMark = 'true';
    outline.style.cssText = [
      'position:absolute',
      `left:${rect.x - 5}px`,
      `top:${rect.y - 5}px`,
      `width:${rect.width + 10}px`,
      `height:${rect.height + 10}px`,
      'border:3px solid #2563eb',
      'border-radius:8px',
      'box-shadow:0 0 0 4px rgba(37,99,235,.12)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect });
}

async function savePair(page, name, rect) {
  await dismissOverlays(page);
  await sanitizeDom(page);
  await page.screenshot({ path: path.join(originalsDir, `${name}-original.png`), fullPage: false });
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${name}.png`), fullPage: false });
}

async function collect(page) {
  return page.evaluate(() => {
    const buttons = [...document.querySelectorAll('a, button, [role="button"], label')].map((el) => {
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return { text, x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter((item) => item.text && item.width >= 8 && item.height >= 8);
    const inputs = [...document.querySelectorAll('input')].map((el) => ({
      type: el.type,
      accept: el.accept,
      name: el.name,
      id: el.id,
    }));
    const body = document.body.innerText.replace(/\s+/g, ' ');
    return { url: location.href, title: document.title, body, buttons, inputs };
  });
}

async function clickText(page, pattern, opts = {}) {
  return page.evaluate(({ source, flags, opts }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('a, button, [role="button"], label')].filter((el) => {
      const r = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || r.width < 10 || r.height < 10) return false;
      if (opts.minX != null && r.left < opts.minX) return false;
      if (opts.minY != null && r.top < opts.minY) return false;
      if (opts.maxWidth != null && r.width > opts.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = candidates[opts.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.click();
    return true;
  }, { source: pattern.source, flags: pattern.flags, opts });
}

async function uploadZip(page) {
  const input = await page.$('input[type="file"]');
  if (!input) throw new Error('INPUT_ZIP_NAO_ENCONTRADO');
  await input.uploadFile(zipPath);
  await wait(2500);
}

async function fillProjectName(page) {
  const handles = await page.$$('input:not([type="file"])');
  const input = handles[handles.length - 1];
  if (!input) throw new Error('CAMPO_NOME_PROJETO_NAO_ENCONTRADO');
  await input.click({ clickCount: 3 });
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('tutorial-deploy-teste', { delay: 12 });
  await wait(1000);
}

async function prepareZipForm(page) {
  await page.goto('https://beta.staycloud.com/dashboard/cloud/novo', { waitUntil: 'networkidle2' });
  await wait(2000);
  await uploadZip(page);
  await fillProjectName(page);
}

async function findPublicUrl(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const urls = text.match(/https?:\/\/[^\s"')]+/g) || [];
    return urls.find((url) => !/beta\.staycloud\.com\/dashboard/i.test(url)) || '';
  });
}

async function main() {
  if (!fs.existsSync(zipPath)) throw new Error('ZIP_NAO_ENCONTRADO');

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
  page.setDefaultTimeout(45000);
  const networkEvents = [];
  const consoleEvents = [];
  page.on('console', (message) => {
    const text = sanitizeText(message.text());
    if (/cloud|deploy|upload|project|projeto|erro|error|fail/i.test(text)) {
      consoleEvents.push({ type: message.type(), text: text.slice(0, 1000) });
    }
  });
  page.on('response', async (response) => {
    const request = response.request();
    const method = request.method();
    const url = response.url();
    if (!/cloud|deploy|project|projeto|upload|api/i.test(url) && method === 'GET') return;
    if (/\.(?:png|jpg|jpeg|webp|svg|css|js|woff2?)(?:\?|$)/i.test(url)) return;
    const event = {
      method,
      status: response.status(),
      url: sanitizeText(url),
    };
    if (method !== 'GET' || response.status() >= 400) {
      try {
        event.body = sanitizeText((await response.text()).slice(0, 1500));
      } catch (_) {
        event.body = '';
      }
    }
    networkEvents.push(event);
  });
  const loginMode = await login(page, email, password);

  await page.goto('https://beta.staycloud.com/dashboard/cloud/novo', { waitUntil: 'networkidle2' });
  await wait(2500);
  const beforeUpload = await collect(page);
  const billingRisk = /confirmar (?:compra|contrata[çc][aã]o|pagamento)|contratar plano|checkout|cart[aã]o de cr[eé]dito|plano pago|gerar cobran[çc]a/i.test(beforeUpload.body);
  if (billingRisk) throw new Error('RISCO_COBRANCA_DETECTADO_ANTES_DO_UPLOAD');

  const startRect = await rectFor(page, /Upload de \.zip|selecionar arquivo \.zip/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true });
  await savePair(page, '01-iniciar-deploy-sanitizado', startRect || { x: 475, y: 515, width: 310, height: 150 });

  await uploadZip(page);
  await fillProjectName(page);
  const afterUpload = await collect(page);
  const uploadRect = await rectFor(page, /NOME DO PROJETO|tutorial-deploy-teste/i, { minX: 950, minY: 360, maxWidth: 430, smallest: true }) ||
    await rectFor(page, /tutorial-deploy-teste\.zip|\.zip selecionado|arquivo/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true }) ||
    await rectFor(page, /Deploy|Publicar|Enviar|Criar/i, { minX: 260, minY: 120, maxWidth: 320, smallest: true });
  await savePair(page, '02-informar-projeto-sanitizado', uploadRect || { x: 475, y: 515, width: 310, height: 150 });

  const deployRect = await rectFor(page, /criar e implantar/i, { minX: 950, minY: 500, maxWidth: 430, smallest: true }) ||
    await rectFor(page, /criar e implantar|Deploy|Publicar|Enviar|Criar projeto|Iniciar/i, { minX: 260, minY: 120, maxWidth: 420, smallest: true }) ||
    await rectFor(page, /Build|Processando|Pendente|Criando|Publicando/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true });
  await savePair(page, '03-executar-deploy-sanitizado', deployRect || { x: 1001, y: 602, width: 376, height: 36 });

  if (process.env.CAPTURE_ONLY_FORM === '1') {
    fs.writeFileSync(path.join(reportsDir, 'captura-formulario-primeiro-deploy.json'), JSON.stringify({
      data: new Date().toISOString(),
      loginMode,
      status: 'captura_formulario_sem_criar_novo_deploy',
      printsFinais: fs.readdirSync(finalsDir).filter((file) => file.endsWith('.png')).sort(),
    }, null, 2));
    await browser.close();
    return;
  }

  await prepareZipForm(page);
  const cleanDeployRect = await rectFor(page, /criar e implantar/i, { minX: 950, minY: 500, maxWidth: 430, smallest: true });
  let deployClicked = false;
  if (cleanDeployRect) {
    await page.mouse.click(cleanDeployRect.x + cleanDeployRect.width / 2, cleanDeployRect.y + cleanDeployRect.height / 2);
    deployClicked = true;
  } else {
    deployClicked = await clickText(page, /criar e implantar|Deploy|Publicar|Enviar|Criar projeto|Iniciar/i, { minX: 260, minY: 120, maxWidth: 420 });
  }
  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
    wait(7000),
  ]);
  const afterDeployClick = await collect(page);
  const confirmRisk = /confirmar (?:compra|contrata[çc][aã]o|pagamento)|contratar plano|checkout|cart[aã]o de cr[eé]dito|plano pago|gerar cobran[çc]a/i.test(afterDeployClick.body);
  if (confirmRisk) throw new Error('RISCO_COBRANCA_APOS_CLIQUE_DEPLOY');

  let processingState = afterDeployClick;
  let successState = afterDeployClick;
  for (let i = 0; i < 24; i += 1) {
    await wait(5000);
    processingState = await collect(page);
    if (/build|processando|criando|publicando|deployando|fila|pending|building/i.test(processingState.body)) {
      successState = processingState;
      break;
    }
    if (/sucesso|conclu[ií]do|no ar|online|published|ready|ativo|deploy conclu/i.test(processingState.body)) {
      successState = processingState;
      break;
    }
  }
  const processingRect = await rectFor(page, /Build|Processando|Criando|Publicando|Pendente|Status|Deploy/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true }) ||
    await rectFor(page, /No ar|Online|Sucesso|Conclu/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true });
  await savePair(page, '04-processamento-sanitizado', processingRect || { x: 475, y: 260, width: 420, height: 90 });

  for (let i = 0; i < 36; i += 1) {
    await wait(5000);
    successState = await collect(page);
    if (/sucesso|conclu[ií]do|no ar|online|published|ready|ativo|deploy conclu/i.test(successState.body)) break;
  }
  const successRect = await rectFor(page, /Sucesso|Conclu[ií]do|No ar|Online|Ready|URL|Abrir|Visitar|Ativo/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true }) ||
    await rectFor(page, /tutorial-deploy-teste/i, { minX: 260, minY: 120, maxWidth: 900, smallest: true });
  await savePair(page, '05-concluido-sanitizado', successRect || { x: 475, y: 260, width: 420, height: 90 });

  let publicUrl = await findPublicUrl(page);
  let appState = null;
  if (!publicUrl) {
    const clickedOpen = await clickText(page, /Abrir|Visitar|Acessar|Ver app|Visualizar/i, { minX: 260, minY: 120, maxWidth: 260 });
    if (clickedOpen) {
      await wait(3000);
      publicUrl = page.url().includes('/dashboard/') ? '' : page.url();
    }
  }
  if (publicUrl && !/dashboard/i.test(publicUrl)) {
    const appPage = await browser.newPage();
    await appPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await appPage.goto(publicUrl, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
    await wait(1500);
    appState = await collect(appPage);
    const appRect = await rectFor(appPage, /Tutorial Deploy Teste|ambiente de demonstração/i, { maxWidth: 900, smallest: true });
    await savePair(appPage, '06-aplicacao-publicada-sanitizado', appRect || { x: 280, y: 220, width: 780, height: 220 });
    await appPage.close();
  }

  const report = {
    data: new Date().toISOString(),
    loginMode,
    zipPath,
    billingRiskBeforeUpload: billingRisk,
    deployClicked,
    beforeUpload: {
      url: beforeUpload.url,
      bodySample: sanitizeText(beforeUpload.body.slice(0, 5000)),
      buttons: beforeUpload.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
      inputs: beforeUpload.inputs,
    },
    afterUpload: {
      url: afterUpload.url,
      bodySample: sanitizeText(afterUpload.body.slice(0, 5000)),
      buttons: afterUpload.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    afterDeployClick: {
      url: afterDeployClick.url,
      bodySample: sanitizeText(afterDeployClick.body.slice(0, 7000)),
      buttons: afterDeployClick.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    successState: {
      url: successState.url,
      bodySample: sanitizeText(successState.body.slice(0, 9000)),
      buttons: successState.buttons.map((item) => ({ ...item, text: sanitizeText(item.text) })),
    },
    publicUrl: sanitizeText(publicUrl),
    networkEvents: networkEvents.slice(-40),
    consoleEvents: consoleEvents.slice(-40),
    appState: appState ? {
      url: sanitizeText(appState.url),
      bodySample: sanitizeText(appState.body.slice(0, 2000)),
    } : null,
    printsFinais: fs.readdirSync(finalsDir).filter((file) => file.endsWith('.png')).sort(),
  };
  fs.writeFileSync(path.join(reportsDir, 'deploy-zip-real.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(`ERRO_DEPLOY_ZIP: ${error.message}`);
  process.exit(1);
});
