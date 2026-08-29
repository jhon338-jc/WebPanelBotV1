#!/data/data/com.termux/files/usr/bin/bash
# =====================================================
#  Jhon338 Panel - Generator Link Publik (Cloudflare)
#  Cara pakai:  bash termux/start-panel.sh
#  Hasil: URL https://xxx.trycloudflare.com -> dibagikan
# =====================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3000}"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

# Warna
R="\e[31m"; G="\e[32m"; Y="\e[33m"; C="\e[36m"; B="\e[1m"; N="\e[0m"

trap 'kill $PANEL_PID 2>/dev/null; echo ""; echo "[x] Panel dihentikan."' INT TERM EXIT

echo "======================================================"
echo -e "  ${B}Jhon338 Panel - Link Generator${N}"
echo "======================================================"

# 1) Pastikan cloudflared terpasang
if ! command -v cloudflared >/dev/null 2>&1; then
    echo -e "${R}[!]${N} cloudflared belum terpasang."
    echo "    Install:  pkg install cloudflared"
    echo "    atau   :  npm install -g cloudflared"
    exit 1
fi

# 2) Cek .env sudah dibuat
if [ ! -f .env ]; then
    echo -e "${Y}[!]${N} .env belum ada. Jalankan setup dulu:  bash setup.sh"
    exit 1
fi

# 3) Pastikan node_modules ada
if [ ! -d node_modules ]; then
    echo -e "${Y}[!]${N} node_modules belum ada. Jalankan:  bash setup.sh"
    exit 1
fi

# 4) Hentikan server lama yang mungkin port 3000 terpakai
if lsof -i :$PORT >/dev/null 2>&1; then
    echo -e "${Y}[i]${N} Port $PORT sedang terpakai. Menghentikan proses lama ..."
    fuser -k $PORT/tcp 2>/dev/null || true
    sleep 2
fi

# 5) Jalankan panel
echo -e "${C}[*]${N} Menjalankan panel di port $PORT ..."
node server.js > "$LOG_DIR/panel.out.log" 2>&1 &
PANEL_PID=$!
sleep 4

if ! kill -0 $PANEL_PID 2>/dev/null; then
    echo -e "${R}[!]${N} Panel gagal jalan. Cek log: cat $LOG_DIR/panel.out.log"
    exit 1
fi
echo -e "${G}[+]${N} Panel aktif (PID $PANEL_PID)"

# 6) Buka Cloudflare Tunnel
echo -e "${C}[*]${N} Membuka tunnel Cloudflare ..."
echo ""
echo "======================================================"
echo -e "  ${B}PRINT LINK DI BAWAH INI UNTUK DIBAGIKAN:${N}"
echo -e "  ${B}https://xxxxxxxx.trycloudflare.com${N}"
echo "======================================================"
echo "  Simpan URL itu -> bagikan ke siapa saja."
echo "  Tekan  Ctrl+C  untuk menutup panel & tunnel."
echo "======================================================"
echo ""

cloudflared tunnel --url "http://localhost:$PORT"
