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
const publicCommand = 'npx @staysdev/setup';

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
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, '$1TOKEN_CENSURADO')
    .replace(/(accessToken["']?\s*:\s*["'])[^"']+/gi, '$1TOKEN_CENSURADO')
    .replace(/(https?:\/\/)(localhost|127\.0\.0\.1|beta\.staycloud\.com|stays\.dev)([^\s"')<]*)/gi, (m, p1, host) => `${p1}${host}`)
    .replace(new RegExp(testProjectDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '~/projeto-de-teste')
    .replace(/\/home\/[^\s"')<]+/g, '~/caminho-censurado')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail censurado]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]');
}

function sanitizeCommand(command) {
  return sanitize(command)
    .replace(/--api-url\s+[^\s"']+/gi, '--api-url URL_DA_API')
    .replace(/\s+/g, ' ')
    .trim();
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

async function login(page) {
  const email = process.env.STAY_EMAIL || process.env.STAYCLOUD_EMAIL || secretFromPrompt('Login do painel do cliente');
  const password = process.env.STAY_PASSWORD || process.env.STAYCLOUD_PASSWORD || secretFromPrompt('Senha do painel do cliente');
  if (!email || !password) throw new Error('Credenciais do painel não encontradas.');
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
  if (/login|entrar/i.test(after) && /senha/i.test(after)) throw new Error('Login no painel não confirmado.');
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
    [...document.querySelectorAll('button, a, [role="button"]')].forEach((el) => {
      const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim();
      const box = el.getBoundingClientRect();
      if (/Fechar|×/i.test(text) && (box.top > innerHeight - 180 || box.left > innerWidth - 100)) el.click();
    });
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
      [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID censurado]'],
      [/(vinicius|viny|legacy doc|legacy)/gi, '[dado censurado]'],
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
      if (/token|key|secret|email|user|name|nome|dominio|domain/i.test([el.name, el.id, el.placeholder].join(' '))) el.value = '';
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
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(originalsDir, `${file}-original.png`), fullPage: false });
  await sanitizeDom(page);
  await mark(page, rect);
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
}

async function clickText(page, pattern) {
  return page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    const candidates = [...document.querySelectorAll('button, a, [role="button"], div, span')].filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const rect = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      return re.test(text) && rect.width > 10 && rect.height > 10;
    }).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    });
    const el = candidates[0];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    (el.closest('button, a, [role="button"]') || el).click();
    return true;
  }, { source: pattern.source, flags: pattern.flags });
}

async function readCommandFromPage(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/npx\s+@staysdev\/setup\s+init[^\n\r]+/i);
    return match ? match[0].trim() : '';
  });
}

function splitCommand(command) {
  const parts = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  return parts.map((part) => part.replace(/^['"]|['"]$/g, ''));
}

function runNpx(args, label) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: testProjectDir,
    encoding: 'utf8',
    timeout: label === 'deploy' ? 240000 : 60000,
    env: { ...process.env, NO_COLOR: '1' },
  });
  return {
    label,
    status: result.status,
    stdout: sanitize(result.stdout),
    stderr: sanitize(result.stderr),
  };
}

async function renderTerminal(page, file, command, output, targetLinePattern) {
  const safeCommand = sanitizeCommand(command);
  const safeOutput = sanitize(output);
  const lines = (`$ ${safeCommand}\n${safeOutput}`).trim().split(/\r?\n/);
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
body{margin:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif}
.frame{width:1440px;height:1000px;display:flex;align-items:center;justify-content:center;background:#f5f7fb}
.terminal{width:1120px;min-height:560px;background:#0b1020;color:#e5e7eb;border-radius:10px;box-shadow:0 20px 50px rgba(15,23,42,.25);overflow:hidden}
.bar{height:42px;background:#111827;display:flex;align-items:center;gap:8px;padding:0 16px;color:#9ca3af;font-size:14px}
.dot{width:12px;height:12px;border-radius:50%;background:#ef4444}.dot:nth-child(2){background:#f59e0b}.dot:nth-child(3){background:#22c55e}
pre{margin:0;padding:28px 34px;font:20px/1.55 "JetBrains Mono","Fira Code",Consolas,monospace;white-space:pre-wrap}
.line{display:block;position:relative;padding:1px 8px;border-radius:6px}
.mark{outline:3px solid #60a5fa;box-shadow:0 0 0 4px rgba(96,165,250,.16)}
.prompt{color:#93c5fd}.ok{color:#86efac}.muted{color:#9ca3af}
</style></head><body><div class="frame"><div class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>Terminal</span></div><pre>${lines.map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cls = targetLinePattern.test(line) ? 'line mark' : 'line';
    return `<span class="${cls}">${escaped}</span>`;
  }).join('')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(finalsDir, `${file}.png`), fullPage: false });
  fs.writeFileSync(path.join(originalsDir, `${file}-terminal-sanitizado.html`), html);
}

async function main() {
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

  await clickText(page, /Novo projeto/i);
  await wait(2500);
  const cliRect = await findRect(page, /Deploy via CLI/i, { minX: 250, minY: 140, maxWidth: 520 }) || { x: 800, y: 470, width: 380, height: 190 };
  await screenshotMarked(page, '01-onde-obter-cli-sanitizado', cliRect);

  await clickText(page, /gerar comando/i);
  await wait(2500);
  let command = await readCommandFromPage(page);
  if (!/--token\s+\S+/i.test(command)) {
    await clickText(page, /gerar comando/i);
    await wait(2500);
    command = await readCommandFromPage(page);
  }
  if (!/npx\s+@staysdev\/setup\s+init/i.test(command)) throw new Error('Comando da CLI não encontrado no painel.');
  command = normalizePanelCommand(command);
  fs.writeFileSync(path.join(reportsDir, 'comando-painel-sanitizado.txt'), `${sanitizeCommand(command)}\n`);
  const commandRect = await findRect(page, /npx\s+@staysdev\/setup\s+init/i, { minX: 250, minY: 140, maxWidth: 900 }) || cliRect;
  await screenshotMarked(page, '02-comando-oficial-sanitizado', commandRect);

  const parts = splitCommand(command);
  const initRun = runNpx(parts, 'init');
  if (initRun.status !== 0) throw new Error(`Falha no init sanitizada: ${initRun.stderr || initRun.stdout}`);

  const statusRun = runNpx(['npx', '--yes', '@staysdev/setup', 'status'], 'status-before');
  const deployRun = runNpx(['npx', '--yes', '@staysdev/setup', 'deploy', '--new', '--name', projectName, '--subdomain', projectName], 'deploy');
  if (deployRun.status !== 0 && !/subdomain|slug|nome|já existe|ja existe/i.test(deployRun.stderr + deployRun.stdout)) {
    throw new Error(`Falha no deploy sanitizada: ${deployRun.stderr || deployRun.stdout}`);
  }
  const statusAfterRun = runNpx(['npx', '--yes', '@staysdev/setup', 'status'], 'status-after');
  const logsRun = runNpx(['npx', '--yes', '@staysdev/setup', 'logs'], 'logs');
  const disconnectRun = runNpx(['npx', '--yes', '@staysdev/setup', 'disconnect'], 'disconnect');

  const terminalPage = await browser.newPage();
  await terminalPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await renderTerminal(terminalPage, '03-confirmacao-instalacao-sanitizado', 'npx @staysdev/setup help', fs.readFileSync('/tmp/staycloud-setup-pkg.tFxJ3u/package/README.md', 'utf8').split('\n').slice(0, 12).join('\n'), /npx @staysdev\/setup init/);
  await renderTerminal(terminalPage, '04-autenticacao-conexao-sanitizado', sanitizeCommand(command), `${initRun.stdout}\n${initRun.stderr}`, /Conectado ao StayCloud|Escopo|Projeto/);
  await renderTerminal(terminalPage, '05-comando-deploy-sanitizado', `npx @staysdev/setup deploy --new --name ${projectName} --subdomain ${projectName}`, `${deployRun.stdout}\n${deployRun.stderr}`, /npx @staysdev\/setup deploy|Deploy em andamento|Enviando/);
  await renderTerminal(terminalPage, '06-resultado-cli-sanitizado', 'npx @staysdev/setup status', `${statusAfterRun.stdout}\n${statusAfterRun.stderr}\n${logsRun.stdout}\n${logsRun.stderr}`, /URL:|Status:|Deploys recentes/);
  await terminalPage.close();

  const report = {
    date: new Date().toISOString(),
    loginMode,
    scenario: 'A',
    officialToolName: '@staysdev/setup',
    officialBinary: 'staycloud',
    packageVersion: '0.1.3',
    panelCommandSanitized: sanitizeCommand(command),
    publicCommands: [
      'npx @staysdev/setup help',
      'npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API',
      `npx @staysdev/setup deploy --new --name ${projectName} --subdomain ${projectName}`,
      'npx @staysdev/setup status',
      'npx @staysdev/setup logs',
    ],
    testProject: {
      name: projectName,
      directory: '~/projeto-de-teste',
      containsSecrets: false,
      technology: 'HTML estático',
    },
    runs: {
      init: initRun,
      statusBefore: statusRun,
      deploy: deployRun,
      statusAfter: statusAfterRun,
      logs: logsRun,
      disconnect: disconnectRun.status === 0 ? { label: 'disconnect', status: 0, stdout: sanitize(disconnectRun.stdout), stderr: sanitize(disconnectRun.stderr) } : { label: 'disconnect', status: disconnectRun.status },
    },
    screenshots: [
      '01-onde-obter-cli-sanitizado.png',
      '02-comando-oficial-sanitizado.png',
      '03-confirmacao-instalacao-sanitizado.png',
      '04-autenticacao-conexao-sanitizado.png',
      '05-comando-deploy-sanitizado.png',
      '06-resultado-cli-sanitizado.png',
    ],
  };

  fs.writeFileSync(path.join(reportsDir, 'validacao-cli-deploy.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    scenario: report.scenario,
    officialToolName: report.officialToolName,
    packageVersion: report.packageVersion,
    panelCommandSanitized: report.panelCommandSanitized,
    testProject: report.testProject.name,
    deployStatus: deployRun.status,
    statusAfter: statusAfterRun.status,
    screenshots: report.screenshots.length,
    report: path.join(reportsDir, 'validacao-cli-deploy.json'),
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(sanitize(error.message));
  process.exit(1);
});
