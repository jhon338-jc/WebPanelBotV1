let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL Instagram story!\nContoh: .igstory url')
    const { scrapIg } = await import('../../lib/apis.js')
    const r = await scrapIg(text)
    if (!r?.list) return m.reply('❌ Story tidak ditemukan.')
    for (const item of r.list) {
        const u = item?.download_url || item?.thumbnail || null
        if (u) await conn.sendMessage(m.chat, { image: { url: u } }, { quoted: m })
    }
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['igstory', 'igs']
export default handler
