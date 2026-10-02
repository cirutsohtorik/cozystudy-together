// ========================================================
// CozyStudy: Elde Taşınan Yiyecek, İçecek & Hediyelik Spritelar
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createItemSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, c, w = 1, h = 1) => px(ctx, x, y, c, w, h);

  // 1. Karamel Macchiato Latte
  cache['item_caramel_latte'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 4, 4, '#fdfbf7', 10, 12);
    drawPx(ctx, 5, 7, '#6f4e37', 8, 8);
    drawPx(ctx, 4, 4, '#ffffff', 10, 3);
    drawPx(ctx, 6, 5, '#d97706', 6, 1);
    drawPx(ctx, 13, 6, '#cbd5e1', 3, 6);
  });

  // 2. Pour Over V60 Filtre Kahve
  cache['item_pour_over'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 4, 5, '#e0e7ff', 10, 11);
    drawPx(ctx, 5, 8, '#3d2516', 8, 7);
    drawPx(ctx, 6, 2, '#ffffff', 1, 3);
    drawPx(ctx, 10, 1, '#ffffff', 1, 3);
  });

  // 3. Sıcak Çikolatalı Kurabiye
  cache['item_cookie'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 3, 3, '#d4a373', 12, 12);
    drawPx(ctx, 4, 2, '#bc6c25', 10, 14);
    drawPx(ctx, 5, 5, '#3b1f0c', 2, 2);
    drawPx(ctx, 10, 6, '#3b1f0c', 3, 2);
    drawPx(ctx, 7, 10, '#3b1f0c', 2, 2);
    drawPx(ctx, 11, 11, '#3b1f0c', 2, 2);
  });

  // 4. Fransız Kruvasanı
  cache['item_croissant'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 2, 6, '#b45309', 14, 8);
    drawPx(ctx, 4, 4, '#d97706', 10, 10);
    drawPx(ctx, 6, 3, '#f59e0b', 6, 11);
    drawPx(ctx, 8, 5, '#fbbf24', 3, 4);
  });

  // 5. Papatya Çayı
  cache['item_chamomile_tea'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 4, 5, '#fef9c3', 10, 11);
    drawPx(ctx, 5, 7, '#fef08a', 8, 8);
    drawPx(ctx, 7, 8, '#ffffff', 4, 4);
    drawPx(ctx, 8, 9, '#eab308', 2, 2);
  });

  // 6. Kır Çiçeği Buketi
  cache['item_flower_bouquet'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 7, 9, '#2d6a4f', 4, 8);
    drawPx(ctx, 6, 12, '#e76f51', 6, 2);
    drawPx(ctx, 4, 4, '#ff758f', 4, 4);
    drawPx(ctx, 9, 3, '#ffd166', 4, 4);
    drawPx(ctx, 7, 6, '#a0c4ff', 4, 4);
  });

  // 7. Gurme Kedi Maması
  cache['item_cat_treat'] = createPixelCanvas(18, 18, (ctx) => {
    drawPx(ctx, 3, 6, '#94a3b8', 12, 8);
    drawPx(ctx, 4, 7, '#e2e8f0', 10, 6);
    drawPx(ctx, 7, 9, '#f43f5e', 4, 2);
  });

  return cache;
}
