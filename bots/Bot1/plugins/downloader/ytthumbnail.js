let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL YouTube!')
    const { ytThumb } = await import('../../lib/apis.js')
    const url = ytThumb(text)
    await conn.sendMessage(m.chat, { image: { url }, caption: '🖼️ *Thumbnail YouTube*' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ytthumbnail', 'ythumb', 'ytthumb']
export default handler
