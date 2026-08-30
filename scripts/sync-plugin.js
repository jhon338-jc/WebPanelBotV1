// ================================================================
//  scripts/sync-plugin.js
//  Sinkronkan folder plugins dari Bot1 ke semua bot lain (Bot2..Bot50).
//  Bot1 = source of truth. Fitur baru cukup ditambah di Bot1, lalu
//  sync (via setup.sh / server.js / manual) menyebar ke seluruh bot.
//
//  Dipakai:
//    - node scripts/sync-plugin.js        (manual/CLI)
//    - import { syncPlugins } from './scripts/sync-plugin.js'  (server.js)
// ================================================================
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BOTS_DIR = path.join(__dirname, '..', 'bots')
const SRC_DIR = path.join(BOTS_DIR, 'Bot1', 'plugins')

function syncOne(destDir) {
    if (!fs.existsSync(SRC_DIR)) throw new Error('Bot1/plugins tidak ditemukan')
    if (!fs.existsSync(destDir)) return 0
    let copied = 0
    const walk = (from, to) => {
        for (const item of fs.readdirSync(from, { withFileTypes: true })) {
            if (item.name === 'node_modules') continue
            const sf = path.join(from, item.name)
            const df = path.join(to, item.name)
            if (item.isDirectory()) {
                if (!fs.existsSync(df)) fs.mkdirSync(df, { recursive: true })
                walk(sf, df)
            } else {
                let need = true
                if (fs.existsSync(df)) {
                    const s = fs.statSync(sf)
                    const d = fs.statSync(df)
                    need = s.size !== d.size
                }
                if (need) {
                    fs.copyFileSync(sf, df)
                    copied++
                }
            }
        }
    }
    walk(SRC_DIR, destDir)
    return copied
}

export function syncPlugins(verbose = false) {
    let bots = 0
    let copied = 0
    let errors = 0
    if (!fs.existsSync(BOTS_DIR)) return { bots, copied, errors }
    for (const name of fs.readdirSync(BOTS_DIR)) {
        if (!/^Bot\d+$/.test(name) || name === 'Bot1') continue
        try {
            copied += syncOne(path.join(BOTS_DIR, name, 'plugins'))
            bots++
        } catch (e) {
            errors++
            console.error(`[SYNC] ${name} gagal: ${e.message}`)
        }
    }
    if (verbose) {
        console.log(`[SYNC] Plugin Bot1 -> ${bots} bot selesai (${copied} file baru/ubah, ${errors} error)`)
    }
    return { bots, copied, errors }
}

if (process.argv[1] && process.argv[1].endsWith('sync-plugin.js')) {
    syncPlugins(true)
}