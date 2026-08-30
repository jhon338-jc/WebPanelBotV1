let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan teks!')
    m.reply(['📝 *WORD COUNT*', '', 'Kata: *' + text.split(/\\s+/).filter(Boolean).length + '*', 'Huruf: *' + text.replace(/\\s+/g, '').length + '*'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['wordcount', 'hitungkata']
export default handler
