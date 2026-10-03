// ========================================================
// CozyStudy: Yurt Odası Eşyaları Piksel Çizimleri (Dormitory Assets)
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createDormSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, c, w = 1, h = 1) => px(ctx, x, y, c, w, h);

  // 1. Can'ın Yatağı (Tam, Baz & Yorgan Katmanları)
  cache['bed_can'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 4, 4, '#381c0c', 60, 16);
    drawPx(ctx, 6, 6, '#5e3419', 56, 12);
    drawPx(ctx, 6, 20, '#2e1507', 56, 56);
    drawPx(ctx, 14, 10, '#e2e8f0', 40, 12);
    drawPx(ctx, 16, 11, '#ffffff', 36, 10);
    drawPx(ctx, 22, 13, '#cbd5e1', 24, 2);
    drawPx(ctx, 8, 24, '#1b4332', 52, 50);
    drawPx(ctx, 10, 26, '#2d6a4f', 48, 46);

    for (let y = 30; y < 70; y += 8) {
      drawPx(ctx, 10, y, '#40916c', 48, 1);
    }
    for (let x = 16; x < 54; x += 10) {
      drawPx(ctx, x, 26, '#40916c', 1, 46);
    }

    drawPx(ctx, 8, 22, '#f8f9fa', 52, 5);
    drawPx(ctx, 10, 23, '#e9ecef', 48, 3);
    drawPx(ctx, 20, 5, '#1b4332', 28, 5);
    drawPx(ctx, 24, 6, '#52b788', 20, 3);
    drawPx(ctx, 58, 64, '#2d3e54', 6, 8);
    drawPx(ctx, 59, 65, '#415a77', 4, 6);
  });

  cache['bed_can_base'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 4, 4, '#381c0c', 60, 16);
    drawPx(ctx, 6, 6, '#5e3419', 56, 12);
    drawPx(ctx, 6, 20, '#2e1507', 56, 56);
    drawPx(ctx, 14, 10, '#e2e8f0', 40, 12);
    drawPx(ctx, 16, 11, '#ffffff', 36, 10);
    drawPx(ctx, 22, 13, '#cbd5e1', 24, 2);
    drawPx(ctx, 20, 5, '#1b4332', 28, 5);
    drawPx(ctx, 24, 6, '#52b788', 20, 3);
  });

  cache['bed_can_blanket'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 8, 24, '#1b4332', 52, 50);
    drawPx(ctx, 10, 26, '#2d6a4f', 48, 46);

    for (let y = 30; y < 70; y += 8) {
      drawPx(ctx, 10, y, '#40916c', 48, 1);
    }
    for (let x = 16; x < 54; x += 10) {
      drawPx(ctx, x, 26, '#40916c', 1, 46);
    }

    drawPx(ctx, 8, 22, '#f8f9fa', 52, 5);
    drawPx(ctx, 10, 23, '#e9ecef', 48, 3);
    drawPx(ctx, 58, 64, '#2d3e54', 6, 8);
    drawPx(ctx, 59, 65, '#415a77', 4, 6);
  });

  // 2. Sezen'in Yatağı (Tam, Baz & Yorgan Katmanları)
  cache['bed_sezen'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 4, 4, '#4a2511', 60, 16);
    drawPx(ctx, 6, 6, '#733c1d', 56, 12);
    drawPx(ctx, 6, 20, '#381c0c', 56, 56);
    drawPx(ctx, 14, 10, '#f1eaee', 40, 12);
    drawPx(ctx, 16, 11, '#fffafd', 36, 10);
    drawPx(ctx, 48, 8, '#e76f51', 5, 4);
    drawPx(ctx, 49, 9, '#f4a261', 2, 2);
    drawPx(ctx, 8, 24, '#5c3a8e', 52, 50);
    drawPx(ctx, 10, 26, '#7d53b8', 48, 46);

    for (let y = 30; y < 70; y += 10) {
      drawPx(ctx, 10, y, '#9d4edd', 48, 1);
    }
    const starDots = [[18, 34], [34, 42], [46, 36], [22, 52], [42, 58], [28, 64]];
    starDots.forEach(([sx, sy]) => {
      drawPx(ctx, sx, sy, '#f72585', 2, 2);
      drawPx(ctx, sx, sy, '#ffffff', 1, 1);
    });

    drawPx(ctx, 8, 22, '#fdf0d5', 52, 5);
    drawPx(ctx, 10, 23, '#faedcd', 48, 3);
    drawPx(ctx, 20, 5, '#7209b7', 28, 5);
    drawPx(ctx, 24, 6, '#c77dff', 20, 3);
    drawPx(ctx, 4, 64, '#ffccd5', 6, 8);
    drawPx(ctx, 5, 65, '#ffb3c6', 4, 6);
  });

  cache['bed_sezen_base'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 4, 4, '#4a2511', 60, 16);
    drawPx(ctx, 6, 6, '#733c1d', 56, 12);
    drawPx(ctx, 6, 20, '#381c0c', 56, 56);
    drawPx(ctx, 14, 10, '#f1eaee', 40, 12);
    drawPx(ctx, 16, 11, '#fffafd', 36, 10);
    drawPx(ctx, 48, 8, '#e76f51', 5, 4);
    drawPx(ctx, 49, 9, '#f4a261', 2, 2);
    drawPx(ctx, 20, 5, '#7209b7', 28, 5);
    drawPx(ctx, 24, 6, '#c77dff', 20, 3);
  });

  cache['bed_sezen_blanket'] = createPixelCanvas(68, 80, (ctx) => {
    drawPx(ctx, 8, 24, '#5c3a8e', 52, 50);
    drawPx(ctx, 10, 26, '#7d53b8', 48, 46);

    for (let y = 30; y < 70; y += 10) {
      drawPx(ctx, 10, y, '#9d4edd', 48, 1);
    }
    const starDots = [[18, 34], [34, 42], [46, 36], [22, 52], [42, 58], [28, 64]];
    starDots.forEach(([sx, sy]) => {
      drawPx(ctx, sx, sy, '#f72585', 2, 2);
      drawPx(ctx, sx, sy, '#ffffff', 1, 1);
    });

    drawPx(ctx, 8, 22, '#fdf0d5', 52, 5);
    drawPx(ctx, 10, 23, '#faedcd', 48, 3);
    drawPx(ctx, 4, 64, '#ffccd5', 6, 8);
    drawPx(ctx, 5, 65, '#ffb3c6', 4, 6);
  });

  // 3. Can'ın Çalışma Masası
  cache['table_dorm_can'] = createPixelCanvas(64, 40, (ctx) => {
    drawPx(ctx, 2, 10, '#381c0c', 60, 20);
    drawPx(ctx, 4, 12, '#663b1d', 56, 16);
    drawPx(ctx, 6, 13, '#854f2c', 52, 13);
    drawPx(ctx, 4, 28, '#261307', 56, 4);
    drawPx(ctx, 6, 30, '#261307', 4, 10);
    drawPx(ctx, 54, 30, '#261307', 4, 10);
    drawPx(ctx, 10, 14, '#1e293b', 18, 10);
    drawPx(ctx, 11, 15, '#38bdf8', 16, 7);
    drawPx(ctx, 18, 18, '#ffffff', 2, 2);
    drawPx(ctx, 48, 8, '#1b4332', 10, 5);
    drawPx(ctx, 51, 13, '#d4af37', 2, 6);
    drawPx(ctx, 50, 11, '#ffea75', 6, 3);
  });

  // 4. Sezen'in Çalışma Masası
  cache['table_dorm_sezen'] = createPixelCanvas(64, 40, (ctx) => {
    drawPx(ctx, 2, 10, '#381c0c', 60, 20);
    drawPx(ctx, 4, 12, '#663b1d', 56, 16);
    drawPx(ctx, 6, 13, '#854f2c', 52, 13);
    drawPx(ctx, 4, 28, '#261307', 56, 4);
    drawPx(ctx, 6, 30, '#261307', 4, 10);
    drawPx(ctx, 54, 30, '#261307', 4, 10);
    drawPx(ctx, 36, 14, '#f72585', 16, 10);
    drawPx(ctx, 37, 15, '#fae1eb', 14, 8);
    drawPx(ctx, 34, 18, '#ffffff', 1, 6);
    drawPx(ctx, 12, 14, '#e76f51', 6, 6);
    drawPx(ctx, 13, 11, '#2a9d8f', 4, 4);
    drawPx(ctx, 24, 15, '#c77dff', 5, 5);
  });

  // 5. Yurt Ortak Çift Masası
  cache['table_dorm_couple'] = createPixelCanvas(96, 44, (ctx) => {
    drawPx(ctx, 2, 10, '#381c0c', 92, 22);
    drawPx(ctx, 4, 12, '#663b1d', 88, 18);
    drawPx(ctx, 6, 14, '#8a522d', 84, 14);
    drawPx(ctx, 4, 30, '#241206', 88, 4);
    drawPx(ctx, 8, 32, '#241206', 5, 12);
    drawPx(ctx, 83, 32, '#241206', 5, 12);
    drawPx(ctx, 44, 16, '#faedcd', 8, 7);
    drawPx(ctx, 45, 15, '#d4a373', 6, 2);
    drawPx(ctx, 47, 14, '#ffb703', 2, 2);
  });

  // 6. Ahşap Çift Kapılı Gardırop
  cache['dorm_wardrobe'] = createPixelCanvas(42, 64, (ctx) => {
    drawPx(ctx, 2, 2, '#2b1507', 38, 60);
    drawPx(ctx, 4, 4, '#5c3214', 34, 56);
    drawPx(ctx, 20, 4, '#2b1507', 2, 56);
    drawPx(ctx, 18, 30, '#d4af37', 2, 6);
    drawPx(ctx, 22, 30, '#d4af37', 2, 6);
    drawPx(ctx, 25, 10, '#a8dadc', 10, 36);
    drawPx(ctx, 26, 11, '#f1faee', 8, 34);
  });

  // 7. Kitchenette
  cache['dorm_kitchenette'] = createPixelCanvas(76, 42, (ctx) => {
    drawPx(ctx, 2, 8, '#26170d', 72, 32);
    drawPx(ctx, 4, 10, '#5a351d', 68, 28);
    drawPx(ctx, 6, 10, '#82522e', 64, 5);
    drawPx(ctx, 12, 14, '#94a3b8', 12, 11);
    drawPx(ctx, 14, 15, '#cbd5e1', 8, 9);
    drawPx(ctx, 10, 18, '#334155', 2, 5);
    drawPx(ctx, 24, 16, '#94a3b8', 2, 3);
    drawPx(ctx, 24, 11, '#ffffff', 1, 3);
    drawPx(ctx, 32, 16, '#d97706', 8, 9);
    drawPx(ctx, 46, 17, '#2d6a4f', 5, 6);
    drawPx(ctx, 55, 17, '#7d53b8', 5, 6);
  });

  // 8. Mini Buzdolabı
  cache['dorm_fridge'] = createPixelCanvas(32, 42, (ctx) => {
    drawPx(ctx, 2, 2, '#cbd5e1', 28, 38);
    drawPx(ctx, 4, 4, '#f8fafc', 24, 34);
    drawPx(ctx, 4, 16, '#94a3b8', 24, 1);
    drawPx(ctx, 24, 7, '#64748b', 2, 6);
    drawPx(ctx, 24, 20, '#64748b', 2, 8);
    drawPx(ctx, 10, 20, '#ff4757', 3, 3);
    drawPx(ctx, 8, 26, '#fef08a', 6, 6);
  });

  // 9. Retro Jukebox
  cache['retro_jukebox'] = createPixelCanvas(32, 34, (ctx) => {
    drawPx(ctx, 2, 6, '#381c0c', 28, 26);
    drawPx(ctx, 4, 8, '#783819', 24, 22);
    drawPx(ctx, 22, 0, '#94a3b8', 1, 7);
    drawPx(ctx, 21, 0, '#e2e8f0', 3, 2);
    drawPx(ctx, 6, 11, '#fef08a', 12, 6);
    drawPx(ctx, 11, 11, '#ef4444', 1, 6);
    drawPx(ctx, 6, 20, '#2d1508', 20, 8);
    for (let x = 8; x < 24; x += 3) {
      drawPx(ctx, x, 21, '#d4af37', 1, 6);
    }
    drawPx(ctx, 21, 12, '#d4af37', 4, 4);
  });

  // 10. Polaroid Anı Panosu
  cache['dorm_photoboard'] = createPixelCanvas(48, 36, (ctx) => {
    drawPx(ctx, 2, 2, '#5e381d', 44, 32);
    drawPx(ctx, 4, 4, '#d4a373', 40, 28);
    drawPx(ctx, 8, 7, '#ffffff', 14, 16);
    drawPx(ctx, 9, 8, '#8ecae6', 12, 11);
    drawPx(ctx, 11, 11, '#e76f51', 3, 3);
    drawPx(ctx, 14, 6, '#e63946', 2, 2);
    drawPx(ctx, 26, 12, '#ffffff', 14, 16);
    drawPx(ctx, 27, 13, '#faedcd', 12, 11);
    drawPx(ctx, 31, 16, '#f4a261', 4, 4);
    drawPx(ctx, 32, 11, '#e63946', 2, 2);
  });

  return cache;
}
