import express from 'express'
import { AdminController } from '../../controllers/AdminController.js'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js'
import { levelMiddleware } from '../../middleware/level.js'

const router = express.Router()

router.use(authMiddleware, adminMiddleware, levelMiddleware('admin'))

router.get('/dashboard', AdminController.dashboard)
router.get('/bots', AdminController.listBots)
router.get('/users', AdminController.listUsers)

export default router
