let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Judul lagu?\nContoh: .play bilang cintaku')
    const { searchAudio } = await import('../../lib/apis.js')
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    const r = await searchAudio(text)
    const url = r?.download || r?.link || r?.audio || r?.source || r?.result?.[0]?.download || null
    if (!url) return m.reply('❌ Lagu tidak ditemukan / API offline.')
    await conn.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/mp3' }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['play', 'putar']
export default handler
