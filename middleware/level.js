export function levelMiddleware(...allowedLevels) {
    return (req, res, next) => {
        if (req.user && allowedLevels.includes(req.user.level)) {
            return next()
        }
        const isApi = req.baseUrl.startsWith('/api') || req.path.startsWith('/api/')
        if (isApi) {
            return res.status(403).json({ success: false, message: 'Akses ditolak! Level tidak cukup.' })
        }
        return res.status(403).render('error', {
            message: 'Akses ditolak! Level kamu tidak cukup.',
            code: 403
        })
    }
}
