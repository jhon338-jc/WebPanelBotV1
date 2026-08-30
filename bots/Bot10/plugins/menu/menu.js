import config from '../../config.json' with { type: 'json' }
import { plugins } from '../../handler.js'

let handler = async (m, { conn }) => {
    const start = Date.now()
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
        { id: '.ping', title: '🏓 Ping', description: 'Cek kecepatan bot' },
        { id: '.info', title: 'ℹ️ Info Bot', description: 'Info lengkap bot' },
        { id: '.ai', title: '🤖 AI Chat', description: '.ai pertanyaan apa saja' },
        { id: '.sg', title: '🔄 Pilih Grup', description: 'Pilih grup untuk dipantau' },
        { id: '.grouplist', title: '📊 Semua Grup', description: 'Lihat semua grup & anggota' },
        { id: '.kick', title: '👤 Kick User', description: '.kick @user' },
        { id: '.add', title: '➕ Add User', description: '.add 628xx' },
        { id: '.addadmin', title: '👑 Add Admin', description: '.addadmin @user' },
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
        { id: '.simg', title: '🖼️ Stiker Gambar/Video', description: '.simg reply media' },
        { id: '.toimg', title: '🔄 Stiker ke Gambar', description: '.toimg reply stiker' },
        { id: '.iqc', title: '🧠 IQ Checker', description: '.iqc - Cek IQ' },
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
        { id: '.play', title: '🎵 Music', description: '.play judul lagu' },
        { id: '.qrcode', title: '🎨 Maker', description: '.qrcode .tulisan .mirror' },
        { id: '.pantun', title: '🌺 Random', description: '.pantun .quote .lelucon' },
        { id: '.cekkhodam', title: '🔧 Tools Cek', description: '.cekkhodam .cekjodoh .cekzodiak' },
        { id: '.dadu', title: '🎮 Game', description: '.dadu .slot .tebakangka .kuis' },
        { id: '.doa', title: '🕌 Islami', description: '.doa .asmaulhusna .dzikir' },
        { id: '.ramaljodoh', title: '🔮 Primbon', description: '.ramaljodoh .artimimpi .weton' },
        { id: '.download', title: '📥 Downloader', description: '.ytv .igreel .tiktokmusic .apkdl' },
        { id: '.sewa', title: '💰 Sewa Bot', description: 'Sewa bot WhatsApp .sewa' }
    ]

    let listMenuUser = listMenu
        .filter(x => !['.sg', '.kick', '.add', '.addadmin', '.setname', '.setdesc', '.setpp',
            '.setbio', '.setnamebot', '.totag', '.hidetag', '.leave', '.addowner', '.delowner'].includes(x.id))

    let finalList = m.isOwner ? listMenu : listMenuUser
    const base = m.isOwner ? '👑 Menu Owner' : '📋 Menu User'
    const rows = finalList.map(item => ({ title: item.title, rowId: item.id, description: item.description || '' }))

    // WhatsApp: maks ~10 baris per section. Pecah jadi beberapa section agar pasti tampil.
    const sections = []
    const chunk = 10
    for (let i = 0; i < rows.length; i += chunk) {
        const label = rows.length > chunk ? `${base} (${i / chunk + 1})` : base
        sections.push({ title: label, rows: rows.slice(i, i + chunk) })
    }

    await conn.sendMessage(m.chat, {
        text: menuText,
        footer: '© ' + config.ownerName + ' • ' + new Date().getFullYear(),
        buttonText: '☰ BUKA MENU',
        sections
    }, { quoted: m })
}

handler.command = ['menu', 'help']
export default handler