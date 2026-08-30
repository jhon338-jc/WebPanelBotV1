let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Cari gambar Pinterest!\nContoh: .pinterest anime')
    m.reply('🔍 Pinterest: *' + text + '*\n\n(API pencarian butuh koneksi online)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['pinterest', 'pin', 'pindl']
export default handler
