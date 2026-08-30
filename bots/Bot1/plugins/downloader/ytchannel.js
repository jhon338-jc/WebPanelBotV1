let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Nama channel?\nContoh: .ytchannel jhon338')
    m.reply('📺 Cek channel *' + text + '*\n\n💡 Bisa juga pakai .ytcari')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ytchannel']
export default handler
