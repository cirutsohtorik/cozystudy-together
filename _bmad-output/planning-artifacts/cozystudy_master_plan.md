# CozyStudy — BMad Master Transformation & Quality Plan

**Initiative:** `cozystudy-polish-and-vitality`  
**Framework:** BMad Method (v6.12.0)  
**Date:** 2026-10-01  
**Status:** In Progress / Planning  

---

## 👥 1. BMad Ekip Rol Dağılımı & Görev Paylaşımı

| Rol | Persona | Bu Projedeki Odak Noktası |
|---|---|---|
| **Business Analyst** | **Mary 📊** | Cozy study / Co-working pazar dinamikleri (*Spirit City: Lofi Sessions*, *Chill Pulse* analizi). Kullanıcıyı ekranda tutan ve odaklanmayı artıran oyun döngüleri. |
| **Product Manager** | **John 📋** | Kapsam kontrolü, özellik önceliklendirme, PRD ve Epik yönetimi. Odaklanma oturumları, Pomodoro, seriler (streaks) ve kilit açılabilir tatlı ödüller. |
| **UX Designer** | **Sally 🎨** | Görsel canlılık, Stardew Valley + Good Coffee Great Coffee estetiği. Karakter mikro-animasyonları (kitap okuma, kahve buharı, molada telefon doomscroll'u), bağımsız kayan pencere ergonomisi. |
| **System Architect** | **Winston 🏗️** | Soket/WebSocket dayanıklılığı, istemci-sunucu zaman senkronizasyonu, Y-sorting render kuyruğu, ses miksaj motoru ve performans optimizasyonu. |
| **Senior Engineer** | **Amelia 💻** | Sıfır regresyon (önceden çalışan hiçbir şeyi bozmama), TDD, temiz kod, modularization ve hatasız uygulama. |

---

## 🔍 2. Proje Teşhisi: "Neden Şu Anda Vasat Hissediyor?"

1. **Ruhsuzluk ve Hareketsizlik (Lack of Micro-Animations):**
   - Karakterler masada otururken tamamen heykel gibi duruyor. Yalnızca statik bir sprite var.
   - Gerçek bir cozy çalışma oyununda masadaki kahveden buhar tütmeli, karakter ara sıra sayfa çevirmeli, göz kırpmalı veya kalemiyle not almalı.
   - Molaya girildiğinde kullanıcının talep ettiği "elinde küçük bir telefonla doomscroll yapma" animasyonu henüz eksik.

2. **İlerleme ve Ödül Döngüsünün Olmaması (No Progression Loop):**
   - Oyunda sadece bir sayaç dönüyor. 2 saat ders çalışınca oyuncunun eline ne geçiyor? Sıfır.
   - Çalışılan her 25 dakikada masaya küçük bir detay gelmeli (örn: masaya kıvrılıp uyuyan yavru kedi, masada açan sukulent çiçeği, yeni bir lofi kaseti veya çalışma kupası).

3. **Ortam Dinamikleri ve Işıklandırma (Flat Lighting & Weather):**
   - Yağmur sesi var ama pencereden damla süzülmüyor ya da bahçede yağmur damlacıkları su birikintisi yapmıyor.
   - Gün batımı / akşam çalışma atmosferi için sıcak lamba ışıkları (vignette / ambient glow) ortamı bir anda sıradanlıktan çıkartıp büyülü bir atmosfere dönüştürebilir.

4. **Kayan Pencere (Mini Companion) Eksiklikleri:**
   - Kayan pencere modu çalışıyor ancak oyunun ana ekranından alınan görsel akışın üzerine daha şık, kompakt ve dikkat dağıtmayan şeffaf cam efektleri (frosted glass), tek tıkla mola/devam ve emoji kontrolleri eklenebilir.

---

## 🚀 3. BMad Dönüşüm Yol Haritası (Fazlar)

```
[Faz 1: Mikro-Animasyonlar] ---> [Faz 2: Atmosfer & Işık] ---> [Faz 3: Ödül & Motivasyon] ---> [Faz 4: Kota Açılışı Sanat]
         |                                |                               |                               |
         v                                v                               v                               v
- Molada Doomscroll              - Lamba Işık Hüzmeleri          - 25dk Çalışma Ödülleri         - 3/4 Sezen Portresi
- Kahve Buharı & Kalem           - Pencere Yağmur Efekti         - Masaya Kedi Çağırma           - Piksel Mekan Banner'ları
- Sayfa Çevirme Hareketi         - Gece/Gündüz Renkleri          - Günlük Çalışma Serisi         - Tam Sanat Tutarlılığı
```

### Faz 1: Canlılık ve Mikro-Animasyonlar (Sally & Amelia)
- [ ] **Mola Telefon Doomscroll'u:** Mola verildiğinde karakterin elinde minicik bir piksel akıllı telefon belirecek, mavi ekran ışığı yüze yansıyacak ve parmağıyla ekranı kaydıracak.
- [ ] **Ders Çalışma Animasyonları:** Masada otururken kahve kupasından yukarı süzülen 3-frame buhar efekti; belirli aralıklarla kalemin oynaması veya sayfa çevrilmesi.
- [ ] **Emoji Baloncuklarının Doğallığı:** Atılan emojilerin karakter kafasında pürüzsüzce yukarı süzülüp (float up) yavaşça solması (fade out).

### Faz 2: Atmosfer, Ses ve Işık Efektleri (Winston & Sally)
- [ ] **Dinamik Ambient Işık:** Masalardaki yeşil bankacı lambalarından ve tavandaki sarı ampullerden sıcak, titreşen (subtle flicker) ışık halkaları.
- [ ] **Dış Mekan / Pencere Yağmur Damlaları:** Kütüphane ve kafe pencerelerinde süzülen yağmur parçacıkları.
- [ ] **Akıllı Ses Katmanları:** Yağmur sesi yalnızca bahçede ve pencerelerin yanında yükselsin; kafede hafif fincan tıngırtıları, kütüphanede yumuşak sayfa hışırtıları eklensin.

### Faz 3: Motivasyon ve Oyunlaştırma (Mary & John)
- [ ] **Çalışma Seans Rozetleri & Masaya Gelen Ziyaretçiler:** 1 saat kesintisiz çalışınca masanın köşesine tatlı bir sarman kedi gelip kıvrılsın.
- [ ] **Günlük Streak ve Odaklanma Kartı:** Can ve Sezen'in birlikte kaç saat çalıştığını gösteren, çiftlere özel sevimli minimal istatistik kartı.

### Faz 4: Piksel Sanat Nihai Tamamlama (Saat 14:42 TSİ)
- [ ] **Sezen Portresi:** 3/4 açılı, Can ile uyumlu, mavi-siyah saçlı, beyaz tenli, yazısız piksel portre.
- [ ] **4 Mekan Piksel Banner'ı:** Giriş, Kütüphane, Kafe, Bahçe için Stardew Valley tarzı piksel çizimlerin üretimi ve entegrasyonu.
