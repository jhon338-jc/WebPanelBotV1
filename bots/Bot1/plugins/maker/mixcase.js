let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .mixcase halo')
m.reply([...text].map(c => Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase()).join(''))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['mixcase', 'hurufacak']
export default handler
