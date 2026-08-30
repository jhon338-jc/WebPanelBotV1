import express from 'express'
import { AdminController } from '../../controllers/AdminController.js'
import { SewaController } from '../../controllers/SewaController.js'
import { authMiddleware } from '../../middleware/auth.js'
import { apiLimiter, botActionLimiter } from '../../middleware/rateLimit.js'

const router = express.Router()

router.use(authMiddleware, apiLimiter)

router.get('/stats', AdminController.dashboard)
router.get('/bots', AdminController.listBots)
router.get('/settings', AdminController.settings)
router.post('/settings', AdminController.updateSettings)
router.get('/bots/start-all', botActionLimiter, AdminController.startAllBots)
router.get('/bots/stop-all', botActionLimiter, AdminController.stopAllBots)
router.get('/bots/:folder/start', botActionLimiter, AdminController.startBot)
router.get('/bots/:folder/stop', botActionLimiter, AdminController.stopBot)
router.get('/bots/:folder/restart', botActionLimiter, AdminController.restartBot)
router.get('/bots/:folder/logout', botActionLimiter, AdminController.logoutBot)
router.get('/bots/:folder/logs', AdminController.getBotLogs)
router.post('/bots/:folder/input', botActionLimiter, AdminController.sendInput)
router.get('/system', AdminController.systemInfo)

router.get('/sewa', SewaController.dashboard)
router.post('/sewa/:id/verify', botActionLimiter, SewaController.verifyPayment)
router.post('/sewa/:id/cancel', botActionLimiter, SewaController.cancelSewa)

export default router
