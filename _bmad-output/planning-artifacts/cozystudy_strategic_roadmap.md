# CozyStudy — BMad Master Stratejik Rapor & Büyük Dönüşüm Planı

**Hazırlayan:** BMad Çekirdek Ekibi (Mary - BA, John - PM, Sally - UX, Winston - Architect, Amelia - Lead Dev)  
**Tarih:** 2026-10-01  
**Kapsam:** Tüm Sohbet Geçmişi Analizi, Asıl Vizyon vs. Mevcut Durum Karşılaştırması (Gap Analysis) ve Nihai Yol Haritası  

---

## 🎯 1. Oyunun Asıl Hedefi & Vizyonu (Sohbet Kökleri)

Sohbetin 106, 265, 837, 1290 ve 1550. mesajlarından süzülen **öz ve nihai vizyon**:

> *"Sevgilimle kendime bir ders çalışma uygulaması yapmak istiyorum... Bu oyunun en önemli noktası kolay ulaşılabilirliği ve uygulanabilirliği olmalı. Amaç zaten ders çalışırken ufak bir atmosfer versin diye oyunu bir köşeye açmak, full ekran oyuna odaklanmak değil. Oyunda kontrol edilebilir yalnızca 2 karakter olacak: Can ve Sezen. Farklı bilgisayarlardan oynayacağız. Küçültülmüş halinde de masada kiminle oturduğunu gör, kaç dakikadır hangi konuyu çalışıyorsun onu gör, emoji yolla... Stardew Valley ve Good Coffee Great Coffee estetiğinde olsun."*

### 💎 Temel Ürün Kimliği:
1. **Tür:** Minimalist Çok Oyunculu Çift Çalışma Yoldaşı (*Multiplayer Couple Study Companion*).
2. **Kullanım Senaryosu:** Ekranda oyun oynamak için değil; gerçek hayatta ders çalışırken/kod yazarken masaüstünün bir köşesinde veya ikinci ekranda sessizce açık durup **"Yalnız değilim, sevgilimle yan yana çalışıyoruz"** hissi veren yaşayan bir alan.
3. **Temel Döngü (*Core Loop*):**
   - Giriş yap ➔ Odayı ve masayı seç ➔ Konunu belirle ve otur ➔ Kayan mini pencereye al ➔ Gerçek dersine odaklan ➔ Birlikte çalışma süresi biriksin ➔ Molada doomscroll yap ➔ Birbirine kahve/not ikram et ➔ Kalıcı ilerleme kazan.

---

## ⚖️ 2. Asıl Hedef ile Mevcut Oyunun Karşılaştırması (Gap Analysis)

| Alan | Asıl Vizyon | Mevcut Durum | Boşluk (Gap) & Değerlendirme |
|---|---|---|---|
| **Çok Oyunculu Altyapı** | İki farklı bilgisayardan Can ve Sezen'in bağlanması | Node.js + Socket.io kurulu, çalışıyor | ✅ **Tamamlandı** (Soket senkronizasyonu stabil). |
| **Mola Sayacı** | Mola verince sürenin donması, devam edince akması | 0ms optimistik freeze ve server sync devrede | ✅ **Kusursuz** (Sıfırlanma hatası tamamen çözüldü). |
| **Görsel Çakışmalar** | Çiçeklerin kafayı örtmemesi, oturma pozisyonu | Çiçekler masanın önüne çekildi, başlar %100 açık | ✅ **Çözüldü**. |
| **Molada Doomscroll** | Molaya girince telefonla sosyal medya kaydırma | Masa üstü overlay katmanında telefon ve parmak swipe eklendi | ✅ **Çözüldü**. |
| **Kayan Mini Pencere** | Oyun ekranını birebir küçülten, köşede duran mini mod | `mini.html` tuvali yansıtıyor, butonlar çalışıyor | ⚠️ **İyileştirilmeli:** Pencere daha şık, şeffaf çerçeveli ve "Always on Top" hissiyatına yaklaştırılmalı. |
| **Oyun Ekonomisi & İlerleme** | *"Oyun ekonomisi olduğundan progress kesinlikle kaydedilmeli"* (Mesaj 265) | Saatler sunucuda tutuluyor ama henüz harcanabilir ekonomi yok | 🔴 **BÜYÜK BOŞLUK:** Çalışılan sürelerin bir ödülü (kahve çekirdeği / cozy puan) ve kilit açma mekanizması eksik. |
| **Çift Etkileşimi** | Yalnızca emoji değil, çiftler arası sıcak bağ | Emojiler ve sarılma var | 🟡 **Geliştirilmeli:** Masaya post-it aşk notu bırakma, fincana kahve doldurma, ortak hedef panosu eklenmeli. |
| **Grafik Kimliği** | Stardew Valley + Good Coffee kalitesi | Karakter piksel portreleri geçici olarak bağlandı, mekanlar suluboya | 🟡 **Beklemede:** Saat 14:42'de 3/4 Sezen ve piksel mekan banner'ları onaylanıp entegre edilecek. |

---

## 🗺️ 3. BMad Master Dönüşüm Yol Haritası (Nihai Hedefe Ulaşma)

Mevcut vasatlığı kırıp oyunu tam hayal ettiğin o bağımlılık yapıcı, tatlı ve işlevsel çift yoldaşına dönüştürmek için 4 net adımdan oluşan ana strateji:

```
[Mevcut Temel] ➔ [ADIM 1: Çift Etkileşimi & Sıcaklık] ➔ [ADIM 2: Cozy Ekonomi & Ödül] ➔ [ADIM 3: Mini Yoldaş Cilası] ➔ [ADIM 4: Nihai Piksel Sanat]
```

### 📍 Adım 1: Masada Yaşayan Çift Etkileşimi (Emotional Connection)
* **1.1. Masa Post-It Aşk Notu:** Masada duran sevimli yapışkan kağıt. Can ve Sezen birbirine günün motivasyon sözünü yazar, masada parıldar ve kalıcıdır.
* **1.2. Kahve/Çay İkramı:** Tek tıkla sevgilinin bardağına taze kahve doldurup kalp balonu çıkarma.
* **1.3. Ortak Çalışma Halesi (Love Aura):** Yan yana masalarda çalışırken aralarında süzülen minik pembe parıltılar ve ortak çalışma çarpanı.

### 📍 Adım 2: Cozy Ekonomi & Kalıcı İlerleme (Progression & Economy)
* **2.1. "Kahve Çekirdeği" Para Birimi:** Çalışılan her 10 dakika = 1 Kahve Çekirdeği ☕.
* **2.2. Masa Süsleme & Özelleştirme:**
  - Biriken çekirdeklerle masaya kedi çağırma (Pamuk), sukulent saksısı, özel lofi kasetleri veya retro masa lambaları açabilme.
* **2.3. Günlük Seri (Daily Streak):** Kaç gündür birlikte çalışıldığını gösteren ahşap nostaljik takvim.

### 📍 Adım 3: Kayan Mini Yoldaşın Zirveye Taşınması (The Ultimate Mini Companion)
* **3.1. Dikkati Sıfır Dağıtan Minimalist Arayüz:** Çerçevesiz, şık retro ahşap veya yarı saydam mod.
* **3.2. Kompakt Durum Bilgisi:** Tek bakışta masadaki iki karakteri, akan süreyi ve partnerinin ne çalıştığını görme.
* **3.3. Hızlı Kısayollar:** `Space` ile mola ver/devam et, `1-5` ile emoji yolla.

### 📍 Adım 4: Nihai Görsel Entegrasyon (Saat 14:42 TSİ)
* **4.1. Sezen 3/4 Piksel Portre:** Can ile aynı açıda, mavi-siyah saçlı, zarif ve yazısız.
* **4.2. Stardew Valley Mekan Banner'ları:** Giriş, kütüphane, kafe ve bahçe için el emeği piksel arka planların onaya sunulup oyuna aktarılması.

---

## 🏁 4. BMad Ekip Kararı & Hemen Başlama Önerisi

Ekip olarak şu anki kod temelimiz (soket, mola, render derinliği, animasyonlar) son derece sağlam.  
Oyunu "basit bir sayaçtan" çıkarıp **"Can ve Sezen'in her gün aşkla açıp köşeye koyduğu o rüya uygulamaya"** dönüştürmek için hemen **Adım 1 (Masa Post-It Aşk Notu + Kahve İkramı + Ortak Hedef)** ile başlayalım.
