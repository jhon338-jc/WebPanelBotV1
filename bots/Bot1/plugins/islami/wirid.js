let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['📿 *WIRID SETELAH SHOLAT*', '', '1. Astaghfirullah (3x)', '2. Allahumma antas salam wa minkas salam', '3. Ayat Kursi (1x)', '4. Tasbih-Tahmid-Takbir (33x)', '5. Doa sesuai hajat'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['wirid']
export default handler
