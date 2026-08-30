let handler = async (m, { conn, text, args }) => {
try {
    const a = ['😀','😂','😍','🤩','🤔','😎','🥳','😴','🤡','👻','🐱','🐶','🦄','🍕','⚽','🎮']
m.reply('🎲 *EMOJI MIX*\n\n' + a[Math.floor(Math.random()*a.length)] + ' + ' + a[Math.floor(Math.random()*a.length)] + ' = ?\n\n(Gabungkan via sticker maker)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['emojimix', 'mixemoji']
export default handler
