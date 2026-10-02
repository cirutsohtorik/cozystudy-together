// ========================================================
// CozyStudy: Özel Çift Şifre Doğrulama Kapısı (Auth Gate)
// Şifre: Sezen99720.
// ========================================================

export function initAuthGate() {
  const authScreen = document.getElementById('auth-screen');
  const charScreen = document.getElementById('character-select-screen');
  const savedPass = localStorage.getItem('cozystudy_room_pass');

  if (savedPass === 'Sezen99720.') {
    if (authScreen) authScreen.classList.add('hidden');
    if (charScreen) {
      charScreen.classList.remove('hidden');
      charScreen.classList.add('active');
    }
  } else {
    if (authScreen) {
      authScreen.classList.remove('hidden');
      authScreen.classList.add('active');
    }
    if (charScreen) {
      charScreen.classList.add('hidden');
      charScreen.classList.remove('active');
    }
    const input = document.getElementById('auth-password-input');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

export function showAuthModal(errorMsg) {
  const authScreen = document.getElementById('auth-screen');
  const charScreen = document.getElementById('character-select-screen');
  if (authScreen) {
    authScreen.classList.remove('hidden');
    authScreen.classList.add('active');
    if (charScreen) {
      charScreen.classList.add('hidden');
      charScreen.classList.remove('active');
    }
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
}

export function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('auth-password-input');
  if (!input) return;
  const val = input.value.trim();
  if (val === 'Sezen99720.') {
    localStorage.setItem('cozystudy_room_pass', val);
    const authScreen = document.getElementById('auth-screen');
    const charScreen = document.getElementById('character-select-screen');
    if (authScreen) {
      authScreen.classList.add('hidden');
      authScreen.classList.remove('active');
    }
    if (charScreen) {
      charScreen.classList.remove('hidden');
      charScreen.classList.add('active');
    }
    if (typeof window !== 'undefined' && window.UI && window.UI.showToast) {
      window.UI.showToast('🌸 Şifre onaylandı! Lütfen karakterini seç.');
    }
  } else {
    showAuthModal('Hatalı şifre! Bu oda sadece Can ve Sezen içindir 💕');
  }
}
