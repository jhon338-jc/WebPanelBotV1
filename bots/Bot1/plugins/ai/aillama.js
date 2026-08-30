let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan pertanyaan!\n\nContoh: .aillama halo')
    const { aiChat } = await import('../../lib/apis.js')
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    const reply = await aiChat('Kamu LLaMA, jawab santai gaul: ' + text)
    m.reply('🤖 *AI*\n\n' + reply)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['aillama']
export default handler
