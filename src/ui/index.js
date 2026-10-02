// ========================================================
// CozyStudy: UI Ana İndeksi (UI Central Export)
// ========================================================

import * as auth from './auth.js';
import * as hud from './hud.js';
import * as study from './study.js';
import * as modals from './modals.js';
import * as mini from './mini.js';

export const UI = {
  ...auth,
  ...hud,
  ...study,
  ...modals,
  ...mini,

  init() {
    auth.initAuthGate();
    mini.setupMiniDrag();
    this.renderAvatarPreviews();
    this.setupEventListeners();

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'mini') {
        mini.toggleMiniMode(true);
      }
    } catch (_) {}
  },

  renderAvatarPreviews() {
    ['Can', 'Sezen'].forEach(name => {
      const canvas = document.getElementById(`preview-${name.toLowerCase()}`);
      if (canvas && window.Sprites && window.Sprites.cache) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 64, 64);
        const portrait = window.Sprites.cache['portrait_' + name];
        if (portrait) {
          ctx.drawImage(portrait, 0, 0, 64, 64);
        } else {
          const sprite = window.Sprites.cache[name]?.['down']?.[0];
          if (sprite) {
            const isLPC = sprite.width === 32;
            if (isLPC) {
              ctx.drawImage(sprite, 8, 4, 48, 56);
            } else {
              ctx.drawImage(sprite, 8, 0, 48, 64);
            }
          }
        }
      }
    });
  },

  hideCharacterSelect() {
    const el = document.getElementById('character-select-screen');
    if (el) el.classList.add('hidden');

    const p = window.Network?.localPlayer;
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
    if (window.Game?.canvas) window.Game.canvas.focus();
  },

  updateProgressDisplay(prog) {
    const streakEl = document.getElementById('hud-streak');
    const heartsEl = document.getElementById('hud-hearts');
    const shopBalanceEl = document.getElementById('shop-balance-display');

    if (streakEl) streakEl.textContent = `🔥 ${prog.currentStreak || 1} Gün`;
    if (heartsEl) heartsEl.textContent = `💕 ${prog.cozyHearts || 0}`;
    if (shopBalanceEl) shopBalanceEl.textContent = `Mevcut: 💕 ${prog.cozyHearts || 0} Kalp`;

    modals.renderShopItems();
    modals.renderNotesList();
  },

  updatePartnerStatus(localPlayer, players) {
    const el = document.getElementById('partner-info');
    const partnerImg = document.getElementById('hud-partner-portrait-img');
    const miniPartnerBadge = document.getElementById('mini-partner-status');
    const miniRoomTitle = document.getElementById('mini-room-title');

    if (miniRoomTitle && window.Game?.currentRoom && window.Maps?.[window.Game.currentRoom]) {
      const roomIcons = { classroom: '🏫', cafe: '☕', garden: '🌸', campus_path: '🌳', dorm: '🛏️' };
      const icon = roomIcons[window.Game.currentRoom] || '🏡';
      miniRoomTitle.textContent = `${icon} ${window.Maps[window.Game.currentRoom].displayName}`;
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
        const roomName = window.Maps?.[partner.room]?.displayName || partner.room;
        if (!isMeSitting) {
          el.innerHTML = `💕 ${partnerName} <b>${roomName}</b>'nda masada! <button class="quick-join-btn" onclick="window.quickJoinPartner()">Yanına Otur 🪑</button>`;
        } else {
          el.textContent = `${partnerName}: ${statusIcon} [${partner.studyTopic || 'Ders'}]`;
        }
        if (miniPartnerBadge) miniPartnerBadge.textContent = `❤️ ${partnerName} Masada (${statusIcon})`;
      } else {
        const roomName = window.Maps?.[partner.room]?.displayName || partner.room;
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
    if (window.Maps && window.Maps[roomKey]) {
      if (el) el.textContent = window.Maps[roomKey].displayName;
      if (miniRoomTitle) {
        const roomIcons = { classroom: '🏫', cafe: '☕', garden: '🌸', campus_path: '🌳', dorm: '🛏️' };
        const icon = roomIcons[roomKey] || '🏡';
        miniRoomTitle.textContent = `${icon} ${window.Maps[roomKey].displayName}`;
      }
    }
  },

  setupEventListeners() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        window.soundFX?.init();
        const isMuted = window.soundFX?.toggleMute();
        audioBtn.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted && window.Game?.currentRoom) {
          window.soundFX?.setRoomAmbience(window.Game.currentRoom);
        }
      });
    }

    const subjectInput = document.getElementById('subject-input');
    if (subjectInput) {
      subjectInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          study.confirmStudySession();
        } else if (e.key === 'Escape') {
          study.closeStudyModal();
        }
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.UI = UI;

  // Global HTML Onclick Handlers
  window.handleAuthSubmit = (e) => auth.handleAuthSubmit(e);
  window.quickJoinPartner = () => study.quickJoinPartner();
  window.togglePauseStudy = () => study.togglePauseStudy();
  window.endStudySession = () => study.endStudySession();
  window.confirmStudySession = () => study.confirmStudySession();
  window.closeStudyModal = () => study.closeStudyModal();

  window.openNotesModal = () => modals.openNotesModal();
  window.closeNotesModal = () => modals.closeNotesModal();
  window.openShopModal = () => modals.openShopModal();
  window.closeShopModal = () => modals.closeShopModal();
  window.openFoodMenuModal = () => modals.openFoodMenuModal();
  window.closeFoodMenuModal = () => modals.closeFoodMenuModal();
  window.openJukeboxModal = () => modals.openJukeboxModal();
  window.closeJukeboxModal = () => modals.closeJukeboxModal();
  window.openGiftingModal = () => modals.openGiftingModal();
  window.closeGiftingModal = () => modals.closeGiftingModal();
  window.openPolaroidModal = () => modals.openPolaroidModal();
  window.closePolaroidModal = () => modals.closePolaroidModal();

  window.toggleMiniMode = (state) => mini.toggleMiniMode(state);
  window.openPopoutWindow = () => mini.openPopoutWindow();

  window.selectCharacter = (name) => {
    const pass = localStorage.getItem('cozystudy_room_pass');
    if (pass !== 'Sezen99720.') {
      auth.showAuthModal('Lütfen önce çift şifresini girin 💕');
      return;
    }
    window.Network?.chooseCharacter(name);
  };
}
