const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const tutorialDir = path.resolve(__dirname, '..');
const originalsDir = path.join(__dirname, 'originais-e-versoes-antigas');
const finalsDir = path.join(tutorialDir, 'prints-finais');

const output = `Enviando 2 arquivos para a StayCloud...
Deploy em andamento ([ID censurado])...
deploy enfileirado no StayCloud
deploy iniciado no backend
fonte validada pelo painel StayCloud
artefato estatico pronto (1 arquivos)
[DEPLOY] preparando static para tutorial-deploy-cli-teste
[DEPLOY] 1 arquivos gravados
[DEPLOY] preparando pacote de publicacao
[DEPLOY] pacote de publicacao gerado
[DEPLOY] enviando pacote para publicacao
[ID tecnico censurado]: Layer already exists
[ID tecnico censurado]: Layer already exists
[ID tecnico censurado]: Layer already exists
[DEPLOY] pacote enviado para publicacao
[DEPLOY] ambiente de publicacao atualizado
[DEPLOY] iniciando publicacao
[DEPLOY] publicacao enfileirada
----------------------------------------
Deploy concluido.
URL: https://tutorial-deploy-cli-teste.stayai.space/`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  const lines = (`$ npx @staysdev/setup deploy\n${output}`).trim().split(/\r?\n/);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif}.frame{width:1440px;height:1000px;display:flex;align-items:center;justify-content:center;background:#f5f7fb}.terminal{width:1120px;min-height:560px;background:#0b1020;color:#e5e7eb;border-radius:10px;box-shadow:0 20px 50px rgba(15,23,42,.25);overflow:hidden}.bar{height:42px;background:#111827;display:flex;align-items:center;gap:8px;padding:0 16px;color:#9ca3af;font-size:14px}.dot{width:12px;height:12px;border-radius:50%;background:#ef4444}.dot:nth-child(2){background:#f59e0b}.dot:nth-child(3){background:#22c55e}pre{margin:0;padding:28px 34px;font:20px/1.55 "JetBrains Mono",Consolas,monospace;white-space:pre-wrap}.line{display:block;position:relative;padding:1px 8px;border-radius:6px}.mark{outline:3px solid #60a5fa;box-shadow:0 0 0 4px rgba(96,165,250,.16)}
</style></head><body><div class="frame"><div class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>Terminal</span></div><pre>${lines.map((line) => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const marked = /npx @staysdev\/setup deploy|ambiente de publicacao atualizado|Deploy em andamento/.test(line);
    return `<span class="${marked ? 'line mark' : 'line'}">${escaped}</span>`;
  }).join('')}</pre></div></div></body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  fs.writeFileSync(path.join(originalsDir, '04-nova-publicacao-terminal-sanitizado.html'), html);
  await page.screenshot({ path: path.join(finalsDir, '04-nova-publicacao-sanitizado.png'), fullPage: false });
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
