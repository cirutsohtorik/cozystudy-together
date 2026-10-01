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

io.on('connection', (socket) => {
  console.log(`[+] Oyuncu bağlandı: ${socket.id}`);

  // Başlangıç slot ve progress verilerini gönder
  socket.emit('slots_update', {
    Can: slots.Can.occupied,
    Sezen: slots.Sezen.occupied
  });
  socket.emit('progress_sync', persistentProgress);
  socket.emit('cat_sync', cat);

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
      room: 'classroom',
      x: characterName === 'Can' ? 360 : 400,
      y: 220,
      direction: 'down',
      isMoving: false,
      isSitting: false,
      isHugging: false,
      tableId: null,
      studyTopic: '',
      studyMode: 'stopwatch', // 'stopwatch' veya 'pomodoro'
      pomodoroDuration: 25 * 60, // 25 dk
      studyStartTime: null,
      isPaused: false
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

    socket.broadcast.emit('player_moved', {
      id: socket.id,
      name: player.name,
      x: player.x,
      y: player.y,
      direction: player.direction,
      isMoving: player.isMoving,
      isHugging: false
    });
  });

  // Mekan Değiştirme
  socket.on('change_room', ({ newRoom, spawnX, spawnY }) => {
    const player = players[socket.id];
    if (!player) return;

    player.room = newRoom;
    player.x = spawnX;
    player.y = spawnY;
    player.isSitting = false;
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
