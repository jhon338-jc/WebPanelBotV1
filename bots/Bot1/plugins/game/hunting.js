let handler = async (m, { conn, text, args }) => {
try {
    const a = ['🦌 Rusa','🐗 Babi hutan','🦅 Elang','🐇 Kelinci','🌲 (ga ada apa-apa)']
m.reply('🏹 *BERBURU*\n\nDapat: *' + a[Math.floor(Math.random() * a.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['hunting', 'berburu']
export default handler
