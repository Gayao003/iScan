const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateIconPNG(size) {
  const width = size;
  const height = size;

  // Raw uncompressed scanline data: (1 filter byte + width * 4 bytes per pixel) * height
  const rawData = Buffer.alloc((1 + width * 4) * height);

  const bgR = 0x1E, bgG = 0x40, bgB = 0xAF; // Primary blue #1e40af
  const fgR = 0xFF, fgG = 0xFF, fgB = 0xFF; // White
  const cyanR = 0x60, cyanG = 0xA5, cyanB = 0xFA; // Light blue #60a5fa

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      // Rounded corner check
      const radius = size * 0.22;
      let inCorner = false;
      const cornerDists = [
        [x - radius, y - radius],
        [x - (width - radius), y - radius],
        [x - radius, y - (height - radius)],
        [x - (width - radius), y - (height - radius)],
      ];

      if (x < radius && y < radius && Math.hypot(cornerDists[0][0], cornerDists[0][1]) > radius) inCorner = true;
      if (x > width - radius && y < radius && Math.hypot(cornerDists[1][0], cornerDists[1][1]) > radius) inCorner = true;
      if (x < radius && y > height - radius && Math.hypot(cornerDists[2][0], cornerDists[2][1]) > radius) inCorner = true;
      if (x > width - radius && y > height - radius && Math.hypot(cornerDists[3][0], cornerDists[3][1]) > radius) inCorner = true;

      if (inCorner) {
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0; // Transparent
        continue;
      }

      // Scanner frame borders (dashed/corners)
      const pad = size * 0.18;
      const innerW = width - 2 * pad;
      const innerH = height - 2 * pad;
      const stroke = Math.max(3, Math.round(size * 0.04));

      // Barcode bars inside frame
      const barTop = size * 0.32;
      const barBottom = size * 0.68;
      const isBarArea = (y >= barTop && y <= barBottom && x >= pad + size * 0.08 && x <= width - pad - size * 0.08);

      let isBarPixel = false;
      if (isBarArea) {
        const normX = (x - (pad + size * 0.08)) / (width - 2 * pad - size * 0.16);
        // Barcode pattern: alternating bars
        const barPattern = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1];
        const barIndex = Math.floor(normX * barPattern.length);
        if (barPattern[barIndex] === 1) {
          isBarPixel = true;
        }
      }

      // Horizontal laser beam line across middle
      const laserY = Math.floor(height / 2);
      const isLaser = Math.abs(y - laserY) <= Math.max(1, Math.round(size * 0.015)) && (x >= pad * 0.8 && x <= width - pad * 0.8);

      // Frame corner brackets
      const isFrameBracket = (
        ((x >= pad && x <= pad + stroke) || (x >= width - pad - stroke && x <= width - pad)) &&
        ((y >= pad && y <= pad + size * 0.15) || (y >= height - pad - size * 0.15 && y <= height - pad))
      ) || (
        ((y >= pad && y <= pad + stroke) || (y >= height - pad - stroke && y <= height - pad)) &&
        ((x >= pad && x <= pad + size * 0.15) || (x >= width - pad - size * 0.15 && x <= width - pad))
      );

      if (isLaser) {
        rawData[offset++] = 0x38;
        rawData[offset++] = 0xBD;
        rawData[offset++] = 0xF8; // Bright cyan laser #38bdf8
        rawData[offset++] = 255;
      } else if (isFrameBracket) {
        rawData[offset++] = cyanR;
        rawData[offset++] = cyanG;
        rawData[offset++] = cyanB;
        rawData[offset++] = 255;
      } else if (isBarPixel) {
        rawData[offset++] = fgR;
        rawData[offset++] = fgG;
        rawData[offset++] = fgB;
        rawData[offset++] = 255;
      } else {
        // Deep blue background
        rawData[offset++] = bgR;
        rawData[offset++] = bgG;
        rawData[offset++] = bgB;
        rawData[offset++] = 255;
      }
    }
  }

  // Compress with zlib
  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk: width(4), height(4), bitDepth(1), colorType(1=6 RGBA), comp(1), filter(1), interlace(1)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // 8-bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // standard filter
  ihdr[12] = 0; // no interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icon-192.png, icon-512.png, and apple-touch-icon.png
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), generateIconPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), generateIconPNG(512));
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), generateIconPNG(180));
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), generateIconPNG(64));

console.log('✅ Generated crisp PWA PNG icons:');
console.log(' - public/icons/icon-192.png');
console.log(' - public/icons/icon-512.png');
console.log(' - public/apple-touch-icon.png');
console.log(' - public/favicon.ico');
