// ========================================================
// CozyStudy: Doğal Ambiyans & Efekt Ses Motoru (Web Audio API)
// Sınıf: Hafif kütüphane ambiyansı
// Bahçe: Rüzgar veya yağmur sesi
// Kafe: Akustik lofi gitar tınıları
// Yurt: Sıcak huzurlu ortam
// ========================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentRoom = null;
    this.currentWeather = null;
    this.ambienceGain = null;
    this.activeNodes = [];
    this.guitarLoopTimer = null;
    this.rainDropletTimer = null;
    this.detailTimer = null;
    this.isRaining = true;

    // Lofi Sentetik Radyo Durumu
    this.radioGain = null;
    this.radioLoopTimer = null;
    this.currentRadioStation = 'Lofi Dreams';
    this.radioActiveNodes = [];
    this.radioStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setValueAtTime(this.muted ? 0 : this.getRoomVolume(this.currentRoom), this.ctx.currentTime);
    }
    if (this.radioGain && this.ctx) {
      this.radioGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);
    }
    return this.muted;
  }

  getRoomVolume(room) {
    if (room === 'cafe') return 0.07;
    if (room === 'garden') return 0.16;
    if (room === 'campus_path') return 0.14;
    if (room === 'dorm') return 0.06;
    return 0.09;
  }

  setRoomAmbience(roomKey, weather = null) {
    this.init();
    const curWeather = weather || (typeof window !== 'undefined' && window.Game && window.Game.weather?.type) || 'sunny';
    if (this.currentRoom === roomKey && this.currentWeather === curWeather && this.activeNodes.length > 0) return;
    this.currentRoom = roomKey;
    this.currentWeather = curWeather;
    this.stopAmbience();

    if (this.muted || !this.ctx) return;

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

  startClassroomAmbience() {
    if (!this.ctx) return;
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

  startGardenBreeze() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : 0.08;
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, filter, this.ambienceGain);
    } catch (e) {
      console.warn('Garden audio error:', e);
    }
  }

  startHeavyRainSound() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);

      const peakFilter = this.ctx.createBiquadFilter();
      peakFilter.type = 'peaking';
      peakFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      peakFilter.gain.setValueAtTime(4, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : 0.14;
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(lowFilter);
      lowFilter.connect(peakFilter);
      peakFilter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, lowFilter, peakFilter, this.ambienceGain);

      this.rainDropletTimer = setInterval(() => {
        if (!this.muted && Math.random() > 0.4) {
          this.playHeavyDropSplat();
        }
      }, 250);
    } catch (e) {
      console.warn('Heavy rain audio error:', e);
    }
  }

  playHeavyDropSplat() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const f = 250 + Math.random() * 350;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  startDormAmbience() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (last + (0.012 * (Math.random() * 2 - 1))) / 1.015;
        last = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      const vol = this.muted ? 0 : 0.05;
      this.ambienceGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);

      noise.start();
      this.activeNodes.push(noise, filter, this.ambienceGain);
    } catch (e) {}
  }

  startCafeLofiGuitar() {
    if (!this.ctx) return;
    try {
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj9
        [220.00, 261.63, 329.63, 440.00], // Am9
        [293.66, 349.23, 440.00, 523.25], // Dm9
        [196.00, 246.94, 293.66, 392.00]  // G13
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (this.muted || !this.ctx) return;
        const currentChord = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        currentChord.forEach((freq, idx) => {
          setTimeout(() => {
            if (this.muted || !this.ctx || this.currentRoom !== 'cafe') return;
            this.playLofiPluck(freq);
          }, idx * 280);
        });
      };

      playChord();
      this.guitarLoopTimer = setInterval(playChord, 3800);
    } catch (e) {}
  }

  playLofiPluck(freq) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.4);
    } catch (e) {}
  }

  startAmbientDetailLoop(roomKey) {
    if (this.detailTimer) clearInterval(this.detailTimer);
    this.detailTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      if (roomKey === 'cafe' && Math.random() > 0.6) {
        this.playCupChime();
      } else if (roomKey === 'classroom' && Math.random() > 0.7) {
        this.playPageTurn();
      } else if (roomKey === 'garden' && Math.random() > 0.6) {
        this.playWindChime();
      }
    }, 12000);
  }

  // Efektler
  playPop() {
    this.playTone(420, 0.08, 'sine', 0.05);
  }

  playPurr() {
    this.playTone(85, 0.35, 'sawtooth', 0.04);
  }

  playHug() {
    this.playTone(330, 0.25, 'triangle', 0.06);
  }

  playStep() {
    this.playTone(140, 0.04, 'triangle', 0.02);
  }

  playSit() {
    this.playTone(220, 0.12, 'sine', 0.04);
  }

  playPaper() {
    this.playTone(600, 0.06, 'triangle', 0.03);
  }

  playPageTurn() {
    this.playTone(520, 0.08, 'sine', 0.02);
  }

  playCupChime() {
    this.playTone(880, 0.4, 'sine', 0.02);
  }

  playWindChime() {
    this.playTone(1046.5, 0.6, 'sine', 0.015);
  }

  playDoor() {
    this.playTone(180, 0.2, 'sine', 0.04);
  }

  playDoorLocked() {
    this.playTone(120, 0.15, 'square', 0.03);
  }

  playCoinToss() {
    this.playTone(987.77, 0.3, 'sine', 0.04);
  }

  playSip() {
    this.playTone(350, 0.12, 'triangle', 0.03);
  }

  playSnapshot() {
    this.playTone(1200, 0.05, 'square', 0.04);
  }

  initRadioGain() {
    if (!this.radioGain && this.ctx) {
      this.radioGain = this.ctx.createGain();
      this.radioGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);
      this.radioGain.connect(this.ctx.destination);
    }
  }

  stopRadioNodes() {
    this.radioActiveNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.radioActiveNodes = [];
  }

  stopRadio() {
    if (this.radioLoopTimer) {
      clearInterval(this.radioLoopTimer);
      this.radioLoopTimer = null;
    }
    this.stopRadioNodes();
  }

  setRadioStation(stationName) {
    this.init();
    this.initRadioGain();
    const isStationChange = this.currentRadioStation !== stationName;
    this.currentRadioStation = stationName;

    if (!this.ctx) return;

    if (this.radioLoopTimer && isStationChange && this.radioGain) {
      // 0.4s yumuşak crossfade geçişi
      const now = this.ctx.currentTime;
      this.radioGain.gain.setValueAtTime(this.radioGain.gain.value, now);
      this.radioGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        if (this.radioLoopTimer) {
          clearInterval(this.radioLoopTimer);
          this.radioLoopTimer = null;
        }
        this.stopRadioNodes();
        this.radioStep = 0;
        if (!this.muted && this.ctx && this.radioGain) {
          this.radioGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          this.radioGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.3);
        }
        this.startRadioLoop();
      }, 400);
    } else {
      if (!this.radioLoopTimer) {
        this.radioStep = 0;
        this.startRadioLoop();
      }
    }
  }

  startRadioLoop() {
    this.stopRadio();
    this.playStationMeasure();
    // Her 3.8 saniyede bir yeni ölçü (chord loop)
    this.radioLoopTimer = setInterval(() => {
      if (this.ctx && this.ctx.state === 'running') {
        this.playStationMeasure();
      }
    }, 3800);
  }

  playStationMeasure() {
    if (!this.ctx || this.muted) return;
    this.initRadioGain();
    const station = this.currentRadioStation || 'Lofi Dreams';
    const step = this.radioStep % 4;
    this.radioStep++;

    const now = this.ctx.currentTime;

    // 5 Ayrı Sentetik Çok Sesli İstasyon
    if (station === 'Lofi Dreams') {
      // Cmaj9 – Am9 – Dm9 – G13
      const chords = [
        { bass: 65.41, notes: [164.81, 196.00, 246.94, 293.66] }, // Cmaj9
        { bass: 55.00, notes: [130.81, 164.81, 196.00, 246.94] }, // Am9
        { bass: 73.42, notes: [174.61, 220.00, 261.63, 329.63] }, // Dm9
        { bass: 49.00, notes: [174.61, 246.94, 329.63, 392.00] }  // G13
      ];
      const cur = chords[step];
      cur.notes.forEach((freq, idx) => {
        this.synthVoice(freq, now + (idx * 0.04), 3.4, 'triangle', 850, 0.045);
        this.synthVoice(freq * 0.5, now + (idx * 0.04), 3.4, 'sine', 600, 0.025);
      });
      this.synthBass(cur.bass, now, 3.2, 0.08);
      this.synthVinylTick(now + 0.1);
      this.synthVinylTick(now + 1.9);

    } else if (station === 'Cozy Coffee Bar') {
      // Akustik Caz Arpeji: Fmaj7 – Em7 – Dm7 – Cmaj7
      const chords = [
        { bass: 87.31, notes: [220.00, 261.63, 329.63, 392.00] }, // Fmaj7
        { bass: 82.41, notes: [196.00, 246.94, 293.66, 369.99] }, // Em7
        { bass: 73.42, notes: [174.61, 220.00, 261.63, 329.63] }, // Dm7
        { bass: 65.41, notes: [164.81, 196.00, 246.94, 293.66] }  // Cmaj7
      ];
      const cur = chords[step];
      this.synthBass(cur.bass, now, 3.4, 0.07);
      cur.notes.forEach((freq, i) => {
        this.synthPluck(freq, now + (i * 0.42), 2.2, 1200, 0.055);
      });

    } else if (station === 'Rainy Window Beats') {
      // Dm9 – Bbmaj7 – Gm9 – A7b13
      const chords = [
        { bass: 73.42, notes: [174.61, 220.00, 261.63, 329.63] }, // Dm9
        { bass: 58.27, notes: [146.83, 174.61, 220.00, 261.63] }, // Bbmaj7
        { bass: 49.00, notes: [233.08, 293.66, 349.23, 440.00] }, // Gm9
        { bass: 55.00, notes: [196.00, 277.18, 329.63, 349.23] }  // A7b13
      ];
      const cur = chords[step];
      this.synthBass(cur.bass, now, 3.2, 0.075);
      cur.notes.forEach(freq => {
        this.synthVoice(freq, now, 2.9, 'sine', 700, 0.04);
        this.synthVoice(freq * 1.002, now + 0.02, 2.8, 'triangle', 750, 0.03);
      });
      [0.0, 0.95, 1.9, 2.85].forEach(offset => {
        this.synthHiHat(now + offset);
      });

    } else if (station === 'Midnight Library') {
      // Yavaş ataklı (1.2s) pad akorları ve kristal çan
      const pads = [
        { pad: [146.83, 220.00, 277.18, 329.63], chime: 739.99 },
        { pad: [123.47, 185.00, 246.94, 293.66], chime: 587.33 },
        { pad: [98.00, 146.83, 196.00, 246.94], chime: 987.77 },
        { pad: [110.00, 164.81, 220.00, 277.18], chime: 659.25 }
      ];
      const cur = pads[step];
      cur.pad.forEach(freq => {
        this.synthSlowPad(freq, now, 3.6, 0.038);
      });
      this.synthCelesteChime(cur.chime, now + 1.2, 2.4, 0.032);

    } else if (station === 'Forest Whispers') {
      // Kalimba / Tahta pentatonik melodiler
      const pentatonicScales = [
        [164.81, 196.00, 220.00, 293.66, 329.63],
        [196.00, 220.00, 246.94, 329.63, 392.00],
        [146.83, 164.81, 220.00, 246.94, 293.66],
        [130.81, 196.00, 220.00, 261.63, 329.63]
      ];
      const scale = pentatonicScales[step];
      this.synthBass(scale[0] * 0.5, now, 3.4, 0.06);
      [0.0, 0.6, 1.4, 2.2, 3.0].forEach((timing, i) => {
        const note = scale[i % scale.length];
        this.synthKalimba(note, now + timing, 1.8, 0.048);
      });
    }
  }

  synthVoice(freq, startTime, duration, type, filterFreq, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthBass(freq, startTime, duration, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthPluck(freq, startTime, duration, filterFreq, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreq, startTime);
      filter.Q.setValueAtTime(2.0, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthSlowPad(freq, startTime, duration, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthCelesteChime(freq, startTime, duration, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthKalimba(freq, startTime, duration, volume) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.Q.setValueAtTime(4.0, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  synthHiHat(startTime) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6000, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.radioGain);

      whiteNoise.start(startTime);
      this.radioActiveNodes.push(whiteNoise);
    } catch (e) {}
  }

  synthVinylTick(startTime) {
    if (!this.ctx || !this.radioGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, startTime);

      gain.gain.setValueAtTime(0.008, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.02);

      osc.connect(gain);
      gain.connect(this.radioGain);

      osc.start(startTime);
      osc.stop(startTime + 0.025);
      this.radioActiveNodes.push(osc);
    } catch (e) {}
  }

  playTone(freq, duration, type = 'sine', vol = 0.05) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
}

window.soundFX = new SoundFX();
