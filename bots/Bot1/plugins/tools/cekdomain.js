let handler = async (m, { conn, text, args }) => {
try {
    
    const d = (text || '').trim().toLowerCase()
    if (!/^[a-z0-9.-]+\\.[a-z]{2,}$/.test(d)) return m.reply('Format domain salah! Contoh: .cekdomain google.com')
    m.reply('🌐 *CEK DOMAIN*\n\n' + d + '\nStatus: *TERDAFTAR* (simulasi)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekdomain', 'domain']
export default handler
