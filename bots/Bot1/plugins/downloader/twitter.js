let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL X/Twitter!')
    m.reply('🐦 Twitter/X: ' + text)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['twitter', 'twvid', 'twdl']
export default handler
