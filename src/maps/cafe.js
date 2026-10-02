// ========================================================
// CozyStudy: Cozy Roastery Kafe Haritası (Cafe Map)
// ========================================================

export const cafe = {
  name: 'cafe',
  displayName: 'Cozy Roastery Kafe ☕',
  width: 640,
  height: 400,

  doors: [
    {
      x: 0, y: 165, width: 45, height: 85,
      targetRoom: 'garden',
      spawnX: 560, spawnY: 200,
      label: '◀ Bahçe'
    }
  ],

  noteBoard: { x: 220, y: 125, width: 42, height: 42, label: 'Mantar Pano' },
  menuBoard: { x: 255, y: 14, width: 140, height: 58, label: 'Cozy Kafe Menüsü' },
  jukebox: { x: 425, y: 16, width: 44, height: 54, label: 'Retro Müzik Çalar' },

  tables: [
    { id: 'cafe_couple', x: 310, y: 250, width: 96, height: 44, name: 'Şömine Önü Romantik Çift Locası' },
    { id: 'cafe_t1', x: 270, y: 155, width: 64, height: 40, name: 'Pencere Kenarı Masası' },
    { id: 'cafe_t2', x: 440, y: 155, width: 64, height: 40, name: 'Plak Köşesi Masası' }
  ],

  decorSlots: [
    { decorId: 'cat_cushion', x: 170, y: 285 },
    { decorId: 'vintage_lamp', x: 200, y: 65 }
  ],

  npcs: [
    { id: 'deniz', sprite: 'npc_barista', name: 'Barista Deniz', x: 90, y: 76, isSitting: false, activity: 'Espresso demliyor ☕' },
    { id: 'sinan', sprite: 'npc_writer', name: 'Yazar Sinan', x: 288, y: 150, isSitting: true, activity: 'Roman Yazıyor ✍️' },
    { id: 'asli', sprite: 'npc_music_fan', name: 'Aslı', x: 458, y: 150, isSitting: true, activity: 'Lofi Müzik Dinliyor 🎧' }
  ],

  colliders: [
    { x: 0, y: 0, width: 640, height: 85 },
    { x: 0, y: 380, width: 640, height: 20 },
    { x: 0, y: 0, width: 25, height: 165 },
    { x: 0, y: 250, width: 25, height: 150 },
    { x: 615, y: 0, width: 25, height: 400 },
    { x: 35, y: 80, width: 195, height: 85 }, // Barista tezgahı
    { x: 310, y: 260, width: 96, height: 26 }, // Romantik Çift Locası Collider
    { x: 270, y: 165, width: 64, height: 26 },
    { x: 440, y: 165, width: 64, height: 26 }
  ],

  render(ctx, time, unlockedDecors = []) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};

    // 1. Zengin İtalyan Bistro Zemin (Terracotta Çini & Ahşap Kenarlık)
    ctx.fillStyle = '#9e4624';
    ctx.fillRect(0, 0, 640, 400);

    // Damalı/ekose sıcak çini deseni
    ctx.fillStyle = '#b85830';
    for (let x = 0; x < 640; x += 32) {
      for (let y = 85; y < 400; y += 32) {
        if ((x / 32 + y / 32) % 2 === 0) {
          ctx.fillRect(x, y, 32, 32);
        }
        // Çini derz çizgileri
        ctx.fillStyle = '#7a3114';
        ctx.fillRect(x, y, 32, 1);
        ctx.fillRect(x, y, 1, 32);
        ctx.fillStyle = '#b85830';
      }
    }

    // 2. Kırmızı Tuğla Duvar (Exposed Warm Brick Wall)
    ctx.fillStyle = '#802f1c';
    ctx.fillRect(0, 0, 640, 85);
    ctx.fillStyle = '#5c1e10';
    for (let y = 0; y < 85; y += 12) {
      ctx.fillRect(0, y, 640, 2); // Harç çizgisi
      const shift = (y % 24 === 0 ? 0 : 18);
      for (let x = shift; x < 640; x += 36) {
        ctx.fillRect(x, y, 2, 12);
      }
    }

    // Duvar altı ahşap süpürgelik
    ctx.fillStyle = '#42200d';
    ctx.fillRect(0, 82, 640, 6);

    // 3. Peri Işıkları (Warm Glowing Fairy Bulbs)
    ctx.strokeStyle = '#2b1a10';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    for (let x = 0; x < 640; x += 40) {
      ctx.quadraticCurveTo(x + 20, 32, x + 40, 20);
    }
    ctx.stroke();

    for (let x = 20; x < 630; x += 30) {
      const bulbGlow = Math.sin(time * 0.003 + x) * 0.35 + 0.65;
      ctx.fillStyle = `rgba(255, 235, 160, ${bulbGlow * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, 26 + Math.sin(x * 0.1) * 3, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff4cc';
      ctx.beginPath();
      ctx.arc(x, 26 + Math.sin(x * 0.1) * 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Barista Tezgahı (Good Coffee Barista Counter)
    ctx.fillStyle = '#422410';
    ctx.fillRect(35, 80, 190, 85);
    ctx.fillStyle = '#6b3e1f';
    ctx.fillRect(38, 83, 184, 22); // Masif tezgah üstü
    ctx.fillStyle = '#8f552d';
    ctx.fillRect(40, 84, 180, 4);

    // Pirinç Ayak Basma Borusu (Brass Footrail)
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(40, 158, 180, 3);

    // A. İki Gruplu Profesyonel Espresso Makinesi (Chrome & Steam)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(52, 56, 48, 32);
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(54, 58, 44, 28);
    // Basınç göstergesi
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 62, 6, 6);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(63, 64, 2, 2); // İbre
    // Portafiltre kolları
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(72, 74, 12, 4);
    ctx.fillRect(86, 74, 12, 4);

    // Yükselen Kahve Buharı (Animated Steam Particles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    const steamShift = (time * 0.04) % 20;
    ctx.fillRect(66 + Math.sin(time * 0.005) * 3, 50 - steamShift, 4, 6);
    ctx.fillRect(80 - Math.sin(time * 0.005) * 3, 53 - steamShift, 4, 5);

    // B. Kahve Değirmeni (Coffee Grinder with Beans)
    ctx.fillStyle = '#34495e';
    ctx.fillRect(108, 62, 18, 24);
    ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
    ctx.fillRect(110, 52, 14, 12); // Cam hazne
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(112, 55, 10, 8);   // Çekirdekler

    // C. Şurup Pompaları (Vanilla, Caramel, Hazelnut)
    const syrupColors = ['#f5e6ca', '#d48b48', '#8b5a2b'];
    for (let s = 0; s < 3; s++) {
      const sx = 132 + (s * 8);
      ctx.fillStyle = syrupColors[s];
      ctx.fillRect(sx, 68, 6, 16);
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(sx + 2, 64, 2, 4); // Pompa ucu
    }

    // D. Pasta Vitrini (Glass Pastry Showcase)
    ctx.fillStyle = 'rgba(220, 245, 255, 0.55)';
    ctx.fillRect(162, 70, 48, 22);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(162, 70, 48, 22);

    // Kruvasanlar & Kurabiyeler
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(168, 80, 10, 6); // Kruvasan
    ctx.fillRect(182, 80, 10, 6);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(196, 81, 7, 7);  // Çikolatalı kurabiye

    // 5. Retro Menü Kara Tahtası (Chalkboard Menu with Coffee Art - Sipariş [E])
    ctx.fillStyle = '#261b17';
    ctx.fillRect(255, 14, 140, 58);
    ctx.fillStyle = '#3d2618';
    ctx.fillRect(258, 17, 134, 52);

    ctx.fillStyle = '#f8f4eb';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('☕ GOOD COFFEE MENÜ [E] ☕', 260, 29);
    ctx.font = '7px Silkscreen, monospace';
    ctx.fillStyle = '#ffdfba';
    ctx.fillText('• Caramel Latte ... 3★', 264, 42);
    ctx.fillText('• Pour Over Drip .. 2★', 264, 52);
    ctx.fillText('• Sıcak Kurabiye .. 2★', 264, 62);

    // 6. Duvar Sanatı: Retro Çerçeveli Kahve Posteri & Müzik Çalar
    ctx.fillStyle = '#d4af37'; // Altın çerçeve
    ctx.fillRect(425, 16, 44, 54);
    ctx.fillStyle = '#f7eed7';
    ctx.fillRect(428, 19, 38, 48);
    ctx.fillStyle = '#8c2d19';
    ctx.font = '7px Silkscreen, monospace';
    ctx.fillText('LO-FI', 432, 33);
    ctx.fillText('RADIO', 432, 45);
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(442, 50, 10, 10); // Minik kupa ikonu

    // 7. Mantar Pano (Kafe Notları)
    ctx.fillStyle = '#c49a6c';
    ctx.fillRect(212, 94, 28, 28);
    ctx.fillStyle = '#ff7675';
    ctx.fillRect(216, 98, 8, 8);
    ctx.fillStyle = '#ffeaa7';
    ctx.fillRect(224, 108, 8, 8);

    // Kedi Pamuk'un Yeri İşareti (Sıcak köşe)
    ctx.fillStyle = 'rgba(255, 235, 180, 0.15)';
    ctx.beginPath();
    ctx.ellipse(180, 295, 26, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bahçeye Çıkış Tabelası
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('◀ BAHÇE', 10, 155);

    // Açık Dekorlar
    this.decorSlots.forEach(slot => {
      if (unlockedDecors.includes(slot.decorId) && spritesCache[slot.decorId]) {
        ctx.drawImage(spritesCache[slot.decorId], slot.x, slot.y);
      }
    });
  }
};
