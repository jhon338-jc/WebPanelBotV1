let handler = async (m, { conn, text, args }) => {
try {
    const a = ['🍀 Hoki','😓 Zonk','🎁 Hadiah','💖 Cinta','🔥 Panas']
m.reply('🎡 *RODA FORTUNI*\n\nBerputar...\n\nBerhenti di: *' + a[Math.floor(Math.random() * a.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['spin', 'roda']
export default handler
