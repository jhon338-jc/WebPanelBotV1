let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL sendspace!')
    m.reply('📦 Sendspace: ' + text)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['sendspace']
export default handler
