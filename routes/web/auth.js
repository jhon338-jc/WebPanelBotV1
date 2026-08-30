import express from 'express'
import { AuthController } from '../../controllers/AuthController.js'
import { optionalAuth } from '../../middleware/auth.js'
import { loginLimiter } from '../../middleware/rateLimit.js'

const router = express.Router()

router.get('/login', optionalAuth, (req, res) => {
    if (req.user) {
        return res.redirect('/admin/dashboard')
    }
    res.render('auth/login', { title: 'Login' })
})

router.post('/api/auth/login', loginLimiter, AuthController.login)
router.post('/api/auth/logout', AuthController.logout)

export default router
