let handler = async (m, { conn, text, args }) => {
try {
    const p = Math.floor(Math.random() * 100) + 1
const w = ['besok siang','minggu depan','bulan depan','akhir tahun']
m.reply('💰 *RAMAL REZEKI*\n\nLevel: *' + p + '/100*\nRejeki besar sekitar: ' + w[Math.floor(Math.random()*w.length)])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramalrezeki']
export default handler
