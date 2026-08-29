import { User } from '../models/User.js'
import { Bot } from '../models/Bot.js'
import { getBotManager } from '../managers/BotManager.js'
import { formatDateTime, sanitizeInput } from '../utils/helpers.js'
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
                runningBots: Bot.getRunningBots(),
                totalUsers: User.countActive(),
                availableBots: Bot.getAvailableBots().length
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
            if (req.path.startsWith('/api/')) {
                return res.json({ success: true, stats, bots, systemInfo })
            }
            res.render('admin/dashboard', { title: 'Admin Dashboard', stats, bots, systemInfo })
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
            if (req.path.startsWith('/api/')) {
                return res.json({ success: true, bots })
            }
            // Ambil log untuk semua bot, render langsung di server
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

    static async listUsers(req, res) {
        try {
            const users = User.findAll()
            if (req.path.startsWith('/api/')) {
                return res.json({ success: true, users })
            }
            res.render('admin/users', { title: 'Manage Users', users, formatDateTime })
        } catch (e) {
            logger.error('List users error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async addUser(req, res) {
        try {
            const { username, password, email, level } = req.body
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Username dan password wajib!' })
            }
            if (User.findByUsername(username)) {
                return res.status(400).json({ success: false, message: 'Username sudah ada!' })
            }
            const userId = User.create(username, password, email)
            if (level && ['admin', 'reseller', 'member'].includes(level)) {
                User.update(userId, { level })
            }
            return res.json({ success: true, message: 'User berhasil ditambah!' })
        } catch (e) {
            logger.error('Add user error:', e)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.id)
            const { username, email, level, status, bot_quota } = req.body
            const data = {}
            if (username) data.username = sanitizeInput(username)
            if (email !== undefined) data.email = sanitizeInput(email)
            if (level) data.level = level
            if (status) data.status = status
            if (bot_quota) data.bot_quota = parseInt(bot_quota)
            User.update(userId, data)
            return res.json({ success: true, message: 'User diupdate!' })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id)
            const userBots = Bot.getBotByUser(userId)
            for (const bot of userBots) {
                Bot.releaseBot(bot.id)
            }
            User.delete(userId)
            return res.json({ success: true, message: 'User dihapus!' })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
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
            // Lepas kepemilikan bot dari user agar bisa di-assign ulang
            Bot.releaseBot(bot.id)
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
}
