let handler = async (m, { conn, text, args }) => {
try {
    const nama = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
m.reply('📅 Hari ini: *' + nama[new Date().getDay()] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekhari', 'harikini']
export default handler
