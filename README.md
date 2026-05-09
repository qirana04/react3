# Sistem Pemilihan Ketua OSIS (E-Voting)

Project ini adalah aplikasi voting digital untuk pemilihan ketua OSIS dengan desain premium dan sistem API buatan sendiri.

## Fitur Utama
- **Desain Premium:** Menggunakan font Lexend & Inter dengan palet warna Navy Blue & Gold.
- **API Kustom:** Backend Express.js sederhana untuk mengelola data kandidat dan suara.
- **Animasi Halus:** Menggunakan Framer Motion untuk transisi antar halaman.
- **Hasil Real-time:** Grafik interaktif menggunakan Recharts untuk memantau perolehan suara.
- **Validasi NIS:** Mencegah voting ganda berdasarkan Nomor Induk Siswa.

## Cara Menjalankan

### 1. Persiapan
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

### 2. Instalasi Dependensi
Buka terminal di direktori project dan jalankan:
```bash
npm install
```

### 3. Menjalankan Backend (API)
Buka terminal baru dan jalankan server API:
```bash
npm run server
```
Server akan berjalan di `http://localhost:5000`.

### 4. Menjalankan Frontend (React)
Buka terminal lain dan jalankan aplikasi React:
```bash
npm run dev
```
Aplikasi akan dapat diakses di URL yang muncul di terminal (biasanya `http://localhost:5173`).

## Struktur Project
- `/server`: Berisi logika backend dan database JSON (`db.json`).
- `/src`: Berisi kode React (komponen, style, dan logika aplikasi).
- `index.css`: Global styling dengan prinsip design system modern.

---
Dibuat dengan ❤️ oleh Antigravity.
