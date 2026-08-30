import express from 'express'
import webAuthRoutes from './web/auth.js'
import webAdminRoutes from './web/admin.js'
import webSellerRoutes from './web/seller.js'
import apiAuthRoutes from './api/auth.js'
import apiAdminRoutes from './api/admin.js'
import apiSellerRoutes from './api/seller.js'

const router = express.Router()

router.use('/', webAuthRoutes)
router.use('/admin', webAdminRoutes)
router.use('/seller', webSellerRoutes)
router.use('/api/auth', apiAuthRoutes)
router.use('/api/admin', apiAdminRoutes)
router.use('/api/seller', apiSellerRoutes)

router.get('/', (req, res) => res.redirect('/login'))

export default router