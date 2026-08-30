import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SELLERS_FILE = path.join(__dirname, '..', 'database', 'sellers.json')

// Plan seller: 'seller' = 10 bot, 'premium' = 50 bot
export const PLAN = {
    SELLER: 'seller',
    PREMIUM: 'premium'
}

export const LIMITS = {
    [PLAN.SELLER]: 10,
    [PLAN.PREMIUM]: 50
}

export function maxBotsFor(plan) {
    return LIMITS[plan] || 10
}

const defaultData = {
    sellers: []
}

export function initSellers() {
    if (!fs.existsSync(SELLERS_FILE)) {
        fs.writeFileSync(SELLERS_FILE, JSON.stringify(defaultData, null, 2))
        console.log('[SELLER] database/sellers.json dibuat')
    }
    return SELLERS_FILE
}

export function readSellers() {
    if (!fs.existsSync(SELLERS_FILE)) initSellers()
    try {
        return JSON.parse(fs.readFileSync(SELLERS_FILE, 'utf-8'))
    } catch (e) {
        return { ...defaultData }
    }
}

export function writeSellers(data) {
    fs.writeFileSync(SELLERS_FILE, JSON.stringify(data, null, 2))
}

export function listSellers() {
    return readSellers().sellers || []
}

export function getSeller(username) {
    return listSellers().find(s => s.username.toLowerCase() === String(username).toLowerCase())
}

export function getSellerById(id) {
    return listSellers().find(s => s.id === id)
}

export function authenticateSeller(username, pin) {
    const seller = getSeller(username)
    if (!seller) return null
    if (seller.status !== 'aktif') return null
    if (String(seller.pin) !== String(pin)) return null
    return seller
}

export function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}

export function createSeller({ username, pin, plan }) {
    const sellers = readSellers()
    username = String(username).trim()
    pin = String(pin).trim()
    plan = plan === PLAN.PREMIUM ? PLAN.PREMIUM : PLAN.SELLER

    if (!isValidUsername(username)) {
        throw new Error('Username minimal 3 karakter (huruf/angka/underscore)')
    }
    if (!/^[0-9]{4,10}$/.test(pin)) {
        throw new Error('PIN harus 4-10 digit angka')
    }
    if (getSeller(username)) {
        throw new Error(`Username "${username}" sudah dipakai`)
    }
    const num = (sellers.sellers?.length || 0) + 1
    const seller = {
        id: `SELLER${String(num).padStart(2, '0')}`,
        username,
        pin,
        plan,
        max_bots: maxBotsFor(plan),
        status: 'aktif',
        created_at: new Date().toISOString()
    }
    sellers.sellers = sellers.sellers || []
    sellers.sellers.push(seller)
    writeSellers(sellers)
    return seller
}

export function updateSeller(username, changes) {
    const sellers = readSellers()
    const idx = sellers.sellers.findIndex(s => s.username.toLowerCase() === String(username).toLowerCase())
    if (idx === -1) return null
    const current = sellers.sellers[idx]

    const next = { ...current }
    if (changes.pin !== undefined) {
        if (!/^[0-9]{4,10}$/.test(String(changes.pin))) {
            throw new Error('PIN harus 4-10 digit angka')
        }
        next.pin = String(changes.pin)
    }
    if (changes.plan !== undefined && [PLAN.SELLER, PLAN.PREMIUM].includes(changes.plan)) {
        next.plan = changes.plan
        next.max_bots = maxBotsFor(changes.plan)
    }
    if (changes.status !== undefined && ['aktif', 'nonaktif'].includes(changes.status)) {
        next.status = changes.status
    }
    sellers.sellers[idx] = next
    writeSellers(sellers)
    return next
}

export function deleteSeller(username) {
    const sellers = readSellers()
    const before = sellers.sellers.length
    sellers.sellers = sellers.sellers.filter(s => s.username.toLowerCase() !== String(username).toLowerCase())
    if (sellers.sellers.length === before) return false
    writeSellers(sellers)
    return true
}

export { SELLERS_FILE }