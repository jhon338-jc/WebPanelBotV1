import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Terlalu banyak percobaan! Coba 15 menit lagi.' }
})

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { success: false, message: 'Rate limit exceeded' }
})

export const botActionLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 10,
    message: { success: false, message: 'Terlalu cepat! Tunggu 10 detik.' }
})
