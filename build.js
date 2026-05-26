const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'VT001');
const outDir = path.join(__dirname, 'dist');
const ignoreNames = new Set(['.DS_Store']);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyItem(srcPath, destPath) {
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    ensureDir(destPath);
    for (const child of fs.readdirSync(srcPath)) {
      if (ignoreNames.has(child)) continue;
      copyItem(path.join(srcPath, child), path.join(destPath, child));
    }
  } else if (stat.isFile()) {
    ensureDir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
  }
}

function cleanOut() {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
}

function build() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source folder not found:', srcDir);
    process.exit(1);
  }

  cleanOut();
  copyItem(srcDir, outDir);
  console.log('Build complete: dist/ created from VT001/');
}

build();
