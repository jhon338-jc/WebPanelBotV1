import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import path from 'path'
import fs from 'fs'
import { config } from '../config/config.js'
import { Bot } from '../models/Bot.js'

export class BotManager extends EventEmitter {
    constructor() {
        super()
        this.bots = new Map()
        this.logs = new Map()
        this.initBots()
        this.reclaimRunningBots()
    }

    reclaimRunningBots() {
        const botInfos = Bot.findAll()
        for (const botInfo of botInfos) {
            const pid = botInfo.pid
            if (!pid) continue
            if (this.bots.has(botInfo.folder)) continue
            if (this.isProcessAlive(pid)) {
                this.bots.set(botInfo.folder, {
                    process: null,
                    status: 'running',
                    userId: botInfo.assigned_to,
                    pairingCode: null,
                    connected: Boolean(botInfo.connected),
                    waitingInput: false,
                    pid
                })
                this.addLog(botInfo.folder, 'info', `Bot ${botInfo.folder} terdeteksi masih berjalan (pid: ${pid}), diadopsi kembali`)
            } else {
                Bot.updatePid(botInfo.id, null)
                Bot.updateStatus(botInfo.id, 'stopped', false)
            }
        }
    }

    isProcessAlive(pid) {
        try {
            process.kill(pid, 0)
            return true
        } catch (e) {
            return e.code === 'EPERM'
        }
    }

    initBots() {
        for (let i = 1; i <= config.maxBots; i++) {
            const folder = `Bot${i}`
            if (!Bot.findByFolder(folder)) {
                Bot.create(folder, folder)
            }
            this.logs.set(folder, [])
        }
    }

    resolveOwnerNumber(botPath) {
        if (process.env.BOT_OWNER_NUMBER) return process.env.BOT_OWNER_NUMBER
        try {
            const configPath = path.join(botPath, 'config.json')
            if (fs.existsSync(configPath)) {
                const botConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
                if (botConfig.creator?.[0]) return botConfig.creator[0]
            }
        } catch (e) {}
        return '6285168112952'
    }

    async startBot(folder, userId = null) {
        const botPath = path.join(config.botDir, folder)
        
        if (!fs.existsSync(botPath)) {
            throw new Error(`Folder ${folder} tidak ditemukan`)
        }
        if (!fs.existsSync(path.join(botPath, 'index.js'))) {
            throw new Error(`Bot ${folder} tidak punya index.js`)
        }
        if (this.bots.has(folder)) {
            throw new Error(`Bot ${folder} sudah berjalan`)
        }
        
        const botInfo = Bot.findByFolder(folder)
        if (botInfo?.assigned_to && botInfo.assigned_to !== userId) {
            throw new Error(`Bot ${folder} sudah dipakai user lain`)
        }

        const ownerNumber = this.resolveOwnerNumber(botPath)
        
        const proc = spawn('node', ['index.js'], {
            cwd: botPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: true,
            env: {
                ...process.env,
                BOT_FOLDER: folder,
                BOT_USER_ID: userId || '',
                BOT_OWNER_NUMBER: ownerNumber
            }
        })
        proc.unref()
        
        const botData = {
            process: proc,
            status: 'starting',
            userId: userId,
            pairingCode: null,
            connected: false,
            waitingInput: false,
            pid: proc.pid
        }
        
        this.bots.set(folder, botData)
        Bot.updatePid(botInfo.id, proc.pid)
        this.addLog(folder, 'info', `Bot ${folder} starting... (pid: ${proc.pid})`)
        this.emit('bot-log', { folder, level: 'info', message: `Bot ${folder} starting... (pid: ${proc.pid})` })
        
        proc.on('error', (err) => {
            this.addLog(folder, 'error', `Process error: ${err.message}`)
            Bot.updatePid(botInfo.id, null)
        })
        
        proc.stdout.on('data', (data) => {
            const text = data.toString()
            this.addLog(folder, 'info', text)
            this.emit('bot-log', { folder, level: 'info', message: text })
            
            // Deteksi saat bot meminta input interaktif (pairing nomor)
            const inputPatterns = ['Masukkan nomor telepon', 'Sending Code to :', 'Masukkan', 'Pilih']
            if (inputPatterns.some(p => text.includes(p))) {
                botData.waitingInput = true
                this.emit('bot-status', { folder, status: 'waiting-input' })
                // Fallback: kalau BOT_OWNER_NUMBER tersedia, kirim otomatis
                const ownerNumber = this.resolveOwnerNumber(botPath)
                if (ownerNumber) {
                    botData.waitingInput = false
                    this.sendInput(folder, ownerNumber)
                }
            }
            
            const match = text.match(/KODE PAIRING:\s*([A-Z0-9-]+)/i)
            if (match) {
                botData.pairingCode = match[1]
                botData.waitingInput = false
                this.addLog(folder, 'info', `Pairing code: ${match[1]}`)
                this.emit('pairing-code', { folder, code: match[1] })
            }
            
            if (text.includes('tersambung') || text.includes('Bot tersambung')) {
                botData.connected = true
                botData.waitingInput = false
                Bot.updateStatus(botInfo.id, 'running', true)
                this.emit('bot-status', { folder, status: 'connected' })
            }
        })
        
        proc.stderr.on('data', (data) => {
            const text = data.toString()
            this.addLog(folder, 'error', text)
            this.emit('bot-log', { folder, level: 'error', message: text })
        })
        
        proc.on('exit', (code) => {
            this.addLog(folder, 'warn', `Bot ${folder} exited with code ${code}`)
            this.bots.delete(folder)
            Bot.updatePid(botInfo.id, null)
            Bot.updateStatus(botInfo.id, 'stopped', false)
            this.emit('bot-status', { folder, status: 'stopped' })

            if (botData.manualStop) {
                this.addLog(folder, 'info', `Bot ${folder} dihentikan manual`)
            } else {
                this.addLog(folder, 'warn', `Bot ${folder} crash, restart otomatis dalam 5 detik...`)
                this.emit('bot-log', { folder, level: 'warn', message: `Bot ${folder} crash, restart otomatis...` })
                setTimeout(() => {
                    if (!this.bots.has(folder)) {
                        this.startBot(folder, botData.userId).catch(e => {
                            this.addLog(folder, 'error', `Auto-restart gagal: ${e.message}`)
                        })
                    }
                }, 5000)
            }
        })
        
        Bot.updateStatus(botInfo.id, 'starting')
        return true
    }

    async stopBot(folder) {
        const botData = this.bots.get(folder)
        if (!botData) {
            throw new Error(`Bot ${folder} tidak berjalan`)
        }

        botData.manualStop = true
        botData.process.kill('SIGTERM')
        setTimeout(() => {
            if (this.bots.has(folder)) {
                botData.process.kill('SIGKILL')
            }
        }, 5000)
        
        this.bots.delete(folder)
        const botInfo = Bot.findByFolder(folder)
        if (botInfo) {
            Bot.updateStatus(botInfo.id, 'stopped', false)
        }
        this.emit('bot-status', { folder, status: 'stopped' })
        return true
    }

    async restartBot(folder) {
        const botData = this.bots.get(folder)
        const userId = botData?.userId
        await this.stopBot(folder)
        await new Promise(r => setTimeout(r, 2000))
        return this.startBot(folder, userId)
    }

    async logoutBot(folder) {
        // Hentikan proses bot jika berjalan
        const botData = this.bots.get(folder)
        if (botData) {
            botData.manualStop = true
            try { botData.process.kill('SIGTERM') } catch {}
            this.bots.delete(folder)
        }

        // Setelah dihentikan, pastikan PID bersih
        const botInfo = Bot.findByFolder(folder)
        if (botInfo) {
            Bot.updatePid(botInfo.id, null)
            Bot.updateStatus(botInfo.id, 'stopped', false)
        }

        // Hapus folder auth agar bot logout dari WhatsApp & wajib pairing ulang
        const botPath = path.join(config.botDir, folder)
        const authPath = path.join(botPath, 'auth')
        let removed = false
        try {
            if (fs.existsSync(authPath)) {
                fs.rmSync(authPath, { recursive: true, force: true })
                removed = true
            }
        } catch (e) {
            throw new Error(`Gagal menghapus auth ${folder}: ${e.message}`)
        }

        // Bersihkan log manager untuk bot ini
        this.logs.set(folder, [])

        this.addLog(folder, 'warn', `Bot ${folder} di-logout. Auth dihapus, wajib pairing ulang`)
        this.emit('bot-status', { folder, status: 'stopped' })
        this.emit('bot-log', { folder, level: 'warn', message: `Bot ${folder} di-logout. Auth dihapus, wajib pairing ulang` })

        return removed
    }

    sendInput(folder, input) {
        const botData = this.bots.get(folder)
        if (!botData || !botData.process) {
            throw new Error(`Bot ${folder} tidak berjalan`)
        }
        if (!input) {
            throw new Error('Input kosong')
        }
        if (!botData.waitingInput) {
            throw new Error(`Bot ${folder} tidak sedang meminta input`)
        }
        try {
            botData.process.stdin.write(String(input).trim() + '\n')
            botData.waitingInput = false
            this.addLog(folder, 'info', `Input dikirim: ${String(input).trim()}`)
            this.emit('bot-log', { folder, level: 'info', message: `Input dikirim: ${String(input).trim()}` })
            this.emit('bot-status', { folder, status: 'input-sent' })
            return true
        } catch (e) {
            throw new Error(`Gagal kirim input: ${e.message}`)
        }
    }

    addLog(folder, level, message) {
        const clean = message.replace(/\x1b\[[0-9;]*m/g, '').trim()
        if (!clean) return
        const logs = this.logs.get(folder) || []
        logs.push({ level, message: clean, timestamp: new Date().toISOString() })
        if (logs.length > 200) logs.shift()
        this.logs.set(folder, logs)
    }

    getBotLogs(folder, limit = 50) {
        return (this.logs.get(folder) || []).slice(-limit)
    }

    getBotStatus(folder) {
        const data = this.bots.get(folder)
        return data ? {
            status: data.status,
            connected: data.connected,
            pairingCode: data.pairingCode,
            waitingInput: data.waitingInput,
            pid: data.pid
        } : { status: 'stopped', connected: false, waitingInput: false, pid: null }
    }

    getRunningCount() {
        return this.bots.size
    }
}

let instance = null
export function getBotManager() {
    if (!instance) instance = new BotManager()
    return instance
}
