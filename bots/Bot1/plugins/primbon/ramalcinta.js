let handler = async (m, { conn, text, args }) => {
try {
    if (args.length < 2) return m.reply('Contoh: .ramalcinta A B')
const p = Math.floor(Math.random() * 101)
m.reply('❤️ *RAMAL CINTA*\n\n' + args[0] + ' → ' + args[1] + '\nKadar cinta: *' + p + '%*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramalcinta']
export default handler
