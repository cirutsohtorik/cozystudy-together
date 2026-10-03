import { renderDynamicWindowView } from './lighting.js';

export const dorm = {
  name: 'dorm',
  displayName: 'Can & Sezen Yurt Odası 🛏️',
  width: 640,
  height: 400,

  doors: [
    {
      x: 285, y: 0, width: 70, height: 50,
      targetRoom: 'campus_path',
      spawnX: 320, spawnY: 270,
      label: '▲ Kampüs Çıkışı'
    }
  ],

  tables: [
    { id: 'dorm_couple', x: 260, y: 235, width: 96, height: 44, name: 'Can & Sezen Birlikte Gece Çalışma Masası' }
  ],

  beds: [
    { id: 'bed_can', owner: 'Can', x: 40, y: 120, width: 68, height: 80, name: 'Can\'ın Yatağı 🌿' },
    { id: 'bed_sezen', owner: 'Sezen', x: 532, y: 120, width: 68, height: 80, name: 'Sezen\'in Yatağı 🌸' }
  ],

  noteBoard: { x: 24, y: 70, width: 44, height: 38, label: 'Polaroid Anı Panosu' },
  jukebox: { x: 400, y: 44, width: 32, height: 32, label: 'Lofi Radyo' },

  colliders: [
    { x: 0, y: 0, width: 285, height: 75 },
    { x: 355, y: 0, width: 285, height: 75 },
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
    { x: 260, y: 245, width: 96, height: 26 }
  ],

  render(ctx, time, unlockedDecors = [], players = null) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};
    const game = (typeof window !== 'undefined') ? window.Game : null;
    const currentHour = (game && game.currentHour !== undefined) ? game.currentHour : 12;
    const weather = (game && game.weather) ? game.weather : 'sunny';

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

    // 3. Yurt Pencereleri (Dinamik Gökyüzü & Hava Görünümü)
    [125, 460].forEach((wx, idx) => {
      ctx.fillStyle = '#4a250d';
      ctx.fillRect(wx - 2, 8, 54, 50);

      // Dinamik Gökyüzü ve Hava Olayı
      renderDynamicWindowView(ctx, wx + 2, 12, 46, 42, time, currentHour, weather);

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

    // 5. Ahşap Yurt Çıkış Kapısı (x: 285, y: 0) & Hasır Paspas (x: 292, y: 55)
    // Kapı Kasası & Ahşap Kanat
    ctx.fillStyle = '#381c0c';
    ctx.fillRect(283, 0, 74, 56);
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(285, 2, 70, 53);
    ctx.fillStyle = '#7a421b';
    ctx.fillRect(288, 5, 30, 22);
    ctx.fillRect(322, 5, 30, 22);
    ctx.fillRect(288, 30, 30, 22);
    ctx.fillRect(322, 30, 30, 22);
    // Pirinç Kapı Kolu
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(289, 28, 3, 7);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(290, 29, 2, 2);

    // Doğal Hasır Kapı Paspası (Doormat at x: 292, y: 55, w: 56, h: 16)
    ctx.fillStyle = '#4a2c11';
    ctx.fillRect(291, 54, 58, 18);
    ctx.fillStyle = '#c29b62';
    ctx.fillRect(293, 56, 54, 14);
    ctx.fillStyle = '#9c7844';
    for (let my = 58; my < 68; my += 3) {
      ctx.fillRect(295, my, 50, 1);
    }
    ctx.fillStyle = '#5c3e1e';
    ctx.font = '7px Silkscreen, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WELCOME', 320, 66);

    // Kapı Üstü Çıkış Tabelası
    ctx.fillStyle = '#261307';
    ctx.fillRect(280, 0, 80, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('▲ KAMPÜS ÇIKIŞI', 320, 11);

    // 6. Eşyaların Çizimi
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

    // Anı Panosu (Sol Duvara Taşındı: x: 24, y: 70)
    if (spritesCache['dorm_photoboard']) {
      ctx.drawImage(spritesCache['dorm_photoboard'], 24, 70);
    }

    // Jukebox
    if (spritesCache['retro_jukebox']) {
      ctx.drawImage(spritesCache['retro_jukebox'], 400, 44);
    }

    // Büyük Ortak Çalışma Masası
    if (spritesCache['table_dorm_couple']) {
      ctx.drawImage(spritesCache['table_dorm_couple'], 260, 235);
    }

    // 7. Katmanlı Yatak Çizimi (Base -> Sleeping Player Head -> Blanket -> Zzz)
    const playersList = players || (typeof window !== 'undefined' && window.Network?.players ? Object.values(window.Network.players) : []);
    const canPlayer = playersList.find(p => p.name === 'Can' && (p.room === 'dorm' || !p.room));
    const sezenPlayer = playersList.find(p => p.name === 'Sezen' && (p.room === 'dorm' || !p.room));
    const isCanSleeping = canPlayer?.isSleeping;
    const isSezenSleeping = sezenPlayer?.isSleeping;

    // Can'ın Yatağı
    const bedCanBase = spritesCache['bed_can_base'] || spritesCache['bed_can'];
    if (bedCanBase) {
      ctx.drawImage(bedCanBase, 40, 120);
    }
    if (isCanSleeping) {
      const breathBob = Math.sin(time * 0.003) * 0.6;
      const canSleepingSprite = spritesCache['Can']?.['sleeping'] || spritesCache['Can']?.['down']?.[0];
      if (canSleepingSprite) {
        ctx.drawImage(canSleepingSprite, 62, 128 + breathBob);
      }
    }
    const bedCanBlanket = spritesCache['bed_can_blanket'];
    if (bedCanBlanket) {
      ctx.drawImage(bedCanBlanket, 40, 120);
    }
    if (isCanSleeping) {
      const zFloat = (time * 0.002) % 3;
      const zAlpha = Math.max(0, 1 - (zFloat / 3));
      ctx.save();
      ctx.fillStyle = `rgba(180, 210, 255, ${zAlpha})`;
      ctx.font = '10px Silkscreen, monospace';
      ctx.fillText('Zzz..', 76 + (zFloat * 4), 118 - (zFloat * 12));
      ctx.restore();
    }

    // Sezen'in Yatağı
    const bedSezenBase = spritesCache['bed_sezen_base'] || spritesCache['bed_sezen'];
    if (bedSezenBase) {
      ctx.drawImage(bedSezenBase, 532, 120);
    }
    if (isSezenSleeping) {
      const breathBob = Math.sin(time * 0.003) * 0.6;
      const sezenSleepingSprite = spritesCache['Sezen']?.['sleeping'] || spritesCache['Sezen']?.['down']?.[0];
      if (sezenSleepingSprite) {
        ctx.drawImage(sezenSleepingSprite, 554, 128 + breathBob);
      }
    }
    const bedSezenBlanket = spritesCache['bed_sezen_blanket'];
    if (bedSezenBlanket) {
      ctx.drawImage(bedSezenBlanket, 532, 120);
    }
    if (isSezenSleeping) {
      const zFloat = (time * 0.002) % 3;
      const zAlpha = Math.max(0, 1 - (zFloat / 3));
      ctx.save();
      ctx.fillStyle = `rgba(215, 195, 255, ${zAlpha})`;
      ctx.font = '10px Silkscreen, monospace';
      ctx.fillText('Zzz..', 568 + (zFloat * 4), 118 - (zFloat * 12));
      ctx.restore();
    }
  }
};
