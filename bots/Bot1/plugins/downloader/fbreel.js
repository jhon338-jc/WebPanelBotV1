let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL Facebook!\nContoh: .fbr url')
    const { scrapFb } = await import('../../lib/apis.js')
    const r = await scrapFb(text)
    if (!r?.list?.[0]?.download_url) return m.reply('❌ Video FB tidak ditemukan.')
    await conn.sendMessage(m.chat, { video: { url: r.list[0].download_url }, caption: '📘 *FB Video*' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['fbreel', 'fbr']
export default handler
