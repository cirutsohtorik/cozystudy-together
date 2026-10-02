// ========================================================
// CozyStudy: Ana Modül Giriş Noktası (ESM Entrypoint)
// ========================================================

import { EventBus, Maps, Sprites, soundFX, UI } from '../../src/index.js';

console.log('🌸 CozyStudy ESM Entrypoint Başlatılıyor...');

// Sayfa yüklendiğinde Game motorunu güvenli başlat
window.addEventListener('load', () => {
  if (typeof Game !== 'undefined' && Game.init) {
    Game.init();
  }
});

export { EventBus, Maps, Sprites, soundFX, UI };
