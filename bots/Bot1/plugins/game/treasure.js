let handler = async (m, { conn, text, args }) => {
try {
    const hadiah = ['💰 100k','🎁 Stiker eksklusif','⚡ 1x fitur premium','🍬 Permen virtual']
const p = hadiah[Math.floor(Math.random() * hadiah.length)]
m.reply('🗝️ *HUNTING HARTA*\n\nKamu membuka peti misterius...\n\nDapat: *' + p + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['treasure', 'treasurehunt']
export default handler
