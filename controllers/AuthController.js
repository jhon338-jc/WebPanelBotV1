import { User } from '../models/User.js'
import { generateToken, verifyToken, sanitizeInput, userDashboardPath } from '../utils/helpers.js'
import { logger } from '../utils/logger.js'

export class AuthController {
    static register(req, res) {
        try {
            const username = sanitizeInput(req.body.username)
            const password = req.body.password
            const email = sanitizeInput(req.body.email)

            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Username dan password wajib!' })
            }
            if (username.length < 3) {
                return res.status(400).json({ success: false, message: 'Username minimal 3 karakter!' })
            }
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'Password minimal 6 karakter!' })
            }
            if (User.findByUsername(username)) {
                return res.status(400).json({ success: false, message: 'Username sudah terdaftar!' })
            }
            if (email && User.findByEmail(email)) {
                return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' })
            }

            User.create(username, password, email)
            logger.info(`User baru: ${username}`)
            return res.json({ success: true, message: 'Registrasi berhasil!' })
        } catch (e) {
            logger.error('Register error:', e)
            return res.status(500).json({ success: false, message: 'Server error!' })
        }
    }

    static login(req, res) {
        try {
            const username = sanitizeInput(req.body.username)
            const password = req.body.password

            const user = User.findByUsername(username)
            if (!user || !User.verifyPassword(password, user.password)) {
                return res.status(401).json({ success: false, message: 'Username atau password salah!' })
            }
            if (user.status !== 'active') {
                return res.status(403).json({ success: false, message: 'Akun di-banned!' })
            }

            User.updateLastLogin(user.id)
            const token = generateToken(user)

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            logger.info(`Login: ${username}`)
            return res.json({
                success: true,
                message: 'Login berhasil!',
                redirect: userDashboardPath(user.level)
            })
        } catch (e) {
            logger.error('Login error:', e)
            return res.status(500).json({ success: false, message: 'Server error!' })
        }
    }

    static logout(req, res) {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
        if (token) {
            const decoded = verifyToken(token)
            if (decoded?.id) {
                User.incrementTokenVersion(decoded.id)
            }
        }
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        })
        return res.json({ success: true, message: 'Logout berhasil!' })
    }
}
