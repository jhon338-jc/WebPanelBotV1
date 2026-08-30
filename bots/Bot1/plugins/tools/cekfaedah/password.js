let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Panjang password? Contocoh: .password 12')
    const n = Math.min(32, Math.max(8, parseInt(text) || 12))
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
    let p = ''
    for (let i = 0; i < n; i++) p += chars[Math.floor(Math.random() * chars.length)]
    m.reply('🔑 *Password ' + n + ' karakter*\n\n' + p)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['password', 'pw', 'randompassword']
export default handler
