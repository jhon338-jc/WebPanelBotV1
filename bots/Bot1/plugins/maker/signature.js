let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .signature Jhon')
m.reply('✍️ *TTD: ' + text + '*\n\n(Simulasi, pakai editor gambar untuk asli)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['signature', 'ttd']
export default handler
