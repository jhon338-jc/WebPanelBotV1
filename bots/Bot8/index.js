import fs from 'fs'
import readline from 'readline'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import {
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
    makeWASocket as makeWASocket2
} from '@whiskeysockets/baileys'
import { smsg, makeWASocket, bind } from './lib/msg.js'
import handleMessage, { initPlugins } from './handler.js'

process.on('uncaughtException', () => {})
process.on('unhandledRejection', () => {})

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = text => new Promise(resolve => {
    if (rl.closed) {
        rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        rl.on('close', () => rl = null)
    }
    rl.question(text, resolve)
})

let socket
let reconnectTimer = null
let pluginsLoaded = false
let isConnecting = false
let reconnectAttempt = 0

const MONITOR_FILE = './database/monitor.json'
const CONFIG_FILE = './config.json'

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

const getStatusCode = lastDisconnect => {
    try {
        if (!lastDisconnect?.error) return 0
        return Boom.isBoom(lastDisconnect.error)
            ? lastDisconnect.error.output.statusCode
            : lastDisconnect.error?.output?.statusCode || 0
    } catch {
        return 0
    }
}

async function restartBot(delay = 5000) {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
    }
    console.log(`\n[RECONNECT] Mencoba menyambung ulang dalam ${delay/1000} detik...`)
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        reconnectAttempt++
        start()
    }, delay)
}

async function sendGroupListToOwner(conn) {
    try {
        const config = readJSON(CONFIG_FILE)
        const ownerNumber = config.creator[0]
        const ownerJid = ownerNumber + '@s.whatsapp.net'

        const groups = await conn.groupFetchAllParticipating()
        const groupList = Object.values(groups)

        if (groupList.length === 0) {
            await conn.sendMessage(ownerJid, { text: '❌ Bot tidak ada di grup manapun!' })
            return
        }

        let text = `╭─── *「 JHON338 - BOT 」* ───\n`
        text += `│\n│  ✅ *Bot Berhasil Tersambung!*\n│\n`
        text += `│  📊 *Total Grup:* ${groupList.length}\n│\n│  📋 *Daftar Grup:*\n│\n`

        groupList.forEach((group, index) => {
            const memberCount = group.participants?.length || 0
            text += `│  *${index + 1}.* ${group.subject}\n`
            text += `│      👥 ${memberCount} anggota\n│\n`
        })

        text += `│  ═══════════════════\n│\n│  🎯 *Pilih Grup:*\n│  *1,2,3,4,5*\n│  (Min 1, Maks 5)\n│\n╰─── *「 JHON338 - BOT 」* ───`

        const existingMonitor = JSON.parse(fs.readFileSync(MONITOR_FILE, 'utf-8'))
        
        if (!existingMonitor.waiting) {
            console.log(`[STARTUP] Tidak menunggu pilihan grup (waiting=false, ${existingMonitor.groups.length} grup tersimpan)`)
            console.log('[STARTUP] Kirim .sg ke bot untuk mengubah pilihan grup')
        } else {
            await conn.sendMessage(ownerJid, { text: text })
            const monitor = { groups: [], waiting: true }
            writeJSON(MONITOR_FILE, monitor)
            console.log('[STARTUP] Daftar grup terkirim ke owner')
            console.log('[STARTUP] Menunggu pilihan grup dari owner...')
        }

    } catch (err) {
        console.error('[STARTUP] Gagal kirim daftar grup:', err.message)
    }
}

async function start() {
    if (isConnecting) return
    isConnecting = true

    try {
        if (socket) {
            socket.ev.removeAllListeners()
            socket.ws?.close?.()
        }

        const { state, saveCreds } = await useMultiFileAuthState('./auth')
        
        socket = makeWASocket({
            auth: state,
            browser: Browsers.ubuntu('Chrome'),
            logger: pino({ level: 'fatal' }),
            printQRInTerminal: false,
            markOnlineOnConnect: true,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            retryRequestDelayMs: 10000,
        })

        bind(socket)

        if (!state.creds.registered) {
    const envNumber = process.env.BOT_OWNER_NUMBER || ''
    let number = envNumber
    
    if (!number) {
        console.log('Masukkan nomor telepon (contoh: 628x)')
        number = await question('Sending Code to : ')
    } else {
        console.log('Sending Code to : ' + number)
    }
            try {
                const code = await socket.requestPairingCode(number, 'JHON3382')
                console.log(`KODE PAIRING: ${code}`)
                // Auto set nomor pairing sebagai creator
                const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
                const cleanNumber = number.replace(/\D/g, '')
                if (!config.creator.includes(cleanNumber)) {
                    config.creator.push(cleanNumber)
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
                    console.log(`[PAIRING] Nomor ${cleanNumber} ditambahkan sebagai creator`)
                }
            } catch (err) {
                console.error('Gagal mengirim kode pairing:', err.message)
                process.exit(1)
            }
        }

        socket.ev.on('creds.update', saveCreds)

                
          socket.ev.on('messages.upsert', async ({ messages }) => {
    if (messages.length === 0) return
    setImmediate(async () => {
        try {
            let m = messages[0]
            if (!m?.message || m.key.remoteJid === 'status@broadcast') return
            if (m.key.remoteJid?.includes('@newsletter')) return
            m = await smsg(socket, m)
            if (m) await handleMessage(socket, m)
        } catch (e) {
            console.error('[DEBUG] ERROR:', e)
        }
    })
})      


        socket.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
            const statusCode = getStatusCode(lastDisconnect)
            const errorMessage = lastDisconnect?.error?.message || ''

            if (connection === 'open') {
                isConnecting = false
                reconnectAttempt = 0
                if (reconnectTimer) {
                    clearTimeout(reconnectTimer)
                    reconnectTimer = null
                }
                if (!pluginsLoaded) {
                    await initPlugins()
                    pluginsLoaded = true
                }
                console.log('[CONNECTION] Bot tersambung!')
                await sendGroupListToOwner(socket)
                return
            }

            if (connection === 'close') {
                isConnecting = false
                
                // LOGOUT = pairing ulang
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('[LOGOUT] Bot logout, hapus auth & restart...')
                    fs.rmSync('./auth', { recursive: true, force: true })
                    restartBot(3000)
                    return
                }
                
                // RECONNECT
                let delay = 5000
                if (errorMessage.includes('Stream Errored')) {
                    delay = 15000
                } else if (statusCode === DisconnectReason.connectionLost || statusCode === 0) {
                    delay = 8000
                } else if (statusCode === DisconnectReason.connectionReplaced) {
                    delay = 30000
                } else if (statusCode === DisconnectReason.timedOut) {
                    delay = 10000
                }
                
                // Max reconnect 10x, setelah itu delay lebih lama
                if (reconnectAttempt > 10) {
                    delay = 60000
                }
                
                console.log(`[DISCONNECT] Status: ${statusCode}, Attempt: ${reconnectAttempt}`)
                restartBot(delay)
            }
        })

        // Keep alive setiap 30 detik
        setInterval(() => {
            if (socket?.user && socket?.ws?.readyState === 1) {
                socket.sendPresenceUpdate('available')
            }
        }, 30000)

    } catch (e) {
        isConnecting = false
        console.error('[ERROR]', e.message)
        if (!reconnectTimer) {
            restartBot(10000)
        }
    }
}

process.on('SIGINT', async () => {
    try {
        if (reconnectTimer) clearTimeout(reconnectTimer)
        socket?.ev.removeAllListeners()
        socket?.ws?.close?.()
    } catch {}
    process.exit(0)
})

start()
