let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .caps halo')
m.reply((text || '').toUpperCase())
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['caps', 'hurufbesar']
export default handler
