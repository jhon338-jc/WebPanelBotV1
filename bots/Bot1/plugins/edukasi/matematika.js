let handler = async (m, { conn, text, args }) => {
try {
    const a = Math.floor(Math.random() * 90) + 10, b = Math.floor(Math.random() * 90) + 10
m.reply(['🧮 *LATIHAN MTK*', '', a + ' + ' + b + ' = ???', '', 'Jawaban: *' + (a + b) + '* (jangan dilihat dulu 😄)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['matematika', 'mtk']
export default handler
