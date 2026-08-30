let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .biner hello')
    m.reply('🔢 *BINARY*\n\n' + [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['biner', 'binary']
export default handler
