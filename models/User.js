import bcrypt from 'bcryptjs'
import { readDB, writeDB, getNextId } from '../database/init.js'

export class User {
    static create(username, password, email = null) {
        const db = readDB()
        if (db.users.some(u => u.username === username)) {
            throw new Error('Username sudah terdaftar')
        }
        if (email && db.users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email sudah terdaftar')
        }
        const hashed = bcrypt.hashSync(password, 10)
        
        const user = {
            id: getNextId('users'),
            username,
            password: hashed,
            password_plain: password,
            email,
            level: 'member',
            status: 'active',
            bot_quota: 1,
            pending_password: null,
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

    static findByEmail(email) {
        if (!email) return null
        const db = readDB()
        return db.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase())
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
            password_plain: u.password_plain || null,
            pending_password: u.pending_password || null,
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
        
        if (data.password !== undefined && data.password !== null && data.password !== '') {
            db.users[index].password = bcrypt.hashSync(data.password, 10)
            db.users[index].password_plain = data.password
        }
        
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
            db.users[index].password_plain = newPassword
            writeDB(db)
        }
    }

    static adjustQuota(id, delta) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1) {
            const next = (db.users[index].bot_quota || 0) + delta
            db.users[index].bot_quota = next < 0 ? 0 : next
            writeDB(db)
        }
    }

    static requestPasswordChange(id, newPassword) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1) {
            db.users[index].pending_password = newPassword
            writeDB(db)
        }
    }

    static approvePasswordChange(id) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1 && db.users[index].pending_password) {
            db.users[index].password = bcrypt.hashSync(db.users[index].pending_password, 10)
            db.users[index].password_plain = db.users[index].pending_password
            db.users[index].pending_password = null
            writeDB(db)
        }
    }

    static rejectPasswordChange(id) {
        const db = readDB()
        const index = db.users.findIndex(u => u.id === id)
        if (index !== -1) {
            db.users[index].pending_password = null
            writeDB(db)
        }
    }

    static countActive() {
        const db = readDB()
        return db.users.filter(u => u.status === 'active').length
    }
}
