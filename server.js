const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Kalıcı İlerleme Dosyası Yolu
const DATA_DIR = path.join(__dirname, 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// İlerleme Verisini Yükle / Başlat
function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Progress okuma hatası:', err);
  }
  return {
    totalStudyMinutes: 0,
    cozyHearts: 10,
    currentStreak: 1,
    lastStudyDate: new Date().toISOString().split('T')[0],
    unlockedDecors: ['plant_monstera'],
    notes: [
      {
        id: 'note_welcome',
        sender: 'Can & Sezen',
        text: 'Birlikte çalışma dünyamıza hoş geldiniz! Birbirinize notlar bırakabilirsiniz ❤️',
        date: 'Bugün',
        room: 'classroom'
      }
    ]
  };
}

function saveProgress(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = PROGRESS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, PROGRESS_FILE);
  } catch (err) {
    console.error('Progress kaydetme hatası:', err);
    try {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }
}

let persistentProgress = loadProgress();

// Oyuncu slotları ve durumları
const slots = {
  Can: { occupied: false, socketId: null },
  Sezen: { occupied: false, socketId: null }
};

const players = {};

// Kedi Durumu (Kafede dolaşan Kedi Pamuk 🐾)
const cat = {
  name: 'Pamuk',
  room: 'cafe',
  x: 180,
  y: 290,
  state: 'sleeping', // 'sleeping', 'sitting', 'purring'
  lastPurrTime: 0
};

// Yerel IP Bul
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Can & Sezen Özel Oda Şifresi
const ROOM_PASSWORD = process.env.ROOM_PASSWORD || 'Sezen99720.';

// Dinamik Hava Durumu Sistemi (Güneşli, Yağmurlu, Bulutlu)
const weatherStates = [
  { type: 'sunny', temp: '22°C', label: 'Güneşli & Ilık ☀️' },
  { type: 'sunny', temp: '24°C', label: 'Açık Gökyüzü 🌤️' },
  { type: 'rainy', temp: '17°C', label: 'Tatlı Yağmurlu 🌧️' },
  { type: 'cloudy', temp: '19°C', label: 'Hafif Esintili ⛅' }
];
let currentWeatherIndex = 0;
let currentWeather = weatherStates[0];

setInterval(() => {
  currentWeatherIndex = (currentWeatherIndex + 1) % weatherStates.length;
  currentWeather = weatherStates[currentWeatherIndex];
  io.emit('weather_sync', currentWeather);
}, 4 * 60 * 1000); // 4 dakikada bir hava durumu döngüsü

io.on('connection', (socket) => {
  console.log(`[+] Oyuncu bağlandı: ${socket.id}`);

  // Başlangıç slot ve progress verilerini gönder
  socket.emit('slots_update', {
    Can: slots.Can.occupied,
    Sezen: slots.Sezen.occupied
  });
  socket.emit('progress_sync', persistentProgress);
  socket.emit('cat_sync', cat);
  socket.emit('weather_sync', currentWeather);

  // Karakter Seçimi (Şifre Korumalı)
  socket.on('choose_character', ({ characterName, password }) => {
    if (password !== ROOM_PASSWORD) {
      return socket.emit('auth_error', 'Özel oda şifresi hatalı! Bu alan sadece Can & Sezen içindir 💕');
    }

    if (!['Can', 'Sezen'].includes(characterName)) {
      return socket.emit('error_message', 'Geçersiz karakter.');
    }

    if (slots[characterName].occupied && slots[characterName].socketId !== socket.id) {
      const existingSocket = io.sockets.sockets.get(slots[characterName].socketId);
      if (!existingSocket || !existingSocket.connected) {
        slots[characterName].occupied = false;
        slots[characterName].socketId = null;
      } else {
        return socket.emit('character_taken', { characterName });
      }
    }

    if (players[socket.id]) {
      const prevName = players[socket.id].name;
      if (slots[prevName]) {
        slots[prevName].occupied = false;
        slots[prevName].socketId = null;
      }
    }

    slots[characterName].occupied = true;
    slots[characterName].socketId = socket.id;

    players[socket.id] = {
      id: socket.id,
      name: characterName,
      room: 'dorm', // Oyuncu kendi yurt odasında başlar!
      x: characterName === 'Can' ? 160 : 440,
      y: 200,
      direction: 'down',
      isMoving: false,
      isSitting: false,
      isSleeping: false,
      isHugging: false,
      tableId: null,
      studyTopic: '',
      studyMode: 'stopwatch', // 'stopwatch' veya 'pomodoro'
      pomodoroDuration: 25 * 60, // 25 dk
      studyStartTime: null,
      isPaused: false,
      heldItem: null, // { id, name, icon, startTime, duration }
      selectedSubject: 'general'
    };

    io.emit('slots_update', {
      Can: slots.Can.occupied,
      Sezen: slots.Sezen.occupied
    });

    socket.emit('character_confirmed', players[socket.id]);
    io.emit('players_sync', players);
  });

  // Hareket
  socket.on('player_move', (moveData) => {
    const player = players[socket.id];
    if (!player) return;

    player.x = moveData.x;
    player.y = moveData.y;
    player.direction = moveData.direction;
    player.isMoving = moveData.isMoving;
    player.isHugging = false;
    if (moveData.isMoving) {
      player.isSleeping = false; // Hareket edince uyku bozulur
    }

    socket.broadcast.emit('player_moved', {
      id: socket.id,
      name: player.name,
      x: player.x,
      y: player.y,
      direction: player.direction,
      isMoving: player.isMoving,
      isHugging: false,
      isSleeping: player.isSleeping
    });
  });

  // Mekan Değiştirme
  socket.on('change_room', ({ newRoom, spawnX, spawnY }) => {
    const player = players[socket.id];
    if (!player) return;

    // Sınıf Kilit Kontrolü: 08:30 - 16:00 arası ders işlendiğinden sınıf kilitlidir
    if (newRoom === 'classroom') {
      const now = new Date();
      const currentHour = now.getHours() + (now.getMinutes() / 60);
      if (currentHour >= 8.5 && currentHour < 16.0) {
        return socket.emit('system_message', '🔒 Sınıfta şu an ders işleniyor! (08:30 - 16:00 arası kapalıdır, 16:00\'da açılır)');
      }
    }

    player.room = newRoom;
    player.x = spawnX;
    player.y = spawnY;
    player.isSitting = false;
    player.isSleeping = false;
    player.tableId = null;
    player.isHugging = false;

    io.emit('players_sync', players);
    io.emit('system_message', `${player.name} şimdi ${getRoomDisplayName(newRoom)} alanında!`);
  });

  // Sarılma (Hug Action [H])
  socket.on('perform_hug', () => {
    const player = players[socket.id];
    if (!player || player.isSitting || player.isHugging) return;

    // Diğer oyuncuyu bul
    const otherPlayer = Object.values(players).find(p => p.id !== socket.id && p.room === player.room);
    if (!otherPlayer || otherPlayer.isSitting || otherPlayer.isHugging) return;

    const dist = Math.hypot(player.x - otherPlayer.x, player.y - otherPlayer.y);
    if (dist < 48) {
      player.isHugging = true;
      otherPlayer.isHugging = true;
      io.emit('players_sync', players);
      io.emit('hug_event', {
        x: (player.x + otherPlayer.x) / 2,
        y: (player.y + otherPlayer.y) / 2
      });

      // 3 saniye sonra sarılma durur
      setTimeout(() => {
        if (players[player.id]) players[player.id].isHugging = false;
        if (players[otherPlayer.id]) players[otherPlayer.id].isHugging = false;
        io.emit('players_sync', players);
      }, 3000);
    }
  });

  // Kedi Sevme [E]
  socket.on('pet_cat', () => {
    const player = players[socket.id];
    if (!player || player.room !== 'cafe') return;
    if (Date.now() - (cat.lastPurrTime || 0) < 3000) return; // Spam koruması

    cat.state = 'purring';
    cat.lastPurrTime = Date.now();
    io.emit('cat_sync', cat);
    io.emit('cat_purr_event', { playerName: player.name });

    setTimeout(() => {
      cat.state = 'sleeping';
      io.emit('cat_sync', cat);
    }, 4000);
  });

  // Derse Başlama
  socket.on('start_study', ({ tableId, topic, mode }) => {
    const player = players[socket.id];
    if (!player || player.isSitting) return;

    // Tekli masa / Çiftli masa kapasite doğrulaması
    const occupants = Object.values(players).filter(p => p.room === player.room && p.isSitting && p.tableId === tableId);
    const isCouple = tableId && (tableId.includes('couple') || tableId.includes('bench') || tableId.includes('c_table1') || tableId.includes('c_table2'));
    const maxCapacity = isCouple ? 2 : 1;
    if (occupants.length >= maxCapacity) {
      socket.emit('system_message', 'Bu masa veya oturma yeri şu an dolu.');
      return;
    }

    player.isSitting = true;
    player.tableId = tableId;
    player.studyTopic = topic || 'Genel Çalışma';
    player.studyMode = mode || 'stopwatch';
    player.studyStartTime = Date.now();
    player.studyElapsedSeconds = 0;
    player.studyActiveSince = Date.now();
    player.isPaused = false;

    io.emit('players_sync', players);
    io.emit('study_event', {
      type: 'start',
      playerName: player.name,
      tableId,
      topic: player.studyTopic,
      mode: player.studyMode
    });
  });

  // Mola Değişimi
  socket.on('toggle_pause', () => {
    const player = players[socket.id];
    if (!player || !player.isSitting) return;

    const now = Date.now();
    if (!player.isPaused) {
      // Molaya geçiliyor: Çalışılan süreyi dondur / sabitle
      const activeStretch = Math.floor((now - (player.studyActiveSince || now)) / 1000);
      player.studyElapsedSeconds = (player.studyElapsedSeconds || 0) + Math.max(0, activeStretch);
      player.isPaused = true;
    } else {
      // Moladan dönülüyor: Süre kaldığı yerden akmaya başlar
      player.studyActiveSince = now;
      player.isPaused = false;
    }

    io.emit('players_sync', players);
    io.emit('study_event', {
      type: player.isPaused ? 'pause' : 'resume',
      playerName: player.name,
      tableId: player.tableId
    });
  });

  // Çalışmayı Sonlandırma ve Puan/Streak Güncellemesi
  socket.on('end_study', ({ totalSeconds }) => {
    const player = players[socket.id];
    if (!player || !player.isSitting) return;

    const topic = player.studyTopic;
    const baseSeconds = player.studyElapsedSeconds || 0;
    const additional = player.isPaused ? 0 : Math.floor((Date.now() - (player.studyActiveSince || Date.now())) / 1000);
    const sessionDuration = totalSeconds || (baseSeconds + Math.max(0, additional));
    const minutesStudied = Math.floor(sessionDuration / 60);
    const earnedHearts = minutesStudied >= 1 ? minutesStudied : (sessionDuration >= 20 ? 1 : 0);

    // Kalıcı İlerlemeyi Güncelle
    if (earnedHearts >= 1 || sessionDuration >= 20) {
      persistentProgress.totalStudyMinutes += Math.max(1, minutesStudied);
      persistentProgress.cozyHearts += earnedHearts; // 1 dakika = 1 Cozy Kalp

      // Streak Kontrolü
      const today = new Date().toISOString().split('T')[0];
      if (persistentProgress.lastStudyDate !== today) {
        const lastDate = new Date(persistentProgress.lastStudyDate);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          persistentProgress.currentStreak += 1;
        } else if (diffDays > 1) {
          persistentProgress.currentStreak = 1;
        }
        persistentProgress.lastStudyDate = today;
      }

      saveProgress(persistentProgress);
      io.emit('progress_sync', persistentProgress);
    }

    player.isSitting = false;
    player.y += 35; // Masadan kalkıp güvenli koridora adım at
    player.tableId = null;
    player.studyTopic = '';
    player.studyStartTime = null;
    player.studyElapsedSeconds = 0;
    player.studyActiveSince = null;
    player.isPaused = false;

    io.emit('players_sync', players);
    io.emit('study_event', {
      type: 'end',
      playerName: player.name,
      duration: sessionDuration,
      topic,
      earnedHearts: earnedHearts
    });
  });

  // Not Bırakma (Post-It Panosu)
  socket.on('add_note', ({ text, room }) => {
    const player = players[socket.id];
    if (!player || !text) return;

    const newNote = {
      id: 'note_' + Date.now(),
      sender: player.name,
      text: text.trim().substring(0, 140),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      room: room || player.room
    };

    persistentProgress.notes.unshift(newNote);
    if (persistentProgress.notes.length > 20) {
      persistentProgress.notes.pop();
    }

    saveProgress(persistentProgress);
    io.emit('progress_sync', persistentProgress);
    io.emit('system_message', `💌 ${player.name} panoya yeni bir sevgi/motivasyon notu astı!`);
  });

  // Masaya Özel Post-It Aşk Notu Bırakma
  socket.on('desk_note_send', ({ text }) => {
    const player = players[socket.id];
    if (!player || !text) return;

    const trimmed = text.trim().substring(0, 140);
    const newNote = {
      id: 'desk_' + Date.now(),
      sender: player.name,
      text: trimmed,
      date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      room: player.room,
      tableId: player.tableId
    };

    persistentProgress.notes.unshift(newNote);
    if (persistentProgress.notes.length > 20) {
      persistentProgress.notes.pop();
    }

    saveProgress(persistentProgress);
    io.emit('progress_sync', persistentProgress);
    io.emit('desk_note_received', newNote);
    io.emit('system_message', `📝 ${player.name} masanın kenarına tatlı bir sevgi notu iliştirdi! ❤️`);
  });

  // Partnerine Kahve / Çay İkram Etme
  socket.on('serve_coffee', () => {
    const player = players[socket.id];
    if (!player) return;

    const otherPlayer = Object.values(players).find(p => p.id !== socket.id);
    const targetName = otherPlayer ? otherPlayer.name : (player.name === 'Can' ? 'Sezen' : 'Can');

    io.emit('coffee_served', {
      from: player.name,
      to: targetName,
      tableId: player.tableId,
      room: player.room
    });
    io.emit('system_message', `☕ ${player.name}, ${targetName}'e sıcacık taze bir kahve ikram etti! ❤️`);
  });

  // Dekor Satın Alma
  socket.on('buy_decor', ({ decorId, cost }) => {
    if (persistentProgress.cozyHearts >= cost && !persistentProgress.unlockedDecors.includes(decorId)) {
      persistentProgress.cozyHearts -= cost;
      persistentProgress.unlockedDecors.push(decorId);
      saveProgress(persistentProgress);
      io.emit('progress_sync', persistentProgress);
      io.emit('system_message', `🌸 Yeni bir dekorasyon açıldı ve odaya yerleştirildi!`);
    }
  });

  // Kafe Yiyecek & İçecek Sipariş Verme (Elde 5 dk Taşıma & Masaya Alma)
  socket.on('buy_food_item', ({ itemId, itemName, itemIcon }) => {
    const player = players[socket.id];
    if (!player) return;

    player.heldItem = {
      id: itemId,
      name: itemName,
      icon: itemIcon,
      startTime: Date.now(),
      duration: 5 * 60 * 1000 // 5 dakika (300 saniye)
    };

    io.emit('players_sync', players);
    io.emit('system_message', `☕ ${player.name}, Good Coffee'den nefis bir [${itemName}] aldı! Elinde taşıyor (5 dk).`);
  });

  // Eldeki Yiyeceğin/İçeceğin Süresi Dolunca Temizleme
  socket.on('clear_held_item', () => {
    const player = players[socket.id];
    if (!player || !player.heldItem) return;

    const itemName = player.heldItem.name;
    player.heldItem = null;
    io.emit('players_sync', players);
    io.emit('system_message', `✨ ${player.name} lezzetli [${itemName}] bitirdi! Afiyet olsun 💕`);
  });

  // Yurt Yatağında Uzanma / Uyuma [E]
  socket.on('toggle_sleep', () => {
    const player = players[socket.id];
    if (!player || player.room !== 'dorm' || player.isSitting) return;

    player.isSleeping = !player.isSleeping;
    if (player.isSleeping) {
      player.x = player.name === 'Can' ? 64 : 536;
      player.y = 150;
      player.direction = 'down';
    }
    io.emit('players_sync', players);
    if (player.isSleeping) {
      io.emit('system_message', `💤 ${player.name} yatağına uzanıp tatlı bir uykuya daldı... (Zzz)`);
    } else {
      io.emit('system_message', `☀️ ${player.name} dinç bir zihinle uyandı!`);
    }
  });

  // Dilek Çeşmesine Madeni Para Atma (Garden Fountain)
  socket.on('throw_wishing_coin', () => {
    const player = players[socket.id];
    if (!player || player.room !== 'garden') return;

    persistentProgress.cozyHearts = (persistentProgress.cozyHearts || 0) + 1;
    saveProgress(persistentProgress);
    io.emit('progress_sync', persistentProgress);

    const fortunes = [
      "Bugün Sezen'e tatlı bir iltifat etmeyi unutma! ❤️",
      "Can & Sezen'in birlikte başaramayacağı hiçbir hedef yok! 🎓✨",
      "Dileğin suya fısıldandı: Geleceğiniz sevgi ve başarıyla dolu olacak 🌸",
      "Küçük bir mola zihni tazeler, sıradaki çalışma seansı harika geçecek! 🍅",
      "Birlikte çalıştığınız her an hafızanızda ömür boyu kalacak bir hatıra 💕"
    ];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    io.emit('wishing_fountain_event', {
      playerName: player.name,
      fortune
    });
    io.emit('system_message', `🪙 ${player.name} Dilek Çeşmesine madeni para attı ve bir dilek tuttu! (+1 Cozy Kalp)`);
  });

  // Retro Radyo / Jukebox İstasyonu Değiştirme
  socket.on('change_radio_station', ({ stationIndex, stationName }) => {
    const player = players[socket.id];
    if (!player) return;

    io.emit('radio_station_sync', {
      stationIndex,
      stationName,
      changedBy: player.name
    });
    io.emit('system_message', `📻 ${player.name} radyoda yeni bir istasyon açtı: [${stationName}] 🎵`);
  });

  // Kedi Pamuk'u Besleme
  socket.on('feed_cat', () => {
    const player = players[socket.id];
    if (!player) return;

    cat.state = 'purring';
    cat.lastPurrTime = Date.now();
    io.emit('cat_sync', cat);
    io.emit('cat_fed_event', {
      playerName: player.name
    });
    io.emit('system_message', `🐱 ${player.name} Kedi Pamuk'a nefis bir ödül maması verdi! Pamuk sevgiyle mırıldıyor 💕`);
  });

  // Sevimli Hediye Gönderme
  socket.on('send_gift', ({ giftName, note }) => {
    const player = players[socket.id];
    if (!player) return;

    const otherPlayer = Object.values(players).find(p => p.id !== socket.id);
    const targetName = otherPlayer ? otherPlayer.name : (player.name === 'Can' ? 'Sezen' : 'Can');

    io.emit('gift_received', {
      from: player.name,
      to: targetName,
      giftName,
      note: note || 'Sana küçük tatlı bir hediye!'
    });
    io.emit('system_message', `🎁 ${player.name}, ${targetName}'e [${giftName}] hediye etti! ❤️`);
  });

  // Sohbet & Emote
  socket.on('send_chat', ({ message }) => {
    const player = players[socket.id];
    if (!player || !message) return;

    io.emit('chat_message', {
      sender: player.name,
      text: message.trim().substring(0, 100),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('send_emote', ({ emote }) => {
    const player = players[socket.id];
    if (!player) return;

    io.emit('player_emote', {
      playerId: socket.id,
      playerName: player.name,
      emote
    });
  });

  // Ayrılma
  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      // Beklenmeyen kopmada (sekme kapanması vb.) çalışılan süreyi kaydet
      if (player.isSitting && player.studyStartTime) {
        const sessionDuration = Math.floor((Date.now() - player.studyStartTime) / 1000);
        const minutesStudied = Math.floor(sessionDuration / 60);
        const earnedHearts = minutesStudied >= 1 ? minutesStudied : (sessionDuration >= 20 ? 1 : 0);
        if (earnedHearts >= 1 || sessionDuration >= 20) {
          persistentProgress.totalStudyMinutes += Math.max(1, minutesStudied);
          persistentProgress.cozyHearts += earnedHearts;

          const today = new Date().toISOString().split('T')[0];
          if (persistentProgress.lastStudyDate !== today) {
            const lastDate = new Date(persistentProgress.lastStudyDate);
            const currentDate = new Date(today);
            const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              persistentProgress.currentStreak += 1;
            } else if (diffDays > 1) {
              persistentProgress.currentStreak = 1;
            }
            persistentProgress.lastStudyDate = today;
          }

          saveProgress(persistentProgress);
          io.emit('progress_sync', persistentProgress);
        }
      }

      const name = player.name;
      if (slots[name]) {
        slots[name].occupied = false;
        slots[name].socketId = null;
      }
      delete players[socket.id];

      io.emit('slots_update', {
        Can: slots.Can.occupied,
        Sezen: slots.Sezen.occupied
      });
      io.emit('players_sync', players);
      io.emit('system_message', `${name} oyundan ayrıldı.`);
    }
  });
});

function getRoomDisplayName(roomKey) {
  switch (roomKey) {
    case 'dorm': return 'Can & Sezen Yurdu 🛏️';
    case 'campus_path': return 'Kampüs Patikası 🌳';
    case 'classroom': return 'Sınıf 🏫';
    case 'garden': return 'Bahçe 🌸';
    case 'cafe': return 'Kafe ☕';
    default: return roomKey;
  }
}

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`\n======================================================`);
  console.log(`🌸 CozyStudy 2.0: Can & Sezen Gelişmiş Sürüm Başlatıldı!`);
  console.log(`======================================================`);
  console.log(`📍 Bu Bilgisayardan Oynamak İçin:  http://localhost:${PORT}`);
  console.log(`🏡 Aynı Evdeki/Ağdaki Bilgisayardan: http://${localIP}:${PORT}`);
  console.log(`🌐 İnternet Paylaşımı: 'npm run share'`);
  console.log(`======================================================\n`);
});
