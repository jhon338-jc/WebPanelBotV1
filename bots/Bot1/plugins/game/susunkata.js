let handler = async (m, { conn, text, args }) => {
try {
    const a = [['J-N-N-S','JENJANG'],['B-R-A-H-D-M-?','HADITS']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🔤 *SUSUN KATA*\n\nHuruf: ' + q[0] + '\nJawaban: ' + q[1])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['susunkata']
export default handler
