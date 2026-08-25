const path = require('path');
const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = path.resolve(__dirname, '..');
const finalsDir = path.join(root, 'prints-finais');

const base = path.join(finalsDir, '02-area-dominio-sanitizado.png');
const jobs = [
  {
    output: '02-area-dominio-sanitizado.png',
    rect: { x: 113, y: 308, width: 162, height: 34 },
  },
  {
    output: '04-instrucoes-dns-sanitizado.png',
    rect: { x: 654, y: 421, width: 397, height: 27 },
  },
  {
    output: '06-validacao-sanitizado.png',
    rect: { x: 865, y: 295, width: 266, height: 80 },
  },
];

async function main() {
  const baseData = `data:image/png;base64,${fs.readFileSync(base).toString('base64')}`;
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  for (const job of jobs) {
    const { rect } = job;
    await page.setContent(`<!doctype html><html><head><style>
body{margin:0;background:white;width:1440px;height:1000px;overflow:hidden}
img{display:block;width:1440px;height:1000px}
.mark{position:absolute;left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;border:3px solid #2563eb;border-radius:8px;box-shadow:0 0 0 4px rgba(37,99,235,.14);box-sizing:border-box}
</style></head><body><img src="${baseData}"><div class="mark"></div></body></html>`, { waitUntil: 'domcontentloaded' });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.screenshot({ path: path.join(finalsDir, job.output), fullPage: false });
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
