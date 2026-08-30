import { EventEmitter } from 'events'
import {
    readSewa,
    writeSewa,
    findTransaksi,
    updateTransaksi,
    addNotification,
    STATUS,
    PAKET,
    formatRupiah
} from '../database/sewa.js'
import { getBotManager } from './BotManager.js'

// Koordinator sewa di sisi panel:
// - Cek expired tiap jam -> stop bot + queued notifikasi (dikirim Bot1)
// - Cek antrian 'menunggu_pairing' -> start bot via BotManager dengan nomor user
// - Dengarkan event pairing-code / bot-status untuk update transaksi + notif user
export class SewaManager extends EventEmitter {
    constructor() {
        super()
        this.botManager = getBotManager()
        this.loopTimer = null
        this.pairingTimer = null
        this.startedFolders = new Set()
        this._bindEvents()
        this._startLoops()
    }

    _bindEvents() {
        this.botManager.on('pairing-code', ({ folder, code }) => {
            const t = findTransaksi(t => t.bot_folder === folder && t.status === STATUS.MENUNGGU_PAIRING)
            if (!t) return
            updateTransaksi(t.id, { pairing_code: code })
            addNotification(t.user_wa,
                `✅ *KODE PAIRING DIBUAT!*\n\n` +
                `📲 *Kode:* \`${code}\`\n\n` +
                `*Cara pairing:*\n` +
                `1. Buka WhatsApp di HP target\n` +
                `2. Menu *⋮* > *Perangkat Tertaut*\n` +
                `3. *Tautkan Perangkat*\n` +
                `4. Masukkan kode di atas\n\n` +
                `Bot: ${t.bot_folder}\n` +
                `Setelah tersambung, bot otomatis aktif.`, t.id)
            this.emit('notification-added', { folder, code })
        })

        this.botManager.on('bot-status', ({ folder, status }) => {
            const t = findTransaksi(t => t.bot_folder === folder && t.status === STATUS.MENUNGGU_PAIRING)
            if (!t) return
            if (status === 'connected') {
                const paket = PAKET[t.paket] || PAKET.bulanan
                const expired_at = paket.durasi_hari > 0
                    ? new Date(Date.now() + paket.durasi_hari * 86400000).toISOString()
                    : null
                updateTransaksi(t.id, {
                    status: STATUS.AKTIF,
                    activated_at: new Date().toISOString(),
                    expired_at,
                    pairing_code: null
                })
                const expText = expired_at
                    ? `Expired: ${new Date(expired_at).toLocaleString('id-ID')}`
                    : 'Expired: Selamanya (Unlimited)'
                addNotification(t.user_wa,
                    `🎉 *BOT AKTIF!*\n\n` +
                    `ID Transaksi: ${t.id}\n` +
                    `Bot: ${folder}\n` +
                    `Paket: ${paket.nama}\n` +
                    `Harga: ${formatRupiah(paket.harga)}\n` +
                    `${expText}\n\n` +
                    `Selamat menggunakan! 🚀`, t.id)
                this.emit('bot-activated', { folder, transaksiId: t.id })
            }
        })

        this.botManager.on('bot-status', ({ folder, status }) => {
            const t = findTransaksi(t => t.bot_folder === folder && t.status === STATUS.AKTIF)
            if (!t || status === 'connected') return
            if (status === 'stopped') {
                // Bot berhenti sebelum expired (crash/stop manual). Kabari user.
                addNotification(t.user_wa,
                    `⚠️ *BOT BERHENTI*\n\nBot ${folder} (${t.id}) berhenti sebelum masa aktif habis.\n` +
                    `Minta admin menyalakan ulang bot.\n\nUntuk status: ketik .sewa status`, t.id)
            }
        })
    }

    _startLoops() {
        // Cek expired tiap 1 jam (3600000 ms); jalankan sekali di awal juga.
        this._expiryLoop()
        this.loopTimer = setInterval(() => this._expiryLoop(), 3600000)

        // Cek antrian pairing tiap 15 detik supaya responsif.
        this._checkPairingQueue()
        this.pairingTimer = setInterval(() => this._checkPairingQueue(), 15000)
    }

    async _expiryLoop() {
        try {
            const sewa = readSewa()
            let changed = false
            for (const t of sewa.transaksi) {
                if (t.status === STATUS.AKTIF && t.expired_at && new Date(t.expired_at) < new Date()) {
                    t.status = STATUS.EXPIRED
                    t.expired_at_real = new Date().toISOString()
                    changed = true
                    if (t.bot_folder) {
                        try { await this.botManager.stopBot(t.bot_folder) } catch (e) {}
                    }
                    addNotification(t.user_wa,
                        `⏰ *MASA AKTIF HABIS*\n\nBot ${t.bot_folder || '-'} (${t.id}) sudah expired.\n\n` +
                        `Untuk perpanjang, kirim *.*sewa* ke bot admin.`, t.id)
                    this.emit('bot-expired', { folder: t.bot_folder, transaksiId: t.id })
                }
            }
            if (changed) writeSewa(sewa)
        } catch (e) {
            console.error('[SEWA] expiry loop error:', e.message)
        }
    }

    async _checkPairingQueue() {
        try {
            const sewa = readSewa()
            const proses = sewa.transaksi.filter(t =>
                t.status === STATUS.MENUNGGU_PAIRING && t.bot_folder && !this.startedFolders.has(t.id))
            for (const t of proses) {
                this.startedFolders.add(t.id)
                const number = String(t.hp || t.user_wa || '').replace(/\D/g, '')
                try {
                    await this.botManager.startBot(t.bot_folder, { ownerNumber: number })
                    this.emit('bot-starting', { folder: t.bot_folder, transaksiId: t.id })
                } catch (e) {
                    this.startedFolders.delete(t.id)
                    addNotification(t.user_wa,
                        `❌ *GAGAL MULAI BOT*\n\n${t.bot_folder}: ${e.message}\nHubungi admin untuk bantuan.`, t.id)
                }
            }
        } catch (e) {
            console.error('[SEWA] pairing queue error:', e.message)
        }
    }

    getStats() {
        const sewa = readSewa()
        const count = s => sewa.transaksi.filter(t => t.status === s).length
        return {
            total: sewa.transaksi.length,
            aktif: count(STATUS.AKTIF),
            menungguPembayaran: count(STATUS.MENUNGGU_PEMBAYARAN),
            menungguVerifikasi: count(STATUS.MENUNGGU_VERIFIKASI),
            expired: count(STATUS.EXPIRED),
            revenue: sewa.transaksi
                .filter(t => [STATUS.AKTIF, STATUS.EXPIRED].includes(t.status))
                .reduce((sum, t) => sum + (PAKET[t.paket]?.harga || 0), 0)
        }
    }

    stop() {
        if (this.loopTimer) clearInterval(this.loopTimer)
        if (this.pairingTimer) clearInterval(this.pairingTimer)
        this.loopTimer = null
        this.pairingTimer = null
    }
}

let instance = null
export function getSewaManager() {
    if (!instance) {
        instance = new SewaManager()
    }
    return instance
}