// ========================================================
// CozyStudy: Ders Çalışma & Pomodoro Yöneticisi (Study System)
// ========================================================

import { showToast, showCelebration } from './hud.js';

let activeStudyInterval = null;
let currentTableNear = null;

export function openStudyModal(table) {
  currentTableNear = table;
  const modal = document.getElementById('study-modal');
  const badgeEl = document.getElementById('study-modal-room-badge');
  const bannerImg = document.getElementById('study-modal-banner-img');
  const curRoom = (typeof window !== 'undefined' && window.Game && window.Game.currentRoom) || 'classroom';

  if (bannerImg) {
    if (curRoom === 'classroom') {
      bannerImg.src = 'assets/cozy_classroom_library.jpg';
      bannerImg.alt = 'Sınıf & Kütüphane Masası';
    } else if (curRoom === 'cafe') {
      bannerImg.src = 'assets/cozy_coffee_bar.jpg';
      bannerImg.alt = 'Cozy Kafe Masası';
    } else {
      bannerImg.src = 'assets/cozy_garden_gazebo.jpg';
      bannerImg.alt = 'Bahçe Çardağı';
    }
  }

  if (badgeEl) {
    const roomIcons = { classroom: '🏫 Sınıf & Kütüphane', cafe: '☕ Cozy Kafe', garden: '🌸 Bahçe Çardağı' };
    const roomLabel = roomIcons[curRoom] || '🏡 Çalışma Alanı';
    const tableName = table?.name ? ` • ${table.name}` : '';
    badgeEl.textContent = `${roomLabel}${tableName}`;
  }

  if (modal) modal.classList.remove('hidden');
  const input = document.getElementById('subject-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
}

export function closeStudyModal() {
  const modal = document.getElementById('study-modal');
  if (modal) modal.classList.add('hidden');
  currentTableNear = null;
}

export function calculateSeatPosition(table) {
  const isCoupleTable = table.width > 70;
  const curRoom = (typeof window !== 'undefined' && window.Game && window.Game.currentRoom) || 'classroom';
  const map = (typeof window !== 'undefined' && window.Maps) ? window.Maps[curRoom] : null;
  let seatX = table.x + 20;
  let seatY = table.y - 4;
  let seatDir = 'down';

  // 1. Masada oturan NPC var mı kontrol et
  const sittingNPC = map?.npcs?.find(npc =>
    npc.isSitting &&
    npc.x >= table.x - 12 && npc.x <= table.x + table.width + 12 &&
    npc.y >= table.y - 20 && npc.y <= table.y + table.height + 20
  );

  if (sittingNPC) {
    seatX = table.x + (table.width > 50 ? table.width - 24 : 18);
    seatY = table.y + 20;
    seatDir = 'down';
    return { x: seatX, y: seatY, dir: seatDir };
  }

  // 2. Çift masası kontrolü
  if (isCoupleTable && typeof window !== 'undefined' && window.Network) {
    const partner = Object.values(window.Network.players || {}).find(p =>
      p.name !== window.Game?.localPlayer?.name &&
      p.tableId === table.id &&
      p.isSitting
    );

    if (partner) {
      const partnerDist = partner.x - table.x;
      const seatOffset = partnerDist < 35 ? 56 : 18;
      seatX = table.x + seatOffset;
    } else {
      const seatOffset = window.Game?.localPlayer?.name === 'Can' ? 18 : 56;
      seatX = table.x + seatOffset;
    }
    seatY = table.y - 4;
    return { x: seatX, y: seatY, dir: 'down' };
  }

  // 3. Tekli masa
  return { x: seatX, y: seatY, dir: 'down' };
}

export function confirmStudySession() {
  const input = document.getElementById('subject-input');
  const topic = (input && input.value.trim()) || 'Genel Ders Çalışma';
  const isPomodoro = document.getElementById('mode-pomodoro')?.checked;
  const mode = isPomodoro ? 'pomodoro' : 'stopwatch';

  if (currentTableNear && typeof window !== 'undefined') {
    const now = Date.now();
    if (window.Game?.localPlayer) {
      window.Game.localPlayer.isSitting = true;
      window.Game.localPlayer.studyStartTime = now;
      window.Game.localPlayer.studyElapsedSeconds = 0;
      window.Game.localPlayer.studyActiveSince = now;
      window.Game.localPlayer.isPaused = false;
      window.Game.localPlayer.studyTopic = topic;
      window.Game.localPlayer.studyMode = mode;
      const pos = calculateSeatPosition(currentTableNear);
      window.Game.localPlayer.x = pos.x;
      window.Game.localPlayer.y = pos.y;
      window.Network?.sendMove(pos.x, pos.y, pos.dir || 'down', false);
    }
    if (window.Network?.localPlayer) {
      window.Network.localPlayer.isSitting = true;
      window.Network.localPlayer.studyStartTime = now;
      window.Network.localPlayer.studyElapsedSeconds = 0;
      window.Network.localPlayer.studyActiveSince = now;
      window.Network.localPlayer.isPaused = false;
      window.Network.localPlayer.studyTopic = topic;
      window.Network.localPlayer.studyMode = mode;
    }
    window.Network?.startStudy(currentTableNear.id, topic, mode);
    closeStudyModal();
    showActiveStudyHUD(topic, mode);
  }
}

export function showActiveStudyHUD(topic, mode) {
  const hud = document.getElementById('study-active-hud');
  const subjectEl = document.getElementById('active-study-subject');
  const thumbImg = document.getElementById('study-hud-char-img');
  const miniTopicEl = document.getElementById('mini-study-topic');
  const modeBadge = mode === 'pomodoro' ? '🍅' : '⏱️';
  const topicText = `${modeBadge} ${topic}`;

  if (subjectEl) subjectEl.textContent = topicText;
  if (miniTopicEl) miniTopicEl.textContent = topicText;

  if (thumbImg && typeof window !== 'undefined' && window.Network?.localPlayer) {
    thumbImg.src = window.Network.localPlayer.name === 'Can' ? 'assets/can_portrait.jpg' : 'assets/sezen_portrait.jpg';
  }
  if (hud) hud.classList.remove('hidden');

  startHUDTimer(mode);
}

export function hideActiveStudyHUD() {
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

  if (activeStudyInterval) {
    clearInterval(activeStudyInterval);
    activeStudyInterval = null;
  }
}

export function startHUDTimer(mode) {
  const timerEl = document.getElementById('active-study-timer');
  const pauseBtn = document.getElementById('btn-pause-study');
  const miniTimerEl = document.getElementById('mini-study-timer');
  const miniPauseBtn = document.getElementById('mini-btn-pause');
  const miniEndBtn = document.getElementById('mini-btn-end');
  const miniTopicEl = document.getElementById('mini-study-topic');

  if (activeStudyInterval) clearInterval(activeStudyInterval);

  activeStudyInterval = setInterval(() => {
    const p = typeof window !== 'undefined' ? (window.Network?.localPlayer || window.Game?.localPlayer) : null;
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
    } else {
      const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      timeText = `${hrs}:${mins}:${secs}`;
    }

    if (timerEl) timerEl.textContent = timeText;
    if (miniTimerEl) miniTimerEl.textContent = timeText;
  }, 500);
}

export function quickJoinPartner() {
  if (typeof window === 'undefined' || !window.Game?.localPlayer) return;
  const partnerName = window.Game.localPlayer.name === 'Can' ? 'Sezen' : 'Can';
  const partner = Object.values(window.Network?.players || {}).find(p => p.name === partnerName);
  if (!partner || !partner.isSitting) {
    showToast('Partneriniz şu anda bir masada oturmuyor.');
    return;
  }

  if (window.Game.currentRoom !== partner.room) {
    window.Game.changeRoom(partner.room, 320, 200);
  }

  setTimeout(() => {
    const map = window.Maps ? window.Maps[window.Game.currentRoom] : null;
    const table = map?.tables?.find(t => t.id === partner.tableId) || map?.tables?.[0];
    if (table) {
      openStudyModal(table);
    }
  }, 150);
}

export function togglePauseStudy() {
  const p = typeof window !== 'undefined' ? (window.Network?.localPlayer || window.Game?.localPlayer) : null;
  if (!p || !p.isSitting) return;

  const now = Date.now();
  if (!p.isPaused) {
    const activeStretch = Math.floor((now - (p.studyActiveSince || p.studyStartTime || now)) / 1000);
    p.studyElapsedSeconds = (p.studyElapsedSeconds || 0) + Math.max(0, activeStretch);
    p.isPaused = true;
  } else {
    p.studyActiveSince = now;
    p.isPaused = false;
  }

  if (window.Game?.localPlayer) {
    window.Game.localPlayer.isPaused = p.isPaused;
    window.Game.localPlayer.studyElapsedSeconds = p.studyElapsedSeconds;
    window.Game.localPlayer.studyActiveSince = p.studyActiveSince;
  }
  if (window.Network?.localPlayer) {
    window.Network.localPlayer.isPaused = p.isPaused;
    window.Network.localPlayer.studyElapsedSeconds = p.studyElapsedSeconds;
    window.Network.localPlayer.studyActiveSince = p.studyActiveSince;
  }

  const pauseBtn = document.getElementById('btn-pause-study');
  if (pauseBtn) {
    pauseBtn.textContent = p.isPaused ? '▶️ Devam Et' : '☕ Mola Ver';
    pauseBtn.className = p.isPaused ? 'pixel-btn-action' : 'pixel-btn-action pause';
  }

  window.Network?.togglePause();
}

export function endStudySession() {
  const p = typeof window !== 'undefined' ? (window.Network?.localPlayer || window.Game?.localPlayer) : null;
  if (!p) return;

  const baseSeconds = p.studyElapsedSeconds || 0;
  const additional = p.isPaused ? 0 : Math.floor((Date.now() - (p.studyActiveSince || p.studyStartTime || Date.now())) / 1000);
  const elapsed = p.studyStartTime ? (baseSeconds + Math.max(0, additional)) : 0;
  const minutes = Math.floor(elapsed / 60);
  const earnedHearts = minutes >= 1 ? minutes : (elapsed >= 20 ? 1 : 0);
  const topic = p.studyTopic || 'Ders Çalışma';

  if (window.Game?.localPlayer) {
    window.Game.localPlayer.isSitting = false;
    window.Game.localPlayer.studyStartTime = null;
    window.Game.localPlayer.studyElapsedSeconds = 0;
    window.Game.localPlayer.studyActiveSince = null;
    window.Game.localPlayer.isPaused = false;
    window.Game.localPlayer.y += 35;
  }
  if (window.Network?.localPlayer) {
    window.Network.localPlayer.isSitting = false;
    window.Network.localPlayer.studyStartTime = null;
    window.Network.localPlayer.studyElapsedSeconds = 0;
    window.Network.localPlayer.studyActiveSince = null;
    window.Network.localPlayer.isPaused = false;
  }

  window.Network?.endStudy(elapsed);
  hideActiveStudyHUD();
  const timeText = minutes >= 1 ? `${minutes} dakika` : `${elapsed} saniye`;
  showCelebration(`${timeText} boyunca [${topic}] çalıştınız!`, earnedHearts);
}
