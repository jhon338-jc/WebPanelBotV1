let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🕌 *JADWAL SHOLAT (estimasi WIB)*', '', 'Subuh: 04:30', 'Dhuha: 06:15', 'Dzuhur: 12:00', 'Ashar: 15:15', 'Maghrib: 18:00', 'Isya: 19:15', '', 'Jadwal aktual tergantung kota. Tetaplah sholat tepat waktu ya!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ceksholat', 'jadwalsholat']
export default handler
