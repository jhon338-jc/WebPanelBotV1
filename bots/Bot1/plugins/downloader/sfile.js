let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL sfile.mobi!')
    m.reply('🗂️ SFILE: ' + text + '\n\nKirim ulang saat API online.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['sfile', 'sfiledl']
export default handler
