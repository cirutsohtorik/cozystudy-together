// ========================================================
// CozyStudy: Can & Sezen Yurt Odası Haritası (Dorm Map)
// ========================================================

export const dorm = {
  name: 'dorm',
  displayName: 'Can & Sezen Yurt Odası 🛏️',
  width: 640,
  height: 400,

  doors: [
    {
      x: 270, y: 0, width: 100, height: 45,
      targetRoom: 'campus_path',
      spawnX: 320, spawnY: 340,
      label: '▲ Kampüs Çıkışı'
    }
  ],

  tables: [
    { id: 'dorm_couple', x: 260, y: 235, width: 96, height: 44, name: 'Can & Sezen Birlikte Gece Çalışma Masası' },
    { id: 'dorm_can', x: 120, y: 130, width: 64, height: 40, name: 'Can\'ın Bireysel Çalışma Masası' },
    { id: 'dorm_sezen', x: 456, y: 130, width: 64, height: 40, name: 'Sezen\'in Bireysel Çalışma Masası' }
  ],

  beds: [
    { id: 'bed_can', owner: 'Can', x: 40, y: 120, width: 68, height: 80, name: 'Can\'ın Yatağı 🌿' },
    { id: 'bed_sezen', owner: 'Sezen', x: 532, y: 120, width: 68, height: 80, name: 'Sezen\'in Yatağı 🌸' }
  ],

  noteBoard: { x: 295, y: 18, width: 50, height: 36, label: 'Polaroid Anı Panosu' },
  jukebox: { x: 400, y: 44, width: 32, height: 32, label: 'Lofi Radyo' },

  colliders: [
    { x: 0, y: 0, width: 270, height: 75 },
    { x: 370, y: 0, width: 270, height: 75 },
    { x: 0, y: 375, width: 640, height: 25 },
    { x: 0, y: 0, width: 24, height: 400 },
    { x: 616, y: 0, width: 24, height: 400 },
    // Gardıroplar, Çay Köşesi, Buzdolabı, Yataklar, Masalar
    { x: 38, y: 40, width: 44, height: 60 },
    { x: 558, y: 40, width: 44, height: 60 },
    { x: 195, y: 38, width: 78, height: 40 }, // Çay istasyonu
    { x: 355, y: 40, width: 34, height: 38 }, // Mini buzdolabı
    { x: 40, y: 125, width: 68, height: 75 }, // Can'ın yatağı
    { x: 532, y: 125, width: 68, height: 75 }, // Sezen'in yatağı
    { x: 120, y: 140, width: 64, height: 26 },
    { x: 456, y: 140, width: 64, height: 26 },
    { x: 260, y: 245, width: 96, height: 26 }
  ],

  render(ctx, time, unlockedDecors = []) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};

    // 1. Sıcak Meşe Parke Zemin (Plank Seams & Woodgrain)
    ctx.fillStyle = '#b87b3e';
    ctx.fillRect(0, 0, 640, 400);

    // Parke hatları
    for (let y = 75; y < 400; y += 22) {
      ctx.fillStyle = '#9c622d';
      ctx.fillRect(0, y, 640, 2);
      for (let x = (y % 44 === 0 ? 0 : 36); x < 640; x += 72) {
        ctx.fillRect(x, y, 2, 22);
      }
    }

    // 2. Duvar (Krem Duvar Kağıdı + Sıcak Ahşap Lambri)
    ctx.fillStyle = '#fbf5eb';
    ctx.fillRect(0, 0, 640, 60);
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(0, 60, 640, 15);
    ctx.fillStyle = '#7a421b';
    ctx.fillRect(0, 63, 640, 12);

    // 3. Yurt Pencereleri (Can ve Sezen taraflarında pencereler)
    [125, 460].forEach((wx, idx) => {
      ctx.fillStyle = '#4a250d';
      ctx.fillRect(wx - 2, 8, 54, 50);
      ctx.fillStyle = '#9ec5e8';
      ctx.fillRect(wx + 2, 12, 46, 42);

      // Gece / Gündüz cam tonu
      const currentHour = (typeof window !== 'undefined' && window.Game && window.Game.currentHour !== undefined) ? window.Game.currentHour : 12;
      if (currentHour < 6 || currentHour > 19) {
        ctx.fillStyle = '#1e293b'; // Gece gökyüzü
        ctx.fillRect(wx + 2, 12, 46, 42);
        // Minik sarı yıldızlar
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(wx + 10, 18, 2, 2);
        ctx.fillRect(wx + 32, 24, 2, 2);
        ctx.fillRect(wx + 22, 34, 1, 1);
      }

      // Ahşap pencere çıtaları
      ctx.fillStyle = '#4a250d';
      ctx.fillRect(wx + 24, 12, 2, 42);
      ctx.fillRect(wx + 2, 32, 46, 2);

      // Perdeler (Can tarafı koyu orman yeşili, Sezen tarafı lavanta moru)
      const curtainColor = idx === 0 ? '#2d6a4f' : '#7d53b8';
      ctx.fillStyle = curtainColor;
      ctx.fillRect(wx - 4, 6, 8, 48);
      ctx.fillRect(wx + 46, 6, 8, 48);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(wx - 2, 28, 4, 3); // Perde bağı
      ctx.fillRect(wx + 48, 28, 4, 3);
    });

    // 4. Ortada Büyük Bohem Dokuma Kilim (Rug)
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(230, 200, 180, 115);
    ctx.fillStyle = '#faedcd';
    ctx.fillRect(236, 206, 168, 103);
    // Etnik baklava & çizgi desenleri
    ctx.fillStyle = '#e76f51';
    for (let rx = 246; rx < 390; rx += 24) {
      ctx.fillRect(rx, 252, 12, 12);
      ctx.fillRect(rx + 2, 254, 8, 8);
    }
    ctx.fillStyle = '#ccd5ae';
    ctx.fillRect(236, 230, 168, 4);
    ctx.fillRect(236, 285, 168, 4);

    // 5. Eşyaların Çizimi
    // Gardıroplar
    if (spritesCache['dorm_wardrobe']) {
      ctx.drawImage(spritesCache['dorm_wardrobe'], 38, 36);
      ctx.drawImage(spritesCache['dorm_wardrobe'], 560, 36);
    }

    // Çay Köşesi Kitchenette & Mini Fridge
    if (spritesCache['dorm_kitchenette']) {
      ctx.drawImage(spritesCache['dorm_kitchenette'], 195, 38);
    }
    if (spritesCache['dorm_fridge']) {
      ctx.drawImage(spritesCache['dorm_fridge'], 355, 40);
    }

    // Anı Panosu & Jukebox
    if (spritesCache['dorm_photoboard']) {
      ctx.drawImage(spritesCache['dorm_photoboard'], 295, 18);
    }
    if (spritesCache['retro_jukebox']) {
      ctx.drawImage(spritesCache['retro_jukebox'], 400, 44);
    }

    // Yataklar (Can & Sezen)
    if (spritesCache['bed_can']) {
      ctx.drawImage(spritesCache['bed_can'], 40, 120);
    }
    if (spritesCache['bed_sezen']) {
      ctx.drawImage(spritesCache['bed_sezen'], 532, 120);
    }

    // Kuzey Çıkış Kapısı & Tabela
    ctx.fillStyle = '#4a250d';
    ctx.fillRect(280, 0, 80, 24);
    ctx.fillStyle = '#6b3e1f';
    ctx.fillRect(284, 0, 72, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('▲ KAMPÜS ÇIKIŞI', 270, 15);
  }
};
