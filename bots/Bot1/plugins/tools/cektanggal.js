let handler = async (m, { conn, text, args }) => {
try {
    m.reply('📆 Hari ini: *' + new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cektanggal', 'tanggalini']
export default handler
