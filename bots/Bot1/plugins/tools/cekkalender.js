let handler = async (m, { conn, text, args }) => {
try {
    const n = new Date()
const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
m.reply('🗓️ ' + n.getDate() + ' ' + bln[n.getMonth()] + ' ' + n.getFullYear() + '. Bulan ini: ' + n.toLocaleDateString('id-ID', { month: 'long' }) + ' ' + n.getFullYear())
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekkalender', 'kalender']
export default handler
