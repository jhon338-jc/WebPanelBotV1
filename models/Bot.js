import { readDB, writeDB, getNextId } from '../database/init.js'

export class Bot {
    static create(folder, name) {
        const db = readDB()
        
        const bot = {
            id: getNextId('bots'),
            folder,
            name,
            status: 'stopped',
            connected: false,
            owner: null,
            last_active: null,
            created_at: new Date().toISOString()
        }
        
        db.bots.push(bot)
        writeDB(db)
        return bot.id
    }

    static findAll() {
        const db = readDB()
        return db.bots.map(bot => ({ ...bot }))
    }

    static findByFolder(folder) {
        const db = readDB()
        return db.bots.find(b => b.folder === folder)
    }

    static findById(id) {
        const db = readDB()
        return db.bots.find(b => b.id === id)
    }

    static updateStatus(botId, status, connected = false) {
        const db = readDB()
        const index = db.bots.findIndex(b => b.id === botId)
        if (index !== -1) {
            db.bots[index].status = status
            db.bots[index].connected = connected
            db.bots[index].last_active = new Date().toISOString()
            writeDB(db)
        }
    }

    static updatePid(botId, pid) {
        const db = readDB()
        const index = db.bots.findIndex(b => b.id === botId)
        if (index !== -1) {
            db.bots[index].pid = pid
            writeDB(db)
        }
    }

    static getTotalBots() {
        const db = readDB()
        return db.bots.length
    }

    static setOwner(folder, owner) {
        const db = readDB()
        const bot = db.bots.find(b => b.folder === folder)
        if (!bot) return null
        bot.owner = owner || null
        writeDB(db)
        return { ...bot }
    }

    static findByOwner(username) {
        return Bot.findAll().filter(b => (b.owner || null) === username)
    }

    static countRunningByOwner(username) {
        const db = readDB()
        return db.bots.filter(b => (b.owner || null) === username && b.status === 'running').length
    }

    static getActiveBots() {
        const db = readDB()
        return db.bots.filter(b => b.connected).length
    }

    static getRunningBots() {
        const db = readDB()
        return db.bots.filter(b => b.status === 'running').length
    }
}
