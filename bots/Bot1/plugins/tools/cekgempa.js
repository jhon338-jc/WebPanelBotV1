let handler = async (m, { conn, text, args }) => {
try {
    
    const { gempa } = await import('../../lib/apis.js')
    const g = await gempa()
    if (!g) return m.reply('❌ Data gempa tidak tersedia saat ini.')
    m.reply(['🌋 *INFORMASI GEMPA TERKINI*', '', 'Waktu: ' + g.waktu, 'Magnitudo: *M ' + g.magnitude + '*', 'Lokasi: ' + g.lokasi, 'Kedalaman: ' + g.kedalaman, 'Potensi: ' + g.potensi, '', 'Tetap waspada & jangan panik! 🙏'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekgempa', 'gempa']
export default handler
