let handler = async (m, { conn, text, args }) => {
try {
    
    const { getBuffer } = await import('../../lib/apis.js')
    const buffer = await getBuffer('https://api.waifu.pics/sfw/megumin')
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['megumin']
export default handler
