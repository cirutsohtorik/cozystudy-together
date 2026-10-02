// ========================================================
// CozyStudy: HUD ve Bildirim Yöneticisi (HUD Manager)
// ========================================================

let _toastTimeout = null;

export function showToast(message, duration = 3500) {
  const toast = document.getElementById('cozy-toast');
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.remove('hidden');
  toast.classList.add('visible');
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, duration);
}

export function showCoffeeNotification(from, to) {
  const isMe = typeof window !== 'undefined' && window.Game && window.Game.localPlayer && window.Game.localPlayer.name === to;
  if (isMe) {
    showToast(`☕ <b>${from}</b> sana sıcacık bir kahve ikram etti! ❤️`, 4500);
  } else {
    showToast(`☕ <b>${from}</b>, ${to}'e taze bir kahve ikram etti! ✨`, 3500);
  }
}

export function showNoteNotification(sender, text) {
  showToast(`📝 <b>${sender}</b> masaya yeni bir not iliştirdi: <br><i>"${text}"</i>`, 5000);
}

export function showCelebration(text, hearts) {
  const overlay = document.getElementById('celebration-overlay');
  const textEl = document.getElementById('celebration-text');
  const heartsEl = document.getElementById('celebration-hearts');
  if (textEl) textEl.textContent = text;
  if (heartsEl) heartsEl.textContent = `+${hearts} Cozy Kalp Kazanıldı! 💕`;
  if (overlay) overlay.classList.remove('hidden');
}

export function updateConnectionStatus(isOnline) {
  const el = document.getElementById('connection-status');
  if (el) {
    el.className = isOnline ? 'connection-status online' : 'connection-status offline';
    el.textContent = isOnline ? '● Bağlı' : '○ Bağlantı Kesildi';
  }
}

export function updateSlotBadges(slots) {
  ['Can', 'Sezen'].forEach(name => {
    const card = document.getElementById(`slot-${name.toLowerCase()}`);
    const badge = document.getElementById(`badge-${name.toLowerCase()}`);
    const btn = document.getElementById(`btn-${name.toLowerCase()}`);

    if (slots[name]) {
      if (badge) {
        badge.className = 'status-badge busy';
        badge.textContent = 'Dolu (Oyunda)';
      }
      if (card) card.classList.add('occupied');
      if (btn) btn.textContent = 'Bağlandı';
    } else {
      if (badge) {
        badge.className = 'status-badge available';
        badge.textContent = 'Müsait';
      }
      if (card) card.classList.remove('occupied');
      if (btn) btn.textContent = `${name} Olarak Katıl`;
    }
  });
}

export function updateWeatherHUD(weather) {
  const el = document.getElementById('hud-weather');
  if (!el || !weather) return;
  const icons = {
    sunny: '☀️ Güneşli',
    rainy: '🌧️ Yağmurlu',
    cloudy: '⛅ Parçalı Bulutlu',
    starry: '✨ Yıldızlı Gece'
  };
  el.textContent = icons[weather.type] || weather.name || '☀️ Güneşli';
}

export function updateClockHUD(hour) {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  const padH = String(h).padStart(2, '0');
  const padM = String(m).padStart(2, '0');
  el.textContent = `🕒 ${padH}:${padM}`;
  if (hour >= 8.5 && hour < 16.0) {
    el.title = 'Kampüs Saati (08:30 - 16:00: Sınıfta ders işleniyor, kilitli 🔒)';
  } else {
    el.title = 'Kampüs Saati (Ders saati dışı, sınıf serbest çalışmaya açık 🔓)';
  }
}

export function updateHeldItemHUD(item, remainingMs) {
  const el = document.getElementById('hud-held-item');
  if (!el) return;
  if (!item) {
    el.classList.add('hidden');
    el.style.display = 'none';
    return;
  }
  el.classList.remove('hidden');
  el.style.display = 'inline-flex';
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  el.textContent = `☕ ${item.name} (${m}:${String(s).padStart(2, '0')})`;
}

export function addChatMessage(sender, text, color) {
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
}
