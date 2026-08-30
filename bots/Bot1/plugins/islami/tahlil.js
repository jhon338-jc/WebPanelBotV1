let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['📿 *TAHLIL SINGKAT*', '', 'Laa ilaaha illallah (3x)', 'Allahu Akbar kabiira walhamdulillahi katsiira...', 'Laa ilaaha illallah wahdahu laa syariika lah...', 'Laa ilaaha illalllah wa shallallahu alaa sayyidina Muhammad...'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tahlil']
export default handler
