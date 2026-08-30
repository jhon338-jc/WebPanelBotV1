let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .tulisan Jhon338')
    const t = text.split(' ')
    const max = Math.max(...t.map(w => w.length)) + 4
    const line = '╔' + '═'.repeat(max) + '╗'
    const mid = t.map(w => '║ ' + w.padEnd(max - 2) + '║')
    const end = '╚' + '═'.repeat(max) + '╝'
    m.reply([line, ...mid, end].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tulisan', 'box']
export default handler
