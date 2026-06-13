const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const INFRA_DIR = 'D:/Projects/bookstore/infra';
const zipPath = path.join(INFRA_DIR, 'nacos-server-2.4.3.zip');
const outDir = path.join(INFRA_DIR, 'nacos');

console.log('Reading ' + zipPath + '...');
const zipData = fs.readFileSync(zipPath);
let i = 0;
let count = 0;

fs.mkdirSync(outDir, { recursive: true });

while (i < zipData.length - 30 && count < 5000) {
  if (zipData.readUInt32LE(i) === 0x04034b50) {
    count++;
    const method = zipData.readUInt16LE(i + 8);
    const nameLen = zipData.readUInt16LE(i + 26);
    const extraLen = zipData.readUInt16LE(i + 28);
    const name = zipData.toString('utf8', i + 30, i + 30 + nameLen);
    const compSize = zipData.readUInt32LE(i + 18);

    if (name.endsWith('/')) {
      i += 30 + nameLen + extraLen + compSize;
      continue;
    }

    const dataStart = i + 30 + nameLen + extraLen;
    let content;
    if (method === 0) {
      content = zipData.slice(dataStart, dataStart + compSize);
    } else if (method === 8) {
      content = zlib.inflateRawSync(zipData.slice(dataStart, dataStart + compSize));
    }

    if (content) {
      const safeName = name.replace(/\\/g, '/');
      const outPath = path.join(outDir, safeName);
      const outDirPath = path.dirname(outPath);
      fs.mkdirSync(outDirPath, { recursive: true });
      fs.writeFileSync(outPath, content);
    }

    i += 30 + nameLen + extraLen + compSize;
  } else { i++; }
}

console.log('Extracted ' + count + ' entries to nacos/');
