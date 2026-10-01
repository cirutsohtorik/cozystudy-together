// ========================================================
// CozyStudy: Ana Oyun Motoru (Game Loop & Renderer 2.1)
// Kusursuz WASD / Ok Tuşları Hareketi, Çarpışma ve Render
// ========================================================

const Game = {
  canvas: null,
  ctx: null,
  currentRoom: 'classroom',
  localPlayer: null,
  keys: {},
  animTimer: 0,
  walkFrame: 0,
  stepSoundTimer: 0,
  emotes: [],
  particles: [],
  rainDrops: [],
  rainSplashes: [],
  chatBubbles: [],
  nearTable: null,
  nearCat: false,
  nearNoteBoard: false,
  canHug: false,
  isRaining: true,

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    Sprites.init();
    UI.init();
    Network.init();

    this.setupInputListeners();
    this.initParticles();
    this.initRain();

    this.isRaining = true;

    let lastTime = performance.now();
    let bgInterval = null;

    const tick = (currentTime) => {
      let dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      dt = Math.min(dt, 0.05); // Gecikmelerde duvardan atlamayı önle

      this.update(dt, currentTime);
      this.render(currentTime);

      if (typeof UI !== 'undefined' && UI.renderMiniTableCanvas) {
        UI.renderMiniTableCanvas(currentTime);
      }
    };

    const loop = (currentTime) => {
      if (!document.hidden) {
        tick(currentTime);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Sekme arka plana alındığında (diğer pencereler veya uygulamalar açıkken)
    // tuvalin ve kayan pencerenin asla donmamasını sağlayan 30 FPS yedek nabız
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (!bgInterval) {
          bgInterval = setInterval(() => {
            const now = performance.now();
            tick(now);
          }, 1000 / 30);
        }
      } else {
        if (bgInterval) {
          clearInterval(bgInterval);
          bgInterval = null;
          lastTime = performance.now();
        }
      }
    });
  },

  setLocalPlayer(playerData) {
    this.localPlayer = playerData;
    this.currentRoom = playerData.room;
    UI.updateRoomName(this.currentRoom);
    window.soundFX.init();
    window.soundFX.setRoomAmbience(this.currentRoom);
    // Canvas'a odaklan
    if (this.canvas) {
      setTimeout(() => this.canvas.focus(), 50);
    }
  },

  setupInputListeners() {
    // Canvas tıklandığında inputların odağını bırak ve canvas'a odaklan
    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        document.activeElement?.blur();
        this.canvas.focus();
      });
    }

    window.addEventListener('keydown', (e) => {
      // Sadece aktif bir modal açıkken veya chat yazarken WASD hareketini engelle
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        const isModalOpen = !activeEl.closest('.modal-overlay')?.classList.contains('hidden');
        const isChatFocused = activeEl.id === 'chat-input';
        if (isModalOpen || isChatFocused) {
          return;
        }
      }

      const key = e.key.toLowerCase();
      this.keys[e.code] = true;
      this.keys[key] = true;

      // Ok tuşları ve Boşluk tuşunda sayfa kaymasını engelle
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      // [H] Tuşu: Sarılma
      if ((e.code === 'KeyH' || key === 'h') && this.canHug) {
        e.preventDefault();
        Network.performHug();
        return;
      }

      // [E] veya Boşluk Etkileşimleri
      if (e.code === 'KeyE' || key === 'e' || e.code === 'Space') {
        if (this.nearNoteBoard) {
          e.preventDefault();
          UI.openNotesModal();
          return;
        }
        if (this.nearCat) {
          e.preventDefault();
          Network.petCat();
          return;
        }
        if (this.nearTable && !this.localPlayer?.isSitting) {
          e.preventDefault();
          UI.openStudyModal(this.nearTable);
          window.soundFX.playSit();
          return;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys[e.code] = false;
      this.keys[key] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      if (this.localPlayer) this.localPlayer.isMoving = false;
    });
  },

  initParticles() {
    this.initParticlesForRoom(this.currentRoom || 'classroom');
  },

  initParticlesForRoom(room) {
    this.particles = [];
    if (room === 'garden') {
      // Pembe Sakura Çiçek Yaprakları (Stardew Bahçe Estetiği)
      const petalColors = ['#ffccd5', '#ffb3c6', '#f48fb1', '#ffe5ec'];
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: 14 + Math.random() * 12,
          speedY: 18 + Math.random() * 14,
          size: 1.8 + Math.random() * 1.6,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 2.5,
          color: petalColors[i % petalColors.length]
        });
      }
    } else if (room === 'cafe') {
      // Yükselen Sıcak Kahve Aroması & Şömine Kıvılcımları (Good Coffee Estetiği)
      const emberColors = ['rgba(255, 220, 140, 0.7)', 'rgba(255, 170, 70, 0.65)', 'rgba(255, 240, 190, 0.8)'];
      for (let i = 0; i < 28; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: (Math.random() - 0.5) * 12,
          speedY: -(14 + Math.random() * 16), // Yukarı doğru yükselir
          size: 1.2 + Math.random() * 1.8,
          color: emberColors[i % emberColors.length]
        });
      }
    } else {
      // Sınıf & Kütüphane: Işık Huzmelerinde Süzülen Altın Toz Zerrecikleri
      for (let i = 0; i < 25; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: (Math.random() - 0.5) * 8 + 3,
          speedY: (Math.random() - 0.5) * 6 + 2,
          size: 1.1 + Math.random() * 1.4,
          color: 'rgba(255, 235, 170, 0.55)'
        });
      }
    }
  },

  initRain() {
    this.rainDrops = [];
    this.rainSplashes = [];
    for (let i = 0; i < 80; i++) {
      this.rainDrops.push({
        x: Math.random() * 640,
        y: Math.random() * 400,
        speedY: 340 + Math.random() * 120,
        speedX: 25 + Math.random() * 15,
        length: 8 + Math.random() * 8,
        alpha: 0.45 + Math.random() * 0.45
      });
    }
  },

  update(dt, time) {
    if (!this.localPlayer) return;

    if (this.localPlayer.isSitting || this.localPlayer.isHugging) {
      UI.hideInteractionPrompt();
      UI.hideHugPrompt();
      UI.hideCatPrompt();
      UI.hideNoteboardPrompt();
    } else {
      const map = Maps[this.currentRoom];
      if (map) {
        let dx = 0;
        let dy = 0;
        let direction = this.localPlayer.direction;

        // Hem KeyCode hem de küçük harf desteği
        if (this.keys['KeyW'] || this.keys['w'] || this.keys['ArrowUp'] || this.keys['arrowup']) { dy -= 1; direction = 'up'; }
        if (this.keys['KeyS'] || this.keys['s'] || this.keys['ArrowDown'] || this.keys['arrowdown']) { dy += 1; direction = 'down'; }
        if (this.keys['KeyA'] || this.keys['a'] || this.keys['ArrowLeft'] || this.keys['arrowleft']) { dx -= 1; direction = 'left'; }
        if (this.keys['KeyD'] || this.keys['d'] || this.keys['ArrowRight'] || this.keys['arrowright']) { dx += 1; direction = 'right'; }

        const isMoving = dx !== 0 || dy !== 0;

    if (isMoving) {
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const speed = 140 * dt;
      let newX = this.localPlayer.x + (dx * speed);
      let newY = this.localPlayer.y + (dy * speed);

      // Ekran sınırlarında tut
      newX = Math.max(16, Math.min(600, newX));
      newY = Math.max(50, Math.min(365, newY));

      if (!this.checkCollision(newX, this.localPlayer.y, map.colliders)) {
        this.localPlayer.x = newX;
      }
      if (!this.checkCollision(this.localPlayer.x, newY, map.colliders)) {
        this.localPlayer.y = newY;
      }

      this.localPlayer.direction = direction;
      this.localPlayer.isMoving = true;

      // Yerel kopyayı Network listesinde de hemen güncelle
      if (Network.players[this.localPlayer.id]) {
        Network.players[this.localPlayer.id].x = this.localPlayer.x;
        Network.players[this.localPlayer.id].y = this.localPlayer.y;
        Network.players[this.localPlayer.id].direction = direction;
        Network.players[this.localPlayer.id].isMoving = true;
      }

      this.animTimer += dt;
      if (this.animTimer > 0.10) {
        this.animTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % 8;
      }

      this.stepSoundTimer += dt;
      if (this.stepSoundTimer > 0.32) {
        this.stepSoundTimer = 0;
        window.soundFX.playStep();
      }

      Network.sendMove(this.localPlayer.x, this.localPlayer.y, direction, true);
    } else {
      if (this.localPlayer.isMoving) {
        this.localPlayer.isMoving = false;
        this.walkFrame = 0;
        if (Network.players[this.localPlayer.id]) {
          Network.players[this.localPlayer.id].isMoving = false;
        }
        Network.sendMove(this.localPlayer.x, this.localPlayer.y, direction, false);
      }
    }

        this.checkDoors(map.doors);
        this.checkTableProximity(map.tables);
        this.checkNoteBoardProximity(map.noteBoard);
        this.checkCatProximity();
        this.checkHugProximity();
      }
    }

    // Emotelar (Zaman damgalı pürüzsüz yükseliş ve solma - asla takılı kalmaz)
    const now = Date.now();
    this.emotes.forEach(em => {
      const elapsed = now - (em.createdAt || now);
      em.y -= 26 * dt;
      em.alpha = Math.max(0, 1 - (elapsed / (em.duration || 1800)));
    });
    this.emotes = this.emotes.filter(em => (now - (em.createdAt || now)) < (em.duration || 1800));

    // Sohbet Balonları (3 saniye ömür)
    this.chatBubbles = this.chatBubbles.filter(b => (now - b.createdAt) < (b.duration || 3000));

    // Yağmur (SADECE BAHÇEDE YAĞAR - Sınıf ve Kafede Asla Yağmaz)
    if (this.isRaining && this.currentRoom === 'garden') {
      this.rainDrops.forEach(r => {
        r.y += r.speedY * dt;
        r.x += (r.speedX || 25) * dt;
        if (r.y > 380) {
          if (this.rainSplashes.length < 30 && Math.random() > 0.6) {
            this.rainSplashes.push({
              x: r.x,
              y: r.y + (Math.random() * 8 - 4),
              radius: 1,
              maxRadius: 3 + Math.random() * 3,
              alpha: 0.65
            });
          }
          r.y = -10;
          r.x = Math.random() * 640;
        }
        if (r.x > 640) r.x = 0;
      });

      // Su halkaları / sıçramalar
      this.rainSplashes.forEach(s => {
        s.radius += 16 * dt;
        s.alpha -= 1.8 * dt;
      });
      this.rainSplashes = this.rainSplashes.filter(s => s.alpha > 0);
    }

    // Parçacıklar (Uçuşan yapraklar, buharlar ve altın tozlar)
    this.particles.forEach(p => {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      if (p.rotSpeed) {
        p.rotation = (p.rotation || 0) + p.rotSpeed * dt;
      }
      if (p.x > 645) p.x = -5;
      if (p.x < -5) p.x = 645;
      if (p.y > 405) p.y = -5;
      if (p.y < -5) p.y = 405;
    });
  },

  checkCollision(x, y, colliders) {
    const px = x + 6;
    const py = y + 22;
    const pw = 12;
    const ph = 8;

    for (const c of colliders) {
      if (px < c.x + c.width && px + pw > c.x &&
          py < c.y + c.height && py + ph > c.y) {
        return true;
      }
    }
    return false;
  },

  checkDoors(doors) {
    if (!doors) return;
    const px = this.localPlayer.x + 8;
    const py = this.localPlayer.y + 24;

    for (const d of doors) {
      if (px >= d.x && px <= d.x + d.width &&
          py >= d.y && py <= d.y + d.height) {
        window.soundFX.playDoor();
        this.currentRoom = d.targetRoom;
        this.localPlayer.room = d.targetRoom;
        this.localPlayer.x = d.spawnX;
        this.localPlayer.y = d.spawnY;
        UI.updateRoomName(d.targetRoom);
        Network.changeRoom(d.targetRoom, d.spawnX, d.spawnY);
        window.soundFX.setRoomAmbience(d.targetRoom);
        this.initParticlesForRoom(d.targetRoom);
        break;
      }
    }
  },

  checkTableProximity(tables) {
    if (!tables) return;
    const px = this.localPlayer.x + 12;
    const py = this.localPlayer.y + 24;

    let nearest = null;
    let minDist = 50;

    for (const t of tables) {
      const tx = t.x + (t.width / 2);
      const ty = t.y + (t.height / 2);
      const dist = Math.hypot(px - tx, py - ty);
      if (dist < minDist) {
        nearest = t;
        break;
      }
    }

    if (nearest && !this.localPlayer.isSitting) {
      this.nearTable = nearest;
      UI.showInteractionPrompt('Masaya Otur');
    } else {
      this.nearTable = null;
      UI.hideInteractionPrompt();
    }
  },

  checkNoteBoardProximity(board) {
    if (!board) {
      this.nearNoteBoard = false;
      UI.hideNoteboardPrompt();
      return;
    }

    const px = this.localPlayer.x + 12;
    const py = this.localPlayer.y + 24;
    const dist = Math.hypot(px - (board.x + board.width / 2), py - (board.y + board.height / 2));

    if (dist < 72) {
      this.nearNoteBoard = true;
      UI.showNoteboardPrompt();
    } else {
      this.nearNoteBoard = false;
      UI.hideNoteboardPrompt();
    }
  },

  checkCatProximity() {
    if (this.currentRoom !== 'cafe' || !Network.cat) {
      this.nearCat = false;
      UI.hideCatPrompt();
      return;
    }

    const px = this.localPlayer.x + 12;
    const py = this.localPlayer.y + 24;
    const dist = Math.hypot(px - Network.cat.x, py - Network.cat.y);

    if (dist < 44) {
      this.nearCat = true;
      UI.showCatPrompt();
    } else {
      this.nearCat = false;
      UI.hideCatPrompt();
    }
  },

  checkHugProximity() {
    const otherPlayer = Object.values(Network.players).find(p => p.id !== this.localPlayer?.id && p.name !== this.localPlayer?.name && p.room === this.currentRoom);
    if (!otherPlayer || otherPlayer.isSitting || this.localPlayer?.isSitting) {
      this.canHug = false;
      UI.hideHugPrompt();
      return;
    }

    const dist = Math.hypot(this.localPlayer.x - otherPlayer.x, this.localPlayer.y - otherPlayer.y);
    if (dist < 48) {
      this.canHug = true;
      UI.showHugPrompt();
    } else {
      this.canHug = false;
      UI.hideHugPrompt();
    }
  },

  spawnEmote(playerName, emoteType) {
    const emojis = {
      heart: '❤️',
      coffee: '☕',
      cheer: '🎉',
      sparkle: '✨',
      sleep: '💤'
    };

    let targetX = this.localPlayer?.x || 300;
    let targetY = this.localPlayer?.y || 200;

    if (playerName === 'Pamuk' && Network.cat) {
      targetX = Network.cat.x;
      targetY = Network.cat.y;
    } else {
      const targetPlayer = Object.values(Network.players).find(p => p.name === playerName) || this.localPlayer;
      if (targetPlayer) {
        targetX = targetPlayer.x;
        targetY = targetPlayer.y;
      }
    }

    // Oyuncunun üzerindeki eski/takılmış emojileri temizle (üst üste yığılmayı önler)
    this.emotes = this.emotes.filter(em => em.playerName !== playerName || em.alpha < 0.35);

    this.emotes.push({
      playerName,
      x: targetX + 8 + (Math.random() - 0.5) * 10,
      y: targetY - 14,
      text: emojis[emoteType] || '❤️',
      createdAt: Date.now(),
      duration: 1800,
      alpha: 1.0
    });

    if (typeof UI !== 'undefined' && UI.spawnMiniEmote) {
      UI.spawnMiniEmote(playerName, emoteType);
    }
  },

  spawnHugHearts(x, y) {
    for (let i = 0; i < 5; i++) {
      this.emotes.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y - 20 - (i * 8),
        text: '💕',
        alpha: 1.2
      });
    }
  },

  spawnCoffeeBurst(targetPlayerName) {
    let targetX = 320;
    let targetY = 200;
    const player = Object.values(Network.players || {}).find(p => p.name === targetPlayerName);
    if (player) {
      targetX = player.x + 12;
      targetY = player.y + 10;
    } else if (this.localPlayer) {
      targetX = this.localPlayer.x + 12;
      targetY = this.localPlayer.y + 10;
    }

    const icons = ['☕', '❤️', '✨', '💖', '☕'];
    for (let i = 0; i < 6; i++) {
      this.emotes.push({
        x: targetX + (Math.random() - 0.5) * 26,
        y: targetY - 12 - (i * 8),
        text: icons[i % icons.length],
        alpha: 1.6,
        createdAt: Date.now() + (i * 90)
      });
    }
  },

  spawnChatBubble(sender, text) {
    if (!text || !sender) return;
    // Aynı kişinin önceki balonunu temizle veya üzerine ekle
    this.chatBubbles = this.chatBubbles.filter(b => b.sender !== sender);
    this.chatBubbles.push({
      sender,
      text: text.length > 50 ? text.substring(0, 48) + '...' : text,
      createdAt: Date.now(),
      duration: 3500 // 3.5 saniye ekranda kalır
    });
  },

  render(time) {
    const map = Maps[this.currentRoom];
    if (!map) return;

    this.ctx.clearRect(0, 0, 640, 400);

    // 1. Harita ve Açık Dekorlar
    const unlockedDecors = Network.progress?.unlockedDecors || [];
    map.render(this.ctx, time, unlockedDecors);

    // 2. Oyuncuları Hazırla
    const currentPlayers = [];
    if (this.localPlayer && this.localPlayer.room === this.currentRoom) {
      currentPlayers.push(this.localPlayer);
    }
    Object.values(Network.players).forEach(p => {
      if (p.id !== this.localPlayer?.id && p.name !== this.localPlayer?.name && p.room === this.currentRoom) {
        currentPlayers.push(p);
      }
    });

    const areHugging = currentPlayers.length >= 2 && currentPlayers.every(p => p.isHugging);

    // 3. Y-Sorted Render Kuyruğu (Masalar, NPC'ler, Kedi ve Oyuncular kusursuz derinlik ile çizilir)
    const renderQueue = [];

    // Masaları ekle
    if (map.tables) {
      map.tables.forEach(t => {
        const isCouple = t.width > 70;
        const spriteKey = isCouple ? `table_${this.currentRoom}_couple` : `table_${this.currentRoom}`;
        const tableSprite = Sprites.cache[spriteKey] || Sprites.cache[`table_${this.currentRoom}`];
        renderQueue.push({
          y: t.y + 24, // Masanın taban derinlik noktası
          draw: () => {
            if (tableSprite) this.ctx.drawImage(tableSprite, t.x, t.y);
          }
        });
      });
    }

    // Haritadaki NPC'leri ekle
    if (map.npcs) {
      map.npcs.forEach(npc => {
        const depthY = npc.isSitting ? npc.y + 12 : npc.y + 28;
        renderQueue.push({
          y: depthY,
          draw: () => {
            this.renderNPC(npc, time);
          }
        });
      });
    }

    // Kediyi ekle (Kafede)
    if (this.currentRoom === 'cafe' && Network.cat) {
      const catSprite = Sprites.cache[`cat_${Network.cat.state}`] || Sprites.cache['cat_sleeping'];
      renderQueue.push({
        y: Network.cat.y + 12,
        draw: () => {
          if (catSprite) this.ctx.drawImage(catSprite, Network.cat.x, Network.cat.y);
        }
      });
    }

    // Sarılma veya Oyuncuları ekle
    if (areHugging && Sprites.cache['hug']) {
      const midX = (currentPlayers[0].x + currentPlayers[1].x) / 2;
      const midY = (currentPlayers[0].y + currentPlayers[1].y) / 2;
      renderQueue.push({
        y: midY + 30,
        draw: () => {
          this.ctx.drawImage(Sprites.cache['hug'], midX, midY);
          this.ctx.save();
          this.ctx.font = '9px Silkscreen, monospace';
          this.ctx.fillStyle = '#ff8fa3';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('Can & Sezen ❤️', midX + 18, midY - 6);
          this.ctx.restore();
        }
      });
    } else {
      currentPlayers.forEach(p => {
        // Oturan oyuncu masanın arkasında (sandalyede), ayaktaki oyuncu ayak tabanına göre sıralanır
        const depthY = p.isSitting ? p.y + 12 : p.y + 30;
        renderQueue.push({
          y: depthY,
          draw: () => {
            this.renderPlayer(p, time);
          }
        });
      });
    }

    // Y derinliğine göre sırala ve çiz
    renderQueue.sort((a, b) => a.y - b.y);
    renderQueue.forEach(item => item.draw());

    // 4.5. Oturan Oyuncular Masa Üstü Mikro-Animasyonları (Defter, Buhar, Not Alma, Doomscroll Telefon)
    this.renderSittingPlayerOverlay(currentPlayers, time);

    // 5. Ortak Çalışma Kalpleri
    this.renderStudyTogetherBonus(currentPlayers, time);

    // 6. Yüzen Emotelar
    this.emotes.forEach(em => {
      this.ctx.save();
      this.ctx.globalAlpha = em.alpha;
      this.ctx.font = '16px serif';
      this.ctx.fillText(em.text, em.x, em.y);
      this.ctx.restore();
    });

    // 7. Karakter Baş Üstü Sohbet Balonları (3 saniye gösterim)
    this.renderChatBubbles(currentPlayers, time);

    // 8. Yağmur Efekti (SADECE BAHÇEDE YAĞAR - Sınıf ve Kafede Asla Yağmaz)
    if (this.isRaining && this.currentRoom === 'garden') {
      this.ctx.lineWidth = 1.2;
      this.rainDrops.forEach(r => {
        this.ctx.strokeStyle = `rgba(180, 215, 255, ${r.alpha || 0.55})`;
        this.ctx.beginPath();
        this.ctx.moveTo(r.x, r.y);
        this.ctx.lineTo(r.x + 2, r.y + r.length);
        this.ctx.stroke();
      });

      // Su sıçrama halkaları
      this.rainSplashes.forEach(s => {
        this.ctx.strokeStyle = `rgba(205, 235, 255, ${s.alpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.45, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      });
    }

    // 9. Canlı Ortam Parçacıkları (Uçuşan Sakura yaprakları, kahve aroması & şömine kıvılcımları)
    this.renderAmbientParticles(time);

    // 10. Çift Yakınlık & Sevgi Parıltısı (Can & Sezen Cozy Heart Aura)
    this.renderCozyClosenessAura(currentPlayers, time);

    // 11. Dinamik Atmosferik Işıklandırma ve Işıldama (Lamba havuzları, fenerler, şömine alevi)
    this.renderAtmosphericLighting(time);

    // 12. Gerçek Zamanlı Gece / Gündüz / Gün Batımı Işıklandırması
    const lightingColor = Maps.getLightingOverlay(time);
    if (lightingColor && lightingColor !== 'rgba(255, 255, 255, 0)') {
      this.ctx.fillStyle = lightingColor;
      this.ctx.fillRect(0, 0, 640, 400);
    }
  },

  renderNPC(npc, time) {
    const sprite = Sprites.cache[npc.sprite];
    if (!sprite) return;

    const idleBob = npc.isSitting ? Math.sin(time * 0.003 + (npc.x || 0)) * 0.35 : Math.sin(time * 0.004 + (npc.x || 0)) * 0.7;

    // Yumuşak, katmanlı temas gölgesi
    this.ctx.fillStyle = 'rgba(20, 10, 5, 0.15)';
    this.ctx.beginPath();
    this.ctx.ellipse(npc.x + (sprite.width / 2), npc.y + sprite.height - 2, 9, 3.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(10, 5, 0, 0.28)';
    this.ctx.beginPath();
    this.ctx.ellipse(npc.x + (sprite.width / 2), npc.y + sprite.height - 3, 6, 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Sprite çizimi
    this.ctx.drawImage(sprite, npc.x, npc.y + idleBob);
  },

  renderAmbientParticles(time) {
    const ctx = this.ctx;
    ctx.save();

    if (this.currentRoom === 'garden') {
      // Uçuşan pembe Sakura kiraz çiçeği yaprakları
      this.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = p.color || '#ffccd5';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    } else if (this.currentRoom === 'cafe') {
      // Sıcak yükselen kahve aroması & şömine kıvılcımları
      this.particles.forEach(p => {
        ctx.fillStyle = p.color || 'rgba(255, 200, 120, 0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Sınıf & Kütüphane: Işık huzmelerinde süzülen altın toz zerrecikleri
      this.particles.forEach(p => {
        ctx.fillStyle = p.color || 'rgba(255, 235, 170, 0.45)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  },

  renderCozyClosenessAura(currentPlayers, time) {
    if (currentPlayers.length < 2) return;
    const p1 = currentPlayers[0];
    const p2 = currentPlayers[1];
    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

    // Birbirlerine yakınlarsa (< 75px) veya birlikte oturuyorlarsa
    if (dist < 75 || (p1.isSitting && p2.isSitting && p1.tableId === p2.tableId)) {
      const midX = (p1.x + p2.x) / 2 + 12;
      const midY = (p1.y + p2.y) / 2 + 16;
      const pulse = Math.sin(time * 0.005) * 0.06 + 0.16;

      const auraGrad = this.ctx.createRadialGradient(midX, midY, 6, midX, midY, 52);
      auraGrad.addColorStop(0, `rgba(255, 140, 180, ${pulse})`);
      auraGrad.addColorStop(0.5, `rgba(255, 200, 220, ${pulse * 0.5})`);
      auraGrad.addColorStop(1, 'rgba(255, 180, 200, 0)');

      this.ctx.save();
      this.ctx.fillStyle = auraGrad;
      this.ctx.beginPath();
      this.ctx.arc(midX, midY, 52, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  },

  renderAtmosphericLighting(time) {
    const ctx = this.ctx;
    ctx.save();

    if (this.currentRoom === 'classroom') {
      // 1. Pencerelerden süzülen altın gün ışığı / yağmur huzmeleri & Camdan süzülen damlalar
      [36, 420].forEach(wx => {
        // Camın üzerindeki süzülen yağmur damlacıkları (Cozy Window Glass Rain)
        for (let d = 0; d < 6; d++) {
          const dropSpeed = 12 + (d * 5);
          const dropY = 16 + ((time * 0.001 * dropSpeed + d * 19) % 46);
          const dropX = wx + 5 + (d * 8);
          // İnce cam su izi ve parlak damlacık ucu
          ctx.fillStyle = 'rgba(210, 235, 255, 0.35)';
          ctx.fillRect(dropX, dropY - 4, 1, 4);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.60)';
          ctx.fillRect(dropX, dropY, 1.5, 1.5);
        }

        // Pencerelerden içeri dökülen yumuşak ışık konisi
        const grad = ctx.createLinearGradient(wx + 26, 60, wx + 26, 280);
        grad.addColorStop(0, 'rgba(255, 245, 210, 0.16)');
        grad.addColorStop(0.5, 'rgba(255, 235, 180, 0.08)');
        grad.addColorStop(1, 'rgba(255, 220, 150, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(wx + 2, 65);
        ctx.lineTo(wx + 52, 65);
        ctx.lineTo(wx + 95, 275);
        ctx.lineTo(wx - 25, 275);
        ctx.closePath();
        ctx.fill();
      });

      // 2. Sıcak Masa Lambaları Işıldaması (Canlı Nefes Alan Kehribar Parıltı)
      const lamps = [
        { x: 440, y: 70, r: 45 },
        { x: 208, y: 175, r: 52 },
        { x: 82, y: 175, r: 38 },
        { x: 82, y: 275, r: 38 },
        { x: 212, y: 275, r: 38 }
      ];
      lamps.forEach(l => {
        const flicker = Math.sin(time * 0.004 + l.x) * 0.03 + 0.25;
        const radGrad = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, l.r);
        radGrad.addColorStop(0, `rgba(255, 225, 140, ${flicker})`);
        radGrad.addColorStop(0.5, `rgba(255, 210, 110, ${flicker * 0.45})`);
        radGrad.addColorStop(1, 'rgba(255, 200, 90, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.currentRoom === 'cafe') {
      // 1. Şömine & Odun Ateşi Sıcak Parıltısı
      const firePulse = Math.sin(time * 0.008) * 0.08 + 0.32;
      const fireGrad = ctx.createRadialGradient(560, 240, 10, 560, 240, 90);
      fireGrad.addColorStop(0, `rgba(255, 140, 50, ${firePulse})`);
      fireGrad.addColorStop(0.4, `rgba(255, 100, 30, ${firePulse * 0.6})`);
      fireGrad.addColorStop(1, 'rgba(255, 80, 20, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(560, 240, 90, 0, Math.PI * 2);
      ctx.fill();

      // 2. Barista Espresso Makinesi ve Vitrin Işıltısı
      const barGrad = ctx.createRadialGradient(130, 95, 10, 130, 95, 80);
      barGrad.addColorStop(0, 'rgba(255, 235, 170, 0.22)');
      barGrad.addColorStop(1, 'rgba(255, 200, 120, 0)');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.arc(130, 95, 80, 0, Math.PI * 2);
      ctx.fill();

      // 3. Masalardaki Sıcak Lamba Parıltıları
      const cafeLights = [
        { x: 358, y: 260, r: 55 },
        { x: 302, y: 165, r: 40 },
        { x: 472, y: 165, r: 40 }
      ];
      cafeLights.forEach(cl => {
        const flicker = Math.sin(time * 0.006 + cl.x) * 0.04 + 0.22;
        const g = ctx.createRadialGradient(cl.x, cl.y, 4, cl.x, cl.y, cl.r);
        g.addColorStop(0, `rgba(255, 220, 130, ${flicker})`);
        g.addColorStop(0.6, `rgba(255, 190, 90, ${flicker * 0.4})`);
        g.addColorStop(1, 'rgba(255, 170, 60, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Tavandaki Peri Işıkları Parıltısı
      for (let x = 20; x < 630; x += 40) {
        const bulbGlow = Math.sin(time * 0.004 + x) * 0.05 + 0.15;
        const bg = ctx.createRadialGradient(x, 26, 2, x, 26, 18);
        bg.addColorStop(0, `rgba(255, 240, 160, ${bulbGlow})`);
        bg.addColorStop(1, 'rgba(255, 220, 120, 0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(x, 26, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.currentRoom === 'garden') {
      // 1. Bahçe Fıskiyesi Su Işıltıları (Glints ✨)
      const fX = 315;
      const fY = 135;
      for (let i = 0; i < 4; i++) {
        const glintPhase = (time * 0.005 + (i * 1.5)) % (Math.PI * 2);
        const glintAlpha = Math.max(0, Math.sin(glintPhase));
        if (glintAlpha > 0.25) {
          const gx = fX + Math.sin(i * 2.1) * 22;
          const gy = fY + Math.cos(i * 1.7) * 12;
          ctx.strokeStyle = `rgba(255, 255, 255, ${glintAlpha * 0.85})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(gx - 3, gy); ctx.lineTo(gx + 3, gy);
          ctx.moveTo(gx, gy - 3); ctx.lineTo(gx, gy + 3);
          ctx.stroke();
        }
      }

      // 2. Çardak Fenerleri Sıcak Işığı
      const gazebos = [
        { x: 208, y: 220, r: 60 },
        { x: 82, y: 235, r: 45 },
        { x: 332, y: 235, r: 45 }
      ];
      gazebos.forEach(gz => {
        const gzGrad = ctx.createRadialGradient(gz.x, gz.y, 6, gz.x, gz.y, gz.r);
        gzGrad.addColorStop(0, 'rgba(255, 230, 150, 0.24)');
        gzGrad.addColorStop(0.5, 'rgba(255, 200, 110, 0.10)');
        gzGrad.addColorStop(1, 'rgba(255, 180, 80, 0)');
        ctx.fillStyle = gzGrad;
        ctx.beginPath();
        ctx.arc(gz.x, gz.y, gz.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Dilek Ağacı Çiçek Işıltısı
      const treeGlow = Math.sin(time * 0.003) * 0.04 + 0.14;
      const tg = ctx.createRadialGradient(556, 50, 8, 556, 50, 65);
      tg.addColorStop(0, `rgba(255, 180, 210, ${treeGlow})`);
      tg.addColorStop(1, 'rgba(255, 160, 190, 0)');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(556, 50, 65, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  renderChatBubbles(currentPlayers, time) {
    if (!this.chatBubbles || this.chatBubbles.length === 0) return;
    const now = Date.now();

    this.chatBubbles.forEach(bubble => {
      const elapsed = now - bubble.createdAt;
      if (elapsed > bubble.duration) return;

      // Son 500ms'de pürüzsüz solma (fade out)
      let alpha = 1.0;
      if (elapsed > bubble.duration - 500) {
        alpha = Math.max(0, (bubble.duration - elapsed) / 500);
      }

      // Konuşan kişiyi bul
      let targetX = 320;
      let targetY = 200;

      const player = currentPlayers.find(p => p.name === bubble.sender);
      if (player) {
        const isMe = this.localPlayer && (player.id === this.localPlayer.id || player.name === this.localPlayer.name);
        const px = isMe ? this.localPlayer.x : player.x;
        const py = isMe ? this.localPlayer.y : player.y;
        const isSitting = isMe ? this.localPlayer.isSitting : player.isSitting;
        targetX = px + 12;
        targetY = isSitting ? py - 22 : py - 18;
      } else {
        // NPC mi konuştu?
        const map = Maps[this.currentRoom];
        const npc = map?.npcs?.find(n => n.name === bubble.sender);
        if (npc) {
          targetX = npc.x + 12;
          targetY = npc.isSitting ? npc.y - 22 : npc.y - 18;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.font = '9px Silkscreen, monospace';

      const text = bubble.text;
      const textW = this.ctx.measureText(text).width;
      const boxW = Math.max(36, textW + 14);
      const boxH = 18;
      const boxX = Math.max(8, Math.min(640 - boxW - 8, targetX - (boxW / 2)));
      const boxY = targetY - boxH - 4;

      // Balon Gövdesi & Gölgesi
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(boxX + 2, boxY + 2, boxW, boxH);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#221208';
      this.ctx.lineWidth = 1.5;
      this.ctx.fillRect(boxX, boxY, boxW, boxH);
      this.ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Balon Kuyruğu (Aşağı kafaya doğru işaret eden minik üçgen)
      const tailX = Math.max(boxX + 6, Math.min(boxX + boxW - 6, targetX));
      this.ctx.beginPath();
      this.ctx.moveTo(tailX - 4, boxY + boxH);
      this.ctx.lineTo(tailX, boxY + boxH + 5);
      this.ctx.lineTo(tailX + 4, boxY + boxH);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(tailX - 4, boxY + boxH);
      this.ctx.lineTo(tailX, boxY + boxH + 5);
      this.ctx.lineTo(tailX + 4, boxY + boxH);
      this.ctx.stroke();

      // Balon İçi Metin
      this.ctx.fillStyle = '#221208';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(text, boxX + (boxW / 2), boxY + 12);
      this.ctx.restore();
    });
  },

  renderPlayer(player, time) {
    const isMe = this.localPlayer && (player.id === this.localPlayer.id || player.name === this.localPlayer.name);
    const posX = isMe ? this.localPlayer.x : player.x;
    const posY = isMe ? this.localPlayer.y : player.y;
    const dir = isMe ? this.localPlayer.direction : (player.direction || 'down');

    const sprites = Sprites.cache[player.name];
    if (!sprites) return;

    let spriteImg;

    if (player.isSitting) {
      spriteImg = sprites['sitting'];
    } else {
      const frames = sprites[dir] || [];
      const frameCount = frames.length || 1;
      const frameIndex = isMe ? (this.walkFrame % frameCount) : (player.isMoving ? Math.floor((time / 110) % frameCount) : 0);
      spriteImg = frames[frameIndex] || sprites['down']?.[0];
    }

    if (spriteImg) {
      const isLPC = spriteImg.width === 32;
      const drawX = isLPC ? posX - 4 : posX;
      const drawY = isLPC ? posY - 10 : posY;

      const isIdle = !player.isMoving && !player.isSitting;
      const breathBob = isIdle ? Math.sin(time * 0.004 + (posX * 0.05)) * 0.85 : (player.isSitting ? Math.sin(time * 0.003) * 0.5 : 0);

      // Çok katmanlı yumuşak zemin gölgesi (Daha derin ve doğal)
      this.ctx.fillStyle = 'rgba(20, 10, 5, 0.16)';
      this.ctx.beginPath();
      this.ctx.ellipse(posX + 12, posY + 31, 10, 4.5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'rgba(10, 5, 0, 0.30)';
      this.ctx.beginPath();
      this.ctx.ellipse(posX + 12, posY + 30, 6, 2.5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.drawImage(spriteImg, drawX, drawY + breathBob);

      // Doğal göz kırpma (Blink) animasyonu
      const isBlinking = ((Math.floor(time + (player.name === 'Can' ? 0 : 1700))) % 3500) < 120;
      if (isBlinking && (dir === 'down' || dir === 'left' || dir === 'right') && !player.isSitting) {
        const eyeCover = player.name === 'Can' ? '#c28253' : '#fff0e6';
        this.ctx.fillStyle = eyeCover;
        if (dir === 'down') {
          this.ctx.fillRect(drawX + 8, drawY + 10 + breathBob, 3, 2);
          this.ctx.fillRect(drawX + 13, drawY + 10 + breathBob, 3, 2);
        } else if (dir === 'left') {
          this.ctx.fillRect(drawX + 7, drawY + 10 + breathBob, 3, 2);
        } else if (dir === 'right') {
          this.ctx.fillRect(drawX + 14, drawY + 10 + breathBob, 3, 2);
        }
      }

      // Not: Masada oturma eşyaları (defter, buhar, telefon) masa sprite'ının üzerinde
      // görünmesi için renderSittingPlayerOverlay metodunda çizilir.
    }

    // İsim Etiketi
    this.ctx.save();
    this.ctx.font = '9px Silkscreen, monospace';
    this.ctx.textAlign = 'center';
    const tagColor = player.name === 'Can' ? '#2e7d32' : '#845ec2';

    const nameWidth = this.ctx.measureText(player.name).width;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.ctx.fillRect(posX + 12 - (nameWidth / 2) - 4, posY - 12, nameWidth + 8, 12);
    this.ctx.fillStyle = tagColor;
    this.ctx.fillText(player.name, posX + 12, posY - 3);
    this.ctx.restore();
  },

  renderSittingPlayerOverlay(currentPlayers, time) {
    if (!currentPlayers || currentPlayers.length === 0) return;

    currentPlayers.forEach(player => {
      const isMe = this.localPlayer && (player.id === this.localPlayer.id || player.name === this.localPlayer.name);
      const isSitting = isMe ? this.localPlayer.isSitting : player.isSitting;
      if (!isSitting) return;

      const isPaused = isMe ? this.localPlayer.isPaused : player.isPaused;
      const posX = isMe ? this.localPlayer.x : player.x;
      const posY = isMe ? this.localPlayer.y : player.y;
      const handColor = player.name === 'Can' ? '#c28253' : '#fff0e6';
      const breathBob = Math.sin(time * 0.003) * 0.5;

      this.ctx.save();

      if (!isPaused) {
        // ==========================================
        // 1. AKTİF DERS ÇALIŞMA MODU: AÇIK DEFTER, KALEM & BUHARLI KAHVE
        // ==========================================
        const bookX = posX + 4;
        const bookY = posY + 15;

        // Açık Defter Kapağı (Can için koyu orman yeşili, Sezen için sıcak lavanta)
        this.ctx.fillStyle = player.name === 'Can' ? '#1e4620' : '#4a2870';
        this.ctx.fillRect(bookX - 1, bookY - 1, 14, 8);

        // Defter Sayfaları (Sol ve sağ sayfa blokları)
        this.ctx.fillStyle = '#fffef2';
        this.ctx.fillRect(bookX, bookY, 5, 6); // Sol sayfa
        this.ctx.fillRect(bookX + 7, bookY, 5, 6); // Sağ sayfa
        this.ctx.fillStyle = '#d0d7de'; // Orta cilt çizgisi
        this.ctx.fillRect(bookX + 5, bookY, 2, 6);

        // Sayfa Satırları (Minik piksel metin satırları)
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(bookX + 1, bookY + 1, 3, 1);
        this.ctx.fillRect(bookX + 1, bookY + 3, 3, 1);
        this.ctx.fillRect(bookX + 8, bookY + 1, 3, 1);
        this.ctx.fillRect(bookX + 8, bookY + 3, 3, 1);

        // Dinamik Sayfa Çevirme Hareketi (Her 5.5 saniyede bir hafif sayfa kalkışı)
        const pageFlipCycle = (time * 0.001) % 6;
        if (pageFlipCycle > 5.4) {
          const flipProg = (pageFlipCycle - 5.4) / 0.6; // 0..1
          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.fillRect(bookX + 6 - Math.round(flipProg * 3), bookY - 1, 2, 5);
        }

        // Sol El (Defteri masada tutan el)
        this.ctx.fillStyle = handColor;
        this.ctx.fillRect(bookX - 1, bookY + 2, 2, 3);

        // Sağ El & Not Alan Kalem (Kalem 2.5 saniyede bir hafifçe sağa-sola oynar)
        const scribble = (Math.sin(time * 0.015) > 0.35) ? 1 : 0;
        this.ctx.fillStyle = '#eab308'; // Sarı kurşun kalem
        this.ctx.fillRect(bookX + 10 + scribble, bookY + 1, 1, 4);
        this.ctx.fillStyle = '#f472b6'; // Pembe silgi ucu
        this.ctx.fillRect(bookX + 10 + scribble, bookY, 1, 1);
        this.ctx.fillStyle = handColor; // Sağ el
        this.ctx.fillRect(bookX + 10 + scribble, bookY + 3, 2, 2);

        // Buharlı Sıcak Kahve Fincanı
        const mugX = posX + 19;
        const mugY = posY + 13;
        // Fincan gövdesi ve kulp
        this.ctx.fillStyle = '#fdfbf7';
        this.ctx.fillRect(mugX, mugY, 5, 5);
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.fillRect(mugX + 4, mugY + 1, 2, 3); // Kulp
        // Kahve yüzeyi
        this.ctx.fillStyle = '#4a2c11';
        this.ctx.fillRect(mugX + 1, mugY + 1, 3, 1);

        // Yükselen 3 Parçacıklı Doğal Piksel Kahve Buharı
        for (let s = 0; s < 3; s++) {
          const sPhase = (time * 0.003 + s * 1.8) % 2.5; // 0..2.5
          const sAlpha = Math.max(0, 0.75 - (sPhase / 2.5));
          const sY = mugY - 2 - (sPhase * 4.5);
          const sWiggle = Math.sin(time * 0.006 + s * 2) * 1.5;
          this.ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
          this.ctx.fillRect(mugX + 1.5 + sWiggle, sY, 1.5, 1.5);
        }
      } else {
        // ==========================================
        // 2. MOLA MODU: DOOMSCROLLING TELEFON ANİMASYONU
        // ==========================================
        // 1. Kenara çekilmiş kapalı ders kitabı
        this.ctx.fillStyle = player.name === 'Can' ? '#18381a' : '#3c1e5e';
        this.ctx.fillRect(posX + 2, posY + 15, 6, 6);
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.fillRect(posX + 7, posY + 16, 1, 4); // Sayfa kenarı

        // Dinlenen Kahve Fincanı
        this.ctx.fillStyle = '#fdfbf7';
        this.ctx.fillRect(posX + 21, posY + 14, 4, 4);

        // 2. Akıllı Telefon (Masanın tam üstünde, iki elle tutuluyor)
        const phoneX = posX + 9;
        const phoneY = posY + 8 + breathBob; // Göğüs/masa hizasında belirgin konum

        // Telefon Kasası (Koyu titanyum gövde + şık kenarlık)
        this.ctx.fillStyle = '#111318';
        this.ctx.fillRect(phoneX, phoneY, 7, 11);
        this.ctx.fillStyle = '#374151'; // Üst kamera çentiği
        this.ctx.fillRect(phoneX + 2, phoneY, 3, 1);

        // Parlayan Ekran (Canlı camgöbeği/mavi ekran ışığı)
        this.ctx.fillStyle = '#7dd3fc';
        this.ctx.fillRect(phoneX + 1, phoneY + 1, 5, 9);

        // Doomscroll Akışı: Sosyal medya gönderileri yukarı doğru akar
        const feedOffset = Math.floor((time * 0.016) % 5);
        // Gönderi 1 (Koyu mavi post kartı)
        this.ctx.fillStyle = '#0369a1';
        this.ctx.fillRect(phoneX + 1, phoneY + 1 + ((feedOffset + 0) % 5), 4, 1);
        // Gönderi 2 (Görsel post bloğu)
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(phoneX + 2, phoneY + 1 + ((feedOffset + 2) % 5), 3, 1);
        // Beğeni/Kalp reaksiyonu (Kırmızı minik piksel)
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillRect(phoneX + 3, phoneY + 1 + ((feedOffset + 4) % 5), 2, 1);

        // Ekrana vuran yumuşak ortam mavi ışıması (Karakterin yüzüne ve masaya yansır)
        const glowPulse = Math.sin(time * 0.008) * 0.08 + 0.32;
        this.ctx.fillStyle = `rgba(125, 211, 252, ${glowPulse})`;
        this.ctx.beginPath();
        this.ctx.arc(phoneX + 3.5, phoneY + 4, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // İki El Tutuşu
        this.ctx.fillStyle = handColor;
        this.ctx.fillRect(phoneX - 1, phoneY + 5, 2, 4); // Sol el
        this.ctx.fillRect(phoneX + 6, phoneY + 5, 2, 4); // Sağ el

        // Başparmak Doomscroll Hareketi (Periyodik olarak ekranı yukarı kaydırır)
        const thumbSwipe = (Math.sin(time * 0.010) > 0.2) ? 1.5 : 0;
        this.ctx.fillStyle = handColor;
        this.ctx.fillRect(phoneX + 4, phoneY + 7 - thumbSwipe, 2, 2);

        // Molada Ekrana Bakarken Arada Uçuşan Minik Beğeni Kalbi
        const heartFloat = (time * 0.002) % 4;
        if (heartFloat < 1.2) {
          const heartAlpha = 1 - (heartFloat / 1.2);
          this.ctx.fillStyle = `rgba(244, 63, 94, ${heartAlpha})`;
          this.ctx.font = '8px serif';
          this.ctx.fillText('💖', phoneX + 6 + (heartFloat * 2), phoneY - 2 - (heartFloat * 8));
        }
      }

      // ==========================================
      // 3. MASA KENARI POST-IT AŞK NOTU (Cozy Sticky Note)
      // ==========================================
      const postItX = posX + (player.name === 'Can' ? -5 : 23);
      const postItY = posY + 15;
      // Sarı / pembe post-it kağıdı
      this.ctx.fillStyle = player.name === 'Can' ? '#fff9a6' : '#ffd6e0';
      this.ctx.fillRect(postItX, postItY, 8, 8);
      // Katlanmış köşe gölgesi
      this.ctx.fillStyle = player.name === 'Can' ? '#f6e58d' : '#ffb3c6';
      this.ctx.fillRect(postItX + 5, postItY + 5, 3, 3);
      // Kırmızı raptiye/iğne
      this.ctx.fillStyle = '#ff4757';
      this.ctx.fillRect(postItX + 3, postItY + 1, 2, 2);

      // Partnerden gelen güncel bir not varsa minik parıldayan kalp
      const hasNotes = Network.progress && Network.progress.notes && Network.progress.notes.length > 0;
      if (hasNotes) {
        const pulse = Math.sin(time * 0.006) * 1.5;
        this.ctx.fillStyle = '#ff3366';
        this.ctx.font = '7px monospace';
        this.ctx.fillText('♥', postItX + 1, postItY - 1 + pulse);
      }

      this.ctx.restore();
    });
  },

  renderStudyTogetherBonus(playersInRoom, time) {
    const can = playersInRoom.find(p => p.name === 'Can');
    const sezen = playersInRoom.find(p => p.name === 'Sezen');

    if (can && sezen && can.isSitting && sezen.isSitting) {
      const midX = (can.x + sezen.x) / 2 + 12;
      const midY = Math.min(can.y, sezen.y) - 46;

      this.ctx.save();
      const sparkY = Math.sin(time * 0.005) * 3;
      this.ctx.font = '8px Silkscreen, monospace';
      const bonusText = '💕 Can & Sezen Birlikte Çalışıyor 💕';
      const textW = this.ctx.measureText(bonusText).width;

      this.ctx.fillStyle = 'rgba(255, 240, 245, 0.92)';
      this.ctx.strokeStyle = '#c2255c';
      this.ctx.lineWidth = 1.5;
      this.ctx.fillRect(midX - (textW / 2) - 6, midY - 10 + sparkY, textW + 12, 16);
      this.ctx.strokeRect(midX - (textW / 2) - 6, midY - 10 + sparkY, textW + 12, 16);

      this.ctx.fillStyle = '#c2255c';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(bonusText, midX, midY + 1 + sparkY);
      this.ctx.restore();
    }
  }
};

window.Game = Game;

window.addEventListener('load', () => {
  Game.init();
});
