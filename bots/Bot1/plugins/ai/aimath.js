let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan pertanyaan!\n\nContoh: .aimath halo')
    const { aiChat } = await import('../../lib/apis.js')
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    const reply = await aiChat('Kamu ahli matematika. Jawab dengan langkah: ' + text)
    m.reply('🤖 *AI*\n\n' + reply)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['aimath']
export default handler
