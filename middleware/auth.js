import { verifyToken } from '../utils/helpers.js'
import { User } from '../models/User.js'

export function authMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        return res.redirect('/login')
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
        res.clearCookie('token')
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Token expired' })
        }
        return res.redirect('/login')
    }
    
    const user = User.findById(decoded.id)
    if (!user || user.status !== 'active') {
        res.clearCookie('token')
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Account banned' })
        }
        return res.redirect('/login')
    }
    
    req.user = user
    res.locals.user = user
    next()
}

export function adminMiddleware(req, res, next) {
    if (req.user.level !== 'admin') {
        if (req.path.startsWith('/api/')) {
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
            if (user && user.status === 'active') {
                req.user = user
                res.locals.user = user
            }
        }
    }
    next()
}
