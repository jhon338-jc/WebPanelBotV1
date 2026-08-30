let handler = async (m, { conn, text, args }) => {
try {
    
    const { getBuffer } = await import('../../lib/apis.js')
    const buffer = await getBuffer('https://api.waifu.pics/sfw/waifu')
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['waifu']
export default handler
