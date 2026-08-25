const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Unitários';
const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';

function secretFromPrompt(prompt, label) {
  const match = prompt.match(new RegExp(label + ':\\s*`([^`]+)`'));
  if (!match) throw new Error(`Credencial autorizada nao encontrada: ${label}`);
  return match[1];
}

async function hideSensitiveData(page) {
  await page.evaluate(() => {
    const sensitive = /@|https?:\/\/|\b\d{5,}\b|(?:[a-z0-9-]+\.)+[a-z]{2,}/i;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const parents = new Set();
    while (walker.nextNode()) {
      const text = walker.currentNode.nodeValue.trim();
      if (text && sensitive.test(text) && walker.currentNode.parentElement) {
        parents.add(walker.currentNode.parentElement);
      }
    }
    for (const element of parents) {
      element.style.filter = 'blur(8px)';
      element.style.userSelect = 'none';
    }
    for (const element of document.querySelectorAll('body *')) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.position === 'fixed' && rect.top > window.innerHeight * 0.7) {
        element.style.display = 'none';
      }
      if (element.textContent.trim().startsWith('Encontrou um bug?') && element.children.length < 4) {
        element.style.display = 'none';
      }
    }
  });
}

async function mark(page, selector) {
  await page.evaluate((target) => {
    const element = document.querySelector(target);
    if (!element) return false;
    element.style.outline = '3px solid #5f5cf0';
    element.style.outlineOffset = '4px';
    element.style.borderRadius = '8px';
    element.scrollIntoView({ block: 'center', inline: 'center' });
    return true;
  }, selector);
}

async function markText(page, text) {
  await page.evaluate((label) => {
    const element = [...document.querySelectorAll('a, button, [role="tab"], p, span, div')]
      .find((node) => node.textContent.trim().toLowerCase() === label.toLowerCase());
    if (!element) return false;
    element.style.outline = '3px solid #5f5cf0';
    element.style.outlineOffset = '4px';
    element.style.borderRadius = '8px';
    element.scrollIntoView({ block: 'center', inline: 'center' });
    return true;
  }, text);
}

async function firstByText(page, text) {
  return page.evaluateHandle((label) => {
    const candidates = [...document.querySelectorAll('a, button, [role="button"], [role="tab"]')];
    return candidates.find((element) => element.textContent.trim().toLowerCase() === label.toLowerCase()) || null;
  }, text);
}

async function clickText(page, text) {
  const handle = await firstByText(page, text);
  const element = handle.asElement();
  if (!element) return false;
  await element.click();
  await handle.dispose();
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 }).catch(() => {});
  return true;
}

async function loginIfNeeded(page, prompt) {
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  if (!(await page.$('input[type="email"]'))) return;
  const email = secretFromPrompt(prompt, 'Login do painel do cliente');
  const password = secretFromPrompt(prompt, 'Senha do painel do cliente');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]'),
  ]);
}

async function screenshot(page, file, selector, text) {
  await hideSensitiveData(page);
  if (selector) await mark(page, selector);
  if (text) await markText(page, text);
  await page.screenshot({ path: file, fullPage: true });
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await loginIfNeeded(page, prompt);

  const emailPrints = path.join(root, 'Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints');
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await screenshot(page, path.join(emailPrints, 'consultar-uso-email-painel-novo-staycloud-01.png'), 'a[href^="/dashboard/hospedagem/"]');
  const service = await page.$('a[href^="/dashboard/hospedagem/"]');
  if (!service) throw new Error('Servico de hospedagem nao encontrado no Painel Novo.');
  await service.click();
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 }).catch(() => {});
  if (!(await clickText(page, 'E-mails'))) throw new Error('A aba E-mails nao foi encontrada no Painel Novo.');
  await screenshot(page, path.join(emailPrints, 'consultar-uso-email-painel-novo-staycloud-02.png'), null, 'E-mails');
  const quotaFound = await page.evaluate(() => /cota|uso|armazenamento|quota/i.test(document.body.innerText));
  if (!quotaFound) throw new Error('Uso ou cota de e-mail nao aparece diretamente no Painel Novo.');
  await screenshot(page, path.join(emailPrints, 'consultar-uso-email-painel-novo-staycloud-03.png'), null, '0% da quota');

  const ticketPrints = path.join(root, 'Como acompanhar seus chamados no Painel Novo da StayCloud/prints');
  await page.goto('https://beta.staycloud.com/dashboard', { waitUntil: 'networkidle2' });
  await screenshot(page, path.join(ticketPrints, 'acompanhar-chamados-painel-novo-staycloud-01.png'), 'a[href="/dashboard/suporte"]');
  await page.goto('https://beta.staycloud.com/dashboard/suporte', { waitUntil: 'networkidle2' });
  await screenshot(page, path.join(ticketPrints, 'acompanhar-chamados-painel-novo-staycloud-02.png'), null, 'Meus chamados');
  if (!(await clickText(page, 'Meus chamados'))) throw new Error('A opcao Meus chamados nao foi encontrada no Painel Novo.');
  await screenshot(page, path.join(ticketPrints, 'acompanhar-chamados-painel-novo-staycloud-03.png'), null, 'em andamento 0');

  await browser.close();
  console.log('CAPTURA_CONCLUIDA');
}

main().catch((error) => {
  console.error(`CAPTURA_INTERROMPIDA: ${error.message}`);
  process.exitCode = 1;
});
