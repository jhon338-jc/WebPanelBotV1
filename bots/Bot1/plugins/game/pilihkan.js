let handler = async (m, { conn, text, args }) => {
try {
    if (args.length < 2) return m.reply('Contoh: .pilihkan makan nasi makan bakar')
m.reply('✅ Bot pilih: *' + args[Math.floor(Math.random() * args.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['pilihkan', 'chooser']
export default handler
