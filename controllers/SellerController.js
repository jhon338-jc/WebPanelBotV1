import { Bot } from '../models/Bot.js'
import { getBotManager } from '../managers/BotManager.js'
import {
    readSewa,
    findTransaksiByTrx,
    updateTransaksi,
    STATUS,
    PAKET,
    formatRupiah
} from '../database/sewa.js'
import { logger } from '../utils/logger.js'
import { formatDateTime } from '../utils/helpers.js'

function ownedBy(user) {
    return Bot.findByOwner(user.username).map(b => b.folder)
}

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

export class SellerController {
    static async dashboard(req, res) {
        try {
            const user = req.user
            const myFolders = ownedBy(user)
            const botManager = getBotManager()

            let bots = Bot.findAll().filter(b => myFolders.includes(b.folder))
            bots = bots.map(bot => {
                const status = botManager.getBotStatus(bot.folder)
                return {
                    ...bot,
                    realtimeStatus: status.status,
                    connected: status.connected || bot.connected,
                    pairingCode: status.pairingCode,
                    waitingInput: status.waitingInput,
                    pid: status.pid
                }
            })

            // Transaksi sewa milik folder seller ini
            const stats = {}
            const transaksi = []
            {
                const sewa = readSewa()
                const mine = sewa.transaksi.filter(t => t.bot_folder && myFolders.includes(t.bot_folder))
                const reversalOnly = !req.baseUrl.startsWith('/api')
                if (reversalOnly) transaksi.push(...[...mine].reverse())
                stats.totalTransaksi = mine.length
                stats.aktif = mine.filter(t => t.status === STATUS.AKTIF).length
                stats.menungguVerifikasi = mine.filter(t => t.status === STATUS.MENUNGGU_VERIFIKASI).length
                stats.menungguPembayaran = mine.filter(t => t.status === STATUS.MENUNGGU_PEMBAYARAN).length
                stats.revenue = mine
                    .filter(t => [STATUS.AKTIF, STATUS.EXPIRED].includes(t.status))
                    .reduce((sum, t) => sum + (PAKET[t.paket]?.harga || 0), 0)
            }

            const running = bots.filter(b => b.realtimeStatus === 'running').length
            const connected = bots.filter(b => b.connected).length
            const botStats = {
                totalBots: bots.length,
                runningBots: running,
                connectedBots: connected,
                quota: user.max_bots,
                quotaUsed: running
            }

            if (req.baseUrl.startsWith('/api')) {
                return res.json({
                    success: true,
                    stats: { ...stats, ...botStats, plan: user.plan },
                    bots,
                    transaksi: transaksi.length ? transaksi : []
                })
            }
            res.render('seller/dashboard', {
                title: 'Dashboard Seller',
                stats: { ...stats, ...botStats },
                bots,
                transaksi,
                formatDateTime
            })
        } catch (e) {
            logger.error('Seller dashboard error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async listBots(req, res) {
        try {
            const user = req.user
            const botManager = getBotManager()
            const myFolders = ownedBy(user)
            let bots = Bot.findAll().filter(b => myFolders.includes(b.folder))
            bots = bots.map(bot => {
                const status = botManager.getBotStatus(bot.folder)
                return {
                    ...bot,
                    realtimeStatus: status.status,
                    connected: status.connected || bot.connected,
                    pairingCode: status.pairingCode,
                    waitingInput: status.waitingInput,
                    pid: status.pid
                }
            })
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, bots, quota: user.max_bots })
            }
            const initialLogs = {}
            for (const bot of bots) {
                initialLogs[bot.folder] = botManager.getBotLogs(bot.folder, 30)
            }
            res.render('seller/bots', { title: 'Bot Saya', bots, initialLogs, quota: user.max_bots })
        } catch (e) {
            logger.error('Seller bots error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async sewa(req, res) {
        try {
            const user = req.user
            const myFolders = ownedBy(user)
            const sewa = readSewa()
            const transaksi = sewa.transaksi
                .filter(t => t.bot_folder && myFolders.includes(t.bot_folder))
                .reverse()
                .map(normalizeTransaksi)
            const stats = {
                total: transaksi.length,
                aktif: sewa.transaksi.filter(t => t.bot_folder && myFolders.includes(t.bot_folder) && t.status === STATUS.AKTIF).length,
                menungguVerifikasi: sewa.transaksi.filter(t => t.bot_folder && myFolders.includes(t.bot_folder) && t.status === STATUS.MENUNGGU_VERIFIKASI).length,
                revenue: sewa.transaksi
                    .filter(t => t.bot_folder && myFolders.includes(t.bot_folder) && [STATUS.AKTIF, STATUS.EXPIRED].includes(t.status))
                    .reduce((sum, t) => sum + (PAKET[t.paket]?.harga || 0), 0)
            }
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, stats, transaksi })
            }
            res.render('seller/sewa', { title: 'Sewa Saya', stats, transaksi, formatDateTime })
        } catch (e) {
            logger.error('Seller sewa error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    // ====== Aksi bot terbatas (hanya bot milik seller) ======
    static async requireOwnedBot(folder, user, action) {
        const bot = Bot.findByFolder(folder)
        if (!bot) throw new Error('Bot tidak ditemukan')
        if (bot.owner !== user.username) throw new Error('Bot bukan milik seller ini')
        return bot
    }

    static async startBot(req, res) {
        try {
            const { folder } = req.params
            const user = req.user
            await SellerController.requireOwnedBot(folder, user)
            const used = Bot.countRunningByOwner(user.username)
            if (used >= user.max_bots) {
                return res.status(400).json({
                    success: false,
                    message: `Kuota bot seller habis (${used}/${user.max_bots}). Upgrade ke premium untuk 50 bot.`
                })
            }
            await getBotManager().startBot(folder)
            return res.json({ success: true, message: `${folder} starting...` })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async stopBot(req, res) {
        try {
            const { folder } = req.params
            await SellerController.requireOwnedBot(folder, req.user)
            await getBotManager().stopBot(folder)
            return res.json({ success: true, message: `${folder} stopped` })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async restartBot(req, res) {
        try {
            const { folder } = req.params
            await SellerController.requireOwnedBot(folder, req.user)
            await getBotManager().restartBot(folder)
            return res.json({ success: true, message: `${folder} restarting...` })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async getBotLogs(req, res) {
        try {
            const { folder } = req.params
            await SellerController.requireOwnedBot(folder, req.user)
            const logs = getBotManager().getBotLogs(folder, 100)
            return res.json({ success: true, logs })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async sendInput(req, res) {
        try {
            const { folder } = req.params
            const { input } = req.body
            await SellerController.requireOwnedBot(folder, req.user)
            if (!input || !String(input).trim()) {
                return res.status(400).json({ success: false, message: 'Input wajib diisi!' })
            }
            const result = getBotManager().sendInput(folder, String(input).trim())
            if (result) return res.json({ success: true, message: `Input terkirim ke ${folder}` })
            return res.status(400).json({ success: false, message: 'Gagal kirim input' })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    // ====== Sewa milik seller ======
    static async verifyPayment(req, res) {
        try {
            const { id } = req.params
            const user = req.user
            const trx = findTransaksiByTrx(id)
            if (!trx) return res.status(404).json({ success: false, message: `Transaksi ${id} tidak ditemukan` })
            if (!trx.bot_folder || !ownedBy(user).includes(trx.bot_folder)) {
                return res.status(403).json({ success: false, message: 'Transaksi bukan milik seller ini' })
            }
            if (trx.status !== STATUS.MENUNGGU_VERIFIKASI && trx.status !== STATUS.MENUNGGU_PEMBAYARAN) {
                return res.status(400).json({ success: false, message: `Status ${trx.status} tidak bisa diverifikasi` })
            }
            updateTransaksi(trx.id, { status: STATUS.MENUNGGU_NOMOR, verified_at: new Date().toISOString(), verified_by: user.username })
            return res.json({ success: true, message: `${trx.id} diverifikasi, menunggu nomor user` })
        } catch (e) {
            logger.error('Seller verify sewa error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async cancelSewa(req, res) {
        try {
            const { id } = req.params
            const user = req.user
            const trx = findTransaksiByTrx(id)
            if (!trx) return res.status(404).json({ success: false, message: `Transaksi ${id} tidak ditemukan` })
            if (!trx.bot_folder || !ownedBy(user).includes(trx.bot_folder)) {
                return res.status(403).json({ success: false, message: 'Transaksi bukan milik seller ini' })
            }
            if (trx.bot_folder && [STATUS.MENUNGGU_PAIRING, STATUS.AKTIF].includes(trx.status)) {
                try { await getBotManager().stopBot(trx.bot_folder) } catch (e) {}
            }
            updateTransaksi(trx.id, { status: STATUS.BATAL, cancelled_at: new Date().toISOString() })
            return res.json({ success: true, message: `${trx.id} dibatalkan` })
        } catch (e) {
            logger.error('Seller cancel sewa error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }
}