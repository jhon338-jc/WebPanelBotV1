let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .decrypt kdqr')
m.reply('🔓 *Decrypt (Caesar-3)*\n\n' + [...text].map(c => c.match(/[a-z]/i) ? String.fromCharCode((c.charCodeAt(0) - (c < 'a' ? 65 : 97) - 3 + 26) % 26 + (c < 'a' ? 65 : 97)) : c).join(''))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['decrypt', 'dekripsi']
export default handler
