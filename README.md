# Jhon338 Bot Panel

Panel admin tunggal + 10 bot WhatsApp. Panel privat untuk pemilik, mengelola bot
start/stop/pairing/log, lengkap dengan statistik sistem.

## Fitur
- Login admin tunggal (username + PIN)
- Dashboard statistik bot & info sistem
- Kelola 10 bot WhatsApp (start, stop, restart, logout)
- Pairing / kode pairing otomatis
- Log real-time per bot (auto-refresh via Socket.IO)
- Panduan fitur bot (daftar perintah)
- Settings: ganti username & PIN
- Akses via link Cloudflare Tunnel

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
- Kamu bisa edit `.env` untuk ganti `JWT_SECRET` / `SESSION_SECRET`

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
- Login tunggal: **Username:** `JHON338` · **PIN:** `030308`
- Setelah login, ganti username/PIN lewat menu **Settings** (bilamana perlu).

## Struktur
```
server.js            # panel Express + Socket.IO
controllers/ models/ routes/ managers/ middleware/  # logika aplikasi
bots/Bot1..Bot10     # source bot WhatsApp (node_modules di-skip, pakai shared)
termux/start-panel.sh# generat link Cloudflare Tunnel
landing-page/        # halaman statis untuk Vercel (repo terpisah: Panel-Web-Bot)
```

## Catatan
- `node_modules`, folder `auth` bot, dan `.env` TIDAK di-commit (lihat `.gitignore`).
  Setelah clone, `setup.sh` menyiapkannya.
- `database/panel.json` **di-commit** (berisi status bot). Setelah `git pull` di HP,
  bot yang pernah dipakai user lama di-reset ke `status: stopped` supaya tampil 10 bot kosong.
- Kredensial login disimpan di `database/settings.json` (default: `JHON338` / `030308`).
- Folder `auth` bot dikosongkan → setiap bot harus pairing ulang setelah setup.
