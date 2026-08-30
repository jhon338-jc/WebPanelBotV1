let handler = async (m, { conn, text, args }) => {
try {
    
    const { getBuffer } = await import('../../lib/apis.js')
    const buffer = await getBuffer('https://picsum.photos/600/600')
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['randomfoto', 'fotoacak']
export default handler
