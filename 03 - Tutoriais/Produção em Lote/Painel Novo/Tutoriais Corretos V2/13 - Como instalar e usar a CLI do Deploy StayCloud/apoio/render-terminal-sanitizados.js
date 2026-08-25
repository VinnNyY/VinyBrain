const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const finalsDir = path.join(tutorialDir, 'prints-finais');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const reportsDir = path.join(__dirname, 'relatorios');
const projectName = 'tutorial-deploy-cli-teste';
const projectUrl = 'https://tutorial-deploy-cli-teste.stayai.space/';

for (const dir of [finalsDir, originalsDir, reportsDir]) fs.mkdirSync(dir, { recursive: true });

async function renderTerminal(page, file, command, output, targetPattern) {
  const lines = (`$ ${command}\n${output}`).trim().split(/\r?\n/);
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
</style></head><body><div class="frame"><div class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>Terminal</span></div><pre>${lines.map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cls = !renderTerminal.marked && targetPattern.test(line) ? (renderTerminal.marked = true, 'line mark') : 'line';
    return `<span class="${cls}">${escaped}</span>`;
  }).join('')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });
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
  const help = `CLI de setup da StayCloud

Uso:
  npx @staysdev/setup init --token <token> [--api-url <url>]
  npx @staysdev/setup connect --token <token> [--api-url <url>]
  npx @staysdev/setup deploy --new [--name <name>] [--subdomain <slug>]
  npx @staysdev/setup deploy [--subdomain <slug>] [--output-dir <dir>]
  npx @staysdev/setup status
  npx @staysdev/setup logs [--deployment-id <id>]
  npx @staysdev/setup disconnect`;

  renderTerminal.marked = false;
  await renderTerminal(page, '03-confirmacao-instalacao-sanitizado', 'npx @staysdev/setup help', help, /CLI de setup da StayCloud/);
  renderTerminal.marked = false;
  await renderTerminal(page, '04-autenticacao-conexao-sanitizado', 'npx @staysdev/setup init --token SEU_TOKEN --api-url URL_DA_API', `Conectado ao StayCloud.
Config: ~/projeto-de-teste/.staycloud/config.json
Escopo: conta`, /Conectado ao StayCloud/);
  renderTerminal.marked = false;
  await renderTerminal(page, '05-comando-deploy-sanitizado', `npx @staysdev/setup deploy --new --name ${projectName} --subdomain ${projectName}`, `Projeto criado: ${projectName}
Enviando 2 arquivos para a StayCloud...
Deploy em andamento (ID_DO_DEPLOY)...
deploy enfileirado no StayCloud
fonte validada pelo agente StayCloud
artefato estático pronto
Deploy concluído.
URL: ${projectUrl}`, /npx @staysdev\/setup deploy/);
  renderTerminal.marked = false;
  await renderTerminal(page, '06-resultado-cli-sanitizado', `curl -I ${projectUrl}`, `HTTP/2 200
content-type: text/html; charset=utf-8

Validação no painel:
Projeto: ${projectName}
Status: pronto
URL: ${projectUrl}`, /HTTP\/2 200/);

  fs.writeFileSync(path.join(reportsDir, 'terminal-sanitizado.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    projectName,
    projectUrl,
    source: 'Saídas sanitizadas a partir de execução real da CLI e validação HTTP 200/painel.',
    files: [
      '03-confirmacao-instalacao-sanitizado.png',
      '04-autenticacao-conexao-sanitizado.png',
      '05-comando-deploy-sanitizado.png',
      '06-resultado-cli-sanitizado.png',
    ],
  }, null, 2));
  console.log('terminal-sanitizado-ok');
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
