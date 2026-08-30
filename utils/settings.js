import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SETTINGS_FILE = path.join(__dirname, '..', 'database', 'settings.json')

const DEFAULTS = {
    username: 'JHON338',
    pin: '030308',
    token_version: 0
}

export function readSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) }
        }
    } catch (e) {}
    return { ...DEFAULTS }
}

export function writeSettings(data) {
    const current = readSettings()
    const merged = { ...current, ...data }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 4))
    return merged
}
