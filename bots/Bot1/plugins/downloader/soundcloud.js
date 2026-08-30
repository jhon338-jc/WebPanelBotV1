let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL SoundCloud!')
    m.reply('⏳ ' + text + '\n\nProses download ... (pastikan koneksi online)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['soundcloud', 'scload']
export default handler
