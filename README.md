# Agenda Diskominfo Kota Semarang

Aplikasi agenda kegiatan dengan pembaca surat berbasis AI dan daftar disposisi.
HTML + CSS + JavaScript murni, satu fungsi serverless (`api/extract.js`).

## Fitur
- Tampilan kartu / daftar, jam dan agenda berikutnya, pencarian, filter jenis, urutan, sematkan agenda
- Detail agenda, tautan Google Meet/Zoom, tambah ke Google Calendar, salin teks untuk WhatsApp
- Disposisi: Arif Kurnia, Michael Anandya, Rahmat Adi, Anggito Bustan, Ridho Risadianto, Chandra Dwi, Danan Nurdiansyah, Lina Munfaroh
- **Baca surat dengan AI**: unggah PDF/gambar surat, AI mengisi form agenda dan menyarankan disposisi
- Ekspor CSV

## Menjalankan lokal
```
npm install
npm run dev
```
Buka http://localhost:3000. Untuk mengaktifkan AI surat, salin `.env.example` menjadi `.env.local` dan isi `ANTHROPIC_API_KEY`, lalu jalankan ulang.

## Deploy ke Vercel (nanti)
1. Unggah folder ini ke GitHub, lalu *Import Project* di Vercel (Framework: Other, tanpa build command).
   Atau jalankan `vercel` dari folder ini.
2. Di *Settings → Environment Variables* tambahkan `ANTHROPIC_API_KEY` (dari console.anthropic.com).
   Opsional: `CLAUDE_MODEL` untuk mengganti model (default `claude-sonnet-4-6`).
3. Redeploy.

## Catatan
- Data agenda disimpan di `localStorage` browser (per perangkat). Untuk dipakai bersama satu tim,
  sambungkan `load()` / `save()` di `app.js` ke database (Vercel KV, Supabase, dsb.).
- Batas ukuran file surat 4 MB (batas request Vercel).
- Nama disposisi dapat diubah di `PEOPLE` pada `app.js` dan `api/extract.js`.

## Struktur
```
public/   -> halaman (index.html, app.js, style.css, assets/)
api/      -> fungsi serverless Vercel (extract.js)
scripts/  -> server lokal (npm run dev)
```
Di Vercel, *Framework Preset* harus **Other**, tanpa Build Command, Output Directory dikosongkan (sudah diatur di vercel.json).
