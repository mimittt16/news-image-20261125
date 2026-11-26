// The World in One Day — Wednesday, 25 November 2026 (Node 22, standard library only).
// Its image is the entry.png beside this file, and the program validates it as a whole
// PNG (signature, 1024x1024 8-bit RGB/RGBA IHDR first, every chunk's CRC32, exact end at IEND) and copies
// it to /output/entry.png. The gate takes a whole PNG of at most 1 MiB and 1024 by
// 1024 pixels, and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CRC_TABLE: number[] = (() => {
  const table: number[] = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const src = new URL('./entry.png', import.meta.url);
const png = readFileSync(src);

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(PNG_SIG)) throw new Error('entry.png: bad PNG signature');
if (png.length > 1048576) throw new Error(`entry.png: ${png.length} bytes exceeds 1 MiB`);

let off = 8;
let sawIhdr = false;
let sawIend = false;
while (off < png.length) {
  if (off + 8 > png.length) throw new Error('entry.png: truncated chunk header');
  const len = png.readUInt32BE(off);
  const type = png.subarray(off + 4, off + 8).toString('latin1');
  const dataEnd = off + 8 + len;
  if (dataEnd + 4 > png.length) throw new Error(`entry.png: truncated ${type} chunk`);
  const storedCrc = png.readUInt32BE(dataEnd);
  const actualCrc = crc32(Buffer.concat([png.subarray(off + 4, off + 8), png.subarray(off + 8, dataEnd)]));
  if (storedCrc !== actualCrc) throw new Error(`entry.png: CRC32 mismatch in ${type} chunk`);
  if (type === 'IHDR') {
    sawIhdr = true;
    if (off !== 8) throw new Error('entry.png: IHDR is not the first chunk');
    if (len !== 13) throw new Error(`entry.png: IHDR length ${len}, expected 13`);
    const w = png.readUInt32BE(off + 8);
    const h = png.readUInt32BE(off + 12);
    if (w !== 1024 || h !== 1024) throw new Error(`entry.png: ${w}x${h}, expected 1024x1024`);
    const bitDepth = png[off + 16];
    const colorType = png[off + 17];
    if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
      throw new Error(`entry.png: bit depth ${bitDepth}, color type ${colorType}, expected 8-bit RGB/RGBA`);
    }
  }
  if (type === 'IEND') {
    sawIend = true;
    if (dataEnd + 4 !== png.length) throw new Error('entry.png: trailing bytes after IEND');
    break;
  }
  off = dataEnd + 4;
}
if (!sawIhdr) throw new Error('entry.png: missing IHDR');
if (!sawIend) throw new Error('entry.png: missing IEND');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
