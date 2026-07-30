import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });

  const blue = { r: 37, g: 99, b: 235, a: 255 };      // #2563eb
  const white = { r: 255, g: 255, b: 255, a: 255 };
  const gray = { r: 226, g: 232, b: 240, a: 255 };    // #e2e8f0
  const lineGray = { r: 148, g: 163, b: 184, a: 255 };// #94a3b8
  const amber = { r: 245, g: 158, b: 11, a: 255 };    // #f59e0b
  const darkAmber = { r: 217, g: 119, b: 6, a: 255 };  // #d97706
  const dark = { r: 30, g: 41, b: 59, a: 255 };       // #1e293b
  const redPink = { r: 255, g: 173, b: 173, a: 255 }; // #ffadad

  const margin = Math.floor(size * 0.15);
  const bookX1 = margin + Math.floor(size * 0.05);
  const bookY1 = margin;
  const bookX2 = size - margin;
  const bookY2 = size - margin;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Background - Rounded rect blue
      let color = blue;

      // Book cover
      if (x >= bookX1 && x <= bookX2 && y >= bookY1 && y <= bookY2) {
        color = white;
        // Border
        if (x <= bookX1 + 2 || x >= bookX2 - 2 || y <= bookY1 + 2 || y >= bookY2 - 2) {
          color = gray;
        }
        // Red vertical line
        const redX = bookX1 + Math.floor((bookX2 - bookX1) * 0.18);
        if (x >= redX - 1 && x <= redX + 1) {
          color = redPink;
        }
        // Horizontal text lines
        const lineSpacing = Math.floor((bookY2 - bookY1) / 5);
        for (let i = 1; i <= 3; i++) {
          const lineY = bookY1 + i * lineSpacing;
          if (y >= lineY - 1 && y <= lineY + 1 && x >= redX + 10 && x <= bookX2 - 15) {
            color = lineGray;
          }
        }
      }

      // Pencil near bottom right
      const pencilX1 = Math.floor(size * 0.6);
      const pencilY1 = Math.floor(size * 0.65);
      const pencilX2 = Math.floor(size * 0.82);
      const pencilY2 = Math.floor(size * 0.77);

      if (x >= pencilX1 && x <= pencilX2 && y >= pencilY1 && y <= pencilY2) {
        color = amber;
        if (x > pencilX2 - 4) color = darkAmber;
      }

      png.data[idx] = color.r;
      png.data[idx + 1] = color.g;
      png.data[idx + 2] = color.b;
      png.data[idx + 3] = color.a;
    }
  }

  const iconsDir = path.dirname(filename);
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  png.pack().pipe(fs.createWriteStream(filename)).on('finish', () => {
    console.log(`Generated ${filename}`);
  });
}

createIcon(192, './icons/icon-192.png');
createIcon(512, './icons/icon-512.png');
