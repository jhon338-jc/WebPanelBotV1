let handler = async (m, { conn, text, args }) => {
try {
    const a = [['🐘','Gajah'],['🐯','Harimau'],['🦒','Jerapah'],['🐍','Ular']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🐾 *TEBAK HEWAN*\n\nEmoji: ' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebakhewan']
export default handler
