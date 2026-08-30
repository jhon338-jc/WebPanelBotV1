import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_PATH = path.join(__dirname, 'panel.json')

// Default database structure
const defaultDB = {
    bots: [],
    logs: [],
    counters: {
        bots: 0,
        logs: 0
    }
}

export function initDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2))
        console.log('[DB] Database created at', DB_PATH)
    }
    return DB_PATH
}

export function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        initDatabase()
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

export function writeDB(data) {
    syncCounters(data)
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function syncCounters(db) {
    if (!db.counters) db.counters = { bots: 0, logs: 0 }
    db.counters.bots = Array.isArray(db.bots) ? db.bots.length : 0
    db.counters.logs = Array.isArray(db.logs) ? db.logs.length : 0
}

export function getNextId(counterName) {
    const db = readDB()
    const id = (db.counters[counterName] || 0) + 1
    db.counters[counterName] = id
    writeDB(db)
    return id
}

export { DB_PATH }
