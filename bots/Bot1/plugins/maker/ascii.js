let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .ascii Jhon')
const p = ['░░░','▓▓▓','▒▒▒','█▓░']
m.reply('🎨 ASCII art untuk *' + text + '*:\n\n' + p.map(x => x.repeat(Math.min(14, text.length + 4))).join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ascii', 'asciiart']
export default handler
