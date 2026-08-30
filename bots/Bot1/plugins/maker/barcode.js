let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .barcode 123456789')
    const { getBuffer } = await import('../../lib/apis.js')
    const buffer = await getBuffer('https://barcodeapi.org/api/128/' + encodeURIComponent(text))
    await conn.sendMessage(m.chat, { image: buffer, caption: '🔲 Barcode: ' + text }, { quoted: m })
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['barcode', 'bar']
export default handler
