const sharp = require('sharp');
const path = require('path');

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1e3a5f"/>
  <text x="256" y="300" font-family="Arial, sans-serif" font-size="140" font-weight="bold" fill="white" text-anchor="middle">AN</text>
  <path d="M256 80 L283 148 L355 148 L297 192 L324 260 L256 213 L188 260 L215 192 L157 148 L229 148 Z" fill="#f59e0b"/>
</svg>
`;

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(publicDir, `pwa-${size}x${size}.png`);
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: pwa-${size}x${size}.png`);
  }
  console.log('PWA icons generated successfully!');
}

generateIcons().catch(console.error);
