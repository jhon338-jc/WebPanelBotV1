import express from 'express'
import { UserController } from '../../controllers/UserController.js'
import { authMiddleware } from '../../middleware/auth.js'
import { userDashboardPath } from '../../utils/helpers.js'

const router = express.Router()

router.use(authMiddleware)

// Alias: /user/dashboard -> dashboard sesuai level user
router.get('/dashboard', (req, res) => {
    res.redirect(userDashboardPath(req.user.level))
})

router.get('/profile', (req, res) => {
    res.render('user/profile', { title: 'Profile' })
})

export default router
