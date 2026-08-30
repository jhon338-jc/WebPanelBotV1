let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Format tanggal: .ramaltanggal 20 8 2005 (dd mm yyyy)')
const d = new Date(text + (text.split(/\\s+/).length === 3 ? 'T00:00' : ''))
if (isNaN(d.getTime())) return m.reply('Format salah! Contoh: .ramaltanggal 20 8 2005')
const h = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
const a = ['hari penuh ide','waktu tepat move','moment untuk intropeksi','hari keberuntungan']
m.reply(['📅 *RAMAL TANGGAL*', '', h[d.getDay()] + ', ' + d.toLocaleDateString('id-ID'), 'Energi: ' + a[Math.floor(Math.random()*a.length)], '', '(dd mm yyyy ya 😉)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramaltanggal']
export default handler
