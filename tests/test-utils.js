import fs from 'fs';
import path from 'path';

export function loadHTML() {
  const htmlPath = path.resolve(__dirname, '../index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`index.html not found at ${htmlPath}`);
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  document.documentElement.innerHTML = html;
  return document;
}
