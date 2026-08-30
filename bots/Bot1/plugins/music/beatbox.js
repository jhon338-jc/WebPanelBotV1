let handler = async (m, { conn, text, args }) => {
try {
    m.reply('🗣️ *BEATBOX BOT*\n\nBoots-the-boots-Ka-chika... (kita gatau cara beatbox 😄)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['beatbox']
export default handler
