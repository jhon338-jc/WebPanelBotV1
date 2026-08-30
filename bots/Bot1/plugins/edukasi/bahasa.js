let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['📚 *TIPS BAHASA*', '', '1. Baca 1 artikel tiap hari', '2. Tonton film dengan subtitle', '3. Paksa diri bicara', '4. Catat kosakata baru', '', 'Konsisten itu kuncinya!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['bahasa', 'tipsbahasa']
export default handler
