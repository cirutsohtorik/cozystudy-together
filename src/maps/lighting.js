// ========================================================
// CozyStudy: Atmosferik Işıklandırma Modülü
// ========================================================

export function getLightingOverlay(time, weather = 'sunny', customHour = null) {
  let hour = customHour;
  if (hour === null || hour === undefined) {
    if (typeof window !== 'undefined' && window.Game && window.Game.currentHour !== undefined) {
      hour = window.Game.currentHour;
    } else {
      const d = new Date();
      hour = d.getHours() + (d.getMinutes() / 60);
    }
  }

  // Yağmurlu havada ortam daha buğulu ve hafif koyudur
  const isRain = weather === 'rainy';

  // Şafak (06:00 - 08:30): Altın sarısı romantik sabah ışığı
  if (hour >= 6 && hour < 8.5) {
    return isRain ? 'rgba(180, 185, 200, 0.22)' : 'rgba(255, 215, 140, 0.12)';
  }
  // Gündüz (08:30 - 16:30): Doğal gün ışığı (yağmurda hafif gri-mavi serinlik)
  if (hour >= 8.5 && hour < 16.5) {
    return isRain ? 'rgba(70, 95, 130, 0.18)' : 'rgba(255, 255, 255, 0)';
  }
  // Gün Batımı (16:30 - 19:30): Sıcak kehribar & pembe tonlar (Stardew Gün Batımı)
  if (hour >= 16.5 && hour < 19.5) {
    return isRain ? 'rgba(150, 80, 90, 0.25)' : 'rgba(235, 120, 60, 0.18)';
  }
  // Gece (19:30 - 06:00): Derin huzurlu gece mavisi & ay ışığı
  return isRain ? 'rgba(10, 14, 38, 0.52)' : 'rgba(18, 22, 54, 0.38)';
}
