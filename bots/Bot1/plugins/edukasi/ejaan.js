let handler = async (m, { conn, text, args }) => {
try {
    const a = [['di- dan ke-', 'ditulis terpisah: di sini, ke sana'],['antar-', 'antar kota (panduan EYD V)'],['imbuhan', 'ber-, me-, ter- menyatu: berlari'],['kata ulang', 'rumah-rumah dipakai tanda hubung']]
const q = a[Math.floor(Math.random()*a.length)]
m.reply('✍️ *EJAAN*\n\n' + q[0] + ': ' + q[1])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ejaan', 'eyd']
export default handler
