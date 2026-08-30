let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Encode/decode: .base64 hello')
    if (args[0] === 'decode') {
        const s = text.split(' ').slice(1).join(' ')
        return m.reply('🔓 *Decode*\n\n' + Buffer.from(s, 'base64').toString('utf-8'))
    }
    m.reply('🔐 *Encode*\n\n' + Buffer.from(text).toString('base64'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['base64', 'b64']
export default handler
