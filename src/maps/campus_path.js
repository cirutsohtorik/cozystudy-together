// ========================================================
// CozyStudy: Kampüs Patikası Haritası (Campus Path Map)
// ========================================================

export const campus_path = {
  name: 'campus_path',
  displayName: 'Kampüs Patikası 🌳',
  width: 640,
  height: 400,

  doors: [
    {
      x: 270, y: 0, width: 100, height: 40,
      targetRoom: 'garden',
      spawnX: 320, spawnY: 345,
      label: '▲ Bahçe'
    },
    {
      x: 270, y: 360, width: 100, height: 40,
      targetRoom: 'dorm',
      spawnX: 320, spawnY: 70,
      label: '▼ Can & Sezen Yurdu'
    }
  ],

  tables: [
    { id: 'campus_bench_left', x: 110, y: 170, width: 64, height: 40, name: 'Ihlamur Ağacı Altı Kampüs Bankı' },
    { id: 'campus_bench_right', x: 460, y: 210, width: 64, height: 40, name: 'Güneşli Kiraz Çiçeği Bankı' }
  ],

  npcs: [
    { id: 'ayse', sprite: 'npc_ayse', name: 'Ayşe', x: 330, y: 220, isSitting: false, activity: 'Derse yetişmeye çalışıyor 🎒' },
    { id: 'kerem', sprite: 'npc_kerem', name: 'Kerem', x: 125, y: 165, isSitting: true, activity: 'Mühendislik ödevi kodluyor 💻' }
  ],

  colliders: [
    { x: 0, y: 0, width: 270, height: 40 },
    { x: 370, y: 0, width: 270, height: 40 },
    { x: 0, y: 375, width: 270, height: 25 },
    { x: 370, y: 375, width: 270, height: 25 },
    { x: 0, y: 0, width: 24, height: 400 },
    { x: 616, y: 0, width: 24, height: 400 },
    // Ağaçlar ve Banklar Colliders
    { x: 40, y: 50, width: 56, height: 60 },
    { x: 540, y: 50, width: 56, height: 60 },
    { x: 40, y: 240, width: 56, height: 60 },
    { x: 540, y: 240, width: 56, height: 60 },
    { x: 110, y: 180, width: 64, height: 26 },
    { x: 460, y: 220, width: 64, height: 26 }
  ],

  render(ctx, time, unlockedDecors = []) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};

    // 1. Zengin Kampüs Çimeni
    ctx.fillStyle = '#457b3b';
    ctx.fillRect(0, 0, 640, 400);

    // Çimen dokusu & yabani kır çiçekleri
    ctx.fillStyle = '#528e46';
    for (let x = 16; x < 624; x += 32) {
      for (let y = 30; y < 380; y += 36) {
        const shift = ((x * 5 + y * 11) % 9);
        ctx.fillRect(x + shift, y, 4, 3);
        ctx.fillRect(x + shift + 1, y - 2, 2, 2);
      }
    }

    // Kır çiçekleri
    const flowerColors = ['#ffccd5', '#ffd166', '#a0c4ff', '#ffffff'];
    for (let i = 0; i < 40; i++) {
      const fx = (i * 83) % 580 + 30;
      const fy = (i * 59) % 340 + 30;
      if (fx > 260 && fx < 380) continue; // Patikanın üstüne gelmesin
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      ctx.fillRect(fx, fy, 3, 3);
      ctx.fillStyle = '#2d5e23';
      ctx.fillRect(fx + 1, fy + 3, 1, 2);
    }

    // 2. Geniş Arnavut Kaldırımı Kampüs Yolu (Kuzey - Güney Aksı)
    ctx.fillStyle = '#8f887f';
    ctx.fillRect(270, 0, 100, 400);

    // Banklara ayrılan yan patikalar
    ctx.fillRect(174, 182, 100, 36);
    ctx.fillRect(366, 222, 100, 36);

    // Taş parke çizgileri
    ctx.fillStyle = '#a69f94';
    for (let y = 0; y < 400; y += 16) {
      for (let x = 274; x < 366; x += 18) {
        const s = ((x + y) % 5);
        ctx.fillRect(x + s, y + 2, 14, 11);
        if ((x * y) % 7 === 0) {
          ctx.fillStyle = '#3d6e2e'; // Minik yosun
          ctx.fillRect(x + s + 2, y + 8, 3, 2);
          ctx.fillStyle = '#a69f94';
        }
      }
    }

    // 3. Ağaçlar (Meşe & Kiraz Çiçeği)
    if (spritesCache['campus_tree_oak']) {
      ctx.drawImage(spritesCache['campus_tree_oak'], 40, 40);
      ctx.drawImage(spritesCache['campus_tree_oak'], 540, 230);
    }
    if (spritesCache['campus_tree_cherry']) {
      ctx.drawImage(spritesCache['campus_tree_cherry'], 540, 40);
      ctx.drawImage(spritesCache['campus_tree_cherry'], 40, 230);
    }

    // 4. Kampüs Bankları (Masalar)
    if (spritesCache['campus_bench']) {
      ctx.drawImage(spritesCache['campus_bench'], 118, 175);
      ctx.drawImage(spritesCache['campus_bench'], 468, 215);
    }

    // 5. Viktoryen Sokak Lambaları (4 Adet Yol Kenarı)
    const lamps = [
      { x: 250, y: 70 },
      { x: 374, y: 70 },
      { x: 250, y: 260 },
      { x: 374, y: 260 }
    ];
    lamps.forEach(l => {
      if (spritesCache['campus_lamppost']) {
        ctx.drawImage(spritesCache['campus_lamppost'], l.x, l.y);
      }
    });

    // 6. Yön Tabelaları & İpuçları
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('▲ BAHÇE & KAFE', 270, 16);
    ctx.fillText('▼ CAN & SEZEN YURDU', 255, 394);
  }
};
