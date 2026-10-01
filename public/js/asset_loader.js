// ========================================================
// CozyStudy: Profesyonel Asset Yükleyici & Kompozitör
// (Liberated Pixel Cup & Kenney High-Res Integration)
// ========================================================

const AssetLoader = {
  isLoaded: false,
  tiles: {
    tiny_town: {},
    rpg_urban: {}
  },

  loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Asset not found or failed to load:', url);
        resolve(null);
      };
      img.src = url;
    });
  },

  tintLayer(img, hexColor) {
    if (!img) return null;
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);

    if (hexColor) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(img, 0, 0);
    }
    return c;
  },

  async init() {
    console.log('🌸 Profesyonel Kenney karo assetleri yükleniyor...');
    try {
      await this.preloadKeyTiles();
      this.isLoaded = true;
      console.log('✅ Tüm profesyonel karo assetleri başarıyla yüklendi!');
      if (typeof UI !== 'undefined' && UI.renderAvatarPreviews) {
        UI.renderAvatarPreviews();
      }
    } catch (err) {
      console.error('Asset yükleme hatası:', err);
    }
  },

  async buildCharacter(name) {
    const isCan = name === 'Can';
    const basePath = '/assets/characters/';

    // 1. Gerekli katmanları yükle
    const walkLayers = isCan ? [
      await this.loadImage(basePath + 'male_walk.png'),
      await this.loadImage(basePath + 'male_pants_walk.png'),
      await this.loadImage(basePath + 'male_shoes_walk.png'),
      await this.loadImage(basePath + 'male_shirt_walk.png'),
      await this.loadImage(basePath + 'male_hair_walk.png')
    ] : [
      await this.loadImage(basePath + 'female_walk.png'),
      await this.loadImage(basePath + 'female_pants_walk.png'),
      await this.loadImage(basePath + 'male_shoes_walk.png'),
      await this.loadImage(basePath + 'female_shirt_walk.png'),
      await this.loadImage(basePath + 'female_hair_walk.png')
    ];

    const sitLayers = isCan ? [
      await this.loadImage(basePath + 'male_sit.png'),
      await this.loadImage(basePath + 'male_pants_sit.png'),
      await this.loadImage(basePath + 'male_shoes_sit.png'),
      await this.loadImage(basePath + 'male_shirt_sit.png'),
      await this.loadImage(basePath + 'male_hair_sit.png')
    ] : [
      await this.loadImage(basePath + 'female_sit.png'),
      await this.loadImage(basePath + 'female_pants_sit.png'),
      await this.loadImage(basePath + 'male_shoes_sit.png'),
      await this.loadImage(basePath + 'female_shirt_sit.png'),
      await this.loadImage(basePath + 'female_hair_sit.png')
    ];

    // Renk Paleti (Can: Sıcak Esmer Ten / Sezen: Mavi-Siyah Karışık Saç)
    const colors = isCan ? {
      skin: '#c68b59',  // Esmer ten tonu
      pants: '#2d3e54', // Kot
      shoes: '#382519', // Kahve ayakkabı
      shirt: '#2e6b3f', // Orman yeşili kazak
      hair: '#2c1b12'   // Espresso koyu saç
    } : {
      skin: null,       // Doğal açık ten
      pants: '#c9a885', // Bej pantolon
      shoes: '#523420', // Kahve ayakkabı
      shirt: '#7d53b8', // Lavanta kazak
      hair: '#0c141f'   // Mavi-siyah gece saç
    };

    // 2. Yürüyüş Sheet'ini Kompoze Et (576 x 256)
    const walkSheet = document.createElement('canvas');
    walkSheet.width = 576;
    walkSheet.height = 256;
    const wCtx = walkSheet.getContext('2d');
    wCtx.imageSmoothingEnabled = false;

    // Vücut katmanı (Can için esmer ten tint)
    if (walkLayers[0]) {
      if (isCan && colors.skin) {
        wCtx.drawImage(this.tintLayer(walkLayers[0], colors.skin), 0, 0);
      } else {
        wCtx.drawImage(walkLayers[0], 0, 0);
      }
    }
    if (walkLayers[1]) wCtx.drawImage(this.tintLayer(walkLayers[1], colors.pants), 0, 0);
    if (walkLayers[2]) wCtx.drawImage(this.tintLayer(walkLayers[2], colors.shoes), 0, 0);
    if (walkLayers[3]) wCtx.drawImage(this.tintLayer(walkLayers[3], colors.shirt), 0, 0);
    if (walkLayers[4]) wCtx.drawImage(this.tintLayer(walkLayers[4], colors.hair), 0, 0);

    // Sezen'in saçına tatlı mercan kurdele toka ve mavi ışıltılar ekle
    if (!isCan) {
      // Down yönü için kurdele (Row 2, Frame 0..8)
      wCtx.fillStyle = '#e76f51';
      for (let f = 0; f < 9; f++) {
        const fx = f * 64;
        wCtx.fillRect(fx + 40, 2 * 64 + 18, 5, 4);
        wCtx.fillRect(fx + 41, 2 * 64 + 19, 2, 2);
        // Mavi saç ışıltısı
        wCtx.fillStyle = '#3a5a80';
        wCtx.fillRect(fx + 26, 2 * 64 + 15, 6, 2);
        wCtx.fillRect(fx + 22, 2 * 64 + 22, 2, 6);
        wCtx.fillStyle = '#e76f51';
      }
    }

    // 3. Oturma Sheet'ini Kompoze Et
    const sitSheet = document.createElement('canvas');
    sitSheet.width = 576;
    sitSheet.height = 256;
    const sCtx = sitSheet.getContext('2d');
    sCtx.imageSmoothingEnabled = false;

    if (sitLayers[0]) {
      if (isCan && colors.skin) {
        sCtx.drawImage(this.tintLayer(sitLayers[0], colors.skin), 0, 0);
      } else {
        sCtx.drawImage(sitLayers[0], 0, 0);
      }
    }
    if (sitLayers[1]) sCtx.drawImage(this.tintLayer(sitLayers[1], colors.pants), 0, 0);
    if (sitLayers[2]) sCtx.drawImage(this.tintLayer(sitLayers[2], colors.shoes), 0, 0);
    if (sitLayers[3]) sCtx.drawImage(this.tintLayer(sitLayers[3], colors.shirt), 0, 0);
    if (sitLayers[4]) sCtx.drawImage(this.tintLayer(sitLayers[4], colors.hair), 0, 0);

    // 4. Sprites.cache içine yüksek çözünürlüklü LPC karelerini kes ve yerleştir
    // LPC Row Haritası: 0: up, 1: left, 2: down, 3: right
    const dirMap = {
      up: 0,
      left: 1,
      down: 2,
      right: 3
    };

    if (!Sprites.cache[name]) Sprites.cache[name] = {};

    // Her yön için kareleri kes (Oyunun 32x42 oranına uygun orantılı kırma)
    for (const [dir, row] of Object.entries(dirMap)) {
      Sprites.cache[name][dir] = [];
      const frameIndices = [0, 1, 2, 3, 4, 5, 6, 7];
      frameIndices.forEach(f => {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = 32;
        frameCanvas.height = 42;
        const fCtx = frameCanvas.getContext('2d');
        fCtx.imageSmoothingEnabled = false;

        // LPC'nin 64x64 içindeki gövdesini -> 32x42 içine çiz
        fCtx.drawImage(
          walkSheet,
          f * 64 + 16, row * 64 + 14, 32, 44,
          0, 0, 32, 42
        );

        // Can ve Sezen için belirgin, sevimli yüz detayları (Gözler, kaş, allık, tebessüm)
        if (dir === 'down') {
          const eyeColor = isCan ? '#1e1109' : '#1b2333';
          const blushColor = isCan ? '#bd7265' : '#ff9aa2';
          // Kaşlar
          fCtx.fillStyle = isCan ? '#2c1b12' : '#0c141f';
          fCtx.fillRect(10, 11, 4, 1);
          fCtx.fillRect(18, 11, 4, 1);
          // Gözler & Işıltı
          fCtx.fillStyle = eyeColor;
          fCtx.fillRect(11, 13, 3, 3);
          fCtx.fillRect(18, 13, 3, 3);
          fCtx.fillStyle = '#ffffff';
          fCtx.fillRect(11, 13, 1, 1);
          fCtx.fillRect(18, 13, 1, 1);
          // Yanak allıkları
          fCtx.fillStyle = blushColor;
          fCtx.fillRect(9, 16, 3, 2);
          fCtx.fillRect(20, 16, 3, 2);
          // Sevimli ağız
          fCtx.fillStyle = '#8c3d31';
          fCtx.fillRect(15, 17, 2, 1);
        }

        Sprites.cache[name][dir].push(frameCanvas);
      });
    }

    // Oturma Karesi (Row 2: Down, Frame 0)
    const sitCanvas = document.createElement('canvas');
    sitCanvas.width = 32;
    sitCanvas.height = 42;
    const sitCtx = sitCanvas.getContext('2d');
    sitCtx.imageSmoothingEnabled = false;
    sitCtx.drawImage(
      sitSheet,
      0 * 64 + 16, 2 * 64 + 14, 32, 44,
      0, 0, 32, 42
    );

    // Oturan karaktere yüz ekle
    const eyeColor = isCan ? '#1e1109' : '#1b2333';
    const blushColor = isCan ? '#bd7265' : '#ff9aa2';
    sitCtx.fillStyle = isCan ? '#2c1b12' : '#0c141f';
    sitCtx.fillRect(10, 11, 4, 1);
    sitCtx.fillRect(18, 11, 4, 1);
    sitCtx.fillStyle = eyeColor;
    sitCtx.fillRect(11, 13, 3, 3);
    sitCtx.fillRect(18, 13, 3, 3);
    sitCtx.fillStyle = '#ffffff';
    sitCtx.fillRect(11, 13, 1, 1);
    sitCtx.fillRect(18, 13, 1, 1);
    sitCtx.fillStyle = blushColor;
    sitCtx.fillRect(9, 16, 3, 2);
    sitCtx.fillRect(20, 16, 3, 2);
    sitCtx.fillStyle = '#8c3d31';
    sitCtx.fillRect(15, 17, 2, 1);

    Sprites.cache[name]['sitting'] = sitCanvas;

    console.log(`🌸 ${name} için 32x42 yüksek kaliteli LPC animasyonları ve yüz detayları hazırlandı!`);
  },

  async preloadKeyTiles() {
    // Bahçe ve doğa için Kenney Tiny Town zemin karoları
    const ttIndices = ['0000', '0001', '0002', '0003', '0010', '0011', '0012', '0030', '0031', '0032'];
    for (const idx of ttIndices) {
      this.tiles.tiny_town[idx] = await this.loadImage(`/assets/tilesets/tiny_town/tile_${idx}.png`);
    }

    // Sınıf ve kafe için Kenney RPG Urban iç mekan karoları
    const ruIndices = ['0000', '0001', '0002', '0020', '0021', '0022', '0040', '0041', '0042'];
    for (const idx of ruIndices) {
      this.tiles.rpg_urban[idx] = await this.loadImage(`/assets/tilesets/rpg_urban/tile_${idx}.png`);
    }
  }
};
