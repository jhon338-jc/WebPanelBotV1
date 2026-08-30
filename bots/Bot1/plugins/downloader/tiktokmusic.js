let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL TikTok!')
    const { scrapTiktok } = await import('../../lib/apis.js')
    const r = await scrapTiktok(text)
    if (!r?.audio) return m.reply('❌ Audio tidak ditemukan.')
    await conn.sendMessage(m.chat, { audio: { url: r.audio }, mimetype: 'audio/mp4' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tiktokmusic', 'ttmusic', 'tiktoklagu']
export default handler
