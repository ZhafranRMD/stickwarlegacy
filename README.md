# ⚔️ Stick War: Legacy - Perang Tongkat Legenda

> 🌐 **Live Demo (Cloudflare)**: [https://stickwarlegacy.zhafranramadhan.workers.dev](https://stickwarlegacy.zhafranramadhan.workers.dev)  
> ⚡ **Mirror (Pages)**: [https://stickwarlegacy-3ym.pages.dev](https://stickwarlegacy-3ym.pages.dev)  
> 📦 **GitHub Repository**: [https://github.com/ZhafranRMD/stickwarlegacy](https://github.com/ZhafranRMD/stickwarlegacy)

---

## 🌟 Fitur Utama

### 1. 🔥 Skin Elemen Magis (Api & Es)
* **🔥 Skin Api (Blazing Fire):**
  * **Efek Bakar:** Memberikan **10 kerusakan bakar** saat menyerang musuh dengan partikel kobaran api membara.
  * **Pembalas Api:** Saat menerima damage dari musuh, membalas **5 kerusakan api** ke penyerang.
* **❄️ Skin Es (Frost Ice Cryo):**
  * **Pembekuan Total:** Saat prajurit menerima damage, musuh penyerang akan **MEMBEKU total selama 3 detik** (terperangkap dalam kristal es, tidak dapat bergerak maupun menyerang).
  * **Chilling Slow:** Serangan memberikan efek *chill* yang memperlambat laju jalan musuh sebesar -35%.

### 2. ⭐ Kendali Manual Prajurit (2X Damage & Bintang Komandan)
* Klik prajurit tim biru untuk mengendalikannya secara langsung!
* **Bintang Komandan (⭐):** Prajurit yang dikontrol memiliki bintang emas bercahaya yang melayang di atas kepalanya.
* **2X Damage Multiplier:** Setiap serangan saat mengontrol pasukan menghasilkan **kerusakan ganda (X2 Damage)**!
* Kontrol:
  * `A` / `D`: Bergerak Kiri / Kanan
  * `Spasi`: Serang (2X Damage)
  * `S` / `Klik Kanan`: Tangkis Perisai (Spearton)
  * `Esc`: Lepas kendali kembali ke mode otomatis

### 3. 👹 Mode Gila-Gilaan (Insane Pro AI)
* Musuh super agresif dengan ekonomi melimpah dan kecerdasan taktis tinggi.
* **Musuh Mengontrol Pasukan:** AI musuh secara cerdas memilih prajurit tempur terbaiknya untuk menjadi Komandan Musuh dengan **Bintang ⭐** di atas kepalanya dan menghasilkan **2X Damage**!
* Dilengkapi *micro-AI* pro (Spearton musuh otomatis menangkis serangan jarak dekat, Archidon musuh melakukan *kiting* menjaga jarak aman).
* Mengalahkan komandan musuh memberikan hadiah ekstra `+300 Gold` dan `+50 Gems`!

### 4. 🔮 10 Bola Kristal Sihir (Spells)
* `Q` - Miner Hustle
* `W` - Blazing Arrow Rain
* `E` - Healing Wave
* `F` - Sword Rage
* `T` - Summon Golden Spartan
* `G` - Training Haste (4x Speed)
* `H` - Lightning Storm
* `J` - Reanimate Undead Army
* `K` - King's Gold Rush
* `U` - Colossal Titan Marrowkai

### 5. 🏪 Toko Penyihir & Armory Peningkatan
* **Peningkatan Senjata:** 10 kategori senjata (Pedang, Busur, Tombak, Perisai, Tongkat Penyihir, Gada Raksasa, Tambang Emas, Patung, Helm, dll) hingga level 3 maksimal.
* **Aturan Hadiah:** Menang 1 kali pertempuran = **+2 Poin Peningkatan** & **+150 Gems**.
* **Toko Skin & Mantra:** Buka skin elemen dan beli stok mantra dengan Permata (Gems).

### 6. 📜 Kode Rahasia / Cheats
Ketik langsung kode di bawah saat bermain atau gunakan menu kode rahasia:
* `gemsnotreal` - 999,999 Permata (Gems)
* `upgradereal` - Semua 10 peningkatan langsung level 3 maksimal
* `minegoldrich` - 999,999 Emas
* `cooldownnotspawn` - Tanpa waktu cooldown rekrut pasukan
* `nopopuation` - Tanpa batas populasi prajurit
* `spellol` - Stok 99 dan tanpa cooldown mantra sihir

### 7. 🎵 Audio Synthesizer & Mode Malam Zombie
* 4 Trek Lagu BGM Sintesis Web Audio API (Inamorta War March, Stick War Royal Hymn, Night of the Deads, Battle Climax Symphony).
* Level genap secara otomatis beralih ke Mode Malam dengan invasi Zombie Horde.
* Mode Grafis HD dengan partikel atmosferik.

### 8. 📱 Progressive Web App (PWA) Offline-Ready
* Siap dipasang di desktop atau ponsel tanpa internet berkat Service Worker cache.

---

## 🚀 Cara Menjalankan

1. Buka file `index.html` langsung di browser web (Chrome, Edge, Firefox, Safari) atau jalankan via web server lokal.
2. Tidak membutuhkan instalasi dependensi runtime — 100% Client-side Vanilla Web Technologies.
3. Versi prototipe monolitik terdahulu (`Uji Coba.html`) telah diarsipkan di `D:\devproject\01. Preferensi\Arsip Proyek\stick_war_prototype_monolitik\`.

---

## 📁 Struktur Berkas Modular

```text
Stick War Legacy/
├── index.html            # Struktur antarmuka dan viewport medan tempur
├── style.css             # Desain antarmuka, skin, HUD, dan dialog toko
├── game.js               # Mesin utama permainan, state, logika AI, dan ekonomi
├── stickman.js           # Sistem animasi & rendering prajurit stickman
├── audio.js              # Sintesis audio dan pemutar 4 lagu BGM
├── sw.js                 # Service worker untuk akses offline PWA
├── manifest.json         # Manifest PWA instalasi aplikasi
├── icon-*.png, icon.svg  # Aset ikon aplikasi berbagai resolusi
├── scratch/              # Skrip pengujian internal & verifikasi modul
├── .gitignore            # Filter berkas Git
├── PEDOMAN.md            # Pedoman kerja pengembangan
└── README.md             # Dokumentasi fitur dan panduan
```
