// ========================================================
// CozyStudy: Mini Companion Widget & Popout Yöneticisi
// ========================================================

export const miniEmotes = [];

export function setupMiniDrag() {
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
}

export function toggleMiniMode(forceState) {
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
}

export function openPopoutWindow() {
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
      popup.openerUI = typeof UI !== 'undefined' ? UI : window.UI;
    } catch (_) {}
    popup.focus();
  }
}
