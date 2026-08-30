let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL YouTube!\nContoh: .ytv url')
    const { scrapYt } = await import('../../lib/apis.js')
    const r = await scrapYt(text)
    const url = r?.link?.download || r?.result?.link || r?.data?.url || (typeof r === 'string' && r) || null
    if (!url) return m.reply('❌ Link video tidak ditemukan, coba lagi.')
    await conn.sendMessage(m.chat, { video: { url }, caption: '🎬 *YouTube Video*' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ytv', 'ytvideo', 'youtube']
export default handler
