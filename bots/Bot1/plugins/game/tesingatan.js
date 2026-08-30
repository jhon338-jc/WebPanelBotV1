let handler = async (m, { conn, text, args }) => {
try {
    const n = Math.floor(1000 + Math.random() * 4000)
m.reply('🧠 *TES INGATAN*\n\nIngat angka ini: *' + n + '*\n\nLalu ketik di chat memori! (Sulit kan 😄)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tesingatan', 'memory']
export default handler
