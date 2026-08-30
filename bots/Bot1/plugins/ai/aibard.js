let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan pertanyaan!\n\nContoh: .aibard halo')
    const { aiChat } = await import('../../lib/apis.js')
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    const reply = await aiChat('Kamu Bard, beri insight kreatif: ' + text)
    m.reply('🤖 *AI*\n\n' + reply)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['aibard']
export default handler
