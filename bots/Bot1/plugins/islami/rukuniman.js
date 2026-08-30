let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🤲 *RUKUN IMAN*', '', '1. Iman kepada Allah', '2. Iman kepada Malaikat', '3. Iman kepada Kitab Allah', '4. Iman kepada Rasul', '5. Iman kepada Hari Akhir', '6. Iman kepada Qada & Qadar'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['rukuniman']
export default handler
