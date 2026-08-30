# Menjalankan Panel + Bot di Termux (LOCALHOST - khusus admin)

> Panel ini TIDAK pakai tunnel/link publik. Hanya admin yang mengakses
> lewat browser di perangkat yang sama (localhost).

## 1. Install Termux + dependencies

```bash
pkg update -y && pkg upgrade -y
pkg install nodejs-lts git -y
```

Opsional (stiker video / convert file media):
```bash
pkg install -y ffmpeg imagemagick libwebp
```

## 2. Install proyek panel

```bash
# salin/scp folder BotPanel ke Termux, atau clone dari git:
cd ~
git clone https://github.com/jhon338-jc/WebPanelBotV1.git
cd WebPanelBotV1
npm install
bash setup.sh
```

> Catatan: folder `bots/` berisi bot WhatsApp lengkap. `setup.sh` membuat
> shared `bots/node_modules`, lalu symlink ke Bot1 s.d. Bot50.

## 3. Jalankan panel (localhost)

```bash
cd ~/WebPanelBotV1
bash termux/start-panel.sh
```

- Panel aktif di **http://localhost:3000** (bind `127.0.0.1`).
- Tidak ada URL publik. Perangkat lain di luar jaringan TIDAK bisa mengakses.
- Untuk VPS/Linux agar perangkat lain dalam 1 jaringan bisa akses:
  `HOST=0.0.0.0 bash termux/start-panel.sh`
- Tekan `Ctrl+C` untuk berhenti.

## 4. Alur bisnis sewa / jadi bot

User tidak login ke panel. Cukup:
1. Chat ke **bot admin (Bot1)** di WhatsApp
2. Kirim `.sewa` → pilih paket → bayar ke rekening yang tampil
3. Kirim nomor HP / permintaan
4. Transaksi **otomatis tercatat** di panel (`/admin/sewa`)
5. Admin membuka panel, lalu **menambahkan user secara manual**:
   buat akun seller baru (menu **Seller**) → tugaskan bot (assign) → pairing bot.

## 5. Menjaga tetap menyala
- Jangan tutup Termux. Gunakan modul lewat layar
  (`Termux-wake-lock`, atau screen) agar proses tidak di-kill.

## Catatan
- Keamanan lebih ketat dibanding versi tunnel: panel hanya `127.0.0.1`.
- Gunakan password login yang kuat (Settings → ganti PIN).
- Jangan expose folder `bots/` atau `database/` ke publik (sudah dijaga server).