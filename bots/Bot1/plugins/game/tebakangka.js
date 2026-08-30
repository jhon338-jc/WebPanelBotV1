let handler = async (m, { conn, text, args }) => {
try {
    if (!args[0]) return m.reply('Tebak angka 1-10: .guess 5')
const target = Math.floor(Math.random() * 10) + 1
const tebak = parseInt(args[0])
if (isNaN(tebak)) return m.reply('Angka saja ya!')
if (tebak === target) return m.reply('🎉 *BENAR!* Angkanya ' + target)
m.reply('❌ Salah. Angkanya *' + target + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebakangka', 'guess']
export default handler
