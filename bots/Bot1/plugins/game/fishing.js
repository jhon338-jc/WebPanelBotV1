let handler = async (m, { conn, text, args }) => {
try {
    const a = ['🐟 Ikan mas','🐠 Ikan cupang','🦈 Hiu kecil','👟 Sepatu bekas','🌸 Rumput laut']
m.reply('🎣 *MEMANCING*\n\nDapat: *' + a[Math.floor(Math.random() * a.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['fishing', 'memancing']
export default handler
