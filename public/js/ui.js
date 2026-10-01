// ========================================================
// CozyStudy: Kullanıcı Arayüzü Modülü (UI & HUD 2.0)
// ========================================================

const UI = {
  activeStudyInterval: null,
  currentTableNear: null,
  miniEmotes: [],

  shopItems: [
    { id: 'plant_monstera', name: 'Monstera Saksı Çiçeği', icon: '🌿', cost: 10, desc: 'Sınıfa ferahlık katar.' },
    { id: 'vintage_lamp', name: 'Vintage Pirinç Lamba', icon: '💡', cost: 25, desc: 'Sınıf ve Kafede sıcak ışık.' },
    { id: 'heart_rug', name: 'Örme Kalp Kilim', icon: '🌸', cost: 40, desc: 'Bahçe çimenlerine serilir.' },
    { id: 'cat_cushion', name: 'Yumuşak Kedi Minderi', icon: '🐱', cost: 60, desc: 'Pamuk için kafe minderi.' },
    { id: 'star_lantern', name: 'Yıldızlı Peri Feneri', icon: '🏮', cost: 80, desc: 'Bahçe ağacında asılı fener.' }
  ],

  init() {
    this.initAuthGate();
    this.renderAvatarPreviews();
    this.setupEventListeners();
    this.setupMiniDrag();

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'mini') {
        this.toggleMiniMode(true);
      }
    } catch (_) {}
  },

  renderAvatarPreviews() {
    ['Can', 'Sezen'].forEach(name => {
      const canvas = document.getElementById(`preview-${name.toLowerCase()}`);
      if (canvas && Sprites.cache && Sprites.cache[name]) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 64, 64);
        const sprite = Sprites.cache[name]['down']?.[0];
        if (sprite) {
          const isLPC = sprite.width === 32;
          if (isLPC) {
            ctx.drawImage(sprite, 8, 4, 48, 56);
          } else {
            ctx.drawImage(sprite, 8, 0, 48, 64);
          }
        }
      }
    });
  },

  updateSlotBadges(slots) {
    ['Can', 'Sezen'].forEach(name => {
      const card = document.getElementById(`slot-${name.toLowerCase()}`);
      const badge = document.getElementById(`badge-${name.toLowerCase()}`);
      const btn = document.getElementById(`btn-${name.toLowerCase()}`);

      if (slots[name]) {
        badge.className = 'status-badge busy';
        badge.textContent = 'Dolu (Oyunda)';
        card.classList.add('occupied');
        btn.textContent = 'Bağlandı';
      } else {
        badge.className = 'status-badge available';
        badge.textContent = 'Müsait';
        card.classList.remove('occupied');
        btn.textContent = `${name} Olarak Katıl`;
      }
    });
  },

  hideCharacterSelect() {
    document.getElementById('character-select-screen').classList.add('hidden');

    const p = Network.localPlayer;
    if (p) {
      const myAvatarBox = document.getElementById('hud-my-avatar');
      const myPortraitImg = document.getElementById('hud-my-portrait-img');
      if (myAvatarBox && myPortraitImg) {
        myPortraitImg.src = p.name === 'Can' ? 'assets/can_portrait.jpg' : 'assets/sezen_portrait.jpg';
        myAvatarBox.style.display = 'flex';
      }
    }

    document.activeElement?.blur();
    window.focus();
    if (Game.canvas) Game.canvas.focus();
  },

  updateConnectionStatus(isOnline) {
    const el = document.getElementById('connection-status');
    if (el) {
      el.className = isOnline ? 'connection-status online' : 'connection-status offline';
      el.textContent = isOnline ? '● Bağlı' : '○ Bağlantı Kesildi';
    }
  },

  updateProgressDisplay(prog) {
    const streakEl = document.getElementById('hud-streak');
    const heartsEl = document.getElementById('hud-hearts');
    const shopBalanceEl = document.getElementById('shop-balance-display');

    if (streakEl) streakEl.textContent = `🔥 ${prog.currentStreak || 1} Gün`;
    if (heartsEl) heartsEl.textContent = `💕 ${prog.cozyHearts || 0}`;
    if (shopBalanceEl) shopBalanceEl.textContent = `Mevcut: 💕 ${prog.cozyHearts || 0} Kalp`;

    this.renderShopItems();
    this.renderNotesList();
  },

  updatePartnerStatus(localPlayer, players) {
    const el = document.getElementById('partner-info');
    const partnerImg = document.getElementById('hud-partner-portrait-img');
    const miniPartnerBadge = document.getElementById('mini-partner-status');
    const miniRoomTitle = document.getElementById('mini-room-title');

    if (miniRoomTitle && Game.currentRoom && Maps[Game.currentRoom]) {
      const roomIcons = { classroom: '🏫', cafe: '☕', garden: '🌸' };
      const icon = roomIcons[Game.currentRoom] || '🏡';
      miniRoomTitle.textContent = `${icon} ${Maps[Game.currentRoom].displayName}`;
    }

    if (!el || !localPlayer) return;

    const partnerName = localPlayer.name === 'Can' ? 'Sezen' : 'Can';
    const partner = Object.values(players).find(p => p.name === partnerName);

    if (partner) {
      if (partnerImg) {
        partnerImg.src = partnerName === 'Can' ? 'assets/can_portrait.jpg' : 'assets/sezen_portrait.jpg';
        partnerImg.style.display = 'inline-block';
      }
      if (partner.isSitting) {
        const statusIcon = partner.isPaused ? '☕' : '📖';
        const isMeSitting = localPlayer.isSitting;
        const roomName = Maps[partner.room]?.displayName || partner.room;
        if (!isMeSitting) {
          el.innerHTML = `💕 ${partnerName} <b>${roomName}</b>'nda masada! <button class="quick-join-btn" onclick="window.quickJoinPartner()">Yanına Otur 🪑</button>`;
        } else {
          el.textContent = `${partnerName}: ${statusIcon} [${partner.studyTopic || 'Ders'}]`;
        }
        if (miniPartnerBadge) miniPartnerBadge.textContent = `❤️ ${partnerName} Masada (${statusIcon})`;
      } else {
        const roomName = Maps[partner.room]?.displayName || partner.room;
        el.textContent = `${partnerName} ${roomName} alanında`;
        if (miniPartnerBadge) miniPartnerBadge.textContent = `🚶 ${partnerName} ${roomName}`;
      }
      el.style.color = '#2e7d32';
    } else {
      if (partnerImg) partnerImg.style.display = 'none';
      el.textContent = `${partnerName} bekleniyor... (Diğer bilgisayardan katılabilir)`;
      el.style.color = '#7a4a22';
      if (miniPartnerBadge) miniPartnerBadge.textContent = `⏳ ${partnerName} Bekleniyor`;
    }
  },

  updateRoomName(roomKey) {
    const el = document.getElementById('room-name');
    const miniRoomTitle = document.getElementById('mini-room-title');
    if (Maps[roomKey]) {
      if (el) el.textContent = Maps[roomKey].displayName;
      if (miniRoomTitle) {
        const roomIcons = { classroom: '🏫', cafe: '☕', garden: '🌸' };
        const icon = roomIcons[roomKey] || '🏡';
        miniRoomTitle.textContent = `${icon} ${Maps[roomKey].displayName}`;
      }
    }
  },

  // İpuçları
  showInteractionPrompt(text) {
    const el = document.getElementById('interaction-prompt');
    if (el) {
      el.innerHTML = `<span class="key-tag">E</span> ${text}`;
      el.classList.remove('hidden');
    }
  },

  hideInteractionPrompt() {
    const el = document.getElementById('interaction-prompt');
    if (el) el.classList.add('hidden');
  },

  showHugPrompt() {
    const el = document.getElementById('hug-prompt');
    if (el) el.classList.remove('hidden');
  },

  hideHugPrompt() {
    const el = document.getElementById('hug-prompt');
    if (el) el.classList.add('hidden');
  },

  showCatPrompt() {
    const el = document.getElementById('cat-prompt');
    if (el) el.classList.remove('hidden');
  },

  hideCatPrompt() {
    const el = document.getElementById('cat-prompt');
    if (el) el.classList.add('hidden');
  },

  showNoteboardPrompt() {
    const el = document.getElementById('noteboard-prompt');
    if (el) el.classList.remove('hidden');
  },

  hideNoteboardPrompt() {
    const el = document.getElementById('noteboard-prompt');
    if (el) el.classList.add('hidden');
  },

  // Çalışma Modalı
  openStudyModal(table) {
    this.currentTableNear = table;
    const modal = document.getElementById('study-modal');
    const bannerImg = document.getElementById('study-modal-banner-img');
    if (bannerImg) {
      if (Game.currentRoom === 'classroom') {
        bannerImg.src = 'assets/cozy_classroom_library.jpg';
        bannerImg.alt = 'Sınıf & Kütüphane Masası';
      } else if (Game.currentRoom === 'cafe') {
        bannerImg.src = 'assets/cozy_coffee_bar.jpg';
        bannerImg.alt = 'Cozy Kafe Masası';
      } else {
        bannerImg.src = 'assets/cozy_garden_gazebo.jpg';
        bannerImg.alt = 'Bahçe Çardağı';
      }
    }

    modal.classList.remove('hidden');
    const input = document.getElementById('subject-input');
    input.value = '';
    setTimeout(() => input.focus(), 50);
  },

  closeStudyModal() {
    document.getElementById('study-modal').classList.add('hidden');
    this.currentTableNear = null;
  },

  calculateSeatPosition(table) {
    const isCoupleTable = table.width > 70;
    const map = Maps[Game.currentRoom];
    let seatX = table.x + 20;
    let seatY = table.y - 4;
    let seatDir = 'down';

    // 1. Masada oturan bir NPC var mı kontrol et
    const sittingNPC = map?.npcs?.find(npc =>
      npc.isSitting &&
      npc.x >= table.x - 12 && npc.x <= table.x + table.width + 12 &&
      npc.y >= table.y - 20 && npc.y <= table.y + table.height + 20
    );

    if (sittingNPC) {
      // NPC masanın üst koltuğunda (y ~ table.y - 5).
      // Kullanıcı talebi: Masada NPC'nin olmadığı tarafa oturulmalı, arkasını dönüp oturabilmeli.
      // Karakter masanın alt kenarına oturur (NPC'den 24px uzakta, sırtı masaya dönük):
      seatX = table.x + (table.width > 50 ? table.width - 24 : 18);
      seatY = table.y + 20;
      seatDir = 'down';
      return { x: seatX, y: seatY, dir: seatDir };
    }

    // 2. Çift masası kontrolü (Partner masada mı?)
    if (isCoupleTable) {
      const partner = Object.values(Network.players).find(p =>
        p.name !== Game.localPlayer?.name &&
        p.tableId === table.id &&
        p.isSitting
      );

      if (partner) {
        const partnerDist = partner.x - table.x;
        const seatOffset = partnerDist < 35 ? 56 : 18;
        seatX = table.x + seatOffset;
      } else {
        const seatOffset = Game.localPlayer?.name === 'Can' ? 18 : 56;
        seatX = table.x + seatOffset;
      }
      seatY = table.y - 4;
      return { x: seatX, y: seatY, dir: 'down' };
    }

    // 3. Boş tekli masa
    seatX = table.x + 20;
    seatY = table.y - 4;
    return { x: seatX, y: seatY, dir: 'down' };
  },

  confirmStudySession() {
    const input = document.getElementById('subject-input');
    const topic = input.value.trim() || 'Genel Ders Çalışma';
    const isPomodoro = document.getElementById('mode-pomodoro')?.checked;
    const mode = isPomodoro ? 'pomodoro' : 'stopwatch';

    if (this.currentTableNear) {
      const now = Date.now();
      if (Game.localPlayer) {
        Game.localPlayer.isSitting = true;
        Game.localPlayer.studyStartTime = now;
        Game.localPlayer.studyElapsedSeconds = 0;
        Game.localPlayer.studyActiveSince = now;
        Game.localPlayer.isPaused = false;
        Game.localPlayer.studyTopic = topic;
        Game.localPlayer.studyMode = mode;
        const pos = this.calculateSeatPosition(this.currentTableNear);
        Game.localPlayer.x = pos.x;
        Game.localPlayer.y = pos.y;
        Network.sendMove(Game.localPlayer.x, Game.localPlayer.y, pos.dir || 'down', false);
      }
      if (Network.localPlayer) {
        Network.localPlayer.isSitting = true;
        Network.localPlayer.studyStartTime = now;
        Network.localPlayer.studyElapsedSeconds = 0;
        Network.localPlayer.studyActiveSince = now;
        Network.localPlayer.isPaused = false;
        Network.localPlayer.studyTopic = topic;
        Network.localPlayer.studyMode = mode;
      }
      Network.startStudy(this.currentTableNear.id, topic, mode);
      this.closeStudyModal();
      this.showActiveStudyHUD(topic, mode);
      document.activeElement?.blur();
      if (Game.canvas) Game.canvas.focus();
    }
  },

  showActiveStudyHUD(topic, mode) {
    const hud = document.getElementById('study-active-hud');
    const subjectEl = document.getElementById('active-study-subject');
    const thumbImg = document.getElementById('study-hud-char-img');
    const miniTopicEl = document.getElementById('mini-study-topic');
    const modeBadge = mode === 'pomodoro' ? '🍅' : '⏱️';
    const topicText = `${modeBadge} ${topic}`;

    if (subjectEl) subjectEl.textContent = topicText;
    if (miniTopicEl) miniTopicEl.textContent = topicText;

    if (thumbImg && Network.localPlayer) {
      thumbImg.src = Network.localPlayer.name === 'Can' ? 'assets/can_portrait.jpg' : 'assets/sezen_portrait.jpg';
    }
    if (hud) hud.classList.remove('hidden');

    this.startHUDTimer(mode);
  },

  hideActiveStudyHUD() {
    const hud = document.getElementById('study-active-hud');
    if (hud) hud.classList.add('hidden');
    const miniTopicEl = document.getElementById('mini-study-topic');
    const miniTimerEl = document.getElementById('mini-study-timer');
    const miniPauseBtn = document.getElementById('mini-btn-pause');
    const miniEndBtn = document.getElementById('mini-btn-end');

    if (miniTopicEl) miniTopicEl.textContent = '📖 Masaya Otur';
    if (miniTimerEl) miniTimerEl.textContent = '00:00:00';
    if (miniPauseBtn) {
      miniPauseBtn.textContent = '📖 Masaya Otur';
      miniPauseBtn.classList.remove('pause');
    }
    if (miniEndBtn) miniEndBtn.classList.add('hidden');

    if (this.activeStudyInterval) {
      clearInterval(this.activeStudyInterval);
      this.activeStudyInterval = null;
    }
  },

  startHUDTimer(mode) {
    const timerEl = document.getElementById('active-study-timer');
    const pauseBtn = document.getElementById('btn-pause-study');
    const miniTimerEl = document.getElementById('mini-study-timer');
    const miniPauseBtn = document.getElementById('mini-btn-pause');
    const miniEndBtn = document.getElementById('mini-btn-end');
    const miniTopicEl = document.getElementById('mini-study-topic');

    if (this.activeStudyInterval) clearInterval(this.activeStudyInterval);

    this.activeStudyInterval = setInterval(() => {
      const p = Network.localPlayer || (typeof Game !== 'undefined' ? Game.localPlayer : null);
      if (!p || !p.isSitting || !p.studyStartTime) {
        if (miniPauseBtn) {
          miniPauseBtn.textContent = '📖 Masaya Otur';
          miniPauseBtn.classList.remove('pause');
        }
        if (miniEndBtn) miniEndBtn.classList.add('hidden');
        return;
      }

      if (miniEndBtn) miniEndBtn.classList.remove('hidden');

      if (p.isPaused) {
        if (pauseBtn) {
          pauseBtn.textContent = '▶️ Devam Et';
          pauseBtn.className = 'pixel-btn-action';
        }
        if (miniPauseBtn) {
          miniPauseBtn.textContent = '▶️ Devam';
          miniPauseBtn.classList.remove('pause');
        }
      } else {
        if (pauseBtn) {
          pauseBtn.textContent = '☕ Mola Ver';
          pauseBtn.className = 'pixel-btn-action pause';
        }
        if (miniPauseBtn) {
          miniPauseBtn.textContent = '☕ Mola';
          miniPauseBtn.classList.add('pause');
        }
      }

      if (miniTopicEl && p.studyTopic) {
        const modeBadge = (p.studyMode || mode) === 'pomodoro' ? '🍅' : '📖';
        miniTopicEl.textContent = `${modeBadge} ${p.studyTopic}`;
      }

      const baseSeconds = p.studyElapsedSeconds || 0;
      const additional = p.isPaused ? 0 : Math.floor((Date.now() - (p.studyActiveSince || p.studyStartTime || Date.now())) / 1000);
      const elapsed = baseSeconds + Math.max(0, additional);

      let timeText = '00:00:00';
      if (mode === 'pomodoro') {
        const remaining = Math.max(0, (25 * 60) - elapsed);
        const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
        const secs = String(remaining % 60).padStart(2, '0');
        timeText = `${mins}:${secs}`;

        if (remaining === 0) {
          // Sessiz Görsel Bildirim
          this.showPomodoroToast();
        }
      } else {
        const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timeText = `${hrs}:${mins}:${secs}`;
      }

      if (timerEl) timerEl.textContent = timeText;
      if (miniTimerEl) miniTimerEl.textContent = timeText;
    }, 500);
  },

  showPomodoroToast() {
    const toast = document.getElementById('pomodoro-toast');
    if (toast) {
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 5000);
    }
  },

  // Not Panosu
  openNotesModal() {
    window.soundFX.playPaper();
    this.renderNotesList();
    document.getElementById('notes-modal').classList.remove('hidden');
  },

  closeNotesModal() {
    document.getElementById('notes-modal').classList.add('hidden');
  },

  renderNotesList() {
    const container = document.getElementById('notes-list');
    if (!container) return;

    container.innerHTML = '';
    const notes = Network.progress?.notes || [];

    if (notes.length === 0) {
      container.innerHTML = '<p style="color:#777; font-size:11px;">Henüz hiç not yok. İlk notu sen yaz! ❤️</p>';
      return;
    }

    notes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'post-it-note';

      const pin = document.createElement('div');
      pin.className = 'post-it-pin';

      const sender = document.createElement('div');
      sender.className = 'post-it-sender';
      sender.textContent = `✍️ ${note.sender}`;

      const text = document.createElement('div');
      text.className = 'post-it-text';
      text.textContent = note.text;

      const date = document.createElement('div');
      date.className = 'post-it-date';
      date.textContent = note.date;

      card.appendChild(pin);
      card.appendChild(sender);
      card.appendChild(text);
      card.appendChild(date);
      container.appendChild(card);
    });
  },

  handleNoteSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('new-note-input');
    const text = input.value.trim();
    if (text) {
      Network.addNote(text, Game.currentRoom);
      input.value = '';
      window.soundFX.playPaper();
    }
  },

  // Dükkan / Dekorlar
  openShopModal() {
    this.renderShopItems();
    document.getElementById('shop-modal').classList.remove('hidden');
  },

  closeShopModal() {
    document.getElementById('shop-modal').classList.add('hidden');
  },

  renderShopItems() {
    const container = document.getElementById('shop-items-container');
    if (!container) return;

    container.innerHTML = '';
    const unlocked = Network.progress?.unlockedDecors || [];
    const balance = Network.progress?.cozyHearts || 0;

    this.shopItems.forEach(item => {
      const isOwned = unlocked.includes(item.id);
      const canAfford = balance >= item.cost;

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon">${item.icon}</div>
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">${item.desc || ''}</div>
        <div class="shop-card-footer">
          <span class="shop-cost">💕 ${item.cost} Kalp</span>
          ${isOwned 
            ? `<span class="shop-btn-unlocked">✓ Açıldı</span>` 
            : `<button class="pixel-btn ${!canAfford ? 'disabled' : ''}" 
                       ${!canAfford ? 'disabled' : ''} 
                       onclick="window.buyDecor('${item.id}', ${item.cost})">
                 ${canAfford ? 'Satın Al' : 'Yetersiz'}
               </button>`
          }
        </div>
      `;
      container.appendChild(card);
    });
  },

  addChatMessage(sender, text, color) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'chat-msg';
    if (color) div.style.color = color;

    const senderSpan = document.createElement('span');
    senderSpan.className = 'sender';
    senderSpan.textContent = `${sender}: `;

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;

    div.appendChild(senderSpan);
    div.appendChild(textSpan);
    container.appendChild(div);

    while (container.childNodes.length > 30) {
      container.removeChild(container.firstChild);
    }
    container.scrollTop = container.scrollHeight;
  },

  showCelebration(text, hearts) {
    const overlay = document.getElementById('celebration-overlay');
    const textEl = document.getElementById('celebration-text');
    const heartsEl = document.getElementById('celebration-hearts');
    textEl.textContent = text;
    if (heartsEl) heartsEl.textContent = `+${hearts} Cozy Kalp Kazanıldı! 💕`;
    overlay.classList.remove('hidden');
  },

  closeCelebration() {
    document.getElementById('celebration-overlay').classList.add('hidden');
  },

  setupMiniDrag() {
    const widget = document.getElementById('mini-companion-widget');
    const header = widget?.querySelector('.mini-header-bar');
    if (!widget || !header) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    header.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = widget.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      widget.style.left = `${initialLeft}px`;
      widget.style.top = `${initialTop}px`;
      header.setPointerCapture(e.pointerId);
      header.style.cursor = 'grabbing';
    });

    header.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = Math.max(10, window.innerWidth - widget.offsetWidth - 10);
      const maxTop = Math.max(10, window.innerHeight - widget.offsetHeight - 10);
      widget.style.left = `${Math.max(10, Math.min(maxLeft, initialLeft + dx))}px`;
      widget.style.top = `${Math.max(10, Math.min(maxTop, initialTop + dy))}px`;
    });

    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
        try { header.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    header.addEventListener('pointerup', stopDrag);
    header.addEventListener('pointercancel', stopDrag);
  },

  toggleMiniMode(forceState) {
    const body = document.body;
    const widget = document.getElementById('mini-companion-widget');
    const toggleBtn = document.getElementById('btn-toggle-mini');
    const isCurrentlyMini = body.classList.contains('mini-mode');
    const newState = (typeof forceState === 'boolean') ? forceState : !isCurrentlyMini;

    if (newState) {
      body.classList.add('mini-mode');
      if (widget) widget.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.textContent = '⛶';
        toggleBtn.title = 'Tam Ekran Moduna Dön';
      }
    } else {
      body.classList.remove('mini-mode');
      if (widget) widget.classList.add('hidden');
      if (toggleBtn) {
        toggleBtn.textContent = '📌';
        toggleBtn.title = 'Kompakt Köşe Modu (Küçült)';
      }
    }

    if (Game.canvas) Game.canvas.focus();
  },

  openPopoutWindow() {
    const w = 310;
    const h = 330;
    const left = Math.max(0, (window.screen.availWidth || 1920) - w - 24);
    const top = Math.max(0, (window.screen.availHeight || 1080) - h - 48);

    const popup = window.open(
      'mini.html',
      'CozyMiniCompanion',
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`
    );

    if (popup) {
      try {
        popup.openerGame = typeof Game !== 'undefined' ? Game : window.Game;
        popup.openerNetwork = typeof Network !== 'undefined' ? Network : window.Network;
        popup.openerUI = this;
      } catch (_) {}
      popup.focus();
    }
  },

  spawnMiniEmote(playerName, emote) {
    const emojis = {
      heart: '❤️',
      coffee: '☕',
      cheer: '🎉',
      sparkle: '✨',
      sleep: '💤'
    };
    this.miniEmotes.push({
      playerName,
      text: emojis[emote] || emote || '❤️',
      createdAt: Date.now()
    });
    if (this.miniEmotes.length > 8) this.miniEmotes.shift();
  },

  renderMiniTableCanvas(time) {
    const canvas = document.getElementById('mini-table-canvas');
    if (!canvas || !Game.canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Masanın konumunu bul (oyuncu oturuyorsa masası, yoksa odanın çift masası)
    const map = Maps[Game.currentRoom];
    let targetTable = null;

    if (map && map.tables) {
      const p = Network.localPlayer || Game.localPlayer;
      if (p && p.isSitting && p.tableId) {
        targetTable = map.tables.find(t => t.id === p.tableId);
      }
      if (!targetTable) {
        targetTable = map.tables.find(t => t.width > 70) || map.tables[0];
      }
    }

    // Oyun ekranından masa merkezini hesapla
    let centerX = 320;
    let centerY = 200;
    if (targetTable) {
      centerX = targetTable.x + (targetTable.width / 2);
      centerY = targetTable.y + 10; // Masanın ve oturan karakterlerin tam ortası
    } else if (Game.localPlayer) {
      centerX = Game.localPlayer.x + 12;
      centerY = Game.localPlayer.y + 12;
    }

    // 16:10 oranında oyun ekranından doğrudan kırpma yap
    const cropW = 192;
    const cropH = 120;
    const cropX = Math.max(0, Math.min(640 - cropW, Math.round(centerX - (cropW / 2))));
    const cropY = Math.max(0, Math.min(400 - cropH, Math.round(centerY - (cropH / 2))));

    // OYUN EKRANINI BİREBİR MİNİ TUVALE YANSIT
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      Game.canvas,
      cropX, cropY, cropW, cropH,
      0, 0, canvas.width, canvas.height
    );
  },

  startQuickStudy() {
    if (!Network.localPlayer) {
      const isCanTaken = Object.values(Network.players || {}).some(p => p.name === 'Can');
      Network.chooseCharacter(isCanTaken ? 'Sezen' : 'Can');
    }

    const map = Maps[Game.currentRoom];
    if (!map || !map.tables) return;

    // Masayı bul (çift masası veya ilk masa)
    const table = map.tables.find(t => t.width > 70) || map.tables[0];
    if (!table) return;

    const now = Date.now();
    const topic = 'Ders Çalışma';

    if (Game.localPlayer) {
      Game.localPlayer.isSitting = true;
      Game.localPlayer.studyStartTime = now;
      Game.localPlayer.studyElapsedSeconds = 0;
      Game.localPlayer.studyActiveSince = now;
      Game.localPlayer.isPaused = false;
      Game.localPlayer.studyTopic = topic;
      Game.localPlayer.studyMode = 'stopwatch';
      const pos = this.calculateSeatPosition(table);
      Game.localPlayer.x = pos.x;
      Game.localPlayer.y = pos.y;
      Network.sendMove(Game.localPlayer.x, Game.localPlayer.y, pos.dir || 'down', false);
    }
    if (Network.localPlayer) {
      Network.localPlayer.isSitting = true;
      Network.localPlayer.studyStartTime = now;
      Network.localPlayer.studyElapsedSeconds = 0;
      Network.localPlayer.studyActiveSince = now;
      Network.localPlayer.isPaused = false;
      Network.localPlayer.studyTopic = topic;
      Network.localPlayer.studyMode = 'stopwatch';
    }

    Network.startStudy(table.id, topic, 'stopwatch');
    this.showActiveStudyHUD(topic, 'stopwatch');
  },

  togglePauseStudy() {
    const p = Network.localPlayer || (typeof Game !== 'undefined' ? Game.localPlayer : null);
    if (!p || !p.isSitting) {
      this.startQuickStudy();
      return;
    }

    const now = Date.now();
    if (!p.isPaused) {
      // Mola Ver: Süreyi o anki saniyede dondur
      const activeStretch = Math.floor((now - (p.studyActiveSince || p.studyStartTime || now)) / 1000);
      p.studyElapsedSeconds = (p.studyElapsedSeconds || 0) + Math.max(0, activeStretch);
      p.isPaused = true;
    } else {
      // Devam Et: Süre kaldığı yerden akmaya devam eder
      p.studyActiveSince = now;
      p.isPaused = false;
    }

    if (typeof Game !== 'undefined' && Game.localPlayer) {
      Game.localPlayer.isPaused = p.isPaused;
      Game.localPlayer.studyElapsedSeconds = p.studyElapsedSeconds;
      Game.localPlayer.studyActiveSince = p.studyActiveSince;
    }
    if (Network.localPlayer) {
      Network.localPlayer.isPaused = p.isPaused;
      Network.localPlayer.studyElapsedSeconds = p.studyElapsedSeconds;
      Network.localPlayer.studyActiveSince = p.studyActiveSince;
    }

    // Buton etiketini hemen güncelle (sıfır gecikme)
    const pauseBtn = document.getElementById('btn-pause-study');
    if (pauseBtn) {
      if (p.isPaused) {
        pauseBtn.textContent = '▶️ Devam Et';
        pauseBtn.className = 'pixel-btn-action';
      } else {
        pauseBtn.textContent = '☕ Mola Ver';
        pauseBtn.className = 'pixel-btn-action pause';
      }
    }

    Network.togglePause();
  },

  endStudySession() {
    const p = Network.localPlayer || (typeof Game !== 'undefined' ? Game.localPlayer : null);
    if (!p) return;

    const baseSeconds = p.studyElapsedSeconds || 0;
    const additional = p.isPaused ? 0 : Math.floor((Date.now() - (p.studyActiveSince || p.studyStartTime || Date.now())) / 1000);
    const elapsed = p.studyStartTime ? (baseSeconds + Math.max(0, additional)) : 0;
    const minutes = Math.floor(elapsed / 60);
    const earnedHearts = minutes >= 1 ? minutes : (elapsed >= 20 ? 1 : 0);
    const topic = p.studyTopic || 'Ders Çalışma';

    if (typeof Game !== 'undefined' && Game.localPlayer) {
      Game.localPlayer.isSitting = false;
      Game.localPlayer.studyStartTime = null;
      Game.localPlayer.studyElapsedSeconds = 0;
      Game.localPlayer.studyActiveSince = null;
      Game.localPlayer.isPaused = false;
      Game.localPlayer.y += 35; // Masadan kalkıp güvenli koridora adım at
    }
    if (Network.localPlayer) {
      Network.localPlayer.isSitting = false;
      Network.localPlayer.studyStartTime = null;
      Network.localPlayer.studyElapsedSeconds = 0;
      Network.localPlayer.studyActiveSince = null;
      Network.localPlayer.isPaused = false;
    }

    Network.endStudy(elapsed);
    this.hideActiveStudyHUD();
    const timeText = minutes >= 1 ? `${minutes} dakika` : `${elapsed} saniye`;
    this.showCelebration(`${timeText} boyunca [${topic}] çalıştınız!`, earnedHearts);
    document.activeElement?.blur();
    if (Game.canvas) Game.canvas.focus();
  },

  setupEventListeners() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        window.soundFX.init();
        const isMuted = window.soundFX.toggleMute();
        audioBtn.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) {
          window.soundFX.setRoomAmbience(Game.currentRoom);
        }
      });
    }

    const subjectInput = document.getElementById('subject-input');
    if (subjectInput) {
      subjectInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.confirmStudySession();
        } else if (e.key === 'Escape') {
          this.closeStudyModal();
        }
      });
    }

    // Mini mod ve HUD butonları için garanti olay delegasyonu (Tıklamaların kaçmasını önler)
    document.addEventListener('click', (e) => {
      const emoteBtn = e.target.closest('.mini-emote-btn');
      if (emoteBtn) {
        e.preventDefault();
        const emote = emoteBtn.dataset.emote || 'heart';
        window.sendEmote(emote);
        return;
      }

      const pauseBtn = e.target.closest('#mini-btn-pause');
      if (pauseBtn) {
        e.preventDefault();
        window.togglePauseStudy();
        return;
      }

      const endBtn = e.target.closest('#mini-btn-end');
      if (endBtn) {
        e.preventDefault();
        window.endStudySession();
        return;
      }

      const expandBtn = e.target.closest('#mini-btn-expand');
      if (expandBtn) {
        e.preventDefault();
        window.toggleMiniMode(false);
        return;
      }

      const popoutBtn = e.target.closest('#mini-btn-popout');
      if (popoutBtn) {
        e.preventDefault();
        window.openPopoutWindow();
        return;
      }
    });
  },

  // 1. Tek Tıkla Partnerin Yanına Oturma (Zero-Friction Co-Study Quick Join)
  quickJoinPartner() {
    if (!Game.localPlayer) return;
    const partnerName = Game.localPlayer.name === 'Can' ? 'Sezen' : 'Can';
    const partner = Object.values(Network.players || {}).find(p => p.name === partnerName);
    if (!partner || !partner.isSitting) {
      this.showToast('Partneriniz şu anda bir masada oturmuyor.');
      return;
    }

    if (Game.currentRoom !== partner.room) {
      Game.changeRoom(partner.room, 320, 200);
    }

    setTimeout(() => {
      const map = Maps[Game.currentRoom];
      const table = map?.tables?.find(t => t.id === partner.tableId) || map?.tables?.[0];
      if (table) {
        this.openStudyModal(table);
      }
    }, 150);
  },

  // 2. Partnerine Kahve/Çay İkram Etme
  serveCoffeeToPartner() {
    if (!Game.localPlayer || !Game.localPlayer.isSitting) {
      this.showToast('Kahve ikram etmek için bir masada oturuyor olmalısınız!');
      return;
    }
    Network.sendServeCoffee();
    this.showToast('☕ Sevgiline sıcacık bir kahve ikram ettin! ❤️');
    if (window.soundFX && window.soundFX.playCupChime) {
      window.soundFX.playCupChime();
    }
  },

  // 3. Masadaki Post-It Aşk Notu Modalı
  openDeskNoteModal() {
    const modal = document.getElementById('desk-note-modal');
    if (!modal) return;
    const notes = Network.progress?.notes || [];
    const latestNote = notes[0];
    const textEl = document.getElementById('desk-note-latest-text');
    const authorEl = document.getElementById('desk-note-latest-author');
    if (textEl && authorEl) {
      if (latestNote) {
        textEl.textContent = `"${latestNote.text}"`;
        authorEl.textContent = `— ${latestNote.sender} (${latestNote.date || 'Bugün'})`;
      } else {
        textEl.textContent = '"Birlikte çalışma dünyamıza hoş geldiniz! Birbirinize notlar bırakabilirsiniz ❤️"';
        authorEl.textContent = '— Can & Sezen';
      }
    }
    const input = document.getElementById('desk-note-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 60);
    }
    modal.classList.remove('hidden');
    if (window.soundFX && window.soundFX.playPageTurn) {
      window.soundFX.playPageTurn();
    }
  },

  closeDeskNoteModal() {
    const modal = document.getElementById('desk-note-modal');
    if (modal) modal.classList.add('hidden');
    if (Game.canvas) Game.canvas.focus();
  },

  handleDeskNoteSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('desk-note-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    Network.sendDeskNote(text);
    this.closeDeskNoteModal();
    this.showToast('📝 Sevgi notun masaya iliştirildi! 📌');
  },

  // 4. Cozy Toast Bildirim Sistemi
  showToast(message, duration = 3500) {
    const toast = document.getElementById('cozy-toast');
    if (!toast) return;
    toast.innerHTML = message;
    toast.classList.remove('hidden');
    toast.classList.add('visible');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.classList.add('hidden'), 350);
    }, duration);
  },

  showCoffeeNotification(from, to) {
    const isMe = Game.localPlayer && Game.localPlayer.name === to;
    if (isMe) {
      this.showToast(`☕ <b>${from}</b> sana sıcacık bir kahve ikram etti! ❤️`, 4500);
    } else {
      this.showToast(`☕ <b>${from}</b>, ${to}'e taze bir kahve ikram etti! ✨`, 3500);
    }
  },

  showNoteNotification(sender, text) {
    this.showToast(`📝 <b>${sender}</b> masaya yeni bir not iliştirdi: <br><i>"${text}"</i>`, 5000);
  },

  // 5. Özel Çift Şifre Kapısı (Sezen99720.)
  initAuthGate() {
    const savedPass = localStorage.getItem('cozystudy_room_pass');
    if (savedPass === 'Sezen99720.') {
      const modal = document.getElementById('auth-modal');
      if (modal) modal.classList.add('hidden');
    } else {
      this.showAuthModal();
    }
  },

  showAuthModal(errorMsg) {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const errEl = document.getElementById('auth-error-msg');
      if (errEl) {
        if (errorMsg) {
          errEl.textContent = errorMsg;
          errEl.classList.remove('hidden');
        } else {
          errEl.classList.add('hidden');
        }
      }
      const input = document.getElementById('auth-password-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  },

  handleAuthSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('auth-password-input');
    if (!input) return;
    const val = input.value.trim();
    if (val === 'Sezen99720.') {
      localStorage.setItem('cozystudy_room_pass', val);
      const modal = document.getElementById('auth-modal');
      if (modal) modal.classList.add('hidden');
      this.showToast('🌸 Hoş geldiniz! Odaya başarıyla giriş yapıldı.');
    } else {
      this.showAuthModal('Hatalı şifre! Bu oda sadece Can ve Sezen içindir 💕');
    }
  }
};

window.UI = UI;

// Global Pencereler İçin Bağlantılar
window.handleAuthSubmit = (e) => UI.handleAuthSubmit(e);
window.quickJoinPartner = () => UI.quickJoinPartner();
window.serveCoffeeToPartner = () => UI.serveCoffeeToPartner();
window.openDeskNoteModal = () => UI.openDeskNoteModal();
window.closeDeskNoteModal = () => UI.closeDeskNoteModal();
window.handleDeskNoteSubmit = (e) => UI.handleDeskNoteSubmit(e);
window.selectCharacter = (name) => {
  const pass = localStorage.getItem('cozystudy_room_pass');
  if (pass !== 'Sezen99720.') {
    UI.showAuthModal('Lütfen önce çift şifresini girin 💕');
    return;
  }
  Network.chooseCharacter(name);
};
window.sendEmote = (emote) => Network.sendEmote(emote);
window.toggleMiniMode = (forceState) => UI.toggleMiniMode(forceState);
window.openPopoutWindow = () => UI.openPopoutWindow();
window.startQuickStudy = () => UI.startQuickStudy();
window.togglePauseStudy = () => UI.togglePauseStudy();
window.endStudySession = () => UI.endStudySession();
window.setSubjectInput = (val) => {
  const el = document.getElementById('subject-input');
  if (el) el.value = val;
};
window.confirmStudySession = () => UI.confirmStudySession();
window.closeStudyModal = () => UI.closeStudyModal();
window.openNotesModal = () => UI.openNotesModal();
window.closeNotesModal = () => UI.closeNotesModal();
window.handleNoteSubmit = (e) => UI.handleNoteSubmit(e);
window.openShopModal = () => UI.openShopModal();
window.closeShopModal = () => UI.closeShopModal();
window.buyDecor = (id, cost) => Network.buyDecor(id, cost);
window.closeCelebration = () => {
  document.getElementById('celebration-overlay').classList.add('hidden');
  document.activeElement?.blur();
  if (Game.canvas) Game.canvas.focus();
};
window.handleChatSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (msg) {
    Network.sendChat(msg);
    input.value = '';
  }
};

