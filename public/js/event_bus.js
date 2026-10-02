// ========================================================
// CozyStudy: Decoupled Event Bus (Pub-Sub Mimarisi)
// Katmanlar arası spagetti bağımlılıkları ortadan kaldırır.
// ========================================================

class EventBusEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Hata (${event}):`, err);
        }
      });
    }
  }
}

export const EventBus = new EventBusEmitter();
if (typeof window !== 'undefined') {
  window.EventBus = EventBus;
}
