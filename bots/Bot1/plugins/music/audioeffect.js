let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🎚️ *AUDIO FX*', '', 'Ketik: .slowed lagu | .nightcore lagu', 'atau kirim audio untuk diproses.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['audiofx', 'efekaudio']
export default handler
