import { getBotManager } from '../managers/BotManager.js'
import {
    readSewa,
    findTransaksiByTrx,
    updateTransaksi,
    addNotification,
    STATUS,
    PAKET,
    formatRupiah
} from '../database/sewa.js'
import { logger } from '../utils/logger.js'
import { formatDateTime } from '../utils/helpers.js'

function normalizeTransaksi(t) {
    const paket = PAKET[t.paket] || null
    return {
        ...t,
        paketNama: paket?.nama || t.paket,
        harga: paket?.harga || t.harga || 0,
        hargaFormatted: formatRupiah(paket?.harga || t.harga || 0),
        botNama: t.bot_folder ? t.bot_folder : 'belum dipilih'
    }
}

export class SewaController {
    static async dashboard(req, res) {
        try {
            const sewa = readSewa()
            const botManager = getBotManager()
            const transaksi = [...sewa.transaksi].reverse().map(normalizeTransaksi)
            const stats = {
                total: sewa.transaksi.length,
                aktif: sewa.transaksi.filter(t => t.status === STATUS.AKTIF).length,
                menungguPembayaran: sewa.transaksi.filter(t => t.status === STATUS.MENUNGGU_PEMBAYARAN).length,
                menungguVerifikasi: sewa.transaksi.filter(t => t.status === STATUS.MENUNGGU_VERIFIKASI).length,
                menungguNomor: sewa.transaksi.filter(t => t.status === STATUS.MENUNGGU_NOMOR).length,
                expired: sewa.transaksi.filter(t => t.status === STATUS.EXPIRED).length,
                revenue: sewa.transaksi
                    .filter(t => [STATUS.AKTIF, STATUS.EXPIRED].includes(t.status))
                    .reduce((sum, t) => sum + (PAKET[t.paket]?.harga || 0), 0)
            }
            const botAvailability = Array.from({ length: 50 }, (_, i) => {
                const folder = `Bot${i + 1}`
                return { folder, nama: folder, inUse: sewa.transaksi.some(t =>
                    t.bot_folder === folder && [STATUS.MENUNGGU_PAIRING, STATUS.AKTIF].includes(t.status)) }
            }).filter(b => b.folder !== 'Bot1')
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, stats, transaksi, botAvailability })
            }
            res.render('admin/sewa', {
                title: 'Kelola Sewa',
                stats,
                transaksi,
                botAvailability,
                formatDateTime,
                STATUS,
                PAKET
            })
        } catch (e) {
            logger.error('Sewa dashboard error:', e)
            return res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async verifyPayment(req, res) {
        try {
            const { id } = req.params
            const trx = findTransaksiByTrx(id)
            if (!trx) {
                return res.status(404).json({ success: false, message: `Transaksi ${id} tidak ditemukan` })
            }
            if (trx.status !== STATUS.MENUNGGU_VERIFIKASI && trx.status !== STATUS.MENUNGGU_PEMBAYARAN) {
                return res.status(400).json({ success: false, message: `Status ${trx.status} tidak bisa diverifikasi` })
            }
            updateTransaksi(trx.id, { status: STATUS.MENUNGGU_NOMOR, verified_at: new Date().toISOString(), verified_by: req.user?.username || 'admin' })
            addNotification(trx.user_wa,
                `✅ *PEMBAYARAN TERVERIFIKASI!*\n\n` +
                `Transaksi ${trx.id} sudah diverifikasi.\n\n` +
                `Balas pesan ini dengan *nomor HP* yang mau dipakai bot.\n` +
                `Format: \`628xxxxxxxxxx\` (tanpa tanda + / spasi)`, trx.id)
            logger.info(`Admin verifikasi ${trx.id}`)
            return res.json({ success: true, message: `${trx.id} diverifikasi, menunggu nomor user` })
        } catch (e) {
            logger.error('Verify sewa error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async cancelSewa(req, res) {
        try {
            const { id } = req.params
            const trx = findTransaksiByTrx(id)
            if (!trx) {
                return res.status(404).json({ success: false, message: `Transaksi ${id} tidak ditemukan` })
            }
            if (trx.bot_folder && [STATUS.MENUNGGU_PAIRING, STATUS.AKTIF].includes(trx.status)) {
                try { await getBotManager().stopBot(trx.bot_folder) } catch (e) {}
            }
            updateTransaksi(trx.id, { status: STATUS.BATAL, cancelled_at: new Date().toISOString() })
            return res.json({ success: true, message: `${trx.id} dibatalkan` })
        } catch (e) {
            logger.error('Cancel sewa error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }
}