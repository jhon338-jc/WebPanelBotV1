let handler = async (m, { conn, text, args }) => {
try {
    if (args.length < 2) return m.reply('Contoh: .ramaljodoh Andi Sari')
const p = Math.floor(Math.random() * 101)
m.reply(['💘 *RAMAL JODOH*', '', args[0] + ' & ' + args[1], 'Kecocokan: *' + p + '%*', '', p > 75 ? '⭐ Sangat serasi!' : p > 50 ? '💫 Lumayan cocok' : '💧 Perlu usaha ekstra'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramaljodoh']
export default handler
