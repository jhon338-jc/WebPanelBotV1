import express from 'express'
import { SellerController } from '../../controllers/SellerController.js'
import { sellerMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.use(sellerMiddleware)

router.get('/dashboard', SellerController.dashboard)
router.get('/bots', SellerController.listBots)
router.get('/sewa', SellerController.sewa)

export default router