let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🔮 *PRIMBON*', '', 'Ramalan seru-seruan:', '• .ramaljodoh (2 nama)', '• .ramalcinta', '• .ramalkarir', '• .ramalrezeki', '• .ramalnasib', '• .ramaltanggal', '• .weton (tanggal)', '• .artimimpi (kata kunci)', '', 'Ingat, 100% untuk hiburan! 😄'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['primbon']
export default handler
