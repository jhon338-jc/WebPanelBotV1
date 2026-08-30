import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEWA_FILE = path.join(__dirname, 'sewa.json')

// Status flow:
// menunggu_pembayaran -> menunggu_verifikasi -> menunggu_nomor
//   -> menunggu_pairing -> aktif (atau batal/expired)
export const STATUS = {
    MENUNGGU_PEMBAYARAN: 'menunggu_pembayaran',
    MENUNGGU_VERIFIKASI: 'menunggu_verifikasi',
    MENUNGGU_NOMOR: 'menunggu_nomor',
    MENUNGGU_PAIRING: 'menunggu_pairing',
    AKTIF: 'aktif',
    EXPIRED: 'expired',
    BATAL: 'batal'
}

// Daftar paket sewa
export const PAKET = {
    mingguan: { id: 'mingguan', nama: 'Paket Mingguan', durasi_hari: 7, harga: 10000, fitur: '100+ basic fitur' },
    bulanan: { id: 'bulanan', nama: 'Paket Bulanan', durasi_hari: 30, harga: 25000, fitur: '150+ premium fitur' },
    unlimited: { id: 'unlimited', nama: 'Paket Unlimited', durasi_hari: 0, harga: 150000, fitur: '200+ full fitur' }
}

export const PAYMENT_INFO = {
    dana: 'DANA: 085134895788 a.n **Jhon Chenank**',
    ovo: 'OVO: 085134895788 a.n **Jhon Chenank**',
    qris: 'QRIS: (kirim .qris untuk kode QR pembayaran)'
}

const defaultSewa = {
    transaksi: [],
    notifications: [],
    counters: { transaksi: 0 }
}

export function initSewa() {
    if (!fs.existsSync(SEWA_FILE)) {
        writeSewa({ ...defaultSewa })
        console.log('[SEWA] database/sewa.json dibuat')
    }
    return SEWA_FILE
}

export function readSewa() {
    if (!fs.existsSync(SEWA_FILE)) initSewa()
    try {
        return JSON.parse(fs.readFileSync(SEWA_FILE, 'utf-8'))
    } catch (e) {
        return { ...defaultSewa }
    }
}

export function writeSewa(data) {
    fs.writeFileSync(SEWA_FILE, JSON.stringify(data, null, 2))
}

export function generateTrxId() {
    const sewa = readSewa()
    const num = (sewa.counters?.transaksi || 0) + 1
    sewa.counters = { ...sewa.counters, transaksi: num }
    writeSewa(sewa)
    return `TRX${String(num).padStart(3, '0')}`
}

export function findTransaksi(predicate) {
    const sewa = readSewa()
    return sewa.transaksi.find(predicate)
}

export function findTransaksiByTrx(id) {
    return findTransaksi(t => t.id.toLowerCase() === String(id).toLowerCase())
}

export function updateTransaksi(id, changes) {
    const sewa = readSewa()
    const idx = sewa.transaksi.findIndex(t => t.id.toLowerCase() === String(id).toLowerCase())
    if (idx === -1) return null
    sewa.transaksi[idx] = { ...sewa.transaksi[idx], ...changes }
    writeSewa(sewa)
    return sewa.transaksi[idx]
}

export function addNotification(to, message, transaksiId = null) {
    const sewa = readSewa()
    sewa.notifications.push({ id: `NOTIF${Date.now()}`, to, message, transaksiId, sent: false, created_at: new Date().toISOString() })
    writeSewa(sewa)
    return sewa.notifications[sewa.notifications.length - 1]
}

export function markNotificationSent(id) {
    const sewa = readSewa()
    const n = sewa.notifications.find(x => x.id === id)
    if (n) { n.sent = true; writeSewa(sewa) }
    return n
}

export function getUnsentNotifications() {
    return readSewa().notifications.filter(n => !n.sent)
}

export function formatRupiah(n) {
    return 'Rp ' + Number(n || 0).toLocaleString('id-ID')
}

export { SEWA_FILE }