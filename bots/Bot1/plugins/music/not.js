let handler = async (m, { conn, text, args }) => {
try {
    m.reply('🎼 *NOT ANGKA*\n\nDo=1 Re=2 Mi=3 Fa=4 Sol=5 La=6 Si=7\n\nContoh not lagu balonku: 1 7 1 2 3 4 4 ...')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['not', 'nada']
export default handler
