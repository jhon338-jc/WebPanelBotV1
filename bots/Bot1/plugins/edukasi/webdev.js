let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🌐 *WEB DEV*', '', 'HTML = struktur', 'CSS = gaya', 'JS = perilaku', 'Pakai semantic tag + responsive + aksesibilitas.'] .join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['webdev', 'tipsweb']
export default handler
