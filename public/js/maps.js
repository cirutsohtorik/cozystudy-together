// ========================================================
// CozyStudy: Haritalar 3.0 (Good Coffee, Great Coffee & Stardew Valley Zanaat)
// Çardaklı Bahçe, Sıcak Kütüphane Sınıfı ve Canlı Barista Kafe
// ========================================================

const Maps = {
  // Gerçek Saate & Hava Durumuna Göre Atmosferik Işıklandırma Rengi (5 Aşamalı + İç Mekan Koruması)
  getLightingOverlay(time, weather = 'sunny', customHour = null, currentRoom = null) {
    let hour = customHour;
    if (hour === null || hour === undefined) {
      if (typeof Game !== 'undefined' && Game.currentHour !== undefined) {
        hour = Game.currentHour;
      } else {
        const d = new Date();
        hour = d.getHours() + (d.getMinutes() / 60);
      }
    }

    const room = currentRoom || (typeof Game !== 'undefined' ? Game.currentRoom : null);
    const isIndoor = ['dorm', 'classroom', 'cafe'].includes(room);
    const weatherType = (typeof weather === 'object' && weather) ? weather.type : weather;
    // İç mekanlarda yağmur/sis filtresi uygulanmaz (isIndoor koruması)
    const isRain = !isIndoor && weatherType === 'rainy';

    // 1. Gündoğumu (05:30 - 08:00): Sıcak altın-şeftali
    if (hour >= 5.5 && hour < 8.0) {
      return isRain ? 'rgba(180, 185, 205, 0.20)' : 'rgba(255, 205, 150, 0.14)';
    }
    // 2. Gündüz (08:00 - 11:30): Taze doğal gün ışığı
    if (hour >= 8.0 && hour < 11.5) {
      return isRain ? 'rgba(120, 140, 170, 0.16)' : 'rgba(255, 255, 255, 0)';
    }
    // 3. Öğlen (11:30 - 15:30): Parlak tepe berraklığı
    if (hour >= 11.5 && hour < 15.5) {
      return isRain ? 'rgba(100, 125, 155, 0.18)' : 'rgba(255, 250, 230, 0.05)';
    }
    // 4. Günbatımı (15:30 - 19:30): Sıcak kehribar & kızıl altın
    if (hour >= 15.5 && hour < 19.5) {
      return isRain ? 'rgba(140, 75, 95, 0.24)' : 'rgba(235, 115, 55, 0.20)';
    }
    // 5. Gece (19:30 - 05:30): Derin huzurlu gece mavisi & ay ışığı
    return isRain ? 'rgba(8, 12, 32, 0.52)' : 'rgba(16, 20, 50, 0.40)';
  },

  renderDynamicWindowView(ctx, wx, wy, w, h, time, customHour = null, weather = 'sunny') {
    let hour = customHour;
    if (hour === null || hour === undefined) {
      if (typeof Game !== 'undefined' && Game.currentHour !== undefined) {
        hour = Game.currentHour;
      } else {
        const d = new Date();
        hour = d.getHours() + (d.getMinutes() / 60);
      }
    }

    const curWeather = typeof weather === 'object' && weather ? weather.type : weather;

    ctx.save();
    ctx.beginPath();
    ctx.rect(wx, wy, w, h);
    ctx.clip();

    // 1. 5 Aşamalı Gökyüzü Degradesi
    const grad = ctx.createLinearGradient(wx, wy, wx, wy + h);
    if (hour >= 5.5 && hour < 8.0) {
      grad.addColorStop(0, '#7eb6d9');
      grad.addColorStop(0.5, '#fbc490');
      grad.addColorStop(1, '#ff9e79');
    } else if (hour >= 8.0 && hour < 11.5) {
      grad.addColorStop(0, '#5fa8e0');
      grad.addColorStop(1, '#a6dcef');
    } else if (hour >= 11.5 && hour < 15.5) {
      grad.addColorStop(0, '#4293d8');
      grad.addColorStop(1, '#bfe9ff');
    } else if (hour >= 15.5 && hour < 19.5) {
      grad.addColorStop(0, '#4a2559');
      grad.addColorStop(0.5, '#c75248');
      grad.addColorStop(1, '#f99f48');
    } else {
      grad.addColorStop(0, '#0a0f24');
      grad.addColorStop(1, '#162044');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(wx, wy, w, h);

    // 2. Gök Cisimleri (Güneş, Ay, Yıldızlar)
    const isNight = hour >= 19.5 || hour < 5.5;
    if (isNight) {
      ctx.fillStyle = '#fef08a';
      const starSeeds = [[8, 10], [28, 6], [16, 22], [36, 18], [24, 32], [42, 30]];
      starSeeds.forEach(([sx, sy]) => {
        const px = wx + (sx % w);
        const py = wy + (sy % h);
        const twinkle = Math.sin(time * 0.003 + sx) > 0.2 ? 1 : 0.5;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(px, py, 1.5, 1.5);
      });
      ctx.globalAlpha = 1.0;

      const moonX = wx + w - 12;
      const moonY = wy + 10;
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#162044';
      ctx.beginPath();
      ctx.arc(moonX - 2, moonY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (curWeather === 'sunny') {
      const sunX = (hour >= 5.5 && hour < 8.0) ? wx + 12 : ((hour >= 15.5) ? wx + w - 12 : wx + w / 2);
      const sunY = (hour >= 11.5 && hour < 15.5) ? wy + 8 : wy + 14;
      ctx.fillStyle = 'rgba(255, 235, 140, 0.35)';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Cam Üzeri Dinamik Hava Durumu Efektleri
    if (curWeather === 'cloudy') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      const cloudOffset1 = (time * 0.008) % (w + 40) - 20;
      const cloudOffset2 = (time * 0.005 + 25) % (w + 40) - 20;
      ctx.fillRect(wx + cloudOffset1, wy + 8, 14, 5);
      ctx.fillRect(wx + cloudOffset1 + 3, wy + 5, 8, 4);
      ctx.fillRect(wx + cloudOffset2, wy + 18, 18, 6);
      ctx.fillRect(wx + cloudOffset2 + 4, wy + 15, 10, 4);
    } else if (curWeather === 'rainy') {
      ctx.fillStyle = 'rgba(80, 100, 130, 0.30)';
      ctx.fillRect(wx, wy, w, h);

      ctx.fillStyle = 'rgba(200, 225, 255, 0.45)';
      for (let r = 0; r < 5; r++) {
        const rx = wx + ((r * 11 + time * 0.03) % w);
        const ry = wy + ((time * 0.08 + r * 15) % h);
        ctx.fillRect(rx, ry, 1, 5);
      }

      for (let d = 0; d < 4; d++) {
        const dropSpeed = 8 + (d * 4);
        const dropY = wy + ((time * 0.001 * dropSpeed + d * 13) % h);
        const dropX = wx + 6 + (d * 10);
        ctx.fillStyle = 'rgba(220, 240, 255, 0.40)';
        ctx.fillRect(dropX, dropY - 3, 1, 3);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
        ctx.fillRect(dropX, dropY, 1.5, 1.5);
      }
    } else if (curWeather === 'snowy') {
      ctx.fillStyle = 'rgba(215, 225, 245, 0.25)';
      ctx.fillRect(wx, wy, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let s = 0; s < 6; s++) {
        const sfY = wy + ((time * 0.015 + s * 11) % h);
        const sfX = wx + ((s * 9 + Math.sin(time * 0.002 + s * 2) * 5 + 50) % w);
        ctx.fillRect(sfX, sfY, 1.5, 1.5);
      }
    }

    ctx.restore();
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

      // 3. Arka Pencereler (Dinamik Gökyüzü & Hava Görünümü)
      const currentHour = (typeof Game !== 'undefined' && Game.currentHour !== undefined) ? Game.currentHour : 12;
      const weather = (typeof Game !== 'undefined' && Game.weather) ? Game.weather : 'sunny';

      [36, 420].forEach(wx => {
        // Pencere ahşap kasası
        ctx.fillStyle = '#5c3214';
        ctx.fillRect(wx - 2, 10, 58, 54);

        // Dinamik Gökyüzü ve Hava Olayı
        Maps.renderDynamicWindowView(ctx, wx + 2, 14, 50, 46, time, currentHour, weather);

        // Pencere bölmeleri (Ahşap çıtalar)
        ctx.fillStyle = '#5c3214';
        ctx.fillRect(wx + 26, 14, 2, 46);
        ctx.fillRect(wx + 2, 36, 50, 2);

        // Zemine vuran yumuşak gün ışığı konisi (Gündüz saatlerinde)
        if (currentHour >= 6 && currentHour < 18) {
          ctx.fillStyle = 'rgba(255, 248, 220, 0.08)';
          ctx.beginPath();
          ctx.moveTo(wx + 2, 65);
          ctx.lineTo(wx + 52, 65);
          ctx.lineTo(wx + 90, 260);
          ctx.lineTo(wx - 30, 260);
          ctx.closePath();
          ctx.fill();
        }
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
      ctx.fillText('▼ KAMPÜS YOLU', 265, 394);

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
        if (unlockedDecors.includes(slot.decorId) && Sprites.cache[slot.decorId]) {
          ctx.drawImage(Sprites.cache[slot.decorId], slot.x, slot.y);
        }
      });
    }
  },

  // ========================================================
  // 4. Kampüs Patikası (Campus Path 🌳)
  // Ağaçlı & Çimli Yeşil Yol, Banklar, Sokak Fenerleri & Gezen Öğrenci/Hocalar
  // ========================================================
  campus_path: {
    name: 'campus_path',
    displayName: 'Kampüs Patikası 🌳',
    width: 640,
    height: 400,

    doors: [
      {
        x: 260, y: 0, width: 120, height: 60,
        targetRoom: 'garden',
        spawnX: 320, spawnY: 290,
        label: '▲ Bahçe'
      },
      {
        x: 260, y: 355, width: 120, height: 45,
        targetRoom: 'dorm',
        spawnX: 320, spawnY: 110,
        label: '▼ Can & Sezen Yurdu'
      }
    ],

    tables: [
      { id: 'campus_bench_left', x: 110, y: 170, width: 64, height: 40, name: 'Ihlamur Ağacı Altı Kampüs Bankı', occupied: true, occupiedBy: 'Kerem', disabled: true },
      { id: 'campus_bench_right', x: 460, y: 210, width: 64, height: 40, name: 'Güneşli Kiraz Çiçeği Bankı', maxCapacity: 1 }
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
      if (Sprites.cache['campus_tree_oak']) {
        ctx.drawImage(Sprites.cache['campus_tree_oak'], 40, 40);
        ctx.drawImage(Sprites.cache['campus_tree_oak'], 540, 230);
      }
      if (Sprites.cache['campus_tree_cherry']) {
        ctx.drawImage(Sprites.cache['campus_tree_cherry'], 540, 40);
        ctx.drawImage(Sprites.cache['campus_tree_cherry'], 40, 230);
      }

      // 4. Kampüs Bankları (Masalar)
      if (Sprites.cache['campus_bench']) {
        ctx.drawImage(Sprites.cache['campus_bench'], 118, 175);
        ctx.drawImage(Sprites.cache['campus_bench'], 468, 215);
      }

      // 5. Viktoryen Sokak Lambaları (4 Adet Yol Kenarı)
      const lamps = [
        { x: 250, y: 70 },
        { x: 374, y: 70 },
        { x: 250, y: 260 },
        { x: 374, y: 260 }
      ];
      lamps.forEach(l => {
        if (Sprites.cache['campus_lamppost']) {
          ctx.drawImage(Sprites.cache['campus_lamppost'], l.x, l.y);
        }
      });

      // 6. Yön Tabelaları & İpuçları
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Silkscreen, monospace';
      ctx.fillText('▲ BAHÇE & KAFE', 270, 16);
      ctx.fillText('▼ CAN & SEZEN YURDU', 255, 394);
    }
  },

  // ========================================================
  // 5. Can & Sezen Yurt Odası (Dorm Room 🛏️)
  // 2 Tek Yatak (Can & Sezen), Çalışma Masaları, Çay İstasyonu, Buzdolabı, Gardıroplar & Lofi Radyo
  // ========================================================
  dorm: {
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
      const spritesCache = (typeof Sprites !== 'undefined' && Sprites.cache) ? Sprites.cache : {};
      const currentHour = (typeof Game !== 'undefined' && Game.currentHour !== undefined) ? Game.currentHour : 12;
      const weather = (typeof Game !== 'undefined' && Game.weather) ? Game.weather : 'sunny';

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
        Maps.renderDynamicWindowView(ctx, wx + 2, 12, 46, 42, time, currentHour, weather);

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
      const playersList = players || (typeof Network !== 'undefined' && Network.players ? Object.values(Network.players) : []);
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
  }
};
