let handler = async (m, { conn, text, args }) => {
try {
    
    const { fetchJson, getBuffer } = await import('../../lib/apis.js')
    const j = await fetchJson('https://dog.ceo/api/breeds/image/random')
    const buffer = await getBuffer(j.message)
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['anjing', 'dog']
export default handler
