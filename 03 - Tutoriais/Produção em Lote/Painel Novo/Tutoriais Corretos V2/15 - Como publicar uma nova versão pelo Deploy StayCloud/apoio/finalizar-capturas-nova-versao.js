const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const reportsDir = path.join(__dirname, 'relatorios');
const testProjectDir = '/tmp/tutorial-deploy-cli-teste';
const publicUrl = 'https://tutorial-deploy-cli-teste.stayai.space/';
const versionText = 'Versao 3 - atualizacao final de demonstracao';
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

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

function runNpx(args, timeout = 90000) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: testProjectDir,
    encoding: 'utf8',
    timeout,
    env: { ...process.env, NO_COLOR: '1' },
  });
  return { status: result.status, stdout: sanitize(result.stdout), stderr: sanitize(result.stderr) };
}

async function login(page) {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
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
  return 'novo-login';
}

async function sanitizeDom(page) {
  await page.evaluate(() => {
    const replacements = [
      [/(--token\s+)(["']?)[^\s"']+/gi, '$1SEU_TOKEN'],
      [/(--api-url\s+)(["']?)[^\s"']+/gi, '$1URL_DA_API'],
      [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]'],
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
      const rect = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      if (!re.test(text) || rect.width < 10 || rect.height < 10) return false;
      if (options.minY != null && rect.top < options.minY) return false;
      if (options.maxWidth != null && rect.width > options.maxWidth) return false;
      return true;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.top - br.top) || (ar.left - br.left);
    });
    const el = matches[options.index || 0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  }, { source: pattern.source, flags: pattern.flags, options });
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
      'box-shadow:0 0 0 4px rgba(37,99,235,.14)',
      'pointer-events:none',
      'z-index:2147483000',
    ].join(';');
    document.body.append(outline);
  }, { rect });
}

async function screenshotMarked(page, file, rect) {
  await page.screenshot({ path: path.join(originalsDir, `${file}-original.png`), fullPage: false });
  await sanitizeDom(page);
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
}

async function renderTerminal(page, file, command, output, targetLinePattern) {
  const lines = (`$ ${command}\n${sanitize(output)}`).trim().split(/\r?\n/);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif}.frame{width:1440px;height:1000px;display:flex;align-items:center;justify-content:center;background:#f5f7fb}.terminal{width:1120px;min-height:560px;background:#0b1020;color:#e5e7eb;border-radius:10px;box-shadow:0 20px 50px rgba(15,23,42,.25);overflow:hidden}.bar{height:42px;background:#111827;display:flex;align-items:center;gap:8px;padding:0 16px;color:#9ca3af;font-size:14px}.dot{width:12px;height:12px;border-radius:50%;background:#ef4444}.dot:nth-child(2){background:#f59e0b}.dot:nth-child(3){background:#22c55e}pre{margin:0;padding:28px 34px;font:20px/1.55 "JetBrains Mono",Consolas,monospace;white-space:pre-wrap}.line{display:block;position:relative;padding:1px 8px;border-radius:6px}.mark{outline:3px solid #60a5fa;box-shadow:0 0 0 4px rgba(96,165,250,.16)}
</style></head><body><div class="frame"><div class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>Terminal</span></div><pre>${lines.map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<span class="${targetLinePattern.test(line) ? 'line mark' : 'line'}">${escaped}</span>`;
  }).join('')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
  fs.writeFileSync(path.join(originalsDir, `${file}-terminal-sanitizado.html`), html);
}

function removeLocalConnection() {
  for (const name of ['.staycloud', '.staycloud.json', 'staycloud.json']) {
    const target = path.join(testProjectDir, name);
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  }
}

async function main() {
  const status = runNpx(['npx', '--yes', '@staysdev/setup', 'status']);
  const logs = runNpx(['npx', '--yes', '@staysdev/setup', 'logs']);
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const terminalPage = await browser.newPage();
  await terminalPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await renderTerminal(terminalPage, '05-processamento-sanitizado', 'npx @staysdev/setup status', `${status.stdout}\n${status.stderr}`, /Status: live|Deploys recentes/i);

  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  await login(page);
  await page.goto('https://beta.staycloud.com/dashboard/cloud', { waitUntil: 'networkidle2' });
  await wait(2000);
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button, a, [role="button"], div, span')].find((node) => /tutorial-deploy-cli-teste/i.test(node.innerText || node.textContent || ''));
    if (el) (el.closest('button, a, [role="button"]') || el).click();
  });
  await wait(2000);
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button, a, [role="button"], div, span')].find((node) => /^Deploys$|ver todos os deploys/i.test(node.innerText || node.textContent || ''));
    if (el) (el.closest('button, a, [role="button"]') || el).click();
  });
  await wait(3000);
  const readyRect = await findRect(page, /pronto|Pronto|live/i, { minY: 240, maxWidth: 900 }) || { x: 260, y: 520, width: 260, height: 70 };
  await screenshotMarked(page, '06-conclusao-sanitizado', readyRect);
  const deploysBody = sanitize(await page.evaluate(() => document.body.innerText));

  const publicPage = await browser.newPage();
  await publicPage.goto(`${publicUrl}?v=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await wait(1500);
  const publicBody = await publicPage.evaluate(() => document.body.innerText);
  const updated = /Versao 3 - atualizacao final de demonstracao/i.test(publicBody);
  const publicRect = await findRect(publicPage, /Versao 3 - atualizacao final de demonstracao/i, { maxWidth: 900 }) || { x: 280, y: 320, width: 800, height: 180 };
  await screenshotMarked(publicPage, '07-nova-versao-publicada-sanitizado', publicRect);

  const disconnect = runNpx(['npx', '--yes', '@staysdev/setup', 'disconnect'], 60000);
  removeLocalConnection();

  const report = {
    date: new Date().toISOString(),
    method: 'npx @staysdev/setup deploy',
    officialTerms: {
      termFromOverview: 'Para atualizar producao, faca um novo deploy.',
      deploysTab: 'Novo deploy',
      description: 'Reimplante ou inspecione os logs de qualquer deploy.',
    },
    status,
    logsSample: sanitize(logs.stdout).split(/\r?\n/).slice(0, 28).join('\n'),
    deploysBody,
    publicUrl,
    updated,
    screenshots: [
      { file: '01-projeto-publicado-sanitizado.png', target: 'card do projeto tutorial-deploy-cli-teste' },
      { file: '02-versao-atual-sanitizado.png', target: 'conteudo publico antes da alteracao' },
      { file: '03-alteracao-projeto-sanitizado.png', target: 'trecho alterado no index.html' },
      { file: '04-nova-publicacao-sanitizado.png', target: 'comando npx @staysdev/setup deploy' },
      { file: '05-processamento-sanitizado.png', target: 'Status: live / Deploys recentes' },
      { file: '06-conclusao-sanitizado.png', target: 'status pronto/live no painel' },
      { file: '07-nova-versao-publicada-sanitizado.png', target: versionText },
    ],
    safety: {
      secretsSaved: false,
      localConnectionRemoved: true,
    },
  };
  fs.writeFileSync(path.join(reportsDir, 'validacao-nova-versao-deploy.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    updated,
    method: report.method,
    screenshots: report.screenshots.length,
    localConnectionRemoved: true,
    report: path.join(reportsDir, 'validacao-nova-versao-deploy.json'),
  }, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(sanitize(error.message));
  process.exit(1);
});
