import { Bot } from '../models/Bot.js'
import { getBotManager } from '../managers/BotManager.js'
import { formatDateTime, sanitizeInput } from '../utils/helpers.js'
import { readSettings, writeSettings } from '../utils/settings.js'
import { logger } from '../utils/logger.js'

function redirectBack(req, res, message) {
    const redirect = typeof req.query.redirect === 'string' && req.query.redirect.startsWith('/')
        ? req.query.redirect
        : '/admin/bots'
    if (req.query.redirect) return res.redirect(redirect)
    return res.json({ success: true, message })
}

export class AdminController {
    static async dashboard(req, res) {
        try {
            const botManager = getBotManager()
            const bots = Bot.findAll().map(bot => {
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
            const stats = {
                totalBots: Bot.getTotalBots(),
                activeBots: Bot.getActiveBots(),
                runningBots: Bot.getRunningBots()
            }
            const os = await import('os')
            const systemInfo = {
                platform: os.platform(),
                arch: os.arch(),
                cpuCount: os.cpus().length,
                totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(1),
                freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(1),
                uptime: os.uptime(),
                nodeVersion: process.version,
                runningBots: botManager.getRunningCount(),
                processMemory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
            }
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, stats, bots, systemInfo })
            }
            res.render('admin/dashboard', { title: 'Dashboard', stats, bots, systemInfo })
        } catch (e) {
            logger.error('Dashboard error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async listBots(req, res) {
        try {
            const botManager = getBotManager()
            const bots = Bot.findAll().map(bot => {
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
                return res.json({ success: true, bots })
            }
            const initialLogs = {}
            for (const bot of bots) {
                initialLogs[bot.folder] = botManager.getBotLogs(bot.folder, 30)
            }
            res.render('admin/bots', {
                title: 'Manage Bots',
                bots,
                initialLogs
            })
        } catch (e) {
            logger.error('List bots error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async settings(req, res) {
        try {
            const settings = readSettings()
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, settings: { username: settings.username } })
            }
            res.render('admin/settings', { title: 'Settings', settings })
        } catch (e) {
            logger.error('Settings error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async updateSettings(req, res) {
        try {
            const username = sanitizeInput(req.body.username)
            let { pin } = req.body
            pin = pin === undefined || pin === '' ? undefined : String(pin)

            if (!username) {
                return res.status(400).json({ success: false, message: 'Username wajib diisi!' })
            }
            if (pin !== undefined && pin.length < 4) {
                return res.status(400).json({ success: false, message: 'PIN minimal 4 digit!' })
            }
            const current = readSettings()
            const changes = { username }
            let pinChanged = false
            if (pin !== undefined) {
                changes.pin = pin
                if (pin !== current.pin) {
                    changes.token_version = (current.token_version || 0) + 1
                    pinChanged = true
                }
            }
            writeSettings(changes)
            logger.info(`Settings diupdate oleh admin`)
            return res.json({ success: true, message: 'Settings berhasil diupdate!', requiresRelogin: pinChanged })
        } catch (e) {
            logger.error('Update settings error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async help(req, res) {
        try {
            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true })
            }
            res.render('admin/help', { title: 'Panduan Fitur' })
        } catch (e) {
            logger.error('Help error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async startBot(req, res) {
        try {
            const { folder } = req.params
            await getBotManager().startBot(folder)
            return redirectBack(req, res, `${folder} starting...`)
        } catch (e) {
            if (!req.query.redirect) return res.status(400).json({ success: false, message: e.message })
            return redirectBack(req, res, e.message)
        }
    }

    static async startAllBots(req, res) {
        try {
            const bots = Bot.findAll()
            for (const bot of bots) {
                try { await getBotManager().startBot(bot.folder) } catch (e) {}
            }
            return redirectBack(req, res, `Semua bot di-start (${bots.length})`)
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message || 'Server error' })
        }
    }

    static async stopAllBots(req, res) {
        try {
            const bots = Bot.findAll()
            for (const bot of bots) {
                try { await getBotManager().stopBot(bot.folder) } catch (e) {}
            }
            return redirectBack(req, res, `Semua bot di-stop (${bots.length})`)
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message || 'Server error' })
        }
    }

    static async stopBot(req, res) {
        try {
            const { folder } = req.params
            await getBotManager().stopBot(folder)
            return redirectBack(req, res, `${folder} stopped`)
        } catch (e) {
            if (!req.query.redirect) return res.status(400).json({ success: false, message: e.message })
            return redirectBack(req, res, e.message)
        }
    }

    static async restartBot(req, res) {
        try {
            const { folder } = req.params
            await getBotManager().restartBot(folder)
            return redirectBack(req, res, `${folder} restarting...`)
        } catch (e) {
            if (!req.query.redirect) return res.status(400).json({ success: false, message: e.message })
            return redirectBack(req, res, e.message)
        }
    }

    static async logoutBot(req, res) {
        try {
            const { folder } = req.params
            const bot = Bot.findByFolder(folder)
            if (!bot) {
                return res.status(404).json({ success: false, message: 'Bot tidak ditemukan' })
            }
            await getBotManager().logoutBot(folder)
            if (req.query.redirect) {
                return res.redirect(req.query.redirect)
            }
            return res.json({ success: true, message: `${folder} berhasil di-logout dari WhatsApp` })
        } catch (e) {
            if (!req.query.redirect) return res.status(400).json({ success: false, message: e.message })
            return res.redirect(req.query.redirect)
        }
    }

    static async getBotLogs(req, res) {
        try {
            const logs = getBotManager().getBotLogs(req.params.folder, 100)
            return res.json({ success: true, logs })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async sendInput(req, res) {
        try {
            const { folder } = req.params
            const { input } = req.body
            if (!input || !String(input).trim()) {
                return res.status(400).json({ success: false, message: 'Input wajib diisi!' })
            }
            const result = getBotManager().sendInput(folder, String(input).trim())
            if (result) {
                if (req.query.redirect) {
                    return res.redirect(req.query.redirect)
                }
                return res.json({ success: true, message: `Input terkirim ke ${folder}` })
            }
            return res.status(400).json({ success: false, message: 'Gagal kirim input' })
        } catch (e) {
            if (!req.query.redirect) return res.status(400).json({ success: false, message: e.message })
            return res.redirect(req.query.redirect)
        }
    }

    static async systemInfo(req, res) {
        try {
            const os = await import('os')
            const info = {
                platform: os.platform(),
                arch: os.arch(),
                cpuCount: os.cpus().length,
                totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(1),
                freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(1),
                uptime: os.uptime(),
                nodeVersion: process.version,
                runningBots: getBotManager().getRunningCount(),
                processMemory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
            }
            return res.json({ success: true, info })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    // ==================== Kelola Seller ====================
    static async listSellers(req, res) {
        try {
            const { listSellers, getSeller } = await import('../utils/sellers.js')
            const { readSewa, STATUS, PAKET } = await import('../database/sewa.js')
            const botManager = getBotManager()
            const sewa = readSewa()

            const sellers = listSellers().map(s => {
                const botList = Bot.findByOwner(s.username)
                const running = botList.filter(b =>
                    (botManager.getBotStatus(b.folder).status || b.status) === 'running').length
                const revenue = sewa.transaksi
                    .filter(t => t.bot_folder && botList.some(b => b.folder === t.bot_folder)
                        && [STATUS.AKTIF, STATUS.EXPIRED].includes(t.status))
                    .reduce((sum, t) => sum + (PAKET[t.paket]?.harga || 0), 0)
                const totalTransaksi = sewa.transaksi
                    .filter(t => t.bot_folder && botList.some(b => b.folder === t.bot_folder)).length
                return {
                    ...s,
                    botCount: botList.length,
                    running,
                    revenue,
                    totalTransaksi
                }
            })

            const unassigned = Bot.findAll().filter(b => !b.owner).length

            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, sellers, unassigned })
            }
            res.render('admin/sellers', {
                title: 'Kelola Seller',
                sellers,
                unassigned,
                bots: Bot.findAll(),
                formatDateTime
            })
        } catch (e) {
            logger.error('List sellers error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async createSeller(req, res) {
        try {
            const { createSeller } = await import('../utils/sellers.js')
            const seller = createSeller({
                username: req.body.username,
                pin: req.body.pin,
                plan: req.body.plan
            })
            logger.info(`Admin membuat seller: ${seller.username} (${seller.plan})`)
            return res.json({ success: true, message: `Seller ${seller.username} dibuat!`, seller })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async updateSeller(req, res) {
        try {
            const { updateSeller } = await import('../utils/sellers.js')
            const seller = updateSeller(req.params.username, {
                pin: req.body.pin,
                plan: req.body.plan,
                status: req.body.status
            })
            if (!seller) return res.status(404).json({ success: false, message: 'Seller tidak ditemukan' })
            logger.info(`Admin memperbarui seller: ${seller.username}`)
            return res.json({ success: true, message: `Seller ${seller.username} diupdate!`, seller })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async deleteSeller(req, res) {
        try {
            const { deleteSeller } = await import('../utils/sellers.js')
            const ok = deleteSeller(req.params.username)
            if (!ok) return res.status(404).json({ success: false, message: 'Seller tidak ditemukan' })
            // Lepas kepemilikan bot dari seller yang dihapus
            for (const bot of Bot.findByOwner(req.params.username)) {
                Bot.setOwner(bot.folder, null)
            }
            logger.info(`Admin menghapus seller: ${req.params.username}`)
            return res.json({ success: true, message: `Seller ${req.params.username} dihapus!` })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async assignBot(req, res) {
        try {
            const { folder } = req.params
            const { owner } = req.body || {}
            const bot = Bot.findByFolder(folder)
            if (!bot) return res.status(404).json({ success: false, message: 'Bot tidak ditemukan' })
            if (folder === 'Bot1') {
                return res.status(400).json({ success: false, message: 'Bot1 wajib milik admin (bot transaksi)' })
            }
            if (owner) {
                const { getSeller } = await import('../utils/sellers.js')
                if (!getSeller(String(owner))) {
                    return res.status(400).json({ success: false, message: 'Seller tidak ditemukan' })
                }
            }
            const updated = Bot.setOwner(folder, owner ? String(owner) : null)
            logger.info(`Admin: ${folder} -> ${owner || 'admin (tanpa pemilik)'}`)
            return res.json({ success: true, message: `${folder} kini milik ${owner || 'admin'}`, bot: updated })
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message })
        }
    }
}
