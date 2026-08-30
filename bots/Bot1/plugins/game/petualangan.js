let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🗺️ *PETUALANGAN*', '', 'Kamu berdiri di depan hutan gelap.', '1. Masuk hutan', '2. Putar balik', '3. Istirahat', '', 'Ketik .petualangan 1/2/3 untuk pilih!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['petualangan', 'rpg']
export default handler
