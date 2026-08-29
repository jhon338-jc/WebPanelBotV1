import express from 'express'
import { UserController } from '../../controllers/UserController.js'
import { authMiddleware } from '../../middleware/auth.js'
import { apiLimiter, botActionLimiter } from '../../middleware/rateLimit.js'

const router = express.Router()

router.use(authMiddleware, apiLimiter)

router.get('/dashboard', UserController.dashboard)
router.get('/bots/assign', UserController.assignBot)
router.get('/bots/:id/release', UserController.releaseBot)
router.get('/bots/:id/connect', UserController.connectBot)
router.get('/bots/:id/disconnect', UserController.disconnectBot)
router.get('/bots/:id/logout', UserController.logoutBot)
router.get('/bots/:id/logs', UserController.getBotLogs)
router.put('/profile', UserController.updateProfile)
router.post('/change-password', UserController.changePassword)

export default router
