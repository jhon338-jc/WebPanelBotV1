let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🧬 *BIOLOGI*', '', 'Sel = unit terkecil kehidupan', 'Fotosintesis: 6CO2 + 6H2O → C6H12O6 + 6O2', 'DNA = materi genetik', 'Mitokondria = pusat energi sel'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['biologi']
export default handler
