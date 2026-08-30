let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL Vidio.com!')
    m.reply('🎥 Vidio: ' + text)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['vidio', 'vidiodl']
export default handler
