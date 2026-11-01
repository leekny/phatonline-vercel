const fs = require('fs');
const path = require('path');

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const embeddedPublic = {};

function walkPublic(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const relUrl = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      walkPublic(fullPath, relUrl);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.m4a') continue;
      if (
        entry.name === 'temple_stage_bg.png' ||
        entry.name === 'buddha.png' ||
        entry.name === 'amitabha_stage.jpg'
      ) {
        continue;
      }
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      const base64 = fs.readFileSync(fullPath).toString('base64');
      embeddedPublic[relUrl] = { mime, base64 };
    }
  }
}

walkPublic(path.join(__dirname, '..', 'public'));
const ttsWorkerPyBase64 = fs.readFileSync(path.join(__dirname, '..', 'tts_worker.py')).toString('base64');

const outCode = `// Auto-generated embedded assets for single-file ChuaLinhUngLive.exe
module.exports = {
  TTS_WORKER_PY_B64: ${JSON.stringify(ttsWorkerPyBase64)},
  PUBLIC_ASSETS: ${JSON.stringify(embeddedPublic)}
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'embedded-assets.js'), outCode, 'utf8');
console.log('[Embed] Bundled', Object.keys(embeddedPublic).length, 'UI/asset files + tts_worker.py into embedded-assets.js');
