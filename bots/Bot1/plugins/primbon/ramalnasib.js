let handler = async (m, { conn, text, args }) => {
try {
    const a = ['sedang baik-baik saja','perlu lebih sabar','penuh keberuntungan','butuh istirahat lebih','siap untuk naik level']
m.reply('🔮 *RAMAL NASIB*\n\nHari ini nasib kamu ' + a[Math.floor(Math.random()*a.length)])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramalnasib']
export default handler
