let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🕌 *RUKUN ISLAM*', '', '1. Syahadat', '2. Sholat 5 waktu', '3. Zakat', '4. Puasa Ramadhan', '5. Haji (bila mampu)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['rukunislam']
export default handler
