let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Ibu kota Jepang?', 'Tokyo'],['Benua terbesar?', 'Asia'],['Laut terluas?', 'Samudra Pasifik']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🌏 *KUIS IPS*\n\n' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kuisips']
export default handler
