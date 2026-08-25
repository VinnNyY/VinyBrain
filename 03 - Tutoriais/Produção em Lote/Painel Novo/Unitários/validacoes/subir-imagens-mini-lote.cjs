const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Unitários';
const output = '/tmp/staycloud-mini-lote-imagens.json';

const images = [
  {
    tutorial: 'uso-email',
    file: 'Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints/consultar-uso-email-painel-novo-staycloud-01.png',
    title: 'Consultar uso de e-mail no Painel Novo - Hospedagem',
    alt: 'Tela do Painel Novo da StayCloud destacando a hospedagem para consultar e-mails.',
  },
  {
    tutorial: 'uso-email',
    file: 'Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints/consultar-uso-email-painel-novo-staycloud-02.png',
    title: 'Consultar uso de e-mail no Painel Novo - Aba E-mails',
    alt: 'Tela do Painel Novo da StayCloud destacando a area de e-mails.',
  },
  {
    tutorial: 'uso-email',
    file: 'Como consultar o uso atual de uma conta de e-mail no Painel Novo da StayCloud/prints/consultar-uso-email-painel-novo-staycloud-03.png',
    title: 'Consultar uso de e-mail no Painel Novo - Uso e cota',
    alt: 'Tela do Painel Novo da StayCloud mostrando o uso e a cota de uma conta de e-mail.',
  },
  {
    tutorial: 'chamados',
    file: 'Como acompanhar seus chamados no Painel Novo da StayCloud/prints/acompanhar-chamados-painel-novo-staycloud-01.png',
    title: 'Acompanhar chamados no Painel Novo - Suporte',
    alt: 'Tela do Painel Novo da StayCloud destacando o menu Suporte.',
  },
  {
    tutorial: 'chamados',
    file: 'Como acompanhar seus chamados no Painel Novo da StayCloud/prints/acompanhar-chamados-painel-novo-staycloud-02.png',
    title: 'Acompanhar chamados no Painel Novo - Meus chamados',
    alt: 'Tela do Painel Novo da StayCloud destacando a opcao Meus chamados.',
  },
  {
    tutorial: 'chamados',
    file: 'Como acompanhar seus chamados no Painel Novo da StayCloud/prints/acompanhar-chamados-painel-novo-staycloud-03.png',
    title: 'Acompanhar chamados no Painel Novo - Status',
    alt: 'Tela do Painel Novo da StayCloud mostrando os filtros de status dos chamados.',
  },
];

function secret(prompt, label) {
  const match = prompt.match(new RegExp(label + ':\\s*`([^`]+)`'));
  if (!match) throw new Error(`Credencial autorizada nao encontrada: ${label}`);
  return match[1];
}

async function login(page, prompt) {
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/upload.php', { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
}

async function ensureNotDuplicate(page, filename) {
  await page.goto(`https://ajuda.staycloud.com.br/wp-admin/upload.php?mode=list&s=${encodeURIComponent(filename)}`, { waitUntil: 'networkidle2' });
  const rows = await page.$$('#the-list tr');
  if (rows.length) throw new Error(`Duplicidade detectada para ${filename}; upload bloqueado.`);
}

async function upload(page, item) {
  const filename = path.basename(item.file);
  await ensureNotDuplicate(page, filename);
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/media-new.php', { waitUntil: 'networkidle2' });
  const input = await page.$('input[type="file"]');
  if (!input) {
    await page.screenshot({ path: '/tmp/staycloud-wordpress-media-debug.png', fullPage: true });
    throw new Error(`Campo de upload da midia nao encontrado em ${page.url()}.`);
  }
  await input.uploadFile(path.join(root, item.file));
  await page.waitForFunction(() => document.querySelectorAll('#media-items .media-item').length > 0, { timeout: 30000 });
  const editUrl = await page.$eval('#media-items .media-item a[href*="post.php"]', element => element.href);
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  await page.$eval('#title', (element, value) => { element.value = value; }, item.title);
  await page.$eval('#attachment_alt', (element, value) => { element.value = value; }, item.alt);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#publish'),
  ]);
  const url = await page.$eval('#attachment_url', element => element.value);
  return { ...item, filename, url };
}

async function main() {
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await login(page, prompt);
  const results = [];
  for (const item of images) results.push(await upload(page, item));
  await browser.close();
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
  console.log('UPLOAD_CONCLUIDO');
}

main().catch((error) => {
  console.error(`UPLOAD_INTERROMPIDO: ${error.message}`);
  process.exitCode = 1;
});
