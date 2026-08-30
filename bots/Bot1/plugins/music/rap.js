let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🎤 *FREESTYLE GENERATOR*', '', 'Ketik: .rap tema', 'Lalu bot bikin kalimat rap singkat!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['rap', 'freestyle']
export default handler
