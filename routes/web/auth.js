import express from 'express'
import { AuthController } from '../../controllers/AuthController.js'
import { optionalAuth } from '../../middleware/auth.js'
import { loginLimiter } from '../../middleware/rateLimit.js'
import { userDashboardPath } from '../../utils/helpers.js'

const router = express.Router()

router.get('/login', optionalAuth, (req, res) => {
    if (req.user) {
        return res.redirect(userDashboardPath(req.user.level))
    }
    res.render('auth/login', { title: 'Login' })
})

router.get('/register', optionalAuth, (req, res) => {
    if (req.user) {
        return res.redirect(userDashboardPath(req.user.level))
    }
    res.render('auth/register', { title: 'Register' })
})

router.post('/api/auth/login', loginLimiter, AuthController.login)
router.post('/api/auth/register', AuthController.register)
router.post('/api/auth/logout', AuthController.logout)

export default router
