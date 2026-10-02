// ========================================================
// CozyStudy: Sınıf & Kütüphane Haritası (Classroom Map)
// ========================================================

export const classroom = {
  name: 'classroom',
  displayName: 'Sınıf & Kütüphane 🏫',
  width: 640,
  height: 400,

  doors: [
    {
      x: 595, y: 175, width: 45, height: 80,
      targetRoom: 'garden',
      spawnX: 70, spawnY: 200,
      label: 'Bahçe ➔'
    }
  ],

  // Not Panosu (Kara tahtanın hemen sağında)
  noteBoard: { x: 390, y: 12, width: 38, height: 50, label: 'Not Panosu' },

  tables: [
    { id: 'class_couple', x: 160, y: 165, width: 96, height: 44, name: 'Can & Sezen Birlikte Çalışma Sırası' },
    { id: 'class_t1', x: 50, y: 165, width: 64, height: 40, name: 'Pencere Önü Sıra 1' },
    { id: 'class_t2', x: 50, y: 265, width: 64, height: 40, name: 'Pencere Önü Sıra 2' },
    { id: 'class_t3', x: 180, y: 265, width: 64, height: 40, name: 'Kütüphane Masası' }
  ],

  decorSlots: [
    { decorId: 'plant_monstera', x: 32, y: 80 },
    { decorId: 'vintage_lamp', x: 440, y: 65 }
  ],

  npcs: [
    { id: 'teacher', sprite: 'npc_teacher', name: 'Prof. Hikmet', x: 440, y: 70, isSitting: false, activity: 'Ders notlarını inceliyor 📝' },
    { id: 'pelin', sprite: 'npc_student_reading', name: 'Pelin', x: 68, y: 260, isSitting: true, activity: 'Tıp & Anatomi 📖' },
    { id: 'mert', sprite: 'npc_student_tech', name: 'Mert', x: 198, y: 260, isSitting: true, activity: 'Algoritma Kodluyor 💻' }
  ],

  colliders: [
    { x: 0, y: 0, width: 640, height: 85 },
    { x: 0, y: 380, width: 640, height: 20 },
    { x: 0, y: 0, width: 24, height: 400 },
    { x: 616, y: 0, width: 24, height: 175 },
    { x: 616, y: 255, width: 24, height: 145 },
    { x: 410, y: 75, width: 180, height: 50 }, // Öğretmen masası & kitaplık
    { x: 160, y: 175, width: 96, height: 26 }, // Çift Masası Collider
    { x: 50, y: 175, width: 64, height: 26 },
    { x: 50, y: 275, width: 64, height: 26 },
    { x: 180, y: 275, width: 64, height: 26 }
  ],

  render(ctx, time, unlockedDecors = []) {
    const spritesCache = (typeof window !== 'undefined' && window.Sprites && window.Sprites.cache) ? window.Sprites.cache : {};

    // 1. Zengin Ahşap Parke Zemin (Plank Seams & Woodgrain)
    ctx.fillStyle = '#b07338';
    ctx.fillRect(0, 0, 640, 400);

    // Parke çizgileri ve ton çeşitliliği
    for (let y = 85; y < 400; y += 22) {
      ctx.fillStyle = '#965e2b';
      ctx.fillRect(0, y, 640, 2);
      for (let x = (y % 44 === 0 ? 0 : 36); x < 640; x += 72) {
        ctx.fillRect(x, y, 2, 22);
        // Ahşap budak dokusu
        if ((x + y) % 5 === 0) {
          ctx.fillStyle = 'rgba(70, 35, 10, 0.15)';
          ctx.fillRect(x + 12, y + 8, 8, 3);
          ctx.fillStyle = '#965e2b';
        }
      }
    }

    // 2. Duvar (Üst Krem Kağıt + Alt Maun Ahşap Lambri)
    ctx.fillStyle = '#f0e6d2';
    ctx.fillRect(0, 0, 640, 65);
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(0, 65, 640, 20); // Lambri üst çıtası
    ctx.fillStyle = '#7a421b';
    ctx.fillRect(0, 69, 640, 16);
    for (let x = 16; x < 640; x += 32) {
      ctx.fillStyle = '#4a250d';
      ctx.fillRect(x, 69, 2, 16);
    }

    // 3. Arka Pencereler & Cama Vuran Yağmur İllüzyonu
    [36, 420].forEach(wx => {
      // Pencere ahşap kasası
      ctx.fillStyle = '#5c3214';
      ctx.fillRect(wx - 2, 10, 58, 54);
      ctx.fillStyle = '#96c8e6';
      ctx.fillRect(wx + 2, 14, 50, 46);

      // Yağmur çizgileri camda
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const dropOffset = (time * 0.05) % 30;
      ctx.fillRect(wx + 10, 16 + dropOffset, 1, 6);
      ctx.fillRect(wx + 24, 24 + ((dropOffset * 1.3) % 28), 1, 5);
      ctx.fillRect(wx + 38, 14 + ((dropOffset * 0.8) % 32), 1, 7);

      // Pencere bölmeleri
      ctx.fillStyle = '#5c3214';
      ctx.fillRect(wx + 26, 14, 2, 46);
      ctx.fillRect(wx + 2, 36, 50, 2);

      // Zemine vuran yumuşak gün ışığı konisi
      ctx.fillStyle = 'rgba(255, 248, 220, 0.08)';
      ctx.beginPath();
      ctx.moveTo(wx + 2, 65);
      ctx.lineTo(wx + 52, 65);
      ctx.lineTo(wx + 90, 260);
      ctx.lineTo(wx - 30, 260);
      ctx.closePath();
      ctx.fill();
    });

    // Sol Pencere Altı Sıcak Radyatör Kaloriferi
    ctx.fillStyle = '#d5dbdb';
    ctx.fillRect(38, 68, 54, 18);
    ctx.fillStyle = '#95a5a6';
    for (let rx = 42; rx < 88; rx += 5) {
      ctx.fillRect(rx, 70, 2, 14);
    }

    // 4. Büyük Kara Tahta (Chalkboard & Chalk Art)
    ctx.fillStyle = '#3e2311';
    ctx.fillRect(135, 12, 250, 52);
    ctx.fillStyle = '#1e382b';
    ctx.fillRect(139, 16, 242, 44);

    // Tebeşir Yazıları & Çizimler
    ctx.fillStyle = '#e8f5e9';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('∫ (odaklanma) dt = BAŞARI 🎓', 148, 30);
    ctx.fillStyle = '#ff8fa3';
    ctx.fillText('Can + Sezen = ❤️ Sonsuz', 148, 44);
    ctx.fillStyle = '#ffd166';
    ctx.fillText('Bugünkü Hedef: 4 Seans 🍅', 148, 54);

    // Tebeşir silgisi ve tebeşirler rafta
    ctx.fillStyle = '#8a6240';
    ctx.fillRect(150, 58, 220, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(330, 57, 6, 2); // Beyaz tebeşir
    ctx.fillStyle = '#ff8fa3';
    ctx.fillRect(338, 57, 5, 2); // Pembe tebeşir
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(346, 56, 12, 3); // Silgi

    // 5. Not Panosu (Kara Tahtanın Yanında - Post-It Panosu)
    ctx.fillStyle = '#b88349';
    ctx.fillRect(392, 14, 34, 46);
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(394, 16, 30, 42);
    // Sarı Post-It
    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(398, 20, 10, 10);
    ctx.fillStyle = '#e76f51';
    ctx.fillRect(402, 19, 2, 2); // Raptiye
    // Pembe Kalp Post-It
    ctx.fillStyle = '#ffccd5';
    ctx.fillRect(410, 32, 11, 10);
    ctx.fillStyle = '#e76f51';
    ctx.fillRect(414, 31, 2, 2);
    ctx.fillStyle = '#261b17';
    ctx.font = '6px Silkscreen, monospace';
    ctx.fillText('NOT', 398, 40);

    // 6. Kütüphane Kitaplığı (Bookshelf) & Sarmaşık
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(480, 50, 115, 75);
    ctx.fillStyle = '#7a451e';
    ctx.fillRect(484, 54, 107, 67);

    const bookTones = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#d35400', '#16a085'];
    for (let r = 0; r < 3; r++) {
      const rowY = 56 + (r * 22);
      ctx.fillStyle = '#4a250d';
      ctx.fillRect(484, rowY + 18, 107, 2); // Raf çizgisi

      let bx = 488;
      for (let b = 0; b < 10; b++) {
        ctx.fillStyle = bookTones[(b + r * 3) % bookTones.length];
        const bHeight = 13 + ((b * 3) % 5);
        ctx.fillRect(bx, rowY + 18 - bHeight, 8, bHeight);
        // Altın yaldızlı sırt çizgisi
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(bx + 1, rowY + 18 - bHeight + 3, 6, 1);
        bx += 10;
      }
    }

    // Kitaplığın üstünde sarkan yeşil sarmaşık saksısı
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(570, 42, 14, 9);
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(568, 38, 18, 6);
    ctx.fillRect(574, 46, 4, 12);
    ctx.fillRect(578, 48, 3, 16);

    // Çıkış Kapısı & Tabela
    ctx.fillStyle = '#5c3214';
    ctx.fillRect(600, 170, 40, 90);
    ctx.fillStyle = '#825227';
    ctx.fillRect(604, 174, 32, 82);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(608, 214, 4, 4); // Pirinç kapı kolu

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Silkscreen, monospace';
    ctx.fillText('BAHÇE ➔', 584, 165);

    // Açık Dekorlar
    this.decorSlots.forEach(slot => {
      if (unlockedDecors.includes(slot.decorId) && spritesCache[slot.decorId]) {
        ctx.drawImage(spritesCache[slot.decorId], slot.x, slot.y);
      }
    });
  }
};
