/**
 * Script para unificar os builds dos dois sites em uma unica pasta dist/
 *
 * Estrutura final:
 * dist/
 * ├── index.html          (site igreja)
 * ├── assets/             (assets igreja)
 * └── escolaAviva/
 *     ├── index.html      (escola aviva)
 *     └── assets/         (assets escola)
 */

import { cpSync, rmSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const distDir = join(rootDir, 'dist');
const igrejaDist = join(rootDir, 'sites', 'igreja', 'dist');
const escolaDist = join(rootDir, 'sites', 'escola-aviva', 'dist');

console.log('Unificando builds...\n');

// 1. Limpar dist existente
if (existsSync(distDir)) {
  console.log('Removendo dist anterior...');
  rmSync(distDir, { recursive: true, force: true });
}

// 2. Criar pasta dist
mkdirSync(distDir, { recursive: true });

// 3. Copiar build da igreja para dist/ (raiz)
if (existsSync(igrejaDist)) {
  console.log('Copiando site igreja para dist/...');
  cpSync(igrejaDist, distDir, { recursive: true });
} else {
  console.error('ERRO: Build da igreja nao encontrado em:', igrejaDist);
  process.exit(1);
}

// 4. Copiar build da escola para dist/escolaAviva/
if (existsSync(escolaDist)) {
  const escolaDestDir = join(distDir, 'escolaAviva');
  console.log('Copiando Escola Aviva para dist/escolaAviva/...');
  mkdirSync(escolaDestDir, { recursive: true });
  cpSync(escolaDist, escolaDestDir, { recursive: true });
} else {
  console.error('ERRO: Build da Escola Aviva nao encontrado em:', escolaDist);
  process.exit(1);
}

// 5. Criar arquivo 404.html para SPA routing (copia do index.html principal)
const indexHtml = join(distDir, 'index.html');
const notFoundHtml = join(distDir, '404.html');
if (existsSync(indexHtml)) {
  console.log('Criando 404.html para SPA routing...');
  copyFileSync(indexHtml, notFoundHtml);
}

// 6. Criar 404.html para a escola tambem
const escolaIndexHtml = join(distDir, 'escolaAviva', 'index.html');
const escolaNotFoundHtml = join(distDir, 'escolaAviva', '404.html');
if (existsSync(escolaIndexHtml)) {
  console.log('Criando escolaAviva/404.html para SPA routing...');
  copyFileSync(escolaIndexHtml, escolaNotFoundHtml);
}

console.log('\nBuild unificado com sucesso!');
console.log('\nEstrutura final:');
console.log('dist/');
console.log('├── index.html (site igreja)');
console.log('├── 404.html');
console.log('├── assets/');
console.log('└── escolaAviva/');
console.log('    ├── index.html (escola aviva)');
console.log('    ├── 404.html');
console.log('    └── assets/');
