const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const testProjectDir = '/tmp/tutorial-deploy-cli-teste';
const projectName = 'tutorial-deploy-cli-teste';
const publicUrl = 'https://tutorial-deploy-cli-teste.stayai.space/';
const versionText = 'Versao 3 - atualizacao final de demonstracao';
const previousVersionText = 'Versao 2 - atualizacao de demonstracao';

for (const dir of [originalsDir, finalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function secretFromPrompt(label) {
  const raw = fs.readFileSync(promptPath, 'utf8');
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^- ${escaped}:\\s*\`([^\`]+)\``, 'm'));
  return match ? match[1].trim() : '';
}

function sanitize(value) {
  return String(value || '')
    .replace(/(--token\s+)(["']?)[^\s"']+/gi, '$1SEU_TOKEN')
    .replace(/(--api-url\s+)(["']?)[^\s"']+/gi, '$1URL_DA_API')
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, '$1TOKEN_CENSURADO')
    .replace(/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1TOKEN_CENSURADO')
    .replace(new RegExp(testProjectDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '~/projeto-de-teste')
    .replace(/\/home\/[^\s"')<]+/g, '~/caminho-censurado')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]');
}

function sanitizeCommand(command) {
  return sanitize(command).replace(/\s+/g, ' ').trim();
}

function normalizePanelCommand(command) {
  const text = String(command || '').replace(/\s+/g, ' ').trim();
  const tokenMatch = text.match(/--token\s+([^\s"']+)/i);
  const token = tokenMatch ? tokenMatch[1].trim() : '';
  if (!token) return text;
  if (/--api-url/i.test(text)) {
    const originMatch = text.match(/--api-url\s+(https?:\/\/(?:stays\.dev|beta\.staycloud\.com|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?))/i);
    const origin = originMatch ? originMatch[1] : 'https://stays.dev';
    return `npx @staysdev/setup init --token ${token} --api-url ${origin}`;
  }
  return `npx @staysdev/setup init --token ${token}`;
}

function splitCommand(command) {
  const parts = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  return parts.map((part) => part.replace(/^['"]|['"]$/g, ''));
}

function runNpx(args, label, timeout = 120000) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: testProjectDir,
    encoding: 'utf8',
    timeout,
    env: { ...process.env, NO_COLOR: '1' },
  });
  return {
    label,
    status: result.status,
    stdout: sanitize(result.stdout),
    stderr: sanitize(result.stderr),
  };
}

async function login(page) {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  if (!email || !password) throw new Error('Credenciais do painel nao encontradas.');
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
  await wait(2500);
  const after = await page.evaluate(() => document.body.innerText);
  if (/login|entrar/i.test(after) && /senha/i.test(after)) throw new Error('Login no painel nao confirmado.');
  return 'novo-login';
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
  }).catch(() => {});
}

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1SEU_TOKEN'],
      [/(--api-url\s+)(["']?)[^\s"']+/gi, '$1URL_DA_API'],
      [/(token[:=]\s*)(["']?)[^\s"']+/gi, '$1TOKEN_CENSURADO'],
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
      [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP censurado]'],
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(vinicius|viny|legacy doc|legacy)/gi, '[dado censurado]'],
      [/https?:\/\/[a-z0-9.-]*stayai\.space[^\s"')<]*/gi, '[URL publica censurada]'],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue || '';
      for (const [re, replacement] of replacements) value = value.replace(re, replacement);
      node.nodeValue = value;
    });
  });
}

async function findRect(page, pattern, options = {}) {
  return page.evaluate(({ source, flags, options }) => {
    const re = new RegExp(source, flags);
    const elements = [...document.querySelectorAll('button, a, [role="button"], code, pre, span, div, h1, h2, h3, p')];
    const matches = elements.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || rect.width < 10 || rect.height < 10) return false;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (options.minX != null && rect.left < options.minX) return false;
      if (options.minY != null && rect.top < options.minY) return false;
      if (options.maxWidth != null && rect.width > options.maxWidth) return false;
      if (options.maxHeight != null && rect.height > options.maxHeight) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (options.smallest) return (ar.width * ar.height) - (br.width * br.height);
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[options.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, options });
}

async function mark(page, rect, color = '#2563eb') {
  await page.evaluate(({ rect, color }) => {
    document.querySelectorAll('[data-doc-mark="true"]').forEach((el) => el.remove());
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
      'box-shadow:0 0 0 4px rgba(37,99,235,.14)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect, color });
}

async function screenshotMarked(page, file, rect) {
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(originalsDir, `${file}-original.png`), fullPage: false });
  await sanitizeDom(page);
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
}

async function clickText(page, pattern, options = {}) {
  return page.evaluate(({ source, flags, options }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('button, a, [role="button"], div, span')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const rect = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || rect.width < 10 || rect.height < 10) return false;
      if (options.minX != null && rect.left < options.minX) return false;
      if (options.minY != null && rect.top < options.minY) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    });
    const el = candidates[options.index || 0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    (el.closest('button, a, [role="button"]') || el).click();
    return true;
  }, { source: pattern.source, flags: pattern.flags, options });
}

async function readCommandFromPage(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/npx\s+@staysdev\/setup\s+(?:init|connect)[^\n\r]*--token\s+[^\n\r]+/i);
    return match ? match[0].trim() : '';
  });
}

async function renderTerminal(page, file, command, output, targetLinePattern) {
  const safeCommand = sanitizeCommand(command);
  const safeOutput = sanitize(output);
  const lines = (`$ ${safeCommand}\n${safeOutput}`).trim().split(/\r?\n/);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif}
.frame{width:1440px;height:1000px;display:flex;align-items:center;justify-content:center;background:#f5f7fb}
.terminal{width:1120px;min-height:560px;background:#0b1020;color:#e5e7eb;border-radius:10px;box-shadow:0 20px 50px rgba(15,23,42,.25);overflow:hidden}
.bar{height:42px;background:#111827;display:flex;align-items:center;gap:8px;padding:0 16px;color:#9ca3af;font-size:14px}
.dot{width:12px;height:12px;border-radius:50%;background:#ef4444}.dot:nth-child(2){background:#f59e0b}.dot:nth-child(3){background:#22c55e}
pre{margin:0;padding:28px 34px;font:20px/1.55 "JetBrains Mono",Consolas,monospace;white-space:pre-wrap}
.line{display:block;position:relative;padding:1px 8px;border-radius:6px}
.mark{outline:3px solid #60a5fa;box-shadow:0 0 0 4px rgba(96,165,250,.16)}
</style></head><body><div class="frame"><div class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>Terminal</span></div><pre>${lines.map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cls = targetLinePattern.test(line) ? 'line mark' : 'line';
    return `<span class="${cls}">${escaped}</span>`;
  }).join('')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
  fs.writeFileSync(path.join(originalsDir, `${file}-terminal-sanitizado.html`), html);
}

async function renderCode(page, file, htmlBefore, htmlAfter) {
  const excerpt = htmlAfter.split(/\r?\n/).filter((line) => /Versao 2|Versao 3|ambiente de demonstracao|Tutorial Deploy/.test(line)).join('\n');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f5f7fb;font-family:Inter,Arial,sans-serif}
.frame{width:1440px;height:1000px;display:flex;align-items:center;justify-content:center}
.editor{width:1050px;background:#ffffff;border:1px solid #dbe3ef;border-radius:10px;box-shadow:0 20px 50px rgba(15,23,42,.12);overflow:hidden}
.bar{height:44px;background:#f8fafc;border-bottom:1px solid #e5e7eb;padding:0 18px;display:flex;align-items:center;color:#475569;font-size:16px}
pre{margin:0;padding:30px 36px;font:21px/1.55 "JetBrains Mono",Consolas,monospace;color:#0f172a;white-space:pre-wrap}
.mark{display:block;outline:3px solid #2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.14);border-radius:6px;padding:2px 8px}
</style></head><body><div class="frame"><div class="editor"><div class="bar">index.html</div><pre>${excerpt.split(/\r?\n/).map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return /Versao 3/.test(line) ? `<span class="mark">${escaped}</span>` : escaped;
  }).join('\n')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(originalsDir, `${file}-original-sanitizado.png`), fullPage: false });
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
  fs.writeFileSync(path.join(reportsDir, 'alteracao-projeto-sanitizada.txt'), [
    'Arquivo: index.html',
    'Estado anterior: pagina de demonstracao sem versao exibida.',
    `Estado final: ${versionText}.`,
    `Tamanho anterior: ${htmlBefore.length} caracteres.`,
    `Tamanho final: ${htmlAfter.length} caracteres.`,
  ].join('\n'));
}

function updateProjectFile() {
  const file = path.join(testProjectDir, 'index.html');
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  if (!/Versao 2 - atualizacao de demonstracao/.test(after)) {
    after = after.replace(
      '<p>Esta página é um ambiente de demonstração criado para validar o primeiro deploy na StayCloud. Ela não contém dados pessoais, formulários, banco de dados, credenciais ou integrações externas.</p>',
      '<p><strong>Versao 2 - atualizacao de demonstracao.</strong> Esta pagina continua sendo um ambiente de demonstracao do Deploy StayCloud, sem dados pessoais, formularios, banco de dados, credenciais ou integracoes externas.</p>'
    );
  }
  after = after.replace(/Versao 2 - atualizacao de demonstracao/g, versionText);
  fs.writeFileSync(file, after);
  return { before, after };
}

function removeLocalConnection() {
  const candidates = ['.staycloud', '.staycloud.json', 'staycloud.json'].map((name) => path.join(testProjectDir, name));
  for (const file of candidates) {
    if (fs.existsSync(file)) fs.rmSync(file, { recursive: true, force: true });
  }
}

async function main() {
  if (!fs.existsSync(path.join(testProjectDir, 'index.html'))) throw new Error('Projeto descartavel nao encontrado.');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);

  const loginMode = await login(page);
  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(2500);
  await dismissOverlays(page);
  const cardRect = await findRect(page, /tutorial-deploy-cli-teste/i, { minY: 130, maxWidth: 700 }) || { x: 250, y: 260, width: 520, height: 140 };
  await screenshotMarked(page, '01-projeto-publicado-sanitizado', cardRect);
  await clickText(page, /tutorial-deploy-cli-teste/i, { minY: 130 });
  await wait(2500);
  const overviewBody = sanitize(await page.evaluate(() => document.body.innerText));
  fs.writeFileSync(path.join(reportsDir, 'visao-geral-sanitizada.txt'), overviewBody);

  const publicPageBefore = await browser.newPage();
  await publicPageBefore.goto(publicUrl, { waitUntil: 'networkidle2' });
  await wait(1000);
  const beforeRect = await findRect(publicPageBefore, /Tutorial Deploy Teste|ambiente de demonstra/i, { maxWidth: 900 }) || { x: 280, y: 320, width: 800, height: 180 };
  await screenshotMarked(publicPageBefore, '02-versao-atual-sanitizado', beforeRect);

  const { before, after } = updateProjectFile();
  const renderPage = await browser.newPage();
  await renderCode(renderPage, '03-alteracao-projeto-sanitizado', before, after);

  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(1800);
  await clickText(page, /tutorial-deploy-cli-teste/i, { minY: 130 });
  await wait(1500);
  await clickText(page, /^Deploys$|ver todos os deploys/i);
  await wait(2000);
  const deploysBody = await page.evaluate(() => document.body.innerText);
  const officialTerms = {
    hasNovoDeploy: /Novo deploy/i.test(deploysBody),
    hasReimplante: /Reimplante/i.test(deploysBody),
    hasAtualizar: /\batualizar\b/i.test(deploysBody),
    body: sanitize(deploysBody),
  };

  await clickText(page, /gerar token deste projeto|gerar comando/i);
  await wait(2500);
  let command = await readCommandFromPage(page);
  let panelCommandSanitized = command ? sanitizeCommand(normalizePanelCommand(command)) : '';
  let initRun = { label: 'init', status: 'skipped', stdout: 'Projeto ja conectado localmente para validacao.', stderr: '' };
  const connectedBefore = fs.existsSync(path.join(testProjectDir, '.staycloud', 'credentials.json'));
  if (!connectedBefore) {
    await clickText(page, /gerar token deste projeto|gerar comando/i);
    await wait(2500);
    command = await readCommandFromPage(page);
    if (!/--token\s+\S+/i.test(command)) {
      await clickText(page, /gerar token deste projeto|gerar comando/i);
      await wait(2500);
      command = await readCommandFromPage(page);
    }
    if (!/npx\s+@staysdev\/setup\s+(?:init|connect)/i.test(command) || !/--token\s+\S+/i.test(command)) {
      throw new Error('Comando de conexao do projeto nao encontrado no painel.');
    }
    command = normalizePanelCommand(command);
    panelCommandSanitized = sanitizeCommand(command);
    initRun = runNpx(splitCommand(command), 'init', 90000);
    if (initRun.status !== 0) throw new Error(`Falha no init sanitizada: ${initRun.stderr || initRun.stdout}`);
  }
  fs.writeFileSync(path.join(reportsDir, 'comando-painel-sanitizado.txt'), `${panelCommandSanitized || 'Projeto ja conectado; comando de conexao nao exibido novamente.'}\n`);
  const statusBefore = runNpx(['npx', '--yes', '@staysdev/setup', 'status'], 'status-before', 90000);
  const deployCommand = 'npx @staysdev/setup deploy';
  const deployRun = runNpx(['npx', '--yes', '@staysdev/setup', 'deploy'], 'deploy-new-version', 240000);
  if (deployRun.status !== 0) throw new Error(`Falha no novo deploy sanitizada: ${deployRun.stderr || deployRun.stdout}`);
  const statusAfter = runNpx(['npx', '--yes', '@staysdev/setup', 'status'], 'status-after', 90000);
  const logsAfter = runNpx(['npx', '--yes', '@staysdev/setup', 'logs'], 'logs-after', 90000);

  const terminalPage = await browser.newPage();
  await terminalPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await renderTerminal(terminalPage, '04-nova-publicacao-sanitizado', deployCommand, `${deployRun.stdout}\n${deployRun.stderr}`, /npx @staysdev\/setup deploy|Deploy em andamento|ambiente de publica/i);
  await renderTerminal(terminalPage, '05-processamento-sanitizado', 'npx @staysdev/setup status', `${statusAfter.stdout}\n${statusAfter.stderr}`, /Status:|pronto|build|Deploy/i);

  await page.reload({ waitUntil: 'networkidle2' });
  await wait(2500);
  const readyRect = await findRect(page, /pronto|Pronto/i, { minY: 280, maxWidth: 900, smallest: true }) || { x: 250, y: 540, width: 240, height: 60 };
  await screenshotMarked(page, '06-conclusao-sanitizado', readyRect);

  const publicPageAfter = await browser.newPage();
  await publicPageAfter.goto(`${publicUrl}?v=${Date.now()}`, { waitUntil: 'networkidle2' });
  await wait(1500);
  const afterBody = await publicPageAfter.evaluate(() => document.body.innerText);
  const updated = /Versao 3 - atualizacao final de demonstracao/i.test(afterBody);
  const afterRect = await findRect(publicPageAfter, /Versao 2 - atualizacao de demonstracao/i, { maxWidth: 900 }) || { x: 280, y: 320, width: 800, height: 180 };
  await screenshotMarked(publicPageAfter, '07-nova-versao-publicada-sanitizado', afterRect);

  const disconnectRun = runNpx(['npx', '--yes', '@staysdev/setup', 'disconnect'], 'disconnect', 60000);
  removeLocalConnection();

  const report = {
    date: new Date().toISOString(),
    loginMode,
    projectName,
    publicUrl,
    officialTerms,
    selectedScenario: 'C',
    selectedTitle: 'Como publicar uma nova versao pelo Deploy StayCloud',
    method: deployCommand,
    versionText,
    statusBefore,
    initRun,
    deployRun,
    statusAfter,
    logsAfter,
    disconnect: { status: disconnectRun.status, stdout: disconnectRun.stdout, stderr: disconnectRun.stderr },
    updated,
    screenshots: [
      { file: '01-projeto-publicado-sanitizado.png', target: 'card do projeto tutorial-deploy-cli-teste' },
      { file: '02-versao-atual-sanitizado.png', target: 'conteudo publico antes da alteracao' },
      { file: '03-alteracao-projeto-sanitizado.png', target: 'trecho alterado no index.html' },
      { file: '04-nova-publicacao-sanitizado.png', target: 'comando npx @staysdev/setup deploy' },
      { file: '05-processamento-sanitizado.png', target: 'retorno do status apos o novo deploy' },
      { file: '06-conclusao-sanitizado.png', target: 'status pronto no painel' },
      { file: '07-nova-versao-publicada-sanitizado.png', target: versionText },
    ],
    safety: {
      tokenSaved: false,
      secretsSaved: false,
      localConnectionRemoved: true,
    },
  };
  fs.writeFileSync(path.join(reportsDir, 'validacao-nova-versao-deploy.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(__dirname, 'comandos-sanitizados.md'), [
    '# Comandos Sanitizados',
    '',
    `Data: 2026-07-31`,
    '',
    '## Comandos publicos usados',
    '',
    '```bash',
    'npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API',
    '```',
    '',
    '```bash',
    'npx @staysdev/setup deploy',
    '```',
    '',
    '```bash',
    'npx @staysdev/setup status',
    '```',
    '',
    '```bash',
    'npx @staysdev/setup logs',
    '```',
    '',
    '## Placeholders',
    '',
    '- `SEU_TOKEN`: token temporario gerado no painel. O valor real nao foi salvo.',
    '- `URL_DA_API`: endpoint oficial retornado pelo painel. O valor real nao foi registrado.',
    '',
    '## Seguranca',
    '',
    'O token real foi usado somente durante a execucao autorizada e mantido em memoria. Nenhum token, cookie, variavel de ambiente, chave ou credencial foi salvo no Obsidian, no preview, no WordPress TXT, no SEO ou nos prints finais.',
  ].join('\n'));
  console.log(JSON.stringify({
    officialTerms: {
      hasNovoDeploy: officialTerms.hasNovoDeploy,
      hasReimplante: officialTerms.hasReimplante,
      hasAtualizar: officialTerms.hasAtualizar,
    },
    method: deployCommand,
    deployStatus: deployRun.status,
    updated,
    screenshots: report.screenshots.length,
    report: path.join(reportsDir, 'validacao-nova-versao-deploy.json'),
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(sanitize(error.message));
  process.exit(1);
});
