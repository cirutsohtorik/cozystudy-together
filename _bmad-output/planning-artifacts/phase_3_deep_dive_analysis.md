# CozyStudy — Faz 3 Derinlemesine BMad Analizi & Genişletme Planı

**Tarih:** 2026-10-01  
**İnisiyatif:** `cozystudy-phase-3-motivation-and-progression`  
**Yöntem:** BMad Method (Mary, John, Sally, Winston, Amelia)  
**Durum:** Teklif & Onay Aşaması  

---

## 📊 1. Mary (Business Analyst) — Pazar & Oyuncu Psikolojisi Analizi

### Karşılaştırmalı Oyun İncelemesi (*Benchmark Analysis*):
* **Spirit City: Lofi Sessions (Steam %95 Çok Olumlu):** Oyuncuların bu tür oyunları saatlerce açık bırakmasının 1 numaralı sebebi **"Pasif Ödül & Yaşayan Oda"** mekaniğidir. Oyuncu ders çalıştıkça ekranda yeni bir canlı (kedi, sincap vb.) belirir; bu durum ders çalışmayı bir yük olmaktan çıkarıp sıcak bir ritüele dönüştürür.
* **Virtual Cottage & Chill Pulse:** Çiftlerin ve arkadaşların birlikte çalışma motivasyonu en çok **"Küçük Jestler"** (birbirine kahve uzatma, masaya minik not bırakma) üzerinden beslenir.
* **Tasarım İlkesi (Low Cognitive Load):** CozyStudy bir FPS veya aksiyon oyunu değildir. Eklenen hiçbir özellik kullanıcının ders çalışırken dikkatini dağıtmamalı, göz ucuyla bakıldığında huzur ve tebessüm vermelidir.

---

## 📋 2. John (Product Manager) — Faz 3 Özellik Adayları & Öncelik Matrisi

Ekibin önerdiği 5 güçlü motivasyon mekaniği:

### 🌟 Özellik 1: "Masa Yoldaşı: Uyuyan Sarman Kedi & Büyüyen Çiçek" (En Yüksek Öncelik)
* **Nasıl Çalışır:**
  - 15 dakika kesintisiz çalışıldığında: Masadaki sukulent saksısında küçük bir pembe çiçek açar.
  - 25 dakika (Pomodoro döngüsü) tamamlandığında: Masanın boş kenarına minik sarman kedi (Pamuk) gelip kıvrılır ve uyumaya başlar (hafif nefes alıp verme animasyonuyla).
  - Mola verildiğinde veya ders bittiğinde tatlı bir gerinme hareketi yapar.
* **Neden Önemli:** Oyuncuya "çalıştıkça masam canlanıyor" hissi verir.

### 💌 Özellik 2: "Çiftler Arası Masa Post-It Notu" (Desk Sticky Note)
* **Nasıl Çalışır:**
  - Masada oturan Can veya Sezen, masanın köşesindeki minik renkli post-it'e tıklayarak birbirine kısa bir motivasyon notu bırakabilir (Örn: *"Harika gidiyorsun sevgilim! 💖"*, *"30 dk sonra mola verelim mi? ☕"*).
  - Diğer partnerin masasında anında sarı/pembe bir yapışkan kağıt belirir ve tıklandığında el yazısı fontuyla not açılır.
* **Neden Önemli:** Ayrı şehirlerde veya yan yana çalışırken aradaki bağı güçlendiren en samimi detaydır.

### ☕ Özellik 3: "Birbirine Çay/Kahve Ismarlama / İkram Etme"
* **Nasıl Çalışır:**
  - Masada birlikte otururken tek tıkla partnerine "Sıcak Kahve / Bitki Çayı İkram Et" denebilir.
  - Partnerin önündeki fincana tatlı bir kalp animasyonuyla taze kahve dökülür ve hafif bir kupa çınlama sesi gelir.

### 🎵 Özellik 4: "Masa Üstü Mini Kasetçalar (Lofi Mood Selector)"
* **Nasıl Çalışır:**
  - Masada duran minik vintage kasetçalar:
    - 📼 Kaset 1: *Yağmurlu Gece & Kütüphane* (Hafif yağmur + yumuşak piyano)
    - 📼 Kaset 2: *Pazar Sabahı Kafesi* (Akustik gitar tınıları + fincan sesleri)
    - 📼 Kaset 3: *Bahçe Esintisi* (Doğa, rüzgar çanı ve kuşlar)
  - Oyuncu ders çalışırken atmosfer sesini tek tıkla değiştirebilir.

### 🏆 Özellik 5: "Çiftler Çalışma Serisi & Minimalist İstatistik Kartı" (Streak)
* **Nasıl Çalışır:**
  - Sol üst köşede veya menüde şık, ahşap çerçeveli minik bir pano:
    - 🔥 **Çalışma Serisi:** "3 Gün Kesintisiz Birlikte Çalışıldı"
    - ⏱️ **Bugün Toplam:** "Can: 2s 15dk | Sezen: 1s 50dk"
    - 💕 **Birlikte Odaklanma:** "1s 30dk"
  - `data/progress.json` dosyasına kaydedilir, sayfa kapansa bile asla kaybolmaz.

---

## 🎨 3. Sally (UX Designer) — Görsel & Arayüz Tasarımı

* **Masa Üstü Post-It:** Masanın kenarında 8x8 piksellik tatlı sarı/pembe kağıt; üzerine gelince hafifçe parlar (`hover glint`).
* **Uyuyan Kedi:** Masanın ucunda kıvrılmış sarman kedi sprite'ı, 3 saniyede bir hafifçe yükselip inen nefes bob'u (`y += sin(time)*0.4`).
* **Mini Kayan Pencere Uyumu:** Tüm bu özellikler bağımsız kayan pencerede (`mini.html`) de masa tuvaline birebir yansır; oyuncu başka bir sekmede çalışırken bile masadaki kediyi ve post-it notunu görebilir.

---

## 🏗️ 4. Winston (Architect) & Amelia (Dev) — Teknik Mimari

1. **Soket Olayları (WebSocket):**
   - `leave_desk_note` -> `{ tableId, author, note, timestamp }`
   - `desk_notes_sync` -> Sunucuya bağlı tüm istemcilere masadaki notları dağıtır.
   - `serve_coffee` -> Karşı tarafa ikram animasyonunu tetikler.
2. **Kalıcı Depolama:**
   - Masadaki notlar ve günlük streak bilgisi sunucudaki `data/progress.json` dosyasına yazılır.
3. **Performans:**
   - 60 FPS canvas döngüsünü zorlamayacak saf 2D piksel çizim fonksiyonları.

---

## 🎯 5. BMad Ekip Önerisi & Karar Matrisi

| Paket | İçerik | Geliştirme Süresi | Etki Seviyesi |
|---|---|---|---|
| **Paket A (Önerilen - Altın Denge):** | **Uyuyan Kedi & Çiçek Açma (Özellik 1)** + **Masa Post-It Aşk Notu (Özellik 2)** + **Kahve İkramı (Özellik 3)** | Hızlı & Etkili | ⭐⭐⭐⭐⭐ Çok Yüksek |
| **Paket B (Müzikal Paket):** | Paket A + Mini Kasetçalar (Özellik 4) | Orta | ⭐⭐⭐⭐ Yüksek |
| **Paket C (Tam Paket):** | 5 Özelliğin Tümü (Kedi + Not + İkram + Kasetçalar + Streak Kartı) | Kapsamlı | ⭐⭐⭐⭐⭐ Efsanevi |
