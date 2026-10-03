// ========================================================
// CozyStudy: Karakter Piksel Çizimleri (Can & Sezen)
// 3-Ton Shading, Yürüme ve Oturma Animasyon Kareleri
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createCharacterSprites(name) {
  const isCan = name === 'Can';
  const palette = isCan ? {
    skin: '#c28253',        // Sıcak belirgin esmer ten
    skinShadow: '#965e38',
    skinHighlight: '#d49466',
    skinBlush: '#b86657',
    hair: '#24150b',        // Koyu espresso saç
    hairMid: '#3d2516',
    hairHighlight: '#5e3a24',
    eyes: '#1a0e07',
    shirt: '#2e6b3f',       // Orman yeşili sıcak triko
    shirtLight: '#418b55',
    shirtShadow: '#1c4728',
    collar: '#f4ece1',
    pants: '#2d3e54',       // Koyu kot pantolon
    pantsShadow: '#1c293a',
    shoes: '#382519',
    shoeHighlight: '#593923'
  } : {
    skin: '#fff0e6',        // Saf duru beyaz ten
    skinShadow: '#ebd2c3',
    skinHighlight: '#ffffff',
    skinBlush: '#ff94a2',
    hair: '#0c121d',        // Gece mavisi & siyah karışık saç
    hairMid: '#1a3354',     // Mavi derinlik tonu
    hairHighlight: '#366aa3', // Parlayan safir/mavi ışıltı
    ribbon: '#e76f51',      // Sıcak mercan toka
    eyes: '#121f33',        // Derin lacivert/siyah gözler
    shirt: '#7d53b8',       // Lavanta yün kazak
    shirtLight: '#996ddb',
    shirtShadow: '#5c3a8e',
    collar: '#f8f4eb',
    pants: '#c9a885',       // Sıcak bej pantolon
    pantsShadow: '#aa8864',
    shoes: '#523420',
    shoeHighlight: '#754b2d'
  };

  const directions = ['down', 'up', 'left', 'right'];
  const frames = [0, 1, 2];
  const charCache = {};

  directions.forEach(dir => {
    charCache[dir] = [];
    frames.forEach(frame => {
      const sprite = createPixelCanvas(24, 32, (ctx) => {
        renderCharacterFrame(ctx, palette, dir, frame, isCan);
      });
      charCache[dir].push(sprite);
    });
  });

  charCache['sitting'] = createPixelCanvas(24, 32, (ctx) => {
    renderCharacterSitting(ctx, palette, isCan);
  });

  charCache['sleeping'] = createPixelCanvas(24, 32, (ctx) => {
    renderCharacterSleeping(ctx, palette, isCan);
  });

  return charCache;
}

function renderCharacterFrame(ctx, p, dir, frame, isCan) {
  const drawPx = (x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);
  const headX = 4;
  const headY = 4;

  const legOffset = frame === 1 ? -1 : (frame === 2 ? 1 : 0);
  const legLeftY = 22 + (frame === 1 ? -1 : 0);
  const legRightY = 22 + (frame === 2 ? -1 : 0);

  // Ayakkabı & Bacak Gölgelendirmesi
  if (dir === 'left' || dir === 'right') {
    drawPx(9, 22, p.pantsShadow, 5, 5);
    drawPx(10, 22, p.pants, 4, 5);
    drawPx(8 + legOffset, 27, p.shoes, 6, 3);
    drawPx(9 + legOffset, 27, p.shoeHighlight, 4, 1);
  } else {
    // Sol bacak
    drawPx(7, legLeftY, p.pantsShadow, 4, 5);
    drawPx(7, legLeftY, p.pants, 3, 5);
    drawPx(7, legLeftY + 5, p.shoes, 4, 3);
    drawPx(7, legLeftY + 5, p.shoeHighlight, 3, 1);

    // Sağ bacak
    drawPx(13, legRightY, p.pantsShadow, 4, 5);
    drawPx(14, legRightY, p.pants, 3, 5);
    drawPx(13, legRightY + 5, p.shoes, 4, 3);
    drawPx(13, legRightY + 5, p.shoeHighlight, 3, 1);
  }

  // Gövde (Detaylı Triko Kazak & Katlanma Çizgileri)
  drawPx(6, 14, p.shirtShadow, 12, 8);
  drawPx(7, 14, p.shirt, 10, 7);
  drawPx(8, 15, p.shirtLight, 8, 2);

  if (dir === 'down') {
    // Yaka detayı
    drawPx(10, 14, p.collar, 4, 3);
    drawPx(11, 15, p.skin, 2, 2);
  }

  // Kollar & Eller (Yürüme Salınımı)
  if (dir === 'down' || dir === 'up') {
    const armOffset = (frame === 1 ? 1 : (frame === 2 ? -1 : 0));
    // Sol kol
    drawPx(4, 15 + armOffset, p.shirtShadow, 3, 6);
    drawPx(4, 15 + armOffset, p.shirt, 2, 5);
    drawPx(4, 21 + armOffset, p.skin, 2, 2);
    // Sağ kol
    drawPx(17, 15 - armOffset, p.shirtShadow, 3, 6);
    drawPx(18, 15 - armOffset, p.shirt, 2, 5);
    drawPx(18, 21 - armOffset, p.skin, 2, 2);
  }

  // Kafa & Yüz
  drawPx(headX + 2, headY + 2, p.skinShadow, 12, 10);
  drawPx(headX + 3, headY + 2, p.skin, 10, 9);

  if (dir === 'down') {
    // Kaşlar (Eyebrows)
    drawPx(headX + 4, headY + 4, p.hair, 3, 1);
    drawPx(headX + 9, headY + 4, p.hair, 3, 1);

    // Parlayan büyük sevimli gözler
    drawPx(headX + 4, headY + 6, p.eyes, 3, 2);
    drawPx(headX + 4, headY + 6, '#ffffff', 1, 1); // Göz ışıltısı
    drawPx(headX + 9, headY + 6, p.eyes, 3, 2);
    drawPx(headX + 9, headY + 6, '#ffffff', 1, 1);

    // Sevimli yanak allıkları (Good Coffee & Anime stili)
    drawPx(headX + 3, headY + 8, p.skinBlush, 2, 1);
    drawPx(headX + 11, headY + 8, p.skinBlush, 2, 1);

    // Gülümseme & Dudak
    drawPx(headX + 7, headY + 9, '#8c3d31', 2, 1);
  } else if (dir === 'left') {
    drawPx(headX + 3, headY + 4, p.hair, 3, 1);
    drawPx(headX + 3, headY + 6, p.eyes, 3, 2);
    drawPx(headX + 3, headY + 6, '#ffffff', 1, 1);
    drawPx(headX + 2, headY + 8, p.skinBlush, 2, 1);
    drawPx(headX + 2, headY + 9, '#8c3d31', 2, 1);
  } else if (dir === 'right') {
    drawPx(headX + 10, headY + 4, p.hair, 3, 1);
    drawPx(headX + 10, headY + 6, p.eyes, 3, 2);
    drawPx(headX + 11, headY + 6, '#ffffff', 1, 1);
    drawPx(headX + 12, headY + 8, p.skinBlush, 2, 1);
    drawPx(headX + 12, headY + 9, '#8c3d31', 2, 1);
  }

  // Saçlar (Hacimli, ışık kırılmalı katmanlar)
  if (isCan) {
    drawPx(headX + 1, headY, p.hair, 14, 4);
    drawPx(headX + 2, headY, p.hairMid, 12, 3);
    drawPx(headX + 4, headY + 1, p.hairHighlight, 7, 2);
    drawPx(headX, headY + 3, p.hair, 3, 5);
    drawPx(headX + 13, headY + 3, p.hair, 3, 5);
    if (dir === 'down') {
      drawPx(headX + 3, headY + 3, p.hairMid, 4, 2);
      drawPx(headX + 9, headY + 3, p.hairMid, 4, 2);
    } else if (dir === 'up') {
      drawPx(headX + 2, headY + 2, p.hair, 12, 9);
      drawPx(headX + 3, headY + 3, p.hairMid, 10, 7);
    }
  } else {
    // Sezen: Dökümlü dalgalı mavi-siyah saçlar + Safir ışıltılar + Toka
    drawPx(headX + 1, headY - 1, p.hair, 14, 5);
    drawPx(headX + 2, headY, p.hairMid, 12, 4);
    drawPx(headX + 4, headY, p.hairHighlight, 8, 2);
    drawPx(headX - 1, headY + 3, p.hair, 4, 13);
    drawPx(headX + 13, headY + 3, p.hair, 4, 13);
    // Mavi-siyah saç tutamları
    drawPx(headX, headY + 5, p.hairMid, 2, 8);
    drawPx(headX + 14, headY + 5, p.hairMid, 2, 8);
    drawPx(headX + 5, headY - 1, p.hairHighlight, 4, 1);

    if (dir === 'down') {
      drawPx(headX + 3, headY + 3, p.hairMid, 3, 2);
      drawPx(headX + 10, headY + 3, p.hairMid, 3, 2);
      // Kırmızı/Mercan kurdele toka
      drawPx(headX + 12, headY + 2, p.ribbon, 3, 3);
      drawPx(headX + 13, headY + 3, '#ffffff', 1, 1);
    } else if (dir === 'up') {
      drawPx(headX + 1, headY + 1, p.hair, 14, 16);
      drawPx(headX + 2, headY + 2, p.hairMid, 12, 14);
      drawPx(headX + 4, headY + 4, p.hairHighlight, 8, 4);
    }
  }
}

function renderCharacterSitting(ctx, p, isCan) {
  const drawPx = (x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);
  const headX = 4;
  const headY = 4;

  // Sandalye arkalığı
  drawPx(5, 12, '#502910', 14, 12);
  drawPx(6, 13, '#753f19', 12, 10);

  // Oturan Gövde
  drawPx(7, 14, p.shirtShadow, 10, 8);
  drawPx(8, 14, p.shirt, 8, 7);
  drawPx(9, 15, p.shirtLight, 6, 2);

  // Masaya yaslanmış kollar & eller
  drawPx(5, 19, p.shirt, 3, 3);
  drawPx(7, 21, p.skin, 3, 2);
  drawPx(16, 19, p.shirt, 3, 3);
  drawPx(14, 21, p.skin, 3, 2);

  // Kafa
  drawPx(headX + 2, headY + 2, p.skinShadow, 12, 10);
  drawPx(headX + 3, headY + 2, p.skin, 10, 9);

  // Kaşlar & Odaklanmış tatlı gözler
  drawPx(headX + 4, headY + 5, p.hair, 3, 1);
  drawPx(headX + 9, headY + 5, p.hair, 3, 1);
  drawPx(headX + 4, headY + 7, p.eyes, 3, 2);
  drawPx(headX + 4, headY + 7, '#ffffff', 1, 1);
  drawPx(headX + 9, headY + 7, p.eyes, 3, 2);
  drawPx(headX + 9, headY + 7, '#ffffff', 1, 1);
  drawPx(headX + 3, headY + 8, p.skinBlush, 2, 1);
  drawPx(headX + 11, headY + 8, p.skinBlush, 2, 1);
  drawPx(headX + 7, headY + 9, '#8c3d31', 2, 1);

  if (isCan) {
    drawPx(headX + 1, headY, p.hair, 14, 4);
    drawPx(headX + 2, headY, p.hairMid, 12, 3);
    drawPx(headX + 4, headY + 1, p.hairHighlight, 7, 2);
    drawPx(headX, headY + 3, p.hair, 3, 5);
    drawPx(headX + 13, headY + 3, p.hair, 3, 5);
  } else {
    drawPx(headX + 1, headY - 1, p.hair, 14, 5);
    drawPx(headX + 2, headY, p.hairMid, 12, 4);
    drawPx(headX + 4, headY, p.hairHighlight, 8, 2);
    drawPx(headX - 1, headY + 3, p.hair, 4, 14);
    drawPx(headX + 13, headY + 3, p.hair, 4, 14);
    drawPx(headX, headY + 5, p.hairMid, 2, 8);
    drawPx(headX + 14, headY + 5, p.hairMid, 2, 8);
    drawPx(headX + 12, headY + 2, p.ribbon, 3, 3);
    drawPx(headX + 13, headY + 3, '#ffffff', 1, 1);
  }
}

function renderCharacterSleeping(ctx, p, isCan) {
  const drawPx = (x, y, color, w = 1, h = 1) => px(ctx, x, y, color, w, h);
  const headX = 4;
  const headY = 4;

  // Pijama yakası (pyjama collar)
  drawPx(headX + 4, headY + 12, p.collar || '#ffffff', 8, 3);
  drawPx(headX + 5, headY + 11, p.shirtShadow, 6, 2);

  // Kafa (Yastıkta dinlenen huzurlu yüz)
  drawPx(headX + 2, headY + 2, p.skinShadow, 12, 10);
  drawPx(headX + 3, headY + 2, p.skin, 10, 9);

  // Kapalı uyuyan kirpikler / göz çizgisi (Huzurlu uyku)
  drawPx(headX + 4, headY + 7, p.hair, 3, 1);
  drawPx(headX + 9, headY + 7, p.hair, 3, 1);
  drawPx(headX + 3, headY + 8, p.skinBlush, 3, 2);
  drawPx(headX + 10, headY + 8, p.skinBlush, 3, 2);

  // Minik tatlı uyku tebessümü
  drawPx(headX + 7, headY + 9, '#8c3d31', 2, 1);

  // Saçlar (Hacimli, ışık kırılmalı katmanlar)
  if (isCan) {
    drawPx(headX + 1, headY, p.hair, 14, 4);
    drawPx(headX + 2, headY, p.hairMid, 12, 3);
    drawPx(headX + 4, headY + 1, p.hairHighlight, 7, 2);
    drawPx(headX, headY + 3, p.hair, 3, 5);
    drawPx(headX + 13, headY + 3, p.hair, 3, 5);
  } else {
    drawPx(headX + 1, headY - 1, p.hair, 14, 5);
    drawPx(headX + 2, headY, p.hairMid, 12, 4);
    drawPx(headX + 4, headY, p.hairHighlight, 8, 2);
    // Yastığa yayılan saçlar
    drawPx(headX - 2, headY + 2, p.hair, 4, 10);
    drawPx(headX + 14, headY + 2, p.hair, 4, 10);
    drawPx(headX + 12, headY + 2, p.ribbon, 3, 3);
  }
}

