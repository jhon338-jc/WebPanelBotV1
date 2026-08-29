import { readDB, writeDB, getNextId } from '../database/init.js'

export class Bot {
    static create(folder, name) {
        const db = readDB()
        
        const bot = {
            id: getNextId('bots'),
            folder,
            name,
            status: 'stopped',
            assigned_to: null,
            connected: false,
            last_active: null,
            created_at: new Date().toISOString()
        }
        
        db.bots.push(bot)
        writeDB(db)
        return bot.id
    }

    static findAll() {
        const db = readDB()
        return db.bots.map(bot => {
            const assignedUser = db.users.find(u => u.id === bot.assigned_to)
            return {
                ...bot,
                assigned_username: assignedUser ? assignedUser.username : null
            }
        })
    }

    static findByFolder(folder) {
        const db = readDB()
        return db.bots.find(b => b.folder === folder)
    }

    static findById(id) {
        const db = readDB()
        return db.bots.find(b => b.id === id)
    }

    static getAvailableBots() {
        const db = readDB()
        return db.bots.filter(b => b.assigned_to === null && b.status === 'stopped')
    }

    static getBotByUser(userId) {
        const db = readDB()
        return db.bots.filter(b => b.assigned_to === userId)
    }

    static assignBot(botId, userId) {
        const db = readDB()
        const index = db.bots.findIndex(b => b.id === botId)
        if (index !== -1 && db.bots[index].assigned_to === null) {
            db.bots[index].assigned_to = userId
            db.bots[index].status = 'ready'
            writeDB(db)
            return true
        }
        return false
    }

    static releaseBot(botId) {
        const db = readDB()
        const index = db.bots.findIndex(b => b.id === botId)
        if (index !== -1) {
            db.bots[index].assigned_to = null
            db.bots[index].status = 'stopped'
            db.bots[index].connected = false
            writeDB(db)
        }
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

    static getActiveBots() {
        const db = readDB()
        return db.bots.filter(b => b.connected).length
    }

    static getRunningBots() {
        const db = readDB()
        return db.bots.filter(b => b.status === 'running').length
    }
}
