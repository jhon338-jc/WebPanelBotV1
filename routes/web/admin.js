import express from 'express'
import { AdminController } from '../../controllers/AdminController.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/dashboard', AdminController.dashboard)
router.get('/bots', AdminController.listBots)
router.get('/settings', AdminController.settings)
router.get('/help', AdminController.help)

export default router
