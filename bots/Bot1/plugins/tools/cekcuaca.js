let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan nama kota!\nContoh: .cekcuaca Bandung')
    const { cuaca, weatherText } = await import('../../lib/apis.js')
    const w = await cuaca(text)
    m.reply(['🌤️ *CUACA ' + w.kota.toUpperCase() + '*', '', 'Suhu: ' + w.temp + '°C', 'Angin: ' + w.wind + ' km/h', 'Kondisi: ' + weatherText(w.code), 'Waktu: ' + w.time].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekcuaca', 'cuaca']
export default handler
