# Jhon338 Bot Panel

Panel admin tunggal + **50 bot WhatsApp**. Panel privat untuk pemilik, mengelola bot
start/stop/pairing/log, lengkap dengan statistik sistem.

## Fitur
- Login admin (username + PIN) & **multi-seller** (seller 10 bot / premium 50 bot)
- Dashboard statistik bot, sistem, pendapatan & seller
- Kelola **50 bot** WhatsApp (start, stop, restart, logout)
- Pairing / kode pairing otomatis
- **Sistem sewa bot via chat** (`.sewa` di Bot1) + halaman `/admin/sewa`
- **438+ perintah unik (200+ fitur)** di semua bot: downloader 25, stiker/maker 38, AI chat 16, game 30, tools 46, music 15, edukasi 15, islami 14, primbon 10, random 19, dsb.
- Fitur baru cukup ditambah di `Bot1/plugins` → tersinkron otomatis ke Bot1..Bot50
- Log real-time per bot (auto-refresh via Socket.IO)
- Panduan fitur bot (`/admin/help`)
- Settings: ganti username & PIN

## Cara Pakai di Termux

### 1. Install Termux + dependencies
```bash
pkg update -y && pkg upgrade -y
pkg install nodejs-lts git cloudflared -y
```
Jika `cloudflared` tidak ada di repo Termux:
```bash
npm install -g cloudflared
```
> LocalTunnel (opsi 2) tidak perlu diinstall di Termux — tidak support Android.

### 2. Clone & setup
```bash
cd ~
git clone https://github.com/jhon338-jc/WebPanelBotV1.git
cd WebPanelBotV1
bash setup.sh
```

`setup.sh` akan:
- Membuat `.env` dari `.env.example`
- `npm install` untuk panel
- Membuat **satu** shared `bots/node_modules` dan symlink ke semua bot (hemat ruang)
- **Auto-copy Bot1 → Bot11..Bot50** (50 bot terdukung, masing-masing nama unik)
- **Sinkronkan plugin Bot1 → semua bot** (`scripts/sync-plugin.js`)
- Deteksi/install `ffmpeg` + `imagemagick` (convert) bila perlu: `INSTALL_MEDIA=1 bash setup.sh`
- Pastikan database files tiap bot dibuat
- Verifikasi Jimp 0.22.12 (sharp opsional via `INSTALL_SHARP=1`; fallback jimp)
- Kamu bisa edit `.env` untuk ganti `JWT_SECRET` / `SESSION_SECRET`

Untuk kebutuhan stiker *video / convert* di Termux:
```bash
pkg install -y ffmpeg imagemagick libwebp
```

### 3. Jalankan panel + generate link
```bash
bash termux/start-panel.sh
```
Skrip menampilkan pilihan tunnel:
- **1. Cloudflare** — link acak `https://xxx.trycloudflare.com` (default)
- **2. LocalTunnel** — link custom, **TIDAK support di Termux (Android)**

> ⚠️ LocalTunnel error `Unsupported platform: android` di Termux. Pakai opsi **1 (Cloudflare)**.
> Opsi 2 hanya jalan di Linux/VPS (set `ALLOW_LT=1` bila perlu).

**Bagikan link itu jika ingin mengakses dari HP / perangkat lain** — lalu login dengan
username `JHON338` dan PIN yang sudah diset.
Tekan `Ctrl+C` untuk menghentikan panel & tunnel.

## Login Admin
- Login admin: **Username:** `JHON338` · **PIN:** `030308` → panel `/admin`
- **Seller** login di halaman yang sama dengan username/PIN yang dibuat admin (halaman **Seller**).
- Setelah login, ganti username/PIN lewat menu **Settings** (bilamana perlu).

## Multi-Seller
- Admin membuat akun seller di menu **Seller** (halaman `/admin/sellers`).
- Setiap bot bisa ditugaskan ke 1 seller (`owner`). Bot1 wajib milik admin.
- Seller **biasa**: maks. menyala 10 bot; **premium**: 50 bot. Sisa bot tanpa pemilik milik admin.
- Seller melihat **bot + transaksi sewa miliknya** di `/seller` dan bisa start/stop/restart/verify/cancel sendiri.

## Struktur
```
server.js            # panel Express + Socket.IO
controllers/ models/ routes/ managers/ middleware/  # logika aplikasi
bots/Bot1..Bot50     # source bot WhatsApp (Bot11-50 dibuat otomatis setup.sh)
termux/start-panel.sh# generat link Cloudflare Tunnel
landing-page/        # halaman statis untuk Vercel (repo terpisah: Panel-Web-Bot)
```

## Catatan
- `node_modules`, folder `auth` bot, `.env`, `database/sewa.json` & `database/sellers.json` TIDAK di-commit (lihat `.gitignore`).
  Setelah clone, `setup.sh` menyiapkannya.
- `database/panel.json` **di-commit** (berisi status bot). Setelah `git pull` di HP,
  bot yang pernah dipakai user lama di-reset ke `status: stopped` supaya tampil bot kosong.
- Kredensial login disimpan di `database/settings.json` (default: `JHON338` / `030308`).
- Folder `auth` bot dikosongkan → setiap bot harus pairing ulang setelah setup.
