const fs = require('fs');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const out = '/tmp/rankmath-inspecao-central-ajuda.json';

function secret(prompt, label) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const wanted = normalize(label);
  for (const line of prompt.split(/\n/)) {
    const match = line.match(/-\s*([^:]+):\s*`([^`]+)`/);
    if (match && normalize(match[1]) === wanted) return match[2];
  }
  throw new Error(`Credencial autorizada nao encontrada: ${label}`);
}

async function login(page, prompt) {
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
  await login(page, prompt);
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/post.php?post=2843&action=edit', { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const info = await page.evaluate(() => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const fields = Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"], button, a, [role="button"]')).map((el) => ({
      tag: el.tagName,
      type: el.getAttribute('type') || '',
      id: el.id || '',
      name: el.getAttribute('name') || '',
      className: String(el.className || '').slice(0, 180),
      aria: el.getAttribute('aria-label') || '',
      placeholder: el.getAttribute('placeholder') || '',
      text: (el.innerText || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 220),
      visible: visible(el),
    })).filter((item) => /rank|math|seo|snippet|fragment|palavra|keyword|focus|resumo|excerpt|categoria|category|publish|update|atualizar|salvar|score|pontos/i.test([
      item.id, item.name, item.className, item.aria, item.placeholder, item.text,
    ].join(' ')));
    return {
      url: location.href,
      title: document.title,
      bodyText: document.body.innerText.slice(0, 5000),
      fields,
      scripts: Array.from(document.scripts).map((script) => script.src).filter((src) => /rank|math|wp-|block|editor/i.test(src)).slice(0, 100),
    };
  });

  await page.screenshot({ path: '/tmp/rankmath-editor-central-ajuda.png', fullPage: true });
  fs.writeFileSync(out, JSON.stringify(info, null, 2));
  await browser.close();
  console.log(out);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
