const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/vinicius-alves/.codex/browser-tools/node_modules/puppeteer-core');

const promptPath = '/home/vinicius-alves/tutoriais-staycloud/_prompts/PROMPT_STAYCLOUD_TUTORIAIS_V2.md';
const root = '/home/vinicius-alves/Viny Brain/03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/05 - Como localizar a Central de Ajuda pelo Painel Novo da StayCloud';
const output = path.join(root, 'apoio', 'midias-publicas.json');

const images = [
  {
    etapa: 1,
    file: 'prints-finais/01-menu-suporte-sanitizado.png',
    title: 'Central de Ajuda StayCloud - Menu Suporte',
    alt: 'Menu Suporte destacado para acessar a Central de Ajuda StayCloud.',
    caption: 'Comece pelo menu Suporte no Painel Novo.',
  },
  {
    etapa: 2,
    file: 'prints-finais/02-central-ajuda-sanitizado.png',
    title: 'Central de Ajuda StayCloud - Opcao Central de ajuda',
    alt: 'Opcao Central de ajuda destacada na area de Suporte do Painel Novo.',
    caption: 'A opcao Central de ajuda abre a area de tutoriais do painel.',
  },
  {
    etapa: 3,
    file: 'prints-finais/03-base-conhecimento-sanitizado.png',
    title: 'Central de Ajuda StayCloud - Campo de pesquisa',
    alt: 'Central de Ajuda StayCloud aberta com o campo de pesquisa de tutoriais destacado.',
    caption: 'Use o campo de pesquisa para localizar tutoriais dentro da Central de Ajuda.',
  },
];

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
  await page.goto('https://ajuda.staycloud.com.br/wp-admin/upload.php', { waitUntil: 'networkidle2' });
  if (!(await page.$('#user_login'))) return;
  await page.type('#user_login', secret(prompt, 'Usuario WordPress'));
  await page.type('#user_pass', secret(prompt, 'Senha WordPress'));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#wp-submit'),
  ]);
}

async function existingMedia(page, filename) {
  await page.goto(`https://ajuda.staycloud.com.br/wp-admin/upload.php?mode=list&s=${encodeURIComponent(filename)}`, { waitUntil: 'networkidle2' });
  const matches = await page.$$eval('#the-list tr', (rows, filename) => rows.map((row) => {
    const editLink = Array.from(row.querySelectorAll('a')).find((link) => /post\.php\?post=\d+&action=edit/.test(link.href));
    const title = editLink?.textContent?.trim() || '';
    const edit = editLink?.href || '';
    const file = row.textContent || '';
    return { title, edit, file };
  }).filter((row) => row.edit && (row.file.includes(filename) || row.title.includes(filename.replace(/\.[^.]+$/, '')))), filename);
  return matches[0] || null;
}

async function updateAndReadMedia(page, editUrl, item) {
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  if (await page.$('#title')) {
    await page.$eval('#title', (element, value) => { element.value = value; }, item.title);
  }
  if (await page.$('#attachment_alt')) {
    await page.$eval('#attachment_alt', (element, value) => { element.value = value; }, item.alt);
  }
  if (await page.$('#publish')) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#publish'),
    ]);
  }
  return {
    media_id: Number(new URL(editUrl).searchParams.get('post')),
    public_url: await page.$eval('#attachment_url', (element) => element.value),
  };
}

async function upload(page, item) {
  const filename = path.basename(item.file);
  const duplicate = await existingMedia(page, filename);
  if (duplicate) {
    const existing = await updateAndReadMedia(page, duplicate.edit, item);
    return { ...item, filename, ...existing, sanitizada: true, status: 'existente_atualizada' };
  }

  await page.goto('https://ajuda.staycloud.com.br/wp-admin/media-new.php', { waitUntil: 'networkidle2' });
  const input = await page.$('input[type="file"]');
  if (!input) throw new Error(`Campo de upload da midia nao encontrado em ${page.url()}.`);
  await input.uploadFile(path.join(root, item.file));
  await page.waitForFunction(() => document.querySelectorAll('#media-items .media-item').length > 0, { timeout: 45000 });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const created = await existingMedia(page, filename);
  if (!created) throw new Error(`Upload feito, mas midia nao encontrada na biblioteca: ${filename}`);
  const media = await updateAndReadMedia(page, created.edit, item);
  return { ...item, filename, ...media, sanitizada: true, status: 'enviada' };
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

  const midias = [];
  for (const item of images) midias.push(await upload(page, item));
  await browser.close();

  fs.writeFileSync(output, JSON.stringify({
    tutorial: 'Como localizar a Central de Ajuda pelo Painel Novo da StayCloud',
    origem: 'Upload autorizado por Vinicius em 2026-07-27. Publicacao autorizada.',
    midias,
  }, null, 2));
  console.log('UPLOAD_CONCLUIDO');
}

main().catch((error) => {
  console.error(`UPLOAD_INTERROMPIDO: ${error.message}`);
  process.exitCode = 1;
});
