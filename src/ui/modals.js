// ========================================================
// CozyStudy: Modallar Yöneticisi (Modals Manager)
// ========================================================

import { showToast } from './hud.js';

export const shopItems = [
  { id: 'plant_monstera', name: 'Monstera Saksı Çiçeği', icon: '🌿', cost: 10, desc: 'Sınıfa ferahlık katar.' },
  { id: 'vintage_lamp', name: 'Vintage Pirinç Lamba', icon: '💡', cost: 25, desc: 'Sınıf ve Kafede sıcak ışık.' },
  { id: 'heart_rug', name: 'Örme Kalp Kilim', icon: '🌸', cost: 40, desc: 'Bahçe çimenlerine serilir.' },
  { id: 'cat_cushion', name: 'Yumuşak Kedi Minderi', icon: '🐱', cost: 60, desc: 'Pamuk için kafe minderi.' },
  { id: 'star_lantern', name: 'Yıldızlı Peri Feneri', icon: '🏮', cost: 80, desc: 'Bahçe ağacında asılı fener.' }
];

export let selectedGiftItem = 'bouquet';

// 1. Not Panosu
export function openNotesModal() {
  if (typeof window !== 'undefined' && window.soundFX?.playPaper) {
    window.soundFX.playPaper();
  }
  renderNotesList();
  const el = document.getElementById('notes-modal');
  if (el) el.classList.remove('hidden');
}

export function closeNotesModal() {
  const el = document.getElementById('notes-modal');
  if (el) el.classList.add('hidden');
}

export function renderNotesList() {
  const container = document.getElementById('notes-list');
  if (!container) return;

  container.innerHTML = '';
  const notes = (typeof window !== 'undefined' && window.Network?.progress?.notes) || [];

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
}

// 2. Dükkan / Dekorlar
export function openShopModal() {
  renderShopItems();
  const el = document.getElementById('shop-modal');
  if (el) el.classList.remove('hidden');
}

export function closeShopModal() {
  const el = document.getElementById('shop-modal');
  if (el) el.classList.add('hidden');
}

export function renderShopItems() {
  const container = document.getElementById('shop-items-container');
  if (!container) return;

  container.innerHTML = '';
  const unlocked = (typeof window !== 'undefined' && window.Network?.progress?.unlockedDecors) || [];
  const balance = (typeof window !== 'undefined' && window.Network?.progress?.cozyHearts) || 0;

  shopItems.forEach(item => {
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
}

// 3. Kafe Menü Modalı
export function openFoodMenuModal() {
  const modal = document.getElementById('food-menu-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closeFoodMenuModal() {
  const modal = document.getElementById('food-menu-modal');
  if (modal) modal.classList.add('hidden');
}

// 4. Jukebox / Radyo Modalı
export function openJukeboxModal() {
  const modal = document.getElementById('jukebox-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closeJukeboxModal() {
  const modal = document.getElementById('jukebox-modal');
  if (modal) modal.classList.add('hidden');
}

// 5. Hediyeleşme Modalı
export function openGiftingModal() {
  const modal = document.getElementById('gifting-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closeGiftingModal() {
  const modal = document.getElementById('gifting-modal');
  if (modal) modal.classList.add('hidden');
}

// 6. Polaroid Modalı
export function openPolaroidModal() {
  const modal = document.getElementById('polaroid-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closePolaroidModal() {
  const modal = document.getElementById('polaroid-modal');
  if (modal) modal.classList.add('hidden');
}
