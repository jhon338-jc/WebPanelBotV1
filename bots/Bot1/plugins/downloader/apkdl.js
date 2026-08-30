let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Nama aplikasi?\nContoh: .apk whatsapp')
    m.reply('📲 *Download APK*\n\n' + text + '\n\nCari via store saat bot terkoneksi.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['apkdl', 'apk', 'downloadapk']
export default handler
