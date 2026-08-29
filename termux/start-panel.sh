#!/data/data/com.termux/files/usr/bin/bash
# =====================================================
#  Jhon338 Panel - Generator Link Publik
#  Pilihan tunnel:
#   1) Cloudflare  -> https://xxx.trycloudflare.com (random)
#   2) LocalTunnel -> https://<subdomain>.loca.lt   (custom)
#  Cara pakai:  bash termux/start-panel.sh
# =====================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3000}"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

# Warna
R="\e[31m"; G="\e[32m"; Y="\e[33m"; C="\e[36m"; B="\e[1m"; N="\e[0m"

trap 'kill $PANEL_PID 2>/dev/null; [ -n "$TUN_PID" ] && kill $TUN_PID 2>/dev/null; echo ""; echo "[x] Panel dihentikan."' INT TERM EXIT

echo "======================================================"
echo -e "  ${B}Jhon338 Panel - Link Generator${N}"
echo "======================================================"

# 1) Pastikan .env sudah dibuat
if [ ! -f .env ]; then
    echo -e "${Y}[!]${N} .env belum ada. Jalankan setup dulu:  bash setup.sh"
    exit 1
fi

# 2) Pastikan node_modules ada
if [ ! -d node_modules ]; then
    echo -e "${Y}[!]${N} node_modules belum ada. Jalankan:  bash setup.sh"
    exit 1
fi

# 3) Pilih tunnel
DEFAULT_TUN="${TUNNEL:-localtunnel}"
echo -e "Pilih tunnel:"
echo -e "  1) Cloudflare   (link acak https://xxx.trycloudflare.com)"
echo -e "  2) LocalTunnel  (link custom https://<subdomain>.loca.lt)"
printf "Pilihan [1/2] (default: %s): " "${DEFAULT_TUN}"
read -r CHOICE

case "$CHOICE" in
    2) TUNNEL="localtunnel" ;;
    *) TUNNEL="${DEFAULT_TUN}" ;;
esac

# Subdomain custom untuk localtunnel
LT_SUB="${LT_SUBDOMAIN:-jhon338-panel}"
if [ "$TUNNEL" = "localtunnel" ]; then
    printf "Subdomain yang diinginkan (default: %s): " "$LT_SUB"
    read -r CK
    [ -n "$CK" ] && LT_SUB="$CK"
fi

# 4) Validate tool terpasang
if [ "$TUNNEL" = "cloudflare" ]; then
    if ! command -v cloudflared >/dev/null 2>&1; then
        echo -e "${R}[!]${N} cloudflared belum terpasang."
        echo "    Install:  pkg install cloudflared"
        echo "    atau   :  npm install -g cloudflared"
        exit 1
    fi
    TUN_CMD="cloudflared tunnel --url http://localhost:$PORT"
elif [ "$TUNNEL" = "localtunnel" ]; then
    if ! command -v lt >/dev/null 2>&1; then
        echo -e "${R}[!]${N} localtunnel belum terpasang."
        echo "    Install:  npm install -g localtunnel"
        exit 1
    fi
    TUN_CMD="lt --port $PORT --subdomain $LT_SUB"
else
    echo -e "${R}[!]${N} Tunnel tidak dikenal: $TUNNEL"
    exit 1
fi

# 5) Hentikan server lama yang mungkin port 3000 terpakai
if lsof -i :$PORT >/dev/null 2>&1; then
    echo -e "${Y}[i]${N} Port $PORT sedang terpakai. Menghentikan proses lama ..."
    fuser -k $PORT/tcp 2>/dev/null || true
    sleep 2
fi

# 6) Jalankan panel
echo -e "${C}[*]${N} Menjalankan panel di port $PORT ..."
node server.js > "$LOG_DIR/panel.out.log" 2>&1 &
PANEL_PID=$!
sleep 4

if ! kill -0 $PANEL_PID 2>/dev/null; then
    echo -e "${R}[!]${N} Panel gagal jalan. Cek log: cat $LOG_DIR/panel.out.log"
    exit 1
fi
echo -e "${G}[+]${N} Panel aktif (PID $PANEL_PID)"

# 7) Buka tunnel terpilih
echo -e "${C}[*]${N} Membuka tunnel $TUNNEL ..."
echo ""
echo "======================================================"
if [ "$TUNNEL" = "cloudflare" ]; then
    echo -e "  ${B}PRINT LINK DI BAWAH INI UNTUK DIBAGIKAN:${N}"
    echo -e "  ${B}https://xxxxxxxx.trycloudflare.com${N}"
else
    echo -e "  ${B}LINK PANEL:${N}  https://$LT_SUB.loca.lt"
    echo -e "  ${Y}Jika subdomain $LT_SUB sudah dipakai orang, gunakan yang lain.${N}"
fi
echo "======================================================"
echo "  Simpan URL itu -> bagikan ke siapa saja."
echo "  Tekan  Ctrl+C  untuk menutup panel & tunnel."
echo "======================================================"
echo ""

# 8) Pertahankan variabel saat tunnel, jalankan sebagai background biar panel+help terbaca
$TUN_CMD &
TUN_PID=$!

# Tunggu Ctrl+C
wait $TUN_PID
