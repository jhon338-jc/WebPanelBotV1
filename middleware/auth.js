import { verifyToken } from '../utils/helpers.js'
import { readSettings } from '../utils/settings.js'

function isApi(req) {
    return req.baseUrl.startsWith('/api') || req.path.startsWith('/api/')
}

export function authMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        return res.redirect('/login')
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.isAdmin) {
        res.clearCookie('token')
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Token expired' })
        }
        return res.redirect('/login')
    }

    const settings = readSettings()
    if ((decoded.tv || 0) !== (settings.token_version || 0)) {
        res.clearCookie('token')
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Sesi sudah berakhir, silakan login ulang' })
        }
        return res.redirect('/login')
    }

    req.user = { username: settings.username, level: 'admin', isAdmin: true }
    res.locals.user = req.user
    next()
}

export function optionalAuth(req, res, next) {
    const token = req.cookies?.token
    if (token) {
        const decoded = verifyToken(token)
        if (decoded && decoded.isAdmin) {
            const settings = readSettings()
            if ((decoded.tv || 0) === (settings.token_version || 0)) {
                req.user = { username: settings.username, level: 'admin', isAdmin: true }
                res.locals.user = req.user
            }
        }
    }
    next()
}
