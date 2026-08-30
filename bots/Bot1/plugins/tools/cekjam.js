let handler = async (m, { conn, text, args }) => {
try {
    const n = new Date()
m.reply(['🕐 *WAKTU*', '', 'Jam: ' + String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0') + ' WIB', 'Tanggal: ' + n.toLocaleDateString('id-ID')].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekjam', 'waktusekarang']
export default handler
