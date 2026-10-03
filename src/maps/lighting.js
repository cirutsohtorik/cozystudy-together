// ========================================================
// CozyStudy: Atmosferik Işıklandırma Modülü
// ========================================================

export function getLightingOverlay(time, weather = 'sunny', customHour = null, currentRoom = null) {
  let hour = customHour;
  if (hour === null || hour === undefined) {
    if (typeof window !== 'undefined' && window.Game && window.Game.currentHour !== undefined) {
      hour = window.Game.currentHour;
    } else {
      const d = new Date();
      hour = d.getHours() + (d.getMinutes() / 60);
    }
  }

  const room = currentRoom || (typeof window !== 'undefined' && window.Game ? window.Game.currentRoom : null);
  const isIndoor = ['dorm', 'classroom', 'cafe'].includes(room);
  const weatherType = (typeof weather === 'object' && weather) ? weather.type : weather;
  // İç mekanlarda yağmur/sis filtresi uygulanmaz (isIndoor koruması)
  const isRain = !isIndoor && weatherType === 'rainy';

  // 1. Gündoğumu (05:30 - 08:00): Sıcak altın-şeftali
  if (hour >= 5.5 && hour < 8.0) {
    return isRain ? 'rgba(180, 185, 205, 0.20)' : 'rgba(255, 205, 150, 0.14)';
  }
  // 2. Gündüz (08:00 - 11:30): Taze doğal gün ışığı
  if (hour >= 8.0 && hour < 11.5) {
    return isRain ? 'rgba(120, 140, 170, 0.16)' : 'rgba(255, 255, 255, 0)';
  }
  // 3. Öğlen (11:30 - 15:30): Parlak tepe berraklığı
  if (hour >= 11.5 && hour < 15.5) {
    return isRain ? 'rgba(100, 125, 155, 0.18)' : 'rgba(255, 250, 230, 0.05)';
  }
  // 4. Günbatımı (15:30 - 19:30): Sıcak kehribar & kızıl altın
  if (hour >= 15.5 && hour < 19.5) {
    return isRain ? 'rgba(140, 75, 95, 0.24)' : 'rgba(235, 115, 55, 0.20)';
  }
  // 5. Gece (19:30 - 05:30): Derin huzurlu gece mavisi & ay ışığı
  return isRain ? 'rgba(8, 12, 32, 0.52)' : 'rgba(16, 20, 50, 0.40)';
}

export function renderDynamicWindowView(ctx, wx, wy, w, h, time, customHour = null, weather = 'sunny') {
  let hour = customHour;
  if (hour === null || hour === undefined) {
    if (typeof window !== 'undefined' && window.Game && window.Game.currentHour !== undefined) {
      hour = window.Game.currentHour;
    } else {
      const d = new Date();
      hour = d.getHours() + (d.getMinutes() / 60);
    }
  }

  const curWeather = typeof weather === 'object' && weather ? weather.type : weather;

  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, w, h);
  ctx.clip();

  // 1. 5 Aşamalı Gökyüzü Degradesi
  const grad = ctx.createLinearGradient(wx, wy, wx, wy + h);
  if (hour >= 5.5 && hour < 8.0) {
    grad.addColorStop(0, '#7eb6d9');
    grad.addColorStop(0.5, '#fbc490');
    grad.addColorStop(1, '#ff9e79');
  } else if (hour >= 8.0 && hour < 11.5) {
    grad.addColorStop(0, '#5fa8e0');
    grad.addColorStop(1, '#a6dcef');
  } else if (hour >= 11.5 && hour < 15.5) {
    grad.addColorStop(0, '#4293d8');
    grad.addColorStop(1, '#bfe9ff');
  } else if (hour >= 15.5 && hour < 19.5) {
    grad.addColorStop(0, '#4a2559');
    grad.addColorStop(0.5, '#c75248');
    grad.addColorStop(1, '#f99f48');
  } else {
    grad.addColorStop(0, '#0a0f24');
    grad.addColorStop(1, '#162044');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(wx, wy, w, h);

  // 2. Gök Cisimleri (Güneş, Ay, Yıldızlar)
  const isNight = hour >= 19.5 || hour < 5.5;
  if (isNight) {
    ctx.fillStyle = '#fef08a';
    const starSeeds = [[8, 10], [28, 6], [16, 22], [36, 18], [24, 32], [42, 30]];
    starSeeds.forEach(([sx, sy]) => {
      const px = wx + (sx % w);
      const py = wy + (sy % h);
      const twinkle = Math.sin(time * 0.003 + sx) > 0.2 ? 1 : 0.5;
      ctx.globalAlpha = twinkle;
      ctx.fillRect(px, py, 1.5, 1.5);
    });
    ctx.globalAlpha = 1.0;

    const moonX = wx + w - 12;
    const moonY = wy + 10;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#162044';
    ctx.beginPath();
    ctx.arc(moonX - 2, moonY - 1, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (curWeather === 'sunny') {
    const sunX = (hour >= 5.5 && hour < 8.0) ? wx + 12 : ((hour >= 15.5) ? wx + w - 12 : wx + w / 2);
    const sunY = (hour >= 11.5 && hour < 15.5) ? wy + 8 : wy + 14;
    ctx.fillStyle = 'rgba(255, 235, 140, 0.35)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Cam Üzeri Dinamik Hava Durumu Efektleri
  if (curWeather === 'cloudy') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    const cloudOffset1 = (time * 0.008) % (w + 40) - 20;
    const cloudOffset2 = (time * 0.005 + 25) % (w + 40) - 20;
    ctx.fillRect(wx + cloudOffset1, wy + 8, 14, 5);
    ctx.fillRect(wx + cloudOffset1 + 3, wy + 5, 8, 4);
    ctx.fillRect(wx + cloudOffset2, wy + 18, 18, 6);
    ctx.fillRect(wx + cloudOffset2 + 4, wy + 15, 10, 4);
  } else if (curWeather === 'rainy') {
    ctx.fillStyle = 'rgba(80, 100, 130, 0.30)';
    ctx.fillRect(wx, wy, w, h);

    ctx.fillStyle = 'rgba(200, 225, 255, 0.45)';
    for (let r = 0; r < 5; r++) {
      const rx = wx + ((r * 11 + time * 0.03) % w);
      const ry = wy + ((time * 0.08 + r * 15) % h);
      ctx.fillRect(rx, ry, 1, 5);
    }

    for (let d = 0; d < 4; d++) {
      const dropSpeed = 8 + (d * 4);
      const dropY = wy + ((time * 0.001 * dropSpeed + d * 13) % h);
      const dropX = wx + 6 + (d * 10);
      ctx.fillStyle = 'rgba(220, 240, 255, 0.40)';
      ctx.fillRect(dropX, dropY - 3, 1, 3);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
      ctx.fillRect(dropX, dropY, 1.5, 1.5);
    }
  } else if (curWeather === 'snowy') {
    ctx.fillStyle = 'rgba(215, 225, 245, 0.25)';
    ctx.fillRect(wx, wy, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let s = 0; s < 6; s++) {
      const sfY = wy + ((time * 0.015 + s * 11) % h);
      const sfX = wx + ((s * 9 + Math.sin(time * 0.002 + s * 2) * 5 + 50) % w);
      ctx.fillRect(sfX, sfY, 1.5, 1.5);
    }
  }

  ctx.restore();
}
