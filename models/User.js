import bcrypt from 'bcryptjs'
import { readDB, writeDB, getNextId } from '../database/init.js'

export class User {
    static create(username, password, email = null) {
        const db = readDB()
        const hashed = bcrypt.hashSync(password, 10)
        
        const user = {
            id: getNextId('users'),
            username,
            password: hashed,
            email,
            level: 'member',
            status: 'active',
            bot_quota: 1,
            expired_at: null,
            created_at: new Date().toISOString(),
            last_login: null
        }
        
        db.users.push(user)
        writeDB(db)
        return user.id
    }

    static findByUsername(username) {
        const db = readDB()
        return db.users.find(u => u.username === username)
    }

    static findById(id) {
        const db = readDB()
        return db.users.find(u => u.id === id)
    }

    static findAll() {
        const db = readDB()
        return db.users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            level: u.level,
            status: u.status,
            bot_quota: u.bot_quota,
            expired_at: u.expired_at,
            created_at: u.created_at,
            last_login: u.last_login
        }))
    }

    static update(id, data) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index === -1) return
        
        const allowed = ['username', 'email', 'level', 'status', 'bot_quota', 'expired_at']
        for (const key of allowed) {
            if (data[key] !== undefined) {
                db.users[index][key] = data[key]
            }
        }
        
        writeDB(db)
    }

    static updateLastLogin(id) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1) {
            db.users[index].last_login = new Date().toISOString()
            writeDB(db)
        }
    }

    static delete(id) {
        const db = readDB()
        db.users = db.users.filter(u => u.id !== id)
        writeDB(db)
    }

    static verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword)
    }

    static setPassword(id, newPassword) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1) {
            db.users[index].password = bcrypt.hashSync(newPassword, 10)
            writeDB(db)
        }
    }

    static countActive() {
        const db = readDB()
        return db.users.filter(u => u.status === 'active').length
    }
}
