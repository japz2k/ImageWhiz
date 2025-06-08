const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destDir = path.resolve(__dirname, 'public');
const dest = path.resolve(destDir, 'pdf.worker.min.js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Copied pdf.worker.min.mjs to public/pdf.worker.min.js'); 