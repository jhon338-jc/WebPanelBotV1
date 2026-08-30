let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Cari video YouTube!\nContoh: .ytsearch tutorial')
    m.reply('🔍 *Pencarian: ' + text + '*\n\n⚠️ API pencarian membutuhkan koneksi online.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ytsearch', 'ytcari']
export default handler
