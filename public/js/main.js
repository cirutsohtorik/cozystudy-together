// ========================================================
// CozyStudy: Ana Modül Giriş Noktası (ESM Entrypoint)
// ========================================================

import { EventBus } from './event_bus.js';

console.log('🌸 CozyStudy ESM Entrypoint Başlatılıyor...');

// Sayfa yüklendiğinde Game motorunu güvenli başlat
window.addEventListener('load', () => {
  if (typeof Game !== 'undefined' && Game.init) {
    Game.init();
  }
});

export { EventBus };
