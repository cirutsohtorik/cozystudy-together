// ========================================================
// CozyStudy: Gelişmiş Piksel Sanatı Motoru (Pixel Art Sprites 3.0)
// Good Coffee, Great Coffee & Stardew Valley Zanaat Estetiği
// Çardaklı Bahçe Masaları, Zengin Detaylı Karakterler ve Sıcak Objeler
// ========================================================

const Sprites = {
  cache: {},

  init() {
    this.createCharacterSprites('Can');
    this.createCharacterSprites('Sezen');
    this.createFurnitureSprites();
    this.createGazeboSprites();
    this.createCatSprites();
    this.createDecorSprites();
    this.createHugSprite();
    this.createNPCSprites();
    this.createPortraitSprites();
    if (typeof AssetLoader !== 'undefined') {
      AssetLoader.init();
    }
  },

  createPixelCanvas(width, height, drawCallback) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawCallback(ctx);
    return canvas;
  },

  px(ctx, x, y, color, w = 1, h = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
  },

  // ========================================================
  // 1. Karakter Çizimleri (Can & Sezen - Gelişmiş 3-Ton Shading)
  // ========================================================
  createCharacterSprites(name) {
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

    this.cache[name] = {};

    directions.forEach(dir => {
      this.cache[name][dir] = [];
      frames.forEach(frame => {
        const sprite = this.createPixelCanvas(24, 32, (ctx) => {
          this.renderCharacterFrame(ctx, palette, dir, frame, isCan);
        });
        this.cache[name][dir].push(sprite);
      });
    });

    this.cache[name]['sitting'] = this.createPixelCanvas(24, 32, (ctx) => {
      this.renderCharacterSitting(ctx, palette, isCan);
    });
  },

  renderCharacterFrame(ctx, p, dir, frame, isCan) {
    const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
    const headX = 4;
    const headY = 4;

    const legOffset = frame === 1 ? -1 : (frame === 2 ? 1 : 0);
    const legLeftY = 22 + (frame === 1 ? -1 : 0);
    const legRightY = 22 + (frame === 2 ? -1 : 0);

    // Ayakkabı & Bacak Gölgelendirmesi
    if (dir === 'left' || dir === 'right') {
      px(9, 22, p.pantsShadow, 5, 5);
      px(10, 22, p.pants, 4, 5);
      px(8 + legOffset, 27, p.shoes, 6, 3);
      px(9 + legOffset, 27, p.shoeHighlight, 4, 1);
    } else {
      // Sol bacak
      px(7, legLeftY, p.pantsShadow, 4, 5);
      px(7, legLeftY, p.pants, 3, 5);
      px(7, legLeftY + 5, p.shoes, 4, 3);
      px(7, legLeftY + 5, p.shoeHighlight, 3, 1);

      // Sağ bacak
      px(13, legRightY, p.pantsShadow, 4, 5);
      px(14, legRightY, p.pants, 3, 5);
      px(13, legRightY + 5, p.shoes, 4, 3);
      px(13, legRightY + 5, p.shoeHighlight, 3, 1);
    }

    // Gövde (Detaylı Triko Kazak & Katlanma Çizgileri)
    px(6, 14, p.shirtShadow, 12, 8);
    px(7, 14, p.shirt, 10, 7);
    px(8, 15, p.shirtLight, 8, 2);

    if (dir === 'down') {
      // Yaka detayı
      px(10, 14, p.collar, 4, 3);
      px(11, 15, p.skin, 2, 2);
    }

    // Kollar & Eller (Yürüme Salınımı)
    if (dir === 'down' || dir === 'up') {
      const armOffset = (frame === 1 ? 1 : (frame === 2 ? -1 : 0));
      // Sol kol
      px(4, 15 + armOffset, p.shirtShadow, 3, 6);
      px(4, 15 + armOffset, p.shirt, 2, 5);
      px(4, 21 + armOffset, p.skin, 2, 2);
      // Sağ kol
      px(17, 15 - armOffset, p.shirtShadow, 3, 6);
      px(18, 15 - armOffset, p.shirt, 2, 5);
      px(18, 21 - armOffset, p.skin, 2, 2);
    }

    // Kafa & Yüz
    px(headX + 2, headY + 2, p.skinShadow, 12, 10);
    px(headX + 3, headY + 2, p.skin, 10, 9);

    if (dir === 'down') {
      // Kaşlar (Eyebrows)
      px(headX + 4, headY + 4, p.hair, 3, 1);
      px(headX + 9, headY + 4, p.hair, 3, 1);

      // Parlayan büyük sevimli gözler
      px(headX + 4, headY + 6, p.eyes, 3, 2);
      px(headX + 4, headY + 6, '#ffffff', 1, 1); // Göz ışıltısı
      px(headX + 9, headY + 6, p.eyes, 3, 2);
      px(headX + 9, headY + 6, '#ffffff', 1, 1);

      // Sevimli yanak allıkları (Good Coffee & Anime stili)
      px(headX + 3, headY + 8, p.skinBlush, 2, 1);
      px(headX + 11, headY + 8, p.skinBlush, 2, 1);

      // Gülümseme & Dudak
      px(headX + 7, headY + 9, '#8c3d31', 2, 1);
    } else if (dir === 'left') {
      px(headX + 3, headY + 4, p.hair, 3, 1);
      px(headX + 3, headY + 6, p.eyes, 3, 2);
      px(headX + 3, headY + 6, '#ffffff', 1, 1);
      px(headX + 2, headY + 8, p.skinBlush, 2, 1);
      px(headX + 2, headY + 9, '#8c3d31', 2, 1);
    } else if (dir === 'right') {
      px(headX + 10, headY + 4, p.hair, 3, 1);
      px(headX + 10, headY + 6, p.eyes, 3, 2);
      px(headX + 11, headY + 6, '#ffffff', 1, 1);
      px(headX + 12, headY + 8, p.skinBlush, 2, 1);
      px(headX + 12, headY + 9, '#8c3d31', 2, 1);
    }

    // Saçlar (Hacimli, ışık kırılmalı katmanlar)
    if (isCan) {
      px(headX + 1, headY, p.hair, 14, 4);
      px(headX + 2, headY, p.hairMid, 12, 3);
      px(headX + 4, headY + 1, p.hairHighlight, 7, 2);
      px(headX, headY + 3, p.hair, 3, 5);
      px(headX + 13, headY + 3, p.hair, 3, 5);
      if (dir === 'down') {
        px(headX + 3, headY + 3, p.hairMid, 4, 2);
        px(headX + 9, headY + 3, p.hairMid, 4, 2);
      } else if (dir === 'up') {
        px(headX + 2, headY + 2, p.hair, 12, 9);
        px(headX + 3, headY + 3, p.hairMid, 10, 7);
      }
    } else {
      // Sezen: Dökümlü dalgalı mavi-siyah saçlar + Safir ışıltılar + Toka
      px(headX + 1, headY - 1, p.hair, 14, 5);
      px(headX + 2, headY, p.hairMid, 12, 4);
      px(headX + 4, headY, p.hairHighlight, 8, 2);
      px(headX - 1, headY + 3, p.hair, 4, 13);
      px(headX + 13, headY + 3, p.hair, 4, 13);
      // Mavi-siyah saç tutamları
      px(headX, headY + 5, p.hairMid, 2, 8);
      px(headX + 14, headY + 5, p.hairMid, 2, 8);
      px(headX + 5, headY - 1, p.hairHighlight, 4, 1);

      if (dir === 'down') {
        px(headX + 3, headY + 3, p.hairMid, 3, 2);
        px(headX + 10, headY + 3, p.hairMid, 3, 2);
        // Kırmızı/Mercan kurdele toka
        px(headX + 12, headY + 2, p.ribbon, 3, 3);
        px(headX + 13, headY + 3, '#ffffff', 1, 1);
      } else if (dir === 'up') {
        px(headX + 1, headY + 1, p.hair, 14, 16);
        px(headX + 2, headY + 2, p.hairMid, 12, 14);
        px(headX + 4, headY + 4, p.hairHighlight, 8, 4);
      }
    }
  },

  renderCharacterSitting(ctx, p, isCan) {
    const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
    const headX = 4;
    const headY = 4;

    // Sandalye arkalığı
    px(5, 12, '#502910', 14, 12);
    px(6, 13, '#753f19', 12, 10);

    // Oturan Gövde
    px(7, 14, p.shirtShadow, 10, 8);
    px(8, 14, p.shirt, 8, 7);
    px(9, 15, p.shirtLight, 6, 2);

    // Masaya yaslanmış kollar & eller
    px(5, 19, p.shirt, 3, 3);
    px(7, 21, p.skin, 3, 2);
    px(16, 19, p.shirt, 3, 3);
    px(14, 21, p.skin, 3, 2);

    // Kafa
    px(headX + 2, headY + 2, p.skinShadow, 12, 10);
    px(headX + 3, headY + 2, p.skin, 10, 9);

    // Kaşlar & Odaklanmış tatlı gözler
    px(headX + 4, headY + 5, p.hair, 3, 1);
    px(headX + 9, headY + 5, p.hair, 3, 1);
    px(headX + 4, headY + 7, p.eyes, 3, 2);
    px(headX + 4, headY + 7, '#ffffff', 1, 1);
    px(headX + 9, headY + 7, p.eyes, 3, 2);
    px(headX + 9, headY + 7, '#ffffff', 1, 1);
    px(headX + 3, headY + 8, p.skinBlush, 2, 1);
    px(headX + 11, headY + 8, p.skinBlush, 2, 1);
    px(headX + 7, headY + 9, '#8c3d31', 2, 1);

    if (isCan) {
      px(headX + 1, headY, p.hair, 14, 4);
      px(headX + 2, headY, p.hairMid, 12, 3);
      px(headX + 4, headY + 1, p.hairHighlight, 7, 2);
      px(headX, headY + 3, p.hair, 3, 5);
      px(headX + 13, headY + 3, p.hair, 3, 5);
    } else {
      px(headX + 1, headY - 1, p.hair, 14, 5);
      px(headX + 2, headY, p.hairMid, 12, 4);
      px(headX + 4, headY, p.hairHighlight, 8, 2);
      px(headX - 1, headY + 3, p.hair, 4, 14);
      px(headX + 13, headY + 3, p.hair, 4, 14);
      px(headX, headY + 5, p.hairMid, 2, 8);
      px(headX + 14, headY + 5, p.hairMid, 2, 8);
      px(headX + 12, headY + 2, p.ribbon, 3, 3);
      px(headX + 13, headY + 3, '#ffffff', 1, 1);
    }
  },

  // ========================================================
  // 2. Bahçe Çardakları (Gazebos / Pergolas)
  // Masaların üzerinde çardak, sarmaşık güller ve fenerler
  // ========================================================
  createGazeboSprites() {
    // Çardak Genişlik: 96px, Yükseklik: 84px
    this.cache['garden_gazebo'] = this.createPixelCanvas(96, 84, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);

      // 1. Taş/Ahşap Çardak Taban Platformu (Deck)
      px(4, 38, '#61402b', 88, 44);
      px(6, 40, '#82583c', 84, 40);
      for (let y = 44; y < 80; y += 8) {
        px(6, y, '#543622', 84, 1); // Ahşap tahta çizgileri
      }

      // 2. Dört Ahşap Taşıyıcı Dikme (Corner Pillars)
      // Sol ön & arka dikmeler
      px(6, 12, '#3b2010', 6, 68);
      px(7, 12, '#5e381d', 4, 68);
      px(9, 12, '#82502d', 2, 68);

      // Sağ ön & arka dikmeler
      px(84, 12, '#3b2010', 6, 68);
      px(85, 12, '#5e381d', 4, 68);
      px(87, 12, '#82502d', 2, 68);

      // 3. Yan Ahşap Korkuluklar (Lattice Wooden Railings)
      // Sol korkuluk
      px(12, 54, '#42240e', 14, 20);
      px(14, 56, '#6e401f', 10, 16);
      px(18, 54, '#3b2010', 2, 20);
      // Sağ korkuluk
      px(70, 54, '#42240e', 14, 20);
      px(72, 56, '#6e401f', 10, 16);
      px(76, 54, '#3b2010', 2, 20);

      // 4. Çardak Saçak ve Çatı Kirişleri (Pergola Roof Canopy)
      // Üst ana kiriş
      px(2, 10, '#381c0c', 92, 6);
      px(4, 11, '#663b1d', 88, 4);

      // Eğimli Kiremit/Ahşap Çatı Şapkası
      px(6, 4, '#542611', 84, 8);
      px(12, 0, '#783819', 72, 6);
      px(16, 1, '#964821', 64, 4);
      px(24, 0, '#b85c2c', 48, 2);

      // Saçak Uçları (Dekoratif oymalar)
      for (let x = 6; x < 90; x += 8) {
        px(x, 14, '#381c0c', 4, 4);
        px(x + 1, 15, '#783819', 2, 2);
      }

      // 5. Sarmaşık ve Güller (Sütunlara sarılmış çiçekler)
      // Sol sütun sarmaşığı
      px(4, 24, '#2d5e2a', 5, 8);
      px(7, 34, '#3d7a38', 5, 10);
      px(5, 48, '#2d5e2a', 6, 8);
      // Minik pembe güller
      px(8, 26, '#ff8fa3', 3, 3);
      px(9, 27, '#fff', 1, 1);
      px(5, 38, '#ff758f', 3, 3);
      px(7, 50, '#ff8fa3', 3, 3);

      // Sağ sütun sarmaşığı
      px(86, 20, '#2d5e2a', 5, 10);
      px(84, 36, '#3d7a38', 6, 8);
      px(85, 46, '#2d5e2a', 5, 10);
      px(87, 22, '#ff8fa3', 3, 3);
      px(88, 23, '#fff', 1, 1);
      px(84, 40, '#ff758f', 3, 3);
      px(86, 52, '#ff8fa3', 3, 3);

      // 6. Ortada Asılı Sıcak Peri Feneri (Lantern)
      px(46, 16, '#26170d', 4, 10); // Askı zinciri
      px(44, 24, '#241a12', 8, 10);
      px(45, 25, '#ffeaa7', 6, 8); // Sıcak lamba ışığı
      px(47, 27, '#ffffff', 2, 4);
    });
  },

  // ========================================================
  // 3. Masalar (Sınıf, Çardak İçi Piknik, Good Coffee Kafe)
  // ========================================================
  createFurnitureSprites() {
    // 1. Sınıf / Kütüphane Masası (Kitaplar, Defter, Kalemlik)
    this.cache['table_classroom'] = this.createPixelCanvas(64, 40, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);

      // Masa Üst Tabla & Ahşap Kenar
      px(2, 10, '#42240b', 60, 20);
      px(4, 12, '#7a451e', 56, 16);
      px(6, 13, '#9c5a2b', 52, 13);
      px(4, 28, '#2b1505', 56, 4);

      // Masa Ayakları
      px(6, 30, '#2b1505', 4, 10);
      px(54, 30, '#2b1505', 4, 10);

      // Açık Kitap (Sol taraf)
      px(10, 14, '#2c3e50', 16, 10); // Kapak
      px(11, 15, '#f5eedb', 14, 8);  // Sayfalar
      px(17, 15, '#b09f80', 2, 8);   // Cilt omurgası
      px(13, 17, '#594939', 3, 1);   // Yazı çizgileri
      px(20, 17, '#594939', 3, 1);

      // Kalemlik & Renkli Kalemler (Sağ köşe)
      px(48, 12, '#384d59', 7, 9);
      px(50, 7, '#d94b4b', 2, 6);   // Kırmızı kalem
      px(53, 9, '#4b8ad9', 2, 4);   // Mavi kalem

      // Sıcak Kupa (Ortada)
      px(32, 16, '#e07a5f', 6, 6);
      px(33, 17, '#422216', 4, 4);   // Kahve yüzeyi
    });

    // 2. Bahçe Çardak Masası (Ahşap piknik masası + Çiçek Vazosu)
    this.cache['table_garden'] = this.createPixelCanvas(64, 40, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);

      // Masif Ahşap Masa
      px(4, 12, '#3d2010', 56, 18);
      px(6, 14, '#693c1f', 52, 14);
      px(8, 15, '#854f2c', 48, 11);
      px(6, 28, '#261307', 52, 4);

      // Çapraz banklar / ayaklar
      px(4, 32, '#522b13', 56, 6);
      px(8, 32, '#381c0c', 4, 8);
      px(52, 32, '#381c0c', 4, 8);

      // Masanın Diğer Tarafında Çiçek Vazosu (Karakterin kafasını kapatmaz)
      px(46, 20, '#d4eaf7', 8, 7);
      px(47, 21, '#ffffff', 2, 2);
      px(48, 16, '#3d7a38', 4, 4);    // Saplar
      px(46, 14, '#ff8fa3', 4, 3);    // Pembe papatya
      px(51, 14, '#ffd166', 3, 3);    // Sarı çiçek
    });

    // 3. Good Coffee Kafe Masası (Ekose Örtü, Latte Sanatı & Mum)
    this.cache['table_cafe'] = this.createPixelCanvas(64, 40, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);

      // Kırmızı-Beyaz Ekose Masa Örtüsü (Cafe Bistro)
      px(8, 10, '#8c2424', 48, 20);
      for (let x = 10; x < 54; x += 8) {
        for (let y = 12; y < 28; y += 8) {
          px(x, y, '#fdfbf7', 4, 4);
          px(x + 4, y + 4, '#fdfbf7', 4, 4);
        }
      }
      px(8, 28, '#591616', 48, 3);

      // Masa Tek Sütun Ayak
      px(28, 30, '#1c1918', 8, 8);
      px(22, 37, '#1c1918', 20, 3);

      // 2 Adet Kahve Kupası (Latte Art)
      // Sol kupa
      px(14, 14, '#ffffff', 7, 7);
      px(15, 15, '#6f4e37', 5, 5);
      px(16, 16, '#ffffff', 3, 2); // Minik kalp latte deseni
      // Sağ kupa
      px(42, 14, '#ffffff', 7, 7);
      px(43, 15, '#6f4e37', 5, 5);
      px(44, 16, '#ffffff', 3, 2);

      // Ortada Minik Bistro Şamdanı
      px(30, 14, '#d4af37', 4, 4);
      px(31, 10, '#ffeedb', 2, 5);
      px(31, 8, '#f39c12', 2, 2); // Alev
    });

    // 4. ÇİFT MASASI - Sınıf / Kütüphane (96x44 Geniş Paylaşımlı Masa)
    this.cache['table_classroom_couple'] = this.createPixelCanvas(96, 44, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Maun Masa Tablası
      px(2, 10, '#3a1f0a', 92, 20);
      px(4, 12, '#6e3c18', 88, 16);
      px(6, 13, '#8a4d22', 84, 13);
      px(4, 28, '#241204', 88, 4);

      // Ayaklar
      px(6, 30, '#241204', 5, 12);
      px(46, 30, '#241204', 4, 12);
      px(85, 30, '#241204', 5, 12);

      // Can'ın Tarafı (Sol): Laptop & Kod Ekranı
      px(10, 12, '#2b2d42', 18, 11); // Laptop tabanı
      px(11, 13, '#1c1d29', 16, 9);
      px(13, 7, '#3a3d5c', 14, 7);   // Ekran arkası
      px(14, 8, '#5dade2', 12, 5);   // Mavi parlayan ekran
      px(15, 9, '#ffffff', 4, 1);    // Kod satırı
      px(15, 11, '#2ecc71', 6, 1);
      // Yeşil Çalışma Defteri
      px(30, 15, '#2e6b3f', 11, 8);
      px(31, 16, '#fbfaf5', 9, 6);

      // Sezen'in Tarafı (Sağ): Sevimli Günlük & Pastel Kupa
      px(68, 14, '#7d53b8', 16, 10); // Ajanda kapağı
      px(70, 15, '#fefbf3', 12, 8);  // Sayfalar
      px(75, 12, '#e76f51', 2, 12);  // Mercan kurdele ayracı
      // Kalp Stickerı
      px(64, 17, '#ff758f', 3, 3);
      // Şeftali Pastel Kahve Kupası
      px(56, 15, '#f4a261', 6, 6);
      px(57, 16, '#3a1e0c', 4, 4);

      // Ortada: Vintage Yeşil Camlı Kütüphane Lambası
      px(45, 9, '#b8860b', 6, 11);
      px(43, 7, '#1b4332', 10, 4);   // Zümrüt yeşili abajur
      px(44, 11, '#ffefa0', 8, 2);   // Sıcak ışık
    });

    // 5. ÇİFT MASASI - Bahçe Çardağı (96x44 Masif Piknik Masası)
    this.cache['table_garden_couple'] = this.createPixelCanvas(96, 44, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Masif Ahşap Tabla
      px(2, 10, '#381e0e', 92, 20);
      px(4, 12, '#61381b', 88, 16);
      px(6, 13, '#784623', 84, 13);
      px(4, 28, '#211006', 88, 4);

      // Ayaklar ve Banklar
      px(6, 30, '#211006', 6, 12);
      px(84, 30, '#211006', 6, 12);
      px(4, 34, '#4a2811', 88, 6);

      // Ortada Piknik Sepeti & Çiçek Aranjmanı (Can ve Sezen'in tam ortasında, x: 40-56)
      px(40, 14, '#8c532b', 16, 9);
      px(42, 12, '#c0392b', 12, 3);   // Kırmızı ekose örtü ucu

      // Ortada Minik Çiçek Vazosu (Sepetin yanında x: 44-52, kafaları ASLA kapatmaz)
      px(44, 18, '#eaecee', 8, 6);
      px(45, 19, '#ffffff', 2, 2);
      px(46, 15, '#2ecc71', 4, 3);   // Saplar
      px(43, 13, '#ffd166', 3, 3);   // Papatya
      px(49, 13, '#9b5de5', 3, 3);   // Lavanta

      // Sol (Can'ın Önü): Taze Naneli Soğuk Limonata Bardağı
      px(16, 19, '#d4f1f4', 7, 8);
      px(17, 20, '#f9e79f', 5, 6);   // Sarı limonata
      px(18, 21, '#27ae60', 2, 2);   // Nane yaprağı

      // Sağ (Sezen'in Önü): Minik Çilekli Tart & Fincan (Masa üzerinde alçak, asla kapatmaz)
      px(72, 22, '#ffffff', 8, 3);   // Minik tabak
      px(74, 20, '#e76f51', 4, 3);   // Çilek
      px(73, 21, '#f4a261', 6, 2);   // Tart hamuru
    });

    // 6. ÇİFT MASASI - Kafe Romantik Locası (96x44 Bistro Ekose Örtü & Kruvasanlar)
    this.cache['table_cafe_couple'] = this.createPixelCanvas(96, 44, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Kırmızı-Beyaz Fransız Ekose Masa Örtüsü
      px(4, 10, '#8c2424', 88, 20);
      for (let x = 6; x < 90; x += 8) {
        for (let y = 12; y < 28; y += 8) {
          px(x, y, '#fdfbf7', 4, 4);
          px(x + 4, y + 4, '#fdfbf7', 4, 4);
        }
      }
      px(4, 28, '#591616', 88, 4);

      // Ayaklar
      px(20, 32, '#181615', 6, 10);
      px(70, 32, '#181615', 6, 10);

      // 2 Adet Kalp Latte Art'lı Kahve
      // Can'ın fincanı
      px(18, 14, '#ffffff', 8, 8);
      px(19, 15, '#6f4e37', 6, 6);
      px(20, 16, '#ffffff', 4, 2); // Latte kalp
      // Sezen'in lavanta fincanı
      px(70, 14, '#e8d7f1', 8, 8);
      px(71, 15, '#6f4e37', 6, 6);
      px(72, 16, '#ffffff', 4, 2);

      // Ortada: Tabakta 2 Taze Altın Kruvasan
      px(40, 14, '#f4f6f7', 16, 7); // Tabak
      px(42, 13, '#d4ac0d', 6, 4);  // Kruvasan 1
      px(49, 13, '#b7950b', 6, 4);  // Kruvasan 2

      // Sıcak Cam Şamdan
      px(46, 8, '#f39c12', 4, 5);
      px(47, 6, '#e67e22', 2, 2);
    });

    // 7. GENİŞ BAHÇE ÇARDAĞI (Çift Masası İçin 128x96 Pergola)
    this.cache['garden_gazebo_couple'] = this.createPixelCanvas(128, 96, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Ahşap Zemin Güverte (Deck)
      px(4, 42, '#5e381d', 120, 48);
      px(6, 44, '#7a4a27', 116, 44);
      for (let y = 48; y < 88; y += 8) {
        px(6, y, '#4d2b14', 116, 1);
      }

      // 4 Taşıyıcı Kalın Ahşap Sütun
      px(6, 12, '#381c0c', 7, 76);
      px(8, 12, '#5e381d', 4, 76);
      px(115, 12, '#381c0c', 7, 76);
      px(117, 12, '#5e381d', 4, 76);

      // Korkuluklar
      px(14, 60, '#381c0c', 16, 20);
      px(98, 60, '#381c0c', 16, 20);

      // Çatı Kirişleri ve Saçaklar
      px(2, 10, '#381c0c', 124, 6);
      px(4, 11, '#663b1d', 120, 4);
      px(8, 4, '#542611', 112, 8);
      px(16, 0, '#783819', 96, 6);
      px(24, 1, '#964821', 80, 4);

      // Sarmaşık Güller (Sol & Sağ)
      px(5, 22, '#2d5e2a', 6, 14);
      px(8, 25, '#ff8fa3', 4, 4);
      px(116, 22, '#2d5e2a', 6, 14);
      px(117, 26, '#ff8fa3', 4, 4);

      // İki Adet Asılı Sıcak Peri Feneri
      // Sol Fener
      px(40, 16, '#241a12', 3, 8);
      px(38, 23, '#ffeaa7', 7, 8);
      px(40, 25, '#ffffff', 3, 4);
      // Sağ Fener
      px(88, 16, '#241a12', 3, 8);
      px(86, 23, '#ffeaa7', 7, 8);
      px(88, 25, '#ffffff', 3, 4);
    });
  },

  // ========================================================
  // 4. Kedi Pamuk 🐾 (Uykulu, Nefes Alan & Mırıldayan Tekir)
  // ========================================================
  createCatSprites() {
    // 1. Kıvrılıp Uyuyan Pamuk
    this.cache['cat_sleeping'] = this.createPixelCanvas(24, 18, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Pofuduk Gövde
      px(4, 5, '#b85a21', 16, 10);
      px(5, 6, '#e07a38', 14, 8);
      px(7, 7, '#f49d5c', 10, 6);
      // Beyaz göğüs ve pati lekesi
      px(9, 10, '#ffffff', 6, 4);
      // Kulaklar
      px(3, 4, '#8c3a0d', 3, 3);
      px(7, 4, '#8c3a0d', 3, 3);
      // Kıvrık Kuyruk
      px(19, 8, '#b85a21', 3, 6);
      px(17, 13, '#e07a38', 5, 2);
      // Kapalı huzurlu göz çizgisi
      px(5, 8, '#3d1b06', 2, 1);
      // Zzz rüya balonu
      px(19, 2, '#74c0fc', 3, 2);
    });

    // 2. Mırıldayan / Sevgi Dolu Pamuk (^..^)
    this.cache['cat_purring'] = this.createPixelCanvas(24, 18, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      px(4, 5, '#b85a21', 16, 11);
      px(5, 6, '#e07a38', 14, 9);
      px(7, 7, '#f49d5c', 10, 7);
      px(9, 11, '#ffffff', 6, 4);

      // Dik kulaklar
      px(4, 1, '#8c3a0d', 4, 4);
      px(10, 1, '#8c3a0d', 4, 4);
      // Mutlu kapalı gülen gözler
      px(5, 6, '#3d1b06', 3, 2);
      px(10, 6, '#3d1b06', 3, 2);
      // Minik pembe burun
      px(8, 8, '#f7a8a8', 2, 1);

      // Kalp emotesi
      px(17, 0, '#e85d75', 4, 3);
      px(18, 1, '#fff', 1, 1);
    });

    // 3. Oturan / Uyanık Pamuk (Dik oturuş, açık gözler)
    this.cache['cat_sitting'] = this.createPixelCanvas(24, 20, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
      // Gövde
      px(6, 8, '#b85a21', 12, 11);
      px(7, 9, '#e07a38', 10, 9);
      px(9, 11, '#ffffff', 6, 7); // Beyaz göğüs ve ön patiler

      // Kafa
      px(6, 3, '#b85a21', 12, 7);
      px(7, 4, '#e07a38', 10, 5);

      // Dik Kulaklar
      px(6, 0, '#8c3a0d', 3, 4);
      px(15, 0, '#8c3a0d', 3, 4);
      px(7, 1, '#ffc9c9', 1, 2);
      px(16, 1, '#ffc9c9', 1, 2);

      // Açık Meraklı Gözler
      px(8, 5, '#2e7d32', 2, 2); // Yeşil zümrüt göz
      px(14, 5, '#2e7d32', 2, 2);
      px(8, 5, '#ffffff', 1, 1);
      px(14, 5, '#ffffff', 1, 1);

      // Burun ve bıyıklar
      px(11, 7, '#f7a8a8', 2, 1);

      // Kıvrık Kuyruk
      px(17, 12, '#b85a21', 4, 5);
      px(18, 10, '#e07a38', 3, 3);
    });
  },

  // ========================================================
  // 5. Sarılma (Hug) Sprite'ı
  // ========================================================
  createHugSprite() {
    this.cache['hug'] = this.createPixelCanvas(38, 34, (ctx) => {
      const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);

      // Bacaklar
      px(8, 23, '#2d3e54', 4, 6);
      px(22, 23, '#c9a885', 4, 6);
      px(7, 28, '#382519', 5, 3);
      px(23, 28, '#523420', 5, 3);

      // Gövdeler Birleşik (Can solda, Sezen sağda)
      px(6, 14, '#2e6b3f', 12, 10);
      px(17, 14, '#7d53b8', 12, 10);

      // Sarılan Sıcak Kollar
      px(10, 16, '#c28253', 15, 4);
      px(12, 18, '#fff0e6', 13, 4);

      // Kafalar Yana Yaslanmış
      px(4, 5, '#c28253', 11, 10);
      px(19, 5, '#fff0e6', 11, 10);

      // Saçlar
      px(3, 3, '#24150b', 12, 5); // Can espresso saç
      px(18, 2, '#0c121d', 14, 6); // Sezen mavi-siyah saç
      px(22, 2, '#366aa3', 5, 2);  // Sezen mavi ışıltı
      px(30, 4, '#e76f51', 3, 3); // Toka

      // Mutlu Gülen Gözler & Pembe Yanaklar
      px(6, 9, '#1a0e07', 3, 1);
      px(23, 9, '#121f33', 3, 1);
      px(5, 10, '#b86657', 3, 2);
      px(25, 10, '#ff94a2', 3, 2);
    });
  },

  // ========================================================
  // 6. Açılabilir Dekorlar
  // ========================================================
  createDecorSprites() {
    // 1. Monstera Saksı Çiçeği 🌿
    this.cache['plant_monstera'] = this.createPixelCanvas(24, 32, (ctx) => {
      // Pişmiş Toprak Saksı
      this.px(ctx, 5, 20, '#b85c38', 14, 10);
      this.px(ctx, 4, 19, '#8c3d1f', 16, 2);
      // Monstera Yaprakları
      this.px(ctx, 6, 8, '#266332', 10, 11);
      this.px(ctx, 2, 10, '#368545', 7, 7);
      this.px(ctx, 13, 6, '#49a35b', 8, 8);
      this.px(ctx, 9, 3, '#62bf76', 6, 5);
    });

    // 2. Sıcak Masa Lambası 💡
    this.cache['vintage_lamp'] = this.createPixelCanvas(20, 28, (ctx) => {
      this.px(ctx, 7, 20, '#b8860b', 6, 4);
      this.px(ctx, 9, 10, '#d4af37', 2, 10);
      this.px(ctx, 4, 6, '#2d5a27', 12, 6); // Zümrüt banker şapkası
      this.px(ctx, 6, 12, '#ffeaa7', 8, 4); // Sıcak ışık
    });

    // 3. Kalp Kilim 🌸
    this.cache['heart_rug'] = this.createPixelCanvas(42, 28, (ctx) => {
      this.px(ctx, 6, 4, '#e56b6f', 12, 12);
      this.px(ctx, 24, 4, '#e56b6f', 12, 12);
      this.px(ctx, 4, 8, '#e56b6f', 34, 12);
      this.px(ctx, 10, 20, '#e56b6f', 22, 5);
      this.px(ctx, 16, 25, '#e56b6f', 10, 3);
      // İç dikiş deseni
      this.px(ctx, 14, 10, '#fff0f3', 14, 8);
    });

    // 4. Kedi Yatağı / Minderi 🐱
    this.cache['cat_cushion'] = this.createPixelCanvas(28, 20, (ctx) => {
      this.px(ctx, 2, 4, '#83c5be', 24, 12);
      this.px(ctx, 4, 2, '#a8dadc', 20, 14);
      this.px(ctx, 8, 6, '#ffffff', 12, 6);
    });

    // 5. Yıldızlı Peri Feneri 🏮
    this.cache['star_lantern'] = this.createPixelCanvas(20, 28, (ctx) => {
      this.px(ctx, 9, 0, '#4a4a4a', 2, 8);
      this.px(ctx, 5, 8, '#262626', 10, 14);
      this.px(ctx, 6, 9, '#ffd166', 8, 12);
      this.px(ctx, 8, 12, '#ffffff', 4, 5);
    });
  },

  // ========================================================
  // 7. Canlı NPC Karakterleri (Lively Ambient NPCs)
  // Stardew & Good Coffee Tarzı Aktif Karakterler
  // ========================================================
  createNPCSprites() {
    const px = (ctx, x, y, c, w = 1, h = 1) => this.px(ctx, x, y, c, w, h);

    // 1. Prof. Hikmet (Sınıf Kürsüsünde Ders Anlatan / Not İnceleyen Hoca)
    this.cache['npc_teacher'] = this.createPixelCanvas(26, 34, (ctx) => {
      // Bacaklar & Ayakkabı
      px(ctx, 8, 24, '#2b2d42', 4, 6);
      px(ctx, 14, 24, '#2b2d42', 4, 6);
      px(ctx, 7, 29, '#1a1a1a', 5, 3);
      px(ctx, 14, 29, '#1a1a1a', 5, 3);
      // Tüvit Ceket & Kravat
      px(ctx, 6, 14, '#4a3319', 14, 11);
      px(ctx, 7, 15, '#6a4a27', 12, 9);
      px(ctx, 11, 14, '#ffffff', 4, 4); // Gömlek yakası
      px(ctx, 12, 16, '#9e2a2b', 2, 6); // Bordo kravat
      // Kafa & Yüz
      px(ctx, 7, 5, '#e0b284', 12, 9);
      px(ctx, 8, 5, '#ffd4a3', 10, 8);
      // Gözlük & Bilge Gözler
      px(ctx, 9, 8, '#333333', 3, 2);
      px(ctx, 14, 8, '#333333', 3, 2);
      px(ctx, 10, 8, '#ffffff', 1, 1);
      px(ctx, 15, 8, '#ffffff', 1, 1);
      px(ctx, 12, 8, '#d4af37', 2, 1); // Altın köprü
      // Beyaz/Gri Bıyık & Saç
      px(ctx, 11, 11, '#e5e5e5', 4, 2);
      px(ctx, 6, 3, '#d3d3d3', 14, 4);
      px(ctx, 5, 5, '#bfbfbf', 3, 6);
      px(ctx, 18, 5, '#bfbfbf', 3, 6);
      // Elinde Mavi Kitap
      px(ctx, 17, 18, '#1d3557', 6, 8);
      px(ctx, 18, 19, '#f1faee', 4, 6);
    });

    // 2. Pelin (Sınıfta Kitap Okuyan Öğrenci - Oturan)
    this.cache['npc_student_reading'] = this.createPixelCanvas(24, 32, (ctx) => {
      // Sandalye
      px(ctx, 5, 12, '#502910', 14, 12);
      px(ctx, 6, 13, '#753f19', 12, 10);
      // Mercan Hoodie
      px(ctx, 7, 14, '#c85a3e', 10, 8);
      px(ctx, 8, 14, '#e76f51', 8, 7);
      px(ctx, 6, 18, '#e76f51', 3, 4);
      px(ctx, 15, 18, '#e76f51', 3, 4);
      // Kafa & Yüz
      px(ctx, 6, 5, '#ffd4a3', 12, 9);
      px(ctx, 8, 8, '#264653', 2, 2); // Yeşil gözler
      px(ctx, 8, 8, '#fff', 1, 1);
      px(ctx, 14, 8, '#264653', 2, 2);
      px(ctx, 14, 8, '#fff', 1, 1);
      px(ctx, 7, 10, '#f99f9f', 2, 1);
      px(ctx, 15, 10, '#f99f9f', 2, 1);
      // Kahverengi At Kuyruğu Saç
      px(ctx, 5, 3, '#54361e', 14, 4);
      px(ctx, 18, 6, '#54361e', 4, 8); // At kuyruğu
      px(ctx, 17, 5, '#e76f51', 2, 2); // Lastik toka
      // Önünde Açık Kitap & Kalem
      px(ctx, 7, 21, '#ffd4a3', 10, 2);
      px(ctx, 8, 20, '#2a9d8f', 8, 4);
      px(ctx, 9, 21, '#ffffff', 6, 2);
    });

    // 3. Mert (Sınıfta Kulaklıkla Kod Yazan Öğrenci)
    this.cache['npc_student_tech'] = this.createPixelCanvas(24, 32, (ctx) => {
      px(ctx, 5, 12, '#502910', 14, 12);
      px(ctx, 6, 13, '#753f19', 12, 10);
      // Lacivert Sweatshirt
      px(ctx, 7, 14, '#1d3557', 10, 8);
      px(ctx, 8, 14, '#27476e', 8, 7);
      // Kafa & Gözler
      px(ctx, 6, 5, '#ffd4a3', 12, 9);
      px(ctx, 8, 8, '#1e1109', 2, 2);
      px(ctx, 14, 8, '#1e1109', 2, 2);
      px(ctx, 6, 3, '#2b1e16', 12, 4);
      // Büyük Kırmızı Kulaklık
      px(ctx, 4, 6, '#e63946', 3, 6);
      px(ctx, 17, 6, '#e63946', 3, 6);
      px(ctx, 6, 2, '#333333', 12, 2); // Kafa bandı
    });

    // 4. Bahçıvan Salih Amca (Bahçede Çiçek Sulayan)
    this.cache['npc_gardener'] = this.createPixelCanvas(28, 36, (ctx) => {
      // Çizme & Tulum
      px(ctx, 9, 26, '#3a5a40', 4, 5);
      px(ctx, 15, 26, '#3a5a40', 4, 5);
      px(ctx, 8, 30, '#582f0e', 5, 4);
      px(ctx, 15, 30, '#582f0e', 5, 4);
      // Mavi Bahçıvan Tulumu & Ekose Gömlek
      px(ctx, 7, 16, '#a3b18a', 14, 10);
      px(ctx, 8, 17, '#588157', 12, 9);
      px(ctx, 9, 16, '#3a5a40', 2, 10); // Tulum askısı
      px(ctx, 17, 16, '#3a5a40', 2, 10);
      // Kafa & Yüz
      px(ctx, 8, 7, '#d4a373', 12, 9);
      px(ctx, 10, 10, '#333', 2, 2);
      px(ctx, 16, 10, '#333', 2, 2);
      px(ctx, 11, 13, '#fff', 6, 2); // Beyaz sakal
      // Hasır Bahçıvan Şapkası
      px(ctx, 4, 5, '#dda15e', 20, 3); // Siperlik
      px(ctx, 8, 1, '#bc6c25', 12, 5); // Şapka gövdesi
      px(ctx, 8, 4, '#606c38', 12, 1); // Yeşil şerit
      // Yeşil Sulama İbriği (Watering Can)
      px(ctx, 21, 20, '#2a9d8f', 6, 7);
      px(ctx, 25, 17, '#264653', 2, 4); // Kulp
      px(ctx, 27, 24, '#e76f51', 1, 1);
      // Minik su damlaları
      px(ctx, 26, 28, '#48cae4', 1, 2);
      px(ctx, 27, 31, '#48cae4', 1, 2);
    });

    // 5. Ressam Melis (Bahçede Şövalede Resim Yapan)
    this.cache['npc_artist'] = this.createPixelCanvas(34, 36, (ctx) => {
      // Şövale & Resim Tuvali (Sol Taraf)
      px(ctx, 2, 6, '#8d5b4c', 2, 28);  // Sol bacak
      px(ctx, 12, 6, '#8d5b4c', 2, 28); // Sağ bacak
      px(ctx, 7, 2, '#6f4538', 2, 32);  // Arka destek
      // Beyaz Tuval & Çizilen Resim
      px(ctx, 1, 8, '#ffffff', 14, 14);
      px(ctx, 1, 8, '#d4a373', 14, 1);  // Çerçeve
      px(ctx, 1, 21, '#d4a373', 14, 1);
      px(ctx, 3, 14, '#3a88b5', 10, 4); // Tuvaldeki fıskiye resmi
      px(ctx, 5, 10, '#ffb703', 3, 3);  // Güneş
      px(ctx, 6, 17, '#588157', 6, 3);  // Çimenler

      // Ressam Melis (Sağ Taraf)
      px(ctx, 18, 16, '#f4a261', 10, 10); // Sarı önlük
      px(ctx, 19, 18, '#e76f51', 2, 2);   // Boya lekesi
      px(ctx, 23, 20, '#2a9d8f', 2, 2);
      // Kafa & Kırmızı Ressam Beresi
      px(ctx, 18, 7, '#ffd4a3', 10, 8);
      px(ctx, 20, 10, '#264653', 2, 2);
      px(ctx, 19, 12, '#ff9aa2', 2, 1);
      px(ctx, 16, 4, '#d62828', 14, 4);  // Kırmızı bere
      px(ctx, 22, 2, '#ba181b', 2, 3);   // Bere ucu
      // Elinde İnce Fırça
      px(ctx, 14, 15, '#d4af37', 5, 1);
      px(ctx, 13, 15, '#e63946', 1, 1); // Fırça boya ucu
    });

    // 6. Ege (Ağaç Altında Çimende Dinlenen / Çizgi Roman Okuyan)
    this.cache['npc_student_relax'] = this.createPixelCanvas(26, 26, (ctx) => {
      // Çimen gölgesi
      px(ctx, 4, 18, '#3d6e2e', 18, 6);
      // Bağdaş kurmuş kot pantolon
      px(ctx, 5, 15, '#2b3a4a', 16, 7);
      // Yeşil Salaş Kazak
      px(ctx, 8, 9, '#2d6a4f', 10, 7);
      // Kafa & Yüz
      px(ctx, 8, 2, '#ffd4a3', 10, 7);
      px(ctx, 10, 5, '#1e1109', 2, 2);
      px(ctx, 7, 0, '#523420', 12, 3);
      // Çizgi Roman / Kitap
      px(ctx, 7, 12, '#ffb703', 12, 6);
      px(ctx, 8, 13, '#ffffff', 10, 4);
      px(ctx, 12, 13, '#333333', 1, 4);
    });

    // 7. Barista Deniz (Kafede Tezgah Arkasında Kahve Hazırlayan)
    this.cache['npc_barista'] = this.createPixelCanvas(26, 34, (ctx) => {
      // Ayaklar
      px(ctx, 8, 25, '#1b1b1b', 4, 6);
      px(ctx, 14, 25, '#1b1b1b', 4, 6);
      // Beyaz Gömlek & Kahverengi Barista Önlüğü
      px(ctx, 6, 14, '#f8f9fa', 14, 11);
      px(ctx, 7, 16, '#3e2723', 12, 10); // Deri/kumaş kahve önlüğü
      px(ctx, 9, 15, '#271714', 2, 8);   // Önlük askısı
      px(ctx, 15, 15, '#271714', 2, 8);
      px(ctx, 11, 20, '#d4af37', 4, 3);  // "BARISTA" pirinç yaka kartı
      // Kafa & Yüz
      px(ctx, 7, 5, '#ffe0bd', 12, 9);
      px(ctx, 9, 8, '#1e293b', 2, 2);    // Gülümseyen gözler
      px(ctx, 9, 8, '#ffffff', 1, 1);
      px(ctx, 15, 8, '#1e293b', 2, 2);
      px(ctx, 15, 8, '#ffffff', 1, 1);
      px(ctx, 11, 11, '#e76f51', 4, 1);  // Samimi gülümseme
      px(ctx, 8, 10, '#ffb4a2', 2, 1);
      px(ctx, 16, 10, '#ffb4a2', 2, 1);
      // Barista Şapkası & Kahverengi Kıvırcık Saç
      px(ctx, 5, 2, '#4e342e', 16, 4);
      px(ctx, 6, 0, '#271714', 14, 3);   // Şapka
      // Elinde Paslanmaz Çelik Süt Cezvesi (Milk Pitcher with Latte Art Foam)
      px(ctx, 18, 17, '#bdc3c7', 6, 7);
      px(ctx, 19, 16, '#ffffff', 4, 2);  // Süt köpüğü
    });

    // 8. Yazar Sinan (Kafede İlhamla Not Alan Yazar)
    this.cache['npc_writer'] = this.createPixelCanvas(24, 32, (ctx) => {
      px(ctx, 5, 12, '#502910', 14, 12);
      px(ctx, 6, 13, '#753f19', 12, 10);
      // Hardal Sarısı Vintage Triko Kazak
      px(ctx, 7, 14, '#b7871b', 10, 8);
      px(ctx, 8, 14, '#d4a324', 8, 7);
      // Kafa & Gözlük
      px(ctx, 6, 5, '#ffd4a3', 12, 9);
      px(ctx, 8, 8, '#333', 2, 2);
      px(ctx, 13, 8, '#333', 2, 2);
      px(ctx, 10, 8, '#c9a227', 3, 1); // Yuvarlak tel gözlük
      px(ctx, 5, 3, '#3d2616', 14, 3); // Dağınık saç
      // Masada Kahve & Defter
      px(ctx, 6, 20, '#582f0e', 12, 3);
    });

    // 9. Kitap Kurdu & Müziksever Aslı (Kafede Plak Dinleyen)
    this.cache['npc_music_fan'] = this.createPixelCanvas(24, 32, (ctx) => {
      px(ctx, 5, 12, '#502910', 14, 12);
      px(ctx, 6, 13, '#753f19', 12, 10);
      // Pastel Nane Yeşili Kazak
      px(ctx, 7, 14, '#529b93', 10, 8);
      px(ctx, 8, 14, '#83c5be', 8, 7);
      // Kafa & Gözler
      px(ctx, 6, 5, '#ffe0bd', 12, 9);
      px(ctx, 8, 8, '#264653', 2, 2);
      px(ctx, 8, 8, '#fff', 1, 1);
      px(ctx, 14, 8, '#264653', 2, 2);
      px(ctx, 14, 8, '#fff', 1, 1);
      px(ctx, 7, 10, '#ffb4a2', 2, 1);
      px(ctx, 15, 10, '#ffb4a2', 2, 1);
      // Büyük Mor Retro Kulaklık
      px(ctx, 4, 6, '#7209b7', 3, 6);
      px(ctx, 17, 6, '#7209b7', 3, 6);
      px(ctx, 6, 2, '#480ca8', 12, 2);
    });
  },

  // ========================================================
  // 9. Stardew Valley Tarzı Yakın Plan Piksel Portreleri (64x64)
  // Can (Sıcak Esmer Ten, Espresso Saç) & Sezen (Duru Beyaz Ten, Mavi-Siyah Saç, Mercan Toka)
  // ========================================================
  createPortraitSprites() {
    ['Can', 'Sezen'].forEach(name => {
      this.cache['portrait_' + name] = this.createPixelCanvas(64, 64, (ctx) => {
        this.renderStardewPortrait(ctx, name);
      });
    });
  },

  getPortraitDataUrl(name) {
    if (!name) return '';
    const canvas = this.cache['portrait_' + name];
    if (canvas && canvas.toDataURL) {
      return canvas.toDataURL();
    }
    return '';
  },

  renderStardewPortrait(ctx, name) {
    const px = (x, y, color, w = 1, h = 1) => this.px(ctx, x, y, color, w, h);
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

    // Arka Plan Parşömen / Sıcak Gradyan
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

      // 1. Omuzlar ve Kazak (y: 44-58)
      px(8, 48, p.shirtDark, 48, 11);
      px(10, 46, p.shirtDark, 44, 13);
      px(12, 45, p.shirt, 40, 14);
      px(16, 47, p.shirtLight, 32, 2);
      for (let x = 14; x <= 50; x += 4) {
        px(x, 48, p.shirtDark, 1, 11);
      }

      // 2. Beyaz Yaka
      px(24, 44, p.collar, 16, 7);
      px(26, 45, '#ffffff', 12, 5);
      px(30, 47, p.skinDark, 4, 4);
      px(31, 48, p.skin, 2, 3);

      // 3. Boyun
      px(26, 37, p.skinDark, 12, 9);
      px(28, 38, p.skin, 8, 8);
      px(28, 37, p.skinDark, 8, 2);

      // 4. Çene & Yüz Tabanı
      px(20, 16, p.skinDark, 24, 22);
      px(21, 16, p.skin, 22, 22);
      px(23, 38, p.skinDark, 18, 2);
      px(26, 40, p.skinDark, 12, 1);
      px(23, 17, p.skinLight, 18, 20);

      // 5. Yanak Allıkları & Gamze
      px(22, 29, p.blush, 5, 2);
      px(37, 29, p.blush, 5, 2);

      // 6. Burun
      px(31, 26, p.skinDark, 2, 5);
      px(33, 29, p.skinDark, 2, 2);
      px(30, 27, p.skinLight, 1, 4);

      // 7. Ağız & Gülümseme
      px(28, 34, '#8c3d31', 8, 2);
      px(30, 35, '#ffffff', 4, 1);
      px(27, 33, '#6e2b21', 1, 2);
      px(36, 33, '#6e2b21', 1, 2);

      // 8. Gözler
      px(22, 24, p.eyes, 6, 4);
      px(23, 25, '#ffffff', 2, 2);
      px(26, 26, '#3a1f10', 2, 2);
      px(36, 24, p.eyes, 6, 4);
      px(37, 25, '#ffffff', 2, 2);
      px(40, 26, '#3a1f10', 2, 2);

      // 9. Belirgin Kaşlar
      px(21, 21, p.hair, 8, 2);
      px(22, 20, p.hair, 6, 1);
      px(35, 21, p.hair, 8, 2);
      px(36, 20, p.hair, 6, 1);

      // 10. Saçlar (Hacimli espresso saç)
      px(16, 8, p.hair, 32, 9);
      px(18, 7, p.hair, 28, 4);
      px(20, 5, p.hair, 24, 3);
      px(22, 7, p.hairMid, 22, 5);
      px(24, 8, p.hairLight, 16, 3);
      px(16, 15, p.hair, 5, 14);
      px(17, 17, p.hairMid, 3, 10);
      px(43, 15, p.hair, 5, 14);
      px(44, 17, p.hairMid, 3, 10);
      px(21, 14, p.hair, 4, 5);
      px(25, 13, p.hairMid, 6, 4);
      px(34, 13, p.hair, 5, 5);
      px(39, 14, p.hairMid, 4, 4);

    } else {
      // SEZEN: DURU BEYAZ TEN, GECE MAVİSİ & SİYAH SAÇ, LAVANTA KAZAK & MERCAN TOKA
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

      // 1. Arka Uzun Saçlar
      px(13, 18, p.hair, 38, 38);
      px(12, 26, p.hairMid, 8, 28);
      px(44, 26, p.hairMid, 8, 28);

      // 2. Omuzlar ve Lavanta Kazak
      px(10, 48, p.shirtDark, 44, 11);
      px(12, 46, p.shirt, 40, 13);
      px(16, 47, p.shirtLight, 32, 2);
      for (let x = 16; x <= 48; x += 4) {
        px(x, 48, p.shirtDark, 1, 11);
      }

      // 3. Krem Yaka & Boyun
      px(25, 43, p.collar, 14, 5);
      px(27, 44, '#ffffff', 10, 3);
      px(26, 36, p.skinDark, 12, 9);
      px(28, 37, p.skin, 8, 8);
      px(28, 36, p.skinDark, 8, 2);

      // 4. Çene & Duru Porselen Yüz
      px(19, 16, p.skinDark, 26, 21);
      px(20, 16, p.skin, 24, 21);
      px(22, 37, p.skinDark, 20, 2);
      px(25, 39, p.skinDark, 14, 1);
      px(22, 17, p.skinLight, 20, 19);

      // 5. Sevimli Pembe Yanak Allıkları
      px(21, 28, p.blush, 6, 3);
      px(37, 28, p.blush, 6, 3);
      px(23, 29, '#ffffff', 2, 1);
      px(39, 29, '#ffffff', 2, 1);

      // 6. Zarif Minik Burun
      px(31, 27, p.skinDark, 2, 3);
      px(31, 27, p.skinLight, 1, 2);

      // 7. Tatlı Gülümseme
      px(28, 33, '#d0536c', 8, 2);
      px(29, 34, '#ffffff', 6, 1);

      // 8. İri, Canlı Safir & Lacivert Gözler
      px(22, 23, p.hair, 7, 5);
      px(23, 24, p.eyes, 5, 4);
      px(24, 25, p.eyeBlue, 3, 3);
      px(23, 24, '#ffffff', 2, 2);
      px(25, 26, '#ffffff', 1, 1);
      px(35, 23, p.hair, 7, 5);
      px(36, 24, p.eyes, 5, 4);
      px(37, 25, p.eyeBlue, 3, 3);
      px(36, 24, '#ffffff', 2, 2);
      px(38, 26, '#ffffff', 1, 1);

      // 9. Kirpikler ve Kavisli Kaşlar
      px(21, 22, p.hair, 8, 1);
      px(20, 23, p.hair, 2, 1);
      px(35, 22, p.hair, 8, 1);
      px(42, 23, p.hair, 2, 1);
      px(23, 19, p.hairMid, 6, 1);
      px(35, 19, p.hairMid, 6, 1);

      // 10. Saçlar (Gece mavisi parlak ışıltı)
      px(17, 8, p.hair, 30, 9);
      px(19, 6, p.hair, 26, 4);
      px(21, 5, p.hair, 22, 2);
      px(22, 7, p.hairMid, 20, 4);
      px(24, 8, p.hairLight, 16, 2);
      px(26, 9, p.hairSheen, 10, 1);
      px(15, 17, p.hair, 5, 26);
      px(16, 22, p.hairMid, 3, 20);
      px(17, 28, p.hairLight, 2, 12);
      px(44, 17, p.hair, 5, 26);
      px(45, 22, p.hairMid, 3, 20);
      px(46, 28, p.hairLight, 2, 12);
      px(23, 13, p.hair, 4, 6);
      px(27, 12, p.hairMid, 6, 4);
      px(33, 12, p.hair, 6, 5);

      // 11. Mercan Saç Tokası / Kurdele
      px(43, 12, p.ribbon, 6, 6);
      px(44, 13, '#f77f00', 4, 4);
      px(45, 14, '#ffffff', 2, 2);
      px(47, 17, p.ribbon, 3, 5);
    }
  }
};

