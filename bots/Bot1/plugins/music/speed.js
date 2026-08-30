let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu?')
m.reply('🚀 *SPEED UP: ' + text + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['speed', 'cepetane']
export default handler
