// ========================================================
// CozyStudy: Huzur Bahçesi Haritası (Garden Map)
// ========================================================

export const garden = {
  name: 'garden',
  displayName: 'Huzur Bahçesi 🌸',
  width: 640,
  height: 400,

  doors: [
    {
      x: 0, y: 165, width: 45, height: 85,
      targetRoom: 'classroom',
      spawnX: 560, spawnY: 210,
      label: '◀ Sınıf'
    },
    {
      x: 595, y: 165, width: 45, height: 85,
      targetRoom: 'cafe',
      spawnX: 70, spawnY: 200,
      label: 'Kafe ➔'
    },
    {
      x: 260, y: 355, width: 120, height: 45,
      targetRoom: 'campus_path',
      spawnX: 320, spawnY: 100,
      label: '▼ Kampüs Yolu'
    }
  ],

  noteBoard: { x: 536, y: 60, width: 48, height: 50, label: 'Dilek Ağacı' },
  wishingFountain: { x: 270, y: 120, width: 90, height: 65, label: 'Dilek Çeşmesi' },

  // Çardaklı Masalar (Gazebo Covered Tables)
  tables: [
    { id: 'garden_couple', x: 265, y: 255, width: 96, height: 44, name: 'Büyük Çardaklı Çift Masası' },
    { id: 'garden_t1', x: 100, y: 150, width: 64, height: 40, name: 'Sarmaşıklı Çardak (Sol)' },
    { id: 'garden_t2', x: 440, y: 150, width: 64, height: 40, name: 'Güllü Çardak (Sağ)' }
  ],

  decorSlots: [
    { decorId: 'heart_rug', x: 295, y: 330 },
    { decorId: 'star_lantern', x: 80, y: 40 }
  ],

  npcs: [
    { id: 'salih', sprite: 'npc_gardener', name: 'Salih Amca', x: 480, y: 300, isSitting: false, activity: 'Gülleri suluyor 🌹' },
    { id: 'melis', sprite: 'npc_artist', name: 'Melis', x: 180, y: 120, isSitting: false, activity: 'Fıskiyeyi resmediyor 🎨' },
    { id: 'ege', sprite: 'npc_student_relax', name: 'Ege', x: 95, y: 105, isSitting: false, activity: 'Kitap okuyor 📚' }
  ],

  colliders: [
    { x: 0, y: 0, width: 640, height: 40 },
    { x: 0, y: 375, width: 270, height: 25 }, // Güney sol duvar
    { x: 370, y: 375, width: 270, height: 25 }, // Güney sağ duvar (Ortası Kampüs Yolu için açık)
    { x: 0, y: 0, width: 25, height: 165 },
    { x: 0, y: 250, width: 25, height: 150 },
    { x: 615, y: 0, width: 25, height: 165 },
    { x: 615, y: 250, width: 25, height: 150 },
    { x: 270, y: 120, width: 90, height: 65 }, // Fıskiye
    { x: 40, y: 40, width: 70, height: 70 },   // Sol ağaç
    { x: 530, y: 40, width: 70, height: 70 },  // Sağ ağaç
    // Çardak masaları çarpışma kutuları
    { x: 265, y: 265, width: 96, height: 26 }, // Büyük Çift Çardağı
    { x: 100, y: 160, width: 64, height: 26 },
    { x: 440, y: 160, width: 64, height: 26 }
  ],

  render(ctx, time, unlockedDecors = []) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};

    // 1. Canlı Çimenlik ve Ton Çeşitliliği
    ctx.fillStyle = '#4f8a37';
    ctx.fillRect(0, 0, 640, 400);

    // Çimen dokusu ve dapple ışık gölgeleri
    ctx.fillStyle = '#5c9e42';
    for (let x = 20; x < 620; x += 32) {
      for (let y = 35; y < 380; y += 36) {
        const shift = ((x * 7 + y * 13) % 11);
        ctx.fillRect(x + shift, y, 4, 3);
        ctx.fillRect(x + shift + 1, y - 2, 2, 2);
      }
    }

    // 2. Taş Patika (Doğal Arnavut Kaldırımı)
    ctx.fillStyle = '#8f887f';
    ctx.fillRect(0, 180, 640, 46);
    ctx.fillRect(285, 80, 60, 300);

    // Ayrı ayrı parke taşları & aralarındaki yosunlar
    ctx.fillStyle = '#a69f94';
    for (let x = 8; x < 632; x += 18) {
      for (let py = 184; py < 220; py += 12) {
        const s = ((x + py) % 4);
        ctx.fillRect(x + s, py, 14, 8);
        // Yosun yeşili
        if ((x * py) % 7 === 0) {
          ctx.fillStyle = '#3d6e2e';
          ctx.fillRect(x + s + 2, py + 6, 4, 2);
          ctx.fillStyle = '#a69f94';
        }
      }
    }

    // 3. Rengarenk Kır Çiçekleri (Wildflowers & Lavender)
    const flowerColors = ['#ff8fa3', '#fff', '#ffd166', '#a0c4ff', '#b5179e'];
    for (let i = 0; i < 50; i++) {
      const fx = (i * 97) % 580 + 30;
      const fy = (i * 67) % 320 + 45;
      // Patikanın üstüne çiçek gelmesin
      if ((fy > 175 && fy < 230) || (fx > 275 && fx < 350 && fy > 80)) continue;

      ctx.fillStyle = flowerColors[i % flowerColors.length];
      ctx.fillRect(fx, fy, 3, 3);
      ctx.fillStyle = '#2d5e23';
      ctx.fillRect(fx + 1, fy + 3, 1, 3);
    }

    // 4. Ortadaki Taş Fıskiye (Animated Fountain with Ripples)
    const fx = 275;
    const fy = 115;

    // Taş havuz tabanı & gölgesi
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(fx + 40, fy + 48, 44, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5d646e';
    ctx.fillRect(fx, fy + 20, 80, 36);
    ctx.fillStyle = '#3a88b5';
    ctx.fillRect(fx + 5, fy + 24, 70, 28);

    // Canlı su dalgaları (Su yüzeyi ışıltısı)
    ctx.fillStyle = '#8ee3f5';
    const wave = Math.sin(time * 0.005) * 4;
    ctx.fillRect(fx + 15 + wave, fy + 32, 16, 2);
    ctx.fillRect(fx + 45 - wave, fy + 38, 20, 2);

    // Nilüfer yaprağı ve minik çiçek havuzda
    ctx.fillStyle = '#2d6a3f';
    ctx.fillRect(fx + 18, fy + 40, 8, 5);
    ctx.fillStyle = '#ff8fa3';
    ctx.fillRect(fx + 22, fy + 39, 3, 3);

    // Fıskiye orta sütunu & yukarı fışkıran su damlaları
    ctx.fillStyle = '#7a828c';
    ctx.fillRect(fx + 34, fy + 4, 12, 28);
    ctx.fillStyle = '#bfefff';
    const dropH = (time * 0.05) % 18;
    ctx.fillRect(fx + 37, fy + 2 - dropH, 3, 4);
    ctx.fillRect(fx + 41, fy + 5 - (dropH * 0.8), 2, 3);

    // 5. Sol & Sağ Ağaçlar ve DİLEK AĞACI (Wishing Tree 🌸)
    // Sol Meyve Ağacı
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(66, 65, 18, 38);
    ctx.fillStyle = '#275922';
    ctx.beginPath();
    ctx.arc(75, 52, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#397831';
    ctx.beginPath();
    ctx.arc(75, 46, 24, 0, Math.PI * 2);
    ctx.fill();
    // Kırmızı elmalar
    ctx.fillStyle = '#e63946';
    ctx.fillRect(62, 42, 4, 4);
    ctx.fillRect(84, 54, 4, 4);
    ctx.fillRect(72, 32, 4, 4);

    // Sağ Kiraz Çiçeği Dilek Ağacı (Not Panosu)
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(546, 65, 20, 40);
    // Pembe Sakura/Dilek Yaprakları
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.arc(556, 50, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.arc(556, 44, 25, 0, Math.PI * 2);
    ctx.fill();

    // Dallarında asılı renkli dilek kurdeleleri
    const ribbons = ['#ffd166', '#06d6a0', '#118ab2', '#ff6b6b'];
    ribbons.forEach((col, idx) => {
      const rx = 538 + (idx * 10);
      const ry = 62 + ((idx * 5) % 8);
      ctx.fillStyle = col;
      ctx.fillRect(rx, ry, 2, 7);
    });

    // Dilek Ağacı Ahşap Plaketi
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(530, 95, 48, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px Silkscreen, monospace';
    ctx.fillText('DİLEK AĞACI', 534, 106);

    // 6. ÇARDAKLARIN ÇİZİMİ (Her Bahçe Masasının Üzerine Çardak)
    this.tables.forEach(t => {
      const isCouple = t.width > 70;
      const gz = isCouple ? (spritesCache['garden_gazebo_couple'] || spritesCache['garden_gazebo']) : spritesCache['garden_gazebo'];
      if (gz) {
        const gx = isCouple ? t.x - 16 : t.x - 16;
        const gy = isCouple ? t.y - 28 : t.y - 24;
        ctx.drawImage(gz, gx, gy);
      }
    });

    // Kapı Yön Tabelaları
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('◀ SINIF', 10, 155);
    ctx.fillText('KAFE ▶', 585, 155);
    ctx.fillText('▼ KAMPÜS YOLU', 265, 394);

    // Açık Dekorlar
    this.decorSlots.forEach(slot => {
      if (unlockedDecors.includes(slot.decorId) && spritesCache[slot.decorId]) {
        ctx.drawImage(spritesCache[slot.decorId], slot.x, slot.y);
      }
    });
  }
};
