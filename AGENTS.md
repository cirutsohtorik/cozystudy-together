# CozyStudy (Can & Sezen Cozy Study Together) — AI Agent Invariants & Guidelines

## 1. Proje Özeti
CozyStudy, Can ve Sezen için özel olarak geliştirilmiş Stardew Valley & Good Coffee Great Coffee estetiğinde 2D piksel-art eş zamanlı ders çalışma ve Pomodoro companion oyunudur.

- **Stack:** Node.js (Express) + Socket.IO + HTML5 Canvas 2D Procedural/Pixel Rendering + Web Audio API.
- **Oda Şifresi:** `Sezen99720.` (Katı kural: Karakter seçimi ve soket doğrulaması bu şifreye tabidir).
- **Git Standartları:** Conventional Commits zorunludur (`feat:`, `fix:`, `refactor:`, `style:`, vb.).

---

## 2. Mimari Kurallar ve Sınırlar (Architecture Invariants)

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
