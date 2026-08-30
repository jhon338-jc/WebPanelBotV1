let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu?')
m.reply('⚡ *NIGHTCORE: ' + text + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['nightcore']
export default handler
