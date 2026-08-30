let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .heksa hello')
    m.reply('🔢 *HEXADESIMAL*\n\n' + Buffer.from(text).toString('hex'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['heksa', 'hex']
export default handler
