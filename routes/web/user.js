import express from 'express'
import { UserController } from '../../controllers/UserController.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/dashboard', UserController.dashboard)
router.get('/profile', (req, res) => {
    res.render('user/profile', { title: 'Profile' })
})

export default router
