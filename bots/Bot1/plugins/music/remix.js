let handler = async (m, { conn, text, args }) => {
try {
    m.reply('🎧 *REMAKE/REMIX*\n\nRemix lagu butuh file audio.\nKirim audio lalu .toimg? tidak, bukan itu. Coba .slowed 😄')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['remix']
export default handler
