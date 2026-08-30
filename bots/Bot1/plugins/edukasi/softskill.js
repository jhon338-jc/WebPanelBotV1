let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🤝 *SOFTSKILL*', '', 'Komunikasi, kerja tim, problem solving, manajemen waktu, adaptasi.', '', 'Rekrut sering nilai ini lebih dari IPK!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['softskill', 'softskillinfo']
export default handler
