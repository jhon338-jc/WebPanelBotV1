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
#    Semua bot memakai package.json identik, jadi 1 folder cukup.
SHARED="$ROOT/bots/node_modules"
if [ ! -d "$SHARED" ]; then
    echo "[*] Membuat shared node_modules bot di bots/node_modules ..."
    mkdir -p "$ROOT/bots"
    ( cd "$ROOT/bots" && npm install --no-audit --no-fund )
else
    echo "[i] bots/node_modules sudah ada, skip."
fi

# 3) Symlink node_modules tiap bot -> shared
echo "[*] Setup symlink node_modules untuk Bot1..Bot10 ..."
for i in $(seq 1 10); do
    B="bots/Bot$i"
    if [ -d "$B" ]; then
        if [ ! -e "$B/node_modules" ]; then
            ln -s ../node_modules "$B/node_modules"
            echo "    Bot$i -> symlink OK"
        fi
    fi
done

echo ""
echo "================================================"
echo "  Setup selesai!"
echo "  Jalankan panel + buka link:  bash termux/start-panel.sh"
echo "================================================"
