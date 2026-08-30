let handler = async (m, { conn, text, args }) => {
try {
    
    const { createHash } = await import('crypto')
    if (!text) return m.reply('Contoh: .hash halo')
    m.reply('🔒 *SHA-256*\n\n' + createHash('sha256').update(text).digest('hex'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['hash', 'sha256']
export default handler
