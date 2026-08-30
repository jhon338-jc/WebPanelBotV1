let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .panjang Jhon338')
    m.reply('📏 Panjang *"' + text + '"* = *' + text.length + '* karakter')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['panjang', 'length']
export default handler
