// ========================================================
// CozyStudy: Kampüs Ağaçları, Banklar & Fenerler (Campus Sprites)
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createCampusSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, c, w = 1, h = 1) => px(ctx, x, y, c, w, h);

  // 1. Kampüs Meşe Ağacı (56x70)
  cache['campus_tree_oak'] = createPixelCanvas(56, 70, (ctx) => {
    drawPx(ctx, 22, 38, '#3d2010', 12, 30);
    drawPx(ctx, 24, 38, '#5e3419', 8, 28);
    drawPx(ctx, 18, 62, '#2d1508', 6, 6);
    drawPx(ctx, 32, 62, '#2d1508', 6, 6);
    drawPx(ctx, 6, 12, '#1b4332', 44, 32);
    drawPx(ctx, 10, 6, '#2d6a4f', 36, 34);
    drawPx(ctx, 14, 2, '#40916c', 28, 26);
    drawPx(ctx, 18, 4, '#52b788', 20, 16);
    drawPx(ctx, 22, 6, '#74c69d', 12, 10);
  });

  // 2. Pembe Kiraz Çiçeği Ağacı (56x70)
  cache['campus_tree_cherry'] = createPixelCanvas(56, 70, (ctx) => {
    drawPx(ctx, 22, 38, '#3d2010', 12, 30);
    drawPx(ctx, 24, 38, '#5e3419', 8, 28);
    drawPx(ctx, 6, 12, '#c9184a', 44, 32);
    drawPx(ctx, 10, 6, '#ff4d6d', 36, 34);
    drawPx(ctx, 14, 2, '#ff758f', 28, 26);
    drawPx(ctx, 18, 4, '#ff8fa3', 20, 16);
    drawPx(ctx, 22, 6, '#ffb3c6', 12, 10);
    drawPx(ctx, 26, 8, '#ffe5ec', 6, 6);
  });

  // 3. Ferforje & Ahşap Kampüs Bankı (48x28)
  cache['campus_bench'] = createPixelCanvas(48, 28, (ctx) => {
    drawPx(ctx, 4, 8, '#1e293b', 4, 18);
    drawPx(ctx, 40, 8, '#1e293b', 4, 18);
    drawPx(ctx, 2, 22, '#0f172a', 8, 4);
    drawPx(ctx, 38, 22, '#0f172a', 8, 4);

    for (let y = 6; y < 16; y += 3) {
      drawPx(ctx, 6, y, '#783819', 36, 2);
      drawPx(ctx, 7, y, '#9c5a2b', 34, 1);
    }
    drawPx(ctx, 6, 17, '#5e3419', 36, 4);
    drawPx(ctx, 7, 18, '#854f2c', 34, 2);
  });

  // 4. Viktoryen Kampüs Sokak Feneri (16x56)
  cache['campus_lamppost'] = createPixelCanvas(16, 56, (ctx) => {
    drawPx(ctx, 4, 50, '#1c1917', 8, 6);
    drawPx(ctx, 6, 14, '#292524', 4, 38);
    drawPx(ctx, 7, 14, '#44403c', 2, 38);
    drawPx(ctx, 3, 4, '#1c1917', 10, 10);
    drawPx(ctx, 4, 5, '#fef08a', 8, 8);
    drawPx(ctx, 6, 7, '#ffffff', 4, 4);
    drawPx(ctx, 6, 1, '#1c1917', 4, 3);
  });

  return cache;
}
