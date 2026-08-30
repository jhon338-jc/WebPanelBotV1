let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu?')
m.reply('🎵 *Cari nada: ' + text + '*\n\nGunakan .not untuk not angka dasar.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tunelagu']
export default handler
