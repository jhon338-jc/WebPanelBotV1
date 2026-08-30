let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Nama planet ke-5?', 'Jupiter'],['Proses fotosintesis menghasilkan?', 'Oksigen'],['Satuan gaya?', 'Newton']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🔬 *KUIS IPA*\n\n' + q[0] + '\nJawaban: *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kuisipa']
export default handler
