import express from 'express'
import { AdminController } from '../../controllers/AdminController.js'
import { SewaController } from '../../controllers/SewaController.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/bot', (req, res) => res.redirect('/admin/bots'))
router.get('/dashboard', AdminController.dashboard)
router.get('/bots', AdminController.listBots)
router.get('/sewa', SewaController.dashboard)
router.get('/sellers', AdminController.listSellers)
router.get('/settings', AdminController.settings)
router.get('/help', AdminController.help)

export default router
