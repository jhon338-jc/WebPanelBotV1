let handler = async (m, { conn, text, args }) => {
try {
    const a = ['⛏️ Batu biasa','💎 Berlian','🥇 Emas','🪨 Kerikil','🔩 Besi']
m.reply('⛏️ *MENAMBANG*\n\nDapat: *' + a[Math.floor(Math.random() * a.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['mining', 'tambang']
export default handler
