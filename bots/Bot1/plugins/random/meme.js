let handler = async (m, { conn, text, args }) => {
try {
    
    const { fetchJson, getBuffer } = await import('../../lib/apis.js')
    const j = await fetchJson('https://meme-api.com/gimme')
    const buffer = await getBuffer(j.url)
    await conn.sendMessage(m.chat, { image: buffer, caption: j.title }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['meme', 'memeindo']
export default handler
