import express from 'express'
import { UserController } from '../../controllers/UserController.js'
import { authMiddleware } from '../../middleware/auth.js'
import { levelMiddleware } from '../../middleware/level.js'

const router = express.Router()

router.use(authMiddleware, levelMiddleware('member'))

router.get('/dashboard', UserController.dashboard)
router.get('/bots', UserController.myBots)

export default router
