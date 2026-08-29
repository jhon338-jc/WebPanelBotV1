import express from 'express'
import { AuthController } from '../../controllers/AuthController.js'
import { authMiddleware } from '../../middleware/auth.js'
import { loginLimiter } from '../../middleware/rateLimit.js'

const router = express.Router()

router.post('/login', loginLimiter, AuthController.login)
router.post('/register', AuthController.register)
router.post('/logout', authMiddleware, AuthController.logout)

export default router
