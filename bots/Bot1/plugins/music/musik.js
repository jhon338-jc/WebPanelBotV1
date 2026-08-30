let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu? Contoh: .musik lagu')
m.reply('🎵 Cari lagu *' + text + '*\n\nGunakan .play untuk streaming langsung.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['musik']
export default handler
