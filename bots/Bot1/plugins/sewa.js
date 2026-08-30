import fs from 'fs'
import path from 'path'
import config from '../config.json' with { type: 'json' }

// ============================================================
//  SISTEM SEWA BOT VIA CHAT (BERJALAN DI Bot1 = bot admin)
//
//  Alur:
//   .sewa            -> tampilkan paket (mingguan/bulanan/unlimited)
//   .sewa <paket>    -> buat transaksi, tampilkan info pembayaran
//   [kirim bukti]    -> status menunggu_verifikasi + notif admin
//   .verify TRXxxx   -> admin verifikasi, bot minta nomor HP user
//   [kirim nomor]    -> assign bot, status menunggu_pairing
//                       (panel start bot + kode pairing dikirim ke user)
//   [bot tersambung] -> status aktif + expired_at di-set oleh panel
//   [expired]        -> panel stop bot + notif "masa aktif habis"
//
//  Notifikasi panel (kode pairing / bot aktif / expired / dll) dikirim
//  lewat loop polling di bawah (baca ../../database/sewa.json).
// ============================================================

const SEWA_FILE = '../../database/sewa.json'

// Kalau bukan Bot1, plugin ini inert (tidak daftar command, tidak polling).
// Folder Bot11..50 ikut menyalin sewa.js; ini mencegah mereka ikut jalan.
const ACTIVE_HERE = path.basename(process.cwd()) === 'Bot1'

const PAKET = {
    mingguan: { id: 'mingguan', nama: 'Paket Mingguan', durasi: 7, harga: 10000, fitur: '100+ basic fitur' },
    bulanan: { id: 'bulanan', nama: 'Paket Bulanan', durasi: 30, harga: 25000, fitur: '150+ premium fitur' },
    unlimited: { id: 'unlimited', nama: 'Paket Unlimited', durasi: 0, harga: 150000, fitur: '200+ full fitur' }
}

const PAYMENT_TEXT = [
    '💳 *Metode Pembayaran:*',
    '',
    '• *DANA* : 085134895788 a.n Jhon Chenank',
    '• *OVO*  : 085134895788 a.n Jhon Chenank',
    '• *QRIS* : minta QR ke admin',
    '',
    'Setelah transfer, kirim *bukti pembayaran* (foto/screenshot) ke bot ini.'
].join('\n')

const STATUS = {
    MENUNGGU_PEMBAYARAN: 'menunggu_pembayaran',
    MENUNGGU_VERIFIKASI: 'menunggu_verifikasi',
    MENUNGGU_NOMOR: 'menunggu_nomor',
    MENUNGGU_PAIRING: 'menunggu_pairing',
    AKTIF: 'aktif',
    EXPIRED: 'expired',
    BATAL: 'batal'
}

function readSewa() {
    try {
        if (!fs.existsSync(SEWA_FILE)) return { transaksi: [], notifications: [], counters: { transaksi: 0 } }
        return JSON.parse(fs.readFileSync(SEWA_FILE, 'utf-8'))
    } catch (e) {
        return { transaksi: [], notifications: [], counters: { transaksi: 0 } }
    }
}

function writeSewa(data) {
    fs.writeFileSync(SEWA_FILE, JSON.stringify(data, null, 2))
}

function generateTrxId() {
    const sewa = readSewa()
    const num = (sewa.counters?.transaksi || 0) + 1
    sewa.counters = { ...sewa.counters, transaksi: num }
    writeSewa(sewa)
    return `TRX${String(num).padStart(3, '0')}`
}

function findTrx(predicate) {
    return readSewa().transaksi.find(predicate)
}

const cleanJid = num => String(num).replace(/[^\d]/g, '')
const formatRp = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

const menuText = () => {
    let t = `🤖 *JASA SEWA BOT WHATSAPP*\n\n`
    t += `Pilih paket di bawah ini:\n\n`
    Object.values(PAKET).forEach((p, i) => {
        t += `${i + 1}. *${p.nama}*\n`
        t += `   ${p.fitur}\n`
        t += `   ${p.durasi > 0 ? '⏱ ' + p.durasi + ' hari' : '♾ Selamanya'}\n`
        t += `   💰 ${formatRp(p.harga)}\n\n`
    })
    t += `Cara order:\n*.*sewa mingguan* / *.sewa bulanan* / *.sewa unlimited*\n`
    t += `atau *.*sewa 1* / *2* / *3*`
    return t
}

const statusText = t => {
    let x = `📋 *Status Transaksi*\n\n`
    x += `▧ ID : ${t.id || '-'}\n`
    x += `▧ User : ${t.user_wa || '-'}\n`
    x += `▧ Paket : ${PAKET[t.paket]?.nama || t.paket || '-'}\n`
    x += `▧ Bot : ${t.bot_folder || 'belum'}\n`
    x += `▧ Status : ${t.status || '-'}\n`
    if (t.expired_at) x += `▧ Expired : ${new Date(t.expired_at).toLocaleString('id-ID')}\n`
    if (t.pairing_code) x += `▧ Kode Pairing : ${t.pairing_code}\n`
    return x
}

// Kirim pesan ke user: langsung via conn, fallback queue notifikasi
async function notifyUser(conn, number, message, trxId = null) {
    const jid = cleanJid(number)
    const fallback = () => {
        const sewa = readSewa()
        sewa.notifications.push({
            id: 'NOTIF' + Date.now(),
            to: jid, message, transaksiId: trxId,
            sent: false, created_at: new Date().toISOString()
        })
        writeSewa(sewa)
    }
    if (conn && /^62\d{8,13}$/.test(jid)) {
        try {
            await conn.sendMessage(jid + '@s.whatsapp.net', { text: message })
            return
        } catch (e) {}
    }
    fallback()
}

// Notifikasi ke nomor admin (creator)
async function notifyAdmins(conn, text) {
    if (!conn) return
    for (const num of (config.creator || [])) {
        try {
            await conn.sendMessage(cleanJid(num) + '@s.whatsapp.net', { text })
        } catch (e) {}
    }
}

// Pilih bot gratis (Bot2..Bot50) yang tidak dipakai transaksi aktif/sewa
function pickFreeBot() {
    const sewa = readSewa()
    const inUse = new Set(
        sewa.transaksi
            .filter(t => (t.status === STATUS.MENUNGGU_PAIRING || t.status === STATUS.AKTIF) && t.bot_folder)
            .map(t => t.bot_folder)
    )
    for (let i = 2; i <= 50; i++) {
        const folder = `Bot${i}`
        if (!inUse.has(folder)) return folder
    }
    return null
}

// ---------------- Handler command ----------------
let handler = async (m, { conn, text, args, command }) => {
    if (m.isGroup) return
    if (!ACTIVE_HERE) return
    global._sewaConn = conn
    const number = m.sender.split('@')[0]
    const isAdmin = (config.creator || []).includes(number)
    const full = text || args.join(' ')

    // Keadaan khusus: user mengirim nomor HP saat menunggu_nomor (customPrefix)
    if (command === '' && /^62\d{8,13}$/.test(full.replace(/\s/g, ''))) {
        const trx = findTrx(t => t.user_wa === number && t.status === STATUS.MENUNGGU_NOMOR)
        if (!trx) return
        const hp = full.replace(/\D/g, '')
        const folder = pickFreeBot()
        if (!folder) {
            await conn.sendMessage(m.chat, { text: '❌ Semua bot sedang terpakai! Hubungi admin.' })
            await notifyAdmins(conn, `⚠️ User ${number} ingin sewa tapi semua bot penuh.`)
            return
        }
        const sewa = readSewa()
        const target = sewa.transaksi.find(t => t.id === trx.id)
        target.hp = hp
        target.bot_folder = folder
        target.bot_wa = hp
        target.status = STATUS.MENUNGGU_PAIRING
        writeSewa(sewa)
        await conn.sendMessage(m.chat, {
            text: `📲 *PROSES PAIRING*\n\n` +
                `Nomor: +${hp}\nBot: ${folder}\n\n` +
                `Bot sedang disiapkan. *Kode pairing* akan dikirim ke nomor WhatsApp kamu dalam beberapa saat.\n\n` +
                `Pastikan nomor +${hp} login di WhatsApp yang benar.`
        })
        await notifyAdmins(conn, `🖥️ ${trx.id} → nomor +${hp} diterima, bot ${folder} akan di-pairing.`)
        return
    }

    // 1) .sewa -> menu / order / list / status / stop
    if (command === 'sewa') {
        const arg = full.toLowerCase().trim()

        if (arg === 'list') {
            if (!isAdmin) return conn.sendMessage(m.chat, { text: '❌ Khusus admin!' })
            const sewa = readSewa()
            if (sewa.transaksi.length === 0) return conn.sendMessage(m.chat, { text: 'Belum ada transaksi.' })
            let t = '📊 *DAFTAR TRANSAKSI*\n\n'
            sewa.transaksi.slice().reverse().forEach((trx, i) => {
                t += `${i + 1}. ${trx.id} | ${trx.user_wa} | ${trx.paket} | ${trx.status} | ${trx.bot_folder || '-'}\n`
            })
            return conn.sendMessage(m.chat, { text: t })
        }

        if (arg === 'status') {
            const trx = findTrx(t => t.user_wa === number)
            if (!trx) return conn.sendMessage(m.chat, { text: 'Kamu belum punya transaksi sewa.\n\n' + menuText() })
            return conn.sendMessage(m.chat, { text: statusText(trx) })
        }

        if (arg === 'stop') {
            if (!isAdmin) return conn.sendMessage(m.chat, { text: '❌ Khusus admin!' })
            const trxId = (args[1] || '').toUpperCase()
            if (!/^TRX\d+$/.test(trxId)) return conn.sendMessage(m.chat, { text: 'Format: .sewa stop TRX001' })
            const trx = findTrx(t => t.id.toLowerCase() === trxId.toLowerCase())
            if (!trx) return conn.sendMessage(m.chat, { text: `Transaksi ${trxId} tidak ditemukan` })
            const wasActive = [STATUS.MENUNGGU_PAIRING, STATUS.AKTIF].includes(trx.status)
            const sewa = readSewa()
            const target = sewa.transaksi.find(t => t.id === trx.id)
            target.status = STATUS.BATAL
            target.cancelled_at = new Date().toISOString()
            if (trx.bot_folder && wasActive) {
                sewa.notifications.push({
                    id: 'STOP' + Date.now(),
                    to: number,
                    message: `⏹️ ${trx.bot_folder} (${trx.id}) berhenti. Stop bot dari panel admin ya.`,
                    transaksiId: trx.id, sent: false, created_at: new Date().toISOString()
                })
            }
            writeSewa(sewa)
            return conn.sendMessage(m.chat, { text: `✅ ${trx.id} dibatalkan.` })
        }

        // Order
        let paket
        const byIndex = ['1', '2', '3'].includes(arg) ? ['mingguan', 'bulanan', 'unlimited'][parseInt(arg) - 1] : null
        paket = PAKET[byIndex] || PAKET[arg]
        if (!paket) return conn.sendMessage(m.chat, { text: '❌ Paket tidak dikenali.\n\n' + menuText() })

        const aktif = findTrx(t => t.user_wa === number &&
            [STATUS.MENUNGGU_PEMBAYARAN, STATUS.MENUNGGU_VERIFIKASI, STATUS.MENUNGGU_NOMOR, STATUS.MENUNGGU_PAIRING].includes(t.status))
        if (aktif) {
            return conn.sendMessage(m.chat, { text: `⚠️ Kamu masih punya transaksi aktif: *${aktif.id}* (${aktif.status}).\nTunggu selesai atau minta admin batalkan.` })
        }

        const trxId = generateTrxId()
        const sewa = readSewa()
        sewa.transaksi.push({
            id: trxId,
            user_wa: number,
            paket: paket.id,
            harga: paket.harga,
            status: STATUS.MENUNGGU_PEMBAYARAN,
            created_at: new Date().toISOString(),
            verified_at: null,
            bot_wa: null,
            bot_folder: null,
            expired_at: null
        })
        writeSewa(sewa)

        let t = `🧾 *ORDER DIBUAT: ${trxId}*\n\n`
        t += `▧ User : ${number}\n`
        t += `▧ Paket : ${paket.nama}\n`
        t += `▧ Harga : ${formatRp(paket.harga)}\n\n`
        t += PAYMENT_TEXT
        await conn.sendMessage(m.chat, { text: t })
        await notifyAdmins(conn, `📥 *ORDER BARU ${trxId}*\n\nUser: ${number}\nPaket: ${paket.nama}\nHarga: ${formatRp(paket.harga)}\n\nMenunggu pembayaran & verifikasi.`)
        return
    }

    // 2) .verify TRXxxx (admin)
    if (command === 'verify') {
        if (!isAdmin) return conn.sendMessage(m.chat, { text: '❌ Khusus admin!' })
        const trxId = (args[0] || full).toUpperCase()
        const trx = findTrx(t => t.id.toLowerCase() === trxId.toLowerCase())
        if (!trx) return conn.sendMessage(m.chat, { text: `Transaksi ${trxId} tidak ditemukan` })
        if (trx.status !== STATUS.MENUNGGU_VERIFIKASI && trx.status !== STATUS.MENUNGGU_PEMBAYARAN) {
            return conn.sendMessage(m.chat, { text: `Status ${trx.id} sekarang: ${trx.status}. Tidak bisa verify.` })
        }
        const sewa = readSewa()
        const target = sewa.transaksi.find(t => t.id === trx.id)
        target.status = STATUS.MENUNGGU_NOMOR
        target.verified_at = new Date().toISOString()
        writeSewa(sewa)
        await conn.sendMessage(m.chat, { text: `✅ *${target.id} DIVERIFIKASI*\n\nUser ${target.user_wa} akan diminta mengirim nomor HP.` })
        await notifyUser(conn, target.user_wa,
            `✅ *PEMBAYARAN TERVERIFIKASI!*\n\n` +
            `Transaksi ${target.id} sudah diverifikasi.\n\n` +
            `Balas dengan *nomor HP* yang mau dipakai bot.\n` +
            `Format: \`628xxxxxxxxxx\``, target.id)
        return
    }

    // 3) .bayar TRXxxx (user lapor sudah bayar)
    if (command === 'bayar') {
        const trxId = (args[0] || full).toUpperCase()
        const trx = findTrx(t => t.id.toLowerCase() === trxId.toLowerCase() && t.user_wa === number)
        if (!trx) return conn.sendMessage(m.chat, { text: `Transaksi ${trxId} tidak ditemukan untuk nomor ini.` })
        if ([STATUS.MENUNGGU_VERIFIKASI, STATUS.MENUNGGU_NOMOR, STATUS.MENUNGGU_PAIRING].includes(trx.status)) {
            return conn.sendMessage(m.chat, { text: `✅ Transaksi ${trxId} sudah menunggu verifikasi/admin.` })
        }
        if (trx.status !== STATUS.MENUNGGU_PEMBAYARAN) {
            return conn.sendMessage(m.chat, { text: `Transaksi ${trxId} statusnya: ${trx.status}.` })
        }
        const sewa = readSewa()
        const target = sewa.transaksi.find(t => t.id === trx.id)
        target.status = STATUS.MENUNGGU_VERIFIKASI
        writeSewa(sewa)
        await conn.sendMessage(m.chat, { text: `✅ *${trxId} menunggu verifikasi admin.*\n\nAdmin akan memverifikasi bukti bayar kamu. Boleh langsung kirim screenshotnya juga.` })
        await notifyAdmins(conn, `🔔 *USER LAPOR BAYAR*\n\n${trxId}\nUser: ${number}\nPaket: ${trx.paket}\n\nVerify dengan : *.verify ${trxId}*`)
        return
    }

    // 4) User kirim media (bukti bayar) saat menunggu_pembayaran
    if (m.mtype && /image|video|document/.test(m.mtype)) {
        const trx = findTrx(t => t.user_wa === number && t.status === STATUS.MENUNGGU_PEMBAYARAN)
        if (!trx) return
        const sewa = readSewa()
        const target = sewa.transaksi.find(t => t.id === trx.id)
        target.status = STATUS.MENUNGGU_VERIFIKASI
        writeSewa(sewa)
        await conn.sendMessage(m.chat, { text: `✅ *Bukti terkirim!* ${trx.id} menunggu verifikasi admin.` })
        await notifyAdmins(conn, `🧾 *BUKTI BAYAR MASUK*\n\n${trx.id}\nUser: ${number}\nPaket: ${trx.paket}\n\nCek bukti lalu verify: *.verify ${trx.id}*`)
        return
    }
}

handler.command = ['sewa', 'verify', 'bayar']
handler.customPrefix = /^62\d{8,13}$/
export default handler

// ---------------- Binder (dipanggil dari index.js tiap bot saat open) ----------------
export function initSewa(conn) {
    global._sewaConn = conn
}

// ---------------- Notifikasi polling ----------------
// Kirim notifikasi yang di-queue panel (kode pairing, bot aktif, expired, dll)
function startNotifLoop() {
    if (!ACTIVE_HERE) return
    setInterval(async () => {
        try {
            if (!fs.existsSync(SEWA_FILE)) return
            const sewa = readSewa()
            const pending = sewa.notifications.filter(n => !n.sent)
            if (pending.length === 0) return
            const conn = global._sewaConn
            for (const n of pending) {
                const jid = cleanJid(n.to)
                if (conn && /^62\d{8,13}$/.test(jid)) {
                    try {
                        await conn.sendMessage(jid + '@s.whatsapp.net', { text: n.message })
                    } catch (e) {}
                }
                sewa.notifications[sewa.notifications.findIndex(x => x.id === n.id)].sent = true
            }
            writeSewa(sewa)
        } catch (e) {}
    }, 10000)
}

startNotifLoop()