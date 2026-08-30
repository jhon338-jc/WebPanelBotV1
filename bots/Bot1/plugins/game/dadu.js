let handler = async (m, { conn, text, args }) => {
try {
    const h = Math.floor(Math.random() * 6) + 1
m.reply(['🎲 *DADU*', '', 'Hasil: *' + h + '*'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['dadu', 'roll']
export default handler
