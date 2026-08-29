import express from 'express'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { config } from './config/config.js'
import { initDatabase } from './database/init.js'
import { getBotManager } from './managers/BotManager.js'
import { logger } from './utils/logger.js'
import { verifyToken } from './utils/helpers.js'
import { User } from './models/User.js'
import routes from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

initDatabase()
const botManager = getBotManager()

const app = express()
const server = http.createServer(app)
const io = new SocketIO(server)

// Percaya proxy (Cloudflare Tunnel, ngrok, dll) agar req.secure terisi benar saat HTTPS dari luar
app.set('trust proxy', 1)

app.use(helmet({ contentSecurityPolicy: false }))
app.use(compression())
app.use(morgan('combined', { stream: { write: m => logger.info(m.trim()) } }))
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: config.sessionLifetime
    }
}))

// Disable cache untuk API
app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
})

app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', routes)

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'Not found' })
    }
    res.status(404).render('error', { message: 'Halaman tidak ditemukan', code: 404 })
})

app.use((err, req, res, next) => {
    logger.error('Error:', err)
    if (req.path.startsWith('/api/')) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
    res.status(500).render('error', { message: 'Server error', code: 500 })
})

io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    const decoded = token ? verifyToken(token) : null
    if (!decoded) return next(new Error('Auth required'))
    const user = User.findById(decoded.id)
    if (!user || user.status !== 'active' || (decoded.tv || 0) !== (user.token_version || 0)) {
        return next(new Error('Auth required'))
    }
    socket.user = decoded
    next()
})

io.on('connection', (socket) => {
    if (socket.user.level === 'admin') socket.join('admin')
    socket.join(`user:${socket.user.id}`)

    socket.on('subscribe-bot', (folder) => socket.join(`bot:${folder}`))
    socket.on('unsubscribe-bot', (folder) => socket.leave(`bot:${folder}`))

    socket.on('bot-action', async (data) => {
        try {
            if (socket.user.level !== 'admin') {
                return socket.emit('error', { message: 'Unauthorized' })
            }
            const { action, folder } = data
            if (action === 'start') await botManager.startBot(folder)
            else if (action === 'stop') await botManager.stopBot(folder)
            else if (action === 'restart') await botManager.restartBot(folder)
            socket.emit('bot-action-result', { success: true, message: `${folder} ${action}` })
        } catch (e) {
            socket.emit('error', { message: e.message })
        }
    })
})

botManager.on('bot-log', (data) => {
    io.to(`bot:${data.folder}`).emit('bot-log', data)
    io.to('admin').emit('bot-log', data)
})

botManager.on('bot-status', (data) => {
    io.to(`bot:${data.folder}`).emit('bot-status', data)
    io.to('admin').emit('bot-status', data)
})

botManager.on('pairing-code', (data) => {
    io.to(`bot:${data.folder}`).emit('pairing-code', data)
    io.to('admin').emit('pairing-code', data)
})

const PORT = config.port
server.listen(PORT, '0.0.0.0', () => {
    logger.info(`Panel running on http://localhost:${PORT}`)
})
