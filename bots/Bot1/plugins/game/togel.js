let handler = async (m, { conn, text, args }) => {
try {
    const d = n => String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0')
m.reply(['🎰 *TOGEL*', '', '2D: ' + d(2), '3D: ' + d(3), '4D: ' + d(4), '', '*Semoga hoki!* (Investasi nonlegal 😄)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['togel', 'tgl']
export default handler
