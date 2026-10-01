// ========================================================
// CozyStudy: Haritalar 3.0 (Good Coffee, Great Coffee & Stardew Valley Zanaat)
// Çardaklı Bahçe, Sıcak Kütüphane Sınıfı ve Canlı Barista Kafe
// ========================================================

const Maps = {
  // Gerçek Saate Göre Atmosferik Işıklandırma Rengi
  getLightingOverlay(time) {
    const hour = new Date().getHours();
    // Sabah (06-09): Yumuşak altın şafak huzmesi
    if (hour >= 6 && hour < 9) {
      return 'rgba(255, 215, 140, 0.09)';
    }
    // Gündüz (09-17): Doğal gün ışığı
    if (hour >= 9 && hour < 17) {
      return 'rgba(255, 255, 255, 0)';
    }
    // Gün Batımı (17-20): Sıcak kehribar / turuncu romantik ton
    if (hour >= 17 && hour < 20) {
      return 'rgba(235, 120, 60, 0.15)';
    }
    // Gece (20-06): Huzurlu gece mavisi / ay ışığı
    return 'rgba(18, 22, 50, 0.40)';
  },

  // ========================================================
  // 1. Sınıf / Kütüphane (Classroom)
  // Sıcak ahşap parkeler, camdan akan yağmur, kitaplık ve not panosu
  // ========================================================
  classroom: {
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
        if (unlockedDecors.includes(slot.decorId) && Sprites.cache[slot.decorId]) {
          ctx.drawImage(Sprites.cache[slot.decorId], slot.x, slot.y);
        }
      });
    }
  },

  // ========================================================
  // 2. Bahçe (Garden) - ÇARDAKLI MASALAR (Gazebos)
  // Çardaklar altında piknik masaları, fıskiye, dilek ağacı & taş patika
  // ========================================================
  garden: {
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
      }
    ],

    noteBoard: { x: 536, y: 60, width: 48, height: 50, label: 'Dilek Ağacı' },

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
      { x: 0, y: 375, width: 640, height: 25 },
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
        const gz = isCouple ? (Sprites.cache['garden_gazebo_couple'] || Sprites.cache['garden_gazebo']) : Sprites.cache['garden_gazebo'];
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

      // Açık Dekorlar
      this.decorSlots.forEach(slot => {
        if (unlockedDecors.includes(slot.decorId) && Sprites.cache[slot.decorId]) {
          ctx.drawImage(Sprites.cache[slot.decorId], slot.x, slot.y);
        }
      });
    }
  },

  // ========================================================
  // 3. Kafe (Cafe) - GOOD COFFEE, GREAT COFFEE ESTETİĞİ ☕
  // Barista tezgahı, parlayan espresso makinesi, fırın vitrini, peri ışıkları
  // ========================================================
  cafe: {
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

      // 5. Retro Menü Kara Tahtası (Chalkboard Menu with Coffee Art)
      ctx.fillStyle = '#261b17';
      ctx.fillRect(255, 14, 140, 58);
      ctx.fillStyle = '#3d2618';
      ctx.fillRect(258, 17, 134, 52);

      ctx.fillStyle = '#f8f4eb';
      ctx.font = '8px Silkscreen, monospace';
      ctx.fillText('☕ GOOD COFFEE ☕', 268, 29);
      ctx.font = '7px Silkscreen, monospace';
      ctx.fillStyle = '#ffdfba';
      ctx.fillText('• Caramel Latte ... 3★', 264, 42);
      ctx.fillText('• Pour Over Drip .. 2★', 264, 52);
      ctx.fillText('• Sıcak Kurabiye .. 2★', 264, 62);

      // 6. Duvar Sanatı: Retro Çerçeveli Kahve Posteri
      ctx.fillStyle = '#d4af37'; // Altın çerçeve
      ctx.fillRect(425, 16, 44, 54);
      ctx.fillStyle = '#f7eed7';
      ctx.fillRect(428, 19, 38, 48);
      ctx.fillStyle = '#8c2d19';
      ctx.font = '7px Silkscreen, monospace';
      ctx.fillText('FRESH', 432, 33);
      ctx.fillText('ROAST', 432, 45);
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
        if (unlockedDecors.includes(slot.decorId) && Sprites.cache[slot.decorId]) {
          ctx.drawImage(Sprites.cache[slot.decorId], slot.x, slot.y);
        }
      });
    }
  }
};
