const fs = require('fs');
const path = require('path');
const os = require('os');

// The .docx file path
const docxPath = String.raw`C:\Users\31235\Downloads\Java_EE核心框架技术结课报告(2).docx`;
console.log('Reading:', docxPath);

// Read the file as a buffer (docx is a zip file)
const data = fs.readFileSync(docxPath);

// Find the document.xml entry in the ZIP
// Simple ZIP local file header parsing
let offset = 0;
let found = false;

function readU16( buf, off ) { return buf.readUInt16LE(off); }
function readU32( buf, off ) { return buf.readUInt32LE(off); }

while (offset < data.length - 30) {
    // Local file header signature: 0x04034b50
    if (readU32(data, offset) !== 0x04034b50) {
        offset++;
        continue;
    }

    const compressionMethod = readU16(data, offset + 8);
    const compressedSize = readU32(data, offset + 18);
    const uncompressedSize = readU32(data, offset + 22);
    const fileNameLength = readU16(data, offset + 26);
    const extraFieldLength = readU16(data, offset + 28);

    const fileName = data.toString('utf8', offset + 30, offset + 30 + fileNameLength);

    if (fileName === 'word/document.xml') {
        found = true;
        const dataStart = offset + 30 + fileNameLength + extraFieldLength;
        let content;

        if (compressionMethod === 0) {
            // Stored (no compression)
            content = data.slice(dataStart, dataStart + compressedSize);
        } else if (compressionMethod === 8) {
            // Deflated
            const zlib = require('zlib');
            const raw = data.slice(dataStart, dataStart + compressedSize);
            content = zlib.inflateRawSync(raw);
        } else {
            console.error('Unsupported compression method:', compressionMethod);
            process.exit(1);
        }

        const xml = content.toString('utf8');
        // Strip XML tags
        const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(text);
        break;
    }

    offset += 30 + fileNameLength + extraFieldLength + compressedSize;
}

if (!found) {
    console.error('word/document.xml not found in the ZIP');
    // List entries
    offset = 0;
    while (offset < data.length - 30) {
        if (readU32(data, offset) !== 0x04034b50) { offset++; continue; }
        const fileNameLength = readU16(data, offset + 26);
        const extraFieldLength = readU16(data, offset + 28);
        const compressedSize = readU32(data, offset + 18);
        const fileName = data.toString('utf8', offset + 30, offset + 30 + fileNameLength);
        console.log('  Entry:', fileName);
        offset += 30 + fileNameLength + extraFieldLength + compressedSize;
        if (offset > 50000) break;
    }
}
