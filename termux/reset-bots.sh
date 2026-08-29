#!/data/data/com.termux/files/usr/bin/bash
# =====================================================
#  Reset assignment & status SEMUA bot -> stopped/kosong
#  Jalankan di HP setelah git pull bila user lama masih
#  "konek" ke bot (Bot3 dll).
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
    if (b.assigned_to !== null || b.status !== "stopped" || b.connected !== false) n++;
    b.assigned_to = null;
    b.status = "stopped";
    b.connected = false;
    b.pid = null;
    b.pairingCode = null;
});
fs.writeFileSync(process.argv[1], JSON.stringify(db, null, 2));
console.log("Reset selesai! " + n + " bot di-reset ke stopped/kosong.");
' "$DB"

echo "Sekarang jalankan:  bash termux/start-panel.sh"
