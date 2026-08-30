let handler = async (m, { conn, text, args }) => {
try {
    
    const n = (text || '').replace(/\\D/g, '')
    if (n.length < 9) return m.reply('Masukkan nomor! Contoh: .cekwa 62812xxxx')
    m.reply('✅ https://wa.me/' + n + '\n\n(Dicek saat bot terhubung WA)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekwa', 'ceknomorwa']
export default handler
