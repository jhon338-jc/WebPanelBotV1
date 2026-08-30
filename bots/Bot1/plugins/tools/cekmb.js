let handler = async (m, { conn, text, args }) => {
try {
    const n = (text || '').trim()
if (!n) return m.reply('Masukkan nomor!')
m.reply('📊 *CEK KUOTA*\n\nNomor: ' + n + '\nSisa kuota: *' + (Math.floor(Math.random() * 40) + 1) + ' GB*\n\n(Simulasi - cek resmi via *123#)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekmb', 'cekkuota']
export default handler
