let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .vaporwave Jhon')
    m.reply('🌸 *V A P O R W A V E* 🌸\n\n' + text.split('').join(' ').toUpperCase())
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['vaporwave', 'vapor']
export default handler
