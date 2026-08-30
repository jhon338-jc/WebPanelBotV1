import { generateAdminToken, sanitizeInput } from '../utils/helpers.js'
import { readSettings, writeSettings } from '../utils/settings.js'
import { authenticateSeller } from '../utils/sellers.js'
import { logger } from '../utils/logger.js'

export class AuthController {
    static login(req, res) {
        try {
            const username = sanitizeInput(req.body.username)
            const pin = String(req.body.pin || '').trim()

            const settings = readSettings()

            // Login Seller (bukan admin)
            const seller = authenticateSeller(username, pin)
            if (seller && username !== settings.username) {
                const token = generateAdminToken(settings, {
                    isAdmin: false,
                    level: 'seller',
                    sellerId: seller.id,
                    plan: seller.plan,
                    max_bots: seller.max_bots
                })
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                logger.info(`Login seller: ${seller.username} (${seller.plan})`)
                return res.json({
                    success: true,
                    message: 'Login seller berhasil!',
                    redirect: '/seller/dashboard',
                    role: 'seller'
                })
            }

            // Login Admin (superuser)
            if (username !== settings.username || pin !== settings.pin) {
                logger.warn(`Percobaan login gagal: ${username}`)
                return res.status(401).json({ success: false, message: 'Username atau PIN salah!' })
            }

            const token = generateAdminToken(settings)

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            logger.info(`Login admin: ${username}`)
            return res.json({
                success: true,
                message: 'Login berhasil!',
                redirect: '/admin/dashboard',
                role: 'admin'
            })
        } catch (e) {
            logger.error('Login error:', e)
            return res.status(500).json({ success: false, message: 'Server error!' })
        }
    }

    static logout(req, res) {
        const settings = readSettings()
        writeSettings({ token_version: (settings.token_version || 0) + 1 })
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        })
        return res.json({ success: true, message: 'Logout berhasil!' })
    }
}
