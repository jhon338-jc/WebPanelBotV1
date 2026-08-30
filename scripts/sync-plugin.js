// ================================================================
//  scripts/sync-plugin.js
//  Sinkronkan fitur bot dari Bot1 ke semua bot lain (Bot2..Bot50).
//  Bot1 = source of truth. Fitur baru cukup ditambah di Bot1, lalu
//  sync (via setup.sh / server.js / manual) menyebar ke seluruh bot.
//
//  Disinkronkan dari Bot1:
//    - plugins/**        (fitur/command)
//    - handler.js        (routing pesan, auto-mod: spam/link)
//    - index.js          (main bot, koneksi baileys)
//    - lib/**            (helper: msg.js, apis.js, autoMod.js, dll)
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
                    need = fs.statSync(sf).size !== fs.statSync(df).size
                }
                if (need) {
                    fs.copyFileSync(sf, df)
                    copied++
                }
            }
        }
    }
    walk(SRC_DIR, path.join(destDir, 'plugins'))

    // File inti bot + helper lib ikut disinkronkan dari Bot1
    const srcRoot = path.join(BOTS_DIR, 'Bot1')
    for (const rel of ['handler.js', 'index.js']) {
        const sf = path.join(srcRoot, rel)
        const df = path.join(destDir, rel)
        if (!fs.existsSync(sf)) continue
        if (fs.existsSync(df) && fs.statSync(sf).size === fs.statSync(df).size) continue
        fs.copyFileSync(sf, df)
        copied++
    }
    const libSrc = path.join(srcRoot, 'lib')
    const libDest = path.join(destDir, 'lib')
    if (fs.existsSync(libSrc)) {
        if (!fs.existsSync(libDest)) fs.mkdirSync(libDest, { recursive: true })
        walk(libSrc, libDest)
    }
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
            copied += syncOne(path.join(BOTS_DIR, name))
            bots++
        } catch (e) {
            errors++
            console.error(`[SYNC] ${name} gagal: ${e.message}`)
        }
    }
    if (verbose) {
        console.log(`[SYNC] Bot1 -> ${bots} bot selesai (${copied} file baru/ubah, ${errors} error)`)
    }
    return { bots, copied, errors }
}

if (process.argv[1] && process.argv[1].endsWith('sync-plugin.js')) {
    syncPlugins(true)
}