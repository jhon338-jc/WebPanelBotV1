let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan link playlist!')
    m.reply(['📑 *Playlist*', '', 'Link: ' + text, '', 'Download per-lagu lebih stabil.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ytplaylist', 'playlist']
export default handler
