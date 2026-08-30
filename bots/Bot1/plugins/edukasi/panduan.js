let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['📖 *PANDUAN BOT*', '', '.menu - daftar fitur', '.sewa - sewa bot', '.info - info bot', '.ping - cek respon', 'Semua perintah pakai prefix . (titik)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['panduan', 'caramake']
export default handler
