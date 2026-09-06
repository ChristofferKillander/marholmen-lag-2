// `expo export --platform web` (classic, non-router entry) emits a bare
// index.html with no manifest link or Apple "add to home screen" meta tags.
// Run this right after export to patch them in, so the deployed app is a
// real installable PWA. Idempotent — safe to run more than once.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', '..', 'public', 'index.html');

if (!existsSync(htmlPath)) {
  console.error(`inject-pwa-head: ${htmlPath} not found — did the export step run first?`);
  process.exit(1);
}

let html = readFileSync(htmlPath, 'utf8');

if (html.includes('rel="manifest"')) {
  console.log('inject-pwa-head: tags already present, skipping.');
  process.exit(0);
}

const tags = `  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#0e0b14">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Vibe Check">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>`;

html = html.replace('</head>', tags);
writeFileSync(htmlPath, html, 'utf8');
console.log(`inject-pwa-head: patched ${htmlPath}`);
