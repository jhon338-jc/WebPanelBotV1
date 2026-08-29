import { User } from '../models/User.js'
import { Bot } from '../models/Bot.js'
import { getBotManager } from '../managers/BotManager.js'
import { logger } from '../utils/logger.js'
import { userBasePath, userDashboardPath } from '../utils/helpers.js'

function redirectBack(req, res, message) {
    const base = userBasePath(req.user.level)
    const redirect = typeof req.query.redirect === 'string' && req.query.redirect.startsWith('/')
        ? req.query.redirect
        : base + '/dashboard'
    if (req.query.redirect) return res.redirect(redirect)
    return res.json({ success: true, message })
}

export class UserController {
    static async dashboard(req, res) {
        try {
            const base = userBasePath(req.user.level)
            const myBots = Bot.getBotByUser(req.user.id).map(bot => {
                const status = getBotManager().getBotStatus(bot.folder)
                return {
                    ...bot,
                    realtimeStatus: status.status,
                    connected: status.connected || bot.connected,
                    pairingCode: status.pairingCode
                }
            })
            const availableBotList = Bot.getAvailableBots().map(b => ({ id: b.id, folder: b.folder }))
            const availableBots = availableBotList.length

            if (req.baseUrl.startsWith('/api')) {
                return res.json({
                    success: true,
                    myBots,
                    availableBots,
                    availableBotList,
                    botQuota: req.user.bot_quota
                })
            }

            res.render('user/_dashboard', {
                title: 'Dashboard',
                userBase: base,
                myBots,
                availableBots,
                availableBotList,
                botQuota: req.user.bot_quota
            })
        } catch (e) {
            logger.error('User dashboard error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }

    static async myBots(req, res) {
        try {
            const base = userBasePath(req.user.level)
            const myBots = Bot.getBotByUser(req.user.id).map(bot => {
                const status = getBotManager().getBotStatus(bot.folder)
                return {
                    ...bot,
                    realtimeStatus: status.status,
                    connected: status.connected || bot.connected,
                    pairingCode: status.pairingCode
                }
            })

            if (req.baseUrl.startsWith('/api')) {
                return res.json({ success: true, myBots })
            }

            res.render('user/_mybots', {
                title: 'Bots Saya',
                userBase: base,
                myBots
            })
        } catch (e) {
            logger.error('User myBots error:', e)
            res.status(500).render('error', { message: 'Server error', code: 500 })
        }
    }


    static async assignBot(req, res) {
        try {
            const userId = req.user.id
            const botId = parseInt(req.body.bot_id || req.query.bot_id)

            const myBots = Bot.getBotByUser(userId)
            if (!botId) {
                if (req.query.redirect) return redirectBack(req, res, 'Pilih bot untuk di-assign')
                return res.status(400).json({ success: false, message: 'Pilih bot!' })
            }
            if (req.user.bot_quota <= 0) {
                if (req.query.redirect) return redirectBack(req, res, 'Quota habis! Hubungi admin untuk menambah quota.')
                return res.status(400).json({ success: false, message: 'Quota habis! Hubungi admin untuk menambah quota.' })
            }
            if (myBots.length >= req.user.bot_quota) {
                if (req.query.redirect) return redirectBack(req, res, 'Quota penuh!')
                return res.status(400).json({ success: false, message: 'Quota penuh!' })
            }

            const bot = Bot.findById(botId)
            if (!bot) {
                if (req.query.redirect) return redirectBack(req, res, 'Bot tidak ditemukan')
                return res.status(404).json({ success: false, message: 'Bot tidak ditemukan' })
            }
            if (bot.assigned_to) {
                if (req.query.redirect) return redirectBack(req, res, 'Bot sudah dipakai')
                return res.status(400).json({ success: false, message: 'Bot sudah dipakai' })
            }

            Bot.assignBot(botId, userId)
            return redirectBack(req, res, `Bot ${bot.folder} di-assign!`)
        } catch (e) {
            if (req.query.redirect) return redirectBack(req, res, 'Server error')
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async releaseBot(req, res) {
        try {
            const bot = Bot.findById(parseInt(req.params.id))
            if (!bot || bot.assigned_to !== req.user.id) {
                if (req.query.redirect) return redirectBack(req, res, 'Bukan bot kamu!')
                return res.status(403).json({ success: false, message: 'Bukan bot kamu!' })
            }

            const botManager = getBotManager()
            if (botManager.getBotStatus(bot.folder).status === 'running') {
                await botManager.stopBot(bot.folder)
            }

            Bot.releaseBot(bot.id)
            User.adjustQuota(req.user.id, -1)
            return redirectBack(req, res, `Bot ${bot.folder} dilepas. Quota berkurang 1!`)
        } catch (e) {
            if (req.query.redirect) return redirectBack(req, res, 'Server error')
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async logoutBot(req, res) {
        try {
            const bot = Bot.findById(parseInt(req.params.id))
            if (!bot || bot.assigned_to !== req.user.id) {
                if (req.query.redirect) return redirectBack(req, res, 'Bukan bot kamu!')
                return res.status(403).json({ success: false, message: 'Bukan bot kamu!' })
            }

            const botManager = getBotManager()
            if (botManager.getBotStatus(bot.folder).status === 'running') {
                await botManager.stopBot(bot.folder)
            }

            await botManager.logoutBot(bot.folder)
            Bot.releaseBot(bot.id)
            User.adjustQuota(req.user.id, -1)
            return redirectBack(req, res, `Bot ${bot.folder} di-logout dari WhatsApp!`)
        } catch (e) {
            if (req.query.redirect) return redirectBack(req, res, e.message)
            return res.status(500).json({ success: false, message: e.message })
        }
    }

    static async connectBot(req, res) {
        try {
            const bot = Bot.findById(parseInt(req.params.id))
            if (!bot || bot.assigned_to !== req.user.id) {
                if (req.query.redirect) return redirectBack(req, res, 'Bukan bot kamu!')
                return res.status(403).json({ success: false, message: 'Bukan bot kamu!' })
            }

            const botManager = getBotManager()
            if (botManager.getBotStatus(bot.folder).status === 'running') {
                if (req.query.redirect) return redirectBack(req, res, 'Bot sudah berjalan!')
                return res.status(400).json({ success: false, message: 'Bot sudah berjalan!' })
            }

            await botManager.startBot(bot.folder, req.user.id)
            return redirectBack(req, res, `${bot.folder} starting...`)
        } catch (e) {
            if (req.query.redirect) return redirectBack(req, res, e.message)
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async disconnectBot(req, res) {
        try {
            const bot = Bot.findById(parseInt(req.params.id))
            if (!bot || bot.assigned_to !== req.user.id) {
                if (req.query.redirect) return redirectBack(req, res, 'Bukan bot kamu!')
                return res.status(403).json({ success: false, message: 'Bukan bot kamu!' })
            }

            await getBotManager().stopBot(bot.folder)
            return redirectBack(req, res, `${bot.folder} stopped`)
        } catch (e) {
            if (req.query.redirect) return redirectBack(req, res, e.message)
            return res.status(400).json({ success: false, message: e.message })
        }
    }

    static async getBotLogs(req, res) {
        try {
            const bot = Bot.findById(parseInt(req.params.id))
            if (!bot || (bot.assigned_to !== req.user.id && req.user.level !== 'admin')) {
                return res.status(403).json({ success: false, message: 'Bukan bot kamu!' })
            }
            return res.json({ success: true, logs: getBotManager().getBotLogs(bot.folder, 50) })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async updateProfile(req, res) {
        try {
            const data = {}
            const username = req.body.username
            const email = req.body.email

            if (username && typeof username === 'string') {
                const clean = username.replace(/[<>]/g, '').trim()
                if (clean.length >= 3) {
                    const existing = User.findByUsername(clean)
                    if (existing && existing.id !== req.user.id) {
                        return res.status(400).json({ success: false, message: 'Username sudah dipakai!' })
                    }
                    data.username = clean
                }
            }

            if (req.body.email !== undefined) {
                const cleanEmail = typeof req.body.email === 'string' ? req.body.email.replace(/[<>]/g, '').trim() : null
                if (cleanEmail) {
                    const existing = User.findByEmail(cleanEmail)
                    if (existing && existing.id !== req.user.id) {
                        return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' })
                    }
                    data.email = cleanEmail
                } else {
                    data.email = null
                }
            }

            User.update(req.user.id, data)
            return res.json({ success: true, message: 'Profile diupdate!' })
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    }

    static async changePassword(req, res) {
        const user = User.findById(req.user.id)
        if (!User.verifyPassword(req.body.old_password, user.password)) {
            return res.status(400).json({ success: false, message: 'Password lama salah!' })
        }
        if (!req.body.new_password || req.body.new_password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter!' })
        }
        User.requestPasswordChange(req.user.id, req.body.new_password)
        return res.json({ success: true, message: 'Permintaan ganti password terkirim! Menunggu persetujuan admin.' })
    }
}
