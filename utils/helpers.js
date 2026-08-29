import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, level: user.level, tv: user.token_version || 0 },
        config.jwtSecret,
        { expiresIn: '7d' }
    )
}

export function verifyToken(token) {
    try { return jwt.verify(token, config.jwtSecret) } catch { return null }
}

export function formatDateTime(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export function sanitizeInput(input) {
    if (typeof input !== 'string') return input
    return input.replace(/[<>]/g, '').trim()
}
