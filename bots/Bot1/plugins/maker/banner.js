let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .banner SELAMAT DATANG')
    const t = text.toUpperCase()
    const w = t.length + 6
    m.reply(['═══' + '═'.repeat(w) + '═══', '▎ ' + t + ' ▐█', '═══' + '═'.repeat(w) + '═══'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['banner', 'spanduk']
export default handler
