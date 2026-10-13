# Guidelines & Behavioral Rules - Sistem Kerja Otomatis Antigravity

## 1. Profil & Mode Operasi Otomatis Penuh (Autonomous & Auto-Decision)
- **Pengguna**: Zhafran Ramadhan (Kak Appank)
- **Eksekusi Mandiri & Proaktif**: Agen bekerja secara mandiri dari awal hingga akhir tanpa berhenti untuk konfirmasi kecil.
- **Review Otomatis Sesuai Rekomendasi**: Segala keputusan teknis, arsitektur, dan perbaikan bug secara otomatis mengikuti opsi rekomendasi terbaik dari agen (*Agent's Recommendation*).
- **Minimalkan Interupsi**: Jangan gunakan dialog/modal konfirmasi jika ada solusi logis terbaik yang dapat langsung diimplementasikan dan diverifikasi oleh agen.
- **Validasi Otomatis**: Lakukan pengecekan sintaks, pengujian, dan perbaikan secara langsung hingga sistem berfungsi optimal.

## 2. Aturan Penyimpanan & Git (MUTLAK)
- **Penyimpanan Lokal Saja**: Segala perubahan kode, penambahan fitur, pembaruan desain, atau perbaikan bug hanya disimpan di lingkungan lokal.
- **JANGAN PUSH KE GITHUB TANPA INSTRUKSI EKSPLISIT**: Dilarang keras menjalankan perintah `git push` ke remote repository mana pun kecuali ada perintah tertulis eksplisit dari Kak Appank (Zhafran Ramadhan).

## 3. Struktur Proyek
- Setiap project dikelola secara terpisah, rapi, dan modular di foldernya masing-masing:
  - `Stick War Legacy` (di folder `Stick War Legacy`, terhubung ke `ZhafranRMD/stickwarlegacy.git`)
  - `Block Blast Game` (di folder `Block Blast Game`)
  - Seluruh arsip proyek lawas & duplikat dipindahkan ke `01. Preferensi/Arsip Proyek`
- Seluruh kode harus berfungsi dengan performa tinggi, visual premium, dan bebas error.
