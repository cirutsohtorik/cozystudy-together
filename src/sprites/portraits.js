// ========================================================
// CozyStudy: Stardew Valley Tarzı 64x64 Diyalog Portreleri
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createPortraitSprites() {
  const cache = {};

  ['Can', 'Sezen'].forEach(name => {
    cache['portrait_' + name] = createPixelCanvas(64, 64, (ctx) => {
      renderStardewPortrait(ctx, name);
    });
  });

  return cache;
}

export function renderStardewPortrait(ctx, name) {
  const drawPx = (x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);
  const isCan = name === 'Can';

  // 1. Dış Ahşap Stardew Çerçevesi
  ctx.fillStyle = '#221208';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#633617';
  ctx.fillRect(2, 2, 60, 60);
  ctx.fillStyle = '#945627';
  ctx.fillRect(3, 3, 58, 58);
  ctx.fillStyle = '#3a1e0c';
  ctx.fillRect(4, 4, 56, 56);

  // Arka Plan Parşömen
  const bgGrad = ctx.createLinearGradient(4, 4, 60, 60);
  if (isCan) {
    bgGrad.addColorStop(0, '#eaf2ec');
    bgGrad.addColorStop(1, '#d5e5d8');
  } else {
    bgGrad.addColorStop(0, '#f9edf2');
    bgGrad.addColorStop(1, '#eadaea');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(5, 5, 54, 54);

  if (isCan) {
    // CAN: SICAK ESMER TEN, ESPRESSO SAÇ, ORMAN YEŞİLİ TRİKO
    const p = {
      skin: '#c28253',
      skinDark: '#965e38',
      skinLight: '#d99768',
      blush: '#b86657',
      hair: '#24150b',
      hairMid: '#3d2516',
      hairLight: '#613b22',
      eyes: '#1a0e07',
      shirt: '#2e6b3f',
      shirtLight: '#439257',
      shirtDark: '#1c4628',
      collar: '#f4ece1'
    };

    // Omuzlar ve Kazak
    drawPx(8, 48, p.shirtDark, 48, 11);
    drawPx(10, 46, p.shirtDark, 44, 13);
    drawPx(12, 45, p.shirt, 40, 14);
    drawPx(16, 47, p.shirtLight, 32, 2);
    for (let x = 14; x <= 50; x += 4) {
      drawPx(x, 48, p.shirtDark, 1, 11);
    }

    // Yaka
    drawPx(24, 44, p.collar, 16, 7);
    drawPx(26, 45, '#ffffff', 12, 5);
    drawPx(30, 47, p.skinDark, 4, 4);
    drawPx(31, 48, p.skin, 2, 3);

    // Boyun
    drawPx(26, 37, p.skinDark, 12, 9);
    drawPx(28, 38, p.skin, 8, 8);
    drawPx(28, 37, p.skinDark, 8, 2);

    // Çene & Yüz
    drawPx(20, 16, p.skinDark, 24, 22);
    drawPx(21, 16, p.skin, 22, 22);
    drawPx(23, 38, p.skinDark, 18, 2);
    drawPx(26, 40, p.skinDark, 12, 1);
    drawPx(23, 17, p.skinLight, 18, 20);

    // Yanak Allıkları
    drawPx(22, 29, p.blush, 5, 2);
    drawPx(37, 29, p.blush, 5, 2);

    // Burun
    drawPx(31, 26, p.skinDark, 2, 5);
    drawPx(33, 29, p.skinDark, 2, 2);
    drawPx(30, 27, p.skinLight, 1, 4);

    // Ağız & Gülümseme
    drawPx(28, 34, '#8c3d31', 8, 2);
    drawPx(30, 35, '#ffffff', 4, 1);
    drawPx(27, 33, '#6e2b21', 1, 2);
    drawPx(36, 33, '#6e2b21', 1, 2);

    // Gözler
    drawPx(22, 24, p.eyes, 6, 4);
    drawPx(23, 25, '#ffffff', 2, 2);
    drawPx(26, 26, '#3a1f10', 2, 2);
    drawPx(36, 24, p.eyes, 6, 4);
    drawPx(37, 25, '#ffffff', 2, 2);
    drawPx(40, 26, '#3a1f10', 2, 2);

    // Kaşlar
    drawPx(21, 21, p.hair, 8, 2);
    drawPx(22, 20, p.hair, 6, 1);
    drawPx(35, 21, p.hair, 8, 2);
    drawPx(36, 20, p.hair, 6, 1);

    // Saçlar
    drawPx(16, 8, p.hair, 32, 9);
    drawPx(18, 7, p.hair, 28, 4);
    drawPx(20, 5, p.hair, 24, 3);
    drawPx(22, 7, p.hairMid, 22, 5);
    drawPx(24, 8, p.hairLight, 16, 3);
    drawPx(16, 15, p.hair, 5, 14);
    drawPx(17, 17, p.hairMid, 3, 10);
    drawPx(43, 15, p.hair, 5, 14);
    drawPx(44, 17, p.hairMid, 3, 10);
    drawPx(21, 14, p.hair, 4, 5);
    drawPx(25, 13, p.hairMid, 6, 4);
    drawPx(34, 13, p.hair, 5, 5);
    drawPx(39, 14, p.hairMid, 4, 4);
  } else {
    // SEZEN: DURU BEYAZ TEN, GECE MAVİSİ SAÇ, LAVANTA KAZAK & MERCAN TOKA
    const p = {
      skin: '#fff0e6',
      skinDark: '#ebd2c3',
      skinLight: '#ffffff',
      blush: '#ff94a2',
      hair: '#0c121d',
      hairMid: '#1a3354',
      hairLight: '#366aa3',
      hairSheen: '#6399db',
      eyes: '#121f33',
      eyeBlue: '#224870',
      ribbon: '#e76f51',
      shirt: '#7d53b8',
      shirtLight: '#996ddb',
      shirtDark: '#5c3a8e',
      collar: '#f8f4eb'
    };

    // Arka Uzun Saçlar
    drawPx(13, 18, p.hair, 38, 38);
    drawPx(12, 26, p.hairMid, 8, 28);
    drawPx(44, 26, p.hairMid, 8, 28);

    // Omuzlar ve Kazak
    drawPx(10, 48, p.shirtDark, 44, 11);
    drawPx(12, 46, p.shirt, 40, 13);
    drawPx(16, 47, p.shirtLight, 32, 2);
    for (let x = 16; x <= 48; x += 4) {
      drawPx(x, 48, p.shirtDark, 1, 11);
    }

    // Yaka & Boyun
    drawPx(25, 43, p.collar, 14, 5);
    drawPx(27, 44, '#ffffff', 10, 3);
    drawPx(26, 36, p.skinDark, 12, 9);
    drawPx(28, 37, p.skin, 8, 8);
    drawPx(28, 36, p.skinDark, 8, 2);

    // Çene & Yüz
    drawPx(19, 16, p.skinDark, 26, 21);
    drawPx(20, 16, p.skin, 24, 21);
    drawPx(22, 37, p.skinDark, 20, 2);
    drawPx(25, 39, p.skinDark, 14, 1);
    drawPx(22, 17, p.skinLight, 20, 19);

    // Yanak Allıkları
    drawPx(21, 28, p.blush, 6, 3);
    drawPx(37, 28, p.blush, 6, 3);
    drawPx(23, 29, '#ffffff', 2, 1);
    drawPx(39, 29, '#ffffff', 2, 1);

    // Burun & Ağız
    drawPx(31, 27, p.skinDark, 2, 3);
    drawPx(31, 27, p.skinLight, 1, 2);
    drawPx(28, 33, '#d0536c', 8, 2);
    drawPx(29, 34, '#ffffff', 6, 1);

    // Gözler
    drawPx(22, 23, p.hair, 7, 5);
    drawPx(23, 24, p.eyes, 5, 4);
    drawPx(24, 25, p.eyeBlue, 3, 3);
    drawPx(23, 24, '#ffffff', 2, 2);
    drawPx(25, 26, '#ffffff', 1, 1);
    drawPx(35, 23, p.hair, 7, 5);
    drawPx(36, 24, p.eyes, 5, 4);
    drawPx(37, 25, p.eyeBlue, 3, 3);
    drawPx(36, 24, '#ffffff', 2, 2);
    drawPx(38, 26, '#ffffff', 1, 1);

    // Kaşlar
    drawPx(21, 22, p.hair, 8, 1);
    drawPx(20, 23, p.hair, 2, 1);
    drawPx(35, 22, p.hair, 8, 1);
    drawPx(42, 23, p.hair, 2, 1);
    drawPx(23, 19, p.hairMid, 6, 1);
    drawPx(35, 19, p.hairMid, 6, 1);

    // Saçlar
    drawPx(17, 8, p.hair, 30, 9);
    drawPx(19, 6, p.hair, 26, 4);
    drawPx(21, 5, p.hair, 22, 2);
    drawPx(22, 7, p.hairMid, 20, 4);
    drawPx(24, 8, p.hairLight, 16, 2);
    drawPx(26, 9, p.hairSheen, 10, 1);
    drawPx(15, 17, p.hair, 5, 26);
    drawPx(16, 22, p.hairMid, 3, 20);
    drawPx(17, 28, p.hairLight, 2, 12);
    drawPx(44, 17, p.hair, 5, 26);
    drawPx(45, 22, p.hairMid, 3, 20);
    drawPx(46, 28, p.hairLight, 2, 12);
    drawPx(23, 13, p.hair, 4, 6);
    drawPx(27, 12, p.hairMid, 6, 4);
    drawPx(33, 12, p.hair, 6, 5);

    // Mercan Saç Tokası
    drawPx(43, 12, p.ribbon, 6, 6);
    drawPx(44, 13, '#f77f00', 4, 4);
    drawPx(45, 14, '#ffffff', 2, 2);
    drawPx(47, 17, p.ribbon, 3, 5);
  }
}
