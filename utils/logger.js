import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

class Logger {
    log(level, message, data = null) {
        const timestamp = new Date().toISOString()
        const entry = { timestamp, level, message, data }
        const consoleMsg = `[${timestamp}] [${level.toUpperCase()}] ${message}`
        if (level === 'error') console.error(consoleMsg)
        else if (level === 'warn') console.warn(consoleMsg)
        else console.log(consoleMsg)
        const logFile = path.join(logDir, `${timestamp.split('T')[0]}.log`)
        fs.appendFileSync(logFile, JSON.stringify(entry) + '\n')
    }
    info(msg, data) { this.log('info', msg, data) }
    warn(msg, data) { this.log('warn', msg, data) }
    error(msg, data) { this.log('error', msg, data) }
}

export const logger = new Logger()
