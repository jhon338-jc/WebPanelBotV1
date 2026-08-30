let handler = async (m, { conn, text, args }) => {
try {
    const n = (text || '').trim()
if (!n) return m.reply('Masukkan nomor!')
m.reply('📱 *CEK PULSA*\n\nNomor: ' + n + '\nSisa pulsa: *Rp' + (Math.floor(Math.random() * 150) + 5).toLocaleString('id-ID') + '*\n\n(Simulasi - cek resmi via *800#)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekpulsa']
export default handler
