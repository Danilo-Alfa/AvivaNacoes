import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function updateFavicon() {
  const source = join(publicDir, 'pwa-48x48.png');
  const output = join(publicDir, 'favicon.ico');

  // Criar favicon 32x32 a partir do pwa-48x48
  await sharp(source)
    .resize(32, 32)
    .png()
    .toFile(output);

  console.log('Favicon atualizado com sucesso!');
}

updateFavicon().catch(console.error);
