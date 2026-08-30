let handler = async (m, { conn, text, args }) => {
try {
    const n = Math.floor(Math.random() * 21) - 10
m.reply('📈 *CEK GACOR*\n\nLevel gacor kamu hari ini: ' + (n > 0 ? '+' : '') + n + '%')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['gacor']
export default handler
