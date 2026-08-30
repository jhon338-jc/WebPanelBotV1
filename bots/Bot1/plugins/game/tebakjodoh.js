let handler = async (m, { conn, text, args }) => {
try {
    if (args.length < 2) return m.reply('Contoh: .tebakjodoh Andi Sari')
const p = Math.floor(Math.random() * 101)
m.reply('💘 *KECOCoKAN JODOH*\n\n' + args[0] + ' & ' + args[1] + '\nTingkat kecocokan: *' + p + '%*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebakjodoh']
export default handler
