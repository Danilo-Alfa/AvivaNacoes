import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function optimizeImages() {
  console.log('🖼️  Otimizando imagens...\n');

  // Criar pasta de backup se não existir
  const backupDir = join(publicDir, 'backup-originals');
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  // 1. Otimizar hero-bg.jpg
  console.log('1. Otimizando hero-bg.jpg...');
  const heroBgPath = join(publicDir, 'hero-bg.jpg');
  if (existsSync(heroBgPath)) {
    // Backup
    await sharp(heroBgPath).toFile(join(backupDir, 'hero-bg-original.jpg'));

    // Criar versão WebP otimizada
    await sharp(heroBgPath)
      .resize(1920, 600, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(join(publicDir, 'hero-bg.webp'));

    // Criar versão mobile menor
    await sharp(heroBgPath)
      .resize(768, 400, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(join(publicDir, 'hero-bg-mobile.webp'));

    // Otimizar o JPG original também
    await sharp(heroBgPath)
      .resize(1920, 600, { fit: 'cover' })
      .jpeg({ quality: 80, progressive: true })
      .toFile(join(publicDir, 'hero-bg-optimized.jpg'));

    const originalSize = (await sharp(join(backupDir, 'hero-bg-original.jpg')).metadata()).size;
    const webpSize = (await sharp(join(publicDir, 'hero-bg.webp')).metadata()).size;
    console.log(`   ✅ hero-bg.webp criado`);
    console.log(`   ✅ hero-bg-mobile.webp criado`);
    console.log(`   ✅ hero-bg-optimized.jpg criado\n`);
  }

  // 2. Otimizar logoheader.png
  console.log('2. Otimizando logoheader.png...');
  const logoHeaderPath = join(publicDir, 'logoheader.png');
  if (existsSync(logoHeaderPath)) {
    // Backup
    await sharp(logoHeaderPath).toFile(join(backupDir, 'logoheader-original.png'));

    // Criar versão WebP (tamanho usado: 56x56 no header)
    await sharp(logoHeaderPath)
      .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }) // 2x para retina
      .webp({ quality: 90 })
      .toFile(join(publicDir, 'logoheader.webp'));

    // Otimizar PNG original
    await sharp(logoHeaderPath)
      .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true })
      .toFile(join(publicDir, 'logoheader-optimized.png'));

    console.log(`   ✅ logoheader.webp criado`);
    console.log(`   ✅ logoheader-optimized.png criado\n`);
  }

  // 3. Otimizar logo.png
  console.log('3. Otimizando logo.png...');
  const logoPath = join(publicDir, 'logo.png');
  if (existsSync(logoPath)) {
    // Backup
    await sharp(logoPath).toFile(join(backupDir, 'logo-original.png'));

    // Criar versão WebP (tamanho razoável para uso geral)
    await sharp(logoPath)
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90 })
      .toFile(join(publicDir, 'logo.webp'));

    // Otimizar PNG original
    await sharp(logoPath)
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true })
      .toFile(join(publicDir, 'logo-optimized.png'));

    console.log(`   ✅ logo.webp criado`);
    console.log(`   ✅ logo-optimized.png criado\n`);
  }

  console.log('✨ Otimização concluída!');
  console.log('📁 Originais salvos em: public/backup-originals/');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Substitua as imagens originais pelas otimizadas');
  console.log('   2. Atualize o código para usar WebP com fallback');
}

optimizeImages().catch(console.error);
