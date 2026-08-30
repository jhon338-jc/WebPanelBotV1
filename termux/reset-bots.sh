#!/data/data/com.termux/files/usr/bin/bash
# =====================================================
#  Reset status SEMUA bot -> stopped/kosong
#  Jalankan di HP setelah git pull bila bot masih ada yang
#  "konek" (connected) dari sesi sebelumnya.
#  Cara pakai:  bash termux/reset-bots.sh
# =====================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/database/panel.json"

if [ ! -f "$DB" ]; then
    echo "[!] $DB tidak ditemukan."
    exit 1
fi

node -e '
const fs = require("fs");
const db = JSON.parse(fs.readFileSync(process.argv[1], "utf-8"));
let n = 0;
db.bots.forEach(b => {
    if (b.status !== "stopped" || b.connected !== false) n++;
    b.status = "stopped";
    b.connected = false;
    b.pid = null;
    b.pairingCode = null;
});
fs.writeFileSync(process.argv[1], JSON.stringify(db, null, 2));
console.log("Reset selesai! " + n + " bot di-reset ke stopped/kosong.");
' "$DB"

echo "Sekarang jalankan:  bash termux/start-panel.sh"
