let handler = async (m, { conn, text, args }) => {
try {
    if (args.length < 2) return m.reply('Contoh: .ngerand 1 100')
const min = parseInt(args[0]), max = parseInt(args[1])
if (isNaN(min) || isNaN(max)) return m.reply('Contoh: .ngerand 1 100')
m.reply('🎲 Angka ' + min + '-' + max + ': *' + (Math.floor(Math.random() * (max - min + 1)) + min) + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ngerand', 'angka']
export default handler
