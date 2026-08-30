let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['📐 *RUMUS DASAR*', '', 'Segitiga: L = ½ × a × t', 'Persegi: L = s²', 'Persegi panjang: L = p × l', 'Lingkaran: L = πr²', 'Tabung: V = πr²t', '', 'Ketik .kalkulator untuk hitung!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['rumus', 'formula']
export default handler
