let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .mirror Jhon')
m.reply('🔁 *Balik*\n\n' + [...text].reverse().join(''))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['mirror', 'balik']
export default handler
