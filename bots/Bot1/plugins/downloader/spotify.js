let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Link track Spotify tidak valid!\nContoh: .spotify https://open.spotify.com/track/xxx')
    m.reply(['🎵 *Spotify Download*', '', 'Link: ' + text, '', '⚠️ Lebih stabil pakai .play nama lagu'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['spotify', 'spotdl']
export default handler
