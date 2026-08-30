let handler = async (m, { conn, text, args }) => {
try {
    const a = [['🍎','Apel'],['🥭','Mangga'],['🍌','Pisang'],['🥥','Kelapa']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🍎 *TEBAK BUAH*\n\nEmoji: ' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebakbuah']
export default handler
