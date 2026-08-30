let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL Vimeo!')
    m.reply('🎬 Vimeo: ' + text)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['vimeo', 'vimeodl']
export default handler
