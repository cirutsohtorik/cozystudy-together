// ========================================================
// CozyStudy: Ağ ve Senkronizasyon Modülü (Network Engine 2.0)
// ========================================================

const Network = {
  socket: null,
  localPlayer: null,
  players: {},
  slots: { Can: false, Sezen: false },
  progress: {
    totalStudyMinutes: 0,
    cozyHearts: 10,
    currentStreak: 1,
    unlockedDecors: ['plant_monstera'],
    notes: []
  },
  cat: {
    x: 180,
    y: 290,
    state: 'sleeping'
  },

  init() {
    this.socket = io();

    // Yerel Yedekten İlerlemeyi Hızlıca Yükle
    try {
      const backup = localStorage.getItem('cozystudy_progress_backup');
      if (backup) {
        this.progress = JSON.parse(backup);
        UI.updateProgressDisplay(this.progress);
      }
    } catch (e) {}

    this.socket.on('connect', () => {
      console.log('Sunucuya bağlandı!');
      UI.updateConnectionStatus(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Sunucu bağlantısı koptu!');
      UI.updateConnectionStatus(false);
    });

    this.socket.on('slots_update', (slots) => {
      this.slots = slots;
      UI.updateSlotBadges(slots);
    });

    this.socket.on('character_confirmed', (playerData) => {
      this.localPlayer = playerData;
      UI.hideCharacterSelect();
      Game.setLocalPlayer(playerData);
      window.soundFX.setRoomAmbience(playerData.room);
    });

    this.socket.on('character_taken', ({ characterName }) => {
      alert(`${characterName} şu anda diğer bilgisayardan oynanıyor! Lütfen diğer karakteri seçin.`);
    });

    this.socket.on('error_message', (msg) => {
      alert(`Uyarı: ${msg}`);
    });

    this.socket.on('players_sync', (syncedPlayers) => {
      this.players = syncedPlayers;
      if (this.localPlayer && syncedPlayers[this.socket.id]) {
        const serverMe = syncedPlayers[this.socket.id];
        this.localPlayer.isSitting = serverMe.isSitting;
        this.localPlayer.isPaused = serverMe.isPaused;
        this.localPlayer.studyTopic = serverMe.studyTopic;
        this.localPlayer.studyStartTime = serverMe.studyStartTime;
        this.localPlayer.studyMode = serverMe.studyMode;
        this.localPlayer.tableId = serverMe.tableId;
        this.localPlayer.isHugging = serverMe.isHugging;
        this.localPlayer.heldItem = serverMe.heldItem;
        this.localPlayer.isSleeping = serverMe.isSleeping;
        this.localPlayer.studyElapsedSeconds = serverMe.studyElapsedSeconds || 0;
        this.localPlayer.studyActiveSince = serverMe.studyActiveSince || serverMe.studyStartTime || Date.now();

        if (Game.localPlayer) {
          Game.localPlayer.isSitting = serverMe.isSitting;
          Game.localPlayer.isPaused = serverMe.isPaused;
          Game.localPlayer.studyTopic = serverMe.studyTopic;
          Game.localPlayer.studyStartTime = serverMe.studyStartTime;
          Game.localPlayer.studyMode = serverMe.studyMode;
          Game.localPlayer.tableId = serverMe.tableId;
          Game.localPlayer.isHugging = serverMe.isHugging;
          if (Game.localPlayer.isSleeping !== serverMe.isSleeping) {
            Game.localPlayer.x = serverMe.x;
            Game.localPlayer.y = serverMe.y;
          }
          Game.localPlayer.isSleeping = serverMe.isSleeping;
          Game.localPlayer.studyElapsedSeconds = serverMe.studyElapsedSeconds || 0;
          Game.localPlayer.studyActiveSince = serverMe.studyActiveSince || serverMe.studyStartTime || Date.now();
        }
      }
      UI.updatePartnerStatus(this.localPlayer, this.players);
    });

    this.socket.on('player_moved', (data) => {
      if (this.players[data.id]) {
        this.players[data.id].x = data.x;
        this.players[data.id].y = data.y;
        this.players[data.id].direction = data.direction;
        this.players[data.id].isMoving = data.isMoving;
        this.players[data.id].isHugging = data.isHugging;
        this.players[data.id].isSleeping = data.isSleeping;
      }
    });

    // Kalıcı İlerleme Senkronizasyonu
    this.socket.on('progress_sync', (prog) => {
      this.progress = prog;
      try {
        localStorage.setItem('cozystudy_progress_backup', JSON.stringify(prog));
      } catch (e) {}
      UI.updateProgressDisplay(prog);
    });

    // Kedi Durumu
    this.socket.on('cat_sync', (catData) => {
      this.cat = catData;
    });

    this.socket.on('cat_purr_event', ({ playerName }) => {
      window.soundFX.playPurr();
      UI.addChatMessage('🐾 Pamuk', `Mırrr... (${playerName} Pamuk'u sevdi! ❤️)`, '#e67e22');
      Game.spawnEmote('Pamuk', 'heart');
    });

    // Sarılma Olayı
    this.socket.on('hug_event', ({ x, y }) => {
      window.soundFX.playHug();
      Game.spawnHugHearts(x, y);
      UI.addChatMessage('❤️ AŞK', 'Can ve Sezen sımsıkı sarıldı! 💕', '#e84393');
    });

    // Çalışma Olayları
    this.socket.on('study_event', (event) => {
      if (event.type === 'start') {
        window.soundFX.playSit();
        const modeLabel = event.mode === 'pomodoro' ? '🍅 25/5 Pomodoro' : '⏱️ Serbest';
        UI.addChatMessage('SİSTEM', `📖 ${event.playerName}, [${event.topic}] dersine başladı! (${modeLabel})`, '#2e7d32');
      } else if (event.type === 'pause') {
        UI.addChatMessage('SİSTEM', `☕ ${event.playerName} mola verdi.`, '#b8860b');
      } else if (event.type === 'resume') {
        UI.addChatMessage('SİSTEM', `▶️ ${event.playerName} derse geri döndü!`, '#2e7d32');
      } else if (event.type === 'end') {
        UI.addChatMessage('SİSTEM', `🎉 ${event.playerName} çalışmasını tamamladı! (+${event.earnedHearts || 0} Cozy Kalp)`, '#c2185b');
      }
    });

    // Sohbet
    this.socket.on('chat_message', (msg) => {
      UI.addChatMessage(msg.sender, msg.text);
      if (typeof Game !== 'undefined' && Game.spawnChatBubble) {
        Game.spawnChatBubble(msg.sender, msg.text);
      }
    });

    this.socket.on('player_emote', (data) => {
      Game.spawnEmote(data.playerName, data.emote);
    });

    this.socket.on('system_message', (msg) => {
      UI.addChatMessage('SİSTEM', msg, '#5c6bc0');
    });

    // Partner Kahve İkramı Olayı
    this.socket.on('coffee_served', (data) => {
      if (window.soundFX && window.soundFX.playCupChime) {
        window.soundFX.playCupChime();
      }
      if (typeof Game !== 'undefined' && Game.spawnCoffeeBurst) {
        Game.spawnCoffeeBurst(data.to);
      }
      if (typeof UI !== 'undefined' && UI.showCoffeeNotification) {
        UI.showCoffeeNotification(data.from, data.to);
      }
    });

    // Masaya Post-It Aşk Notu İliştirme Olayı
    this.socket.on('desk_note_received', (note) => {
      if (window.soundFX && window.soundFX.playPageTurn) {
        window.soundFX.playPageTurn();
      }
      if (typeof UI !== 'undefined' && UI.showNoteNotification) {
        UI.showNoteNotification(note.sender, note.text);
      }
    });

    // Dinamik Hava Durumu Senkronizasyonu
    this.socket.on('weather_sync', (wState) => {
      if (typeof Game !== 'undefined') {
        Game.weather = wState;
        Game.isRaining = (wState.type === 'rainy');
        if (window.soundFX) {
          window.soundFX.setRoomAmbience(Game.currentRoom, wState.type);
        }
      }
      if (typeof UI !== 'undefined' && UI.updateWeatherHUD) {
        UI.updateWeatherHUD(wState);
      }
    });

    // Dilek Çeşmesi Olayı
    this.socket.on('wishing_fountain_event', (data) => {
      if (window.soundFX && window.soundFX.playCoinToss) {
        window.soundFX.playCoinToss();
      }
      if (typeof Game !== 'undefined') {
        Game.spawnEmote(data.playerName, 'sparkle');
      }
      UI.addChatMessage('✨ DİLEK', `🪙 ${data.playerName} dilek tuttu: "${data.fortune}"`, '#b5179e');
      if (typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(`🪙 ${data.fortune}`, 4500);
      }
    });

    // Radyo İstasyonu Senkronizasyonu
    this.socket.on('radio_station_sync', (data) => {
      if (window.soundFX && window.soundFX.setRadioStation) {
        window.soundFX.setRadioStation(data.stationName);
      }
      UI.addChatMessage('📻 RADYO', `[${data.stationName}] çalıyor... (Açan: ${data.changedBy})`, '#d97706');
      if (typeof UI !== 'undefined' && UI.updateRadioStationBadge) {
        UI.updateRadioStationBadge(data.stationName);
      }
    });

    // Kedi Besleme Olayı
    this.socket.on('cat_fed_event', (data) => {
      if (window.soundFX && window.soundFX.playPurr) {
        window.soundFX.playPurr();
      }
      if (typeof Game !== 'undefined') {
        Game.spawnCoffeeBurst('Pamuk');
        Game.spawnEmote('Pamuk', 'heart');
      }
    });

    // Hediye Alma Olayı
    this.socket.on('gift_received', (data) => {
      if (window.soundFX && window.soundFX.playHug) {
        window.soundFX.playHug();
      }
      if (typeof UI !== 'undefined' && UI.showGiftNotification) {
        UI.showGiftNotification(data.from, data.giftName, data.note);
      }
    });

    // Şifre Doğrulama Hatası
    this.socket.on('auth_error', (msg) => {
      localStorage.removeItem('cozystudy_room_pass');
      if (typeof UI !== 'undefined' && UI.showAuthModal) {
        UI.showAuthModal(msg);
      } else {
        alert(msg);
      }
    });
  },

  // Eylemler
  chooseCharacter(characterName) {
    if (!this.socket) {
      this.init();
    }
    window.soundFX.init();
    const password = localStorage.getItem('cozystudy_room_pass') || window._roomPassword || '';
    if (this.socket && this.socket.connected) {
      this.socket.emit('choose_character', { characterName, password });
    } else if (this.socket) {
      this.socket.once('connect', () => {
        this.socket.emit('choose_character', { characterName, password });
      });
    }
  },

  sendMove(x, y, direction, isMoving) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('player_move', { x, y, direction, isMoving });
  },

  changeRoom(newRoom, spawnX, spawnY) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('change_room', { newRoom, spawnX, spawnY });
  },

  performHug() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('perform_hug');
  },

  petCat() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('pet_cat');
  },

  startStudy(tableId, topic, mode) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('start_study', { tableId, topic, mode });
  },

  togglePause() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('toggle_pause');
  },

  endStudy(totalSeconds) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('end_study', { totalSeconds });
  },

  addNote(text, room) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('add_note', { text, room });
  },

  buyDecor(decorId, cost) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('buy_decor', { decorId, cost });
  },

  sendChat(message) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('send_chat', { message });
    if (typeof Game !== 'undefined' && Game.spawnChatBubble) {
      Game.spawnChatBubble(this.localPlayer.name, message);
    }
  },

  sendEmote(emote) {
    if (!this.localPlayer) {
      if (typeof Game !== 'undefined' && Game.localPlayer) {
        this.localPlayer = Game.localPlayer;
      } else {
        const isCanTaken = Object.values(this.players || {}).some(p => p.name === 'Can');
        this.chooseCharacter(isCanTaken ? 'Sezen' : 'Can');
      }
    }
    if (!this.localPlayer) return;

    if (this.socket && this.socket.connected) {
      this.socket.emit('send_emote', { emote });
    }
    if (typeof Game !== 'undefined' && Game.spawnEmote) {
      Game.spawnEmote(this.localPlayer.name, emote);
    }
    if (window.soundFX && window.soundFX.playPop) {
      window.soundFX.playPop();
    }
  },

  sendServeCoffee() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('serve_coffee');
  },

  sendDeskNote(text) {
    if (!this.socket || !this.localPlayer || !text) return;
    this.socket.emit('desk_note_send', { text });
  },

  buyFoodItem(itemId, itemName, itemIcon) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('buy_food_item', { itemId, itemName, itemIcon });
  },

  clearHeldItem() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('clear_held_item');
  },

  toggleSleep() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('toggle_sleep');
  },

  throwWishingCoin() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('throw_wishing_coin');
  },

  changeRadioStation(stationName) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('change_radio_station', { stationName });
  },

  feedCat() {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('feed_cat');
  },

  sendGift(giftName, note) {
    if (!this.socket || !this.localPlayer) return;
    this.socket.emit('send_gift', { giftName, note });
  }
};

window.Network = Network;
