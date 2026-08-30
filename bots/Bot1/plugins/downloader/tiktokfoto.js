let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL TikTok!')
    const { scrapTiktok } = await import('../../lib/apis.js')
    const r = await scrapTiktok(text)
    if (!r?.author) return m.reply('❌ Foto tidak ditemukan.')
    m.reply('🧑 *TikTok by*: ' + r.author)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tiktokfoto', 'ttfoto', 'tiktokpic']
export default handler
