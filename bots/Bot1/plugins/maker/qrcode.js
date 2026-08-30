let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .qrcode https://wa.me/62xxx')
    const { getBuffer } = await import('../../lib/apis.js')
    const buffer = await getBuffer('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(text))
    await conn.sendMessage(m.chat, { image: buffer, caption: '🔳 QR: ' + text }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['qrcode', 'qr']
export default handler
