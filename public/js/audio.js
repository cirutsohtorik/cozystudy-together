// ========================================================
// CozyStudy: Doğal Ambiyans & Efekt Ses Motoru (Web Audio API)
// Sınıf: Hafif yağmur sesi
// Bahçe: Ağır yağmur sesi
// Kafe: Akustik lofi gitar tınıları (kısık, sıcak, huzurlu)
// ZİL SESİ KESİNLİKLE YOKTUR (Kullanıcı tercihi).
// ========================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentRoom = null;
    this.ambienceGain = null;
    this.activeNodes = [];
    this.guitarLoopTimer = null;
    this.rainDropletTimer = null;
    this.isRaining = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(this.muted ? 0 : this.getRoomVolume(this.currentRoom), this.ctx.currentTime);
    }
    return this.muted;
  }

  getRoomVolume(room) {
    if (room === 'cafe') return 0.07; // Kısık, huzurlu akustik lofi gitar
    if (room === 'garden') return 0.16; // Bahçede açık hava yağmur veya kuşlar
    if (room === 'campus_path') return 0.14; // Kampüs esintisi & ağaçlar
    if (room === 'dorm') return 0.06; // Yurt odası sıcak sakinlik
    return 0.09; // Sınıfta pencere arkasından kütüphane mevcudiyeti
  }

  // ========================================================
  // Mekana & Hava Durumuna Özel Ambiyans Yöneticisi
  // ========================================================
  setRoomAmbience(roomKey, weather = null) {
    this.init();
    const curWeather = weather || (typeof Game !== 'undefined' && Game.weather?.type) || 'sunny';
    if (this.currentRoom === roomKey && this.currentWeather === curWeather && this.activeNodes.length > 0) return;
    this.currentRoom = roomKey;
    this.currentWeather = curWeather;
    this.stopAmbience();

    if (this.muted) return;

    if (roomKey === 'classroom') {
      this.startClassroomAmbience();
    } else if (roomKey === 'dorm') {
      this.startDormAmbience();
    } else if (roomKey === 'garden' || roomKey === 'campus_path') {
      if (curWeather === 'rainy') {
        this.startHeavyRainSound();
      } else {
        this.startGardenBreeze();
      }
    } else if (roomKey === 'cafe') {
      this.startCafeLofiGuitar();
    }
    this.startAmbientDetailLoop(roomKey);
  }

  stopAmbience() {
    if (this.guitarLoopTimer) {
      clearInterval(this.guitarLoopTimer);
      this.guitarLoopTimer = null;
    }
    if (this.rainDropletTimer) {
      clearInterval(this.rainDropletTimer);
      this.rainDropletTimer = null;
    }
    if (this.detailTimer) {
      clearInterval(this.detailTimer);
      this.detailTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.ambienceGain = null;
  }

  // ========================================================
  // 1. Sınıf / Kütüphane: Huzurlu Kütüphane Ambiyansı
  // (Pencere arkasında sakin oda mevcudiyeti, yağmur sesi YOK)
  // ========================================================
  startClassroomAmbience() {
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.01 * white)) / 1.01;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Kütüphane odası sıcak filtreleme (Lowpass 280Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : 0.05;
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, filter, this.ambienceGain);
    } catch (e) {
      console.warn('Classroom audio error:', e);
    }
  }

  // ========================================================
  // Bahçe: Güneşli / Sakin Rüzgar ve Kuş Sesleri (Yağmur Yoksa)
  // ========================================================
  startGardenBreeze() {
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.Q.value = 0.8;

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, filter, this.ambienceGain);
    } catch (e) {}
  }

  playGentleDrop() {
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      const freq = 1200 + Math.random() * 600;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.05);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // ========================================================
  // 2. Bahçe: Ağır Yağmur Sesi
  // (Açık hava yoğun sağanak, zemin su sıçramaları & esinti)
  // ========================================================
  startHeavyRainSound() {
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Daha yoğun, zengin yağmur gürültüsü
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4 + (Math.random() > 0.98 ? (Math.random() * 2 - 1) * 0.6 : 0);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Geniş frekanslı açık hava filtresi (Lowpass 1600Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, this.ctx.currentTime);

      // Gövde katan bandpass (su sesi rezonansı)
      const midFilter = this.ctx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      midFilter.gain.value = 4.0;
      midFilter.Q.value = 1.2;

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : this.getRoomVolume('garden');
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(midFilter);
      midFilter.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, midFilter, filter, this.ambienceGain);

      // Yoğun su damlası ve çardak saçak damlaları
      this.rainDropletTimer = setInterval(() => {
        if (this.muted) return;
        this.playHeavyDropSplat();
      }, 400);
    } catch (e) {
      console.warn('Heavy rain audio error:', e);
    }
  }

  playHeavyDropSplat() {
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      const freq = 350 + Math.random() * 500;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // ========================================================
  // 3. Kafe: Akustik Lofi Gitar Sesi (Kısık Derecede, Sıcak & Huzurlu)
  // Karplus-Strong / Sıcak Telli Gitar sentezi ile 4 Akorluk Lofi Döngüsü:
  // Cmaj9 -> Am9 -> Dm9 -> G13 (Warm Cozy Lo-Fi Progression)
  // ========================================================
  startCafeLofiGuitar() {
    try {
      // 1. Çok hafif sıcak oda uğultusu
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.02;
      }
      const roomNoise = this.ctx.createBufferSource();
      roomNoise.buffer = buffer;
      roomNoise.loop = true;
      const roomFilter = this.ctx.createBiquadFilter();
      roomFilter.type = 'lowpass';
      roomFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
      const roomGain = this.ctx.createGain();
      roomGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      roomNoise.connect(roomFilter);
      roomFilter.connect(roomGain);
      roomGain.connect(this.ctx.destination);
      roomNoise.start();
      this.ambienceGain = roomGain;
      this.activeNodes.push(roomNoise, roomFilter, roomGain);

      // 2. Akustik Lofi Gitar Arpej Döngüsü
      // Akorlar (Hz):
      // Cmaj9: C3 (130.81), G3 (196.00), B3 (246.94), E4 (329.63), D4 (293.66)
      // Am9:   A2 (110.00), E3 (164.81), G3 (196.00), C4 (261.63), B3 (246.94)
      // Dm9:   D3 (146.83), A3 (220.00), C4 (261.63), F4 (349.23), E4 (329.63)
      // G13:   G2 (98.00),  F3 (174.61), B3 (246.94), E4 (329.63), D4 (293.66)
      const chords = [
        [130.81, 196.00, 246.94, 329.63, 293.66], // Cmaj9
        [110.00, 164.81, 196.00, 261.63, 246.94], // Am9
        [146.83, 220.00, 261.63, 349.23, 329.63], // Dm9
        [98.00,  174.61, 246.94, 329.63, 293.66]  // G13
      ];

      let chordIndex = 0;
      let noteInChordIndex = 0;

      // İlk akoru hemen çal
      this.playPluckedGuitarNote(chords[chordIndex][noteInChordIndex]);
      noteInChordIndex++;

      // Arpej adımları (her 500 ms'de bir parmak vuruşu)
      this.guitarLoopTimer = setInterval(() => {
        if (this.muted) return;

        const currentNotes = chords[chordIndex];
        const freq = currentNotes[noteInChordIndex % currentNotes.length];
        this.playPluckedGuitarNote(freq);

        noteInChordIndex++;
        // Her 5 notada bir sonraki akora geç (2.5 saniyede bir akor değişimi)
        if (noteInChordIndex >= currentNotes.length) {
          noteInChordIndex = 0;
          chordIndex = (chordIndex + 1) % chords.length;
        }
      }, 520);

    } catch (e) {
      console.warn('Cafe lofi guitar error:', e);
    }
  }

  // Akustik Tel Sentezleyicisi (Sıcak plucked acoustic guitar note)
  playPluckedGuitarNote(frequency) {
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Ana harmonik osilatörü (Triangle dalgası - yumuşak tel tınısı)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(frequency, now);

      // Çok hafif lofi kaset pitch-drift (wow & flutter)
      const drift = (Math.random() - 0.5) * 1.5;
      osc1.detune.setValueAtTime(drift, now);

      // 2. Hafif parlaklık katan zayıf 2. harmonik
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, now);

      // Akustik gitar gövdesi simülasyonu: Dinamik Lowpass Filtresi
      // Başta tele vurulduğunda 1800Hz, hızla 600Hz'e düşer (doğal tel sönümü)
      const bodyFilter = this.ctx.createBiquadFilter();
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(1800, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(550, now + 0.35);

      // Zarf (Pluck Envelope): Hızlı atak (12ms), doğal uzun sönüm (1.8s)
      const noteGain = this.ctx.createGain();
      const baseVol = 0.055; // Kısık, huzurlu tını
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(baseVol, now + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(baseVol * 0.4, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc1.connect(bodyFilter);
      osc2.connect(bodyFilter);
      bodyFilter.connect(noteGain);
      noteGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.85);
      osc2.stop(now + 1.85);
    } catch (e) {}
  }

  // ========================================================
  // Efekt Sesleri (Etkileşimler)
  // ========================================================
  playPurr() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }

  playStep() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playSit() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(170, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playHug() {
    if (this.muted || !this.ctx) return;
    try {
      const notes = [392, 523.25]; // G4 -> C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = this.ctx.currentTime + (idx * 0.12);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {}
  }

  playPaper() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playDoor() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // ========================================================
  // ASMR & Cozy Ortam Mikro Sesleri
  // ========================================================
  playPageTurn() {
    if (this.muted || !this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playCupChime() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime); // A6 seramik çınlaması
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playWindChime() {
    if (this.muted || !this.ctx) return;
    try {
      const freqs = [880, 1046.5, 1318.5]; // A5, C6, E6
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  // ========================================================
  // 4. Yurt Odası Ambiyansı: Sıcak Oda Sakinliği & Çay Kettle Fısıltısı
  // ========================================================
  startDormAmbience() {
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.008 * white)) / 1.01;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : 0.045;
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, filter, this.ambienceGain);
    } catch (e) {
      console.warn('Dorm audio error:', e);
    }
  }

  // ========================================================
  // Yeni Etkileşim & Eşya Sesleri
  // ========================================================
  playDoorLocked() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.10);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.10);
    } catch (e) {}
  }

  playCoinToss() {
    if (this.muted || !this.ctx) return;
    try {
      // 1. Metalik para sesi
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1900, now);
      osc1.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // 2. Suya düşme 'Plop' sesi
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(380, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.26);
      gain2.gain.setValueAtTime(0.06, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.26);
    } catch (e) {}
  }

  playSip() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playSnapshot() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Deklanşör & ayna sesi 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(850, now);
      osc1.frequency.exponentialRampToValueAtTime(280, now + 0.04);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      // Deklanşör kapanma sesi 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(420, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(160, now + 0.11);
      gain2.gain.setValueAtTime(0.06, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.11);
    } catch (e) {}
  }

  setRadioStation(stationName) {
    this.currentRadioStation = stationName;
    if (this.muted || !this.ctx) return;
    this.playStationJingle(stationName);
  }

  playStationJingle(stationName) {
    if (!this.ctx || this.muted) return;
    this.init();
    const chords = {
      'Lofi Dreams': [261.63, 329.63, 392.00, 493.88], // Cmaj7
      'Cozy Coffee Bar': [220.00, 261.63, 329.63, 392.00], // Am7
      'Rainy Window Beats': [174.61, 220.00, 261.63, 329.63], // Fmaj7
      'Midnight Library': [196.00, 246.94, 293.66, 369.99], // Gmaj7
      'Forest Whispers': [220.00, 277.18, 329.63, 415.30] // A maj7
    };
    const notes = chords[stationName] || chords['Lofi Dreams'];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.25);
        } catch (e) {}
      }, idx * 160);
    });
  }

  startAmbientDetailLoop(roomKey) {
    if (this.detailTimer) clearInterval(this.detailTimer);
    this.detailTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      if (roomKey === 'classroom') {
        this.playPageTurn();
      } else if (roomKey === 'cafe') {
        this.playCupChime();
      } else if (roomKey === 'garden' || roomKey === 'campus_path') {
        this.playWindChime();
      } else if (roomKey === 'dorm') {
        this.playPageTurn();
      }
    }, 28000 + Math.random() * 15000); // 28-43 saniyede bir sakin mikro ses
  }
}

window.soundFX = new SoundFX();
