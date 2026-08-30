let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Judul lagu?')
m.reply('🐌 *SLOWED + REVERB: ' + text + '*\n\n(Butuh ffmpeg & audio source; cek koneksi)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['slowed']
export default handler
