import fs from 'fs'
import * as JimpModule from 'jimp'
const Jimp = JimpModule.Jimp || JimpModule.default
import config from '../../config.json' with { type: 'json' }
import { plugins } from '../../handler.js'
import os from 'os'

let handler = async (m, { conn }) => {
    const start = Date.now()

    const image = await Jimp.read(fs.readFileSync('./src/img/menu.jpg'))
    image.resize({ w: 400, h: 400 })
    const thumb = await image.getBufferAsync(Jimp.MIME_JPEG)

    const ping = Date.now() - start
    const runtime = process.uptime()
    const days = Math.floor(runtime / 86400)
    const hours = Math.floor((runtime % 86400) / 3600)
    const minutes = Math.floor((runtime % 3600) / 60)
    const seconds = Math.floor(runtime % 60)
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
    const totalPlugin = [...new Set(plugins.values())].length
    const number = m.sender.split('@')[0]

    let menuText = `╭───『 *${config.botName}* 』───⬣
│
│  🤖 *Bot Information*
│  ├ Nama : ${config.botName}
│  ├ Dev : ${config.ownerName}
│  ├ Mode : ${config.botMode.toUpperCase()}
│  ├ Plugins : ${totalPlugin}
│  ├ Ping : ${ping}ms
│  ├ RAM : ${ramUsed}MB
│  └ Uptime : ${days}d ${hours}h ${minutes}m ${seconds}s
│
│  👤 *User Information*
│  ├ Nama : ${m.pushName || '-'}
│  ├ Nomor : +${number}
│  └ Status : ${m.isOwner ? '👑 Owner' : '👤 User'}
│
╰──────────────────⬣`

    let listMenu = [
        { id: '.sg', title: '🔄 Pilih Grup', description: 'Pilih grup untuk dipantau' },
        { id: '.grouplist', title: '📊 Semua Grup', description: 'Lihat semua grup & anggota' },
        { id: '.kick', title: '👤 Kick User', description: '.kick @user' },
        { id: '.add', title: '➕ Add User', description: '.add 628xx' },
        { id: '.addadmin', title: '👑 Add Admin', description: '.addadmin @user' },
        { id: '.deladmin', title: '👑 Del Admin', description: '.deladmin @user' },
        { id: '.setname', title: '✏️ Ganti Nama Grup', description: '.setname Nama Baru' },
        { id: '.setdesc', title: '📝 Ganti Deskripsi', description: '.setdesc Deskripsi Baru' },
        { id: '.setpp', title: '🖼️ Ganti PP Grup', description: 'Reply gambar + .setpp' },
        { id: '.setbio', title: '📝 Ganti Bio Bot', description: '.setbio Bio keren' },
        { id: '.setnamebot', title: '🏷️ Ganti Nama Bot', description: '.setnamebot Nama baru' },
        { id: '.totag', title: '📢 Tag All', description: 'Tag semua anggota' },
        { id: '.hidetag', title: '👻 Hide Tag', description: 'Tag semua (sembunyi)' },
        { id: '.leave', title: '🚪 Leave Grup', description: 'Bot keluar dari grup' },
        { id: '.addowner', title: '➕ Add Owner', description: '.addowner 628xx' },
        { id: '.delowner', title: '➖ Del Owner', description: '.delowner 628xx' },
        { id: '.stiker', title: '🎨 Stiker Brat', description: '.stiker teks' },
        { id: '.simg', title: '🖼️ Stiker Gambar', description: '.simg reply gambar' },

        { id: '.simg', title: '🎬 Stiker Video', description: '.simg reply video' },
        { id: '.toimg', title: '🔄 Stiker ke Gambar/Video', description: '.toimg reply stiker' },        { id: '.iqc', title: '🧠 IQ Checker', description: '.iqc - Cek IQ' },
        { id: '.fakedana', title: '💸 Fake Dana', description: '.fakedana jumlah' },
        { id: '.fakeff', title: '🎮 Fake FF', description: '.fakeff nama' },
        { id: '.tt', title: '🎵 TikTok DL', description: '.tt url tiktok' },
        { id: '.ig', title: '📷 Instagram DL', description: '.ig url instagram' },
        { id: '.fb', title: '📘 Facebook DL', description: '.fb url facebook' },
        { id: '.mp3', title: '🎶 YouTube MP3', description: '.mp3 url youtube' },
        { id: '.mediafie', title: '📦 MediaFire DL', description: '.mediafie url mediafire' },
        { id: '.lirik', title: '📜 Lirik Lagu', description: '.lirik judul lagu' },
        { id: '.detik', title: '📰 Berita Detik', description: '.detik - berita terbaru' },
        { id: '.rvo', title: '👁️ Read View Once', description: '.rvo - Reply pesan VO' },
        { id: '.ping', title: '🏓 Ping', description: 'Cek kecepatan bot' },
        { id: '.info', title: 'ℹ️ Info Bot', description: 'Info lengkap bot' }
    ]

    let listMenuUser = [
        { id: '.grouplist', title: '📊 Semua Grup', description: 'Lihat semua grup & anggota' },
        { id: '.stiker', title: '🎨 Stiker Brat', description: '.stiker teks' },
        { id: '.simg', title: '🖼️ Stiker Gambar', description: '.simg reply gambar' },
        { id: '.simg', title: '🎬 Stiker Video', description: '.simg reply video' },
        { id: '.toimg', title: '🔄 Stiker ke Gambar/Video', description: '.toimg reply stiker' },        { id: '.iqc', title: '🧠 IQ Checker', description: '.iqc - Cek IQ' },
        { id: '.fakedana', title: '💸 Fake Dana', description: '.fakedana jumlah' },
        { id: '.fakeff', title: '🎮 Fake FF', description: '.fakeff nama' },
        { id: '.tt', title: '🎵 TikTok DL', description: '.tt url tiktok' },
        { id: '.ig', title: '📷 Instagram DL', description: '.ig url instagram' },
        { id: '.fb', title: '📘 Facebook DL', description: '.fb url facebook' },
        { id: '.mp3', title: '🎶 YouTube MP3', description: '.mp3 url youtube' },
        { id: '.mediafie', title: '📦 MediaFire DL', description: '.mediafie url mediafire' },
        { id: '.lirik', title: '📜 Lirik Lagu', description: '.lirik judul lagu' },
        { id: '.detik', title: '📰 Berita Detik', description: '.detik - berita terbaru' },
        { id: '.rvo', title: '👁️ Read View Once', description: '.rvo - Reply pesan VO' },
        { id: '.ping', title: '🏓 Ping', description: 'Cek kecepatan bot' },
        { id: '.info', title: 'ℹ️ Info Bot', description: 'Info lengkap bot' }
    ]

    let finalList = m.isOwner ? listMenu : listMenuUser
    let sectionTitle = m.isOwner ? '👑 Menu Owner' : '📋 Menu User'

    await conn.sendMessage(m.chat, {
        buttonLocation: {
            latitude: 0, longitude: 0,
            name: config.botName, address: config.ownerName,
            jpegThumbnail: thumb, text: menuText,
            footer: '© ' + config.ownerName + ' • ' + new Date().getFullYear(),
            listButtonText: '☰ BUKA MENU',
            listSectionTitle: sectionTitle,
            listMenu: finalList
        }
    }, { quoted: m })
}

handler.command = ['menu', 'help']
export default handler
