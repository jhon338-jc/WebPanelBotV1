let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan link Terabox!')
    m.reply(['📦 *Terabox Download*', '', 'Link: ' + text, '', '⚠️ API terabox sedang tidak stabil, coba ulang.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['terabox', 'tbox']
export default handler
