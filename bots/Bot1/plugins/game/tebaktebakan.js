let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Apa yang naik dan turun tapi tetap di tempat?', 'Tangganya'],['Bis apa yang paling tersakiti?', 'Bisikan'],['Kalau dipegang hidup, dilepas mati?', 'Bernapas']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🤔 *TEBAK-TEBAKAN*\n\n' + q[0] + '\n\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebaktebakan']
export default handler
