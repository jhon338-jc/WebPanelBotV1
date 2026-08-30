let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL Instagram reels!\nContoh: .igreel url')
    const { scrapIg } = await import('../../lib/apis.js')
    const r = await scrapIg(text)
    const u = r?.list?.[0]?.download_url || null
    if (!u) return m.reply('❌ Reels tidak ditemukan.')
    await conn.sendMessage(m.chat, { video: { url: u }, caption: '📸 *IG Reels*' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['igreel', 'igr']
export default handler
