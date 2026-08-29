import express from 'express'
import webAuthRoutes from './web/auth.js'
import webAdminRoutes from './web/admin.js'
import webUserRoutes from './web/user.js'
import apiAuthRoutes from './api/auth.js'
import apiAdminRoutes from './api/admin.js'
import apiUserRoutes from './api/user.js'

const router = express.Router()

router.use('/', webAuthRoutes)
router.use('/admin', webAdminRoutes)
router.use('/user', webUserRoutes)
router.use('/api/auth', apiAuthRoutes)
router.use('/api/admin', apiAdminRoutes)
router.use('/api/user', apiUserRoutes)

router.get('/', (req, res) => res.redirect('/login'))

export default router
