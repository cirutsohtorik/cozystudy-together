# CozyStudy (Can & Sezen Cozy Study Together) — AI Agent Invariants & Guidelines

## 1. Proje Özeti
CozyStudy, Can ve Sezen için özel olarak geliştirilmiş Stardew Valley & Good Coffee Great Coffee estetiğinde 2D piksel-art eş zamanlı ders çalışma ve Pomodoro companion oyunudur.

- **Stack:** Node.js (Express) + Socket.IO + HTML5 Canvas 2D Procedural/Pixel Rendering + Web Audio API.
- **Oda Şifresi:** `Sezen99720.` (Katı kural: Karakter seçimi ve soket doğrulaması bu şifreye tabidir).
- **Git Standartları:** Conventional Commits zorunludur (`feat:`, `fix:`, `refactor:`, `style:`, vb.).

---

## 2. Modüler Dosya Mimarisi (Module Map & Token Efficiency)

Kod tabanı monolitik dosyalardan kurtarılarak `src/` altında modüler parçalara ayrılmıştır. Değişiklik yaparken **kesinlikle eski monolitik dosyaları açıp token harcama**, doğrudan ilgili küçük modülü oku ve güncelle:

- **Haritalar (`src/maps/`):**
  - `dorm.js`: Can & Sezen yurt odası tanımı, yataklar, çay istasyonu, anı panosu.
  - `classroom.js`: Sınıf & kütüphane haritası, kara tahta, kitaplıklar.
  - `garden.js`: Çardaklı bahçe, fıskiye, dilek ağacı.
  - `cafe.js`: Good Coffee kafe, barista tezgahı, şömine, pasta vitrini.
  - `campus_path.js`: Kampüs yürüyüş yolu, banklar, sokak fenerleri.
  - `lighting.js`: Saat & hava durumuna göre dinamik ışıklandırma.
- **Piksel Çizimler (`src/sprites/`):**
  - `characters.js`: Can ve Sezen 3-ton shading yürüme ve oturma animasyonları.
  - `furniture.js`: Masalar, sandalyeler ve çardaklar (gazebos).
  - `decor.js`: Bitkiler, lambalar, halılar, sarılma ve Pamuk kedi.
  - `npcs.js`: Tüm NPC'ler (Prof. Hikmet, Pelin, Mert, Salih Amca, Melis, vb.).
  - `dorm.js`: Yurt eşyaları (yataklar, gardırop, buzdolabı, radyo, su ısıtıcı).
  - `campus.js`: Kampüs ağaçları, banklar ve fenerler.
  - `items.js`: Taşınabilir kahve, çay, kruvasan, buket ve mamalar.
  - `portraits.js`: 64x64 Stardew Valley diyalog portreleri.
- **Arayüz (`src/ui/`):**
  - `auth.js`: Şifre ekranı (`Sezen99720.`) kontrolü.
  - `hud.js`: Saat, hava, streak, kalp, toast ve chat bildirimleri.
  - `study.js`: Ders çalışma, Pomodoro sayacı ve masa oturma mekaniği.
  - `modals.js`: Dükkan, notlar, menü, jukebox, polaroid, hediye modalları.
  - `mini.js`: Mini companion widget ve sürükleme sistemi.
- **Ses & Ambiyans (`src/audio/`):**
  - `index.js`: Sentetik lofi gitar, yağmur, rüzgar ve SFX kütüphanesi.
- **İletişim & EventBus (`public/js/event_bus.js`):**
  - Katmanlar arası bağımsız pub-sub olay sistemi.

---

## 3. Mimari Kurallar ve Sınırlar (Architecture Invariants)

1. **Katman İzolasyonu (Layer Boundaries):**
   - **Network (`network.js` / `network/*`):** Sadece Socket.IO olaylarını dinler ve yayar. Doğrudan oyun içi state mutasyonu yapmak yerine `Game` veya `UI` metotlarını tetikler.
   - **Game Engine (`game.js` / `engine/*`):** Canvas render, fizik, çarpışma (colliders), input dinleme ve animasyon döngüsünü yönetir. DOM manipülasyonu yapmaz (UI'ya devreder).
   - **UI (`ui.js` / `ui/*`):** Modal'lar, HUD, toast bildirimleri ve DOM olaylarını yönetir. Canvas üzerine çizim yapmaz (yalnızca mini companion tuvali hariç).
   - **Audio (`audio.js` / `audio/*`):** Web Audio API ile tamamen sentetik lofi/ambiyans ve ses efektleri üretir. Asla dış ses dosyasına bağımlı kalmaz.
   - **Maps & Sprites (`maps.js`, `sprites.js`):** Statik harita ve prosedürel piksel çizim tanımlarıdır. Ağ veya UI fonksiyonları içermez.

2. **Window / Global Kuralı:**
   - Yeni değişken veya fonksiyonları rastgele `window` üzerine asma.
   - HTML'deki doğrudan `onclick` / form submit handler'ları için yalnızca `UI` veya `Network` üzerinden export edilen resmi API kullanılmalıdır.

3. **Mekanlar ve Haritalar:**
   - Mevcut Odalar: `dorm` (Yurt), `campus_path` (Kampüs Patikası), `classroom` (Sınıf & Kütüphane), `garden` (Bahçe), `cafe` (Good Coffee Kafe).
   - Oyuncu başlangıç mekanı: `dorm`.
   - Sınıf Kuralı: 08:30 - 16:00 arası ders işlendiğinden sınıf kapısı kilitlidir (öğrenci/hoca NPC'leri içeridedir).

---

## 3. Bilinen Tuzaklar ve Dikkat Edilmesi Gerekenler (Pitfalls Ledger)

- **AI Slop Uyarısı:** Dışarıdan generic/yapay zeka çıktısı düşük kaliteli PNG/JPEG görseller eklenmemeli. Tüm piksel görseller procedurally Canvas üzerinden veya 16-bit Stardew Valley / Good Coffee Great Coffee estetiğinde olmalıdır.
- **Socket.IO Event Leakage:** Socket listener'larını döngü veya tekrar eden init fonksiyonları içinde çift bağlama (`socket.on` sadece bir kez başlatılmalıdır).
- **Y-Sorted Rendering:** Masalar, sandalyeler, NPC'ler ve oyuncular derinlik sıralaması (`y` koordinatına göre) ile çizilmelidir, aksi takdirde karakterler masaların içine batar veya arkasında kaybolur.
- **PowerShell Syntax:** Windows PowerShell üzerinde komut zincirlerken `&&` yerine `;` kullanılmalıdır.
- **Dual Branch Push:** Canlı deploy için hem `master` hem `main` güncel tutulmalıdır: `git push origin master; git push origin master:main`.
