#!/usr/bin/env bash
# ================================================
#  Jhon338 Panel - Setup otomatis (Termux/Linux)
#  Install: node_modules panel + shared node_modules bot
# ================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "================================================"
echo "  Jhon338 Panel - Setup"
echo "================================================"

# 0) Buat .env dari template jika belum ada
if [ ! -f .env ]; then
    [ -f .env.example ] && cp .env.example .env
    echo "[i] .env dibuat dari .env.example. Edit JWT_SECRET/SESSION_SECRET mu!"
else
    echo "[i] .env sudah ada."
fi

# 1) Install dependency panel (root)
if [ ! -d node_modules ]; then
    echo "[*] Install dependency panel ..."
    npm install --no-audit --no-fund
else
    echo "[i] node_modules panel sudah ada, skip."
fi

# 2) Shared node_modules untuk SEMUA bot (Bot1..Bot10)
#    Semua bot memakai bats/package.json identik, jadi 1 folder cukup.
SHARED="$ROOT/bots/node_modules"
if [ ! -d "$SHARED" ] || [ ! -d "$SHARED/pino" ]; then
    echo "[*] Membuat/me-refresh shared node_modules bot di bots/node_modules ..."
    mkdir -p "$ROOT/bots"
    ( cd "$ROOT/bots" && npm install --no-audit --no-fund )
else
    echo "[i] bots/node_modules sudah ada lengkap (pino terdeteksi), skip."
fi

# 2b) Install localtunnel (link custom) - opsional, HANYA untuk Linux/VPS
#     LocalTunnel pakai openurl yang error "Unsupported platform: android" di Termux.
if [ -d /data/data/com.termux ] || ! command -v lt >/dev/null 2>&1; then
    if [ -d /data/data/com.termux ]; then
        echo "[i] LocalTunnel dilewati (tidak support Android/Termux)."
        echo "    Panel akan pakai Cloudflare: bash termux/start-panel.sh"
    elif command -v lt >/dev/null 2>&1; then
        echo "[i] LocalTunnel sudah terpasang, skip."
    else
        echo "[i] LocalTunnel dilewati. Panel tetap pakai Cloudflare."
    fi
fi

# 2c) Auto-copy Bot1 -> Bot11..Bot50 (jika belum ada)
#     50 bot terdukung. Folder hanya berisi Bot1..Bot10 di repo, sisanya di-copy.
MAX_BOTS="${MAX_BOTS:-50}"
echo "[*] Memastikan Bot1..Bot${MAX_BOTS} tersedia (auto-copy bila perlu) ..."
if [ ! -d "$ROOT/bots/Bot1" ]; then
    echo "    [!] Bot1 tidak ditemukan. Clone repo ini dulu dengan benar."
else
    for i in $(seq 11 "$MAX_BOTS"); do
        B="$ROOT/bots/Bot$i"
        if [ -d "$B" ]; then
            echo "    Bot$i -> sudah ada, skip."
        else
            cp -r "$ROOT/bots/Bot1" "$B"
            # Hapus auth & database biar bot bersih (wajib pairing ulang)
            rm -rf "$B/auth" "$B/database" "$B/tmp"
            # Hapus plugin sewa: hanya Bot1 yang jadi bot admin (handle transaksi)
            rm -f "$B/plugins/sewa.js"
            # Set nama unik per bot di config.json
            if command -v node >/dev/null 2>&1; then
                node -e "
                    const fs = require('fs');
                    const p = '$B/config.json';
                    const c = JSON.parse(fs.readFileSync(p, 'utf-8'));
                    c.botName = 'Jhon338 - Bot$i';
                    c.ownerName = c.ownerName || 'JhonChenank$i';
                    fs.writeFileSync(p, JSON.stringify(c, null, 2));
                "
            fi
            echo "    Bot$i -> di-copy dari Bot1 (nama: Jhon338 - Bot$i)"
        fi
    done
fi

# 3) Symlink node_modules tiap bot -> shared
#    Hapus folder node_modules lama (real) lalu ganti symlink ke shared.
echo "[*] Setup symlink node_modules untuk Bot1..Bot${MAX_BOTS} ..."
for i in $(seq 1 "$MAX_BOTS"); do
    B="$ROOT/bots/Bot$i"
    if [ -d "$B" ]; then
        if [ -L "$B/node_modules" ]; then
            echo "    Bot$i -> symlink sudah ada, skip."
        elif [ -d "$B/node_modules" ]; then
            echo "    [!] Bot$i punya node_modules biasa, hapus & ganti symlink ..."
            rm -rf "$B/node_modules"
            ln -s ../node_modules "$B/node_modules"
            echo "    Bot$i -> symlink OK"
        else
            ln -s ../node_modules "$B/node_modules"
            echo "    Bot$i -> symlink OK"
        fi
    fi
done

# 3b) Pastikan sharp (native image lib untuk Baileys updateProfilePicture) jalan
#     Sharp butuh binary native sesuai platform. Kalau gagal load, fallback ke Jimp.
#     Bot pakai shared bots/node_modules, jadi cukup dipastikan di situ.
#     Install sharp tidak wajib -> jangan sampai menghentikan setup (set -e).
echo "[*] Verifikasi library gambar (sharp/jimp) untuk .setpp ..."
if (cd "$ROOT/bots" && node -e "try{require('sharp');process.exit(0)}catch{process.exit(1)}" >/dev/null 2>&1); then
    echo "    sharp OK, skip."
elif [ "${INSTALL_SHARP:-0}" = "1" ]; then
    echo "    sharp tidak bisa load. Coba install binary native sharp ..."
    if ( cd "$ROOT/bots" && npm install sharp --legacy-peer-deps --no-audit --no-fund >/dev/null 2>&1 ); then
        echo "    sharp selesai diinstall."
    else
        echo "    [!] sharp gagal diinstall (dilewati). .setpp akan pakai fallback Jimp 0.22.12."
    fi
else
    echo "    sharp tidak terpasang (opsional). .setpp pakai fallback Jimp 0.22.12."
    echo "    (untuk install sharp: INSTALL_SHARP=1 bash setup.sh)"
fi

if (cd "$ROOT/bots" && node -e "try{require('jimp');process.exit(0)}catch{process.exit(1)}" >/dev/null 2>&1); then
    echo "    jimp OK."
else
    echo "    [!] jimp tidak tersedia, install ulang ..."
    if ( cd "$ROOT/bots" && npm install jimp@0.22.12 --legacy-peer-deps --no-audit --no-fund >/dev/null 2>&1 ); then
        echo "    jimp selesai diinstall (0.22.12)."
    else
        echo "    [!] jimp gagal diinstall! Jalankan ulang npm install di bots/."
        exit 1
    fi
fi

# 4) Auto-create database files tiap bot (jika belum ada)
#    Folder bots/*/database di-.gitignore, jadi setelah git pull pasti kosong.
#    Tanpa file ini bot error ENOENT (monitor.json / role.json).
echo "[*] Pastikan database files ada di Bot1..Bot${MAX_BOTS} ..."
for i in $(seq 1 "$MAX_BOTS"); do
    B="$ROOT/bots/Bot$i"
    if [ -d "$B" ]; then
        mkdir -p "$B/database"
        if [ ! -f "$B/database/monitor.json" ]; then
            echo '{"groups":[],"waiting":false}' > "$B/database/monitor.json"
            echo "    Bot$i/database/monitor.json -> created"
        fi
        if [ ! -f "$B/database/role.json" ]; then
            echo '{"owner":[],"premium":[]}' > "$B/database/role.json"
            echo "    Bot$i/database/role.json -> created"
        fi
    fi
done

echo ""
echo "================================================"
echo "  Setup selesai!"
echo "  Jalankan panel + buka link:  bash termux/start-panel.sh"
echo "================================================"
