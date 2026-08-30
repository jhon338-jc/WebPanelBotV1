#!/data/data/com.termux/files/usr/bin/bash
# =====================================================
#  Jhon338 Panel - Jalankan di LOCALHOST (khusus admin)
#  Tanpa tunnel. Admin akses via browser di HP/PC yang
#  sama (localhost). Untuk VPS/Linux bisa HOST=0.0.0.0.
#
#  Alur bisnis:
#    User yang mau sewa cukup CHAT ke bot admin (Bot1)
#    dengan .sewa -> bayar -> kirim nomor/permintaan.
#    Semua data masuk otomatis ke web panel. Admin lalu
#    on-boarding manual (pairing/aktifkan bot) di panel.
#
#  Pakai:  bash termux/start-panel.sh
# =====================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

R="\e[31m"; G="\e[32m"; Y="\e[33m"; C="\e[36m"; B="\e[1m"; N="\e[0m"

trap 'kill $PANEL_PID 2>/dev/null; echo ""; echo -e "${R}[x]${N} Panel dihentikan."' INT TERM EXIT

echo "======================================================"
echo -e "  ${B}Jhon338 Panel - Localhost${N}"
echo "======================================================"

# 1) Pastikan .env sudah ada
if [ ! -f .env ]; then
    echo -e "${Y}[!]${N} .env belum ada. Jalankan setup dulu:  bash setup.sh"
    exit 1
fi

# 2) Pastikan node_modules ada
if [ ! -d node_modules ]; then
    echo -e "${Y}[!]${N} node_modules belum ada. Jalankan:  bash setup.sh"
    exit 1
fi

# 3) Hentikan server lama yang mungkin port $PORT terpakai
if command -v fuser >/dev/null 2>&1; then
    fuser -k $PORT/tcp >/dev/null 2>&1 && echo -e "${Y}[i]${N} Proses lama di port $PORT dihentikan." && sleep 2
elif command -v lsof >/dev/null 2>&1; then
    if lsof -i :$PORT >/dev/null 2>&1; then
        echo -e "${Y}[i]${N} Proses lama di port $PORT dihentikan."
        lsof -ti :$PORT | xargs -r kill -9 2>/dev/null || true
        sleep 2
    fi
elif pgrep -f "node server.js" >/dev/null 2>&1; then
    echo -e "${Y}[i]${N} Proses node server.js lama dihentikan."
    pkill -f "node server.js" 2>/dev/null || true
    sleep 2
fi

# 4) Jalankan panel
echo -e "${C}[*]${N} Menjalankan panel di http://${HOST}:${PORT} ..."
HOST="$HOST" node server.js > "$LOG_DIR/panel.out.log" 2>&1 &
PANEL_PID=$!
sleep 3

if ! kill -0 $PANEL_PID 2>/dev/null; then
    echo -e "${R}[!]${N} Panel gagal jalan. Cek log: cat $LOG_DIR/panel.out.log"
    exit 1
fi

echo ""
echo "======================================================"
echo -e "  ${B}PANEL AKTIF (PID $PANEL_PID)${N}"
echo -e "  ${G}Buka di browser perangkat ini:${N}  http://localhost:${PORT}"
if [ "$HOST" = "0.0.0.0" ]; then
    LAN_IP="$( (hostname -I 2>/dev/null || ip addr show 2>/dev/null) | grep -oE '192\.168\.[0-9]+\.[0-9]+' | head -1 )"
    [ -n "$LAN_IP" ] && echo -e "  ${Y}Dari perangkat WiFi sama:${N}        http://${LAN_IP}:${PORT}"
fi
echo ""
echo -e "  ${C}CATATAN:${N} Panel ini KHUSUS ADMIN. TIDAK perlu link publik."
echo -e "  User yang mau sewa cukup chat ke bot admin (Bot1)"
echo -e "  -> .sewa -> bayar -> kirim nomor. Datanya masuk ke sini."
echo -e "  Tekan ${B}Ctrl+C${N} untuk berhenti."
echo "======================================================"

wait $PANEL_PID 2>/dev/null