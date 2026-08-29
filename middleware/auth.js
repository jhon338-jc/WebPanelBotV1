import { verifyToken } from '../utils/helpers.js'
import { User } from '../models/User.js'

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
    if (!decoded) {
        res.clearCookie('token')
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Token expired' })
        }
        return res.redirect('/login')
    }
    
    const user = User.findById(decoded.id)
    if (!user || user.status !== 'active') {
        res.clearCookie('token')
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Account banned' })
        }
        return res.redirect('/login')
    }

    if ((decoded.tv || 0) !== (user.token_version || 0)) {
        res.clearCookie('token')
        if (isApi(req)) {
            return res.status(401).json({ success: false, message: 'Sesi sudah berakhir, silakan login ulang' })
        }
        return res.redirect('/login')
    }
    
    req.user = user
    res.locals.user = user
    next()
}

export function adminMiddleware(req, res, next) {
    if (req.user.level !== 'admin') {
        if (isApi(req)) {
            return res.status(403).json({ success: false, message: 'Admin only' })
        }
        return res.status(403).render('error', { message: 'Akses ditolak! Khusus admin.', code: 403 })
    }
    next()
}

export function optionalAuth(req, res, next) {
    const token = req.cookies?.token
    if (token) {
        const decoded = verifyToken(token)
        if (decoded) {
            const user = User.findById(decoded.id)
            if (user && user.status === 'active' && (decoded.tv || 0) === (user.token_version || 0)) {
                req.user = user
                res.locals.user = user
            }
        }
    }
    next()
}
