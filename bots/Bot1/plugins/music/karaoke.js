let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu?')
m.reply('🎙️ *KARAOKE: ' + text + '*\n\n(Instrumental belum tersedia, pakai .play versi karaoke)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['karaoke']
export default handler
