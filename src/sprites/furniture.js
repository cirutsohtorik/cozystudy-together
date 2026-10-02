// ========================================================
// CozyStudy: Mobilya ve Çardak Piksel Çizimleri
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createGazeboSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);

  // Çardak Genişlik: 96px, Yükseklik: 84px
  cache['garden_gazebo'] = createPixelCanvas(96, 84, (ctx) => {
    // 1. Taş/Ahşap Çardak Taban Platformu (Deck)
    drawPx(ctx, 4, 38, '#61402b', 88, 44);
    drawPx(ctx, 6, 40, '#82583c', 84, 40);
    for (let y = 44; y < 80; y += 8) {
      drawPx(ctx, 6, y, '#543622', 84, 1);
    }

    // 2. Dört Ahşap Taşıyıcı Dikme (Corner Pillars)
    drawPx(ctx, 6, 12, '#3b2010', 6, 68);
    drawPx(ctx, 7, 12, '#5e381d', 4, 68);
    drawPx(ctx, 9, 12, '#82502d', 2, 68);

    drawPx(ctx, 84, 12, '#3b2010', 6, 68);
    drawPx(ctx, 85, 12, '#5e381d', 4, 68);
    drawPx(ctx, 87, 12, '#82502d', 2, 68);

    // 3. Yan Ahşap Korkuluklar
    drawPx(ctx, 12, 54, '#42240e', 14, 20);
    drawPx(ctx, 14, 56, '#6e401f', 10, 16);
    drawPx(ctx, 18, 54, '#3b2010', 2, 20);

    drawPx(ctx, 70, 54, '#42240e', 14, 20);
    drawPx(ctx, 72, 56, '#6e401f', 10, 16);
    drawPx(ctx, 76, 54, '#3b2010', 2, 20);

    // 4. Çardak Saçak ve Çatı Kirişleri
    drawPx(ctx, 2, 10, '#381c0c', 92, 6);
    drawPx(ctx, 4, 11, '#663b1d', 88, 4);

    drawPx(ctx, 6, 4, '#542611', 84, 8);
    drawPx(ctx, 12, 0, '#783819', 72, 6);
    drawPx(ctx, 16, 1, '#964821', 64, 4);
    drawPx(ctx, 24, 0, '#b85c2c', 48, 2);

    for (let x = 6; x < 90; x += 8) {
      drawPx(ctx, x, 14, '#381c0c', 4, 4);
      drawPx(ctx, x + 1, 15, '#783819', 2, 2);
    }

    // 5. Sarmaşık ve Güller
    drawPx(ctx, 4, 24, '#2d5e2a', 5, 8);
    drawPx(ctx, 7, 34, '#3d7a38', 5, 10);
    drawPx(ctx, 5, 48, '#2d5e2a', 6, 8);
    drawPx(ctx, 8, 26, '#ff8fa3', 3, 3);
    drawPx(ctx, 9, 27, '#fff', 1, 1);
    drawPx(ctx, 5, 38, '#ff758f', 3, 3);
    drawPx(ctx, 7, 50, '#ff8fa3', 3, 3);

    drawPx(ctx, 86, 20, '#2d5e2a', 5, 10);
    drawPx(ctx, 84, 36, '#3d7a38', 6, 8);
    drawPx(ctx, 85, 46, '#2d5e2a', 5, 10);
    drawPx(ctx, 87, 22, '#ff8fa3', 3, 3);
    drawPx(ctx, 88, 23, '#fff', 1, 1);
    drawPx(ctx, 84, 40, '#ff758f', 3, 3);
    drawPx(ctx, 86, 52, '#ff8fa3', 3, 3);

    // 6. Ortada Asılı Sıcak Peri Feneri
    drawPx(ctx, 46, 16, '#26170d', 4, 10);
    drawPx(ctx, 44, 24, '#241a12', 8, 10);
    drawPx(ctx, 45, 25, '#ffeaa7', 6, 8);
    drawPx(ctx, 47, 27, '#ffffff', 2, 4);
  });

  // Geniş Çift Bahçe Çardağı
  cache['garden_gazebo_couple'] = createPixelCanvas(128, 96, (ctx) => {
    drawPx(ctx, 4, 42, '#5e381d', 120, 48);
    drawPx(ctx, 6, 44, '#7a4a27', 116, 44);
    for (let y = 48; y < 88; y += 8) {
      drawPx(ctx, 6, y, '#4d2b14', 116, 1);
    }

    drawPx(ctx, 6, 12, '#381c0c', 7, 76);
    drawPx(ctx, 8, 12, '#5e381d', 4, 76);
    drawPx(ctx, 115, 12, '#381c0c', 7, 76);
    drawPx(ctx, 117, 12, '#5e381d', 4, 76);

    drawPx(ctx, 14, 60, '#381c0c', 16, 20);
    drawPx(ctx, 98, 60, '#381c0c', 16, 20);

    drawPx(ctx, 2, 10, '#381c0c', 124, 6);
    drawPx(ctx, 4, 11, '#663b1d', 120, 4);
    drawPx(ctx, 8, 4, '#542611', 112, 8);
    drawPx(ctx, 16, 0, '#783819', 96, 6);
    drawPx(ctx, 24, 1, '#964821', 80, 4);

    drawPx(ctx, 5, 22, '#2d5e2a', 6, 14);
    drawPx(ctx, 8, 25, '#ff8fa3', 4, 4);
    drawPx(ctx, 116, 22, '#2d5e2a', 6, 14);
    drawPx(ctx, 117, 26, '#ff8fa3', 4, 4);

    drawPx(ctx, 40, 16, '#241a12', 3, 8);
    drawPx(ctx, 38, 23, '#ffeaa7', 7, 8);
    drawPx(ctx, 40, 25, '#ffffff', 3, 4);

    drawPx(ctx, 88, 16, '#241a12', 3, 8);
    drawPx(ctx, 86, 23, '#ffeaa7', 7, 8);
    drawPx(ctx, 88, 25, '#ffffff', 3, 4);
  });

  return cache;
}

export function createFurnitureSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);

  // 1. Sınıf Masası
  cache['table_classroom'] = createPixelCanvas(64, 40, (ctx) => {
    drawPx(ctx, 2, 10, '#42240b', 60, 20);
    drawPx(ctx, 4, 12, '#7a451e', 56, 16);
    drawPx(ctx, 6, 13, '#9c5a2b', 52, 13);
    drawPx(ctx, 4, 28, '#2b1505', 56, 4);

    drawPx(ctx, 6, 30, '#2b1505', 4, 10);
    drawPx(ctx, 54, 30, '#2b1505', 4, 10);

    drawPx(ctx, 10, 14, '#2c3e50', 16, 10);
    drawPx(ctx, 11, 15, '#f5eedb', 14, 8);
    drawPx(ctx, 17, 15, '#b09f80', 2, 8);
    drawPx(ctx, 13, 17, '#594939', 3, 1);
    drawPx(ctx, 20, 17, '#594939', 3, 1);

    drawPx(ctx, 48, 12, '#384d59', 7, 9);
    drawPx(ctx, 50, 7, '#d94b4b', 2, 6);
    drawPx(ctx, 53, 9, '#4b8ad9', 2, 4);

    drawPx(ctx, 32, 16, '#e07a5f', 6, 6);
    drawPx(ctx, 33, 17, '#422216', 4, 4);
  });

  // 2. Bahçe Çardak Masası
  cache['table_garden'] = createPixelCanvas(64, 40, (ctx) => {
    drawPx(ctx, 4, 12, '#3d2010', 56, 18);
    drawPx(ctx, 6, 14, '#693c1f', 52, 14);
    drawPx(ctx, 8, 15, '#854f2c', 48, 11);
    drawPx(ctx, 6, 28, '#261307', 52, 4);

    drawPx(ctx, 4, 32, '#522b13', 56, 6);
    drawPx(ctx, 8, 32, '#381c0c', 4, 8);
    drawPx(ctx, 52, 32, '#381c0c', 4, 8);

    drawPx(ctx, 46, 20, '#d4eaf7', 8, 7);
    drawPx(ctx, 47, 21, '#ffffff', 2, 2);
    drawPx(ctx, 48, 16, '#3d7a38', 4, 4);
    drawPx(ctx, 46, 14, '#ff8fa3', 4, 3);
    drawPx(ctx, 51, 14, '#ffd166', 3, 3);
  });

  // 3. Kafe Masası
  cache['table_cafe'] = createPixelCanvas(64, 40, (ctx) => {
    drawPx(ctx, 8, 10, '#8c2424', 48, 20);
    for (let x = 10; x < 54; x += 8) {
      for (let y = 12; y < 28; y += 8) {
        drawPx(ctx, x, y, '#fdfbf7', 4, 4);
        drawPx(ctx, x + 4, y + 4, '#fdfbf7', 4, 4);
      }
    }
    drawPx(ctx, 8, 28, '#591616', 48, 3);

    drawPx(ctx, 28, 30, '#1c1918', 8, 8);
    drawPx(ctx, 22, 37, '#1c1918', 20, 3);

    drawPx(ctx, 14, 14, '#ffffff', 7, 7);
    drawPx(ctx, 15, 15, '#6f4e37', 5, 5);
    drawPx(ctx, 16, 16, '#ffffff', 3, 2);

    drawPx(ctx, 42, 14, '#ffffff', 7, 7);
    drawPx(ctx, 43, 15, '#6f4e37', 5, 5);
    drawPx(ctx, 44, 16, '#ffffff', 3, 2);

    drawPx(ctx, 30, 14, '#d4af37', 4, 4);
    drawPx(ctx, 31, 10, '#ffeedb', 2, 5);
    drawPx(ctx, 31, 8, '#f39c12', 2, 2);
  });

  // 4. Çift Masası - Sınıf
  cache['table_classroom_couple'] = createPixelCanvas(96, 44, (ctx) => {
    drawPx(ctx, 2, 10, '#3a1f0a', 92, 20);
    drawPx(ctx, 4, 12, '#6e3c18', 88, 16);
    drawPx(ctx, 6, 13, '#8a4d22', 84, 13);
    drawPx(ctx, 4, 28, '#241204', 88, 4);

    drawPx(ctx, 6, 30, '#241204', 5, 12);
    drawPx(ctx, 46, 30, '#241204', 4, 12);
    drawPx(ctx, 85, 30, '#241204', 5, 12);

    drawPx(ctx, 10, 12, '#2b2d42', 18, 11);
    drawPx(ctx, 11, 13, '#1c1d29', 16, 9);
    drawPx(ctx, 13, 7, '#3a3d5c', 14, 7);
    drawPx(ctx, 14, 8, '#5dade2', 12, 5);
    drawPx(ctx, 15, 9, '#ffffff', 4, 1);
    drawPx(ctx, 15, 11, '#2ecc71', 6, 1);

    drawPx(ctx, 30, 15, '#2e6b3f', 11, 8);
    drawPx(ctx, 31, 16, '#fbfaf5', 9, 6);

    drawPx(ctx, 68, 14, '#7d53b8', 16, 10);
    drawPx(ctx, 70, 15, '#fefbf3', 12, 8);
    drawPx(ctx, 75, 12, '#e76f51', 2, 12);
    drawPx(ctx, 64, 17, '#ff758f', 3, 3);

    drawPx(ctx, 56, 15, '#f4a261', 6, 6);
    drawPx(ctx, 57, 16, '#3a1e0c', 4, 4);

    drawPx(ctx, 45, 9, '#b8860b', 6, 11);
    drawPx(ctx, 43, 7, '#1b4332', 10, 4);
    drawPx(ctx, 44, 11, '#ffefa0', 8, 2);
  });

  // 5. Çift Masası - Bahçe
  cache['table_garden_couple'] = createPixelCanvas(96, 44, (ctx) => {
    drawPx(ctx, 2, 10, '#381e0e', 92, 20);
    drawPx(ctx, 4, 12, '#61381b', 88, 16);
    drawPx(ctx, 6, 13, '#784623', 84, 13);
    drawPx(ctx, 4, 28, '#211006', 88, 4);

    drawPx(ctx, 6, 30, '#211006', 6, 12);
    drawPx(84, 30, '#211006', 6, 12);
    drawPx(ctx, 4, 34, '#4a2811', 88, 6);

    drawPx(ctx, 40, 14, '#8c532b', 16, 9);
    drawPx(ctx, 42, 12, '#c0392b', 12, 3);

    drawPx(ctx, 44, 18, '#eaecee', 8, 6);
    drawPx(ctx, 45, 19, '#ffffff', 2, 2);
    drawPx(ctx, 46, 15, '#2ecc71', 4, 3);
    drawPx(ctx, 43, 13, '#ffd166', 3, 3);
    drawPx(ctx, 49, 13, '#9b5de5', 3, 3);

    drawPx(ctx, 16, 19, '#d4f1f4', 7, 8);
    drawPx(ctx, 17, 20, '#f9e79f', 5, 6);
    drawPx(ctx, 18, 21, '#27ae60', 2, 2);

    drawPx(ctx, 72, 22, '#ffffff', 8, 3);
    drawPx(ctx, 74, 20, '#e76f51', 4, 3);
    drawPx(ctx, 73, 21, '#f4a261', 6, 2);
  });

  // 6. Çift Masası - Kafe
  cache['table_cafe_couple'] = createPixelCanvas(96, 44, (ctx) => {
    drawPx(ctx, 4, 10, '#8c2424', 88, 20);
    for (let x = 6; x < 90; x += 8) {
      for (let y = 12; y < 28; y += 8) {
        drawPx(ctx, x, y, '#fdfbf7', 4, 4);
        drawPx(ctx, x + 4, y + 4, '#fdfbf7', 4, 4);
      }
    }
    drawPx(ctx, 4, 28, '#591616', 88, 4);

    drawPx(ctx, 20, 32, '#181615', 6, 10);
    drawPx(ctx, 70, 32, '#181615', 6, 10);

    drawPx(ctx, 18, 14, '#ffffff', 8, 8);
    drawPx(ctx, 19, 15, '#6f4e37', 6, 6);
    drawPx(ctx, 20, 16, '#ffffff', 4, 2);

    drawPx(ctx, 70, 14, '#e8d7f1', 8, 8);
    drawPx(ctx, 71, 15, '#6f4e37', 6, 6);
    drawPx(ctx, 72, 16, '#ffffff', 4, 2);

    drawPx(ctx, 40, 14, '#f4f6f7', 16, 7);
    drawPx(ctx, 42, 13, '#d4ac0d', 6, 4);
    drawPx(ctx, 49, 13, '#b7950b', 6, 4);

    drawPx(ctx, 46, 8, '#f39c12', 4, 5);
    drawPx(ctx, 47, 6, '#e67e22', 2, 2);
  });

  return cache;
}
