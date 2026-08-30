let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Berapa rukun islam?', '5'],['Rukun iman ada?', '6'],['Kitab umat islam?', 'Al-Quran']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🕌 *KUIS AGAMA*\n\n' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kuisagama']
export default handler
