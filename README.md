# Jhon338 Bot Panel

Panel + 10 bot WhatsApp. Menjalankan bot, mengelola pengguna, dan membagikan akses panel
ke orang lain via link publik (Cloudflare Tunnel).

## Fitur
- Kelola 10 bot WhatsApp (start, stop, restart)
- Pairing / kode pairing otomatis
- Log real-time per bot
- Logout bot (hapus auth → wajib pairing ulang)
- Multi-user: admin, premium, langganan, member + quota bot
- Akses publik via link Cloudflare Tunnel

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
Skrip menampilkan link publik seperti `https://xxx.trycloudflare.com`.
**Bagikan link itu ke orang lain** — mereka bisa login, assign bot, connect, lihat log.

Tekan `Ctrl+C` untuk menghentikan panel & tunnel.

## Login Admin
- Saat deploy/clone pertama, database panel kosong (tidak ada user).
- **Buat admin pertama** dengan edit database `database/panel.json` atau jalankan sekali
  lewat panel register. Cek `README` setup di bawah.

> Untuk keamanan, ganti password admin default setelah login.

## Struktur
```
server.js            # panel Express + Socket.IO
controllers/ models/ routes/ managers/ middleware/  # logika aplikasi
bots/Bot1..Bot10     # source bot WhatsApp (node_modules di-skip, pakai shared)
termux/start-panel.sh# generat link Cloudflare Tunnel
landing-page/        # halaman statis untuk Vercel (repo terpisah: Panel-Web-Bot)
```

## Catatan
- `node_modules`, folder `auth` bot, `database/panel.json`, dan `.env` TIDAK di-commit
  (lihat `.gitignore`). Setelah clone, `setup.sh` menyiapkannya.
- Folder `auth` bot dikosongkan → setiap bot harus pairing ulang setelah setup.
