import { verifyToken } from '../utils/helpers.js'
import { readSettings } from '../utils/settings.js'
import { getSellerById } from '../utils/sellers.js'

function isApi(req) {
    return req.baseUrl.startsWith('/api') || req.path.startsWith('/api/')
}

function deny(res, api, status, message) {
    if (api) return res.status(status).json({ success: false, message })
    return res.redirect('/login')
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

// Middleware khusus area seller: token seller (non-admin) wajib & masih valid.
export function sellerMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
    const api = isApi(req)

    if (!token) return deny(res, api, 401, 'Unauthorized')

    const decoded = verifyToken(token)
    if (!decoded) return deny(res, api, 401, 'Sesi berakhir, silakan login ulang')

    const settings = readSettings()
    if ((decoded.tv || 0) !== (settings.token_version || 0)) {
        return deny(res, api, 401, 'Sesi sudah berakhir, silakan login ulang')
    }

    // Admin tidak boleh akses area seller
    if (decoded.isAdmin) return res.redirect('/admin/dashboard')

    const seller = getSellerById(decoded.sellerId)
    if (!seller || seller.status !== 'aktif') {
        res.clearCookie('token')
        return deny(res, api, 403, 'Akun seller nonaktif')
    }

    req.user = {
        username: seller.username,
        level: 'seller',
        plan: seller.plan,
        max_bots: seller.max_bots || 10,
        sellerId: seller.id,
        isAdmin: false
    }
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
