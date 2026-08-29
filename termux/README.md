# Menjalankan Panel + Bot di Termux & Membagikan Link ke Orang Lain

## 1. Install Termux + dependencies

```bash
pkg update -y && pkg upgrade -y
pkg install nodejs-lts git cloudflared -y
```

Jika `cloudflared` tidak tersedia di repo Termux, install lewat npm:
```bash
npm install -g cloudflared
```

## 2. Install proyek panel

```bash
# salin/scp folder BotPanel ke Termux, atau clone dari git:
cd ~
git clone https://github.com/jhon338-jc/Panel-Web-Bot.git
cd Panel-Web-Bot
npm install
```

> Catatan: folder `bots/` berisi bot WhatsApp lengkap (dengan `node_modules` botnya).
> Pastikan folder `bots/Bot1` s.d. `Bot10` ikut terbawa ketika dipindah ke Termux.

## 3. Jalankan panel + tunnel (satu perintah)

```bash
cd ~/Panel-Web-Bot
bash termux/start-panel.sh
```

Skrip akan:
1. Menjalankan `server.js` (panel) di port 3000
2. Membuka tunnel Cloudflare
3. Menampilkan URL publik seperti: `https://random-xxx.trycloudflare.com`

**Bagikan URL itu ke orang lain.** Mereka akan langsung bisa `login`, `assign bot`,
`connect`, `lihat log` dan `logout` bot — semuanya lewat browser.

## 4. Menjaga tetap menyala
- Jangan tutup Termux / biarkan tetap aktif (lewat `Screen` atau notifikasi, pastikan proses tidak di-kill).
- Panel dijalankan di background, tunnel berjalan di foreground.

## 5. Perbaikan keamanan yang sudah diterapkan di server.js
- `app.set('trust proxy', 1)` → HTTPS dari Cloudflare Tunnel dikenali benar.
- `server.listen(PORT, '0.0.0.0')` → bisa diakses dari jaringan luar / tunnel.

## Catatan penting
- URL `trycloudflare.com` **berubah setiap restart**. Untuk URL permanen, buat
  named tunnel di dashboard Cloudflare dengan domainmu sendiri.
- Gunakan password login yang kuat, karena halaman panel kini dapat diakses publik.
- Jangan expose folder `bots/` atau `database/panel.json` ke publik (sudah dijaga oleh server).
