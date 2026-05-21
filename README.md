# Aplikasi Pendaftaran Pelatihan

Aplikasi ini dibangun menggunakan:
- Frontend: Svelte 5 (menggunakan sistem reaktivitas `$state` terbaru) + Vite
- Backend: Express.js + Multer (untuk upload file) + `pg` (untuk koneksi ke PostgreSQL)
- Database: PostgreSQL

## Cara Menjalankan

1. **Install Dependencies**
   Buka terminal di folder aplikasi ini dan jalankan:
   ```bash
   npm install
   ```

2. **Konfigurasi Database**
   Buat database PostgreSQL dengan nama yang sesuaikan. Jika menggunakan URL yang berbeda, buat file `.env` di folder utama aplikasi ini dan tambahkan:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/(nama_database)
   PORT=3000
   ```
   > **Note**: Saat backend pertama kali dijalankan, ia akan secara otomatis membuat tabel `registrations` yang diperlukan jika belum ada.

3. **Jalankan Backend (Server Express)**
   Buka terminal baru, dan jalankan perintah:
   ```bash
   npm run server
   ```
   Server backend akan berjalan di `http://localhost:3000`.

4. **Jalankan Frontend (Svelte Vite)**
   Buka terminal lain, dan jalankan perintah:
   ```bash
   npm run dev
   ```
   Buka URL yang diberikan (biasanya `http://localhost:5173`) di browser Anda.

## Fitur Form:
- Desain *Glassmorphism* modern dengan transisi yang halus.
- Pilihan Jadwal (Senin-Minggu, 2 Sesi).
- Validasi wajib untuk data "Anggota Grup" dan "Nomor WA Anggota" hanya muncul jika paket yang dipilih adalah "Grup".
- File bukti pembayaran akan diupload melalui `multipart/form-data` ke backend, dan disimpan secara lokal di folder `uploads/`, sedangkan *path*-nya akan tersimpan di database PostgreSQL.
