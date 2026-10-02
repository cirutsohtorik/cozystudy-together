// ========================================================
// CozyStudy: Input Yöneticisi (Keyboard & Interaction Listeners)
// ========================================================

export class InputManager {
  constructor(game) {
    this.game = game;
    this.keys = {};
  }

  init() {
    if (this.game.canvas) {
      this.game.canvas.addEventListener('click', () => {
        document.activeElement?.blur();
        this.game.canvas.focus();
      });
    }

    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    window.addEventListener('blur', () => {
      this.keys = {};
      if (this.game.localPlayer) this.game.localPlayer.isMoving = false;
    });
  }

  handleKeyDown(e) {
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

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    // [P] Tuşu: Anı Fotoğrafı Çek
    if (e.code === 'KeyP' || key === 'p') {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.UI && window.UI.takePolaroidSnapshot) {
        window.UI.takePolaroidSnapshot();
      }
      return;
    }

    // [I] Tuşu: Hediye Menüsü
    if (e.code === 'KeyI' || key === 'i') {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.UI && window.UI.openGiftingModal) {
        window.UI.openGiftingModal();
      }
      return;
    }

    // [H] Tuşu: Sarılma
    if ((e.code === 'KeyH' || key === 'h') && this.game.canHug) {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.Network) {
        window.Network.performHug();
      }
      return;
    }

    // [E] veya Boşluk Etkileşimleri
    if (e.code === 'KeyE' || key === 'e' || e.code === 'Space') {
      if (this.game.nearBed) {
        e.preventDefault();
        window.Network?.toggleSleep();
        return;
      }
      if (this.game.nearWishingFountain) {
        e.preventDefault();
        window.Network?.throwWishingCoin();
        return;
      }
      if (this.game.nearMenuBoard) {
        e.preventDefault();
        window.UI?.openFoodMenuModal();
        return;
      }
      if (this.game.nearJukebox) {
        e.preventDefault();
        window.UI?.openJukeboxModal();
        return;
      }
      if (this.game.nearNoteBoard) {
        e.preventDefault();
        window.UI?.openNotesModal();
        return;
      }
      if (this.game.nearCat) {
        e.preventDefault();
        window.Network?.petCat();
        return;
      }
      if (this.game.nearTable && !this.game.localPlayer?.isSitting) {
        e.preventDefault();
        window.UI?.openStudyModal(this.game.nearTable);
        window.soundFX?.playSit();
        return;
      }
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    this.keys[e.code] = false;
    this.keys[key] = false;
  }
}
