let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🤲 *TASBIH*', '', 'Masbaha: Subhanallah', 'Tahmida: Alhamdulillah', 'Takbira: Allahu Akbar', 'Tahlila: Laa ilaaha illallah', '', 'Dzikir murah tapi berat pahalanya.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tassbih', 'tasbih']
export default handler
