let handler = async (m, { conn, text, args }) => {
try {
    const a = [['7 x 8 = ?', '56'],['144 / 12 = ?', '12'],['10^2 = ?', '100']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🧮 *KUIS MTK*\n\n' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kuismtk']
export default handler
