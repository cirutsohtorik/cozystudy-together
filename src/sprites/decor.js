// ========================================================
// CozyStudy: Dekor, Kedi Pamuk ve Sarılma Piksel Çizimleri
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createCatSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);

  // 1. Kıvrılıp Uyuyan Pamuk
  cache['cat_sleeping'] = createPixelCanvas(24, 18, (ctx) => {
    drawPx(ctx, 4, 5, '#b85a21', 16, 10);
    drawPx(ctx, 5, 6, '#e07a38', 14, 8);
    drawPx(ctx, 7, 7, '#f49d5c', 10, 6);
    drawPx(ctx, 9, 10, '#ffffff', 6, 4);
    drawPx(ctx, 3, 4, '#8c3a0d', 3, 3);
    drawPx(ctx, 7, 4, '#8c3a0d', 3, 3);
    drawPx(ctx, 19, 8, '#b85a21', 3, 6);
    drawPx(ctx, 17, 13, '#e07a38', 5, 2);
    drawPx(ctx, 5, 8, '#3d1b06', 2, 1);
    drawPx(ctx, 19, 2, '#74c0fc', 3, 2);
  });

  // 2. Mırıldayan / Sevgi Dolu Pamuk
  cache['cat_purring'] = createPixelCanvas(24, 18, (ctx) => {
    drawPx(ctx, 4, 5, '#b85a21', 16, 11);
    drawPx(ctx, 5, 6, '#e07a38', 14, 9);
    drawPx(ctx, 7, 7, '#f49d5c', 10, 7);
    drawPx(ctx, 9, 11, '#ffffff', 6, 4);
    drawPx(ctx, 4, 1, '#8c3a0d', 4, 4);
    drawPx(ctx, 10, 1, '#8c3a0d', 4, 4);
    drawPx(ctx, 5, 6, '#3d1b06', 3, 2);
    drawPx(ctx, 10, 6, '#3d1b06', 3, 2);
    drawPx(ctx, 8, 8, '#f7a8a8', 2, 1);
    drawPx(ctx, 17, 0, '#e85d75', 4, 3);
    drawPx(ctx, 18, 1, '#fff', 1, 1);
  });

  // 3. Oturan / Uyanık Pamuk
  cache['cat_sitting'] = createPixelCanvas(24, 20, (ctx) => {
    drawPx(ctx, 6, 8, '#b85a21', 12, 11);
    drawPx(ctx, 7, 9, '#e07a38', 10, 9);
    drawPx(ctx, 9, 11, '#ffffff', 6, 7);
    drawPx(ctx, 6, 3, '#b85a21', 12, 7);
    drawPx(ctx, 7, 4, '#e07a38', 10, 5);
    drawPx(ctx, 6, 0, '#8c3a0d', 3, 4);
    drawPx(ctx, 15, 0, '#8c3a0d', 3, 4);
    drawPx(ctx, 7, 1, '#ffc9c9', 1, 2);
    drawPx(ctx, 16, 1, '#ffc9c9', 1, 2);
    drawPx(ctx, 8, 5, '#2e7d32', 2, 2);
    drawPx(ctx, 14, 5, '#2e7d32', 2, 2);
    drawPx(ctx, 8, 5, '#ffffff', 1, 1);
    drawPx(ctx, 14, 5, '#ffffff', 1, 1);
    drawPx(ctx, 11, 7, '#f7a8a8', 2, 1);
    drawPx(ctx, 17, 12, '#b85a21', 4, 5);
    drawPx(ctx, 18, 10, '#e07a38', 3, 3);
  });

  return cache;
}

export function createHugSprite() {
  const cache = {};
  const drawPx = (ctx, x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);

  cache['hug'] = createPixelCanvas(38, 34, (ctx) => {
    drawPx(ctx, 8, 23, '#2d3e54', 4, 6);
    drawPx(ctx, 22, 23, '#c9a885', 4, 6);
    drawPx(ctx, 7, 28, '#382519', 5, 3);
    drawPx(ctx, 23, 28, '#523420', 5, 3);

    drawPx(ctx, 6, 14, '#2e6b3f', 12, 10);
    drawPx(ctx, 17, 14, '#7d53b8', 12, 10);

    drawPx(ctx, 10, 16, '#c28253', 15, 4);
    drawPx(ctx, 12, 18, '#fff0e6', 13, 4);

    drawPx(ctx, 4, 5, '#c28253', 11, 10);
    drawPx(ctx, 19, 5, '#fff0e6', 11, 10);

    drawPx(ctx, 3, 3, '#24150b', 12, 5);
    drawPx(ctx, 18, 2, '#0c121d', 14, 6);
    drawPx(ctx, 22, 2, '#366aa3', 5, 2);
    drawPx(ctx, 30, 4, '#e76f51', 3, 3);

    drawPx(ctx, 6, 9, '#1a0e07', 3, 1);
    drawPx(ctx, 23, 9, '#121f33', 3, 1);
    drawPx(ctx, 5, 10, '#b86657', 3, 2);
    drawPx(ctx, 25, 10, '#ff94a2', 3, 2);
  });

  return cache;
}

export function createDecorSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);

  // 1. Monstera Saksı Çiçeği 🌿
  cache['plant_monstera'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 5, 20, '#b85c38', 14, 10);
    drawPx(ctx, 4, 19, '#8c3d1f', 16, 2);
    drawPx(ctx, 6, 8, '#266332', 10, 11);
    drawPx(ctx, 2, 10, '#368545', 7, 7);
    drawPx(ctx, 13, 6, '#49a35b', 8, 8);
    drawPx(ctx, 9, 3, '#62bf76', 6, 5);
  });

  // 2. Sıcak Masa Lambası 💡
  cache['vintage_lamp'] = createPixelCanvas(20, 28, (ctx) => {
    drawPx(ctx, 7, 20, '#b8860b', 6, 4);
    drawPx(ctx, 9, 10, '#d4af37', 2, 10);
    drawPx(ctx, 4, 6, '#2d5a27', 12, 6);
    drawPx(ctx, 6, 12, '#ffeaa7', 8, 4);
  });

  // 3. Kalp Kilim 🌸
  cache['heart_rug'] = createPixelCanvas(42, 28, (ctx) => {
    drawPx(ctx, 6, 4, '#e56b6f', 12, 12);
    drawPx(ctx, 24, 4, '#e56b6f', 12, 12);
    drawPx(ctx, 4, 8, '#e56b6f', 34, 12);
    drawPx(ctx, 10, 20, '#e56b6f', 22, 5);
    drawPx(ctx, 16, 25, '#e56b6f', 10, 3);
    drawPx(ctx, 14, 10, '#fff0f3', 14, 8);
  });

  // 4. Kedi Yatağı / Minderi 🐱
  cache['cat_cushion'] = createPixelCanvas(28, 20, (ctx) => {
    drawPx(ctx, 2, 4, '#83c5be', 24, 12);
    drawPx(ctx, 4, 2, '#a8dadc', 20, 14);
    drawPx(ctx, 8, 6, '#ffffff', 12, 6);
  });

  // 5. Yıldızlı Peri Feneri 🏮
  cache['star_lantern'] = createPixelCanvas(20, 28, (ctx) => {
    drawPx(ctx, 9, 0, '#4a4a4a', 2, 8);
    drawPx(ctx, 5, 8, '#262626', 10, 14);
    drawPx(ctx, 6, 9, '#ffd166', 8, 12);
    drawPx(ctx, 8, 12, '#ffffff', 4, 5);
  });

  return cache;
}
