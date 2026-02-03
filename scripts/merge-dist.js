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

import { cpSync, rmSync, mkdirSync, existsSync, copyFileSync, writeFileSync } from 'fs';
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

// 5. Criar arquivo 404.html unificado para SPA routing
// GitHub Pages so usa o 404.html da raiz, entao precisamos de um script inteligente
const notFoundHtml = join(distDir, '404.html');
console.log('Criando 404.html unificado para SPA routing...');

const unified404Content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Aviva Nacoes</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages - Unified 404 handler
      // Detecta automaticamente qual site (igreja ou escolaAviva) e redireciona corretamente

      var l = window.location;
      var pathname = l.pathname;

      // Verifica se e uma rota do escolaAviva
      var isEscolaAviva = pathname.indexOf('/AvivaNacoes/escolaAviva') === 0;

      // Define pathSegmentsToKeep baseado no site
      // /AvivaNacoes/ = 1 segmento (igreja)
      // /AvivaNacoes/escolaAviva/ = 2 segmentos (escola)
      var pathSegmentsToKeep = isEscolaAviva ? 2 : 1;

      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>`;

writeFileSync(notFoundHtml, unified404Content);

// 7. Criar arquivo .nojekyll para GitHub Pages (necessario para servir subpastas)
const nojekyllFile = join(distDir, '.nojekyll');
console.log('Criando .nojekyll para GitHub Pages...');
writeFileSync(nojekyllFile, '');

console.log('\nBuild unificado com sucesso!');
console.log('\nEstrutura final:');
console.log('dist/');
console.log('├── .nojekyll');
console.log('├── index.html (site igreja)');
console.log('├── 404.html (unificado - detecta igreja ou escola)');
console.log('├── assets/');
console.log('└── escolaAviva/');
console.log('    ├── index.html (escola aviva)');
console.log('    └── assets/');
