import express from 'express'
import { SellerController } from '../../controllers/SellerController.js'
import { sellerMiddleware } from '../../middleware/auth.js'
import { apiLimiter, botActionLimiter } from '../../middleware/rateLimit.js'

const router = express.Router()

router.use(sellerMiddleware, apiLimiter)

router.get('/stats', SellerController.dashboard)
router.get('/bots', SellerController.listBots)
router.get('/sewa', SellerController.sewa)
router.get('/bots/:folder/start', botActionLimiter, SellerController.startBot)
router.get('/bots/:folder/stop', botActionLimiter, SellerController.stopBot)
router.get('/bots/:folder/restart', botActionLimiter, SellerController.restartBot)
router.get('/bots/:folder/logs', SellerController.getBotLogs)
router.post('/bots/:folder/input', botActionLimiter, SellerController.sendInput)
router.get('/sewa/:id/verify', botActionLimiter, SellerController.verifyPayment)
router.get('/sewa/:id/cancel', botActionLimiter, SellerController.cancelSewa)

export default router